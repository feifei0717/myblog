# MySQL存储过程使用表名做参数

分类: database
日期: 2014-09-10

原文地址: 

http://blog.chinaunix.net/uid-29632145-id-4464241.html

------

****[MySQL存储过程使用表名做参数]() *2014-09-10 16:29:56*

分类： Mysql/postgreSQL

原创文章，chszs版权所有！
如要转发，请联系chszs！
盗贴行为将受起诉！
MySQL存储过程使用表名做参数动态创建表的例子。
一同学向我请教在MySQL的存储过程中，如何使用表名做参数动态创建表。
这个问题在MySQL 5.0以前非常麻烦，但是在MySQL 5.0.13版之后，由于引入了PREPARE语句，一切变得简单了。

此问题在网上搜索的帖子一般都是错误的！
例子如下（已验证）：

```
DROP PROCEDURE IF EXISTS `newtable`;  
CREATE PROCEDURE `newtable`(IN tname varchar(64))  
BEGIN  
SET @sqlcmd = CONCAT('CREATE TABLE ', tname, ' (id int NOT NULL AUTO_INCREMENT, name varchar(64) DEFAULT NULL, PRIMARY KEY (`id`))');  
PREPARE stmt FROM @sqlcmd;  
EXECUTE stmt;  
DEALLOCATE PREPARE stmt;  
END;  
call newtable('abc');  
```

