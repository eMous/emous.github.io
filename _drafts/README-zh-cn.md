### 展示页 Demo

使用 [Masonry](http://masonry.desandro.com/) 重写了瀑布流布局，响应式布局，更好的交互体验。

### 关于页 About

对个人和对本站的介绍，使用`markdown`写的。

### 评论

支持 [多说评论](http://duoshuo.com/) 和 [disqus](https://disqus.com/) 评论。

只需要在 `_config.yml` 修改相应的配置`short_name`即可，如下：

```yml
# comments
# two ways to comment, only choose one, and use your own short name
# 两种评论插件，选一个就好了，使用自己的 short_name
duoshuo_shortname: #xxx
disqus_shortname: xxx
```



#### 评论信息

获取`short_name`的方法：

访问 https://disqus.com/ 或 http://duoshuo.com/ 根据提示操作即可。

```yml
# comments
# two ways to comment, only choose one, and use your own short name
# 两种评论插件，选一个就好了，使用自己的 short_name
duoshuo_shortname: #hygblog
disqus_shortname: gaohaoyang
```

运行成功后，可以在 disqus 或 多说 的后台管理页看到相关信息。

#### 统计信息

获取 百度统计id 或 Google Analytics id 的方法：

访问 http://tongji.baidu.com/ 或 https://www.google.com/analytics/ 根据提示操作即可。当然，如果不想添加统计信息，这两个参数可以不填。

```yml
# statistic analysis 统计代码
# 百度统计 id，将统计代码替换为自己的百度统计id，即
# hm.src = "//hm.baidu.com/hm.js?xxxxxxxxxxxx";
# xxxxx字符串
baidu_tongji_id: cf8506e0ef223e57ff6239944e5d46a4
google_analytics_id: UA-72449510-4 # google 分析追踪id
```

成功后，进入自己的百度统计或 Google Analytics 后台管理，即可看到网站的访问量、访客等相关信息。

### 4. 写文章

`_posts`目录下存放文章信息，文章头部注明 layout(布局)、title、date、categories、tags、author(可选)、mathjax(可选，点击[这里](https://www.mathjax.org/)查看更多关于`Mathjax`)，如下：

```
---
layout: post
title:  "对这个 jekyll 博客主题的改版和重构"
date:   2016-03-12 11:40:18 +0800
categories: jekyll
tags: jekyll 端口 markdown Foxit RubyGems HTML CSS
author: Haoyang Gao
mathjax: true
description: 一句话描述post.
---

```

下面这两行代码为产生目录时使用
```
* content
{:toc}
```

文章中存在的4次换行为摘要分割符，换行前的内容会以摘要的形式显示在主页Home上，进入文章页不影响。

换行符的设置见配置文件`_config.yml`的 excerpt，如下：

```yml
# excerpt
excerpt_separator: "\n___"
```

使用 markdown 语法写文章。

代码风格与 GitHub 上 README 或 issue 中的一致。使用3个\`\`\`的方式。

