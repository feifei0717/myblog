[TOC]



# linux awk实例：简单入门 

Awk是一种处理结构数据并输出格式化结果的编程语言， Awk 是其作者 "Aho,Weinberger,Kernighan" 的简称。

Awk通常被用来进行格式扫描和处理。通过扫描一个或多个文件中的行，查看是否匹配指定的正则表达式，并执行相关的操作。

Awk的主要特性包含：

1. Awk以记录和字段的方式来查看文本文件

2. 和其他编程语言一样，Awk 包含变量、条件和循环

3. Awk能够进行运算和字符串操作

4. Awk能够生成格式化的报表数据

Awk从一个文件或者标准输入中读取数据，并输出结果到标准输出中。

## 1.  Awk的语法

```
Syntax:    
    
awk '/search pattern1/ {Actions}    
     /search pattern2/ {Actions}' file   
```

在上诉语法中：

1. search pattern是正则表达式

2. Actions 输出的语法

3. 在Awk 中可以存在多个正则表达式和多个输出定义

4. file 输入文件名

5. 单引号的作用是包裹起来防止shell 截断



## 2.  Awk的工作方式：

1） Awk 一次读取文件中的一行

2）对于一行，按照给定的正则表达式的顺序进行匹配，如果匹配则执行对应的 Action

3）如果没有匹配上则不执行任何动作

4）在上诉的语法中， Search Pattern 和 Action 是可选的，但是必须提供其中一个

5）如果 Search Pattern 未提供，则对所有的输入行执行 Action 操作

6）如果 Action 未提供，则默认打印出该行的数据

7） {} 这种 Action 不做任何事情，和未提供的 Action 的工作方式不一样

8） Action 中的语句应该使用分号分隔

创建一个包含下面内容的文本文件employee.txt 。后续的例子中将会用到该文件

 

```
$cat employee.txt    
100  Thomas  Manager    Sales       $5,000    
200  Jason   Developer  Technology  $5,500    
300  Sanjay  Sysadmin   Technology  $7,000    
400  Nisha   Manager    Marketing   $9,500    
500  Randy   DBA        Technology  $6,000  
```

 

## 3.  Awk 的默认行为

默认的时候awk 打印文件中的每一行

 

```
$ awk '{print;}' employee.txt    
100  Thomas  Manager    Sales       $5,000    
200  Jason   Developer  Technology  $5,500    
300  Sanjay  Sysadmin   Technology  $7,000    
400  Nisha   Manager    Marketing   $9,500    
500  Randy   DBA      Technology  $6,000  
```

 

在上面的例子中，匹配的正则表达式未给出，因此后续的Action 适用所有的行， Action 中的 print 没有任何参数的情况下将打印整行，注意其中的 Action 必须使用 {} 括起来。

## 4.  Awk打印匹配的行

```
$ awk '/Thomas/    
> /Nisha/' employee.txt    
100  Thomas  Manager    Sales       $5,000    
400  Nisha   Manager    Marketing   $9,500   
```

 

在上面的例子中，将打印包含Thomas 和 Nisha 的行，上面的列子包含两个正则表达式。 Awk 可以接受任意数量的正则表达式，但是每个组合 ( 正则表达式和对应的 Action) 必须用新行来分隔。

## 5.  Awk仅打印指定的域

Awk包含许多内建的变量，对于每行的记录， Awk 默认按照空格进行分割，并将分隔后的值存入对应的 $n 变量中。如果一行还有 4 个单词，将被分别存储进 $1 $2 $3 $4 中，其中 $0 代表整行。 NF 也是一个内建的变量，代表该行中分割后的变量数。

```
$ awk '{print $2,$5;}' employee.txt    
Thomas $5,000    
Jason $5,500    
Sanjay $7,000    
Nisha $9,500    
Randy $6,000    
$ awk '{print $2,$NF;}' employee.txt    
Thomas $5,000    
Jason $5,500    
Sanjay $7,000    
Nisha $9,500    
Randy $6,000  
```




在上诉例子中$2 和 $5 分别代表名字和薪水，也可以使用 $NF 获得薪水，其中 $NF 代表最后一个字段，在打印语句中逗号是一个连接符号。

## 6.  Awk开始和最后的动作

Awk包含两个重要的关键字 BEGIN 和 END

 

```
Syntax:     
    
BEGIN { Actions}    
{ACTION} # Action for everyline in a file    
END { Actions }    
# Awk中的注释  
```

 

在BEGIN 节中的 Actions 会在读取文件中的行之前被执行。

而END 节中的 Actions 会在读取并处理文件中的所有行后被执行。

 

```

$ awk 'BEGIN {print "Name/tDesignation/tDepartment/tSalary";}    
> {print $2,"/t",$3,"/t",$4,"/t",$NF;}    
> END{print "Report Generated/n--------------";    
> }' employee.txt    
Name Designation Department Salary    
Thomas   Manager   Sales           $5,000    
Jason   Developer   Technology   $5,500    
Sanjay   Sysadmin   Technology   $7,000    
Nisha   Manager   Marketing   $9,500    
Randy   DBA     Technology   $6,000    
Report Generated    
--------------  
```

 

上述的例子为输出结果增加头和尾描述

## 7.  Awk找出员工 ID 大于 200 的员工

```
$ awk '$1 >200' employee.txt    
300  Sanjay  Sysadmin   Technology  $7,000    
400  Nisha   Manager    Marketing   $9,500    
500  Randy   DBA        Technology  $6,000 
```

 

在上述例子中，$1 代表员工 ID ，如果员工 ID 大于 200 则执行默认的打印整行的 Action 。

## 8.  Awk打印技术部员工

$4代表员工所在的部门，如果等于 Technology 则打印出整行

```
$ awk '$4 ~/Technology/' employee.txt    
200  Jason   Developer  Technology  $5,500    
300  Sanjay  Sysadmin   Technology  $7,000    
500  Randy   DBA      Technology  $6,000  
```

 

~操作符是和正则表达式中的值进行比较，如果匹配则打印整行

## 9.  Awk打印技术部门的员工数

在下面的例子中，检查员工的部门是否是Technology ，如果是则递增 count 变量的值。 Count 变量的值在BEGIN 的 Actions 中被初始化为 0 。

```
$ awk 'BEGIN { count=0;}    
$4 ~ /Technology/ { count++; }    
END { print "Number of employees in Technology Dept =",count;}' employee.txt    
Number of employees in Tehcnology Dept = 3 
```

在处理的最后(END 的 Actions) ，仅仅打印出 Technology 部门的人数

## 10.  Awk 分隔符(-F选项)awk [-Field-separator] 'commands' input-file(s) 

这里commands是真正的awk命令，[-F域分隔符]是可选的，awk默认使用空格分隔，因此如果要浏览域间有空格的文本，不必指定这个选项，但如果浏览如passwd文件，此文件各域使用冒号作为分隔符，则必须使用-F选项:   awk -F : 'commands' input-file

 

来源： [http://blog.csdn.net/andyxm/article/details/5964071](http://blog.csdn.net/andyxm/article/details/5964071)