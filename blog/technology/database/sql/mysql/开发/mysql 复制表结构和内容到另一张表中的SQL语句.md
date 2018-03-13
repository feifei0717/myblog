[TOC]



# mysql 复制表结构和内容到另一张表中的SQL语句

这篇文章主要介绍了MySQL复制表结构和内容到另一张表中的SQL语句,需要的朋友可以参考下

## **1.复制表结构及数据到新表**

```
CREATE TABLE 新表
SELECT * FROM 旧表 
```



## 2.只复制表结构到新表

### 方法二 

```
CREATE TABLE 新表
SELECT * FROM 旧表 WHERE 1=2
```

即:让WHERE条件不成立.

创建出来的t2表（新表）缺少t1表（源表）的索引信息，只有表结构相同，没有索引。

```
CREATE TABLE A AS SELECT x,x,x,xx FROM B LIMIT 0
```

此种方式只会将表B的字段结构复制到表A中来，但不会复制表B中的索引到表A中来。这种方式比较灵活可以在复制原表表结构的同时指定要复制哪些字段，并且自身复制表也可以根据需要增加字段结构。

### **方法二:(低版本的mysql不支持，mysql4.0.25 不支持，mysql5已经支持了)**

```
CREATE TABLE 新表
LIKE 旧表 


create table t2 like t1;
```

like 创建出来的新表包含源表的完整表结构和索引信息





两种方式在复制表的时候均不会复制权限对表的设置。比如说原本对表B做了权限设置，复制后，表A不具备类似于表B的权限。

## **3.复制旧表的数据到新表(假设两个表结构一样)**

```
INSERT INTO 新表
SELECT * FROM 旧表 
```



## **4.复制旧表的数据到新表(假设两个表结构不一样)**

```
INSERT INTO 新表(字段1,字段2,…….)
SELECT 字段1,字段2,…… FROM 旧表
```





http://www.jb51.net/article/52017.htm