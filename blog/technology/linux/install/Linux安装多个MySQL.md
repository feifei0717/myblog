Linux安装多个MySQL

分类: linux
日期: 2014-11-24

原文地址: 

http://blog.chinaunix.net/uid-29632145-id-4646385.html

------

****[Linux安装多个MySQL]() *2014-11-24 20:59:06*

分类： LINUX

a.       检查是否已安装，grep的-i选项表示匹配时忽略大小写

[root@localhost JavaEE]#rpm -qa|grep -i mysql

mysql-libs-5.1.61-4.el6.i686

*可见已经安装了库文件，应该先卸载，不然会出现覆盖错误。注意卸:载时使用了--nodeps选项，忽略了依赖关系：

[root@localhost JavaEE]#rpm -e mysql-libs-5.1.61-4.el6.i686 --nodeps

b.     添加mysql组和mysql用户，用于设置mysql安装目录文件所有者和所属组。

[root@localhost JavaEE]#groupadd mysql

[root@localhost JavaEE]#useradd -r -g mysql mysql

执行**mysql_install_db**脚本，对mysql中的data目录进行初始化并创建一些系统表格。注意mysql服务进程mysqld运行时会访问data目录，所以必须由启动mysqld进程的用户（就是我们之前设置的mysql用户）执行这个脚本，或者用root执行，但是加上参数--user=mysql。

[root@localhost mysql]scripts/mysql_install_db --user=mysql

--socket=/tmp/

mysql-3316.sock

cp support-files/mysql.server /etc/init.d/

mysqld

*通过chkconfig命令将mysqld服务加入到自启动服务项中。

[root@localhost mysql]#chkconfig --add **mysqld-3316**

mysql-3316.sock，否者会报错
ERROR 2002 (HY000): Can't connect to local MySQL server through socket '/tmp/mysql.sock' (2)
安装主要是
a.初始化数据库数据
b.my.cnf配置文件
c.根目录/support-files/mysql.server的服务脚本配置