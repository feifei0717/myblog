# mysql常见的hint 

mysql常用的hint
对于经常使用oracle的朋友可能知道，oracle的hint功能种类很多，对于优化sql语句提供了很多方法。同样，在mysql里，也有类似的hint功能。下面介绍一些常用的。
**强制索引 FORCE INDEX** 
SELECT * FROM TABLE1 FORCE INDEX (FIELD1) …
以上的SQL语句只使用建立在FIELD1上的索引，而不使用其它字段上的索引。
**忽略索引 IGNORE INDEX** 
SELECT * FROM TABLE1 IGNORE INDEX (FIELD1, FIELD2) …
在上面的SQL语句中，TABLE1表中FIELD1和FIELD2上的索引不被使用。 
**关闭查询缓冲 SQL_NO_CACHE** 
SELECT SQL_NO_CACHE field1, field2 FROM TABLE1;
有一些SQL语句需要实时地查询数据，或者并不经常使用（可能一天就执行一两次）,这样就需要把缓冲关了,不管这条SQL语句是否被执行过，服务器都不会在缓冲区中查找，每次都会执行它。
**强制查询缓冲 SQL_CACHE**
SELECT SQL_CALHE * FROM TABLE1;
如果在my.ini中的query_cache_type设成2，这样只有在使用了SQL_CACHE后，才使用查询缓冲。
**优先操作 HIGH_PRIORITY**
HIGH_PRIORITY可以使用在select和insert操作中，让MYSQL知道，这个操作优先进行。
SELECT HIGH_PRIORITY * FROM TABLE1;
**滞后操作 LOW_PRIORITY**
LOW_PRIORITY可以使用在insert和update操作中，让mysql知道，这个操作滞后。
update LOW_PRIORITY table1 set field1= where field1= …
**延时插入 INSERT DELAYED**
INSERT DELAYED INTO table1 set field1= …
INSERT DELAYED INTO，是客户端提交数据给MySQL，MySQL返回OK状态给客户端。而这是并不是已经将数据插入表，而是存储在内存里面等待排队。当mysql有空余时，再插入。另一个重要的好处是，来自许多客户端的插入被集中在一起，并被编写入一个块。这比执行许多独立的插入要快很多。坏处是，不能返回自动递增的ID，以及系统崩溃时，MySQL还没有来得及插入数据的话，这些数据将会丢失。
**强制连接顺序 STRAIGHT_JOIN**
SELECT TABLE1.FIELD1, TABLE2.FIELD2 FROM TABLE1 STRAIGHT_JOIN TABLE2 WHERE …
由上面的SQL语句可知，通过STRAIGHT_JOIN强迫MySQL按TABLE1、TABLE2的顺序连接表。如果你认为按自己的顺序比MySQL推荐的顺序进行连接的效率高的话，就可以通过STRAIGHT_JOIN来确定连接顺序。
**强制使用临时表 SQL_BUFFER_RESULT**
SELECT SQL_BUFFER_RESULT * FROM TABLE1 WHERE … 
当我们查询的结果集中的数据比较多时，可以通过SQL_BUFFER_RESULT.选项强制将结果集放到临时表中，这样就可以很快地释放MySQL的表锁（这样其它的SQL语句就可以对这些记录进行查询了），并且可以长时间地为客户端提供大记录集。
**分组使用临时表 SQL_BIG_RESULT和SQL_SMALL_RESULT**
SELECT SQL_BUFFER_RESULT FIELD1, COUNT(*) FROM TABLE1 GROUP BY FIELD1;
一般用于分组或DISTINCT关键字，这个选项通知MySQL，如果有必要，就将查询结果放到临时表中，甚至在临时表中进行排序。SQL_SMALL_RESULT比起SQL_BIG_RESULT差不多，很少使用。





https://www.cnblogs.com/wzjbk/p/5813956.html