---
id: jlEBaFQCtltz
layout: post
title: 使用Jeykll-demos为你展示demo助力
date: 2019-04-05
categories: Jeykll
tags: Jeykll Javascript tools homework
description: 有了它，我就再也不用操心jsfiddle什么时候进GFWList了。
---


* content
{:toc}

<center><img alt title src="https://raw.githubusercontent.com/eMous/__ResourceRepository/master/Jekyll_demos/2019/04/04/jekyll_demos_v1_intro.gif"></center>

Jekyll-demos 是一套纯粹使用Jekyll完成的用来展示你的前端页面（包括但不限于`html/js/css`）的解决方案。因为它不是基于Ruby编写，所以它称不上一款插件，这意味着你可以自由地在Github Page中使用它。

## 起源

最主要地原因是我准备写一篇博客展示刚从[w3school](https://www.w3schools.com)温习的CSS基础，并将demo的代码和效果一并展示出来。结果发现我认为样式最简洁明快且被广泛认可的[jsfiddle](jsfiddle.net)被墙了，更甚至的它一直都没有被[gfwlist](https://github.com/gfwlist/gfwlist)项目嗅探到，这意味着一个正常来自中国大陆地区的网民是无法通过直接或使用Shadowsocks Pac模式的方式预览到我提供的demo的，如果我一昧要使用它的话。而其他的embed服务，要么样式太复杂([codepen](http://codepen.io)),要么必须付费([jsbin](https://jsbin.com/),不得不说我很喜欢jsbin的体验甚至超过jsfiddle)。

所以，我决定自己做一个。

## 长处

相比较那些由在线服务提供的demo展示工具，jekyll-demos还是有很多先天的优点。

* 它是免费的，任何人都可以基于MIT许可使用它。

* 它是完全是静态且本地（静态网站自身）驱动的。通过Jekyll模板引擎的帮助，你的所有demos都将被有序的索引到。如果Github Page能持续的提供静态站点部署功能，你几乎有一个**有无限存储的demos仓库**和**免费且永远不会过期的demo展示服务**，你无须操心更多（如在线服务网站的可访问性，数据存储的费用）。

* 如果你有稍微看过Jekyll的官方文档（~~而不是Ruby代码~~），你可以很快地部署jekyll-demos，只需3个步骤：
    1. 将`demoConf.yml`从项目中拷贝到你自己的`_data`文件夹，并且设置你所有demos的父目录路径`demoBaseUrl`。

    2. 将`list_demos.html`从项目拷贝到你Jekyll环境的任意位置（除了几个有特殊功能的文件夹`_site`、`_drafts`等）。并且在它的`Front Matters`给他一个全局唯一的`id `。

    3. 将项目中`_config.yml`的`demos`配置拷贝到你的`_config.yml`文件，并且填入你刚才设置的`id`。

* 每次展示你的demo也很方便，只需要3个步骤：

    1. 将你的demo文件夹放入`demoBaseUrl`下的任意位置。
    2. 在`demoConf.yml`中注册demo的id和文件夹存放的位置。
    3. ~~引入项目提供的Javascript脚本。（这可以一劳永逸地完成，通过使用`layout`）~~
    4. 在你想展现demo的任意页面的任何位置调用项目中提供Javascript函数。
       像这样：
       ```html
       <script>demo_js.EmbedDemo("89798dasoid")</script>
       ```
* 在一个demo中支持多个展示页面。

## 原理

最本质的原理就是，虽然静态模板引擎无法在编译时就将特定demo的Url以宏的形式注入到某个js调用当中，但是可以实现简单的所有demo目录列表输出到某个页面。再之后，js请求那个页面，再对比所有demo的详细信息就能明确的定位到demo的目录及其相关文件了。最后创建iframe动态地展示页面，并使用[CodeMirror](https://github.com/codemirror/CodeMirror/)高亮显示代码。

![seq](https://raw.githubusercontent.com/eMous/__ResourceRepository/master/Jekyll_demos/2019/04/04/1554395612(1).jpg)