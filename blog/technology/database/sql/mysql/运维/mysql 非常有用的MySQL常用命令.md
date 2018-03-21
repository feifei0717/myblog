# 非常有用的MySQL常用命令

NETGZS 2018-01-27 17:24:28

![非常有用的MySQL常用命令](http://p1.pstatp.com/large/5b58000254265aa01791)

> MySQL是一种关系数据库管理系统，关系数据库将数据保存在不同的表中，而不是将所有数据放在一个大仓库内，这样就增加了速度并提高了灵活性。
>
> MySQL所使用的 SQL 语言是用于访问数据库的最常用标准化语言。MySQL 软件采用了双授权政策，分为社区版和商业版，由于其体积小、速度快、总体拥有成本低，尤其是开放源码这一特点，一般中小型网站的开发都选择 MySQL 作为网站数据库。

-- 查看数据库

SHOW DATABASES;

-- 创建数据库

CREATE DATABASE IF NOT EXISTS 数据库名;

-- 选择数据库

USE 数据库名;

-- 查看数据库中的数据表

SHOW TABLES;

-- 删除数据库

DROP DATABASE IF EXISTS 数据库名;

-- 创建一个简单的数据库表

CREATE TABLE IF NOT EXISTS 表名(

id INT UNSTGND AUTO_INCREMENT PRIMARY KEY,

name VARCHAR(255) NOT NULL,

sex TINYINT NOT NULL DEFAULT 1,

age TINYINT NOT NULL DEFAULT 0

)ENGINE = MyISAM DEFAULT CHARSET=utf8;

-- 添加数据

INSERT INTO 表名 VALUES(NULL,'cendxia',1,22);

-- 查询数据

SELECT * FROM 表名;

-- 修改数据

UPDATE 表名 SET 字段1 = '值1',字段1='值2' WHERE 条件;

-- 删除数据

DELETE FROM 表名 WHERE 条件;

-- 创建新普通用户

GRANT 权限 ON 库名.表名 TO '用户名'@'主机名' IDENTIFIED BY '密码'

-- 查询所有用户

SELECT user,host FROM mysql.user

-- 删除普通用户

DROP USER '用户名'@'主机名';

-- 修改root用户密码

SET PASSWORD = PASSWORD('新密码');

-- root用户修改普通用户密码

SET PASSWORD FOR '用户名'@'主机名'=PASSWORD('新密码');

-- 授权

GRANT 权限 ON 库名.表名 TO '用户名'@'主机名' IDENTIFIED BY '密码';

GRANT SELECT,INSERT,UPDATE,DELETE ON cendxia.user TO '用户名'@'主机名' IDENTIFIED BY '密码';

-- 查看权限

SHOW GRANTS FOR '用户名'@'主机名';

-- 收回权限

REVOKE 权限 ON 库名.表名 FROM '用户名'@'主机名';

-- 备份

mysqldump -uroot -p 数据库名 > 要保存的位置

-- 还原数据

mysql -uroot -p 数据库名 < 文件位置

-- 创建数据表

CREATE TABLE IF NOT EXISTS 表名(

字段1 类型(长度) 属性 索引,

字段2 类型(长度) 属性 索引,

字段3 类型(长度) 属性 索引,

字段4 类型(长度) 属性 索引,

字段n...... -- 最后一个字段后面不要加逗号

)ENGINE=MyISAM DEFAULT CHARSET=UTF8;

-- 建表引擎

MyISAM -- 读取速度快，不支持事务

InnoDB -- 读取速度稍慢 支持事务 事务回滚

-- 一些常用属性

UNSTGND 无符号属性

AUTO_INCREMENT 自增属性(一般用在id字段上)

ZEROFILL 零填充

-- 字符串类型

CHAR 定长的字符串类型 (0-255)个字符

VARCHAR 变长的字符串类型，5.0以前(0-255)个字符，5.0版本以后(0-65535)个字符

-- 查看表结构

DESC 表名; (缩写版)

DESCRIBE 表名;

-- 查看建表语句

SHOW CREATE TABLE 表名;

-- 修改表名

ALTER TABLE 原表名 RENAME TO 新表名;

-- 修改字段的数据类型

ALTER TABLE 表名 MODIFY 字段名 数据类型 属性 索引;

-- 修改字段名

ALTER TABLE 表名 CHANGE 原字段名 新字段名 数据类型 属性 索引;

-- 增加字段

ALTER TABLE 表名 ADD 字段名 数据类型 属性 索引;

-- [FIRST|AFIER 字段名]

-- (FIRST 在最前面添加字段。AFIER 字段名 在某字段后面添加)

-- 删除字段

ALTER TABLE 表名 DROP 字段名;

-- 修改字段的排列位置

ALTER TABLE 表名 MODIFY 字段名 数据类型 属性 索引 AFIER 字段名;

-- 修改表引擎

ALTER TABLE 表名 ENGINE=引擎名; -- MyISAM 或 InnoDB



https://www.toutiao.com/a6515658354579210755/?tt_from=android_share&utm_campaign=client_share&timestamp=1521554445&app=news_article&iid=28537493856&utm_medium=toutiao_android