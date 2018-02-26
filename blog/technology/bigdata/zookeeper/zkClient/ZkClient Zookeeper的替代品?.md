[TOC]

# ZkClient Zookeeper的替代品?

## 前言

直接使用zookeeper的api实现业务功能比较繁琐。因为要处理session loss，session expire等异常，在发生这些异常后进行重连。又因为ZK的watcher是一次性的，如果要基于wather实现发布/订阅模式，还要自己包装一下，将一次性订阅包装成持久订阅。另外如果要使用抽象级别更高的功能，比如分布式锁，leader选举等，还要自己额外做很多事情。这里介绍下ZK的第三方客户端包装小工具，可以分别解决上述小问题。



## 问题

在使用ZooKeeper过程中发现,用原生方法实现某些业务功能很麻烦

例如：

1)如何实现持久的Watcher注册

​	ZooKeeper的Watcher是一次性的，用过了需要再注册；

2)如何解决session的超时问题

​	生产环境中如果网络出现不稳定情况，那么这种情况出现的更加明显；

3)如何实现领导选举

​	集群情况下可能需要实现stand by，一个服务挂了，另一个需要接替的效果；

4)如何实现节点数据的封装

​	项目中一般都会使用对象，而ZooKeeper只能存放文本类的数据。

## 解决问题

ZKClient却能把这些问题解决了:

### 1)持久的Watcher注册问题：

ZKClient框架将事件重新定义分为了stateChanged、znodeChanged、dataChanged三种情况，用户可以注册这三种情况下的监听器（znodeChanged和dataChanged和路径有关），而不是注册Watcher。

ZKClient框架中ZooKeeper只注册了类ZkClient（实现了Watcher），由ZkClient统一处理WatchedEvent，根据WatchedEvent分发到三种情况的处理方法，处理方法在寻找到监听器后会将他send到ZkEventThread的BlockingQueue中，由ZkEventThread以线程的方式执行（个人觉得这个部分写的还是挺精巧的）。

zkClient将一次性watcher包装为持久watcher。后者的具体做法是简单的在watcher回调中，重新读取数据的同时再注册相同的watcher实例。

zkClient简单的使用样例如下：

```
public static void testzkClient(final String serverList) {
        ZkClient zkClient4subChild = new ZkClient(serverList);
        zkClient4subChild.subscribeChildChanges(PATH, new IZkChildListener() {
            @Override
            public void handleChildChange(String parentPath, List currentChilds) throws Exception {
                System.out.println(prefix() + "clildren of path " + parentPath + ":" + currentChilds);
            }
        });
```



上面是订阅children变化，下面是订阅数据变化

```
ZkClient zkClient4subData = new ZkClient(serverList);
        zkClient4subData.subscribeDataChanges(PATH, new IZkDataListener() {
            @Override
            public void handleDataChange(String dataPath, Object data) throws Exception {
                System.out.println(prefix() + "Data of " + dataPath + " has changed");
            }

            @Override
            public void handleDataDeleted(String dataPath) throws Exception {
                System.out.println(prefix() + dataPath + " has deleted");
            }
        });
```



订阅连接状态的变化：

```
ZkClient zkClient4subStat = new ZkClient(serverList);
        zkClient4subStat.subscribeStateChanges(new IZkStateListener() {
            @Override
            public void handleNewSession() throws Exception {
                System.out.println(prefix() + "handleNewSession()");
            }

            @Override
            public void handleStateChanged(KeeperState stat) throws Exception {
                System.out.println(prefix() + "handleStateChanged,stat:" + stat);
            }
        });
```



zkClient除了做了一些便捷包装之外，对watcher使用做了一点增强。比如subscribeChildChanges实际上是通过exists和getChildren关注了两个事件。这样当create(“/path”)时，对应path上通过getChildren注册的listener也会被调用。另外subscribeDataChanges实际上只是通过exists注册了事件。因为从上表可以看到，对于一个更新，通过exists和getData注册的watcher要么都会触发，要么都不会触发。

### 2)session的超时问题:

ZKClient框架里会经常看见一些while语句，是由这些while语句完成的，比如ZkClient.retryUntilConnected方法

(感谢紫川的反馈，此条可能存在描述性问题。经校对：ZkClient貌似还是有对Session Expired 处理的，在ZkClient.processStateChanged方法中。虽然能重新连接，但是连接上是一个新的 session，原有创建的ephemeral znode和watch会被删除，程序上你可能需要处理这个问题。欢迎大家提出意见，万分感谢)

### 3)领导选举实现:

选举实现逻辑这里讲的很清楚

ZKClient框架提供了DistributedQueue可以对offer方法做适当修改来实现则个功能

### 4)节点数据的封装:

ZKClient框架提供了ZkSerializer来进行序列化和反序列化，貌似挺有用的。DataUpdater可以用来更新节点数据，进行znode数据转换。

总的来说ZKClient是一个不错的ZooKeeper调用工具，减少不少的开发量，设计精巧，收货不小。

## ZKClient下载地址：

[GitHub工程(zkClient官方地址)](https://github.com/sgroschupf/zkclient)

[maven工程(部分写了中文注释)](https://pan.baidu.com/share/init?shareid=479888&uk=1594251864)

密码:tlbu

附录

[ZooKeeper管理员指南](http://rdc.taobao.com/team/jm/archives/2318)



来源： <http://www.aboutyun.com/thread-9667-1-1.html>