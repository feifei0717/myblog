# Redis vs Mongo



2016.08.29 13:43 字数 1778 阅读 890评论 0喜欢 2

Redis 和 Mongo 都属于 No-SQL类型的数据库，他们的区别，联系是什么呢？
看了一些文章，特总结如下。

Redis 最大的特点是，快！
为什么快，因为他将大量的东西存储在了memory中。但这并不表示，Redis只是store data only in memory. Actually, from time to time, Redis will add some checkpoint to save data into disk

这就导致一个问题。如果在两个check point 之间，server is down,那么这时的数据是 unrecoverable ! 所以归根结底，Redis is not reliable

You need to save something which you can lose into Redis

读的一个片段摘录在此：
**Redis is Fast. When I say Fast, I mean Fast with a capital F. It’s essentially memcached with more elaborate data types than just string values. Even some advanced operations like set intersection, zset range requests, are blindingly fast. There’s all kinds of reasons to use Redis for fast changing, heavily accessed data. It’s used quite often as a cache that can be rebuilt from a backing alternative primary database for this reason. It’s a compelling replacement for memcached allowing more advanced caching for the different kinds of data you store.**
**Like memcached, everything is held in memory. Redis does persist to disk, but it doesn’t synchronously store data to disk as you write it. These are the two primary reasons Redis sucks as a primary store:**
***\***You have to be able to fit all your data in memory, and***\***If your server fails between disk syncs you lose anything that was sitting in memory.**

**Due to these two issues Redis has found a really solid niche as a transient cache of data you can lose, rather than a primary data store, making often accessed data fast with the ability to rebuild when necessary.**

Redis 总结：
好处：

1. 快。东西存在内存里。读写很快。可以作为cache来用。
2. 现在的云平台也支持 Redis Sharding

坏处：

1. not reliable, 可能出现数据丢失。所以只能存一些即使丢失我们依然可以重建的数据类型。
2. 数据一开始都存在memory中，导致的一个问题就是，memory size is <<< disk usage, Redis 的使用限制很大。得算好Instance的memory有多少。如果不够的话，得及时做好 Redis sharding 工作。
3. query api is too easy. 很奇怪为什么这点网友没有说。说穿了，Redis 就是 List, HashMap,List 构成的 distributed database
   所以它支持的操作也很简单。简单地有，在list, set, map里面找东西。
   复杂点的话，可以支持局域性remove.
   比如， zremove(key, small, big) 会将对应key，权值在 [small, big]区间的key-value pair全部删除掉。
   但是他不能做 aggregation, 对于大型数据，操作起来没有Mongo那么方便

Redis is based on key-value pair
Mongo is based on document

Mongo
相对应于Redis,Mongo 完全就是另外一种概念，或者说，应该是更加传统的数据库。
很久以前，我们先有了 Relational Database. Each table can have relations with each other, like MySQL
然后出现了很多很复杂的 query,里面用到了很多嵌套，很多Join操作。
设计数据库的时候，也得考虑到如何应用他们的关系使得到时候写query可以使database 效率达到最高。
后来人们发现，不是每个系统，都需要如此复杂的关系型数据库。有些简单的网站，比如博客，比如社交网站，完全可以斩断数据库之间的一切关系。
这样做，带来的好处是，设计数据库变得更加简单，写query也更加简单。然后，query消耗的时间可能也会变少。因为query简单了，少了许多消耗资源的Join操作，速度自然会上去。
那么带来的问题是什么呢？
正如所说的，query简单了，很有以前MySQL可以找到的东西，现在关系没了，通过Mongo找不到了。我们只能将几组数据都抓到本地，然后在本地做Join，然后。。。
所以这点上可能会消耗很多资源。
这些可以新开一篇文章叫做 NoSQL vs SQL

所以，这里我们可以发现。如果选择数据库，完全取决于，你所需要处理的数据的模型，即， data model
如果他们之间，关系复杂，千丝万缕，这个时候MySQL可能是首选。如果他们的关系并不是那么密切，那么，NoSQL将会是利器。
如何判断？这完全取决于常年的工作经验了。

继续说，MongoDB 可以说是NoSQL里面最像MySQL的。
MySQL has database
Mongo has database
MySQL has table
Mongo has collection
MySQL has tuple
Mongo has document

一个很大的区别是，
tuple has strict schema limit but document does not. document is schemaless

尽管如此，在日常开发中，我们仍然尽量保持同一个collection下document的schema的统一！

所以，Mongo将大量的数据存在了disk上。他的容量极限就远大于Redis
也因为如此，Mongo is reliable. it can recover what we lose in memory when server is down

But, Mongo is slower than Redis

总结：
好处：

1. 数据会存在disk中，memory limit is much bigger than Redis
2. 可以保证reliable system
3. support mongo sharding
4. Much stronger API. 正如我所说的，Mongo 是最像MySQL的NoSQL database。所以MySQL能提供的，大部分他也能提供。
   除了Join (最新版本的Mongo也支持Join操作。但很遗憾，因为NoSQL的原因，这个API速度很慢，远不如MySQL)
   这里可以详细介绍下Mongo 里面很十分非常重要的一种API
   aggregation
   这篇文章讲得很好
   <https://docs.mongodb.com/manual/aggregation/>

他其实就是 Map reduce, 其实就是 group by 的加强版。

首先按照你所规定的 key 组合进行 group by
其实就是 map
然后按照你定义的规则，在Mongo 里面就是相应的关键字，来进行reduce

这是 big data system 的重要一环。掌握其中的许多关键字以及所带来的效果，将会使得MongoDB真正成为 大数据存储分析的神器。

比如 $unwind

reference:
<http://stackoverflow.com/questions/5400163/when-to-redis-when-to-mongodb>

Redis is an **in memory** data store, that can *persist it's state to disk* (to enable recovery after restart). However, being an in-memory data store means the size of the data store (on a single node) cannot exceed the total memory space on the system (physical RAM + swap space). In reality, it will be much less that this, as Redis is sharing that space with many other processes on the system, and if it exhausts the system memory space it will likely be killed off by the operating system.
Mongo is a **disk based** data store, that is most efficient when it's *working set* fits within physical RAM (like all software). Being a disk based data means there are no intrinsic limits on the size of a Mongo database, however configuration options, available disk space, and other concerns may mean that databases sizes over a certain limit may become impractical or inefficient.
Both Redis and Mongo can be clustered for high availability, backup and to increase the overall size of the datastore.

把家收拾好已经这个点了。今天基本啥都没干。预定的计划也没有完成。

Anyway, Good luck, Richardo! -- 08/29/2016



http://www.jianshu.com/p/249defad8592