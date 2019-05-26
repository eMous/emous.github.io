---
id: 2019-05-26-AutoLoginTim.md
author: Anon
layout: post
title: 自动批量登陆Tim
date: 2019/5/26
categories: 自动化 
tags: tools Autohotkey
description: 在Windows用户登陆时自动批量登陆多个Tim账号。
editor: Webstorm
mathjax: false
---

由于Tim只能自动登录一个账号，又或者设置最多3个关联账号（无法自动登录）。所以我决定自己实现多个Tim账号的自动登录。（使用Autohotkey）

* content
{:toc}

## 预备
1. 记住你要登陆的所有QQ号的密码。（或者在下方脚本里自己设置账号和（按下Tab再输入密码）密码）。
2. 调试一下下方脚本的鼠标移动位置，确保它会停留在账号栏中。
3. 修改QQ号成为你自己账号的前缀。
4. 将脚本（或者快捷方式）移动到Startup文件夹。
    
    C:\Users\你的用户名\AppData\Roaming\Microsoft\Windows\Start Menu\Programs\Startup
## 脚本
```
Sleep, 2000
Run C:\Program Files (x86)\Tencent\TIM\Bin\QQScLauncher.exe
WinWait, TIM
WinActivate, TIM
MouseMove,350,350
Click, 2
Click, 2
Click, 2
Click, 2
Send 7670{Tab}{Enter}


Run C:\Program Files (x86)\Tencent\TIM\Bin\QQScLauncher.exe
WinWait, TIM
Sleep,500
WinWaitActive, TIM
MouseMove,350,350
Click, 2
Click, 2
Click, 2
Click, 2
Send 9760{Tab}{Enter}

Run C:\Program Files (x86)\Tencent\TIM\Bin\QQScLauncher.exe
WinWait, TIM
Sleep,500
WinWaitActive, TIM
MouseMove,350,350
Click, 2
Click, 2
Click, 2
Click, 2
Send 4835{Tab}{Enter}


Run C:\Program Files (x86)\Tencent\TIM\Bin\QQScLauncher.exe
WinWait, TIM
Sleep,500
WinWaitActive, TIM
MouseMove,350,350
Click, 2
Click, 2
Click, 2
Click, 2
Send 1531{Tab}{Enter}

Sleep,1000
Loop{
	WinGet, OutPutVar, Count, TIM
	if (OutPutVar == 5){
		Break
	}
}
Loop {
	IfWinExist, TIM
	    WinClose,TIM
	else{
		Break
	}
}   
```

___




