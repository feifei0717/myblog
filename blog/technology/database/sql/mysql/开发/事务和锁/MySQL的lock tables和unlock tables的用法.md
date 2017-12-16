# MySQL的lock tables和unlock tables的用法

SJY • 发表于：2016年09月26日 09:43 • 阅读：86

早就听说lock tables和unlock tables这两个命令，从字面也大体知道，前者的作用是锁定表，后者的作用是解除锁定。但是具体如何用，怎么用，不太清楚。今天详细研究了下，总算搞明白了2者的用法。

lock tables 命令是为当前线程锁定表.这里有2种类型的锁定，一种是读锁定，用命令 lock tables tablename read;另外一种是写锁定，用命令lock tables tablename write.下边分别介绍：

**1. lock table 读锁定**

如果一个线程获得在一个表上的read锁，那么该线程和所有其他线程只能从表中读数据，不能进行任何写操作。

下边我们测试下，测试表为user表。

不同的线程，可以通过开多个命令行MySQL客户端来实现：

| 时刻点  | 线程A（命令行窗口A）                              | 线程B（命令行窗口B）                              |
| ---- | ---------------------------------------- | ---------------------------------------- |
|      |                                          |                                          |
| 1    | mysql> lock tables user read;Query OK, 0 rows affected (0.00 sec)mysql>对user表加读锁定。 |                                          |
| 2    | mysql> select * from user;+------+-----------+\| id   \| name      \|+------+-----------+\|   22 \| abc       \|\|  223 \| dabc      \|\| 2232 \| dddabc    \|\|   45 \| asdsagd   \|\|   23 \| ddddddddd \|+------+-----------+5 rows in set (0.00 sec)mysql>自己的读操作未被阻塞 | mysql> select * from user;+------+-----------+\| id   \| name      \|+------+-----------+\|   22 \| abc       \|\|  223 \| dabc      \|\| 2232 \| dddabc    \|\|   45 \| asdsagd   \|\|   23 \| ddddddddd \|+------+-----------+5 rows in set (0.00 sec)mysql>其他线程的读也未被阻塞 |
| 3    | mysql> insert into user values(12,'test');ERROR 1099 (HY000): Table 'user' was locked with a READ lock and can't be updatedmysql>发现本线程的写操作被阻塞 | mysql> insert into user values(22,'2test');发现没有任何反应，一直等待中，说明没有得到写锁定，一直处于等待中。 |
| 4    | mysql> unlock tables;Query OK, 0 rows affected (0.00 sec)mysql>释放读锁定。 | mysql> insert into user values(22,'ddd');Query OK, 1 row affected (1 min 27.25 sec)mysql>在线程A释放读锁后，线程B获得了资源，刚才等待的写操作执行了。 |
| 5    | mysql> lock tables user read local;Query OK, 0 rows affected (0.00 sec)mysql>获得读锁定的时候增加local选项。 | mysql> insert into user values(2,'b');Query OK, 1 row affected (0.00 sec)mysql>发现其他线程的insert未被阻塞。 |
| 6    |                                          | mysql> update user set name  = 'aaaaaaaaaaaaaaaaaaaaa' where id = 1;但是其他线程的update操作被阻塞了。 |

*注意：user表必须为Myisam表，以上测试才能全部OK，如果user表为innodb表，则lock tables user read local命令可能没有效果，也就是说，如果user表为innodb表，第6时刻将不会被阻塞，这是因为INNODB表是事务型的，对于事务表，例如InnoDB和BDB，--single-transaction是一个更好的选项，因为它不根本需要锁定表*

 **2. lock table 写锁定**

如果一个线程在一个表上得到一个   WRITE   锁，那么只有拥有这个锁的线程可以从表中读取和写表。其它的线程被阻塞。

写锁定的命令：lock tables user write.user表为Myisam类型的表。

参考如下测试：

 

 

| 时刻点  | 线程A（命令行窗口A）                              | 线程B（命令行窗口B）                              |
| ---- | ---------------------------------------- | ---------------------------------------- |
|      |                                          |                                          |
| 1    | mysql> lock tables user write;Query OK, 0 rows affected (0.00 sec)对user表加写锁定。 |                                          |
| 2    | mysql> select * from user;+----+-----------------------+\| id \| name                  \|+----+-----------------------+\|  1 \| aaaaaaaaaaaaaaaaaaaaa \|\|  2 \| b                     \|+----+-----------------------+2 rows in set (0.00 sec)自己可以继续进行读操作 | mysql> select * from user;其他线程读操作被阻塞。    |
| 3    | mysql> unlock tables ;Query OK, 0 rows affected (0.00 sec)释放锁定。 |                                          |
| 4    |                                          | mysql> select * from user;+----+-----------------------+\| id \| name                  \|+----+-----------------------+\|  1 \| aaaaaaaaaaaaaaaaaaaaa \|\|  2 \| b                     \|+----+-----------------------+2 rows in set (32.56 sec)其他线程获得资源，可以读数据了。 |

以上所有结果均在MySQL 5.4.3下测试通过。

欢迎转载，但请保留原文地址 <http://www.sjyhome.com/mysql/lock-tables-unlock-tables.html>