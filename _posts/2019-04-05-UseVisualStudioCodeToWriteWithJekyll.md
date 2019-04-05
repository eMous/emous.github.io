---
id: 2EYszUNnYwXQ
layout: post
title: 使用VSCode编写Jekyll
date: 2019-04-05
categories: 生产环境
tags: VSCode Jekyll Chrome
description: 自动化这件事总是后知后觉的。
---


* content
{:toc}

<center><img style="height:400px;width:100%;" alt title src="/image/2019/04/05/make-up-brushes.svg"></center>

到今天，我才终于能体会到为什么[小甲鱼](https://fishc.com.cn/)总会在他的教程里告诫所有初学者使用[Notepad++](https://en.wikipedia.org/wiki/Notepad%2B%2B)进行编程。因为面对一个未知的事物，**如果你的第一反应就是寻找捷径，那这意味着你将缺失一大部分由试错构建起的对其的宏观的认知。** 当你有足够多的尝试，已把它的基本操作弄得明白后，才能对其构建起一个相对清晰的框架，对于之后发生问题可以才能有一个准确的描述。

这个试错的过程长短是因人而异的，至少对我来说，当我有意无意地察觉到我的问题解决过程存在模式之后。我便自然而然地想到工具，自动化方法，集成开发环境……

___

## 一开始我是如何做的？

最开始的时候，我使用的是[Sublime Text](https://en.wikipedia.org/wiki/Sublime_Text)编辑博客样式与博客内容，配合[Powershell](https://en.wikipedia.org/wiki/PowerShell)对Jekyll进行启停，通过Chrome浏览本地端地样式，最后使用[SourceTree](https://www.sourcetreeapp.com/)将Jekyll推到Github Page再最后预览一遍。

像这样:

<center><img alt title src="/image/2019/04/05/Snipaste_2019-04-05_11-25-40.png"></center>
<center><img alt title src="/image/2019/04/05/Snipaste_2019-04-05_11-27-18.png"></center>
<center><img alt title src="/image/2019/04/05/Snipaste_2019-04-05_11-28-03.png"></center>

现在回想起来确实是挺痛苦的回忆，特别是当时调试Feed的时候，一心想在每个单独的RSS post里增加样式以便他人在浏览时可以无需打开网站就看到相对美观的页面。然而，那些如[Feedly](https://feedly.com)之类能显示单独item description的网站又无法提供localhost的feed嗅探服务，所以只能如是依次地修改在推到Github Page再等待Feedly更新，极其痛苦。然而最后实验证明，**RSS里的内容如果有Style绝大多数是不会被解析的。** 

## 开始使用VS Code
因为我没有成为过专职的前端开发人员，所以我对VS Code其实也并不是太熟悉，下面的这些配置都是凭着操作和试错的模式得到的，也就是说**因为频繁的操作和出错，我才想到有没有某些功能或插件，恰巧大多数都有。**

#### 不再需要Powershell

使用VS Code将Jekyll目录打开后，编辑框下面的Terminal会自动打开一个Powershell并且进入当前目录。直接运行`jekyll s`，之后除非出现故障都无需理会。
<center><img alt title src="/image/2019/04/05/Snipaste_2019-04-05_11-43-50.png"></center>

#### 版本控制符号

和常用的IDE一样，如果打开的目录内有git仓库，VS Code也会通过git实时的呈现每个文件或文件夹版本变动的标志。<span style="color:green">绿色</span>是未追踪（新建），<span style="color:orange">黄色</span>是修改，<span style="color:red">红色</span>是删除。
<center><img alt title src="/image/2019/04/05/Snipaste_2019-04-05_11-50-20.png"></center>

#### 项目内快速文件名搜索

在打开的文件夹或工作区内，直接输入英文字母即可定位并筛选出文件夹。
<center><img alt title src="/image/2019/04/05/Snipaste_2019-04-05_11-57-13.png"></center>

#### 直接预览Markdown

配合`Markdown Preview Enhanced`插件，可以直接预览准备post的文件，美中不足的就是需要Jekyll模板编译的layout无法实时的预览。

### 开发与调试

甚至，当我在开发Jeykll-demos的时候都有尝试过使用VS Code作为主力编辑器。

#### 配置工作区

网络上关于VS Code工作区的知识很少，在这一步我折腾了不少的时间。

使用VS Code打开Jekyll文件夹，之后`File -> Save workspace as`，将创建一个工作区的配置文件用于记录工作区包含哪些文件夹以及相关的配置。

#### 开启Jekyll

打开工作区，执行`Jekyll s`。

#### 配置Debug

进入`Debug`页面(第四个，~~蜘蛛~~样式)，`Add config(你的工作区)`。

```json
{
    // Use IntelliSense to learn about possible attributes.
    // Hover to view descriptions of existing attributes.
    // For more information, visit: https://go.microsoft.com/fwlink/?linkid=830387
    "version": "0.2.0",
    "configurations": [
        {
            "type": "chrome",
            "request": "launch",
            "name": "Debug Jekyll",
            "url": "http://localhost:4000/",
            "webRoot": "${workspaceFolder}/_site",
        },
    ]
}
```
#### 开始调试

你可以直接在`_site/`下的`Html`和`Javascript`页面中设置断点和设置Watch，他将如期被断下。
<center><img alt title src="/image/2019/04/05/Snipaste_2019-04-05_12-16-09.png"></center>

配合甚至Chrome的`SourceMap`，你可以在无需刷新页面的情况下修改`CSS`和`js`。
<center><img alt title src="/image/2019/04/05/Snipaste_2019-04-05_12-28-38.png"></center>
<center><img alt title src="/image/2019/04/05/Snipaste_2019-04-05_12-28-57.png"></center>
<center><img alt title src="/image/2019/04/05/Snipaste_2019-04-05_12-32-00.png"></center>
绿色的部分圆点表示当前页面以及和文档中的文件Map起来，可以实时修改更新。

<span style="color:red">但是，由于Jekyll先天的缺陷，这个修改过的文件并不是模板文件而是`_site`下的文件。所以都是无效的，我曾因为这个失误五六小时小时的代码全部在一次模板编译后消失不见。</sapn>


综上，VS Code提供了很多先进且快捷的特性，尤其是在撰写内容的时候基本只需要一个软件就可以完成所有工作。但是，VSCode的Debug功能Chrome响应实在太慢，最后我还是不得不放弃并转用WebStorm处理开发任务。