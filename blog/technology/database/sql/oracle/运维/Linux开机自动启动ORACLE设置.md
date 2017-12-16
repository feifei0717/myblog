# Linux开机自动启动ORACLE设置

分类: linux
日期: 2014-05-27

原文地址: 

http://blog.chinaunix.net/uid-29632145-id-4275748.html

------

****[Linux开机自动启动ORACLE设置 ]()*2014-05-27 21:03:58*

分类： LINUX

**Redhat init简介：**

Linux启动时，会运行一个init程序，然后由init来启动后面的任务，包括多用户环境（inittab中设定）和网络等。运行级就是当前程序运行的功能级别，这个级别从1到6，具有不同的功能。这些级别在/etc/inittab（其他发行版这个文件位置不同）中指定，该文件就是init程序寻找的主要文件。最先运行的服务放在/etc/rc.d目录下。

文件以S开头，代表start（启动），后面的数字是启动顺序；文件以K开头，代表kill（结束），同样，后面的数字代表结束顺序。例如：/etc/rc3.d/S55sshd表示它与运行级别3有关，55就是它的启动顺序；/etc/rc3.d/K15nginx表示它与运行级别3有关，15就是它的关闭顺序。

init.d
这个目录中存放了一些服务启动脚本，系统安装时的多个rpm包，这些脚本在执行时可以用来启动，停止和重启这些服务。
rcx.d（x为0~6）
这个目录是启动级别的执行程序链接目录，里面的文件都是指向init.d目录中文件的一些软连接。

[oracle@oracle11g ~]$ dbstart
ORACLE_HOME_LISTNER is not SET, unable to auto-start Oracle Net Listener
Usage: /u01/app/oracle/oracle/product/10.2.0/db_1/bin/dbstart ORACLE_HOME

错误原因是：dbstart和dbshut脚本文件中ORACLE_HOME_LISTNER的设置有问题，分别打开两个文件找到：ORACLE_HOME_LISTNER=$1,修改为

ORACLE_HOME_LISTNER=$ORACLE_HOME，命令如下：

[oracle@oracle11g ~]$ vi $ORACLE_HOME/bin/dbstart

[oracle@oracle11g ~]$ vi $ORACLE_HOME/bin/dbshut 

修改后保存退出，第一个问题已解决; 

2.如何在Linux启动时自动启动Oracle监听和实例

首先要解决上面的问题，才能继续哟！ 

第一步:修改/etc/oratab文件，命令如下：

[oracle@oracle11g ~]$ vi /etc/oratab

找到：accp:/u01/oracle:N   修改为： accp:/u01/oracle:Y

第二步:把lsnrctl start和dbstart添加到rc.local文件中,命令如下:

[oracle@oracle11g ~]$ vi /etc/rc.d/rc.local

添加：

su oracle -lc "/home/oracle_11/app/oracle/product/11.2.0/dbhome_1/bin/lsnrctl start" 

su oracle -lc  /home/oracle_11/app/oracle/product/11.2.0/dbhome_1/bin/dbstart

注意：第一个命令有空格，所以要用引号的 

重启试试吧！