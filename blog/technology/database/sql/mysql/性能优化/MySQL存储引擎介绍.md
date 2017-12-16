# [MySQL存储引擎介绍](http://www.jellythink.com/archives/640)

2014-09-18 分类：[MySQL](http://www.jellythink.com/archives/category/database/mysql) / [数据库](http://www.jellythink.com/archives/category/database) 阅读(2323)	评论(8) 

#### 前言

在数据库中存的就是一张张有着千丝万缕关系的表，所以表设计的好坏，将直接影响着整个数据库。而在设计表的时候，我们都会关注一个问题，使用什么存储引擎。等一下，存储引擎？什么是存储引擎？

#### 什么是存储引擎？

关系数据库表是用于存储和组织信息的数据结构，可以将表理解为由行和列组成的表格，类似于Excel的电子表格的形式。有的表简单，有的表复杂，有的表根本不用来存储任何长期的数据，有的表读取时非常快，但是插入数据时去很差；而我们在实际开发过程中，就可能需要各种各样的表，不同的表，就意味着存储不同类型的数据，数据的处理上也会存在着差异，那么。对于MySQL来说，它提供了很多种类型的存储引擎，我们可以根据对数据处理的需求，选择不同的存储引擎，从而最大限度的利用MySQL强大的功能。这篇博文将总结和分析各个引擎的特点，以及适用场合，并不会纠结于更深层次的东西。我的学习方法是先学会用，懂得怎么用，再去知道到底是如何能用的。下面就对MySQL支持的存储引擎进行简单的介绍。

#### MyISAM

在mysql客户端中，使用以下命令可以查看MySQL支持的引擎。

```
show engines;
```

MyISAM表是独立于操作系统的，这说明可以轻松地将其从Windows服务器移植到Linux服务器；每当我们建立一个MyISAM引擎的表时，就会在本地磁盘上建立三个文件，文件名就是表名。例如，我建立了一个MyISAM引擎的tb_Demo表，那么就会生成以下三个文件：

1. tb_demo.frm，存储表定义；
2. tb_demo.MYD，存储数据；
3. tb_demo.MYI，存储索引。

MyISAM表无法处理事务，这就意味着有事务处理需求的表，不能使用MyISAM存储引擎。MyISAM存储引擎特别适合在以下几种情况下使用：

1. 选择密集型的表。MyISAM存储引擎在筛选大量数据时非常迅速，这是它最突出的优点。
2. 插入密集型的表。MyISAM的并发插入特性允许同时选择和插入数据。例如：MyISAM存储引擎很适合管理邮件或Web服务器日志数据。

#### InnoDB

InnoDB是一个健壮的事务型存储引擎，这种存储引擎已经被很多互联网公司使用，为用户操作非常大的数据存储提供了一个强大的解决方案。我的电脑上安装的MySQL 5.6.13版，InnoDB就是作为默认的存储引擎。InnoDB还引入了行级锁定和外键约束，在以下场合下，使用InnoDB是最理想的选择：

1. 更新密集的表。InnoDB存储引擎特别适合处理多重并发的更新请求。
2. 事务。InnoDB存储引擎是支持事务的标准MySQL存储引擎。
3. 自动灾难恢复。与其它存储引擎不同，InnoDB表能够自动从灾难中恢复。
4. 外键约束。MySQL支持外键的存储引擎只有InnoDB。
5. 支持自动增加列AUTO_INCREMENT属性。

一般来说，如果需要事务支持，并且有较高的并发读取频率，InnoDB是不错的选择。

#### MEMORY

使用MySQL Memory存储引擎的出发点是速度。为得到最快的响应时间，采用的逻辑存储介质是系统内存。虽然在内存中存储表数据确实会提供很高的性能，但当mysqld守护进程崩溃时，所有的Memory数据都会丢失。获得速度的同时也带来了一些缺陷。它要求存储在Memory数据表里的数据使用的是长度不变的格式，这意味着不能使用BLOB和TEXT这样的长度可变的数据类型，VARCHAR是一种长度可变的类型，但因为它在MySQL内部当做长度固定不变的CHAR类型，所以可以使用。

一般在以下几种情况下使用Memory存储引擎：

1. 目标数据较小，而且被非常频繁地访问。在内存中存放数据，所以会造成内存的使用，可以通过参数max_heap_table_size控制Memory表的大小，设置此参数，就可以限制Memory表的最大大小。
2. 如果数据是临时的，而且要求必须立即可用，那么就可以存放在内存表中。
3. 存储在Memory表中的数据如果突然丢失，不会对应用服务产生实质的负面影响。

Memory同时支持散列索引和B树索引。B树索引的优于散列索引的是，可以使用部分查询和通配查询，也可以使用<、>和>=等操作符方便数据挖掘。散列索引进行“相等比较”非常快，但是对“范围比较”的速度就慢多了，因此散列索引值适合使用在=和<>的操作符中，不适合在<或>操作符中，也同样不适合用在order by子句中。

可以在表创建时利用USING子句指定要使用的版本。例如：

```
create table users
(
    id smallint unsigned not null auto_increment,
    username varchar(15) not null,
    pwd varchar(15) not null,
    index using hash (username),
    primary key (id)
)engine=memory;
```

上述代码创建了一个表，在username字段上使用了HASH散列索引。下面的代码就创建一个表，使用BTREE索引。

```
create table users
(
    id smallint unsigned not null auto_increment,
    username varchar(15) not null,
    pwd varchar(15) not null,
    index using btree (username),
    primary key (id)
)engine=memory;
```

#### MERGE

MERGE存储引擎是一组MyISAM表的组合（注意此方法只适用于MyISAM），这些MyISAM表结构必须完全相同，尽管其使用不如其它引擎突出，但是在某些情况下非常有用。说白了，Merge表就是几个相同MyISAM表的聚合器；Merge表中并没有数据，对Merge类型的表可以进行查询、更新、删除操作，这些操作实际上是对内部的MyISAM表进行操作。Merge存储引擎的使用场景。

对于服务器日志这种信息，一般常用的存储策略是将数据分成很多表，每个名称与特定的时间端相关。例如：可以用12个相同的表来存储服务器日志数据，每个表用对应各个月份的名字来命名。当有必要基于所有12个日志表的数据来生成报表，这意味着需要编写并更新多表查询，以反映这些表中的信息。与其编写这些可能出现错误的查询，不如将这些表合并起来使用一条查询，之后再删除Merge表，而不影响原来的数据，删除Merge表只是删除Merge表的定义，对内部的表没有任何影响。

下面就通过一个简单的例子来说说如何建立引擎为merge类型的表。

```
create table tb_log1(
    id int unsigned not null auto_increment, 
    log varchar(45),
    primary key(id)) engine=myisam;

insert into tb_log1(log) values('tb_log1_1');
insert into tb_log1(log) values('tb_log1_2');
insert into tb_log1(log) values('tb_log1_3');
insert into tb_log1(log) values('tb_log1_4');
insert into tb_log1(log) values('tb_log1_5');

create table tb_log2(
    id int unsigned not null auto_increment,
    log varchar(45),
    primary key(id)) engine=myisam;

insert into tb_log2(log) values('tb_log2_1');
insert into tb_log2(log) values('tb_log2_2');
insert into tb_log2(log) values('tb_log2_3');
insert into tb_log2(log) values('tb_log2_4');
```

先创建两个引擎为myisam（必须为myisam引擎）的表。插入上述数据，然后创建merge表，进行merge操作。

```
create table tb_merge(
    id int unsigned not null auto_increment, 
    log varchar(45), 
    primary key(id))engine=merge 
    union(tb_log1,tb_log2) insert_method=last;
```

这样就得到了一个引擎为merge的表，并且合并了tb_log1和tb_log2两个表。查询tb_merge表，可以得到以下数据：

```
+----+-----------+
| id | log       |
+----+-----------+
|  1 | tb_log1_1 |
|  2 | tb_log1_2 |
|  3 | tb_log1_3 |
|  4 | tb_log1_4 |
|  5 | tb_log1_5 |
|  1 | tb_log2_1 |
|  2 | tb_log2_2 |
|  3 | tb_log2_3 |
|  4 | tb_log2_4 |
+----+-----------+
```

现在我们主要来解释一下上面MERGE表的建表语句。

1. ENGINE=MERGE
   指明使用MERGE引擎，有些同学可能见到过ENGINE=MRG_MyISAM的例子，也是对的，它们是一回事。

2. UNION=(t1, t2)

   ​

   指明了MERGE表中挂接了些哪表，可以通过alter table的方式修改UNION的值，以实现增删MERGE表子表的功能。比如：

   ​

   ```
    alter table tb_merge engine=merge union(tb_log1) insert_method=last;
   ```

3. INSERT_METHOD=LAST
   INSERT_METHOD指明插入方式，取值可以是：0 不允许插入；FIRST 插入到UNION中的第一个表； LAST 插入到UNION中的最后一个表。

4. MERGE表及构成MERGE数据表结构的各成员数据表必须具有完全一样的结构。每一个成员数据表的数据列必须按照同样的顺序定义同样的名字和类型，索引也必须按照同样的顺序和同样的方式定义。

#### ARCHIVE

Archive是归档的意思，在归档之后很多的高级功能就不再支持了，仅仅支持最基本的插入和查询两种功能。在MySQL 5.5版以前，Archive是不支持索引，但是在MySQL 5.5以后的版本中就开始支持索引了。Archive拥有很好的压缩机制，它使用zlib压缩库，在记录被请求时会实时压缩，所以它经常被用来当做仓库使用。

#### 存储引擎的一些问题

1. 如何查看服务器有哪些存储引擎可以使用？

   ​

   为确定你的MySQL服务器可以用哪些存储引擎，执行如下命令：

   ​

   ```
   show engines;
   ```

   这个命令就能搞定了。

2. 如何选择合适的存储引擎？
   选择标准可以分为：
   （1）是否需要支持事务；
   （2）是否需要使用热备；
   （3）崩溃恢复：能否接受崩溃；
   （4）是否需要外键支持；
   然后按照标准，选择对应的存储引擎即可。

#### 总结

这篇文章总结了几种比较常用的存储引擎，对于实际的工作，需要根据具体的情况而定，结合实际的项目实例进行应用，才是最好的学习方法。

2014年9月17日 于深圳。

===修改日志===

2014年11月7日 修改了个别错别字。

2015年1月21日 添加了merge引擎的实战例子。

来源： <http://www.jellythink.com/archives/640>