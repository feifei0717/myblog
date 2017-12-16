Linux_rhel安装 oracle 11g r2

分类: linux
日期: 2014-04-27

原文地址: 

http://blog.chinaunix.net/uid-29632145-id-4228881.html

------

****[Linux_rhel安装 oracle 11g r2]() *2014-04-27 23:34:22*

分类： LINUX

**1、在安装oracle之前，用命令检查必需的RPM软件包有没有安装**
命令如下：
rpm -q binutils compat-libstdc++-33 elfutils-libelf elfutils-libelf-devel gcc gcc-c++ glibc glibc-common glibc-devel glibc-headers kernel-headers ksh libaio  libaio-devel libgcc libgomp libstdc++ libstdc++-devel make numactl-devel sysstat unixODBC unixODBC-devel

如果未安装完全会显示XXX is not installed，这个时候可以通过挂在RHEL5.4的光盘或镜像，在Server文件夹里寻找相应的RPM包安装。  

## 2.创建安装Oracle需要的系统组和用户  

```
创建Oracle Inventory 组
# groupadd oinstall
创建OSDBA 组
# groupadd dba
创建Oracle软件创建者
# useradd -g oinstall -G dba oracle
修改oracle用户的密码
# passwd oracle
```

## 3.配置系统内核参数值

```
编辑/etc/sysctl.conf文件
vim /etc/sysctl.conf
在打开的文件底部添加下面内容
fs.aio-max-nr = 1048576
fs.file-max = 6815744
kernel.shmall = 2097152
kernel.shmmax = 536870912
kernel.shmmni = 4096
kernel.sem = 250 32000 100 128
net.ipv4.ip_local_port_range = 9000 65500
net.core.rmem_default = 262144
net.core.rmem_max = 4194304
net.core.wmem_default = 262144
net.core.wmem_max = 1048586
改变当前系统内核参数值（让/etc/sysctl.conf立即生效）
# sysctl -p
```

## 4. 检查Oracle安装用户（oracle）资源限制

```
修改/etc/security/limits.conf文件
vim /etc/security/limits.conf
在打开的文件底部添加下面内容
oracle              soft    nproc   2047
oracle              hard    nproc   16384
oracle              soft    nofile  1024
oracle              hard    nofile  65536
oracle              soft    stack   10240
```

## 5. 创建安装Oracle软件所需要的目录

```
# mkdir -p /home/oracle_11/app/
# chown -R oracle:oinstall /home/oracle_11/app/
# chmod -R 775 /home/oracle_11/app/
```

## 6. 配置安装Oracle安装用户（oracle）的环境

```
编辑 /home/oracle/.bash_profile
vim /home/oracle/.bash_profile
在打开的文件中添加下面内容
umask 022
export ORACLE_BASE=/home/oracle_11/app
export ORACLE_HOME=$ORACLE_BASE/oracle/product/11.2.0/dbhome_1
export ORACLE_SID=orcl --Oracle实例名，可修改
export PATH=$PATH:HOME/bin:$ORACLE_HOME/bin
编辑 /etc/pam.d/login
vim /etc/pam.d/login
在打开的文件中添加下面内容
session required /lib/security/pam_limits.so
session required pam_limits.so
编辑 /etc/profile
vim /etc/profile
在打开的文件中添加下面内容
if [ $USER = "oracle" ]; then
   if [ $SHELL = "/bin/ksh" ]; then
      ulimit -p 16384
      ulimit -n 65536
   else
      ulimit -u 16384 -n 65536
   fi
fi
```

## 7. 查看系统是否支持图形界面

```
查看root用户下是否已设置DISPLAY变量
# echo $DISPLAY
如果有值出现，则说明已设置DISPLAY变量；否则，就需要手动设置DISPLAY
```

## 8. 开始安装Oracle软件

```
# cd /tmp
# unzip linux_11gR2_database_1of2.zip linux_11gR2_database_2of2.zip
# xhost + # chown -R oracle:oinstall /tmp/database # su - oracle
$ export DISPLAY=:0
$ cd /database
$ ./runInstaller
接下来系统会启动Oracle图形安装界面，安装过程和Windows下一样  
```

```
（安装过程可以参考http://blog.chinaunix.net/uid-23969156-id-3935741.html） 
```

```
（若是只安装完oracle软件在创建数据库，就可以用dbca创建数据库，netca配置监听）
```

在安装过程中，会提示在root用户下运行两个脚本文件（具体是哪两个，不记得了，按提示操作即可）。

Linux下的Oracle在安装结束后是处于运行状态的。重启机器后，Oracle不会像在Windows下那样将Oracle添加到Windows服务，在linux下需要手动启动Orcle服务

```
以oracle用户下，执行下面的命令
进入sqlplus
$ sqlplus /nolog
以sysdba的身份连接到数据库，并启动Oracle数据库引擎
SQL> conn /as sysdba
SQL> startup
退出sqlplus，运行Listener
SQL> exit
$ lsnrctl start
```

```
这样就可以连接到Oracle数据库了。如果想用Oracle提供的EM来管理Oracle的话还需要启动EM控制台，运行如下命令：
```

```
$ emctl start dbconsole
```

这样就可以通过<http://localhost:1158/em/> 来访问EM控制台了。

使用dbstart和dbstop来启动Oracle服务

可能使用dbstart命令来启动数据库更方便一些,但初次安装完oracle之后使用dbstart命令会报这样的错误

```
ORACLE_HOME_LISTNER is not SET, unable to auto-start Oracle Net Listener
Usage: /u01/app/oracle/product/11.2/db/bin/dbstart ORACLE_HOME
```

```
出现这样错误的原因是由于没有设置ORACLE_HOME_LISTNER的原因,我们查看一下dbstart这个文件
```

```
more  /home/oracle_11/app/oracle/product/11.2/db/bin/dbstart
```

```
部分内容如下
```

```
# First argument is used to bring up Oracle Net Listener
ORACLE_HOME_LISTNER=$1
if [ ! $ORACLE_HOME_LISTNER ] ; then
  echo "ORACLE_HOME_LISTNER is not SET, unable to auto-start Oracle Net Listener"
  echo "Usage: $0 ORACLE_HOME"
else
  LOG=$ORACLE_HOME_LISTNER/listener.log
  # Set the ORACLE_HOME for the Oracle Net Listener, it gets reset to
  # a different ORACLE_HOME for each entry in the oratab.
  export ORACLE_HOME=$ORACLE_HOME_LISTNER
```

```
 
```

解决方案就算将$ORACLE_HOME赋值给$ORACLE_HOME_LINTNER,保存,退出

再一次执行dbstart,但是没有反映,没有报错,如果我们需要使用dbstart,则需要在/etc/oratab这个文件中的实例最后的N改成Y,如下

orcl:/home/oracle_11/app/oracle/product/11.2/db:Y

OK,保存,再试一下dbstart命令,返回结果如下

Processing Database instance "orcl": log file /home/oracle_11/app/oracle/product/11.2.0/db_1/startup.log

dbshut进行同样的设置.这样,以后就可以在启动监听之后直接使用dbstart和dbshut命令来启动和关闭数据了

将Oracle服务添加到Linux开机启动项，以root用户建立/etc/rc.d/init.d/oradb脚本文件，文件内容如下：

```
#!/bin/bash
# chkconfig: 2345 90 10
export ORACLE_BASE=/home/oracle_11/app/
export ORACLE_HOME=$ORACLE_BASE/oracle/product/11.2.0/db_1
export ORACLE_SID=orcl
export PATH=$PATH:$ORACLE_HOME/bin
ORCL_OWN="oracle"
# if the executables do not exist -- display error
if [ ! -f $ORACLE_HOME/bin/dbstart -o ! -d $ORACLE_HOME ]
then
   echo "Oracle startup: cannot start"
   exit 1
fi
# depending on parameter -- start, stop, restart
# of the instance and listener or usage display
case "$1" in
start)
# Oracle listener and instance startup
echo -n "Starting Oracle: "
su - $ORCL_OWN -c "$ORACLE_HOME/bin/dbstart"
touch /var/lock/subsys/oradb
su - $ORCL_OWN -c "$ORACLE_HOME/bin/emctl start dbconsole"
echo "OK"
;;
stop)
# Oracle listener and instance shutdown
echo -n "Shutdown Oracle: "
su - $ORCL_OWN -c "$ORACLE_HOME/bin/emctl stop dbconsole"
su - $ORCL_OWN -c "$ORACLE_HOME/bin/dbshut"
rm -f /var/lock/subsys/oradb
echo "OK"
;;
reload|restart)
$0 stop
$1 start
;;
*)
echo "Usage: 'basename $0' start|stop|restart|reload"
exit 1
esac
exit 0
```

```
将该文件添加到开机启动
```

```
# chmod 755 /etc/rc.d/init.d/oradb
# chkconfig --add oradb
```

```
重启服务
```

```
# service oradb stop
# service oradb start
```

下次启动机器的时候，Oracle服务会随机器一起启动。

Oracle数据库安装、配置完成。

Tip：Oracle数据库的默认端口号：1521，Oracle提供的EM管理器默认端口号是1158。