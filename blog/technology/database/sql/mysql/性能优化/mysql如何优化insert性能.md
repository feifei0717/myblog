# 如何优化MySQL insert性能.md

 对于一些数据量较大的系统，面临的问题除了是查询效率低下，还有一个很重要的问题就是插入时间长。我们就有一个业务系统，每天的数据导入需要4-5个钟。这种费时的操作其实是很有风险的，假设程序出了问题，想重跑操作那是一件痛苦的事情。因此，提高[大数据](http://lib.csdn.net/base/hadoop)量系统的[MySQL](http://lib.csdn.net/base/mysql) insert效率是很有必要的。

​    经过对MySQL的[测试](http://lib.csdn.net/base/softwaretest)，发现一些可以提高insert效率的方法，供大家参考参考。

## 1. 一条SQL语句插入多条数据。

常用的插入语句如：

```
INSERT INTO `insert_table` (`datetime`, `uid`, `content`, `type`) VALUES ('0', 'userid_0', 'content_0', 0);INSERT INTO `insert_table` (`datetime`, `uid`, `content`, `type`) VALUES ('1', 'userid_1', 'content_1', 1);
```

修改成：

```
INSERT INTO `insert_table` (`datetime`, `uid`, `content`, `type`) VALUES ('0', 'userid_0', 'content_0', 0), ('1', 'userid_1', 'content_1', 1);
```

修改后的插入操作能够提高程序的插入效率。这里第二种SQL执行效率高的主要原因有两个，一是减少SQL语句解析的操作， 只需要解析一次就能进行数据的插入操作，二是SQL语句较短，可以减少网络传输的IO。

这里提供一些测试对比数据，分别是进行单条数据的导入与转化成一条SQL语句进行导入，分别测试1百、1千、1万条数据记录。

| 记录数  | 单条数据插入  | 多条数据插入 |
| ---- | ------- | ------ |
| 1百   | 0.149s  | 0.011s |
| 1千   | 1.231s  | 0.047s |
| 1万   | 11.678s | 0.218s |

## 2. 在事务中进行插入处理。

把插入修改成：

```
START TRANSACTION;
INSERT INTO `insert_table` (`datetime`, `uid`, `content`, `type`) VALUES ('0', 'userid_0', 'content_0', 0);INSERT INTO `insert_table` (`datetime`, `uid`, `content`, `type`) VALUES ('1', 'userid_1', 'content_1', 1);
...COMMIT;
```

使用事务可以提高数据的插入效率，这是因为进行一个INSERT操作时，MySQL内部会建立一个事务，在事务内进行真正插入处理。通过使用事务可以减少[数据库](http://lib.csdn.net/base/mysql)执行插入语句时多次“创建事务，提交事务”的消耗，所有插入都在执行后才进行提交操作。

这里也提供了测试对比，分别是不使用事务与使用事务在记录数为1百、1千、1万的情况。

| 记录数  | 不使用事务   | 使用事务   |
| ---- | ------- | ------ |
| 1百   | 0.149s  | 0.033s |
| 1千   | 1.231s  | 0.115s |
| 1万   | 11.678s | 1.050s |

性能测试：

这里提供了同时使用上面两种方法进行INSERT效率优化的测试。即多条数据合并为同一个SQL，并且在事务中进行插入。

| 记录数  | 单条数据插入     | 合并数据+事务插入 |
| ---- | ---------- | --------- |
| 1万   | 0m15.977s  | 0m0.309s  |
| 10万  | 1m52.204s  | 0m2.271s  |
| 100万 | 18m31.317s | 0m23.332s |

从测试结果可以看到，insert的效率大概有50倍的提高，这个一个很客观的数字。****

**注意事项：**

\1. SQL语句是有长度限制，在进行数据合并在同一SQL中务必不能超过SQL长度限制，通过max_allowed_packe配置可以修改，默认是1M。

\2. 事务需要控制大小，事务太大可能会影响执行的效率。MySQL有innodb_log_buffer_size配置项，超过这个值会日志会使用磁盘数据，这时，效率会有所下降。所以比较好的做法是，在事务大小达到配置项数据级前进行事务提交。

转载文章请注明来源： http://blog.csdn[.NET](http://lib.csdn.net/base/dotnet)/tigernorth/article/details/8094277