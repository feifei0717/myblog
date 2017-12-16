 

mysql，sqlserver 复制表结构

### 一.mysql 

MySQL复制表结构和内容到另一张表中的SQL 

#### 1.复制表结构及数据到新表

CREATE TABLE 新表

SELECT * FROM 旧表

#### 2.只复制表结构到新表

方法一:（此方法不能复制主键，索引，触发器，注释 等）

CREATE TABLE 新表

SELECT * FROM 旧表 WHERE 1=2

即:让WHERE条件不成立.

方法二:(低版本的mysql不支持，mysql4.0.25 不支持，mysql5已经支持了，此方法可以复制主键，索引，注释    但是不能复制触发器)

CREATE TABLE 新表

LIKE 旧表

#### 3.复制旧表的数据到新表(假设两个表结构一样)

INSERT INTO 新表

SELECT * FROM 旧表

#### 4.复制旧表的数据到新表(假设两个表结构不一样)

INSERT INTO 新表(字段1,字段2,…….)

SELECT 字段1,字段2,…… FROM 旧表

示例：

```
INSERT INTO mall_goods(goods_id, title, islifeexpired		, lifeexpireddt									, ins_dt	, ins_usr_seq, ins_by_who, mod_dt		, mod_usr_seq, mod_by_who)SELECT           goods_id, title, '0'		     	, ifnull(lifeexpireddt,'0000-00-00 00:00:00')	,create_time, create_id  , ''		 , update_time	, update_id	 , ''FROM mall_goods_yxy_transform;
```

### 二.sqlserver

T_SQL语句复制表的方法

我在SQL SERVER 2000中有现个数据库DATAHR及DEMO,它们的结构是一样，其它有一个表名为：GBITEM.现在我想将DEMO数据库的表名：GBITEM的全部内容复制到DATAHR数据库的表名为：GBITEM中。请问此T-SQL语句应该怎么写？ 谢谢高人指点！

如果目的表已经存在:

insert into DATAHR.DBO.GBITEM

select * from DEMO.DBO.GBITEM

如果目的表不存在:

select * into DATAHR.DBO.GBITEM

from DEMO.DBO.GBITEM

--备份数据库OFSys

BACKUP DATABASE OFSys to disk = 'e:/OFSys'

还原

restore database test from disk = 'c:\test'

转载至：http://www.educity.cn/wenda/399447.html