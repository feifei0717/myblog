Access denied for user 'root'@'localhost' (using password_ YES)

分类: database
日期: 2015-03-16

 

http://blog.chinaunix.net/uid-29632145-id-4894500.html

------

****[Access denied for user 'root'@'localhost' (using password: YES) ]()*2015-03-16 09:46:52*

分类： Mysql/postgreSQL

方法一：
你可以创建一个用户，赋予相关的权限试试看
grant select,insert,update,delete on *.* to 'root' @'localhost' identified by '123456';
方法二：
MySQL数据库安全模式登陆
当使用mysql数据库提示密码错误或无权限等问题时，可以通过mysql的安全模式启动数据库，使所有用户可以完全访问所有的表，可以对用户重设密码，也可以进行权限修改。1：首先关闭mysql数据库，并结束所有mysqld进程。#service mysqld stop#killall -9 mysqld2：以安全模式登陆数据库。（linux下可能要mysqld_safe  才能识别window一般是mysql_safe）#mysqld_safe --skip-grant-tables &3：登陆mysql数据库。#mysql -uroot4：更改user表中的用户密码。> update mysql.user set Password=password('123456') where User="root">flush privileges;5：对root用户赋权限。>grant all on *.* to 'root'@'%' identified by '123456';>flush privileges;然后就可以使用root用户，PASSWD密码登陆mysql数据库了。按照上面的方法，当其它用户忘记密码是，可以对此用户进行密码修改并赋权限。