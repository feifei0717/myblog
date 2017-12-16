最近杂事太多，正事进展缓慢。Fighting！

linux命令行提供了非常强大的文本处理功能，组合利用linux命令能实现好多强大的功能。本文这里举例说明如何利用Linux命令行进行文本按行去重并按重复次数排序。主要用到的命令有sort，uniq和cut。其中，sort主要功能是排序，uniq主要功能是实现相邻文本行的去重，cut可以从文本行中提取相应的文本列(简单地说，就是按列操作文本行)。

用于演示的测试文件内容如下：

```
Hello World.  
Apple and Nokia.  
Hello World.  
I wanna buy an Apple device.  
The Iphone of Apple company.  
Hello World.  
The Iphone of Apple company.  
My name is Friendfish.  
Hello World.  
Apple and Nokia. 
```

  

实现命令及过程如下：

```
1、文本行去重  
(1)排序  
由于uniq命令只能对相邻行进行去重复操作，所以在进行去重前，先要对文本行进行排序，使重复行集中到一起。  
$ sort test.txt   
Apple and Nokia.  
Apple and Nokia.  
Hello World.  
Hello World.  
Hello World.  
Hello World.  
I wanna buy an Apple device.  
My name is Friendfish.  
The Iphone of Apple company.  
The Iphone of Apple company.  
(2)去掉相邻的重复行  
$ sort test.txt | uniq  
Apple and Nokia.  
Hello World.  
I wanna buy an Apple device.  
My name is Friendfish.  
The Iphone of Apple company.  
  
2、文本行去重并按重复次数排序  
(1)首先，对文本行进行去重并统计重复次数(uniq命令加-c选项可以实现对重复次数进行统计。)。  
$ sort test.txt | uniq -c  
      2 Apple and Nokia.  
      4 Hello World.  
      1 I wanna buy an Apple device.  
      1 My name is Friendfish.  
      2 The Iphone of Apple company.  
(2)对文本行按重复次数进行排序。  
sort -n可以识别每行开头的数字，并按其大小对文本行进行排序。默认是按升序排列，如果想要按降序要加-r选项(sort -rn)。  
$ sort test.txt | uniq -c | sort -rn  
      4 Hello World.  
      2 The Iphone of Apple company.  
      2 Apple and Nokia.  
      1 My name is Friendfish.  
      1 I wanna buy an Apple device.  
(3)每行前面的删除重复次数。  
cut命令可以按列操作文本行。可以看出前面的重复次数占8个字符，因此，可以用命令cut -c 9- 取出每行第9个及其以后的字符。  
$ sort test.txt | uniq -c | sort -rn | cut -c 9-  
Hello World.  
The Iphone of Apple company.  
Apple and Nokia.  
My name is Friendfish.  
I wanna buy an Apple device.  
```

下面附带说一下cut命令的使用，用法如下：

```
cut -b list [-n] [file ...]  
cut -c list [file ...]  
cut -f list [-d delim][-s][file ...]  
  
上面的-b、-c、-f分别表示字节、字符、字段（即byte、character、field）；  
list表示-b、-c、-f操作范围，-n常常表示具体数字；  
file表示的自然是要操作的文本文件的名称；  
delim（英文全写：delimiter）表示分隔符，默认情况下为TAB；  
-s表示不包括那些不含分隔符的行（这样有利于去掉注释和标题）  
三种方式中，表示从指定的范围中提取字节（-b）、或字符（-c）、或字段（-f）。  
  
范围的表示方法：  
      n   只有第n项   
      n-  从第n项一直到行尾  
      n-m 从第n项到第m项(包括m)  
      -m  从一行的开始到第m项(包括m)  
      -   从一行的开始到结束的所有项  
```

在写这篇文章的时候，用到了vim的大小写转化的快捷键：gu变小写，gU变大写。结合ctrl+v能够将一片文字中的字符进行大小写转换，非常好用。最后附加一个小段子：

用django的时候，启动web服务器，出现如下错误：

```
Django version 1.5.4, using settings 'mysite.settings'  
Development server is running at http://127.0.0.1:8000/  
Quit the server with CONTROL-C.  
Error: That port is already in use.  
```

解决方法有两个：

(1) 加端口参数

[Python](http://lib.csdn.net/base/11) manage.py runserver 8080
(2) 终止占用端口的进程
sudo netstat -tulpn | grep :8000
kill -9 <进程pid>