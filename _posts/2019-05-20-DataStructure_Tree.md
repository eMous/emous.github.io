---
id: 2019-05-20-DataStructure_Tree.md
author: Anon
layout: post
title: 数据结构（七）：树
date: 2019/5/20
categories: 数据结构
tags: 
description: 树、二叉树、森林及其相关算法解析。
editor: Webstorm Typora
mathjax: true
---

* content
{:toc}
<div style="text-align: center;"><img style="height:;width:;" alt="" title="" src="https://ss.caihuashuai.com/StaticData/Blog/Tree/cover.png"></div>

树的相关知识。

___



## 定义

<div style="text-align: center;"><img style="height:200px;width:;" alt="" title="" src="https://ss.caihuashuai.com/StaticData/Blog/Tree/1.png"></div>

**子树**：

根节点紧挨着的每个节点作为根节点构成的树。图中A有3个子树（{BEKLF},{CG},{DHMIJ}）。

**结点的度**：

子树的个数。

**树的度**：

树内所有结点的度的最大值。

**深度**：

树中的最大层数。该图代表的树的深度为4。

**祖先**：

根节点到该节点分支上所有的结点。图中E的祖先为(B,A)。

**子孙**：

以某节点为根的子树中的任意结点（除去自身），都是该节点的子孙。图中E的子孙为(K,L)。

**堂兄弟**：

父（双亲）结点的所有兄弟结点的所有孩子。图中E的堂兄弟为（G,H,I,J）。

**有/无序树**：

树中结点的各子树的左右排列是可以/不可以互换的。

**森林**：

m棵互不相交的树的集合。对于树中的每一个结点而言，其子树的集合构成了森林。

**二叉树**：

树的度为2的有序树。

**完全二叉树**：

二叉树中的结点和满二叉树的结点一一对应。（结点从左往右一个接一个不空位置。）

<div style="text-align: center;"><img style="height:200px;width:;" alt="" title="" src="https://ss.caihuashuai.com/StaticData/Blog/Tree/2.png"></div>

**正则二叉树**：

不包含度为1的结点的二叉树。

**赫夫曼树**：

带权路径长度最小的二叉树。

**相似树**：

形态同，元素值不一定同。

**等价树**：

相似且元素值都相同。

## 性质

1. 二叉树的第$i$层最多$2^{i-1}$个结点。

2. 深度为$k$的二叉树最多$2^k-1$个结点。

3. 任何一个二叉树，如果其叶子（终端）结点数为$n_0$，度为$2$的结点数为$n_2$，则$n_0=n_2+1$。

   $n=n_0+n_1+n_2$

   $n = B+1$ （除根结点外，每个结点都是由一个分支进入）

   $B=n_1+2n_2$（每个分支要么由度为2的结点射出要么由度 为1的结点射出）

   （叶子结点的个数是度为2的结点的个数 + 1）

4. 具有$n$个结点的**完全二叉树**的深度为$\lfloor \log_2n \rfloor + 1$。

5. 对于有$n$个结点的完全二叉树（从左往右）的第$i(1\leqslant i \leqslant n)$个结点：

   1. $i$为1，结点为根，无父结点。
   2. 其余任何结点，父结点为第$\lfloor i/2 \rfloor$。
   3. 若$2i > n $则该结点没有左孩子结点。
   4. 若$2i +1> n $则该结点没有右孩子结点。

6. $n$个叶子结点的正则二叉树一共有$2n-1$个结点。

7. $n$个结点的不相似的二叉树有$\frac{1}{n+1} C_{2 n}^{n}$个。

8. $n$个结点的不相似的树的个数和$n-1$个不相似结点的二叉树的个数相同。

## 二叉树

### 存储结构

#### 顺序存储

```c
#define MAX_TREE_SIZE 100					// 二叉树的最大结点数
typedef TElemType SqBiTree[MAX_TREE_SIZE];	// 0号单元存储根结点
SqBiTree bt;
```

<div style="text-align: center;"><img style="height:200px;width:;" alt="" title="" src="https://ss.caihuashuai.com/StaticData/Blog/Tree/3.png"></div>

把**完全二叉树中的结点编**号和**数组的索引编号**对应。数组中的元素类型需要提供功能以标识元素是否存在（图中以0假定不存在）。

**顺序存储结构仅适用于存储完全二叉树**，因为最坏的情况下，一个深度为$k$且仅有$k$个结点的单支树却需要长度为$2^k-1$的一维数组。

#### 链式存储

<div style="text-align: center;"><img style="height:200px;width:;" alt="" title="" src="https://ss.caihuashuai.com/StaticData/Blog/Tree/4.png"></div>

链式存储包含两种形式，含有两个指针域的结点结构——二叉链表（只指向孩子结点）和含有三个指针域的结点结构——三叉链表（指向孩子结点和父结点）。

含有$n$个结点的二叉链表中有$n+1$个空域，可以利用这些空域存储额外的信息构建——**线索链表**。

### 遍历

对于二叉树的遍历**按照对于根节点的访问顺序**分为三个方式（都是从左到右）：先序遍历，中序遍历和后序遍历。

先序遍历

1. 访问根节点。
2. 先序遍历左子树。
3. 先序遍历右子树。

中序遍历

1. 中序遍历左子树。
2. 访问根节点。
3. 中序遍历右子树。

后序遍历

1. 后序遍历左子树。
2. 后序遍历右子树。
3. 访问根节点。

#### 递归遍历

```c
Status PreOrderTraverse(BiTree T, Status(* Visit)(TElemType e)){
    // 先序遍历二叉树的递归算法
    if(T){
        Visit(T->data);
        PreOrderTraverse(T->lchild,Visit);
        PreOrderTraverse(T->rchild,Visit);
    }
    return OK;
}
```

#### 表达式的表示

若表达式为数或简单变量，则对应二叉树中仅有一个根结点，其数据域存放该表达式信息；若表达式=（第一操作数）（运算符）（第二操作数），则相应的二叉树中以左子树表示第一操作数，右子树表示第二操作数，根节点的数据域存放运算符（若为一元运算符则左子树为空）。操作数本身又为表达式。

则对于表达式$a+b *(c-d)-e / f$，可以得到其对应的二叉树为下图。

<div style="text-align: center;"><img style="height:200px;width:;" alt="" title="" src="https://ss.caihuashuai.com/StaticData/Blog/Tree/5.png"></div>

先序遍历得到序列$-+a * b-c d / e f$（前缀表示，波兰式）。

中序遍历得到序列$a+b * c-d-e / f$（中缀表示）。

后序遍历得到序列$a b c d-*+e f-$（后缀表示，逆波兰式）。

#### 非递归遍历

以中序遍历为例，对其递归遍历算法实际操作过程可以做如下分析。



将根结点（不为空）压入栈中

循环直到（栈为空栈）{

​	循环直到（栈顶为空）{

​		压入栈顶结点的左子结点。

​	}	

​	// 当前栈顶一定为空 （可能是访问左结点导致的空 也可能是 访问右结点导致的空）

​	出栈。

​	// 当前栈顶可能时单独的左子结点 也可能是 单独的右子结点 也可能 从根结点退出

​	如果（栈非空）{

​		（栈顶结点一定不存在左子结点了）

​		访问栈顶结点。

​		退栈。

​		压入该结点的右子结点。		

​	}

}

```c
Status InOrderTravers(BiTree T, Status (* Visit)(TElemType e)){
    // 二叉链表 中序遍历 非递归
    InitStack(S);
    Push(S,T);				// 压入根指针
    while(!StackEmpty(S)){  // 只要栈中还有没有处理完的结点
   		// 如果当前栈顶不是空元素，尽可能的压入该元素的左结点
    	while(GetTop(S,p) && p) Push(S,p->lchild);
       	// 脱去栈顶的指针
        Pop(S,p); 
        // 如果栈还没有处理完
        if(!StackEmpty(S)){
            // 当前栈顶元素一定不存在左子结点了，所以按照中序遍历直接可以访问栈顶元素了。
        	Pop(S,p);Visit(p->data); // 访问当前栈顶结点，并退栈。
            Push(S,p->rchild);		// 压入该结点的右子结点。
        }
    }
    return OK;
}
```

```c
Status InOrderTravers(BiTree T, Status (* Visit)(TElemType e)){
    // 另一个实现
    
    InitStack(S); p = T;
    
    // 只要当下待处理的结点不为空，或者栈中还有结点
    while(p || !StackEmpty(S)){
        // 如果当前有待处理结点，将其左子结点依次压入栈中，并重置待处理结点
        if(p){Push(S,p); p = p->lchild;}
        else{
            // 若待处理结点被设置为空（说明待处理结点的最左子结点已经压栈到位）
            
            Pop(S,p); Visit(p->data);
            // 最左结点处理完毕（该结点一定不存在更左结点），所以将其右子结点设置成待处理结点（此时没有压栈）。
            p=p->rchild;
        }
        
    }
}
```

时间复杂度为$O(n)$，空间复杂度最坏情况也为$O(n)$。

### 线索二叉树

通过给不存在子结点的结点，提供相关的前驱后继信息（放置于原本为空的指针域）可以加速二叉树的遍历。但是需要额外的提供两个标志域，用于标识该信息的类型是**单纯的子结点**还是用于**表示前驱后继的线索**。其节点结构与标志含义如下图所示：

<div style="text-align: center;"><img style="height:;width:;" alt="" title="" src="https://ss.caihuashuai.com/StaticData/Blog/Tree/6.png"></div>

<div style="text-align: center;"><img style="height:100px;width:;" alt="" title="" src="https://ss.caihuashuai.com/StaticData/Blog/Tree/7.png"></div>

**线索化**指对二叉树以某种次序遍历使其变成线索二叉树的过程。下图为一个中序线索链表实例，虚线为线索，实现为实际子结点。

<div style="text-align: center;"><img style="height:200px;width:;" alt="" title="" src="https://ss.caihuashuai.com/StaticData/Blog/Tree/5.png"></div>

<div style="text-align: center;"><img style="height:350px;width:;" alt="" title="" src="https://ss.caihuashuai.com/StaticData/Blog/Tree/8.png"></div>

虽然线索二叉树的遍历过程也是$O(n)$，但其常数因子却比之前的算法的常数因子小得多，并且整个过程不需要使用**栈**。

```c
// 二叉树的二叉线索存储
typedef enum {Link, Thread} PointerTag; // Link == 0, Thread == 1
typedef struct BitThrNode{
    TElemType 				data;
    struct BitThrNode 		*lchild, *rchild;
    PointerTag				LTag,RTag;	// 标志
}BiThrNode, *BitThrTree;
```

通常，**在二叉树的线索链表上也会添加一个头结点**，并令其lchild域的指针指向二叉树的**根结点**，rchild域指向中序**遍历的最后一个结点**。同时，令第一个结点的lchild和最后一个结点的rchild指向头结点。

```c
Status InOrderTraverse_Thr(BiThrTree T, Status(* Visit)(TElemType e)){
    // 对中序二叉线索树 的 遍历
    p = T->lchild; // 第一个结点
    while(p != T){
        // p == T 时则遍历完成，T是最后一个结点的后继
        
        while(p->LTag == Link) p = p->lchild;
        // 访问最左叶结点
        Visit(p->data);
        while(p->RTag == Thread && p->rchild != T){
            // 访问之前那个最左叶节点的 所有 不包含 右子结点的 祖先结点
            p = p->rchild; Visit(p->data);
            // 直到访问包含右子结点的一个
        }
        // 切换到那个右子结点
        p = p->rchild;
        
        // 继续找最左的叶节点
    }
    return OK;
}
```

#### 线索化

线索化的过程本质上就是在遍历的过程中修改空指针的过程。`pre`指针用于记录遍历期间的，刚刚访问过的（上一个）结点，即前驱。

```c
Status InOrderThreading(BiThrTree &Thrt, BiThrTree T){
    // 中序遍历二叉树T，并将其中序线索化，Thrt指向头结点。
    if(!(Thrt = (BiThrTree)malloc(sizeof(BiThrNode)))) exit(OVERFLOW);
    // 设置头节点
    Thrt->LTag = Link; Thrt->RTag = Thread;
    Thrt->rchild = Thrt; // 初始化（在后面会正确设置）
    
    if(!T) Thrt->lchild = Thrt; // 若T为空，则只有一个头结点。 (从而使得不会命中下面行数的第一个 if(!pre->rchild)) 
    else{
        Thrt->lchild = T; pre = Thrt;  // 设置 lchild，pre
        InThreading(T);
        
        // 此时 pre 是最后一个结点
        pre->rchild = Thrt; pre->RTag = Thread;
        Thrt->rchild = pre;
    }
  	return OK;
}

void InThreading(BiThrTree p){
    if(p){
        // 和中序遍历 差不多
       
        // 左子树线索化
        InThreading(p->lchild);
        
        if(!p->lchild){
            // 如果他是最左子树，第一个被遍历到的结点，正好可以把lchild设置成Thrt
            p->LTag = Thread;
            p->lchild = pre;
        }
        
        if(!pre->rchild){pre->RTag = Thread; pre->rchild = p;}
        // 更新pre
        pre = p;
        
        // 右子树线索化
        InThreading(p->rchild);
    }
}
```

## 树和森林

### 存储结构

#### 双亲表示法

双亲表示法要求每个结点记录其父结点（因为每个树的结点只有一个所以这个数据域的长度是固定的），所有的结点存储在一个连续的存储空间中。

```c
// 树的双亲存储表示
#define MAX_TREE_SIZE 100
typedef struct PTNode{
    TElemType data;
    int parent;	// 双亲位置域
}PTNode;
typedef struct{
    PTNode nodes[MAX_TREE_SIZE];
    int n; 		// 结点数
}PTree;
```

<div style="text-align: center;"><img style="height:350px;width:;" alt="" title="" src="https://ss.caihuashuai.com/StaticData/Blog/Tree/9.png"></div>

这种结构的好处在于对于特定的结点，可以在常量时间内寻找到父结点。并且反复调用PARENT可以快速的得到根结点。但是求孩子结点的时候却要遍历整个结构。

#### 孩子表示法

由于每个结点的孩子结点数目是不不确定的，因此需要用多重链表，即每个结点有多个指针域。

多重链表又有两种形式:

<div style="text-align: center;"><img style="height:;width:;" alt="" title="" src="https://ss.caihuashuai.com/StaticData/Blog/Tree/10.png"></div>

1. 每个结点的指针个数和树的度相同（方便但浪费空间）
2. 每个结点的指针个数和该结点的度相同，并标识出该节点的度（节省空间但操作不便）

再或者使用一个类似于单链表的形式将孩子结点串起来，n个结点就有n个孩子线性链表。n个结点指针又组成一个线性表，为了方便查找可以使用顺序存储结构。

```c
// 树的孩子链表存储表示
typedef struct CTNode{	// 孩子结点
    int 			child;
    struct CTNode 	*next;
} * ChildPtr;
typedef struct{			// 被包装的结点
    TElemType data;
    ChildPtr	firstchild;	// 孩子链表头指针
}CTBox;
typedef struct{
    CTBox nodes[MAX_TREE_SIZE];
    int n,r;			// 结点数和根的位置 
}CTree;
```

如果在结点处附带父节点信息，同样可以实现父结点的快速查找。

<div style="text-align: center;"><img style="height:;width:;" alt="" title="" src="https://ss.caihuashuai.com/StaticData/Blog/Tree/11.png"></div>

### 森林和二叉树互换

<div style="text-align: center;"><img style="height:;width:;" alt="" title="" src="https://ss.caihuashuai.com/StaticData/Blog/Tree/12.png"></div>

右子树就是兄弟，左子树就是第一个子树。

### 遍历森林

先化成对应二叉树，再遍历。

## 应用

### 等价问题

对于已知的m个偶对，构建等价类。本质上就是使用树来构建**并查集**。

1. 构造每个单一元素为根的单结点树的森林。**并且该森林中的每个树的每个结点都指向其父结点**。
2. 重复读入偶对，分别判断x,y所在的子集（树），若相同则下一对。若不同，则将$S_j$复制并入$S_i$。

所以重要的操作只有两个，**查找某个元素的所在树的根结点** 和 **将树和树合并**。

```c
// MFSet使用树的双亲表存储表示 （它其实是一个森林）
int find_mfset(MFSet S, int i){
    // 找森林（集合）S中，i结点所在的树的根结点(根结点的parent <= 0(应该是0))
    if(i < 1 || i > S.n) return -1;
    
    for(j = i; S.nodes[j].parent > 0; j = S.nodes[j].parent);
    return j;
}

Status merge_mfset(MFSet &S, int i, j){
    // 将j结点为根的树 并 到i结点为根的树
    if(i < 1 || i > S.n || j < 1 || j > S.n) return ERROR;
    S.nodes[i].parent = j;
    return OK;
}
```

`find_mfset`的复杂度为$O(深度)$,`merge_mfset`的复杂度为$O(1)$。一个森林n个结点，需要n-1次查并操作，所以复杂度为$O(n^2)$

**优化**

若每次合并的时候都是少结点的集合像多的集合合并（~~因为少结点的集合 要么不给多结点的集合增加更多的深度，要么最多只有少集合的最大深度~~），其深度不会超过$\lfloor \log_2n \rfloor + 1$，从而复杂度捡到少$O(nlogn)$。 根结点的parent为负数，是其包含的所有结点的计数的负数。

```c
void mix_mfset(MFSet &S, int i, int j){
    if(i < 1 || i < S.n || j < 1 || j > S.n) return ERROR;
    
    if(S.nodes[i].parent > S.nodes[j].parent){
        // i的比j的少，因为约定是负数
        S.nodes[j].parent += S.nodes[i].parent;
        S.nodes[i].parent = j;
    }else{
        S.nodes[i].parent +` S.nodes[j].parent;
        S.nodes[j].parent = i;
    }
    return OK;
}
```

**再优化**

```c
int fix_mfset(MFSet &S, int i){
    // 确定i所在的自己，并将从i至根路径上所有结点都变成根的孩子结点
    if(i < 1 || i > S.n) return -1;
    
    for(j = i; S.nodes[j].parent > 0; j = S.nodes[j].parent);
    for(k = i; k != j; k = t){
        t = S.nodes[k].parent;
        S.nodes[k].parent = j;
    }
    return j;
}
```

其复杂度为$O(na(n))$，对于通常正整数n，$a(n) <= 4$。

### 赫夫曼

#### 最优二叉树（赫夫曼树）

赫夫曼树的构造方法：

1. 每个带权结点看成独立的树，共n个结点（独立的树）在集合S中。
2. 权值最小的两个树构成新的二叉树
   1. 在S中去除这两个结点
   2. 生成的二叉树的根结点的权值为两结点之和
   3. 生成的二叉树的根结点加入到集合S中
3. 重复1,2

#### 赫夫曼编码

对于需要传输的信息，可以使用二进制的方式来**辨别**传输信息中的**基础字符**（例如'ABCAB'中的'A'，'B'，'C'）。

对于不同元素的编码有两个原则：

1. 不存在二义性
2. 总长越小越好（出现频率低的字符用更小的串）

不存在二义性的编码只映射一个字符的二进制串被称作**前缀码**。

为满足第一个原则，最自然的方法是使用二叉树，将左分支设置为0，又分支设置为1。再约定从上到下组成的串，必定只能映射到一个叶子结点（字符元素）因此不会存在二义性。

<div style="text-align: center;"><img style="height:250px;width:;" alt="" title="" src="https://ss.caihuashuai.com/StaticData/Blog/Tree/13.png"></div>

对于第二个原则，则可以正好对应的二叉树是赫夫曼树。

##### 赫夫曼编码的实现

因为赫夫曼树是正则二叉树所以n个叶子结点的话，有2n-1个结点。所以存储在一个2n-1长度的数组里，n个叶子结点用来代表n个字符。

1. ```c
   // 赫夫曼树和赫夫曼编码的存储表示
   typedef struct{
       unsigned int weight;
       unsigned int parent, lchild, rchild;
   }HTNode, * HuffmanTree; // 赫夫曼树
   
   typedef char ** HuffmanCode; // 赫夫曼编码表
   
   void HuffmanCoding(HuffmanTree &HT, HuffmanCode &HC, int *w, int n){
    	// n 为n个字符， w 为每个字符的权值
       if(n <= 1) return;
       m = 2 * n - 1;
       HT = (HuffmanTree)malloc((m + 1) * sizeof(HTNode));	 // 申请空间，因为n是动态的所以动态申请，第0号位不使用
       
       for(p = HT, i = 1; i <= n; ++i,++p,++w){
           // 前n个结点为叶子结点
           // 初始化叶子结点的权值到对应的字符频率
           *p = {*w,0,0,0};
       }
       for (i = n + 1; i <= m; ++i){
           // 构建赫夫曼树
           // 在HT[1..i-1]中选择parent为0且weight最小的两个结点，其序号分别为s1,s2
           Select(HT,i-1,s1,s2);
           HT[s1].parent = i; HT[s2].parent = i;
           HT[i].lchild = s1; HT[i].rchild = s2;
           HT[i].weight = HT[s1].weight + HT[s2].weight;
       }
       
       // 从叶子到根逆向求每个字符的赫夫曼编码
       // 分配n个字符编码的头指针向量
       HC = (HuffmanCode) malloc((n+1)*sizeof(char *));	
       // 分配求单个字符编码的工作空间（单个字符的 最大 n，并不是最终串长）,并且这个空间可以每个字符循环利用
       cd = (char *)malloc(n * sizeof(char));
       cd[n-1] = `\0`;
       for(i = 1; i <= n; ++i){
           start = n - 1;
           for(c = i, f=HT[i].parent; f != 0; c=f,f=HT){
               // 从叶子结点的上一个结点开始一个一个判断是父结点的左子结点还是右子结点
               // 然后从串的尾部开始设置
               if(HT[f].lchild == c) cd[--start] = "0";
               else cd[--start] = "1";
           }
           // 最中单个字符对应的串长确定
           HC[i] = (char *)mallock((n - start) * sizeof(char));
           strcpy(HC[i],&cd[start]);
       }
       free(cd);
   }
   
   ```

同样也可以从根结点出发求得赫夫曼编码。 不论是从叶子还是从根计算赫夫曼编码，遍历的顺序（选择的字符的顺序）都是 左到底，右，继续做到底，右...。发现的所有叶子结点的顺序。

<div style="text-align: center;"><img style="height:250px;width:;" alt="" title="" src="https://ss.caihuashuai.com/StaticData/Blog/Tree/14.png"></div>

```c
// 无栈 非递归 遍历赫夫曼树，求赫夫曼编码
HC = (HuffmanCode)malloc((n + 1) * sizeof(char *));
// 根据上述的构造 m 一定是根结点
p = m; cdlen = 0;
for(i = 1; i <= m; ++i) HT[i].weight = 0; // 初始化每个结点的访问标志

while(p){
    // 如果这个结点还没有被处理过
    if(HT[p].weight == 0){
        // 设置本结点为已经初次处理，先不管到底有没有左子结点
    	HT[p].weight = 1;
        // 如果该结点有左子结点，切换待处理结点，且在工作空间补充对应的字符位0
        if(HT[p].lchild != 0){
            p = HT[p].lchild; cd[cdlen++] = "0";
        }
        else if(HT[p].rchild == 0){
            // 若它没有左子结点，又没有右子结点，那它必定是叶子结点
            
            // 这是的单个字符的赫夫曼码就处理完毕
            HC[p] = (char *)malloc((cdlen + 1) * sizeof(char));
            cd[cdlen] = "\0";
            strcpy(HC[p],cd);
        }
    }else if(HT[p].weight == 1){
        // 如果当前结点已经处理过了 左子结点 
        
        // 将其状态位设置为已经处理过了 右子结点，先不管到底有没有右子结点
        HT[p].weight = 2;
        if(HT[p].rchild != 0){
            // 如果它存在右子结点，切换待处理结点，且在工作空间补充对应的字符位1
      		p = HT[p].rchild;
            cd[cdlen++] = "1";
        }else{
            // 如果待处理结点 已经处理完毕了右子结点
            
            // 就让待处理结点回退到上一层（去继续处理右子结点）
            
            // 我认为这句置空没有意义，因为不会再回来处理这个结点了，这个结点下的所有结点都处理完毕了，仅仅是设置成和初始化一样的值罢了
            HT[p].weight = 0;
            
            // 待处理接待结点回溯到上一层结点，编码长度减1
            p = HT[p].parent;
            --cdlen;
        }
        
    }
}
```

