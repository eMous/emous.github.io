---
id: 2019-05-16-MatrixMulti.md
author: Anon
layout: post
title: 算法（三）：稀疏矩阵的乘法
date: 2019/5/16
categories: 算法
tags: 数据结构
description: 无。
editor: Webstorm Typora
mathjax: true
---

* content
{:toc}


___



## 数据结构

回顾上次我们描述**[稀疏矩阵转置算法](/2019/05/15/QuickMatrixTrans/)**时描述稀疏矩阵的数据结构。

```c
# define MAXSIZE 12500          // 最大的非零元素个数
typedef struct{
    int i,j;               		// 分别表示非零元素的行下标和列下标
    ElemType e;                	// 元素值
}Triple;
typedef union{
    Triple data[MAXSIZE + 1];  	// 所有的非零元素， data[0]弃用
    int mu, nu, tu;             // 矩阵的行数、列数和总共的非零元素个数
}TSMatrix;
```



可以发现这个样的数据结构无法**随机地定位任意一行非零元**，因此为了方便做乘法，需要重构数据结构辅助创建一个`带有每行首个非零元位置的数组`。这类`带有行链接信息`的三元组表又被称作`行逻辑链接的顺序表`如下：

```c
typedef struct{
    Triple data[MAXSIZE + 1];  	// 所有的非零元素， data[0]弃用
    int rpos[MAXRC + 1];		// 各行第一个非零元素的位置表
    int mu, nu, tu;             // 矩阵的行数、列数和总共的非零元素个数
}TSMatrix;
```

## 算法

对于传统的矩阵相乘$$Q=M\times N$$，其中$$M$$为$$m_1\times n_1$$矩阵，$$N$$为$$m_2\times n_2$$矩阵，若$$n_1 = m_2 = K$$，则有：

```c
for (i = 1; i < m1; ++i){
    // 左矩阵的每一行
    for(j = 1; j < n2){
       // 右矩阵的每一列
        Q[i][j] = 0;
        for(k = 1; k < n1; ++k){
            // 左矩阵的列数 = 右矩阵的行数
            // 对于左矩阵特定行 和 右矩阵特定列 元素逐一相乘再求和
            Q[i][j] += M[i][k] * N[k][j];
        }
    }
}
```

该算法的时间复杂度为$$O(m_1 \times K \times n2)$$对于三元组表作为存储结构的时候上述的运算不能直接套用，可以做出如下分析：

1. 乘积矩阵$$Q$$中元素的表示方式为：

   $$\boldsymbol{Q}(i, j)=\sum_{k=1}^{K} M(i, k) \times N(k, j)
   \quad
   \begin{array}{}
   1 \leqslant i \leqslant m_{1}  \\ 
   1 \leqslant j \leqslant n_{2} 
   \end{array}$$

2. 0和任何数相乘都为0，因此上述算法中的 `M[i][k] * N[k][j]`中的`M[i][k]`和`N[k][j]`都必须为非0的项。

   因此只需要确保**`M.data[each_p].j = N.data[each_q].i`**匹配的元素才进行运算。

3. 若`M.data[p].j = N.data[q].i`，计算得到的`M.data[p].e * N.data[q].e`也只是目标矩阵的某个元的其中一部分，真正的元还需要累加这些结果，因此需要一个**累加器**来存储结果。 

4. 虽然$$M$$和$$N$$都是稀疏矩阵，但是结果未必是稀疏矩阵。同时，$$Q$$的元素是否是非零元只有在累加完毕后才能得知。**由于$$Q$$中元素的行号和$$M$$中元素的行号一致，且$$M$$中元素的排列是以M的行序为主序的**，所以对$$Q$$进行计算的时候可以对$$Q$$进行逐行处理，先求得中间结果（**$$Q$$的一行**），再压缩到`Q.data`中去。 

<div style="text-align: center;"><img style="height:400px;width:;" alt="" title="" src="https://ss.showyoumycode.com/StaticData/Blog/RLSMatrix/RLSMatrix_multi.gif"></div>

具体思路如下：

```
Q初始化
if(M.tu * N.tu != 0){
	for(M的每一行arow{
		累加器清0
		
		计算Q中第arow行的N.nu个结果存入累加器
		
		将累加器中的非零元存入 Q.data
	}
}
```

具体算法如下:

```c
Status MultSMatrix(RLSMatrix M, RLSMatrix N, RLSMatrix &Q){
    if(M.nu != N.mu) return ERROR;
    Q.mu = M.mu; Q.nu = N.nu; Q.tu = 0; // 初始化Q
   	if(M.tu * N.tu != 0){
        // 确保不能直接得出0矩阵的结果
        for(arrow = 1; arow <= M.mu; ++arow){
            // 处理 M 的每一行
            // 当前行的各元素的累加器（数组长度为M.nu,最后ctemp中将为Q的第arow行的所有元素值）
            ctemp[] = 0;
            // Q的每一行的第一个非0元素，都会等于目前Q的所有元素个数 + 1 （因为Q是行主序的）
            Q.rpos[arow] = Q.tu + 1;
            for(p = M.rpos[arow]; p < M.rpos[arow + 1]; ++p){
                // 遍历M当前行的每一个非零元素（列）
                
                // 直接含义：获取当前元素的列号
                // 隐藏含义：获取N中对应元素的行号
                brow = M.data[p].j; 
                
                // t为 N中对应行的最后一个元素的位置 + 1 （从而可以遍历N中对应的行，使得 累加器的的元素（列）都能增加，直到M当前行中的最后一个元素被遍历，累加器才全部构造好Q第一行的元素。）
                if(brow < N.nu) t = N.rpos[brow + 1];
                else { t = N.tu + 1; }
                for(q = N.rpos[brow]; q < t; ++q){
                    // 乘积元素在Q中的列号
                    ccol = N.data[q].j;
                    // 累加每一列的乘积和
                    ctemp[ccol] += M.data[p].e * N.data[q].e;
                }
            }
            // 这一行的结果已经计算出。
            // 压缩这一行到Q中。
            for(ccol = 1; ccol < Q.nu; ++ccol){
                if(ctemp[ccol]){
                    if(++Q.tu > MAXSIZE) return ERROR;
                    Q.data[Q.tu] = {arow, ccol, ctemp[ccol]};
                }
            }
        }
    }
}
```

分析上述算法可得，`ctemp`初始化的时间复杂度为$$O(M.mu \times N.nu)$$(初始化应该就是置空的意思，`ctemp`的元素个数是`N.nu`)。求$$Q$$的所有非零元的时间复杂度为$$O(M.mu \times N.tu/N.mu)$$($$N.tu/N.mu$$就是平均每行的元素个数)，进行压缩的时间复杂度为$$O(M.mu \times N.nu)$$。因此，总复杂度是$$O(M.mu \times N.nu + M.tu \times N.tu/N.mu)$$。

当$$M$$是一个$$m$$行$$n$$列的稀疏矩阵，$$N$$是一个$n$行$p$列的稀疏矩阵。则$M$中的非零元素个数为$\mathrm{M} . \mathrm{tu}=\delta_{\mathrm{M}} \times \mathrm{m} \times \mathrm{n}$，$N$中的非零元素个数为$\mathrm{N} . \mathrm{tu}=\delta_{\mathrm{N}} \times \mathrm{n} \times \mathrm{p}$。此时算法总体的时间复杂度为$O(m \times p \times (1 + n\delta_{\mathrm{M}}\delta_{\mathrm{N}}))$，当$\delta_{\mathrm{M}} < 0.05$和$\delta_{\mathrm{N}} < 0.05$及$n < 1000$时就相当于$O(m \times p)$。



