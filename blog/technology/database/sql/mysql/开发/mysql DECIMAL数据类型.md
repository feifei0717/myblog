# mysql DECIMAL数据类型

原创 2015年10月22日 16:43:57

MySQL数据类型DECIMAL(N,M)，N代表总长度，M代表小数部分长度



同事问MySQL数据类型DECIMAL(N,M)中N和M分别表示什么含义，M不用说，显然是小数点后的小数位数，但这个N究竟是小数点之前的最大位数，还是加上小数部分后的最大位数？这个还真记不清了。于是乎，创建测试表验证了一番，结果如下：

测试表，seller_cost字段定义为decimal(14,2)

```
CREATE TABLE `test_decimal` (
  `id` int(11) NOT NULL,
  `seller_cost` decimal(14,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf81234
```

起初，表中内容为空

```
mysql> select * from test_decimal;
Empty set (0.00 sec)12
```

插入整数部分长度为14的数字，报超出列范围的错误

```
mysql> insert into test_decimal(id,seller_cost) values(1,12345678901234);
ERROR 1264 (22003): Out of range value for column 'seller_cost' at row 112
```

插入整数部分长度为12的数字，可以正确插入

```
mysql> insert into test_decimal(id,seller_cost) values(1,123456789012);
Query OK, 1 row affected (0.00 sec)12
```

查询表，发现插入的整数值末尾被MySQL补了两位小数“.00”

```
mysql> select * from test_decimal;
+----+-----------------+
| id | seller_cost     |
+----+-----------------+
|  1 | 123456789012.00 |
+----+-----------------+
1 row in set (0.00 sec)1234567
```

继续插入整数部分12位，小数部分5位的数字，可以成功插入，但是有警告，警告表明小数部分发生了截断，被截取成了两位小数

```
mysql> insert into test_decimal(id,seller_cost) values(1,123456789012.12345);
Query OK, 1 row affected, 1 warning (0.00 sec)

mysql> show warnings;
+-------+------+--------------------------------------------------+
| Level | Code | Message                                          |
+-------+------+--------------------------------------------------+
| Note  | 1265 | Data truncated for column 'seller_cost' at row 1 |
+-------+------+--------------------------------------------------+
1 row in set (0.00 sec)

mysql> select * from test_decimal;
+----+-----------------+
| id | seller_cost     |
+----+-----------------+
|  1 | 123456789012.00 |
|  1 | 123456789012.12 |
+----+-----------------+
2 rows in set (0.00 sec)12345678910111213141516171819
```

缩小整数部分的长度为2，小数部分的长度继续保持为5，可以成功插入，但小数部分被截断为两位。

```
mysql> insert into test_decimal(id,seller_cost) values(1,12.12345);
Query OK, 1 row affected, 1 warning (0.00 sec)

mysql> show warnings;
+-------+------+--------------------------------------------------+
| Level | Code | Message                                          |
+-------+------+--------------------------------------------------+
| Note  | 1265 | Data truncated for column 'seller_cost' at row 1 |
+-------+------+--------------------------------------------------+
1 row in set (0.00 sec)

mysql> select * from test_decimal;
+----+-----------------+
| id | seller_cost     |
+----+-----------------+
|  1 | 123456789012.00 |
|  1 | 123456789012.12 |
|  1 |           12.12 |
+----+-----------------+
3 rows in set (0.00 sec)1234567891011121314151617181920
```

继续插入一个小数部分不足两位的数字，可正确插入，且小数部分被自动补全到两位。

```
mysql> insert into test_decimal(id,seller_cost) values(1,12.1);
Query OK, 1 row affected (0.00 sec)

mysql> select * from test_decimal;
+----+-----------------+
| id | seller_cost     |
+----+-----------------+
|  1 | 123456789012.00 |
|  1 | 123456789012.12 |
|  1 |           12.12 |
|  1 |           12.10 |
+----+-----------------+
4 rows in set (0.00 sec)12345678910111213
```

综上所述，DECIMAL(N,M)中M值的是小数部分的位数，若插入的值未指定小数部分或者小数部分不足M位则会自动补到M位小数，若插入的值小数部分超过了M为则会发生截断，截取前M位小数。N值得是整数部分加小数部分的总长度，也即插入的数字整数部分不能超过N-M位，否则不能成功插入，会报超出范围的错误。





http://blog.csdn.net/zyz511919766/article/details/49335565