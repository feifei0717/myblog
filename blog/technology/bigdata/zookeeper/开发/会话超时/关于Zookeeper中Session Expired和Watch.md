# 关于Zookeeper中Session Expired和Watch

**1、什么是Session Expired**

通常是zk客户端与服务器的连接断了，试图连接上新的zk机器，这个过程如果耗时过长，超过 SESSION_TIMEOUT 后还没有成功连接上服务器，那么服务器认为这个session已经结束了（服务器无法确认是因为其它异常原因还是客户端主动结束会话），开始清除和这个会话有关的信息，包括这个会话创建的临时节点和注册的Watcher。在这之后，客户端重新连接上了服务器在，但是很不幸，服务器会告诉客户端SESSIONEXPIRED。

**2、Session Expired和Connection Loss的区别**

后者是断开一段时间后，在SESSION_TIMEOUT之内时间内恢复了和zk服务器的连接。此时就是简单的Connection Loss。

**3、出现Session Expired之后，能否恢复之前的Watch，这期间的Watch消息能否恢复。**

无法恢复。 client出现session expired时，需要重新创建一个zookeeper client实例，此时对应的watcher set也会丢失，需要自己编码做一些额外的处理。因此，这期间漏掉的Watch消息回调也是无法恢复的。

**4、数据被修改了n次，一定会收到n次watch通知么?**

答案是否定的，如果频率很高，那么收到的通知数会远小于n。

**5、使用watch需要注意的几点**

a. Watches通知是一次性的，必须重复注册.

b. 发生CONNECTIONLOSS之后，只要在session_timeout之内再次连接上（即不发生SESSIONEXPIRED），那么这个连接注册的watches依然在。

c. 节点数据的版本变化会触发NodeDataChanged，注意，这里特意说明了是版本变化。存在这样的情况，只要成功执行了setData()方法，无论内容是否和之前一致，都会触发NodeDataChanged。

d. 对某个节点注册了watch，但是节点被删除了，那么注册在这个节点上的watches都会被移除。

e. 同一个zk客户端对某一个节点注册相同的watch，只会收到一次通知。

**没有发现相关文章...**

This entry was posted in [Hadoop && Hive && HBase && Mahout](https://www.coder4.com/archives/category/cloud_computing) and tagged [Session Expired](https://www.coder4.com/archives/tag/session-expired), [Watch](https://www.coder4.com/archives/tag/watch), [ZooKeeper](https://www.coder4.com/archives/tag/zookeeper) on [2012-05-21](https://www.coder4.com/archives/3181).







https://www.coder4.com/archives/3181#comments