MySQL数据库安全模式登陆

分类: database
日期: 2015-03-06

原文地址: 

http://blog.chinaunix.net/uid-29632145-id-4863886.html

------

****[MySQL数据库安全模式登陆]() *2015-03-06 10:35:59*

分类： Mysql/postgreSQL

当使用mysql数据库提示密码错误或无权限等问题时，可以通过mysql的安全模式启动数据库，使所有用户可以完全访问所有的表，可以对用户重设密码，也可以进行权限修改。

1：首先关闭mysql数据库，并结束所有mysqld进程。

\#service mysqld stop

\#killall -9 mysqld

2：以安全模式登陆数据库。（linux下可能要mysqld_safe  才能识别window一般是mysql_safe）

\#mysqld_safe --skip-grant-tables &

3：登陆mysql数据库。

\#mysql -uroot

4：更改user表中的用户密码。

\> update mysql.user set Password=password('123456') where User="root";

\>flush privileges;

5：对root用户赋权限。

\>grant all on *.* to 'root'@'%' identified by '123456';

\>flush privileges;

然后就可以使用root用户，PASSWD密码登陆mysql数据库了。按照上面的方法，当其它用户忘记密码是，可以对此用户进行密码修改并赋权限。