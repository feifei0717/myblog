# linux下的﻿﻿stdin,stdout,stderr详解



stdout, stdin, stderr的中文名字分别是标准输出，标准输入和标准错误。

 

在Linux下，当一个用户进程被创建的时候，系统会自动为该进程创建三个数据

流，也就是题目中所提到的这三个。那么什么是数据流呢（stream）？我们知道，一个程序要运行，需要有输入、输出，如果出错，还要能表现出自身的错误。这是就要从某个地方读入数据、将数据输出到某个地方，这就够成了数据流。

 

因此，一个进程初期所拥有的这么三个数据流，就分别是标准输出、标准输入和标准错误，分别用stdout, stdin, stderr来表示。对于这三个数据流来说，默认是表现在用户终端上的，比如我们在c中使用fprintf:

fprintf(stdout,"hello world!\n");

 

屏幕上将打印出"hello world!"来，同样，我们使用：

上面的代码会接收用户输入在终端里的字符，并存在ptr中。

fread(ptr,1,10,stdin);

 

那么标准输入输出和错误是不是只能反应在终端里呢？答案是不是的！我们可以

将标准输入和输出重定位到文件中：

例如，我们使用ls命令，会把当前目录下的文件名输出到终端上：

$ls

gcc  gcc.sh gmp-5.0.1 gmp-5.0.1.tar.bz2

linux-loongson-community-2.6.35-rc1 longene-0.3.0-linux-2.6.34

mpfr-3.0.0 mpfr-3.0.0.tar.gz oprofile-0.9.6

我们可以使用“ > ”符号，将ls的标准输出重定向到文件中：

$ls  >  lsout ////////将标准输出重定向为文件lsout

$more  lsout ////////显示lsout文件里的内容

gcc  gcc.sh gmp-5.0.1 gmp-5.0.1.tar.bz2

linux-loongson-community-2.6.35-rc1 longene-0.3.0-linux-2.6.34

mpfr-3.0.0 mpfr-3.0.0.tar.gz oprofile-0.9.6

同样，我们也可以使用“ < ”符号将标准输入重定向到文件中，以sort为例，以下示例使用 sort命令对由键盘键入的文本进行排序。键入ctrl-D 结束标准输入。终端屏幕显示的标准输出如下：

$sort

muffy

happy

bumpy

CTRL-D //结束标准输入。

 

bumpy

happy

muffy //结束标准输出。

 

使用" < "重定向后为：

$ more socks 显示 socks的内容。

polka dot

argyle

plaid 

 

$ sort < socks 将输入重定向为从 socks输入，并将内容排序。

argyle

plaid

polka dot

好，基本知识讲完了，我们知道，标准输出和标准错误默认都是将信息输出到终端上，那么他们有什么区别呢？让我们来看个题目：

 

问题：下面程序的输出是什么？（intell笔试2011）

Int  main(){

fprintf(stdout,"Hello ");

fprintf(stderr,"World!");

return0;

}

解答：这段代码的输出是什么呢？你可以快速的将代码敲入你电脑上（当然，拷贝更快），然后发现输出是

World! Hello

这是为什么呢？在默认情况下，stdout是行缓冲的，他的输出会放在一个buffer里面，只有到换行的时候，才会输出到屏幕。而stderr是无缓冲的，会直接输出，举例来说就是printf(stdout, "xxxx") 和 printf(stdout, "xxxx\n")，前者会憋住，直到遇到新行才会一起输出。而printf(stderr, "xxxxx")，不管有么有\n，都输出。





http://blog.csdn.net/yinjiabin/article/details/7419895