# linux ls  详解

## **ls -l 列表信息详解**

等同于 ll 

我们平时用ls -l 命令查看一个目录下的文件和子目录的详悉信息时,会得到一个详细的文件和目录名列表.这个列表包含了文件的属性,所属用户,所属组,创建时间,文件大小等等信息.这些信息到底是什么意思呢?有很多初学者对这些不太了解,因此想详悉讲解一下用ls -l命令得到的文件列表每一个字段的意思

以笔者电脑的/root目录为例:

```
[root@gucuiwen root]# ls -l
总用量 4055 
-rw-r--r-- 1 root root 1581 11月 24 18:14 anaconda-ks.cfg 
drwxr-xr-x 2 root root 208 12月 1 13:50 babylinux 
-rw-r--r-- 1 root root 1474560 11月 25 15:02 babylinux.img 
-rw-r--r-- 1 root root 26829 11月 25 15:10 babylinux.png 
lrwxrwxrwx 1 root root 9 1月 4 11:06 disk1.link.png -> disk1.png 
-rw-r--r-- 1 root root 3209 11月 26 12:07 disk1.png 
-rw-r--r-- 1 root root 692 11月 26 13:16 disk2.png 
-rw-r--r-- 1 root root 718 11月 26 13:30 disk3.png 
drwx------ 8 root root 392 1月 4 08:40 evolution 
-rwxr-xr-x 1 root root 13695 11月 30 16:51 fangkuai.sh 
drwxr-xr-x 2 root root 208 12月 28 12:06 FreeBSD 
-rw-r--r-- 1 root root 2315 11月 25 17:19 getMBR.png 
brw-r----- 1 root root 3, 1 1月 4 11:06 hda1 
drwxr-xr-x 2 root root 296 12月 31 11:53 htmls 
-rw-r--r-- 1 root root 21369 11月 24 18:12 install.log 
-rw-r--r-- 1 root root 3024 11月 24 18:12 install.log.syslog 
-rw-r--r-- 1 root root 293 1月 4 10:51 ls.txt 
-rw-r--r-- 1 root root 2237702 11月 25 15:09 magick.miff 
-rw-r--r-- 1 root root 13493 11月 25 17:31 mbr1.png 
-rw-r--r-- 1 root root 8123 11月 25 17:42 mbr2.png 
-rw-r--r-- 1 root root 512 11月 30 16:10 mbr.dat 
-rw-r--r-- 1 root root 64512 11月 26 15:33 partition.doc 
-rw-r--r-- 1 root root 49887 11月 26 15:32 partition.sxw 
-rw-r--r-- 1 root root 1541 12月 18 13:14 passwd 
-rw-r--r-- 1 root root 46320 11月 25 17:28 Screenshot-1.png 
-rw-r--r-- 1 root root 44145 11月 25 17:32 Screenshot-2.png 
-rw-r--r-- 1 root root 43732 11月 25 17:13 Screenshot.png 
drwxr-xr-x 3 root root 72 1月 4 10:49 test 
-rw-r--r-- 1 root root 0 12月 18 10:44 tset 
crw-r----- 1 root root 4, 65 1月 4 11:08 ttyS1 
-rw-r--r-- 1 root root 9754 12月 1 11:25 X.sxw 
-rw-r--r-- 1 root root 8704 11月 29 12:22 员工信息.xls 
-rw-r--r-- 1 root root 19456 11月 26 17:14 搬千计划.xls
```

可以看到,用ls -l命令查看某一个目录会得到一个9个字段的列表.

 

### 第1行:总用量(total) 


这个数值是该目录下所有文件及目录列表第5个字段的和(以k为单位),也就是该目录的大小.请注意和该目录下的文件和子目录下文件的总合做区分.这个数字和du /root 得到的数字的大小是不一样的.可以用awk命令来验证.

用awk累加第5字段得到的数值:

[root@gucuiwen root]# ls -l |awk 'BEGIN{sum=0}{sum+=$5}END{print sum}' 
4104092

转化成以K为单位:

[root@gucuiwen root]# ls -l |awk 'BEGIN{sum=0}{sum+=$5}END{print sum/1024}' 
4007.9

用ls -l得到的数值: 
总用量 4055

用du -sh /root得到的数值: 
[root@gucuiwen root]# du -sh /root 
127M /root

可以看到累加第5个字段得到的值和total显示的是一样的(因为具体算法的不同,略微有差别).得到的数值实际上是root目录的大小(把root目录看成是一个特殊的文件,就可以理解什么是目录的大小).而用du得到的数值是root目录下所由文件和子目录下全部文件的大小的总合.



### 第1字段: 文件属性字段 

		文件类型：
			-：普通文件 (f)
			d: 目录文件
			b: 块设备文件 (block)
			c: 字符设备文件 (character)
			l: 符号链接文件(symbolic link file)
			p: 命令管道文件(pipe)
			s: 套接字文件(socket)
文件属性字段总共有10个字母组成,第一个字母表示文件类型,如果这个字母是一个减号"-",则说明该文件是一个普通文件.字母"d"表示该文件是一个目录,字母"d",是dirtectory(目录)的缩写.请注意,一个目录或者说一个文件夹是一个特殊文件,这个特殊文件存放的是其他文件和文件夹的相关信息.

如果该字母是"l",表示该文件是一个符号链接.符号链接的概念类似于windows里的快捷方式.字母"l"是link(链接)的缩写.在UNIX类系统中,一个文件可以有多个文件名,一个文件的多个文件名之间互称为硬链接(hard link).这些文件头可以指向同一个文件,删除其中一个文件名并不能删除该文件,只有把指向该文件的所有硬链接都删除,这个文件所占用的空间才真正被释放,该文件才真正被删除.这和windows是有很大区别的,windows中不允许一个文件有两个以上文件名,如果存在这中情况,则被认为是文件系统错误.如果你以前在windows下玩过DEBUG就知道,可以用DEBUG修改一张软盘上的根目录,使一个文件同时具有两个文件名.但是修改好后用 scandisk监测的时候会被认为是交叉链接错误.

开头为b的表示块设备文件(block),,设备文件是普通文件和程序访问硬件设备的入口,是很特殊的文件.它的没有文件大小,只有一个主设备号和一个辅设备号.上面的hda1就是一个设备文件,具有主设备号3和辅设备号1.表示第一个硬盘第一个分区.

另外,如果第一个字母为c表示该文件是一个字符设备文件(character),一次传输一个字节的设备被称为字符设备,比如键盘,字符终端等,传输数据的最小单位为一个字节.一次传输数据为一整块的被称为块设备,比如硬盘,光盘等.最小数据传输单位为一个数据块(通常一个数据块的大小是512字节).

第一字段的后面9个字母表示文件的权限. 
r表是读 (Read) 
w表示写 (Write) 
x表示执行 (eXecute)

其中前三个表示文件属主的权限,中间三个表示组用户权限,最后三个表示其他用户权限. 
比如:

-rw-r--r-- 1 root root 1581 11月 24 18:14 anaconda-ks.cfg

表示文件的拥有者root对文件有读写权限,其他人(同组用户和其他用户只有读的权限)

另外,权限组还有一些特殊的表示法.比如/usr/X11R6/bin/XFree86具有如下权限:

[root@gucuiwen root]# ll /usr/X11R6/bin/XFree86 
-rws--x--x 1 root root 1960262 2003-02-28 /usr/X11R6/bin/XFree86

其中的s表示这个是网络接口程序"s"是socket的缩写.该程序在运行过程中会打开一个网络接口.

其他UNIX类系统如FreeBSD中还有t权限,表示一个临时(temporary)文件 
在freeBSD中用ls -l /tmp 可以看到这样的权限: 
drwxrwxrwt 
它的最后一位是字母"t"

 

### 第2字段 文件硬链接数或目录子目录数 

如果一个文件不是目录那么这一字段表示,这个文件所具有的硬链接数,即这个文件总共有多少个文件名.查看第一个文件:

-rw-r--r-- 1 root root 1581 11月 24 18:14 anaconda-ks.cfg

第2字段的值为1,说明这个文件只有anaconda-ks.cfg这一个文件名.即只有一个指向该链接的硬链接. 
如果我用ln,做一个指向该文件的硬链接再查看该文件,该文件的第2字段就会变成2:

[root@gucuiwen root]# ln anaconda-ks.cfg anaconda-ks.cfg.hardlink 
[root@gucuiwen root]# ls -l 
总用量 4071 
-rw-r--r-- 2 root root 1581 11月 24 18:14 anaconda-ks.cfg 
-rw-r--r-- 2 root root 1581 11月 24 18:14 anaconda-ks.cfg.hardlink

此时,anaconda-ks.cfg 和anaconda-ks.cfg.hardlink 称为互为硬链接.他们指向同一个文件,无论是修改哪一个文件,另一个里也做相应的变化,因为实际上他们指向同一个文件.

用ls -i anaconda-ks.cfg可以查看它的文件节点(inode) 
互为硬链接的文件具有相同的文件节点. 以下是验证实验:

[root@gucuiwen root]# ls -i anaconda-ks.cfg 
18102 anaconda-ks.cfg 
[root@gucuiwen root]# ls -i anaconda-ks.cfg.hardlink 
18102 anaconda-ks.cfg.hardlink

可以看到,这两个文件具有相同的文件节点号:18102

如果你知道一个文件有多个文件名,如何查找他的其他文件名分布在什么地方呢?

可以先用ls -i 获得它的节点号,然后用find查找,如/etc/sysconfig/networking/devices/ifcfg-eth0就具有多个文件名,我要查找与它互为硬链接的文件:

[root@gucuiwen devices]# ls -i /etc/sysconfig/networking/devices/ifcfg-eth0 
147181 /etc/sysconfig/networking/devices/ifcfg-eth0

得到它的节点号为 147181 
再用find查找:

[root@gucuiwen devices]# find /etc -inum 147181 
/etc/sysconfig/networking/devices/ifcfg-eth0 
/etc/sysconfig/networking/profiles/default/ifcfg-eth0

这样就得到了同一个文件的不同文件名的位置.

*************************************
如果是一个目录,第2字段的含义: 
**************************************

如果是一个目录,则第2字段表示该目录所含子目录的个数. 
新建一个空目录,这个目录的第二字段就是2,表示该目录下有两个子目录.为什么新建的目录下面会有两个子目录呢? 
因为每一个目录都有一个指向它本身的子目录"." 和指向它上级目录的子目录"..",这两个默认子目录是隐藏的.用ls -a可以看到.

每次在目录下新建一个子目录,该目录第2字段的值就增1,但是新建一个普通文件该字段值不增加.

 

### 第3字段: 文件拥有者  

该字段表示这个文件是属于哪个用户的.UNIX类系统都是多用户系统,每个文件都有它的拥有者.只有文件的拥有者才具有改动文件属性的权利.当然, root用户具有改动任何文件属性的权利.对于一个目录来说,只有拥有该目录的用户,或者具有写权限的用户才有在目录下创建文件的权利.

如果某一个用户因为某种原因,被删除,而该用户的文件还存在,那么用ls -l 查看该文件将显示一个代表用户存在前ID号的数字.

以下是演示:

先创建一个用户并用su过去:

[root@gucuiwen root]# useradd gucuiwen -g users 
[root@gucuiwen root]# su - gucuiwen

用新建的用户创建一个测试文件:

[gucuiwen@gucuiwen gucuiwen]$ touch testfile 
[gucuiwen@gucuiwen gucuiwen]$ ls -l testfile 
-rw-r--r-- 1 gucuiwen users 0 1月 4 16:31 testfile

最后用ls -l 看到第三字段的文件拥有者为gucuiwen

然后我将gucuiwen用户删除:

[root@gucuiwen root]# userdel gucuiwen 
[root@gucuiwen root]# cd /home/gucuiwen/ 
[root@gucuiwen gucuiwen]# ls -l 
总用量 0 
-rw-r--r-- 1 501 users 0 1月 4 16:31 testfile

可以看到,第三字段成了一个数字,这个数字是原gucuiwen用户的ID号.因为文件系统对每个文件记录文件所有者的ID,而非用户名.

### 第4字段:  文件拥有者所在的组 

组的概念可以想像成是一个共同完成一个项目的团队.通过组的概念,可以控制文件让特定的用户查看,修改或运行.而不是一棍子打死,要么全不让看,要么全让看.

一个用户可以加入很多个组,但是其中有一个是主组,就是显示在第4字段的明称.

可以在adduser的时候用-g指定该用户所在的主组,用-G指定其他组.

### 第5字段: 文件文件大小(以字节为单位) 

第5字段表示文件大小,如果是一个文件夹,则表示该文件夹的大小.请注意是文件夹本身的大小,而不是文件夹以及它下面的文件的总大小! 
很多人不能理解文件夹是一个特殊的文件的含义,这样的话理解文件夹大小的含义就比较困难了.

### 第6字段: 文件创建月份  

这个不必多说了.

### 第7字段: 文件创建日期  

### 第8字段: 文件创建时间 

文件创建的时间可以通过touch命令来修改.如: 
\#touch testfile 
可以把testfile的创建时间修改为当前时间. 
touch的详细用法请看链接文档. 
\#man touch

另外,一个文件还有最后访问时间,最后修改时间等属性. 
这些属性可以用ls 的其它参数显示出来.

### 第9字段:文件名  

如果是一个符号链接,那么会有一个 "->" 箭头符号,后面根一个它指向的文件名.

## **ls -lh ：格式化，更直观的看参数**

​     -h, --human-readable

​              with -l, print sizes in human readable format (e.g., 1K 234M 2G)





## ls -l > a.txt 重定向命令

ls -l > a.txt 列表的内容写入文件a.txt中（覆盖写）

ls -l >> a.txt aa.txt列表的内容追加到文件aa.txt的末尾

