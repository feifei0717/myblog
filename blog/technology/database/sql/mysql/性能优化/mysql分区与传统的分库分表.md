[TOC]



# MySQL分区与传统的分库分表

Posted by haitian-coder on May 26, 2016

## 传统的分库分表

传统的分库分表都是通过应用层逻辑实现的，对于数据库层面来说，都是普通的表和库。

### 分库

#### 分库的原因

首先，在单台数据库服务器性能足够的情况下，分库对于数据库性能是没有影响的。在数据库存储上，`database`只起到一个`namespace`的作用。`database`中的表文件存储在一个以`database名`命名的文件夹中。比如下面的`employees`数据库：

```
mysql> show tables in employees;
+---------------------+
| Tables_in_employees |
+---------------------+
| departments         |
| dept_emp            |
| dept_manager        |
| employees           |
| salaries            |
| titles              |
+---------------------+

```

在操作系统中看是这样的：

```
# haitian at haitian-coder.local in /usr/local/var/mysql/employees on git:master ● [21:19:47]
→ ls  
db.opt           dept_emp.frm     dept_manager.ibd salaries.frm     titles.ibd
departments.frm  dept_emp.ibd     employees.frm    salaries.ibd
departments.ibd  dept_manager.frm employees.ibd    titles.frm

```

`database`不是文件，只起到`namespace`的作用，所以`MySQL`对`database`大小当然也是没有限制的，而且对里面的表数量也没有限制。

> C.10.2 Limits on Number of Databases and Tables
>
> MySQL has no limit on the number of databases. The underlying file system may have a limit on the number of directories.
>
> MySQL has no limit on the number of tables. The underlying file system may have a limit on the number of files that represent tables. Individual storage engines may impose engine-specific constraints. InnoDB permits up to 4 billion tables.

所以，为什么要分库呢？

答案是**为了解决单台服务器的性能问题，当单台数据库服务器无法支撑当前的数据量时，就需要根据业务逻辑紧密程度把表分成几撮，分别放在不同的数据库服务器中以降低单台服务器的负载。**

分库一般考虑的是垂直切分，除非在垂直切分后，数据量仍然多到单台服务器无法负载，才继续水平切分。

比如一个论坛系统的数据库因当前服务器性能无法满足需要进行分库。先垂直切分，按业务逻辑把用户相关数据表比如用户信息、积分、用户间私信等放入user数据库；论坛相关数据表比如板块，帖子，回复等放入forum数据库，两个数据库放在不同服务器上。

拆分后表往往不可能完全无关联，比如帖子中的发帖人、回复人这些信息都在user数据库中。未拆分前可能一次联表查询就能获取当前帖子的回复、发帖人、回复人等所有信息，拆分后因为跨数据库无法联表查询，只能多次查询获得最终数据。

所以总结起来，**分库的目的是降低单台服务器负载，切分原则是根据业务紧密程度拆分，缺点是跨数据库无法联表查询**。

### 分表

#### 分表的原因

> 当数据量超大的时候，B-Tree索引就无法起作用了。除非是索引覆盖查询，否则数据库服务器需要根据索引扫描的结果回表，查询所有符合条件的记录，如果数据量巨大，这将产生大量随机I/O，随之，数据库的响应时间将大到不可接受的程度。另外，索引维护（磁盘空间、I/O操作）的代价也非常高。

#### 垂直分表

**原因：**

1.根据[MySQL索引实现原理及相关优化策略](http://haitian299.github.io/2016/05/20/mysql-index-and-optimizing/)的内容我们知道`Innodb`主索引叶子节点存储着当前行的所有信息，所以减少字段可使内存加载更多行数据，有利于查询。

2.受限于操作系统中的文件大小限制。

**切分原则：** 把不常用或业务逻辑不紧密或存储内容比较多的字段分到新的表中可使表存储更多数据。。

#### 水平分表

**原因：**

1.随着数据量的增大，table行数巨大，查询的效率越来越低。

2.同样受限于操作系统中的文件大小限制，数据量不能无限增加，当到达一定容量时，需要水平切分以降低单表（文件）的大小。

**切分原则：** 增量区间或散列或其他业务逻辑。

使用哪种切分方法要根据实际业务逻辑判断。

比如对表的访问多是近期产生的新数据，历史数据访问较少，可以考虑根据时间增量把数据按照一定时间段（比如每年）切分。

如果对表的访问较均匀，没有明显的热点区域，则可以考虑用范围（比如每500w一个表）或普通Hash或一致性Hash来切分。

**全局主键问题：**

原本依赖数据库生成主键（比如自增）的表在拆分后需要自己实现主键的生成，因为一般拆分规则是建立在主键上的，所以在插入新数据时需要确定主键后才能找到存储的表。

实际应用中也已经有了比较成熟的方案。比如对于自增列做主键的表，`flickr`的全局主键生成方案很好的解决了性能和单点问题，具体实现原理可以参考[这个帖子](http://blog.csdn.net/bluishglc/article/details/7710738)。除此之外，还有类似于uuid的全局主键生成方案，比如[达达参考的`Instagram`的ID生成器](http://www.infoq.com/cn/articles/imdada-high-performance-server-optimization)。

**一致性Hash：**

使用一致性Hash切分比普通的Hash切分可扩展性更强，可以实现拆分表的添加和删除。一致性Hash的具体原理可以参考[这个帖子](http://blog.csdn.net/cywosp/article/details/23397179)，如果拆分后的表存储在不同服务器节点上，可以跟帖子一样对节点名或ip取Hash；如果拆分后的表存在一个服务器中则可对拆分后的表名取Hash。

## MySQL的分区表

上面介绍的传统的分库分表都是在应用层实现，拆分后都要对原有系统进行很大的调整以适应新拆分后的库或表，比如实现一个`SQL`中间件、原本的联表查询改成两次查询、实现一个全局主键生成器等等。

而下面介绍的`MySQL`分区表是在数据库层面，`MySQL`自己实现的分表功能，在很大程度上简化了分表的难度。

### 介绍

> 对用户来说，分区表是一个独立的逻辑表，但是底层由多个物理子表实现。

也就是说，对于原表分区后，对于应用层来说可以不做变化，我们无需改变原有的`SQL`语句，相当于`MySQL`帮我们实现了传统分表后的`SQL`中间件，当然，`MySQL`的分区表的实现要复杂很多。

另外，在创建分区时可以指定分区的索引文件和数据文件的存储位置，所以可以把数据表的数据分布在不同的物理设备上，从而高效地利用多个硬件设备。

一些限制：

1.在5.6.7之前的版本，一个表最多有`1024`个分区；从5.6.7开始，一个表最多可以有`8192`个分区。

2.分区表中无法使用外键约束。

3.主表的所有唯一索引列（包括主键）都必须包含分区字段。`MySQL`官方文档中写的是：

> All columns used in the partitioning expression for a partitioned table must be part of every unique key that the table may have.

这句话不是很好理解，需要通过例子才能明白，`MySQL`官方文档也为此限制特意做了[举例和解释](http://dev.mysql.com/doc/refman/5.7/en/partitioning-limitations-partitioning-keys-unique-keys.html)。

### 分区表的类型

#### RANGE分区

根据范围分区，范围应该连续但是不重叠，使用`PARTITION BY RANGE`, `VALUES LESS THAN`关键字。不使用`COLUMNS`关键字时`RANGE`括号内必须为整数字段名或返回确定整数的函数。

根据数值范围：

```
CREATE TABLE employees (
    id INT NOT NULL,
    fname VARCHAR(30),
    lname VARCHAR(30),
    hired DATE NOT NULL DEFAULT '1970-01-01',
    separated DATE NOT NULL DEFAULT '9999-12-31',
    job_code INT NOT NULL,
    store_id INT NOT NULL
)
PARTITION BY RANGE (store_id) (
    PARTITION p0 VALUES LESS THAN (6),
    PARTITION p1 VALUES LESS THAN (11),
    PARTITION p2 VALUES LESS THAN (16),
    PARTITION p3 VALUES LESS THAN MAXVALUE
);

```

根据`TIMESTAMP`范围：

```
CREATE TABLE quarterly_report_status (
    report_id INT NOT NULL,
    report_status VARCHAR(20) NOT NULL,
    report_updated TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)
PARTITION BY RANGE ( UNIX_TIMESTAMP(report_updated) ) (
    PARTITION p0 VALUES LESS THAN ( UNIX_TIMESTAMP('2008-01-01 00:00:00') ),
    PARTITION p1 VALUES LESS THAN ( UNIX_TIMESTAMP('2008-04-01 00:00:00') ),
    PARTITION p2 VALUES LESS THAN ( UNIX_TIMESTAMP('2008-07-01 00:00:00') ),
    PARTITION p3 VALUES LESS THAN ( UNIX_TIMESTAMP('2008-10-01 00:00:00') ),
    PARTITION p4 VALUES LESS THAN ( UNIX_TIMESTAMP('2009-01-01 00:00:00') ),
    PARTITION p5 VALUES LESS THAN ( UNIX_TIMESTAMP('2009-04-01 00:00:00') ),
    PARTITION p6 VALUES LESS THAN ( UNIX_TIMESTAMP('2009-07-01 00:00:00') ),
    PARTITION p7 VALUES LESS THAN ( UNIX_TIMESTAMP('2009-10-01 00:00:00') ),
    PARTITION p8 VALUES LESS THAN ( UNIX_TIMESTAMP('2010-01-01 00:00:00') ),
    PARTITION p9 VALUES LESS THAN (MAXVALUE)
);

```

添加`COLUMNS`关键字可定义非integer范围及多列范围，不过需要注意`COLUMNS`括号内只能是列名，不支持函数；多列范围时，多列范围必须呈递增趋势：

根据`DATE`、`DATETIME`范围：

```
CREATE TABLE members (
    firstname VARCHAR(25) NOT NULL,
    lastname VARCHAR(25) NOT NULL,
    username VARCHAR(16) NOT NULL,
    email VARCHAR(35),
    joined DATE NOT NULL
)
PARTITION BY RANGE COLUMNS(joined) (
    PARTITION p0 VALUES LESS THAN ('1960-01-01'),
    PARTITION p1 VALUES LESS THAN ('1970-01-01'),
    PARTITION p2 VALUES LESS THAN ('1980-01-01'),
    PARTITION p3 VALUES LESS THAN ('1990-01-01'),
    PARTITION p4 VALUES LESS THAN MAXVALUE
);

```

根据多列范围：

```
CREATE TABLE rc3 (
    a INT,
    b INT
)
PARTITION BY RANGE COLUMNS(a,b) (
    PARTITION p0 VALUES LESS THAN (0,10),
    PARTITION p1 VALUES LESS THAN (10,20),
    PARTITION p2 VALUES LESS THAN (10,30),
    PARTITION p3 VALUES LESS THAN (10,35),
    PARTITION p4 VALUES LESS THAN (20,40),
    PARTITION p5 VALUES LESS THAN (MAXVALUE,MAXVALUE)
 );

```

#### List分区

根据具体数值分区，每个分区数值不重叠，使用`PARTITION BY LIST`、`VALUES IN`关键字。跟`Range`分区类似，不使用`COLUMNS`关键字时`List`括号内必须为整数字段名或返回确定整数的函数。

```
CREATE TABLE employees (
    id INT NOT NULL,
    fname VARCHAR(30),
    lname VARCHAR(30),
    hired DATE NOT NULL DEFAULT '1970-01-01',
    separated DATE NOT NULL DEFAULT '9999-12-31',
    job_code INT,
    store_id INT
)
PARTITION BY LIST(store_id) (
    PARTITION pNorth VALUES IN (3,5,6,9,17),
    PARTITION pEast VALUES IN (1,2,10,11,19,20),
    PARTITION pWest VALUES IN (4,12,13,14,18),
    PARTITION pCentral VALUES IN (7,8,15,16)
);

```

数值必须被所有分区覆盖，否则插入一个不属于任何一个分区的数值会报错。

```
mysql> CREATE TABLE h2 (
    ->   c1 INT,
    ->   c2 INT
    -> )
    -> PARTITION BY LIST(c1) (
    ->   PARTITION p0 VALUES IN (1, 4, 7),
    ->   PARTITION p1 VALUES IN (2, 5, 8)
    -> );
Query OK, 0 rows affected (0.11 sec)

mysql> INSERT INTO h2 VALUES (3, 5);
ERROR 1525 (HY000): Table has no partition for value 3

```

当插入多条数据出错时，如果表的引擎支持事务（`Innodb`），则不会插入任何数据；如果不支持事务，则出错前的数据会插入，后面的不会执行。

可以使用`IGNORE`关键字忽略出错的数据，这样其他符合条件的数据会全部插入不受影响。

```
mysql> TRUNCATE h2;
Query OK, 1 row affected (0.00 sec)

mysql> SELECT * FROM h2;
Empty set (0.00 sec)

mysql> INSERT IGNORE INTO h2 VALUES (2, 5), (6, 10), (7, 5), (3, 1), (1, 9);
Query OK, 3 rows affected (0.00 sec)
Records: 5  Duplicates: 2  Warnings: 0

mysql> SELECT * FROM h2;
+------+------+
| c1   | c2   |
+------+------+
|    7 |    5 |
|    1 |    9 |
|    2 |    5 |
+------+------+
3 rows in set (0.00 sec)

```

与`Range`分区相同，添加`COLUMNS`关键字可支持非整数和多列。

#### Hash分区

`Hash`分区主要用来确保数据在预先确定数目的分区中平均分布，`Hash`括号内只能是整数列或返回确定整数的函数，实际上就是使用返回的整数对分区数取模。

```
CREATE TABLE employees (
    id INT NOT NULL,
    fname VARCHAR(30),
    lname VARCHAR(30),
    hired DATE NOT NULL DEFAULT '1970-01-01',
    separated DATE NOT NULL DEFAULT '9999-12-31',
    job_code INT,
    store_id INT
)
PARTITION BY HASH(store_id)
PARTITIONS 4;

```

```
CREATE TABLE employees (
    id INT NOT NULL,
    fname VARCHAR(30),
    lname VARCHAR(30),
    hired DATE NOT NULL DEFAULT '1970-01-01',
    separated DATE NOT NULL DEFAULT '9999-12-31',
    job_code INT,
    store_id INT
)
PARTITION BY HASH( YEAR(hired) )
PARTITIONS 4;

```

`Hash`分区也存在与传统`Hash`分表一样的问题，可扩展性差。`MySQL`也提供了一个类似于一致`Hash`的分区方法－线性`Hash`分区，只需要在定义分区时添加`LINEAR`关键字，如果对实现原理感兴趣，可以查看[官方文档](http://dev.mysql.com/doc/refman/5.7/en/partitioning-linear-hash.html)。

```
CREATE TABLE employees (
    id INT NOT NULL,
    fname VARCHAR(30),
    lname VARCHAR(30),
    hired DATE NOT NULL DEFAULT '1970-01-01',
    separated DATE NOT NULL DEFAULT '9999-12-31',
    job_code INT,
    store_id INT
)
PARTITION BY LINEAR HASH( YEAR(hired) )
PARTITIONS 4;

```

#### Key分区

> 按照KEY进行分区类似于按照HASH分区，除了HASH分区使用的用户定义的表达式，而KEY分区的 哈希函数是由MySQL 服务器提供。MySQL 簇（Cluster）使用函数MD5()来实现KEY分区；对于使用其他存储引擎的表，服务器使用其自己内部的 哈希函数，这些函数是基于与PASSWORD()一样的运算法则。

`Key`分区与`Hash`分区很相似，只是`Hash`函数不同，定义时把`Hash`关键字替换成`Key`即可，同样`Key`分区也有对应与线性`Hash`的线性`Key`分区方法。

```
CREATE TABLE tk (
    col1 INT NOT NULL,
    col2 CHAR(5),
    col3 DATE
)
PARTITION BY LINEAR KEY (col1)
PARTITIONS 3;

```

另外，当表存在主键或唯一索引时可省略`Key`括号内的列名，`Mysql`将按照主键－唯一索引的顺序选择，当找不到唯一索引时报错。

#### 子分区

子分区是分区表中每个分区的再次分割。创建子分区方法：

```
CREATE TABLE ts (id INT, purchased DATE)
    PARTITION BY RANGE( YEAR(purchased) )
    SUBPARTITION BY HASH( TO_DAYS(purchased) )
    SUBPARTITIONS 2 (
        PARTITION p0 VALUES LESS THAN (1990),
        PARTITION p1 VALUES LESS THAN (2000),
        PARTITION p2 VALUES LESS THAN MAXVALUE
    );

```

和

```
CREATE TABLE ts (id INT, purchased DATE)
    PARTITION BY RANGE( YEAR(purchased) )
    SUBPARTITION BY HASH( TO_DAYS(purchased) ) (
        PARTITION p0 VALUES LESS THAN (1990) (
            SUBPARTITION s0
                DATA DIRECTORY = '/disk0/data'
                INDEX DIRECTORY = '/disk0/idx',
            SUBPARTITION s1
                DATA DIRECTORY = '/disk1/data'
                INDEX DIRECTORY = '/disk1/idx'
        ),
        PARTITION p1 VALUES LESS THAN (2000) (
            SUBPARTITION s2
                DATA DIRECTORY = '/disk2/data'
                INDEX DIRECTORY = '/disk2/idx',
            SUBPARTITION s3
                DATA DIRECTORY = '/disk3/data'
                INDEX DIRECTORY = '/disk3/idx'
        ),
        PARTITION p2 VALUES LESS THAN MAXVALUE (
            SUBPARTITION s4
                DATA DIRECTORY = '/disk4/data'
                INDEX DIRECTORY = '/disk4/idx',
            SUBPARTITION s5
                DATA DIRECTORY = '/disk5/data'
                INDEX DIRECTORY = '/disk5/idx'
        )
    );

```

需要注意的是：每个分区的子分区数必须相同。如果在一个分区表上的任何分区上使用`SUBPARTITION`来明确定义任何子分区，那么就必须定义所有的子分区，且必须指定一个全表唯一的名字。

### 分区表的使用及查询优化

#### 根据实际情况选择分区方法

对现有表分区的原则与传统分表一样。

传统的按照增量区间分表对应于分区的`Range`分区，比如对表的访问多是近期产生的新数据，历史数据访问较少，则可以按一定时间段（比如年或月）或一定数量（比如100万）对表分区，具体根据哪种取决于表索引结构。分区后最后一个分区即为近期产生的数据，当一段时间过后数据量再次变大，可对最后一个分区重新分区（`REORGANIZE PARTITION`）把一段时间（一年或一月）或一定数量（比如100万）的数据分离出去。

传统的散列方法分表对应于分区的Hash／Key分区，具体方法上面已经介绍过。

#### 查询优化

分区的目的是为了提高查询效率，如果查询范围是所有分区那么就说明分区没有起到作用，我们用`explain partitions`命令来查看`SQL`对于分区的使用情况。

一般来说，就是在`where`条件中加入分区列。

比如表`salaries`结构为：

```
mysql> show create table salaries\G;
*************************** 1. row ***************************
       Table: salaries
Create Table: CREATE TABLE `salaries` (
  `emp_no` int(11) NOT NULL,
  `salary` int(11) NOT NULL,
  `from_date` date NOT NULL,
  `to_date` date NOT NULL,
  PRIMARY KEY (`emp_no`,`from_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8
/*!50100 PARTITION BY RANGE (year(from_date))
(PARTITION p1 VALUES LESS THAN (1985) ENGINE = InnoDB,
 PARTITION p2 VALUES LESS THAN (1986) ENGINE = InnoDB,
 PARTITION p3 VALUES LESS THAN (1987) ENGINE = InnoDB,
 PARTITION p4 VALUES LESS THAN (1988) ENGINE = InnoDB,
 PARTITION p5 VALUES LESS THAN (1989) ENGINE = InnoDB,
 PARTITION p6 VALUES LESS THAN (1990) ENGINE = InnoDB,
 PARTITION p7 VALUES LESS THAN (1991) ENGINE = InnoDB,
 PARTITION p8 VALUES LESS THAN (1992) ENGINE = InnoDB,
 PARTITION p9 VALUES LESS THAN (1993) ENGINE = InnoDB,
 PARTITION p10 VALUES LESS THAN (1994) ENGINE = InnoDB,
 PARTITION p11 VALUES LESS THAN (1995) ENGINE = InnoDB,
 PARTITION p12 VALUES LESS THAN (1996) ENGINE = InnoDB,
 PARTITION p13 VALUES LESS THAN (1997) ENGINE = InnoDB,
 PARTITION p14 VALUES LESS THAN (1998) ENGINE = InnoDB,
 PARTITION p15 VALUES LESS THAN (1999) ENGINE = InnoDB,
 PARTITION p16 VALUES LESS THAN (2000) ENGINE = InnoDB,
 PARTITION p17 VALUES LESS THAN (2001) ENGINE = InnoDB,
 PARTITION p18 VALUES LESS THAN MAXVALUE ENGINE = InnoDB) */

```

则下面的查询没有利用分区，因为`partitions`中包含了所有的分区：

```
mysql> explain partitions select * from salaries where salary > 100000\G;
*************************** 1. row ***************************
           id: 1
  select_type: SIMPLE
        table: salaries
   partitions: p1,p2,p3,p4,p5,p6,p7,p8,p9,p10,p11,p12,p13,p14,p15,p16,p17,p18
         type: ALL
possible_keys: NULL
          key: NULL
      key_len: NULL
          ref: NULL
         rows: 2835486
        Extra: Using where

```

只有在`where`条件中加入分区列才能起到作用，过滤掉不需要的分区：

```
mysql> explain partitions select * from salaries where salary > 100000 and from_date > '1998-01-01'\G;
*************************** 1. row ***************************
           id: 1
  select_type: SIMPLE
        table: salaries
   partitions: p15,p16,p17,p18
         type: ALL
possible_keys: NULL
          key: NULL
      key_len: NULL
          ref: NULL
         rows: 1152556
        Extra: Using where

```

与普通搜索一样，在运算符左侧使用函数将使分区过滤失效，即使与分区函数想同也一样：

```
mysql> explain partitions select * from salaries where salary > 100000 and year(from_date) > 1998\G;
*************************** 1. row ***************************
           id: 1
  select_type: SIMPLE
        table: salaries
   partitions: p1,p2,p3,p4,p5,p6,p7,p8,p9,p10,p11,p12,p13,p14,p15,p16,p17,p18
         type: ALL
possible_keys: NULL
          key: NULL
      key_len: NULL
          ref: NULL
         rows: 2835486
        Extra: Using where

```

## 分区和分表的比较

- 传统分表后，`count`、`sum`等统计操作只能对所有切分表进行操作后之后在应用层再次计算得出最后统计数据。而分区表则不受影响，可直接统计。

> Queries involving aggregate functions such as SUM() and COUNT() can easily be parallelized. A simple example of such a query might be SELECT salesperson_id, COUNT(orders) as order_total FROM sales GROUP BY salesperson_id;. By “parallelized,” we mean that the query can be run simultaneously on each partition, and the final result obtained merely by summing the results obtained for all partitions.

- 分区对原系统改动最小，分区只涉及数据库层面，应用层不需要做出改动。
- 分区有个限制是主表的所有唯一字段（包括主键）必须包含分区字段，而分表没有这个限制。
- 分表包括垂直切分和水平切分，而分区只能起到水平切分的作用。



http://haitian299.github.io/2016/05/26/mysql-partitioning/