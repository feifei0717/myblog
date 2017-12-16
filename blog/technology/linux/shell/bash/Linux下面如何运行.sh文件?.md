# Linux下面如何运行.sh文件？

本文介绍Linux下面用命令如何运行.sh文件的方法，有两种方法：

一、直接./加上文件名.sh，如运行hello.sh为./hello.sh【hello.sh必须有x权限】

二、直接sh 加上文件名.sh，如运行hello.sh为sh hello.sh【hello.sh可以没有x权限】

## 工具/原料

- windows、linux
- xshell

## 方法一：当前目录执行.sh文件

1. 1

   **【步骤一】cd到.sh文件所在目录**

   比如以hello.sh文件为例，如下图

   ​

2. 2

   **【步骤二】给.sh文件添加x执行权限**

   比如以hello.sh文件为例，chmod u+x hello.sh，如下图

   ​

3. 3

   **【步骤三】./执行.sh文件**

   比如以hello.sh文件为例，./hello.sh 即可执行hello.sh文件，如下图

   ​

4. 4

   **【步骤四】sh 执行.sh文件**

   以hello.sh文件为例，sh hello.sh即可执行hello.sh文件，如下图

   ​

   END

## 方法二：绝对路径执行.sh文件

1. ​

   下面三种方法都可以，如下图

   ./home/test/shell/hello.sh

   /home/test/shell/hello.sh

   sh /home/test/shell/hello.sh

   ​





http://jingyan.baidu.com/article/3f16e003e51a752591c103a4.html