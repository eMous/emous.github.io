---
id: 2019-04-06-UseWebstormToWriteJekyll.md
author: Anon
layout: post
title: 使用Webstorm编写Jekyll
date: 2019/4/6
categories: 生产环境
tags: Webstorm Jekyll 
description: 其实大家都半斤八两，但是我还是更偏爱这家。
---


* content
{:toc}


<div style="text-align: center;"><img style="height:;width:100%;" alt="" title="" src="/image/2019/04/06/Snipaste_2019-04-06_21-52-54.png"></div>

## Webstorm

说到Webstorm，你会想到什么，是那个你分不清到底对应着哪个旗下软件的矢量Logo吗？如果我是你，我会很难回答这个问题。因为，我会想到PhpStorm，Pycharm，Clion甚至Android
Studio，可是这并不是这个问题我想给出的答案，因为我始终都没办法自然而然地想到**JetBrains**这个名字。可能是实在太难记，又或许是因为陷入了产品的光芒掩盖了品牌而产品间又几乎全是共性的矛盾之中。

对我而言，因为之前大多都是开发`php-cli`的缘故，再加上之后做过一段时间`Yii`的前后端工作，所以用Phpstorm应该是所有IDE里最多的。相比之下，Webstorm也是当前才接触没有多长时间，虽然让我感觉它各种方面<abbr
title="混乱的文件与（模板、补全）等功能的关联，插件功能和可编辑功能无法得到一致的表现。">欠缺</abbr>一点。但这并不能影响多少，相比之下JetBrains旗下的那股专注和克制仍然是让人无法拒绝的王牌。

如果把如今的Visual Studio比作大型车床，满窗口都是功能按钮各种语言一应俱全，但是庞大且繁杂，假死崩溃无法彻底删除是常有的事情；而VS
code，鉴于他有优秀的extension生态，姑且把它当作车床模型；最后JetBrains旗下的各IDE就是车床产出的各类刀具，它们比不上车床通用，但是对于自己方向上的问题恰好胜任而且绝不拖沓。


___


## 优点

面对Jekyll的相关任务，Webstorm相比于VS code有几个明显的优点。


**更全面的版本控制支持**

: 虽然它还是没有SourceTree那么优秀，比如没有`Git Flow`。但是
你可以在右下角，轻松的切换分支和IDE内的快捷键Commit和Push，单单这两点我就很心满意足了。

**更安全的关联文件变动提醒**

: Webstorm能人性化地探测并尽可能全地管理项目中地文件管理，哪怕是在文件中使用字符串关联的文件，在它被移除或更名之前，Webstorm都会把所有的关联文件列出让你确认。

**轻松配置、切换调试器**

: 毕竟VScode是编辑器出生，编译调试之类的功能不是自己的看家本领。然而Webstorm的定位本身就是Web开发IDE，这也就自然而然了，无需手动编写文件一切都是GUI实现。

**比VS Code Snippet功能更全的Live template**

: VS Code的Snippet是和文件类型强耦合的，意味着每个文件只能跑自己类型的Snippet。然而，Live template则完全不同，虽说Webstorm自己的File Types也是乱七八糟，自定义的File Types不如狗，只能沦为Live template的Others类。但是，在基本的功能上Live template是比Snippet强大且灵活的，**Webstorm提供Live template暴露给哪些语言（文件）类型的设置。** 这意味着，js文件可以使用twig[^1]类型的Live template，提供建议补全基本`Liquid`语句。

<div style="text-align: center;"><img style="height:;width:100%;" alt="" title="" src="/image/2019/04/06/Snipaste_2019-04-06_23-02-56.png"></div>

**Markdown Navigation Plugin配合Language Injection**

: Markdown Navigation是Webstorm下的Markdown增强插件，它能提供基本的Markdown功能。但是，他的Preview功能做的并不好，因为他无法识别基于项目相对路径的图片，而且自动换行功能有时候也很烦人（这个可以通过开启soft wrap解决），这些都可以通过同屏左右两侧浏览器预览-写作实现。但是他配合Webstorm的Language Injection可以让Html,Css,Javascript代码在md文件下编写变得无懈可击(比如使用img标签的时候，在其内部可以自动代码建议)。

## 配置

**给newpost配置Live Template**

: 加在`Markdown`组中，暴露给markdown文件使用，名为`.newpost`:其中`$fileName$`为已定义变量，`$date$`为日期函数值。

```yaml
---
id: $fileName$
author: Anon
layout: post
title: $title$
date: $date$
categories: $categories$
tags: $tags$
description: $description$
---


* content
{:toc}



```
    
**给img配置Live Template**

:   加在`Markdown`组中，暴露给markdown文件使用，名为`.img`,相比于普通的Markdown Image多了居中功能。

```yml
<div style="text-align: center;"><img style="height:$height$;width:$width$;" alt="$alt$" title="$title$" src="$src$"></div>
```

**开放Twig Live Template给js和css**

:   当编辑主题或是调试功能代码的时候，需要在Javascript或CSS文件中用到Liquid，这时候这个功能就会很有用。

<div style="text-align: center;"><img style="height:;width:100%;" alt="" title="" src="/image/2019/04/06/Snipaste_2019-04-07_01-06-13.png"></div>


## 页面调试

同样的，在页面调试方面Webstorm也有很强劲的表现。配合名为`JetBrain IDE Support Options`的Chrome插件，可以实现在未给Chrome配置Source Map的情况下完成热刷新。

<div style="text-align: center;"><img style="height:;width:100%;" alt="" title="" src="/image/2019/04/06/Snipaste_2019-04-07_01-24-37.png"></div>


### 专属调试技巧

在Webstorm中你甚至可以直接在项目目录的Javascript文件中打断点，他一样会Debugger住，然后让你修改，（我估计这只是单纯检查文件名造成的Bug），哪怕这是一个满是Liquid的文件（如果是这种情况它会断到最后一行）。

## 注意事项

* 如果你下载了Twig插件，你可能会发现在.Twig的文本中竟然没有任何补全信息。而且你在设置中找不到任何相关的信息，然而其他的所有文件（其实也并不是）都有补全，除了纯Text文件。这个时候，你或需要怀疑它的插件有Bug从而让系统误认为是Text文件了，其实这并不是这样的，因为他是静态模板文件，这就意味着文件中的`标签`外区域是大量的纯文本输出内容，因此不适宜提供代码提示，你可以手动唤醒他们`Ctrl + J`或者`Ctrl + Space`。至于为什么可以通过插件做这种拒绝弹出提示的操作，而在设置中无法做到，就不得而知了，所以我觉得Webstorm其实也挺混乱的。

[^1]: Webstorm插件,有基本的Liquid语法高亮。
