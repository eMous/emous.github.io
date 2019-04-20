---
id: 2019-04-20-VMwareSoundIssue.md
author: Anon
layout: post
title: VMware下Linux无法播放声音的解决方案
date: 2019/4/20
categories: 解决问题
tags: VMware 
description: 解决以Windows为宿主机，VMware下的Linux无法播放声音和无法开机连接声卡的问题。
---


* content
{:toc}


## 问题背景

宿主机环境： Windows 10

VMware Workstation版本：VMware Workstation 12 、VMware Workstation 15

客户机环境： CentOS 7、 Ubuntu（版本未知）

具体问题表现情况：

> 1. 如果客户机是Windows10，一切声音表现正常。

> 2. 如果是上述客户及环境，则无法播放声音，在Linux系统中可以查看到相关声卡以及可以拖动相关音量条，但是就是没有声音播放。

> 3. 开机时右下角显示`A device ID has been used that is out of range for your system . . .`(已使用超出系统范围的设备ID ...)。


## 解决方案

1. 确保虚拟机是正在运行的 -> 直接在VMware Workstation(宿主机中) -> 虚拟机 -> 可移动设备 -> 声卡 -> 连接。

   这样当前的Linux就能播放声音了，但是缺点是它并不能在虚拟机开启的时候自动连接，哪怕勾选了相关选项。
   
2. 重复上述步骤。

   1. 在宿主机（Windows 10）右下角喇叭处右键 -> 声音。
   2. 录制选项卡。
   3. 打开`立体声混音`。
   
   这样就可以虚拟机开机时自动连接了。
   
___


## Reference

1. [VMware知识库](https://kb.vmware.com/s/article/2086551):但是这篇文章中说，设置默认主机声卡不需要打开立体声混音也能正常运作，可是在我的环境中不论如何都必须打开立体声混音。

