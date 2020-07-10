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

假设在$$m \times n$$的矩阵中，有$$t$$个**不为零**的元素。令$$\delta=\frac{t}{m \times n}$$，称$$\delta$$为**稀疏因子**。通常认为$$\delta\le0.05$$时，该矩阵则可以被称作**稀疏矩阵**。

### 数据结构

通常使用**三元组顺序表**的形式来压缩表示一个稀疏矩阵，每个三元组包括的信息有：

- `i` 非零元素的行下标
- `j` 非零元素的列下标
- `e` 元素值

三元组顺序表又将和一些**元信息**一起保存在一个联合结构（书中写的是union但我认为应该使用 struct，否则mu,nu,tu的数据会被覆盖）中以表示一个稀疏矩阵，这些基础信息包括：

- `mu` 矩阵的行数
- `nu` 矩阵的列数
- `tu` 矩阵非零元素的总个数

若使用~~伪~~C语言，可以有具体的如下定义。

```c
# define MAXSIZE 12500 			// 最大的非零元素个数
typedef struct{
    int i,j;					// 分别表示非零元素的行下标和列下标
    ElemType e;					// 元素值
}Triple;
typedef union{
    Triple data[MAXSIZE + 1]; 	// 所有的非零元素， data[0]弃用
    int mu, nu, tu;				// 矩阵的行数、列数和总共的非零元素个数
}TSMatrix;
```

**其实还有一个隐性的要求（虽然书中并没有明确说明）：**data中的数据以**行**为**主序**存储（从第一行起依次存储）。

### 转置

根据上述的数据结构，若要将`TSMatrix before`转置成`TSMatrix after`，则务必需要经历如下三个步骤：

1. 将`TSMatrix`中的元信息`mu`、`nu`互换。
2. 将`data`中每个`Triple`的`i`和`j`互换。
3. 重新整理`data`使其满足**行主序**。**（难以实现）**

<div style="text-align: center;"><img style="height:400px;width:;" alt="" title="" src="https://ss.caihuashuai.com/StaticData/Blog/TSMatrix/TS_Trans.png"></div>

## 普通算法

最直观的想法是：因为**转置后行列互换**，转置后需要确保行主序，因此直接从`before`的第一列开始以**列遍历**处理。

对于具体的某一列，**遍历所有的非零元素**，判断每个元素的列值是否等于当前列。又因为，`data`是按照**行值排列**的，可以确保在`after.data`中的每**行**元素也一定可以按照**列值**从小到大排列。

<div style="text-align: center;"><img style="height:400px;width:;" alt="" title="" src="https://ss.caihuashuai.com/StaticData/Blog/TSMatrix/TSMatrix_trans_normal.gif"></div>

```c
Status TransposeSMatrix(TSMatrix before, TSMatrix &after){
	after.mu = before.nu; after.nu = before.mu; after.tu = before.tu;
    if(after.tu){
        q = 1; // after.data的写入指针
        for(col = 1; col <= before.nu; ++col){
            // 遍历列
            for(p = 1; p <= before.tu; ++p){
               	// 遍历before.data
                if(before.data[p].j == col){
                    // 元素的列正好是当前被遍历的列
                    after.data[q].i = before.data[p].j; 
                    after.data[q].j = before.data[p].i;
                    
                    after.data[q].e = before.data[p].e;
                    ++q;
                }
            }
        }
    }
	return OK;
}
```

该算法的时间复杂度为$$O(nu \times tu)$$，又因为$$tu$$和$$mu \times nu$$同数量级，因此实际复杂度为$$O(nu^2 \times mu)$$，相比于**非压缩情况**的转置算法的时间复杂度$$O(nu \times mu)$$要耗时很多，除非$$tu << mu \times nu$$。所以我们需要探究一个时间复杂度更低的转置算法，用空间换取时间。

## 快速转置算法

和[KMP](/2019/05/09/KMP/)相似的，我们可以通过**预处理**`before`获取一些提炼出一些额外的信息，从而**避免嵌套的循环**。目标如下：只遍历一次`before.data`，将每个元素行列互换后填入`after.data`的**合适**的位置。

那么需要预处理出哪些信息才能在遍历时直接得出合适的位置呢？可以做如下的思考：



- 转置的实质是行列互换。
  - 因此如果知道`before.data`中**某列的第1个非0元素**在`after.data`中的位置$$pos$$（某行的第1个非0元素），那么这一列的**下一个非0元素**在`after.data`中的位置一定为$$pos+1$$，因为`data`是行主序的。
- 又`before.data`是行主序的
  - 又因为，遍历`before.data`时是可以必然确保对于**特定的列**，遍历的次序**一定是按照行号从低到高**进行的。
    - 例如：本例中（列数为1）的第3个元素行号是3，第7个元素行号是6，行号随着遍历是从低到高的。
  - 因此如果知道`before.data`中**每列的第1个非0元素**在`after.data`中的位置，只需要遍历一遍`before.data`就可以把`after.data`计算出来。
- 如何计算`before.data`中**每列的第1个非0元素**在`after.data`中的位置?
  - 递推：**上一列的第1个非0元素**在`after.data`中的位置 + **上一列非0元素的总个数**
- 如何求`before.data`中**每列非0元素**的总个数？
  - **遍历before.data(tu)就行**

所以总的算法过程就应该是：

1. 遍历`before.data`，求出`before.data`中**每列非0元素**的总个数`num[]`。
2. 
   1. 初始化`before.data`中第1列的第1个非0元素在`after.data`中的位置为1。
   2. 遍历`before.data`中所有的列，配合`num[]`递推出，`before.data`中**每列的第1个非0元素**在`after.data`中的位置`cpot[]`。
3. 遍历`before.data(tu)`，遇到的每一个元素都**视作它所在列的第一个元素**，根据`cpot[col]`填入`after.data`中，再把`cpot[col]`自增1。

<div style="text-align: center;"><img style="height:400px;width:;" alt="" title="" src="https://ss.caihuashuai.com/StaticData/Blog/TSMatrix/TSMatrix_fasttrans.gif"></div>

```c
Status FastTransposeSMatrix(TSMatrix before, TSMatrix &after){
	after.mu = before.nu; after.nu = before.mu; after.tu = before.tu;
    if(after.tu){
        for(col = 1; col <= before.nu; ++col){
            num[col] = 0;
        }
        for(t = 1; t < before.tu; ++t){
        	// 通过每一个before.data中的元素计数，得出每列非0元素数量
            ++num[before.data[t].j];
        }
        // 递推计算before.data中每列的第1个非0元素在after.data中的位置,初始化
        cpot[1] = 1;
        for(col = 2; col <= before.nu; ++col){
            cpot[col] = cpot[col - 1] + num[col - 1];
        }
        // 填入after.data
        for(p = 1; p <= before.tu; ++p){
            // 每个被遍历到的非0元素都被视作，它所在列的第1个非0元素
            col = before.data[p].j; q = cpot[col];
            
            after.data[q].i = before.data[p].j;
            after.data[q].j = before.data[p].i;
            after.data[q].e = before.data[p].e;
            
            // 当该列下一个元素被遍历到时，正好需要后移一位
            ++cpot[col];          
        }
    }
    return OK;
}
```

综上可以分析出其时间复杂度为$$O(nu + tu)$$ 即 $$O(nu + nu \times mu)$$ 即 $$O(nu \times mu)$$。