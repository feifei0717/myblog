# Linux中变量$_,$@,$0,$1,$2,$_,$$,$_的含义

分类: linux
日期: 2015-03-15

原文地址: 

http://blog.chinaunix.net/uid-29632145-id-4894198.html

------

****[Linux中变量$#,$@,$0,$1,$2,$*,$$,$?的含义]() *2015-03-15 21:36:29*

分类： LINUX

我们先写一个简单的脚本，执行以后再解释各个变量的意义

 

\# touch variable

\# vi variable

 

脚本内容如下：

 

\#!/bin/sh

echo "number:$#"
echo "scname:$0"
echo "first :$1"
echo "second:$2"
echo "argume:$@"

echo "show parm list:$*"
echo "show process id:$$"

echo "show precomm stat: $?"

保存退出

 

赋予脚本执行权限

 

\# chmod +x variable

 

执行脚本

 

\# ./variable aa bb

number:2
scname:./variable
first:aa
second:bb
argume:aa bb

show parm list:aa bb
show process id:24544

show precomm stat:0

通过显示结果可以看到：

 

$# 是传给脚本的参数个数

$0 是脚本本身的名字$1 是传递给该shell脚本的第一个参数$2 是传递给该shell脚本的第二个参数

$@ 是传给脚本的所有参数的列表

$* 是以一个单字符串显示所有向脚本传递的参数，与位置变量不同，参数可超过9个

$$ 是脚本运行的当前进程ID号

$? 是显示最后命令的退出状态，0表示没有错误，其他表示有错误