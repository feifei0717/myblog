# [ZooKeeper配额 quota](http://www.cnblogs.com/yandufeng/p/6377099.html)

ZooKeeper可以在znode上设置配额限制。如果超出了配置限制，ZooKeeper将会在log日志中打印WARN日志。如果超出配额限制，并不会停止行为操作。

ZooKeeper的配额是存储在/zookeeper/quota路径下的。可以通过ZooKeeper client APIs或者ZooKeeper Java Shell来进行set，list，delete配额。

下面举一个例子说明：

```
[zk: localhost:2181(CONNECTED) 3] setquota -n 2 /yandufeng_quota
Comment: the parts are option -n val 2 path /yandufeng_quota
[zk: localhost:2181(CONNECTED) 4] 
[zk: localhost:2181(CONNECTED) 4] 
[zk: localhost:2181(CONNECTED) 4] listquota /yandufeng_

yandufeng_quota   yandufeng_test
[zk: localhost:2181(CONNECTED) 4] listquota /yandufeng_quota
absolute path is /zookeeper/quota/yandufeng_quota/zookeeper_limits
Output quota for /yandufeng_quota count=2,bytes=-1
Output stat for /yandufeng_quota count=1,bytes=2
[zk: localhost:2181(CONNECTED) 5] 
[zk: localhost:2181(CONNECTED) 5] 
[zk: localhost:2181(CONNECTED) 5] 
[zk: localhost:2181(CONNECTED) 5] 
[zk: localhost:2181(CONNECTED) 5] 
[zk: localhost:2181(CONNECTED) 5] create /yandufeng_

yandufeng_quota   yandufeng_test
[zk: localhost:2181(CONNECTED) 5] create /yandufeng_quota/child1 ""
Created /yandufeng_quota/child1
[zk: localhost:2181(CONNECTED) 6] create /yandufeng_

yandufeng_quota   yandufeng_test
[zk: localhost:2181(CONNECTED) 6] create /yandufeng_quota/child2 ""
Created /yandufeng_quota/child2
[zk: localhost:2181(CONNECTED) 7] create /yandufeng_

yandufeng_quota   yandufeng_test
[zk: localhost:2181(CONNECTED) 7] create /yandufeng_quota/child

child2   child1
[zk: localhost:2181(CONNECTED) 7] create /yandufeng_quota/child3 ""
Created /yandufeng_quota/child3
```

当你创建/yandufeng_quota/child3时，会在ZooKeeper的log日志中打印

```
2017-02-08 10:38:43,738 - WARN  [CommitProcessor:10:DataTree@388] - Quota exceeded: /yandufeng_quota count=5 limit=2
```

 

你也可以执行

```
[zk: localhost:2181(CONNECTED) 18] delquota /yandufeng_quota
```

 来删除这个配额
http://www.cnblogs.com/yandufeng/p/6377099.html