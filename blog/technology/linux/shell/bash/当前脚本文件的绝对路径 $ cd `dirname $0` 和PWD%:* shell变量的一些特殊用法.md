# 当前脚本文件的绝对路径

test.sh  代码如下：

```
#!/bin/sh
WEB_BASE=$(cd "$(dirname $0)";pwd)
echo $WEB_BASE
```

运行结果 就是当前脚本文件的绝对路径: 

$ ./test.sh 

/home/webdata/commoditysupport







[$ cd `dirname $0` 和PWD%/* shell变量的一些特殊用法](http://www.cnblogs.com/xd502djj/archive/2012/06/21/2557447.html)

在命令行状态下单纯执行 $ cd `dirname $0` 是毫无意义的。因为他返回当前路径的"."。
**这个命令写在脚本文件里才有作用，他返回这个脚本文件放置的目录，并可以根据这个目录来定位所要运行程序的相对位置（绝对位置除外）。**
在/home/admin/test/下新建test.sh内容如下：

1. cd `dirname $0`
2. echo `pwd`

然后返回到/home/admin/执行

1. sh test/test.sh

运行结果:

1. /home/admin/test

这样就可以知道一些和脚本一起部署的文件的位置了，只要知道相对位置就可以根据这个目录来定位，而可以不用关心绝对位置。这样脚本的可移植性就提高了，扔到任何一台服务器，（如果是部署脚本）都可以执行。

## PWD%/* shell变量的一些特殊用法

**BASH使用基础**

 

 

**关于命令及命令类型**

对于使用的命令BASH使用hash表，以加速下次的查找，为添加一个经常使用的命令，可以使用hash cmd
BASH在执行命令时对路径中找到的同名命令按以下的类型顺序执行：别名 keywords 函数 内置命令 可执行文件或脚本
BASH在执行用户输入的一条指令时，首先要判断命令的类型，可以使用type cmd来查看cmd是类型。
enable命令用来决定是否开启某个内置的命令，可以用enable -n cmd来禁用某个内置命令。
command命令用来消除别名和函数的查找。
builtin命令将只查找内置命令，而忽略函数和可执行文件。

 

作业控制：jobs %1 fg bg kill stop等
别名：alias dir='dir -l' unalisa dir
操作目录栈：dirs  pushd popd
文件名替换：dir d[1-3]  ls .bash{rc,profile}  支持[]对数字及{}对字符串的集合

 

**变量**变量声明：declare -a 数组 -f 函数 -i 整数 -r 只读 -x 导出变量
本地变量只在其所声明的shell中有效，只读变量不能被修改，除非重新声明其属性
常见的环境变量：
BASH_VERSION DIRSTACK EUID EDITOR GROUPS HISTFILE HISTSIZE HOME LANG PWD OLDPWD PATH
PPID PS1-4 RANDOM SHELL UID 
export var = value -f 导出的变量为函数 -n 将全局转为局部变量 -p只打印导出的变量
非只读变量可以通过unset清除、

 

**变量替换**
${var:-word}  如果变量var已经设置且非空，结果为var的值，否则结果为word
${var:=word}  如果变量var已经设置且非空，结果为var的值，否则设置var为word
${var:+word}  如果变量var已经设置且非空，则设置var的值为word;否则不替换
${var:?word}  如果变量var已经设置且非空，则替换为word，否则退出shell。
${var:n}      替换为从n开始的子串
${var:n:len}  替换为从n开始长len的子串
**变量扩展**

${var%pattern}      去掉最小匹配的后缀   echo ${PWD%/*}   显示当前的父目录路径
${var%%pattern}     去掉最大匹配的后缀
${var#pattern}      去掉最小匹配的前缀   
${var##pattern}     去掉最大匹配的前缀   echo ${PWD##*/}  显示当前目录名称
${#var}             替换为变量字符个数
**特殊变量**
$ 当前SHELL的PID
? 前一个命令的退出状态
! 后台执行的上一个工作的PID

**读取用户输入**
read                        从终端读取输入存入内置变量REPLY
read var                  从终端读取输入存入变量var    
read first .. last       从终端读取多个变量依次存入，若输入较多，则最后一个变量成为包含多个值的字串
read -a array          从终端读取多个值存入数组中
read -p pmtstring var   向终端输出提示串，然后读入输入到var中
read -r line              读取一行，并允许/

**变量类型转换**如果变量在声明时没确定类型，则变量根据赋值情况可以动态转换类型，但如果声明时变量类型已经确定，若赋值为其他类型，将导致原有数据丢失或出错。除非重新声明类型。
对于整数类型的变量，则在命令行支持算法扩展，如num=3*4，支持""，不支持空格。
**进制**

var=16#abc   var为16进制数abc

**输出**
printf "The number is %.2f/n" 100
echo -ne "hello/nworld/n"  -e 表示需要解析转义字符，-n 表示不自动添加换行符

**位置参数**
$0 1-0 ${10}
$#  求值位置参数个数
$*  求值所有位置参数
"$*"
$@
"$@"

 

**引用**
() 命令组，创建子SHELL执行
{} 命令组，不创建子SHELL
' ' 保护所有的元字符不被解析，想打印'，必须放在双引号内，或者使用/转义
" " 只允许变量和命令替换，保护其余的元字符不被解析

 

**命令替换**
`cmd`
$(cmd)
二者结果都是一个字符串，如果加""，则保留换行，否则丢失换行。

 

**数学表达式扩展**$[ exp ]
$(( exp ))

f

**数组**

declare -a array=(item1 item2 ...)
数组元素的引用 ${array[i]} 
引用整个数组 ${array[*]} 
unset array

 

**函数定义**function f()
{
cmd;cmd;
}

 

**I/O重定向**
find . name /*.c print > foundit 2>&1

 

 

**命令行参数**

set可用来设置位置参数，使用set --将清除所有位置参数
$*与$@的区别只在于" "时，当$*放在""内时，参数表成为单个字符串，而$@放在""内时，每个参数都被引号括住。

 

**表达式**

 

**评估表达式**

expr $[3+4] $[ 3+4 ]  $(( 3+4 ))

**let算术扩展**
let i=i+1 支持任何C类型的运算符，但只支持整形数运算
bash不支持小数运行，因此需要在bc或者awk中进行相应的运行，再把结果回。由于bash没有浮点型，所以小数是以字符串表示。

测试表达可以与let的运算扩展及(( ))中的C型运算扩展是等价的，后者也许更容易理解，C-like。

 

**条件控制**
if command
then
command
command
fi

 

if test expression
then
command
fi

 

if [ string/numeric expression ] then
command
fi

 

if [[ string expression ]] then
command
fi

 

if (( numeric expression ))

if command
then
command(s)
else
command(s)
fi

if command
then
command(s)
elif command
then
commands(s)
elif command
then
command(s)
else
command(s)
fi

 

空命令  ：

 

**分支跳转**
case variable in 
value1)
command(s)
;;
value2)
command(s)
;;
*)
command(s)
;;
esac

 

**循环**for variable in word_list
do
command(s)
done

while condition
do
command(s)
done

until command
do
​     command(s)
done

 

**构建菜单的select**select program in 'ls -F' pwd date
 do
 $program
 done

 

**中断循环**break [n]     从第n层循环中跳出
continue [n]  继续第n层循环

 

**捕获信号信号列表**
1) SIGHUP 9) SIGKILL 17) SIGCHLD 25) SIGXFSZ
2) SIGINT 10) SIGUSR1 18) SIGCONT 26) SIGVTALRM
3) SIGQUIT 11) SIGSEGV 19) SIGSTOP 27) SIGPROF
4) SIGILL 12) SIGUSR2 20) SIGTSTP 28) SIGWINCH
5) SIGTRAP 13) SIGPIPE 21) SIGTTIN 29) SIGIO
6) SIGABRT 14) SIGALRM 22) SIGTTOU 30) SIGPWR
7) SIGBUS 15) SIGTERM 23) SIGURG
8) SIGFPE 16) SIGSTKFLT 24) SIGXCPU
trap 'command; command' signal-number-list
trap 'command; command' signal-name-list  处理信号，当收到singal-list中的信号后，执行 ''中的命令
trap singal   重置信号处理函数
trap          列出已经设置信号处理

 

**调试脚本**
bash -x   script    显示命令执行过程，及结果
bash -v   script    显示脚本中的各行
bash -n   script    解释但不执行

 

**附录:**

**常用命令**
script myfile  将终端交互信息保存在myfile中，使用control+d退出
fuser -n tcp 22 获得打开tcp 22的进程
lsof            获得进程打开的文件

摘自:

<http://hi.baidu.com/lianhuxu/blog/item/d059b8b569271ec337d3ca5a.html>

<http://hi.baidu.com/lixinxinhit/item/9d95758a39324756e63d1909>

来源： <<http://blog.csdn.net/h70614959/article/details/8985165>>

 