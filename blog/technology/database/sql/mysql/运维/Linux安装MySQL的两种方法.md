Linux安装MySQL的两种方法

分类: linux
日期: 2014-11-09

原文地址: 

http://blog.chinaunix.net/uid-29632145-id-4608529.html

------

****[Linux安装MySQL的两种方法]() *2014-11-09 10:45:14*

分类： LINUX

1.       运行平台：CentOS 6.3 x86_64，基本等同于RHEL 6.3

2.       安装方法：

安装MySQL主要有两种方法：一种是通过源码自行编译安装，这种适合高级用户定制MySQL的特性，这里不做说明；另一种是通过编译过的二进制文件进行安装。二进制文件安装的方法又分为两种：一种是不针对特定平台的通用安装方法，使用的二进制文件是后缀为.tar.gz的压缩文件；第二种是使用RPM或其他包进行安装，这种安装进程会自动完成系统的相关配置，所以比较方便。

3.       下载安装包：

a.  官方下载地址：

<http://dev.mysql.com/downloads/mysql/#downloads>

或镜像文件下载：

<http://dev.mysql.com/downloads/mirrors.html>

2.  下载文件（根据操作系统选择相应的发布版本）：

a.  通用安装方法

mysql-5.5.29-linux2.6-x86_64.tar.gz

b.       RPM安装方法：

MySQL-server-5.5.29-2.el6.x86_64.rpm

MySQL-client-5.5.29-2.el6.x86_64.rpm

4.       通用安装步骤

a.       检查是否已安装，grep的-i选项表示匹配时忽略大小写

[root@localhost JavaEE]#rpm -qa|grep -i mysql

mysql-libs-5.1.61-4.el6.i686

*可见已经安装了库文件，应该先卸载，不然会出现覆盖错误。注意卸:载时使用了--nodeps选项，忽略了依赖关系：

[root@localhost JavaEE]#rpm -e mysql-libs-5.1.61-4.el6.i686 --nodeps

b.     添加mysql组和mysql用户，用于设置mysql安装目录文件所有者和所属组。

[root@localhost JavaEE]#groupadd mysql

[root@localhost JavaEE]#useradd -r -g mysql mysql

*useradd -r参数表示mysql用户是系统用户，不可用于登录系统。

c.  将二进制文件解压到指定的安装目录，我们这里指定为/usr/local

[root@localhost ~]# cd /usr/local/

[root@localhost local]#tar zxvf /path/to/mysql-5.5.29-linux2.6-x86_64.tar.gz

*加压后在/usr/local/生成了解压后的文件夹mysql-5.5.29-linux2.6-x86_64，这名字太长，我们为它建立一个符号链接mysql，方便输入。

[root@localhost local]#ln -s mysql-5.6.21-linux-glibc2.5-i686 mysql

d.     /usr/local/mysql/下的目录结构

| **Directory** | **Contents of Directory**                |
| ------------- | ---------------------------------------- |
| bin           | Client programs and the **mysqld** server |
| data          | Log files, databases                     |
| docs          | Manual in Info format                    |
| man           | Unix manual pages                        |
| include       | Include (header) files                   |
| lib           | Libraries                                |
| scripts       | **mysql_install_db**                     |
| share         | Miscellaneous support files, including error messages, sample configuration files, SQL for database installation |
| sql-bench     | Benchmarks                               |

e.     进入mysql文件夹，也就是mysql所在的目录，并更改所属的组和用户。

[root@localhost local]#cd mysql

[root@localhost mysql]#chown -R mysql .

[root@localhost mysql]#chgrp -R mysql .

f.       执行**mysql_install_db**脚本，对mysql中的data目录进行初始化并创建一些系统表格。注意mysql服务进程mysqld运行时会访问data目录，所以必须由启动mysqld进程的用户（就是我们之前设置的mysql用户）执行这个脚本，或者用root执行，但是加上参数--user=mysql。

[root@localhost mysql]scripts/mysql_install_db --user=mysql

*如果mysql的安装目录（解压目录）不是/usr/local/mysql，那么还必须指定目录参数，如

[root@localhost mysql]scripts/mysql_install_db --user=mysql \

​         --basedir=/opt/mysql/mysql \

​         --datadir=/opt/mysql/mysql/data

*将mysql/目录下除了data/目录的所有文件，改回root用户所有，mysql用户只需作为mysql/data/目录下所有文件的所有者。

[root@localhost mysql]chown -R root .

[root@localhost mysql]chown -R mysql data

g.     复制配置文件

[root@localhost mysql] cp support-files/my-default.cnf /etc/my.cnf
g.   编辑mysqld服务
将scripts/mysql.server服务脚本，打开编辑添加
basedir=/usr/local/mysql-5.6.21-linux-glibc2.5-i686
datadir=/usr/local/mysql-5.6.21-linux-glibc2.5-i686/data

h.  将mysqld服务加入开机自启动项。

*首先需要将scripts/mysql.server服务脚本复制到/etc/init.d/，并重命名为mysqld。

[root@localhostmysql]  cp support-files/mysql.server /etc/init.d/**mysqld**

*通过chkconfig命令将mysqld服务加入到自启动服务项中。

[root@localhost mysql]#chkconfig --add **mysqld**

*注意服务名称mysqld就是我们将mysql.server复制到/etc/init.d/时重命名的名称。

*查看是否添加成功

[root@localhost mysql]#chkconfig --list mysqld

mysqld   0:off 1:off        2:on        3:on        4:on        5:on        6:off

i.  重启系统，mysqld就会自动启动了。

*检查是否启动

[root@localhost mysql]#netstat -anp|grep mysqld

tcp        0     0 0.0.0.0:3306               0.0.0.0:*                   LISTEN      2365/mysqld        

unix  2     [ ACC ]     STREAM     LISTENING     14396 2365/mysqld        /tmp/mysql.sock

*如果不想重新启动，那可以直接手动启动。

[root@localhost mysql]#service mysqld start

Starting MySQL.. SUCCESS!

j.       运行客户端程序mysql，在mysql/bin目录中，测试能否连接到mysqld。

[root@localhost mysql]#/usr/local/mysql/bin/mysql

Welcome to the MySQLmonitor.  Commands end with ; or \g.

Your MySQL connection idis 2

Server version:5.5.29-log MySQL Community Server (GPL)

 

Copyright (c) 2000, 2012,Oracle and/or its affiliates. All rights reserved.

Oracle is a registeredtrademark of Oracle Corporation and/or its affiliates. Other names may betrademarks of their respective owners.

Type 'help;' or '\h' forhelp. Type '\c' to clear the current input statement.

**mysql> quit**

Bye

*此时会出现mysql>命令提示符，可以输入sql语句，输入quit或exit退出。为了避免每次都输入mysql的全路径/usr/local/mysql/bin/mysql，可将其加入环境变量中，在/etc/profile最后加入两行命令：

MYSQL_HOME=/usr/local/mysql

export PATH=$PATH:$MYSQL_HOME/bin

这样就可以在shell中直接输入mysql命令来启动客户端程序了

[root@localhost mysql]#mysql

Welcome to the MySQLmonitor.  Commands end with ; or \g.

Your MySQL connection idis 3

Server version:5.5.29-log MySQL Community Server (GPL)

Copyright (c) 2000, 2012,Oracle and/or its affiliates. All rights reserved.

Oracle is a registeredtrademark of Oracle Corporation and/or its

affiliates. Other namesmay be trademarks of their respective

owners.

Type 'help;' or '\h' forhelp. Type '\c' to clear the current input statement.

mysql>
设置root用户的密码

 ./bin/mysqladmin -u root password '123456'

 

**5.       RPM安装步骤**

a.       检查是否已安装，grep的-i选项表示匹配时忽略大小写

[root@localhost JavaEE]#rpm -qa|grep -i mysql

mysql-libs-5.1.61-4.el6.x86_64

可见已经安装了库文件，应该先卸载，不然会出现覆盖错误。注意卸载时使用了--nodeps选项，忽略了依赖关系：

[root@localhost JavaEE]#rpm -e mysql-libs-5.1.61-4.el6.x86_64 --nodeps

2.     安装MySQL的服务器端软件，注意切换到root用户：

[root@localhost JavaEE]#rpm -ivh MySQL-server-5.5.29-2.el6.x86_64.rpm

安装完成后，安装进程会在Linux中添加一个mysql组，以及属于mysql组的用户mysql。可通过id命令查看：

[root@localhost JavaEE]#id mysql

uid=496(mysql)gid=493(mysql) groups=493(mysql)

MySQL服务器安装之后虽然配置了相关文件，但并没有自动启动mysqld服务，需自行启动：

[root@localhost JavaEE]#service mysql start

Starting MySQL.. SUCCESS!

可通过检查端口是否开启来查看MySQL是否正常启动：

[root@localhost JavaEE]#netstat -anp|grep 3306

tcp        0     0 0.0.0.0:3306               0.0.0.0:*                   LISTEN      34693/mysqld

c.  安装MySQL的客户端软件：

[root@localhost JavaEE]#rpm -ivh MySQL-client-5.5.29-2.el6.x86_64.rpm

如果安装成功应该可以运行mysql命令，注意必须是mysqld服务以及开启：

[root@localhost JavaEE]#mysql

Welcome to the MySQLmonitor.  Commands end with ; or \g.

Your MySQL connection idis 1

Server version: 5.5.29MySQL Community Server (GPL)

Copyright (c) 2000, 2012,Oracle and/or its affiliates. All rights reserved.

Oracle is a registered trademarkof Oracle Corporation and/or its affiliates. Other names may be trademarks oftheir respective owners.

Type 'help;' or '\h' forhelp. Type '\c' to clear the current input statement.

mysql>

d.  RPM安装方式文件分布

| **Directory**        | **Contents of Directory**                |
| -------------------- | ---------------------------------------- |
| /usr/bin             | Client programs and scripts              |
| /usr/sbin            | The [**mysqld**](http://dev.mysql.com/doc/refman/5.5/en/mysqld.html) server |
| /var/lib/mysql       | Log files, databases                     |
| /usr/share/info      | Manual in Info format                    |
| /usr/share/man       | Unix manual pages                        |
| /usr/include/mysql   | Include (header) files                   |
| /usr/lib/mysql       | Libraries                                |
| /usr/share/mysql     | Miscellaneous support files, including error messages, character set files, sample configuration files, SQL for database installation |
| /usr/share/sql-bench | Benchmarks                               |

 

 

 