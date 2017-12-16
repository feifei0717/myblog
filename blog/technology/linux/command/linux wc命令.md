# linux wc命令



Linux系统中的wc(Word Count)命令的功能为统计指定文件中的字节数、字数、行数，并将统计结果显示输出。

## 1．命令格式：

wc [选项]文件...

## 2．命令功能：

统计指定文件中的字节数、字数、行数，并将统计结果显示输出。该命令统计指定文件中的字节数、字数、行数。如果没有给出文件名，则从标准输入读取。wc同时也给出所指定文件的总统计数。

## 3．命令参数：

-c 统计字节数。

-l 统计行数。

-m 统计字符数。这个标志不能与 -c 标志一起使用。

-w 统计字数。一个字被定义为由空白、跳格或换行字符分隔的字符串。

-L 打印最长行的长度。

-help 显示帮助信息

--version 显示版本信息

## 4．使用实例：

### 实例1：查看文件的字节数、字数、行数

命令：

wc test.txt

输出：

```
[root@localhost test]# cat test.txt 
hnlinux
peida.cnblogs.com
ubuntu
ubuntu linux
redhat
Redhat
linuxmint
[root@localhost test]# wc test.txt
 7  8 70 test.txt
[root@localhost test]# wc -l test.txt 
7 test.txt
[root@localhost test]# wc -c test.txt 
70 test.txt
[root@localhost test]# wc -w test.txt 
8 test.txt
[root@localhost test]# wc -m test.txt 
70 test.txt
[root@localhost test]# wc -L test.txt 
17 test.txt
```

说明：

7       8          70        test.txt

行数 单词数 字节数 文件名

### 实例2：用wc命令怎么做到只打印统计数字不打印文件名

命令：

输出：

```
[root@localhost test]# wc -l test.txt 
7 test.txt
[root@localhost test]# cat test.txt |wc -l
7
[root@localhost test]#
```

说明：

使用管道线，这在编写shell脚本时特别有用。

### 实例3：用来统计当前目录下的文件数

命令：

ls -l | wc -l

输出：

```
[root@localhost test]# cd test6
[root@localhost test6]# ll
总计 604
---xr--r-- 1 root mail  302108 11-30 08:39 linklog.log
---xr--r-- 1 mail users 302108 11-30 08:39 log2012.log
-rw-r--r-- 1 mail users     61 11-30 08:39 log2013.log
-rw-r--r-- 1 root mail       0 11-30 08:39 log2014.log
-rw-r--r-- 1 root mail       0 11-30 08:39 log2015.log
-rw-r--r-- 1 root mail       0 11-30 08:39 log2016.log
-rw-r--r-- 1 root mail       0 11-30 08:39 log2017.log
[root@localhost test6]# ls -l | wc -l
8
[root@localhost test6]#
```

说明：

数量中包含当前目录





http://www.cnblogs.com/peida/archive/2012/12/18/2822758.html