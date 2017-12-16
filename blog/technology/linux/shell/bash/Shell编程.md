# Shell编程

shell :弱类型、 解释型语言

解释器：bash

## 一、变量

### bash的变量类型：

​       环境变量

​       本地变量（局部变量）

​       位置变量

​       特殊变量：bash内置的用来保存某些特殊数据的变量。（也叫系统变量）

#### 本地变量：

只属于某一个bash的变量。

​       var_name=值

​       作用域：整个bash进程

#### 局部变量：

​       localvar_name =值，      

​       作用域：当前代码段。

#### 环境变量：

​       export名字=值

​       作用域：当前的shell和其子shell。

注意：脚本在执行时都会启动一个子shell进程：

​       命令行中启动的脚本会继承当前shell环境变量。

​       系统自动启动脚本（非命令行启动）：则需要自我定义环境变量。

#### 位置变量： 

用于 脚本执行的参数，$1 表示第一个参数，以此类推

​       $1,$2….

#### 特殊变量：

​       $?:上一个命令的执行状态返回值。

​    $#传递到脚本的参数个数

$* 传递到脚本的参数，与位置变量不同，此选项参数可超过9个

$$ 脚本运行时当前进程的ID号，常用作临时变量的后缀，如 haison.$$

$! 后台运行的（&）最后一个进程的ID号

$@ 与$#相同，使用时加引号，并在引号中返回参数个数

$- 上一个命令的最后一个参数

$? 最后命令的退出状态，0表示没有错误，其他任何值表明有错误

 

### 程序有两类返回值：

1、         执行结果

2、         执行状态，$? : 0:表示正确，1-255：错误. (echo "$?" 查看)

### 输出重定向：

\>覆盖重定向

\>> 追加重定向

2> 错误覆盖重定向

2>>错误追加重定向

&> 全部重定向

/dev/null 文件

如果希望执行某个命令，但又不希望在屏幕上显示输出结果，那么可以将输出重定向到 /dev/null：

    $ command > /dev/null

/dev/null 是一个特殊的文件，写入到它的内容都会被丢弃；如果尝试从该文件读取内容，那么什么也读不到。但是 /dev/null 文件非常有用，将命令的输出重定向到它，会起到"禁止输出"的效果。

如果希望屏蔽 stdout 和 stderr，可以这样写：

    $ command > /dev/null 2>&1

注意：0 是标准输入（STDIN），1 是标准输出（STDOUT），2 是标准错误输出（STDERR）。

### 撤销变量：

​       unset  变量名

 

### 查看shell中变量：

set  命令

### 查看shell中的环境变量

printenv

env

export

### 引用变量：

${变量名}，一般可以省略{}

​                                     

### 单引号：

强引用，不作变量替换

### 双引号：

弱引用，做变量替换

```
[vmware01@localhost ~]$  A=1
[vmware01@localhost ~]$ echo "$A"
1
[vmware01@localhost ~]$ echo "${A}l"
1l
```



### 反引号：

``命令替换

```
[vmware01@localhost ~]$ echo "this dir is `pwd`"
this dir is /home/vmware01
```

使用在写shell脚本的时候需要实时执行命令用这个

```
localpath  = `pwd`
```

 

## 二、脚本

### 介绍说明

脚本：命令的堆砌。

 **注意：shell只能处理简单业务需求，如果需要处理复杂的用python处理**

练习：写一个脚本，完成以下任务。

1、         添加5个用户，user1，，，，user5

2、         每个用户的密码同用户名，要求：添加密码完成后不显示passwd执行结果。

3、         显示添加成功信息

```
#!/bin/bash
#
#
useradd $1
echo $1 | passwd --stdin $1 &>/dev/null
echo "Add User $1 success."
```







### 逻辑判断（&&和||和 ！）：

​       在linux 中 命令执行状态：0 为真，其他为假

​       

​       逻辑与： &&

​       逻辑或： ||

​       逻辑非： ！



关于&&和||

这个是用于联合两个命令的，逻辑与（&&）和逻辑或（||），在if和循环的判断式中的意义与C语言中是一样的。

逻辑与：表示两个同时为真，则改表达式为真，否则为假。

逻辑或：表示任意一个为真，则表达式为真，否则为假。

但是在test命令中，这两个操作符的意义有所 不同

| 命令格式           | 解释                                       |
| -------------- | ---------------------------------------- |
| cmd1 && cmd2   | 若cmd1执行完毕且正确执行($?=0)，则开始执行cmd2若cmd1执行完毕且返回出错($?≠0)，则不执行cmd2 |
| cmd1 \|\| cmd2 | 若cmd1执行完毕且正确执行($?=0)，则不执行cmd2若cmd1执行完毕且返回出错($?≠0)，则执行cmd2 |

如果是多于两个命令的联合，执行结果会不断的往后传，影响后面的判断。同时因为$?只有一个，所以这个影响有个就近原则。



1、如果用户user6不存在则添加用户6

```
#第一种方式
！ id user6 &&useradd user6
#第二种方式
Id user6 ||  useradd user6
```

 

2、如果用户不存在，添加用户并显示添加成功，并且设置密码和用户名相同，否则显示其已存在

```
#!/bin/bash
#
#id $1 &>/dev/null :判断用户是否存在
id $1 &>/dev/null && echo "User $1 exit." && exit 2
id $1 &>/dev/null || useradd $1
id $1 &>/dev/null && echo "$1" | passwd --stdin $1 &>/dev/null && echo "Add User $1 success."
```





 

 

练习：给定一个用户，

1、         如果其UID=0，就显示其为管理员，否则显示其为普通用户

 

备注：

passwd默认是要用终端作为标准输入,加上--stdin表示可以用任意文件做标准输入
于是这里用管道作为标准输入

 



### 条件判断：

​       条件表达式：

1、          [ expression  ]

2、         test expression 

```
#如果入参的个数不是1 则打印Args is error. 并退出
[ ! $# -eq 1 ] && echo "Args is error." && exit 5
```

​      整数比较：

​              -eq：  比如：[ $A –eq $B ]

​              -ne， -gt ,-lt,-ge,-le

[ 条件判断 ]，这种方式常用于if语句和while语句中

| 参数              | 功能                                       | 说明                                       |
| --------------- | ---------------------------------------- | ---------------------------------------- |
| -e              | 文件是否存在                                   | 对文件类型的判断test -e file                     |
| -f              | 判断文件名是否存在且为文件                            |                                          |
| -d              | 判断文件名是否存在且为目录                            |                                          |
| -r              | 判断对该文件是否有“可读”权限                          | 对文件权限的检测test -r file                     |
| -w              | 判断对该文件是否有“可写”权限                          |                                          |
| -x              | 判断对该文件是否有“可执行”权限                         |                                          |
| -nt             | （newer than）判断file1是否比file2新             | 两个文件之间的比较test file1 -nt file2            |
| -ot             | （older than）判断file1是否比file2旧             |                                          |
| -ef             | 判断file1和file2是否为同一文件                     |                                          |
| -eq             | 两数值是否相等（equal）                           | 两个整数之间的比较test n1 -eq n2                  |
| -ne             | 两数值是否不等（not equal）                       |                                          |
| -gt             | n1大于n2（greater than）                     |                                          |
| -lt             | n1小于n2（less than）                        |                                          |
| -ge             | n1大于等于n2（greater than or equal）          |                                          |
| -le             | n1小于等于n2（less than or equal）             |                                          |
| test -z string  | 判断字符串是否为空，如果为空，则为true                    | 字符串的判断对参与判断的字符串，最好加上"""，如"$var"这样的格式，不然会产生“参数过多”的错判断相等的时候，"="和"=="是等效的 |
| test -n string  | 判断字符串是否为空，如果为空，则返回false                  |                                          |
| test str1=str2  | 判断str1是否等于str2，若相等，则返回true               |                                          |
| test str1!=str2 | 判断str1是否不等于str2，若相等，则返回false             |                                          |
| -a              | 两个条件同时成立则为真test -r file1 -a test -x file2 | 多重条件的判断                                  |
| -o              | 两个条件任意一个成立则为真test -r file1 -o test -x file2 |                                          |
| !               | 对测试条件结果取反test ! -x file                  |                                          |

这是一些常用的test命令的参数，“[]”的用法与test命令类似，只要去掉test这个命令就行，其余不变。





### 流程控制：

http://www.runoob.com/linux/linux-shell-process-control.html

####  说明

​       If  条件 ；then

​               语句

​       elif  条件 ； then

​           语句

​       else

​               语句

​         fi

 

-a ： 逻辑与，并且 ：  if  [$# -gt 1 –a  $# -lt 3 –o $#  -eq 2 ] ; then

-o ：或者    比如：

#### 示例

如果/etc/inittab文件的行数大于50，就显示好大的文件；

```
#!/bin/bash
#
C=`wc -l /etc/inittab | cut -d ' ' -f1`
if [ $C -gt 50 ] ; then
  echo "big file." 
else
  echo "small file." 
fi
```



练习：判断命令历史中历史命令的总条目大于500，如果大于，则显示“Some command is done.”,否则显示：“OR”。

练习：给定三个整数，判断其中的最大值和最小数。并显示出来

 

bash -n  shell文件 ：检查文件是否有语法错误。

bash -x shell 文件 ：debug 执行文件







### Shell 中如何算术运算

#### 说明

1、         let  算术运算表达式

let  C=$A + $B

2、$[算术表达式]

​      C  =$[$A+$B]

3、$((算术表达式))

​       C=$(($A+$B))

3、         expr  算术表达式  ，注意：表达式中各操作数及运算符之间要有空格。而且要使用命令引用

C=`expr $A + $B`

#### 示例

给定一个用户，获取其密码警告期限，然后判断用户密码使用期限是否已经小于警告期限，如果小于，则是显示“WARN” ，否则显示密码还有多少天到期。

提示：date  +%s     :今天的秒数

​        Cat /etc/shadow   密码时间。

```
#!/bin/bash
#
UN=$1
C_D=`grep "^$UN" /etc/shadow | awk -F: '{print $3}' `
M_D=`grep "^$UN" /etc/shadow | awk -F: '{print $5}' `
W_D=`grep "^$UN" /etc/shadow | awk -F: '{print $6}'`
NOW_D=$[`date +%s`/86400]
U_D=$[$NOW_D-$C_D]
L_D=$[$M_D-$U_D]
if [ $L_D -le $W_D ];then
  echo "warn."
else
  echo "left day is $L_D"
fi

```

exit : 退出脚本

​       退出脚本可以指定脚本执行的状态：exit 0 。























 

### 练习:

指定一个用户名,判断此用户的用户名和它的基本组组名是否相同.

```
#!/bin/bash

if  !id $1 &>/dev/null ; then

  echo “No such user.”

  exit 12

fi

if [ $1 == `id –n –g $1` ] ;then

 echo “xiangtong”

else

 echo “bu xiangtong”

fi
```

 

练习: 判断当前主机的CPU生产商，（其信息保存在/proc/cupinfo文件中）。

如果是：AuthemticAMD ,就显示其为AMD公司

​            GenuineIntel   ，就显示其为 Intel公司

否则，就显示其为非主流公司。

 

练习：将那些可以登录的用户查询出来，并且将用户的帐号信息提取出来，后放入/tmp/test.txt文件中，并给定行号。在行首。

 

循环：进入条件，退出条件

for  变量  in 列表 ； do

语句

done

比如：  for I  in 1  2 3 4 5 ；do

​                  语句

​          done、

如何生成列表：

​       1、{1..100}

​       2、seq  [起始数]   [跨度数]  结束数

​       3、ls  /etc文件列表

练习：依次向/etc/passwd中的每个用户问好：hello 用户名，并显示用户的shell：

​       Hello  ，root  ，your shell ：/bin/bash。

2、         确定是不是当前用户。 

```
#!/bin/bash
USER_ID=`id -u $1`
if [ $USER_ID -eq 0 ] ;then
  echo "admin."
else
  echo "other"
fi
```

 

While 循环

格式一

while 条件;do

语句

[break]

done

格式二 死循环

while true

do

​    语句

done

格式三 死循环

while :

do

​    语句

done

格式四 死循环

while [ 1 ]

do

​    语句

done

格式五 死循环

while [ 0 ]

do

​    语句

done

练习：计算100以内所有能被3整除的整数的和




 

练习：使用echo输出10个随机数，并且一行显示。提示：$RANDOM

练习：传给脚本一个参数：目录，输出该目录中文件最大的，文件名和文件大小：

​       比如：1.txt  100KB

​       ls -l | awk '{print $5,$9}' | sort -nr

​      2、查看该目录下是否有大小为0的文件，如果有则删除。同时显示删除信息。

练习：查询当前192.168.1.x网段内，那些IP被使用了，输出这些IP到一个文件中。

练习：请根据一个关键字，杀掉系统进程中包含此关键字的进程。

echo –n $RANDOM

 

case 语句

case 变量  in

value1）

语句

；；

value2）

   语句

；；

*)

  语句

；；

esac