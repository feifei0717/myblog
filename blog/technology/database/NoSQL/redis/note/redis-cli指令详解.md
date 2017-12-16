## redis-cli指令详解

分类：[杂项](http://www.escorm.com/archives/category/uncategorized) | 发表于 2015年10月13日 星期二 下午 6:19

[发表评论](http://www.escorm.com/archives/517#comments)

Redis提供了丰富的命令（command）对数据库和各种数据类型进行操作，这些command可以在Linux终端使用。

在编程时，比如使用Redis 的Java语言包，这些命令都有对应的方法。下面将Redis提供的命令做一总结。

官网命令列表：http://[redis](http://www.178-go.com/tags/redis).io/commands （英文）

### 1、连接操作相关的命令

quit：关闭连接（connection）

auth：简单密码认证

### 2、对value操作的命令

exists(key)：确认一个key是否存在

del(key)：删除一个key

type(key)：返回值的类型

keys(pattern)：返回满足给定pattern的所有key

randomkey：随机返回key空间的一个key

rename(oldname, newname)：将key由oldname重命名为newname，若newname存在则删除newname表示的key

dbsize：返回当前数据库中key的数目

expire：设定一个key的活动时间（s）

ttl：获得一个key的活动时间

select(index)：按索引查询

move(key, dbindex)：将当前数据库中的key转移到有dbindex索引的数据库

flushdb：删除当前选择数据库中的所有key

flushall：删除所有数据库中的所有key

### 3、对String操作的命令

set(key, value)：给数据库中名称为key的string赋予值value

get(key)：返回数据库中名称为key的string的value

getset(key, value)：给名称为key的string赋予上一次的value

mget(key1, key2,…, key N)：返回库中多个string（它们的名称为key1，key2…）的value

setnx(key, value)：如果不存在名称为key的string，则向库中添加string，名称为key，值为value

setex(key, time, value)：向库中添加string（名称为key，值为value）同时，设定过期时间time

mset(key1, value1, key2, value2,…key N, value N)：同时给多个string赋值，名称为key i的string赋值value i

msetnx(key1, value1, key2, value2,…key N, value N)：如果所有名称为key i的string都不存在，则向库中添加string，

名称key i赋值为value i

incr(key)：名称为key的string增1操作

incrby(key, integer)：名称为key的string增加integer

decr(key)：名称为key的string减1操作

decrby(key, integer)：名称为key的string减少integer

append(key, value)：名称为key的string的值附加value

substr(key, start, end)：返回名称为key的string的value的子串

### 4、对List操作的命令

rpush(key, value)：在名称为key的list尾添加一个值为value的元素

lpush(key, value)：在名称为key的list头添加一个值为value的 元素

llen(key)：返回名称为key的list的长度

lrange(key, start, end)：返回名称为key的list中start至end之间的元素（下标从0开始，下同）

ltrim(key, start, end)：截取名称为key的list，保留start至end之间的元素

lindex(key, index)：返回名称为key的list中index位置的元素

lset(key, index, value)：给名称为key的list中index位置的元素赋值为value

lrem(key, count, value)：删除count个名称为key的list中值为value的元素。

count为0，删除所有值为value的元素，count>0从头至尾删除count个值为value的元素，count<0从尾到头删除|count|个值为value的元素。

lpop(key)：返回并删除名称为key的list中的首元素 rpop(key)：返回并删除名称为key的list中的尾元素

blpop(key1, key2,… key N, timeout)：lpop命令的block版本。

即当timeout为0时，若遇到名称为key i的list不存在或该list为空，则命令结束。

如果timeout>0，则遇到上述情况时，等待timeout秒，如果问题没有解决，则对keyi+1开始的list执行pop操作。

brpop(key1, key2,… key N, timeout)：rpop的block版本。参考上一命令。

rpoplpush(srckey, dstkey)：返回并删除名称为srckey的list的尾元素，并将该元素添加到名称为dstkey的list的头部

### 5、对Set操作的命令

sadd(key, member)：向名称为key的set中添加元素member

srem(key, member) ：删除名称为key的set中的元素member

spop(key) ：随机返回并删除名称为key的set中一个元素

smove(srckey, dstkey, member) ：将member元素从名称为srckey的集合移到名称为dstkey的集合

scard(key) ：返回名称为key的set的基数

sismember(key, member) ：测试member是否是名称为key的set的元素

sinter(key1, key2,…key N) ：求交集

sinterstore(dstkey, key1, key2,…key N) ：求交集并将交集保存到dstkey的集合

sunion(key1, key2,…key N) ：求并集

sunionstore(dstkey, key1, key2,…key N) ：求并集并将并集保存到dstkey的集合

sdiff(key1, key2,…key N) ：求差集

sdiffstore(dstkey, key1, key2,…key N) ：求差集并将差集保存到dstkey的集合

smembers(key) ：返回名称为key的set的所有元素

srandmember(key) ：随机返回名称为key的set的一个元素

### 6、对zset（sorted set）操作的命令

zadd(key, score, member)：向名称为key的zset中添加元素member，score用于排序。如果该元素已经存在，则根据score更新该元素的顺序。

zrem(key, member) ：删除名称为key的zset中的元素member

zincrby(key, increment, member) ：如果在名称为key的zset中已经存在元素member，则该元素的score增加increment；

否则向集合中添加该元素，其score的值为increment

zrank(key, member) ：返回名称为key的zset（元素已按score从小到大排序）中member元素的rank（即index，从0开始），

若没有member元素，返回“nil”

zrevrank(key, member) ：返回名称为key的zset（元素已按score从大到小排序）中member元素的rank（即index，从0开始），

若没有member元素，返回“nil”

zrange(key, start, end)：返回名称为key的zset（元素已按score从小到大排序）中的index从start到end的所有元素

zrevrange(key, start, end)：返回名称为key的zset（元素已按score从大到小排序）中的index从start到end的所有元素

zrangebyscore(key, min, max)：返回名称为key的zset中score >= min且score <= max的所有元素

zcard(key)：返回名称为key的zset的基数 zscore(key, element)：返回名称为key的zset中元素element的

score zremrangebyrank(key, min, max)：删除名称为key的zset中rank >= min且rank <= max的所有元素

zremrangebyscore(key, min, max) ：删除名称为key的zset中score >= min且score <= max的所有元素

zunionstore / zinterstore(dstkeyN, key1,…,keyN, WEIGHTS w1,…wN, AGGREGATE SUM|MIN|MAX)：对N个zset求并集和交集，

并将最后的集合保存在dstkeyN中。对于集合中每一个元素的score，在进行AGGREGATE运算前，都要乘以对于的WEIGHT参数。

如果没有提供WEIGHT，默认为1。默认的AGGREGATE是SUM，即结果集合中元素的score是所有集合对应元素进行SUM运算的值，而MIN和MAX是指，

结果集合中元素的score是所有集合对应元素中最小值和最大值。

### 7、对Hash操作的命令

hset(key, field, value)：向名称为key的hash中添加元素field<—>value

hget(key, field)：返回名称为key的hash中field对应的value

hmget(key, field1, …,field N)：返回名称为key的hash中field i对应的value

hmset(key, field1, value1,…,field N, value N)：向名称为key的hash中添加元素field i<—>value i

hincrby(key, field, integer)：将名称为key的hash中field的value增加integer

hexists(key, field)：名称为key的hash中是否存在键为field的域

hdel(key, field)：删除名称为key的hash中键为field的域

hlen(key)：返回名称为key的hash中元素个数

hkeys(key)：返回名称为key的hash中所有键

hvals(key)：返回名称为key的hash中所有键对应的value

hgetall(key)：返回名称为key的hash中所有的键（field）及其对应的value

### 8、持久化

save：将数据同步保存到磁盘

bgsave：将数据异步保存到磁盘

lastsave：返回上次成功将数据保存到磁盘的Unix时戳

shundown：将数据同步保存到磁盘，然后关闭服务

### 9、远程服务控制

info：提供服务器的信息和统计

monitor：实时转储收到的请求

slaveof：改变复制策略设置

config：在运行时配置Redis服务器

**一、概述：**
在该系列的前几篇博客中，主要讲述的是与Redis数据类型相关的命令，如String、List、Set、Hashes和Sorted-Set。这些命 令都具有一个共同点，即所有的操作都是针对与Key关联的Value的。而该篇博客将主要讲述与Key相关的Redis命令。学习这些命令对于学习 Redis是非常重要的基础，也是能够充分挖掘Redis潜力的利器。
在该篇博客中，我们将一如既往的给出所有相关命令的明细列表和典型示例，以便于我们现在的学习和今后的查阅。
**二、相关命令列表：**

| **命令原型**                                 | **时间复杂度**     | **命令描述**                                 | **返回值**                                  |
| ---------------------------------------- | ------------- | ---------------------------------------- | ---------------------------------------- |
| **KEYS** pattern                         | O(N)          | 时间复杂度中的N表示数据库中Key的数量。获取所有匹配pattern参数的Keys。需要说明的是，在我们的正常操作中应该尽量避免对该命令的调用，因为对于大型数据库而言，该命令是非常耗时的，对Redis服务器的性能打击也是比较大的。*pattern支持glob-style的通配符格式，如\*表示任意一个或多个字符，?表示任意字符，[abc]表示方括号中任意一个字母。* | 匹配模式的键列表。                                |
| **DEL** key [key …]                      | O(N)          | 时 间复杂度中的N表示删除的Key数量。从数据库删除中参数中指定的 keys，如果指定键不存在，则直接忽略。还需要另行指出的是，如果指定的Key关联的数据类型不是String类型，而是List、Set、 Hashes和Sorted Set等容器类型，该命令删除每个键的时间复杂度为O(M)，其中M表示容器中元素的数量。而对于String类型的Key，其时间复杂度为O(1)。 | 实际被删除的Key数量。                             |
| **EXISTS** key                           | O(1)          | 判断指定键是否存在。                               | 1表示存在，0表示不存在。                            |
| **MOVE** key db                          | O(1)          | 将当前数据库中指定的键Key移动到参数中指定的数据库中。如果该Key在目标数据库中已经存在，或者在当前数据库中并不存在，该命令将不做任何操作并返回0。 | 移动成功返回1，否则0。                             |
| **RENAME** key newkey                    | O(1)          | 为指定指定的键重新命名，如果参数中的两个Keys的命令相同，或者是源Key不存在，该命令都会返回相关的错误信息。如果newKey已经存在，则直接覆盖。 |                                          |
| **RENAMENX** key newkey                  | O(1)          | 如果新值不存在，则将参数中的原值修改为新值。其它条件和RENAME一致。     | 1表示修改成功，否则0。                             |
| **PERSIST** key                          | O(1)          | 如果Key存在过期时间，该命令会将其过期时间消除，使该Key不再有超时，而是可以持久化存储。 | 1表示Key的过期时间被移出，0表示该Key不存在或没有过期时间。        |
| **EXPIRE** key seconds                   | O(1)          | 该命令为参数中指定的Key设定超时的秒数，在超过该时间后，Key被自动的删除。如果该Key在超时之前被修改，与该键关联的超时将被移除。 | 1表示超时被设置，0则表示Key不存在，或不能被设置。              |
| **EXPIREAT** key timestamp               | O(1)          | 该命令的逻辑功能和EXPIRE完全相同，唯一的差别是该命令指定的超时时间是绝对时间，而不是相对时间。该时间参数是Unix timestamp格式的，即从1970年1月1日开始所流经的秒数。 | 1表示超时被设置，0则表示Key不存在，或不能被设置。              |
| **TTL** key                              | O(1)          | 获取该键所剩的超时描述。                             | 返回所剩描述，如果该键不存在或没有超时设置，则返回-1。             |
| **RANDOMKEY**                            | O(1)          | 从当前打开的数据库中随机的返回一个Key。                    | 返回的随机键，如果该数据库是空的则返回nil。                  |
| **TYPE** key                             | O(1)          | 获取与参数中指定键关联值的类型，该命令将以字符串的格式返回。           | 返回的字符串为string、list、set、hash和zset，如果key不存在返回none。 |
| **SORT** key [BY pattern] [LIMIT offset count] [GET pattern [GET pattern …]] [ASC\|DESC] [ALPHA] [STORE destination] | O(N+M*log(M)) | 这个命令相对来说是比较复杂的，因此我们这里只是给出最基本的用法，有兴趣的网友可以去参考redis的官方文档。 | 返回排序后的原始列表。                              |

来源： [http://www.escorm.com/archives/517](http://www.escorm.com/archives/517)