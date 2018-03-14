[TOC]



# mysql 分布式自增ID

/Users/jerryye/backup/studio/AvailableCode/basis/id_gen唯一id生成器/distributed_id_mysql

## 实现说明

因为MySQL本身支持auto_increment操作，很自然地，我们会想到借助这个特性来实现这个功能。
Flicker在解决全局ID生成方案里就采用了MySQL自增长ID的机制（auto_increment + replace into + MyISAM）。一个生成64位ID方案具体就是这样的： 
先创建单独的数据库(eg:ticket)，然后创建一个表：

```mssql
CREATE TABLE Tickets64 (
id bigint(20) unsigned NOT NULL auto_increment,
stub char(1) NOT NULL default '',
PRIMARY KEY (id),
UNIQUE KEY stub (stub)
) ENGINE=MyISAM
```

当我们插入记录后，执行SELECT * from Tickets64，查询结果就是这样的：

```
+-------------------+------+
| id | stub |
+-------------------+------+
| 72157623227190423 | a |
+-------------------+------+
```

在我们的应用端需要做下面这两个操作，在一个事务会话里提交：

```sql
REPLACE INTO Tickets64 (stub) VALUES ('a');
SELECT LAST_INSERT_ID();
```

这样我们就能拿到不断增长且不重复的ID了。 
到上面为止，我们只是在单台数据库上生成ID，从高可用角度考虑，接下来就要解决单点故障问题：Flicker启用了两台数据库服务器来生成ID，通过区分auto_increment的起始值和步长来生成奇偶数的ID。

TicketServer1:

```sql
BEGIN;
SET SESSION auto_increment_increment = 2;
set SESSION auto_increment_offset=1;
REPLACE INTO Tickets64 (stub) VALUES ('a');
SELECT LAST_INSERT_ID();
COMMIT;
```

TicketServer2:

```sql
BEGIN;
SET SESSION auto_increment_increment = 2;
set SESSION auto_increment_offset=2;
REPLACE INTO Tickets64 (stub) VALUES ('a');
SELECT LAST_INSERT_ID();
COMMIT;
```

最后，在客户端只需要通过轮询方式取ID就可以了。

优点：充分借助数据库的自增ID机制，提供高可靠性，生成的ID有序。
缺点：占用两个独立的MySQL实例，有些浪费资源，成本较高。

## 关于这个方案,有几点细节这里再说明一下：

\1. flickr的数据库ID生成服务器是专用服务器，服务器上只有一个数据库，数据库中表都是用于生成Sequence的，这也是因为auto-increment-offset和auto-increment-increment这两个数据库变量是数据库实例级别的变量。
\2. flickr的方案中表格中的stub字段只是一`个char(1) NOT NULL存根字段，并非表名，因此，一般来说，一个Sequence表只有一条纪录，可以同时为多张表生成ID，如果需要表的ID是有连续的，需要为该表单独建立Sequence表。`

\3. 方案使用了mysql的LAST_INSERT_ID()函数，这也决定了Sequence表只能有一条记录。
\4. 使用REPLACE INTO插入数据，这是很讨巧的作法，主要是希望利用mysql自身的机制生成ID,不仅是因为这样简单，更是因为我们需要ID按照我们设定的方式(初值和步长)来生成。

\5. SELECT LAST_INSERT_ID()必须要于REPLACE INTO语句在同一个数据库连接下才能得到刚刚插入的新ID，否则返回的值总是0
\6. 该方案中Sequence表使用的是**MyISAM**引擎，以获取更高的性能，注意：MyISAM引擎使用的是表级别的锁，**MyISAM对表的读写是串行的**，因此不必担心在并发时两次读取会得到同一个ID(另外，应该程序也不需要同步，每个请求的线程都会得到一个新的connection,不存在需要同步的共享资源)。经过实际对比测试，使用一样的Sequence表进行ID生成，MyISAM引擎要比InnoDB表现高出很多！

\7. 可使用纯JDBC实现对Sequence表的操作，以便获得更高的效率，实验表明，即使只使用Spring JDBC性能也不及纯JDBC来得快！

 

## 实现该方案,应用程序同样需要做一些处理，主要是两方面的工作：

\1. 自动均衡数据库ID生成服务器的访问
\2. 确保在某个数据库ID生成服务器失效的情况下，能将请求转发到其他服务器上执行。





http://blog.csdn.net/bluishglc/article/details/7710738

http://www.cnblogs.com/baiwa/p/5318432.html