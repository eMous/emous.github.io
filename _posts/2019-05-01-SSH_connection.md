---
id: 2019-05-01-SSH_connection.md
author: Anon
layout: post
title: 重新认识SSH（二）
date: 2019/5/01
categories: SSH
tags: rfc 网络协议
description: 使用rfc解读SSH多路复用的原理。
---


* content
{:toc}

<div style="text-align: center;"><img style="height:400px;width:;" alt="" title="" src="http://ss.showyoumycode.com/StaticData/Blog/SSH/SSH_logo.png"></div>

在认证完毕后，客户端和服务端之间将使用SSH连接协议进行实际的任务操作，包括**开启交互式的登录会话**、**远程命令调用**、**TCP转发**、**X11转发**等。在传输层协议之上，启用连接协议的方式就是请求一个**service name**为**ssh-connection**服务。

___

## Channel机制

连接协议里的每个实际应用都是Channel，各方都有可能打开Channel，大量的Channel复用同一个Connection（我认为这里指的Connection应该是上文说的ssh-connection service）。一个Channel被双方用自己的数字标识，所以每端不同的数字可能指向的并不是相同的Channel。其他任何和Channel相关的消息都会包含对端的Channel标识。

```
sender:number1    ->    ()=========================()    <-    number2:receiver
```
Channel是被`流控`的，在被告知`窗口`可用之前没有数据可以在Channel里传输。

### （新建）打开一个Channel

当任意一端想要新建一个Channel时，它首先要给Channel分配一个本端的数字标识。然后将下面的消息发送给对端，这个消息包括了本（发送）端标识、初始化窗口大小等。

```
      byte      SSH_MSG_CHANNEL_OPEN
      string    channel type in US-ASCII only
      uint32    sender channel
      uint32    initial window size
      uint32    maximum packet size
      ....      channel type specific data follows
```
`channel type`是一个名字，符合SSH rfc命名规范，注册命名(`名称`)、扩展命名（`名称@域名`）；`sender channel`是本地的标识；`initial window size`则明确了**在不调整窗口大小的情况下，对方一共可以发送多少字节的数据给（这个消息的）发送者**；`maximum packet size`表示对方发给 **(这个消息的)发送者** 的单次的packet的最大值是多少。

**为什么要设置window size和maximum packet size**，我的理解是，有一些老旧的慢速设备IO带宽很低，所以如果大量的数据涌进来会导致缓冲区溢出。

对端收到消息后需要作出决定是否同意开启一个Channel，使用SSH_MSG_CHANNEL_OPEN_CONFIRMATION或SSH_MSG_CHANNEL_OPEN_FAILURE响应消息。

```
      byte      SSH_MSG_CHANNEL_OPEN_CONFIRMATION
      uint32    recipient channel
      uint32    sender channel
      uint32    initial window size
      uint32    maximum packet size
      ....      channel type specific data follows
```
其中`recipient channel`为**请求开启Channel端**的本地Channel标识，`sender channel`则为**当前消息发送方**的本地Channel标识，其他的数据都是描述**当前消息发送方**的。或者发送打开失败的消息SSH_MSG_CHANNEL_OPEN_FAILURE。

```
      byte      SSH_MSG_CHANNEL_OPEN_FAILURE
      uint32    recipient channel
      uint32    reason code
      string    description in ISO-10646 UTF-8 encoding [RFC3629]
      string    language tag [RFC3066]
```
比如**被请求开启Channel的一方**不支持标注的`channel type`，那它将简单地回应SSH_MSG_CHANNEL_OPEN_FAILURE。请求方则或许需要显示`description`给用户。下面是一些预定义的错误码：
```
            SSH_OPEN_ADMINISTRATIVELY_PROHIBITED          1
            SSH_OPEN_CONNECT_FAILED                       2
            SSH_OPEN_UNKNOWN_CHANNEL_TYPE                 3
            SSH_OPEN_RESOURCE_SHORTAGE                    4
```
错误码0x00000005 - 0xFDFFFFFF将按照`IETF CONSENSUS`的方式分配，0xFE000000 - 0xFFFFFFFF则留给个人使用。虽然IANA没有关于0xFE000000 - 0xFFFFFFFF的控制权，但是还是将他约定成2部分使用：

- 0xFE000000 - 0xFEFFFFFF被用在本地分配的Channel上，比如channel type为"example_session@example.com"(带有@符号)的Channel打开失败，那么错误码应该使用由IANA分配的部分（ 0x00000001 - 0xFDFFFFFF）或者本地分配相关的部分（0xFE000000 - 0xFEFFFFFF）。
    
    比如服务器不认识这个channel type，哪怕这个type是本地定义（包含@）的，也必须使用0x00000003错误码。然而如果，服务器认识这个错误码但是无法打开，则应该使用0xFE000000 - 0xFEFFFFFF其中的一个错误码。总的来说，参与者应该首先尝试使用IANA分配的错误码，然后在使用它们自定义的原因。

- 对于从0xFF开始的部分，不做限制或建议。在这个范围内的每一个值，都不被期望有任何实际操作交互性，本质上说它们是为实验目的而预留的。

### 传输数据

上文描述了窗口大小可以用来限制另一方发送的数据量，同时协议规定双方都可以通过下面的消息对窗口作出调整。

```
      byte      SSH_MSG_CHANNEL_WINDOW_ADJUST
      uint32    recipient channel
      uint32    bytes to add
```
接收方接收到这个消息以后，接收方可以根据这个给定的数增加窗口的大小，不论如何窗口最大为2^32-1字节。具体的数据，则通过下面的消息发送。
```
      byte      SSH_MSG_CHANNEL_DATA
      uint32    recipient channel
      string    data
```
单次可以发送数据的最大量取决于**对方当前窗口尺寸**和**对方允许接受的最大packet值**的最小值。对方每接受一个消息，窗口都会相应减少。规范期望实现可以对传输层packet size做出限制（任何关于接受数据的限制必须大于等于32768字节）。所以在连接层协议：

- 不准将可接受的maximum packet size设置成大于传输层能接受的最大值。

- 不准生成超过传输层能发送的最大值，哪怕对方的连接协议能接受这么大的packet。

同时，协议提供了一些传递额外数据（比如stderr数据）的方法。
```
      byte      SSH_MSG_CHANNEL_EXTENDED_DATA
      uint32    recipient channel
      uint32    data_type_code
      string    data
```
目前标准定义的data_type_code类型有：
```
             SSH_EXTENDED_DATA_STDERR               1
```
同时这个data_type_code的值的分发规定也与上文的channel type类似，分为IANA部分和私人使用部分。

### 关闭Channel

当任意一方不在往Channel发送更多数据的时候，它应该发送一个SSH_MSG_CHANNEL_EOF消息。

```
      byte      SSH_MSG_CHANNEL_EOF
      uint32    recipient channel
```

这个消息不会有明确的响应，但是它依旧应该被发送给对方不论对方是谁。需要注意的是，发送完这个消息后，Channel依旧是打开着的（只不过自己这一边不再发数据了），从另一个方向上还是可能过来更多的数据。这个消息并不会消耗窗口大小，即使窗口已经不可以。

当任意一方希望结束Channel时，则应该发送SSH_MSG_CHANNEL_CLOSE。另一方必须也发送SSH_MSG_CHANNEL_CLOSE，除非它已经发送过SSH_MSG_CHANNEL_CLOSE（网络延迟）了。当一方**既发送了又接收到**SSH_MSG_CHANNEL_CLOSE消息，Channel就被关闭了，相关的资源可以被清理，本地的Channel number可以在下次打开Channel的时候重用。任意一方都可以直接发送SSH_MSG_CHANNEL_CLOSE而不需要与现发送SSH_MSG_CHANNEL_EOF。

```
      byte      SSH_MSG_CHANNEL_CLOSE
      uint32    recipient channel
```
同样的，这个消息不需要消耗窗口大小。

### 明确Channel信息请求

许多的channel type包含关于该channel type的更详细的扩充设定。比如说，为一个交互session请求一个虚拟终端。所有的明确Channel信息请求都是如下格式。
```
      byte      SSH_MSG_CHANNEL_REQUEST
      uint32    recipient channel
      string    request type in US-ASCII characters only
      boolean   want reply
      ....      type-specific data follows
```
如果`want reply`被设置成FALSE，不会有响应被回复给请求端。否则，响应可能包括SSH_MSG_CHANNEL_SUCCESS、SSH_MSG_CHANNEL_FAILURE或者要求继续提供信息的消息。如果接收端不认识或不支持这个扩充的明细，则返回SSH_MSG_CHANNEL_FAILURE。

这个消息也不消耗窗口大小，`request type`是自定义的。

```
      byte      SSH_MSG_CHANNEL_SUCCESS
      uint32    recipient channel


      byte      SSH_MSG_CHANNEL_FAILURE
      uint32    recipient channel
```
上述两个消息也不消耗窗口大小。

## 交互Session

**一个Session就是一个远程的程序的执行**。这个程序或许是shell、应用程序、系统调用或者内建的子系统。它可能没有绑定到虚拟终端上，又或者有或没有涉及到X11转发。同时间，可以有多个Session正在被运行。

### 打开Session Channel

使用如下消息打开一个Session Channel，客户端应该拒绝来自服务端的打开Session Channel的请求以避免被攻击。
```
      byte      SSH_MSG_CHANNEL_OPEN
      string    "session"
      uint32    sender channel
      uint32    initial window size
      uint32    maximum packet size
```

### 请求一个虚拟终端

通过如下消息可以让服务器为Session分配一个虚拟终端，character/row的优先级相比于pixels更高，除非他们被设置成0。

```
      byte      SSH_MSG_CHANNEL_REQUEST
      uint32    recipient channel
      string    "pty-req"
      boolean   want_reply
      string    TERM environment variable value (e.g., vt100)
      uint32    terminal width, characters (e.g., 80)
      uint32    terminal height, rows (e.g., 24)
      uint32    terminal width, pixels (e.g., 640)
      uint32    terminal height, pixels (e.g., 480)
      string    encoded terminal modes
```
客户端应该拒绝来自服务端的虚拟终端明确信息请求以避免被攻击。

### X11转发

通过如下消息可以为Session请求X11转发。

```
      byte      SSH_MSG_CHANNEL_REQUEST
      uint32    recipient channel
      string    "x11-req"
      boolean   want reply
      boolean   single connection
      string    x11 authentication protocol
      string    x11 authentication cookie
      uint32    x11 screen number
```
协议推荐将`x11 authentication cookie`发送成一个虚假且随机的cookie，知道连接消息被接收后它将被检验并替换成真实的cookie。当session channel被关闭的时候，X11转发也应该停止，但是已经打开的转发不应该自动被关闭。如果`single connection`被设置为TRUE，那么只有一个连接被转发。

这个消息对应的操作是： 客户端向服务器发出请求，服务器在本地新建N个（如果single connection不为0）X11服务器（只是纯粹的监听6000+server自定义offset（openssh为10）的TCP端口，创建相应的DISPLAY环境变量）。


在remote session上执行`gedit &`时，`gedit`是符合X11协议的客户端，所以它会检测环境变量发现存在display，就和本地的6010端口建立连接。服务器的伪x11服务器socket侦测到连接就很向客户端发起SSH_MSG_CHANNEL_OPEN x11 Channel的请求。

```
      byte      SSH_MSG_CHANNEL_OPEN
      string    "x11"
      uint32    sender channel
      uint32    initial window size
      uint32    maximum packet size
      string    originator address (e.g., "192.168.7.38")
      uint32    originator port
```
客户端收到请求后再与本地的X11建立连接，这样一个X11转发的通道就完成了（我并没有在openssh的源码中发现客户端是如何使用originator address数据的）。

### 传递环境变量

在shell或command被开始时之后，或许有环境变量需要被传递过去。然而在特权程序里不受控制的设置环境变量是一个很有风险的事情，所以规范推荐实现维护一个允许被设置的环境变量列表或者只有当sshd丢弃权限后设置环境变量。

```
      byte      SSH_MSG_CHANNEL_REQUEST
      uint32    recipient channel
      string    "env"
      boolean   want reply
      string    variable name
      string    variable value
```

### 启动一个Shell或者一个命令

一旦一个Session被设置完毕，在远端就会有一个程序被启动。这个程序可以是一个Shell，也可以时一个应用程序或者是一个有着独立域名的子系统。下面的请求每个Channel（Session）只允许设置一个。

```
      byte      SSH_MSG_CHANNEL_REQUEST
      uint32    recipient channel
      string    "shell"
      boolean   want reply

      byte      SSH_MSG_CHANNEL_REQUEST
      uint32    recipient channel
      string    "exec"
      boolean   want reply
      string    command

      byte      SSH_MSG_CHANNEL_REQUEST
      uint32    recipient channel
      string    "subsystem"
      boolean   want reply
      string    subsystem name
```

### 窗口调整消息

当客户端的终端窗口大小被改变时，或许需要发送这个消息给服务器。

```
      byte      SSH_MSG_CHANNEL_REQUEST
      uint32    recipient channel
      string    "window-change"
      boolean   FALSE
      uint32    terminal width, columns
      uint32    terminal height, rows
      uint32    terminal width, pixels
      uint32    terminal height, pixels
```
这个消息没有响应。

### 本地流控

在很多系统中，这是否可行取决于伪终端是否使用`control-S/control-Q`进行流控。如果正在使用，那么在客户端就应该有一个流控的功能给服务端的响应提速，这还是取决于服务端设备的（系统）实现。下面的消息可以让服务器通知客户端是否可以提供流控的功能，如果可以的话客户端则可以使用`control-S/control-Q`进行流控。

```
      byte      SSH_MSG_CHANNEL_REQUEST
      uint32    recipient channel
      string    "xon-xoff"
      boolean   FALSE
      boolean   client can do
```
这个消息没有响应。

### 信号

一个信号可以被传输给远端的程序或服务使用下面的消息。有一些系统可能没有实现信号，所以那些系统下的服务端应该忽略这个消息。

```
      byte      SSH_MSG_CHANNEL_REQUEST
      uint32    recipient channel
      string    "signal"
      boolean   FALSE
      string    signal name (without the "SIG" prefix)
```
`signal name`在下面的预定义名称中有描述。

### 返回退出状态

当在远端的命令结束时，下面的消息可以用来传递其退出的状态码。发送或收到这个消息后Channel将被关闭。

```
      byte      SSH_MSG_CHANNEL_REQUEST
      uint32    recipient channel
      string    "exit-status"
      boolean   FALSE
      uint32    exit_status
```
同时远端的程序也可能因为一个信号而被迫关闭(`exit_statue` 为0的时候为正常关闭)，这个情况下下面的消息将被发送。

```
      byte      SSH_MSG_CHANNEL_REQUEST
      uint32    recipient channel
      string    "exit-signal"
      boolean   FALSE
      string    signal name (without the "SIG" prefix)
      boolean   core dumped
      string    error message in ISO-10646 UTF-8 encoding
      string    language tag [RFC3066]
```

## TCP/IP 端口转发

### 全局请求

协议规定了许多种可以影响远端全局而独立于任何Channel的请求，一个例子就是唯一个特定的端口请求TCP/IP转发。双方中的任意一方都有可能在任意时间发送全局请求，接收方必须做出合理的响应，其格式如下。

```
      byte      SSH_MSG_GLOBAL_REQUEST
      string    request name in US-ASCII only
      boolean   want reply
      ....      request-specific data follows
```
响应如下，通常不包含`response specific data`这一栏。
```
      byte      SSH_MSG_REQUEST_SUCCESS
      ....     response specific data
```
协议规定，SSH_MSG_GLOBAL_REQUESTS的响应顺序必须如其发送顺序一致。有明确指示Channel的请求消息才可以不按顺序发送。
### 请求端口转发

如果其中一方期望**一个发往对方端口的数据可以转发到本地的端口**，那么他可以发送如下的请求。

```
      byte      SSH_MSG_GLOBAL_REQUEST
      string    "tcpip-forward"
      boolean   want reply
      string    address to bind (e.g., "0.0.0.0")
      uint32    port number to bind
```
`address to bind`和`port number to bind`用来标明哪个具体的IP地址（或域名）和端口用于转发（另一端端开启对哪个IP和端口的监听并转发到本地），`address to bind`满足以下的语法规则。
- `""`表示接受所有的被SSH实现方支持的协议。
- `"0.0.0.0"`表示监听所有IPv4端口。
- `"::"`表示监听所有IPv6端口。
- `"localhost"`表示在回环网卡上监听所有被SSH实现支持的协议。
- `"127.0.0.1"`和`"::1"`分别表示监听IPv4和IPv6的回环网卡。

客户端应该拒绝这个消息，这个消息一般只允许客户端发送。同时如果客户端传递的`port number`是0，且它设置了`want reply`为TRUE，那么服务器应该分配下一个可用的`非权限端口`，并且在响应中告知客户端。
```
      byte     SSH_MSG_REQUEST_SUCCESS
      uint32   port that was bound on the server
```
端口转发可以被下面的消息取消，一个channel open请求可能会直到接收到该消息的响应后收到。这个消息只有客户端可以发送。
```
      byte      SSH_MSG_GLOBAL_REQUEST
      string    "cancel-tcpip-forward"
      boolean   want reply
      string    address_to_bind (e.g., "127.0.0.1")
      uint32    port number to bind
```

### TCP/IP转发Channel

当服务端被设置需要监听并转发的端口收到了外部的连接时，服务端将发送下面的消息请求客户端开启一个TCP/IP转发Channel。

```
      byte      SSH_MSG_CHANNEL_OPEN
      string    "forwarded-tcpip"
      uint32    sender channel
      uint32    initial window size
      uint32    maximum packet size
      string    address that was connected （外部连接到服务器监听地址的的IP地址）
      uint32    port that was connected 
      string    originator IP address (这个应该是服务端监听的地址)
      uint32    originator port
```
客户端应该比对是否向服务器请求了originator port的TCP/IP端口转发。

当客户端本地的TCP/IP转发端口接收到来自外部的连接（这个监听端口是客户端主动打开的）时，客户端发送如下消息给服务器转发这个TCP/IP数据。

```
      byte      SSH_MSG_CHANNEL_OPEN
      string    "direct-tcpip"
      uint32    sender channel
      uint32    initial window size
      uint32    maximum packet size
      string    host to connect
      uint32    port to connect
      string    originator IP address
      uint32    originator port
```
`host to connect`和`port to connect`表示服务端内部需要建立一个通往`host to connect`、`port to connect`的连接。`originator IP address`表示客户端监听到的连接发起于哪个外部IP地址、`originator port`表示客户端监听到的连接发起于哪个外部主机的端口。

转发Channel独立于Session存在，Session关闭并不意味着转发Channel也要被关闭。客户端应该拒绝`direct-tcpip`请求。

## 终端模式的编码

在请求一个终端的时候会用到终端模式的编码（`encoded terminal modes`），它们被编码进字节流里。这是为了他们可以方便地在不同环境间传输。字节流包括以字节为值地操作码构成地参数对。1-159的操作码时uint32类型的参数，160-255还未被定义，并且如果遇到它们应该停止解析。字节流被操作码`TTY_OP_END(0x00)`终止。

客户端应该尽可能的把它知道的模式操作码加入字节流中，而服务器对于它不知道的模式应该忽略。至少在用类POSIX 虚拟终端的系统间，会支持一些机器无关的特性。这个协议也能支持其他的系统，但是客户端或许需要补充一系列合理的参数数值这样服务器才能为伪终端提供合理的模式。具体预定义数值如下（为了可读性，将Byte写成了数字）：
```
          opcode  mnemonic       description
          ------  --------       -----------
          0     TTY_OP_END  Indicates end of options.
          1     VINTR       Interrupt character; 255 if none.  Similarly
                             for the other characters.  Not all of these
                             characters are supported on all systems.
          2     VQUIT       The quit character (sends SIGQUIT signal on
                             POSIX systems).
          3     VERASE      Erase the character to left of the cursor.
          4     VKILL       Kill the current input line.
          5     VEOF        End-of-file character (sends EOF from the
                             terminal).
          6     VEOL        End-of-line character in addition to
                             carriage return and/or linefeed.
          7     VEOL2       Additional end-of-line character.
          8     VSTART      Continues paused output (normally
                             control-Q).
          9     VSTOP       Pauses output (normally control-S).
          10    VSUSP       Suspends the current program.
          11    VDSUSP      Another suspend character.
                    12    VREPRINT    Reprints the current input line.
          13    VWERASE     Erases a word left of cursor.
          14    VLNEXT      Enter the next character typed literally,
                             even if it is a special character
          15    VFLUSH      Character to flush output.
          16    VSWTCH      Switch to a different shell layer.
          17    VSTATUS     Prints system status line (load, command,
                             pid, etc).
          18    VDISCARD    Toggles the flushing of terminal output.
          30    IGNPAR      The ignore parity flag.  The parameter
                             SHOULD be 0 if this flag is FALSE,
                             and 1 if it is TRUE.
          31    PARMRK      Mark parity and framing errors.
          32    INPCK       Enable checking of parity errors.
          33    ISTRIP      Strip 8th bit off characters.
          34    INLCR       Map NL into CR on input.
          35    IGNCR       Ignore CR on input.
          36    ICRNL       Map CR to NL on input.
          37    IUCLC       Translate uppercase characters to
                             lowercase.
          38    IXON        Enable output flow control.
          39    IXANY       Any char will restart after stop.
          40    IXOFF       Enable input flow control.
          41    IMAXBEL     Ring bell on input queue full.
          50    ISIG        Enable signals INTR, QUIT, [D]SUSP.
          51    ICANON      Canonicalize input lines.
          52    XCASE       Enable input and output of uppercase
                             characters by preceding their lowercase
                             equivalents with "\".
          53    ECHO        Enable echoing.
          54    ECHOE       Visually erase chars.
          55    ECHOK       Kill character discards current line.
          56    ECHONL      Echo NL even if ECHO is off.
          57    NOFLSH      Don't flush after interrupt.
          58    TOSTOP      Stop background jobs from output.
          59    IEXTEN      Enable extensions.
          60    ECHOCTL     Echo control characters as ^(Char).
          61    ECHOKE      Visual erase for line kill.
          62    PENDIN      Retype pending input.
          70    OPOST       Enable output processing.
          71    OLCUC       Convert lowercase to uppercase.
          72    ONLCR       Map NL to CR-NL.
          73    OCRNL       Translate carriage return to newline
                             (output).
          74    ONOCR       Translate newline to carriage
                             return-newline (output).
          75    ONLRET      Newline performs a carriage return
                             (output).
          90    CS7         7 bit mode.
          91    CS8         8 bit mode.
          92    PARENB      Parity enable.
          93    PARODD      Odd parity, else even.

          128 TTY_OP_ISPEED  Specifies the input baud rate in
                              bits per second.
          129 TTY_OP_OSPEED  Specifies the output baud rate in
                              bits per second.
```

## 预定义名称

### 连接协议Channel类型

```
         Channel type                  Reference
         ------------                  ---------
         session                       [SSH-CONNECT, Section 6.1]
         x11                           [SSH-CONNECT, Section 6.3.2]
         forwarded-tcpip               [SSH-CONNECT, Section 7.2]
         direct-tcpip                  [SSH-CONNECT, Section 7.2]
```

### 连接协议全局请求名
```
         Request type                  Reference
         ------------                  ---------
         tcpip-forward                 [SSH-CONNECT, Section 7.1]
         cancel-tcpip-forward          [SSH-CONNECT, Section 7.1]
```

### 连接协议Channel明细请求名
```
         Request type                  Reference
         ------------                  ---------
         pty-req                       [SSH-CONNECT, Section 6.2]
         x11-req                       [SSH-CONNECT, Section 6.3.1]
         env                           [SSH-CONNECT, Section 6.4]
         shell                         [SSH-CONNECT, Section 6.5]
         exec                          [SSH-CONNECT, Section 6.5]
         subsystem                     [SSH-CONNECT, Section 6.5]
         window-change                 [SSH-CONNECT, Section 6.7]
         xon-xoff                      [SSH-CONNECT, Section 6.8]
         signal                        [SSH-CONNECT, Section 6.9]
         exit-status                   [SSH-CONNECT, Section 6.10]
         exit-signal                   [SSH-CONNECT, Section 6.10]
```
### 连接协议子系统名

暂无

## Reference

1. [OpenSSH Specifications](https://www.openssh.com/specs.html)

    这是OpenSSH所展现的最直接的资料页面，但是有很多细节部分的规格与实现没有罗列。而且RFC文档错综复杂，有很多地方都引用不全必须靠“幸运”才能翻看到。

2. [The Secure Shell (SSH) Protocol Architecture](https://tools.ietf.org/html/rfc4251)

    SSH协议架构的rfc页面，它将SSH分为三部分，传输、认证和连接。

3. [The Secure Shell (SSH) Protocol Assigned Numbers](https://tools.ietf.org/html/rfc4250)

    规定协议中各种ID（宏）所使用的序号。

4. [The Secure Shell (SSH) Connection Protocol](https://tools.ietf.org/html/rfc4254)

    规定SSH连接协议。

5. [OpenSSH Portable](https://github.com/openssh/openssh-portable)

      OpenSSH的源码。