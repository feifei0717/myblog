CentOS6.3文字界面下使用yum安装Gnome桌面

分类: linux
日期: 2014-11-27

原文地址: 

http://blog.chinaunix.net/uid-29632145-id-4653498.html

------

****[CentOS6.3文字界面下使用yum安装Gnome桌面]()*2014-11-27 12:52:31*

分类： LINUX

全新以最小化包安装了64位的[CentOS](http://www.linuxidc.com/topicnews.aspx?tid=14)6.3系统，作为本地的Web服务器使用，现记录全过程
第三步，安装Gnome桌面

为什么要安装Gnome桌面，是因为我想在系统里部署虚拟机vmware，安装N个win-xp系统

在字符界面安装Gnome桌面

如果你是字符界面安装的系统的话，因为不让你选择软件包，所以你需要在安装好系统后，安装需要的软件，比如说桌面。

在CentOs6.3中，gonme桌面包的名字变成了Desktop，这算是CentOs6.3默认的桌面了。但如果只安装这个组的话，也是不行的，他缺少了X协议的支持，在启动桌面的时候，会出现下面和X相关的错误提示。

xinit: No such file or directory (errno 2): no server “/usr/bin/X” in PATH

xinit: No such file or directory (errno 2): unable to connect to X server

xinit: No such process (errno 3): Server error.

所以说，要在字符界面下安装Gnome桌面，你需要安装两个组。

[root@localhost ~]# yum -y groupinstall "X Window System"
[root@localhost ~]# yum -y groupinstall "Desktop"

启动Gnome桌面
[root@localhost ~]# startx

字符与图形界面切换的其它方法
Ctrl+Alt+F1～F6切换字符虚拟终端，使用Ctrl+Alt+F7切换到图形界面。

另外，多个多个虚拟控制台之间的切换，使用Alt+F1～F6