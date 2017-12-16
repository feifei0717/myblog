# Linux下重启mysql数据库的方法

分类: database
日期: 2015-05-30

原文地址: 

http://blog.chinaunix.net/uid-29632145-id-5059634.html

------

****[Linux下重启mysql数据库的方法]() *2015-05-30 23:33:48*

分类： Mysql/postgreSQL

方法一：
命令:

[root@localhost /]# /etc/init.d/mysql   start|stop|restart|reload|force-reload
[root@localhost init.d]# /etc/init.d/mysql   start|stop|restart|reload|force-reload
方法二：
比较常用的MySQL命令：

一、启动方式

1、使用 service 启动：[root@localhost /]# service mysqld start    (5.0版本是mysqld)

​                      [root@szxdb etc]# service mysql start     (5.5.7版本是mysql)

​                      Shutting down MySQL.....[??????]
​                      Starting MySQL.[??????]
​                      [root@szxdb etc]#

2、使用 mysqld 脚本启动：/etc/inint.d/mysqld start

3、使用 safe_mysqld 启动：safe_mysqld&

二、停止

1、使用 service 启动：service mysqld stop

2、使用 mysqld 脚本启动：/etc/inint.d/mysqld stop

3、mysqladmin shutdown

三、重启

1、使用 service 启动：service mysqld restart （我就用这个命令搞定的，5.0版本命令）

​                      service mysql restart （5.5.7版本命令）

2、使用 mysqld  脚本启动：/etc/init.d/mysqld restart

另外还有比较特殊的安全的重启方法（我试了不管用，囧！）
$mysql_dir/bin/mysqladmin -u root -p shutdown
$mysql_dir/bin/safe_mysqld &

另外附上VNCServer无法访问的解决方法：

我就直接PUTTY上SSH登陆，然后敲入命令
vncserver
就这样就正常了！O(∩_∩)O哈哈~

 

\--------------------------------------------------------------------------------------------------

 

至些你的MySQL服务的基本配置就到些完成,下面是一些在网络上找的一些常用的MySQL重启命令，附上以方便大家使用

 

/etc/init.d/mysql start    启动MySQL

/etc/init.d/mysql restart     重新启动MySQL

 

/etc/init.d/mysql shutdown     关闭MySQL的命令

 

/etc/init.d/mysql stop       停止MySQL服务

 

chentao@amber-chentao:~$ MySQL -uroot -p       登录MySQL服务器，在上面有讲解

 

下面还有关一些常用MySQL内部操作提示符

show databases; 显示所有数据库列表

 

use test; 打开库

 

show tables; 查看找开数据库中所有数据表

 

describe tableName; 查询表结构

 

create table 表名(字段设定表); 创建表

 

create database 数据库名； 创建数据库

 

drop database 数据库名; 删除数据库

 

drop table tablename 删除表结构

 

delete from 表名; 删除表数据

 

select * from 表名; 查询指定表中所有数据