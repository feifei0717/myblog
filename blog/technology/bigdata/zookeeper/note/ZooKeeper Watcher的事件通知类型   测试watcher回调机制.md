# ZooKeeper Watcher的事件通知类型   测试watcher回调机制

转载请注明：[@ni掌柜](http://weibo.com/nileader)

​    本文重点围绕ZooKeeper的Watcher，介绍通知的状态类型和事件类型，以及这些事件通知的触发条件。

 

## 1、浅谈Watcher接口

在ZooKeeper中，接口类Watcher定义了事件通知相关的逻辑，包含了KeeperState和EventType两个枚举类，分别代表通知状态和事件类型。还有一个比较重要的接口方法：

```
abstract public void process(WatchedEvent event); 
```

这个方法用于处理事件通知，每个实现类都应该自己实现合适的处理逻辑。参数WatchedEvent类封装了上面提到的两个枚举类，以及触发事件对应的ZK节点path，当然，这个path不一定每次通知都有，例如会话建立，会话失效或连接断开等通知类型，就不是针对某一个单独path的。

## 2、如何注册Watcher

上面已经提到，Watcher接口已经提供了基本的回调方法用于处理来自服务器的通知。因此，我们只要在合适的地方实现这个接口，并传给服务器即可。下面来看看哪些是合适的地方： 

### A、构造方法

```
ZooKeeper(String connectString, int sessionTimeout, Watcher watcher) 
```

上面这个是ZooKeeper的一个构造方法，与ZK创建连接的时候会用到这个。这里我们重点关注第三个参数：Watcher，很显然在，这个就是一个注册Watcher的地方，传入的参数就是开发者自己Watcher接口实现。需要注意的是，这个地方注册的Watcher实现，会成为当前ZK会话的默认Watcher实现。也就是说，其它地方如果也想注册一个Watcher，那么是可以默认使用这个实现的。具体下面会涉及到。

### B、API的读写接口中

```
public Stat exists(String path, boolean watch)throws KeeperException, InterruptedException  public List<String> getChildren(String path, boolean watch)throws KeeperException,InterruptedException  public byte[] getData(String path,boolean watch,Stat stat)throws KeeperException,InterruptedException  public void register(Watcher watcher) 
```

 

 

## 3、通知的状态类型与事件类型

在Watcher接口类中，已经定义了所有的状态类型和事件类型，这里把各个状态和事件类型之间的关系整理一下。

**3.1状态：KeeperState.Disconnected(0)**

此时客户端处于断开连接状态，和ZK集群都没有建立连接。

**3.1.1事件：EventType.None(-1)**

**触发条件**：一般是在与服务器断开连接的时候，客户端会收到这个事件。

 

**3.2状态：KeeperState. SyncConnected(3)**

**3.2.1事件：EventType.None(-1)**

**触发条件**：客户端与服务器成功建立会话之后，会收到这个通知。

**3.2.2事件：EventType. NodeCreated (1)**

**触发条件**：所关注的节点被创建。

**3.2.3事件：EventType. NodeDeleted (2)**

**触发条件**：所关注的节点被删除。

**3.2.4事件：EventType. NodeDataChanged (3)**

**触发条件**：所关注的节点的内容有更新。注意，这个地方说的内容是指数据的版本号dataVersion。因此，即使使用相同的数据内容来更新，还是会收到这个事件通知的。无论如何，调用了更新接口，就一定会更新dataVersion的。

**3.2.5事件：EventType. NodeChildrenChanged (4)**

**触发条件**：所关注的节点的子节点有变化。这里说的变化是指子节点的个数和组成，具体到子节点内容的变化是不会通知的。

 

**3.3状态 KeeperState. AuthFailed(4)**

**3.3.1事件：EventType.None(-1)**

 

**3.4状态 KeeperState. Expired(-112)**

**3.4.1事件：EventType.None(-1)**

 

 

 

## 4、程序实例

这里有一个可以用来演示“触发事件通知”和“如何处理这些事件通知”的程序AllZooKeeperWatcher.java。

在这里：[https://github.com/alibaba/taokeeper/blob/master/taokeeper-research/src/main/java/com/taobao/taokeeper/research/watcher/AllZooKeeperWatcher.java](https://github.com/alibaba/taokeeper/blob/master/taokeeper-research/src/main/java/com/taobao/taokeeper/research/watcher/AllZooKeeperWatcher.java)

运行结果如下：

```
2012-08-05 06:35:23,779 - 【Main】开始连接ZK服务器 
2012-08-05 06:35:24,196 - 【Watcher-1】收到Watcher通知 
2012-08-05 06:35:24,196 - 【Watcher-1】连接状态:  SyncConnected 
2012-08-05 06:35:24,196 - 【Watcher-1】事件类型:  None 
2012-08-05 06:35:24,196 - 【Watcher-1】成功连接上ZK服务器 
2012-08-05 06:35:24,196 - -------------------------------------------- 
2012-08-05 06:35:24,354 - 【Main】节点创建成功, Path: /nileader, content: 1353337464279 
2012-08-05 06:35:24,554 - 【Watcher-2】收到Watcher通知 
2012-08-05 06:35:24,554 - 【Watcher-2】连接状态:  SyncConnected 
2012-08-05 06:35:24,554 - 【Watcher-2】事件类型:  NodeCreated 
2012-08-05 06:35:24,554 - 【Watcher-2】节点创建 
2012-08-05 06:35:24,582 - -------------------------------------------- 
2012-08-05 06:35:27,471 - 【Main】更新数据成功，path：/nileader,  
 
2012-08-05 06:35:27,667 - 【Watcher-3】收到Watcher通知 
2012-08-05 06:35:27,667 - 【Watcher-3】连接状态:  SyncConnected 
2012-08-05 06:35:27,667 - 【Watcher-3】事件类型:  NodeDataChanged 
2012-08-05 06:35:27,667 - 【Watcher-3】节点数据更新 
2012-08-05 06:35:27,696 - 【Watcher-3】数据内容: 1353337467434 
2012-08-05 06:35:27,696 - -------------------------------------------- 
2012-08-05 06:35:30,534 - 【Main】节点创建成功, Path: /nileader/ch, content: 1353337470471 
2012-08-05 06:35:30,728 - 【Watcher-4】收到Watcher通知 
2012-08-05 06:35:30,728 - 【Watcher-4】连接状态:  SyncConnected 
2012-08-05 06:35:30,728 - 【Watcher-4】事件类型:  NodeCreated 
2012-08-05 06:35:30,728 - 【Watcher-4】节点创建 
2012-08-05 06:35:30,758 - -------------------------------------------- 
2012-08-05 06:35:30,958 - 【Watcher-5】收到Watcher通知 
2012-08-05 06:35:30,958 - 【Watcher-5】连接状态:  SyncConnected 
2012-08-05 06:35:30,958 - 【Watcher-5】事件类型:  NodeChildrenChanged 
2012-08-05 06:35:30,958 - 【Watcher-5】子节点变更 
2012-08-05 06:35:30,993 - 【Watcher-5】子节点列表：[ch] 
2012-08-05 06:35:30,993 - -------------------------------------------- 
2012-08-05 06:35:33,618 - 【Main】删除节点成功，path：/nileader/ch 
2012-08-05 06:35:33,756 - 【Main】删除节点成功，path：/nileader 
2012-08-05 06:35:33,817 - 【Watcher-6】收到Watcher通知 
2012-08-05 06:35:33,817 - 【Watcher-6】连接状态:  SyncConnected 
2012-08-05 06:35:33,817 - 【Watcher-6】事件类型:  NodeDeleted 
2012-08-05 06:35:33,817 - 【Watcher-6】节点 /nileader/ch 被删除 
2012-08-05 06:35:33,817 - -------------------------------------------- 
2012-08-05 06:35:34,017 - 【Watcher-7】收到Watcher通知 
2012-08-05 06:35:34,017 - 【Watcher-7】连接状态:  SyncConnected 
2012-08-05 06:35:34,017 - 【Watcher-7】事件类型:  NodeChildrenChanged 
2012-08-05 06:35:34,017 - 【Watcher-7】子节点变更 
2012-08-05 06:35:34,109 - 【Watcher-7】子节点列表：null 
2012-08-05 06:35:34,109 - -------------------------------------------- 
2012-08-05 06:35:34,309 - 【Watcher-8】收到Watcher通知 
2012-08-05 06:35:34,309 - 【Watcher-8】连接状态:  SyncConnected 
2012-08-05 06:35:34,309 - 【Watcher-8】事件类型:  NodeDeleted 
2012-08-05 06:35:34,309 - 【Watcher-8】节点 /nileader 被删除 
2012-08-05 06:35:34,309 - -------------------------------------------- 
```

 

 

## 5、测试watcher回调机制 

```
// Watcher实例
Watcher wh = new Watcher() {
public void process(WatchedEvent event) {
System.out.println("回调watcher实例： 路径" + event.getPath() + " 类型："
+ event.getType());
}
};
 
ZooKeeper zk = new ZooKeeper("127.0.0.1:2181,127.0.0.1:2182,127.0.0.1:2183", 500000, wh);
System.out.println("---------------------");
// 创建一个节点root，数据是mydata,不进行ACL权限控制，节点为永久性的(即客户端shutdown了也不会消失)
zk.exists("/root", true);
zk.create("/root", "mydata".getBytes(), Ids.OPEN_ACL_UNSAFE,
CreateMode.PERSISTENT);
System.out.println("---------------------");
// 在root下面创建一个childone znode,数据为childone,不进行ACL权限控制，节点为永久性的
zk.exists("/root/childone", true);
zk.create("/root/childone", "childone".getBytes(), Ids.OPEN_ACL_UNSAFE,
CreateMode.PERSISTENT);
System.out.println("---------------------");
// 删除/root/childone这个节点，第二个参数为版本，－1的话直接删除，无视版本
zk.exists("/root/childone", true);
zk.delete("/root/childone", -1);
System.out.println("---------------------");
zk.exists("/root", true);
zk.delete("/root", -1);
System.out.println("---------------------");
// 关闭session
zk.close();
```

执行结果：

\---------------------

回调watcher实例： 路径null 类型：None

回调watcher实例： 路径/root 类型：NodeCreated

\---------------------

回调watcher实例： 路径/root/childone 类型：NodeCreated

\---------------------

回调watcher实例： 路径/root/childone 类型：NodeDeleted

\---------------------

回调watcher实例： 路径/root 类型：NodeDeleted

\---------------------

来源： [[http://www.cnblogs.com/viviman/archive/2013/03/11/2954118.html](http://www.cnblogs.com/viviman/archive/2013/03/11/2954118.html)](%5Bhttp://www.cnblogs.com/viviman/archive/2013/03/11/2954118.html%5D(http://www.cnblogs.com/viviman/archive/2013/03/11/2954118.html))

来源： [[http://nileader.blog.51cto.com/1381108/954670](http://nileader.blog.51cto.com/1381108/954670)](%5Bhttp://nileader.blog.51cto.com/1381108/954670%5D(http://nileader.blog.51cto.com/1381108/954670))

 