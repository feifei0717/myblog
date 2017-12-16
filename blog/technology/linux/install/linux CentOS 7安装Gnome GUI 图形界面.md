## CentOS 7安装Gnome GUI 图形界面

时间:2015-05-28 01:33来源:osetc.com 作者:osetc.com [举报](http://www.centoscn.com/plus/erraddsave.php?aid=5552&title=CentOS%207%B0%B2%D7%B0Gnome%20GUI%20%CD%BC%D0%CE%BD%E7%C3%E6) 点击:58254次

当你安装centos服务器版本的时候，系统默认是不会安装 CentOS 的图形界面程序的，比如：gnome或者kde, 那么如果你想在图形界面下工作的话，可以手动来安装CentOS Gnome GUI包，**本文将会讲述如何在CentOS 7 系统下安装gnome图形界面程序。**

在安装Gnome 包之前，我们需要先检查下安装源是否正常，因为我们要通过yum命令来安装gnome包， 而yum命令式通过yum 源来下载安装包的。

**1.在命令行下输入下面的命令来安装 Gnome 包**

| 1    | $sudo -y  yum groupinstall "GNOME Desktop" "Graphical Administration Tools" |
| ---- | ---------------------------------------- |
|      |                                          |

**2. 更新系统的运行级别**
如果你想在系统下次启动的时候自动进入图形界面，那么我们需要更改系统的运行级别，输入下面的命令来启用图形界面。

| 1    | $sudo ln -sf /lib/systemd/system/runlevel5.target /etc/systemd/system/default.target |
| ---- | ---------------------------------------- |
|      |                                          |

**3. 重启系统**
当系统再次启动的时候，就会默认进入图形界面。

来源： <http://www.centoscn.com/image-text/config/2015/0528/5552.html>