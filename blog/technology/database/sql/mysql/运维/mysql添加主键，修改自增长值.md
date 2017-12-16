mysql添加主键，修改自增长值

分类: database
日期: 2015-02-05

原文地址: 

http://blog.chinaunix.net/uid-29632145-id-4821716.html

------

****[mysql添加主键，修改自增长值]() *2015-02-05 14:11:02*

```
mysql> show create table check_t1;
+----------+-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| Table    | Create Table                                                                                                                                                                  |
+----------+-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
| check_t1 | CREATE TABLE `check_t1` (
  `a` int(11) NOT NULL DEFAULT '0',
  `b` varchar(2) NOT NULL DEFAULT '',
  `c` varchar(2) NOT NULL DEFAULT ''
) ENGINE=MyISAM DEFAULT CHARSET=utf8 |
+----------+-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
1 row in set (0.00 sec)


mysql> alter table check_t1 add primary key (a);                         
Query OK, 1 row affected (0.85 sec)
Records: 1  Duplicates: 0  Warnings: 0


mysql> alter table check_t1 auto_increment=1;
Query OK, 0 rows affected (1.12 sec)
Records: 0  Duplicates: 0  Warnings: 0
```

