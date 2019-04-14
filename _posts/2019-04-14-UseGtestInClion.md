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

### Boost Test[^1]

Boost Test是一个很不错的选择，尤其是当你正在使用`Boost`的时候。

```cpp
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
它支持：
* **自动**或者手动测试注册
* 大量的断言
* 自动地对比**collections**
* 多种多样的输出格式（包括**XML**）
* **Fixtures**/**模板**

### Google Test[^2]

Google Test（也被叫做Google C++ 测试框架）是一个较新的测试框架。

```cpp
#include <gtest/gtest.h>

TEST(MyTestSuitName, MyTestCaseName) {
    int actual = 1;
    EXPECT_GT(actual, 0);
    EXPECT_EQ(1, actual) << "Should be equal to one";
}
```
它的主要特性：
* **便携**
* 提供致命和**非致命**的断言
* 可以给断言的输出提供简单的信息数据：`ASSERT_EQ(5, Foo(i)) << " where i = " << i;`
* Google Test可以**自动地**检测到你的测试任务所以你不需要枚举他们到列表中再运行
* 可以轻松地**拓展**你的断言的词汇
* **Death tests**（详情请见高级教程）
* 为子程序循环提供`SCOPED_TRACE`
* 你可以决定**运行哪一些测试任务**
* 生成**XML**形式的测试报告
* **Fixtures**/**Mock**/**模板**

### CATCH[^3]
* 仅仅需要导入头文件
* 自动注册tests的方法和函数
* 将标准C++表达式分解到LHS和RHS（所以你不需要一套的断言宏）
* Support for nested sections within a function based fixture
* 可以用自然语言为测试命名，相应的函数和方法将生成
* [更多](https://github.com/catchorg/Catch2/blob/master/docs/why-catch.md#top)

## Google Test in Clion

1. 创建新的C++ Executable项目。
    <div style="text-align: center;"><img style="height:;width:100%;" alt="" title="" src="/image/2019/04/14/Snipaste_2019-04-14_20-17-57.png"></div>

2. 将项目分为**项目**和**测试**目录，并在项目目录中添加**头文件**和**源文件**目录。为测试目录（`Test_DIR`）添加具体测试目录（`tests`），并为其添加`CMakeLists.txt`。之后将[gtest源码](https://github.com/google/googletest)添加到测试lib目录（`Test_DIR/lib`）中并为测试目录添加`CMakeLists.txt`，并为项目添加源码。
    <div style="text-align: center;"><img style="height:;width:40%;" alt="" title="" src="/image/2019/04/14/Snipaste_2019-04-14_20-39-45.png"></div>

3. 编写根目录的CMakeLists，它有两个作用：程序的完整功能、将测试CMakeLists引入。
    
    ```
    cmake_minimum_required(VERSION 3.13)
    project(Test)
    
    set(CMAKE_CXX_STANDARD 14)
    
    #头文件目录
    include_directories(Project_DIR/Header)
    
    #链接
    add_executable(Test main.cpp Project_DIR/Source/IamAClass.cpp)
    
    #为项目引入测试功能
    add_subdirectory(Test_DIR) 
    ```
4. 编写项目源码。
    ```cpp
    //
    // Created by anon on 2019/4/14.
    //
    
    #ifndef TEST_IAMACLASS_H
    #define TEST_IAMACLASS_H
    
    
    class IamAClass {
    public:
        int return_Zero();
    };
    
    
    #endif //TEST_IAMACLASS_H
    
    ```
    ```cpp
    //
    // Created by anon on 2019/4/14.
    //
    
    #include "IamAClass.h"
    
    int IamAClass::return_Zero() {
        return 0;
    }
    
    ```
5. 编写`Test_DIR/CMakeLists.txt`。

    ```
    add_subdirectory(lib/googletest-master)
    add_subdirectory(tests)
    ```
6. 为`Test_DIR/tests/CMakeLists.txt`设置项目名称、链接文件、导入库文件，并为`tests`添加两个测试文件`testFILE_1.cpp`，`testFILE_2.cpp`。

    CMakeLists.txt
    ```
    add_executable(run_actual_tests testFILE_1.cpp testFILE_2.cpp  ../../Project_DIR/Source/IamAClass.cpp)
    
    target_link_libraries(run_actual_tests gtest gtest_main)
    ```
    testFILE_1.cpp
    ```cpp
    //
    // Created by anon on 2019/4/14.
    //
    
    #include "gtest/gtest.h"
    #include "IamAClass.h"
    
    namespace {
        class TestClass:public testing::Test{
        public:
            IamAClass test_IamClass_obj;
        };
    }
    
    TEST_F(TestClass,Test_ReturnZeroMethod){
        ASSERT_EQ(test_IamClass_obj.return_Zero(),0);
    }
    
    TEST_F(TestClass,Test_ReturnZeroMethod_1){
        ASSERT_EQ(test_IamClass_obj.return_Zero(),1);
    }
    ```
    
   testFILE_2.cpp
    ```cpp
    //
    // Created by anon on 2019/4/14.
    //
    
    #include "gtest/gtest.h"
    
    TEST(SUITE_A,TEST_A){
        ASSERT_EQ(1,1);
    }
    TEST(SUITE_A,TEST_B){
        ASSERT_EQ(1,2);
    }
    TEST(SUITE_B,TEST_A){
        ASSERT_EQ(1,1);
    }
    TEST(SUITE_B,TEST_B){
        ASSERT_EQ(1,2);
    }
    ```

7. 编译运行target`run_actual_tests`（如果不存在这个配置选项，可以手动添加cmake类型）。
    <div style="text-align: center;"><img style="height:;width:" alt="" title="" src="/image/2019/04/14/Snipaste_2019-04-14_21-26-31.png"></div>

8. 使用Clion内置的Google Test配置工具，进行特定SUITE的测试。
    <div style="text-align: center;"><img style="height:;width:" alt="" title="" src="/image/2019/04/14/Snipaste_2019-04-14_21-30-14.png"></div>
    <div style="text-align: center;"><img style="height:;width:" alt="" title="" src="/image/2019/04/14/Snipaste_2019-04-14_21-31-38.png"></div>

## 样例项目下载

[地址](https://github.com/eMous/GoogleTestClionExample.git)

## Reference
[^1]:[StackOverflow@Wernight](https://stackoverflow.com/questions/242926/comparison-of-c-unit-test-frameworks)

[^2]:[StackOverflow@Wernight](https://stackoverflow.com/questions/242926/comparison-of-c-unit-test-frameworks)

[^3]:[CATCH原作者：StackOverflow@philsquared](https://stackoverflow.com/questions/242926/comparison-of-c-unit-test-frameworks)