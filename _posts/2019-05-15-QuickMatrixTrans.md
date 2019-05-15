---
id: 2019-05-15-QuickMatrixTrans.md
author: Anon
layout: post
title: 算法（二）：稀疏矩阵快速转置算法
date: 2019/5/15
categories: 算法
tags: 数据结构
description: 深入学习算法关于“用空间换时间”的思想。
editor: Webstorm Typora
mathjax: true
---

* content
{:toc}

本文将阐述我是如何理解严蔚敏老师<<数据结构>>中的稀疏矩阵及其相关的三元组定义方式，以及与之相关的快速转置算法。
___



## 稀疏矩阵

假设在**m * n**的矩阵中，有**t**个**不为零**的元素。令$$\delta=\frac{t}{m*n}$$

When $a \ne 0$, there are two solutions to \(ax^2 + bx + c = 0\) and they are
$$x = {-b \pm \sqrt{b^2-4ac} \over 2a}.$$

