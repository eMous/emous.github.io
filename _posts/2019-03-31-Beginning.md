---
id: kkuErVeJTCfn
layout: post
title: 使用Jekyll创建Github Page博客
date: 2019-03-31
categories: Jeykll
tags: Liquid RSS Gem Jeykll YAML
description: 万事开头难，这里记录了本站是如何被搭建起来的。
showDemo: true
mathjax: true
---


* content
{:toc}


<!-- 这是我的第一个代码显示脚本 -- <script>demo_js.EmbedDemo("89798dasoid")</script> -->

<center><img alt title src="/image/2019-03-31/building_website.svg"></center>

## 这是一个开始

由于[Blogger平台](https://caihuashuai.blogspot.com/)对于`Markdown`以及相关的代码显示功能没有原生的支持，所以我决定自建站点用于记录我的计算机学习经历。

再者，将类似于WordPress之类的博客系统在VPS或Cloud上部署会不可避免地随着时间的增长增大相关的维护成本——尤其是**数据安全**以及**站点的可访问性**相关的维护。所以就有了这里，部署在Github Page上的基于Jekyll的静态博客。

我将会在这里记录我所有的IT大方向的学习经历，包括但不限于:

* 对学习方法本身的探讨
* 各端软件开发相关技术
* IT范畴内相关原理的科普向解释
* 与查错、纠错相关的记录与探讨
* 程序语言本身的探讨
* 科技生活类的内容
    * 操作系统下基于已有程序或自实现的各种问题的自动化方案
    * 与实物或动手操作相关的科技产品或方案探讨
___

## Why Github Page + Jekyll

其实我之前有尝试使用过多种博客系统来做技术博客，包括WordPress、博客园、Blogger、Hexo(on Github Page)。它们都或多或少地各种存在先天的缺陷，使得我无法**花尽可能少的精力到博客本身维护，花尽可能多的经历到博客内容的创作**。

可以明确地对上述博客系统进行划分：

----------

|  | WordPress | 博客园 | Blogger |Hexo|Jekyll|
|----|----|----|----|----|----|
| <center>需要维护站点</center> | <center style="color:red">✔</center> | <center style="color:green">✖</center> | <center style="color:green">✖</center> | <center style="color:green">✖</center> | <center style="color:green">✖</center> |
| <center>需要科学上网</center> | <center style="color:green">✖</center> | <center style="color:green">✖</center> | <center style="color:red">✔</center> | <center style="color:green">✖</center> |<center style="color:green">✖</center> |
| <center>全样式自定义</center> | <center style="color:green">✔</center> | <center style="color:red">✖</center> | <center style="color:red">✖</center> | <center style="color:green">✔</center> |<center style="color:green">✔</center> |
| <center><span title="广告、社交关系等" style="text-decoration:underline;">潜在信息侵入</span></center> | <center style="color:green">✖</center> | <center style="color:red">✔</center> | <center style="color:green">✖</center> | <center style="color:green">✖</center> | <center style="color:green">✖</center> |
| <center><span title="Github Page支持自动生成静态页面" style="text-decoration:underline;">页面自动生成</span></center> |  | |  | <center style="color:red">✖</center> |<center style="color:green">✔</center> |
| <center>站内编辑博客</center> | <center style="color:green">✔</center> | <center style="color:green">✔</center> | <center style="color:green">✔</center> | <center style="color:red">✖</center> | <center style="color:red">✖</center> |

----------

对我来说，最重要的是**是否需要维护站点**。数据安全是最重要的，哪怕这些数据都是裸着公布出来的，我也一点也不希望它被添加、篡改或删除；其次才是站点地可用性：宕机的可能性、如何配置安全策略从而避免被流量攻击等等，虽然这些大多都是一劳永逸的，但至少目前对于我来说我并没有在互联网上能够看到一个**对个人站点适用的，能避免绝大多数内部问题和外部攻击的策略与相关配置流程**，更何况像Bandwagon这类的VPS基本上“例行性”的宕机且**隐藏着各种复杂的内部用户条款——有一万个理由挂起你的服务器**。没有一个在职的维护人员配合，在这种需要随时应对问题的平台上进行内容创作与管理是一件极其费心的一件事。



## Jekyll

<center><img alt title src="/image/2019-03-31/logo-2x.png"></center>

使用Jekyll在Github Page上进行博客创作是Github官方推荐的Page的使用方式之一。

> If you use Jekyll as a static site generator with GitHub Pages, you benefit from more support with setting up, updating, and troubleshooting your site.


Github Page支持将用户提交的post自动处理成静态页面，这就意味着在你配置好Jekyll后，你只需要一个Git和一个文本编辑器<small>(~~而不需要本地的Jekyll环境，虽然它确实在预览页面上能提供很大的帮助~~)</small>就能随时地发布新的文章和管理从前发布的文章。

它基于Ruby编写，在项目的根目录用户可以通过配置文件`_config.yml`操控Jekyll的行为。总体上的**仅改变配置文件和编辑模板文件**你可以用Jekyll实现以下一些功能：

* 被动地使用页面模板导出页面:[layout](https://jekyllrb.com/docs/layouts/)
* 主动地使用页面模板导出页面:[include](https://jekyllrb.com/docs/includes/)
* 处理存于文件中的静态数据:[Data Files](https://jekyllrb.com/docs/datafiles/)
* 获取博客相关的元信息:[Variables](https://jekyllrb.com/docs/variables/)
* 在模板内部进行变量定义、流程控制、过滤器操作等从而控制导出的结果:[Liquid](https://jekyllrb.com/docs/liquid/)(模板语言)
* 分页、主题、插件等

### 安装

<small>~~如果你只想快捷地写博客你其实并不需要安装Jeykll，甚至你可以直接Git clone我的项目，再把我的/_posts下的文章删去，按照我的格式直接Push你自己的文章即可。~~ </small>

由于目前我是用的是Windows平台，故该文档只有Windows平台的参考。下面是我的操作陈述，如有冗余操作请在下方告诉我，谢谢。

#### 安装Ruby

进入[RubyInstaller下载页面](https://www.ruby-lang.org/en/downloads/)下载Installer **with Devkit**。

勾选toolchain。
<center><img alt title src="/image/2019-03-31/1554021299.jpg"></center>

安装完成后，Ruby将存放在C盘根目录，勾选“Run ridk install ……”并finishh，将弹出下图所示命令窗口，输入`3`并回车。
<center><img alt title src="/image/2019-03-31/Snipaste_2019-03-31_16-39-33.png"></center>

最后将提示: `Install MSYS2 and MINGW development toolchain succeeded`

#### 安装Jekyll 
进入任何一个你想安装博客的文件夹（这会是最终项目目录的父文件夹），`Shift+右键打开Powershell`输入:
```powershell
gem install jekyll bundler
```
Jekyll和bundler安装完毕以后，可以通过Jekyll创建一个带有`minima`主题的博客。

运行 `jeykll s`，再访问localhost:4000，你就能看到自己的博客了！
<center><img alt title src="/image/2019-03-31/Snipaste_2019-03-31_17-21-34.png"></center>

再之后，你只需要在_posts文件夹中添加形如`y-m-d-name`格式的文件，即可实时浏览到你的新文章了。


## 相关参考

* [原生Github Page**仅**支持的Jekyll插件](https://help.github.com/en/articles/configuring-jekyll-plugins)
* [Jekyll元变量属性](https://jekyllrb.com/docs/variables/)
* [Jekyll Ruby程序相关ref](https://www.rubydoc.info/github/mojombo/jekyll/Jekyll)
  

## 注意事项

1. **修改配置文件后重新运行`jekyll s`。**
2. **不要使用中文文件名。**
如果你有在Windows环境下预览博客的需求，请不要使用中文设置你的文件名。否则，URL中会带有中文并以UTF-8的编码形式回传给Jekyll，而它的服务端程序默认接受的是GB2312编码的数据，这时就会出现某个乱码位置无法被找到的错误。与其修改Jekyll程序的源码，我更推荐你不要使用中文给文件命名，毕竟文件名和文章的title不是必须相同的。
3. 如果你的bundle假死，可以尝试修改`Gemfile`文件的第一行:`source "https://gems.ruby-china.com/"`
默认情况下运行`jekyll s`会提供`导出静态文件(jekyll b)` + `为博客提供HTTP服务` + `（除了_site文件夹外的）文件变动自动重新生成（到_site文件夹内）`的功能。但是，如果修改了配置文件`_config.yml`就必须手动重新导出静态文件。
4. 文章提交后Github Page或许需要一会才会有变化，尤其是css。
5. 如果favicon变更了，发现页面的不论如何删除缓存都还是旧的，试试`Shift + Ctrl + R`。
6. _posts里的文章必须形如`y-m-d-name`，如`2019-3-31`，否则将无法被识别。
7. scss文件中如果出现UTF-8编码的中文无法通过本地的`jekyll b`。
8. 对于一个带有Front Matters的页面，如果它不在Collection中(包括include、post)。那么，其他页面通过Page.content获得它的内容将是Unrendered的并且无法手动Render。相反的，如果在Collection中，则可以获得到的是已经渲染过的。