查询各用户表数量

分类: database
日期: 2014-05-12

原文地址: 

http://blog.chinaunix.net/uid-29632145-id-4249719.html

------

****[查询各用户表数量]() *2014-05-12 23:06:07*

分类： Oracle

SELECT OWNER,COUNT(\*) FROM ALL_TABLES GROUP BY OWNER; 