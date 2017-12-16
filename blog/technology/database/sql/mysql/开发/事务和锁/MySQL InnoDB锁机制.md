MySQL InnoDB一共有四种锁：共享锁（读锁，S锁）、排他锁（写锁，X锁）、意向共享锁（IS锁）和意向排他锁（IX锁）。其中共享锁与排他锁属于行级锁，另外两个意向锁属于表级锁。  

 

- 共享锁（读锁，S锁）：若事务T对数据对象A加上S锁，则事务T可以读A但不能修改A，其他事务只能再对A加S锁，而不能加X锁，直到T释放S锁。
- 排他锁（写锁，X锁）：若事务T对数据对象A加上X锁，则只允许T读取和修改A，其他事务不能再对A加作何类型的锁，直到T释放A上的X锁。
- 意向共享锁（IS锁）：事务T在对表中数据对象加S锁前，首先需要对该表加IS（或更强的IX）锁。
- 意向排他锁（IX锁）：事务T在对表中的数据对象加X锁前，首先需要对该表加IX锁。

比如SELECT ... FROM T1 LOCK IN SHARE MODE语句，首先会对表T1加IS锁，成功加上IS锁后才会对数据加S锁。

同样，SELECT ... FROM T1 FOR UPDATE语句，首先会对表T1加IX锁，成功加上IX锁后才会对数据加X锁。

MySQL InnoDB 锁兼容阵列

|        | **X** | **IX** | **S** | **IS** |
| ------ | ----- | ------ | ----- | ------ |
| **X**  | ✗     | ✗      | ✗     | ✗      |
| **IX** | ✗     | ✓      | ✗     | ✓      |
| **S**  | ✗     | ✗      | ✓     | ✓      |
| **IS** | ✗     | ✓      | ✓     | ✓      |

 

 

MySQL官网上有个死锁的例子，但分析得过于概括，这里我们详细分析一下。

首先，会话S1以SELECT * FROM t WHERE i = 1 LOCK IN SHARE MODE查询，该语句首先会对t表加IS锁，接着会对数据（i = 1）加S锁。

 

Sql代码  [![收藏代码](MySQL InnoDB锁机制_files/4353f310-b06c-476f-af0c-306f5b301849.png)]()

```
mysql> CREATE TABLE t (i INT) ENGINE = InnoDB;  
Query OK, 0 rows affected (1.07 sec)  
  
mysql> INSERT INTO t (i) VALUES(1);  
Query OK, 1 row affected (0.09 sec)  
  
mysql> START TRANSACTION;  
Query OK, 0 rows affected (0.00 sec)  
  
mysql> SELECT * FROM t WHERE i = 1 LOCK IN SHARE MODE;  
+------+  
| i    |  
+------+  
|    1 |  
+------+  
1 row in set (0.10 sec)  
```

 

Sql代码  [![收藏代码](MySQL InnoDB锁机制_files/1b45b8ed-c09e-46f4-9374-091a44381be5.png)]()

1. mysql> START TRANSACTION;  
2. Query OK, 0 rows affected (0.00 sec)  
3.   
4. mysql> DELETE FROM t WHERE i = 1;  

Sql代码  [![收藏代码](MySQL InnoDB锁机制_files/7b97f79c-8ccd-44bf-a10d-f03ce97b128b.png)]()

1. mysql> DELETE FROM t WHERE i = 1;  
2. Query OK, 1 row affected (0.00 sec)  
3.   
4. mysql>  

Sql代码  [![收藏代码](MySQL InnoDB锁机制_files/e1f3d605-3e34-431e-a389-1e321c5087ea.png)]()

1. mysql> DELETE FROM t WHERE i = 1;  
2. ERROR 1213 (40001): Deadlock found when trying to get lock; try restarting transaction  
3. mysql>  