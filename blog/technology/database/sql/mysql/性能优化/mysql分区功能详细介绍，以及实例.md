# mysql分区功能详细介绍，以及实例

## 一，什么是数据库分区

前段时间写过一篇关于mysql分表的的文章，下面来说一下什么是数据库分区，以mysql为例。mysql数据库中的数据是以文件的形势存在磁盘上的，默认放在/mysql/data下面（可以通过my.cnf中的datadir来查看），一张表主要对应着三个文件，一个是frm存放表结构的，一个是myd存放表数据的，一个是myi存表索引的。如果一张表的数据量太大的话，那么myd,myi就会变的很大，查找数据就会变的很慢，这个时候我们可以利用mysql的分区功能，在物理上将这一张表对应的三个文件，分割成许多个小块，这样呢，我们查找一条数据时，就不用全部查找了，只要知道这条数据在哪一块，然后在那一块找就行了。如果表的数据太大，可能一个磁盘放不下，这个时候，我们可以把数据分配到不同的磁盘里面去。

分区的二种方式

### 1，横向分区

什么是横向分区呢？就是横着来分区了，举例来说明一下，假如有100W条数据，分成十份，前10W条数据放到第一个分区，第二个10W条数据放到第二个分区，依此类推。也就是把表分成了十分，根用merge来分表，有点像哦。取出一条数据的时候，这条数据包含了表结构中的所有字段，也就是说横向分区，并没有改变表的结构。

### 2，纵向分区

什么是纵向分区呢？就是竖来分区了，举例来说明，在设计用户表的时候，开始的时候没有考虑好，而把个人的所有信息都放到了一张表里面去，这样这个表里面就会有比较大的字段，如个人简介，而这些简介呢，也许不会有好多人去看，所以等到有人要看的时候，在去查找，分表的时候，可以把这样的大字段，分开来。

感觉数据库的分区好像是切苹果，到底是横着切呢，还是竖着切，根据个人喜好了，mysql提供的分区属于第一种，横向分区，并且细分成很多种方式。下面将举例说明一下。

## 二，mysql的分区

我觉着吧，mysql的分区只有一种方式，只不过运用不同的算法，規则将数据分配到不同的区块中而已。

### 1，mysql5.1及以上支持分区功能

**说明： mysql 5.1和之前只要用merge 引擎分区，只能支持MyISAM**

安装安装的时候，我们就可以查看一下

```shell
[root@BlackGhost mysql-5.1.50]# ./configure --help |grep -A 3 Partition  
 === Partition Support ===  
 Plugin Name:      partition  
 Description:      MySQL Partitioning Support  
 Supports build:   static  
 Configurations:   max, max-no-ndb  
```

查看一下，如果发现有上面这个东西，说明他是支持分区的，默认是打开的。如果你已经安装过了mysql的话

```
mysql> show variables like "%part%";  
+-------------------+-------+  
| Variable_name     | Value |  
+-------------------+-------+  
| have_partitioning | YES   |  
+-------------------+-------+  
1 row in set (0.00 sec)  
```

查看一下变量，如果支持的话，会有上面的提示的。

查看哪个分区：

```
3.5.7以前的版本显示分区的执行计划使用：explain PARTITIONS；5.7以后直接执行：explain
```

### 2，range分区

按照RANGE分区的表是通过如下一种方式进行分区的，每个分区包含那些分区表达式的值位于一个给定的连续区间内的行

```sql
//创建range分区表  
mysql> CREATE TABLE IF NOT EXISTS `user` (  
 ->   `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '用户ID',  
 ->   `name` varchar(50) NOT NULL DEFAULT '' COMMENT '名称',  
 ->   `sex` int(1) NOT NULL DEFAULT '0' COMMENT '0为男，1为女',  
 ->   PRIMARY KEY (`id`)  
 -> ) ENGINE=MyISAM  DEFAULT CHARSET=utf8 AUTO_INCREMENT=1  
 -> PARTITION BY RANGE (id) (  
 ->     PARTITION p0 VALUES LESS THAN (3),  
 ->     PARTITION p1 VALUES LESS THAN (6),  
 ->     PARTITION p2 VALUES LESS THAN (9),  
 ->     PARTITION p3 VALUES LESS THAN (12),  
 ->     PARTITION p4 VALUES LESS THAN MAXVALUE  
 -> );  
Query OK, 0 rows affected (0.13 sec)  
  
//插入一些数据  
mysql> INSERT INTO `test`.`user` (`name` ,`sex`)VALUES ('tank', '0')  
 -> ,('zhang',1),('ying',1),('张',1),('映',0),('test1',1),('tank2',1)  
 -> ,('tank1',1),('test2',1),('test3',1),('test4',1),('test5',1),('tank3',1)  
 -> ,('tank4',1),('tank5',1),('tank6',1),('tank7',1),('tank8',1),('tank9',1)  
 -> ,('tank10',1),('tank11',1),('tank12',1),('tank13',1),('tank21',1),('tank42',1);  
Query OK, 25 rows affected (0.05 sec)  
Records: 25  Duplicates: 0  Warnings: 0  
  
//到存放数据库表文件的地方看一下，my.cnf里面有配置，datadir后面就是  
[root@BlackGhost test]# ls |grep user |xargs du -sh  
4.0K    user#P#p0.MYD  
4.0K    user#P#p0.MYI  
4.0K    user#P#p1.MYD  
4.0K    user#P#p1.MYI  
4.0K    user#P#p2.MYD  
4.0K    user#P#p2.MYI  
4.0K    user#P#p3.MYD  
4.0K    user#P#p3.MYI  
4.0K    user#P#p4.MYD  
4.0K    user#P#p4.MYI  
12K    user.frm  
4.0K    user.par  
  
//取出数据  
mysql> select count(id) as count from user;  
+-------+  
| count |  
+-------+  
|    25 |  
+-------+  
1 row in set (0.00 sec)  
  
//删除第四个分区  
mysql> alter table user drop partition p4;  
Query OK, 0 rows affected (0.11 sec)  
Records: 0  Duplicates: 0  Warnings: 0  
  
/**存放在分区里面的数据丢失了，第四个分区里面有14条数据，剩下的3个分区 
只有11条数据，但是统计出来的文件大小都是4.0K，从这儿我们可以看出分区的 
最小区块是4K 
*/  
mysql> select count(id) as count from user;  
+-------+  
| count |  
+-------+  
|    11 |  
+-------+  
1 row in set (0.00 sec)  
  
//第四个区块已删除  
[root@BlackGhost test]# ls |grep user |xargs du -sh  
4.0K    user#P#p0.MYD  
4.0K    user#P#p0.MYI  
4.0K    user#P#p1.MYD  
4.0K    user#P#p1.MYI  
4.0K    user#P#p2.MYD  
4.0K    user#P#p2.MYI  
4.0K    user#P#p3.MYD  
4.0K    user#P#p3.MYI  
12K    user.frm  
4.0K    user.par  
  
/*可以对现有表进行分区,并且会按規则自动的将表中的数据分配相应的分区 
中，这样就比较好了，可以省去很多事情，看下面的操作*/  
mysql> alter table aa partition by RANGE(id)  
 -> (PARTITION p1 VALUES less than (1),  
 -> PARTITION p2 VALUES less than (5),  
 -> PARTITION p3 VALUES less than MAXVALUE);  
Query OK, 15 rows affected (0.21 sec)   //对15数据进行分区  
Records: 15  Duplicates: 0  Warnings: 0  
  
//总共有15条  
mysql> select count(*) from aa;  
+----------+  
| count(*) |  
+----------+  
|       15 |  
+----------+  
1 row in set (0.00 sec)  
  
//删除一个分区  
mysql> alter table aa drop partition p2;  
Query OK, 0 rows affected (0.30 sec)  
Records: 0  Duplicates: 0  Warnings: 0  
  
//只有11条了，说明对现有的表分区成功了  
mysql> select count(*) from aa;  
+----------+  
| count(*) |  
+----------+  
|       11 |  
+----------+  
1 row in set (0.00 sec)  
```

根据创建时间分区实例：

```Sql
CREATE TABLE `wh_sku_num_log` (
`id`  bigint(18) NOT NULL AUTO_INCREMENT ,
`warehouse_code`  varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '' COMMENT '仓库编码' ,
`sku_id`  bigint(18) NOT NULL DEFAULT 0 COMMENT '商品id' ,
`before_qty`  int(11) NOT NULL DEFAULT 0 COMMENT '修改前库存' ,
`after_qty`  int(11) NOT NULL DEFAULT 0 COMMENT '修改后库存' ,
`prog`  varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL DEFAULT '' COMMENT '调用的url' ,
`create_time`  datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '时间' ,
PRIMARY KEY (`id`, `create_time`),
INDEX `idx_msnl_sku_id` (`sku_id`) USING BTREE ,
INDEX `idx_msnl_warehouse_code` (`warehouse_code`) USING BTREE ,
INDEX `idx_msnl_create_time` (`create_time`) USING BTREE ,
INDEX `idx_msnl_after_qty` (`after_qty`) USING BTREE 
)
PARTITION BY RANGE(YEAR(create_time) * 100 + MONTH(create_time)) PARTITIONS 18 (PARTITION `whnl201601` VALUES LESS THAN (201602) ENGINE=InnoDB , PARTITION `whnl201602` VALUES LESS THAN (201603) ENGINE=InnoDB , PARTITION `whnl201603` VALUES LESS THAN (201604) ENGINE=InnoDB , PARTITION `whnl201604` VALUES LESS THAN (201605) ENGINE=InnoDB , PARTITION `whnl201605` VALUES LESS THAN (201606) ENGINE=InnoDB , PARTITION `whnl201606` VALUES LESS THAN (201607) ENGINE=InnoDB , PARTITION `whnl201607` VALUES LESS THAN (201608) ENGINE=InnoDB , PARTITION `whnl201608` VALUES LESS THAN (201609) ENGINE=InnoDB , PARTITION `whnl201609` VALUES LESS THAN (201610) ENGINE=InnoDB , PARTITION `whnl201610` VALUES LESS THAN (201611) ENGINE=InnoDB , PARTITION `whnl201611` VALUES LESS THAN (201612) ENGINE=InnoDB , PARTITION `whnl201612` VALUES LESS THAN (201701) ENGINE=InnoDB , PARTITION `whnl201701` VALUES LESS THAN (201702) ENGINE=InnoDB , PARTITION `whnl201702` VALUES LESS THAN (201703) ENGINE=InnoDB , PARTITION `whnl201703` VALUES LESS THAN (201704) ENGINE=InnoDB , PARTITION `whnl201704` VALUES LESS THAN (201705) ENGINE=InnoDB , PARTITION `whnl201705` VALUES LESS THAN (201706) ENGINE=InnoDB , PARTITION `whnl_max` VALUES LESS THAN (MAXVALUE) ENGINE=InnoDB ) 
ENGINE=InnoDB
DEFAULT CHARACTER SET=utf8 COLLATE=utf8_general_ci
COMMENT='SKU仓库库存日志表'
AUTO_INCREMENT=52
ROW_FORMAT=COMPACT
;
INSERT INTO `commodity`.`wh_sku_num_log` ( `warehouse_code`, `sku_id`, `before_qty`, `after_qty`, `prog`, `create_time`) VALUES ( '', '90224657686', '6', '5', '', '2015-12-30 13:49:30');
```

### 3，list分区

LIST分区中每个分区的定义和选择是基于某列的值从属于一个值列表集中的一个值，而RANGE分 区是从属于一个连续区间值的集合。

 

```Sql
//这种方式失败  
mysql> CREATE TABLE IF NOT EXISTS `list_part` (  
 ->   `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '用户ID',  
 ->   `province_id` int(2) NOT NULL DEFAULT 0 COMMENT '省',  
 ->   `name` varchar(50) NOT NULL DEFAULT '' COMMENT '名称',  
 ->   `sex` int(1) NOT NULL DEFAULT '0' COMMENT '0为男，1为女',  
 ->   PRIMARY KEY (`id`)  
 -> ) ENGINE=INNODB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=1  
 -> PARTITION BY LIST (province_id) (  
 ->     PARTITION p0 VALUES IN (1,2,3,4,5,6,7,8),  
 ->     PARTITION p1 VALUES IN (9,10,11,12,16,21),  
 ->     PARTITION p2 VALUES IN (13,14,15,19),  
 ->     PARTITION p3 VALUES IN (17,18,20,22,23,24)  
 -> );  
ERROR 1503 (HY000): A PRIMARY KEY must include all columns in the table's partitioning function 
 
//这种方式成功 
mysql> CREATE TABLE IF NOT EXISTS `list_part` ( 
 ->   `id` int(11) NOT NULL  COMMENT '用户ID', 
 ->   `province_id` int(2) NOT NULL DEFAULT 0 COMMENT '省', 
 ->   `name` varchar(50) NOT NULL DEFAULT '' COMMENT '名称', 
 ->   `sex` int(1) NOT NULL DEFAULT '0' COMMENT '0为男，1为女'  
 -> ) ENGINE=INNODB  DEFAULT CHARSET=utf8  
 -> PARTITION BY LIST (province_id) (  
 ->     PARTITION p0 VALUES IN (1,2,3,4,5,6,7,8),  
 ->     PARTITION p1 VALUES IN (9,10,11,12,16,21),  
 ->     PARTITION p2 VALUES IN (13,14,15,19),  
 ->     PARTITION p3 VALUES IN (17,18,20,22,23,24)  
 -> );  
Query OK, 0 rows affected (0.33 sec)  
```

**上面的这个创建list分区时，如果有主銉的话，分区时主键必须在其中，不然就会报错。如果我不用主键，分区就创建成功了，一般情况下，一个张表肯定会有一个主键，这算是一个分区的局限性吧。**

如果对数据进行测试，请参考range分区的测试来操作

### 4，hash分区

HASH分区主要用来确保数据在预先确定数目的分区中平均分布，你所要做的只是基于将要被哈希的列值指定一个列值或表达式，以 及指定被分区的表将要被分割成的分区数量。

****

```Sql
 mysql> CREATE TABLE IF NOT EXISTS `hash_part` (  
 ->   `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '评论ID',  
 ->   `comment` varchar(1000) NOT NULL DEFAULT '' COMMENT '评论',  
 ->   `ip` varchar(25) NOT NULL DEFAULT '' COMMENT '来源IP',  
 ->   PRIMARY KEY (`id`)  
 -> ) ENGINE=INNODB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=1  
 -> PARTITION BY HASH(id)  
 -> PARTITIONS 3;  
Query OK, 0 rows affected (0.06 sec)  
```

测试请参考range分区的操作

### 5，key分区

按照KEY进行分区类似于按照HASH分区，除了HASH分区使用的用 户定义的表达式，而KEY分区的 哈希函数是由MySQL 服务器提供。

```
mysql> CREATE TABLE IF NOT EXISTS `key_part` (  
 ->   `news_id` int(11) NOT NULL  COMMENT '新闻ID',  
 ->   `content` varchar(1000) NOT NULL DEFAULT '' COMMENT '新闻内容',  
 ->   `u_id` varchar(25) NOT NULL DEFAULT '' COMMENT '来源IP',  
 ->   `create_time` DATE NOT NULL DEFAULT '0000-00-00 00:00:00' COMMENT '时间'  
 -> ) ENGINE=INNODB  DEFAULT CHARSET=utf8  
 -> PARTITION BY LINEAR HASH(YEAR(create_time))  
 -> PARTITIONS 3;  
Query OK, 0 rows affected (0.07 sec)  
```

测试请参考range分区的操作

### 6，子分区

子分区是分区表中每个分区的再次分割，子分区既可以使用HASH希分区，也可以使用KEY分区。这 也被称为复合分区（composite partitioning）。

1，如果一个分区中创建了子分区，其他分区也要有子分区

2，如果创建了了分区，每个分区中的子分区数必有相同

3，同一分区内的子分区，名字不相同，不同分区内的子分区名子可以相同（5.1.50不适用）

```
 mysql> CREATE TABLE IF NOT EXISTS `sub_part` (  
 ->   `news_id` int(11) NOT NULL  COMMENT '新闻ID',  
 ->   `content` varchar(1000) NOT NULL DEFAULT '' COMMENT '新闻内容',  
 ->   `u_id`  int(11) NOT NULL DEFAULT 0s COMMENT '来源IP',  
 ->   `create_time` DATE NOT NULL DEFAULT '0000-00-00 00:00:00' COMMENT '时间'  
 -> ) ENGINE=INNODB  DEFAULT CHARSET=utf8  
 -> PARTITION BY RANGE(YEAR(create_time))  
 -> SUBPARTITION BY HASH(TO_DAYS(create_time))(  
 -> PARTITION p0 VALUES LESS THAN (1990)(SUBPARTITION s0,SUBPARTITION s1,SUBPARTITION s2),  
 -> PARTITION p1 VALUES LESS THAN (2000)(SUBPARTITION s3,SUBPARTITION s4,SUBPARTITION good),  
 -> PARTITION p2 VALUES LESS THAN MAXVALUE(SUBPARTITION tank0,SUBPARTITION tank1,SUBPARTITION tank3)  
 -> );  
Query OK, 0 rows affected (0.07 sec)  
```

**官方网站说不同分区内的子分区可以有相同的名字，但是mysql5.1.50却不行会提示以下错误**

**ERROR 1517 (HY000): Duplicate partition name s1**

## 三，分区管理

### 1，删除分区

mysql> alter table user drop partition p4;  

### 2，新增分区

```
//range添加新分区  
mysql> alter table user add partition(partition p4 values less than MAXVALUE);  
Query OK, 0 rows affected (0.06 sec)  
Records: 0  Duplicates: 0  Warnings: 0  
  
//list添加新分区  
mysql> alter table list_part add partition(partition p4 values in (25,26,28));  
Query OK, 0 rows affected (0.01 sec)  
Records: 0  Duplicates: 0  Warnings: 0  
  
//hash重新分区  
mysql> alter table hash_part add partition partitions 4;  
Query OK, 0 rows affected (0.12 sec)  
Records: 0  Duplicates: 0  Warnings: 0  
  
//key重新分区  
mysql> alter table key_part add partition partitions 4;  
Query OK, 1 row affected (0.06 sec)    //有数据也会被重新分配  
Records: 1  Duplicates: 0  Warnings: 0  
  
//子分区添加新分区，虽然我没有指定子分区，但是系统会给子分区命名的  
mysql> alter table sub1_part add partition(partition p3 values less than MAXVALUE);  
Query OK, 0 rows affected (0.02 sec)  
Records: 0  Duplicates: 0  Warnings: 0  
  
mysql> show create table sub1_part\G;  
*************************** 1. row ***************************  
 Table: sub1_part  
Create Table: CREATE TABLE `sub1_part` (  
 `news_id` int(11) NOT NULL COMMENT '新闻ID',  
 `content` varchar(1000) NOT NULL DEFAULT '' COMMENT '新闻内容',  
 `u_id` varchar(25) NOT NULL DEFAULT '' COMMENT '来源IP',  
 `create_time` date NOT NULL DEFAULT '0000-00-00' COMMENT '时间'  
) ENGINE=InnoDB DEFAULT CHARSET=utf8  
!50100 PARTITION BY RANGE (YEAR(create_time))  
SUBPARTITION BY HASH (TO_DAYS(create_time))  
(PARTITION p0 VALUES LESS THAN (1990)  
 (SUBPARTITION s0 ENGINE = InnoDB,  
 SUBPARTITION s1 ENGINE = InnoDB,  
 SUBPARTITION s2 ENGINE = InnoDB),  
 PARTITION p1 VALUES LESS THAN (2000)  
 (SUBPARTITION s3 ENGINE = InnoDB,  
 SUBPARTITION s4 ENGINE = InnoDB,  
 SUBPARTITION good ENGINE = InnoDB),  
 PARTITION p2 VALUES LESS THAN (3000)  
 (SUBPARTITION tank0 ENGINE = InnoDB,  
 SUBPARTITION tank1 ENGINE = InnoDB,  
 SUBPARTITION tank3 ENGINE = InnoDB),  
 PARTITION p3 VALUES LESS THAN MAXVALUE  
 (SUBPARTITION p3sp0 ENGINE = InnoDB,    //子分区的名子是自动生成的  
 SUBPARTITION p3sp1 ENGINE = InnoDB,  
 SUBPARTITION p3sp2 ENGINE = InnoDB))  
1 row in set (0.00 sec)  
```

### 3，重新分区

 

```
//range重新分区  
mysql> ALTER TABLE user REORGANIZE PARTITION p0,p1,p2,p3,p4 INTO (PARTITION p0 VALUES LESS THAN MAXVALUE);  
Query OK, 11 rows affected (0.08 sec)  
Records: 11  Duplicates: 0  Warnings: 0  
  
//list重新分区  
mysql> ALTER TABLE list_part REORGANIZE PARTITION p0,p1,p2,p3,p4 INTO (PARTITION p0 VALUES in (1,2,3,4,5));  
Query OK, 0 rows affected (0.28 sec)  
Records: 0  Duplicates: 0  Warnings: 0  
  
//hash和key分区不能用REORGANIZE，官方网站说的很清楚  
mysql> ALTER TABLE key_part REORGANIZE PARTITION COALESCE PARTITION 9;  
ERROR 1064 (42000): You have an error in your SQL syntax; check the manual that corresponds to your MySQL server version for the right syntax to use near 'PARTITION 9' at line 1  
```

## 四，分区优点

1，分区可以分在多个磁盘，存储更大一点

2，根据查找条件，也就是where后面的条件，查找只查找相应的分区不用全部查找了

3，进行大数据搜索时可以进行并行处理。

4，跨多个磁盘来分散数据查询，来获得更大的查询吞吐量

转： http://blog.51yip.com/mysql/1013.html