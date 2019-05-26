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
CoordMode, Mouse, Screen 
x := 250
y := 350


array := ["767","976","483","153"] 
QQ_account_count := array.Length()

loop,%QQ_account_count%{
	Run C:\Program Files (x86)\Tencent\TIM\Bin\QQScLauncher.exe
}

loop{
	WinGet, list_tim, List  , TIM	
	if list_tim is space
		list_tim := 0
	list_tim += 0	
}until list_tim = QQ_account_count

loop, %QQ_account_count%{
	this_ID := list_tim%A_Index%
	winmove,ahk_id %this_ID%,,0,0
	winactivate, ahk_id %this_ID%
	mousemove,x,y
	Click,2
	Send ,% array[A_Index]
	Send, {Tab}{Enter}
	sleep,1300
}

this_ID := list_tim%QQ_account_count%
Loop{
	IfWinNotExist, ahk_id %this_ID%
		Break
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




