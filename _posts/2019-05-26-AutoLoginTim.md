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


* content
{:toc}

由于Tim只能自动登录一个账号，又或者设置最多3个关联账号（无法自动登录）。所以我决定自己实现多个Tim账号的自动登录。（使用Autohotkey）

___


## 预备
1. 记住你要登陆的所有QQ号的密码。（或者在下方脚本里自己设置账号和（按下Tab再输入密码）密码）。
2. 调试一下下方脚本的鼠标移动位置，确保它会停留在账号栏中。
3. 修改QQ号成为你自己账号的前缀。
4. 将脚本（或者快捷方式）移动到Startup文件夹。
    
    C:\Users\你的用户名\AppData\Roaming\Microsoft\Windows\Start Menu\Programs\Startup
    
## 脚本

<script src="https://gist.github.com/eMous/70df9702975595be8fa46e2761be2945.js"></script>


