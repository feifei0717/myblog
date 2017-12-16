mysql授权+IP登录

分类: database
日期: 2014-09-12

原文地址: 

http://blog.chinaunix.net/uid-29632145-id-4469045.html

------

****[mysql授权+IP登录]()*2014-09-12 19:30:12*

分类： Mysql/postgreSQL

[mysql](http://www.2cto.com/database/MySQL/)授权+IP登录

1、指定特定IP

   GRANT ALL on *.* to '登陆名'@'你的ip地址' identified by '你的密码';

2、把你的HOST字段改成 % ，表示任何（本地联网）地址的都可以用此帐号登录

```
 GRANT ALL PRIVILEGES ON *.* TO '用户名'@'特定IP' IDENTIFIED BY '密码' WITH GRANT OPTION; 
   FLUSH   PRIVILEGES;


 mysqldump -u root -p voice>voice.sql
mysql -h127.0.0.1 -uroot -p123456

	

grant all privileges on *.* to 'root'@'10.200.241.229' identified by '123456';
grant all privileges on *.* to 'root'@'%' identified by '123456';
FLUSH   PRIVILEGES;

use mysql; 
DELETE FROM `user` WHERE `host`='%';
FLUSH   PRIVILEGES;
```

