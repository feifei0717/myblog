# mysql时间字段格式如何选择,TIMESTAMP,DATETIME,INT?

## 问题

Mysql的时间字段貌似有各种选择，像一般的情况（我也是）下就是用`INT`型来表示，直接存储时间戳。但是我知道在Mysql里至少还有`TIMESTAMP`和`DATETIME`型可以用来存储时间，我不知道这三者在使用上各有什么区别，在使用场景上需要怎么考虑，特别是它们在索引或者查询速度上有区别吗？



## 解答

首先 DATETIM和TIMESTAMP类型所占的存储空间不同，前者8个字节，后者4个字节，这样造成的后果是两者能表示的时间范围不同。前者范围为1000-01-01 00:00:00 ~ 9999-12-31 23:59:59，后者范围为1970-01-01 08:00:01到2038-01-19 11:14:07。所以可以看到TIMESTAMP支持的范围比DATATIME要小,容易出现超出的情况.

其次，TIMESTAMP类型在默认情况下，insert、update 数据时，TIMESTAMP列会自动以当前时间（CURRENT_TIMESTAMP）填充/更新。

第三，TIMESTAMP比较受时区timezone的影响以及MYSQL版本和服务器的SQL MODE的影响

所以一般来说，我比较倾向选择DATETIME，至于你说到索引的问题，选择DATETIME作为索引，如果碰到大量数据查询慢的情况，也可以分区表解决。









两者都是时间类型字段，格式都一致。两者主要有以下四点区别：

- 最主要的区别-受时区影响不同。`timestamp`会跟随设置的时区变化而变化，而`datetime`保存的是绝对值不会变化。

> 详细可以阅读这篇博客的演示：[http://www.tech-recipes.com/r...](http://www.tech-recipes.com/rx/22599/mysql-datetime-vs-timestamp-data-type/) 
> 一个`timestamp`字段，一个`datetime`字段，修改时区`SET TIME_ZONE = "america/new_york";`后，`timestamp`字段的值变了! 
> **因此，如果应用场景有跨时区要求的要特别注意这点。**

- 占用存储空间不同。`timestamp`储存占用4个字节，`datetime`储存占用8个字节：[http://dev.mysql.com/doc/refm...](http://dev.mysql.com/doc/refman/5.7/en/storage-requirements.html)
- 可表示的时间范围不同。`timestamp`可表示范围:`1970-01-01 00:00:00`~`2038-01-09 03:14:07`，`datetime`支持的范围更宽`1000-01-01 00:00:00` ~ `9999-12-31 23:59:59`
- 索引速度不同。`timestamp`更轻量，索引相对`datetime`更快。

更多可以详情可以查看本人博客：[http://blog.csdn.net/qq_35440...](http://blog.csdn.net/qq_35440678/article/details/53164675)
希望能对你有帮助。





https://segmentfault.com/q/1010000000121702



