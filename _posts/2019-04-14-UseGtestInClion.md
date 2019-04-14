---
id: 2019-04-14-UseGtestInClion.md
author: Anon
layout: post
title: 在Clion中使用Google Test(gtest)进行程序测试
date: 2019/4/14
categories: 测试
tags: 测试 Webstorm gtest C++
description: 居然C++也有自己的测试框架。
---


* content
{:toc}


<div style="text-align: center;"><img style="height:;width:100%;" alt="" title="" src="/image/2019/04/14/bug_fixed.svg"></div>



我第一次接触到**程序测试**是在大学的时候，那个时候对于程序测试的概念特别模糊，一方面是因为对于能推出新产品的“开发”工作比较有热情，一方面也是因为大学时候与测试有关的课程老师授课的时候往往都没有相关的理论论述，取而代之的大多都是反复的一遍又一遍地让我们试错，实在是乏味。

我开始理解测试，又或者说之所以有这篇文章，是因为在某些特定的环境下，测试是一个**特别值得独立出来的，能提高整体效率的工作流程**。
> 那就是，一方面作品需要验证其准确性，一方面又不便因验证本身而大改项目的整体结构的时候。

测试框架能良好的发挥其**松散**的，**准确**的，**多入口**的特性。将整个项目的工作流程调整成“需求->设计->开发->\[测试->调试\]多批次并行循环->发布”，能让整个工程变得简洁而有序，哪怕仅仅是团队仅仅是一个人。


___


## C++测试框架

在Clion中为C++提供了三个主流的测试框架作为配置选项：[Boost.test](https://www.boost.org/doc/libs/1_66_0/libs/test/doc/html/index.html)，[Catch](https://github.com/catchorg/Catch2/blob/master/docs/limitations.md)，[Google Test](https://github.com/google/googletest)。

### Boost Test

Boost Test是一个很不错的选择，尤其是当你正在使用`Boost`的时候。

``` C++
// TODO: Include your class to test here.
#define BOOST_TEST_MODULE MyTest
#include <boost/test/unit_test.hpp>

BOOST_AUTO_TEST_CASE(MyTestCase)
{
    // To simplify this example test, let's suppose we'll test 'float'.
    // Some test are stupid, but all should pass.
    float x = 9.5f;

    BOOST_CHECK(x != 0.0f);
    BOOST_CHECK_EQUAL((int)x, 9);
    BOOST_CHECK_CLOSE(x, 9.5f, 0.0001f); // Checks differ no more then 0.0001%
}

```

### Google Test

Google Test是