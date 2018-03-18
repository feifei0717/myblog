[TOC]



# zookeeper分布式锁的实现

还有一种用ip来锁得。
代码位置：/Users/jerryye/backup/studio/AvailableCode/framework/zookeeper/zookeeper_demo

zookeeper分布式锁的实现

本文主要讲述在使用ZooKeeper进行分布式锁的实现过程中，如何有效的避免“羊群效应(herdeffect)”的出现。

最后有实现了代码，仅供参考

本文参考了《Hadoop权威指南》以及以下网页内容实现：

<http://aliapp.blog.51cto.com/8192229/1328018>

 

实现过程介绍如下：

## 一般的分布式锁实现

这里简单的讲下一般的分布式锁如何实现。具体的代码实现可以在这里看到：<https://svn.apache.org/repos/asf/zookeeper/trunk/src/recipes/lock/>

在之前的《[ZooKeepe数据模型](http://nileader.blog.51cto.com/1381108/946788)》一文中提到过，zookeeper中节点的创建类型有4类，这里我们重点关注下临时顺序节点。这种类型的节点有几下几个特性：

1. 节点的生命周期和客户端会话绑定，即创建节点的客户端会话一旦失效，那么这个节点也会被清除。
2. 每个父节点都会负责维护其子节点创建的先后顺序，并且如果创建的是顺序节点（SEQUENTIAL）的话，父节点会自动为这个节点分配一个整形数值，以后缀的形式自动追加到节点名中，作为这个节点最终的节点名。

利用上面这两个特性，我们来看下获取实现分布式锁的基本逻辑：

1. 客户端调用create()方法创建名为“*locknode*/guid-lock-”的节点，需要注意的是，这里节点的创建类型需要设置为EPHEMERAL_SEQUENTIAL。
2. 客户端调用getChildren(“*locknode*”)方法来获取所有已经创建的子节点，同时在这个节点上注册上子节点变更通知的Watcher。
3. 客户端获取到所有子节点path之后，如果发现自己在步骤1中创建的节点是所有节点中序号最小的，那么就认为这个客户端获得了锁。
4. 如果在步骤3中发现自己并非是所有子节点中最小的，说明自己还没有获取到锁，就开始等待，直到下次子节点变更通知的时候，再进行子节点的获取，判断是否获取锁。

**释放锁**的过程相对比较简单，就是删除自己创建的那个子节点即可。

## 问题所在

上面这个分布式锁的实现中，大体能够满足了一般的分布式集群竞争锁的需求。这里说的一般性场景是指集群规模不大，一般在10台机器以内。

不 过，细想上面的实现逻辑，我们很容易会发现一个问题，步骤4，“即获取所有的子点，判断自己创建的节点是否已经是序号最小的节点”，这个过程，在整个分布 式锁的竞争过程中，大量重复运行，并且绝大多数的运行结果都是判断出自己并非是序号最小的节点，从而继续等待下一次通知——这个显然看起来不怎么科学。客 户端无端的接受到过多的和自己不相关的事件通知，这如果在集群规模大的时候，会对Server造成很大的性能影响，并且如果一旦同一时间有多个节点的客户 端断开连接，这个时候，服务器就会像其余客户端发送大量的事件通知——这就是所谓的羊群效应。而这个问题的根源在于，没有找准客户端真正的关注点。

我们再来回顾一下上面的分布式锁竞争过程，它的核心逻辑在于：判断自己是否是所有节点中序号最小的。于是，很容易可以联想的到的是，每个节点的创建者只需要关注比自己序号小的那个节点。

## 改进后的分布式锁实现

下面是改进后的分布式锁实现，和之前的实现方式唯一不同之处在于，这里设计成每个锁竞争者，只需要关注”*locknode*”节点下序号比自己小的那个节点是否存在即可。实现如下：

1. 客户端调用create()方法创建名为“*locknode*/guid-lock-”的节点，需要注意的是，这里节点的创建类型需要设置为EPHEMERAL_SEQUENTIAL。
2. 客户端调用getChildren(“*locknode*”)方法来获取所有已经创建的子节点，注意，这里不注册任何Watcher。
3. 客户端获取到所有子节点path之后，如果发现自己在步骤1中创建的节点序号最小，那么就认为这个客户端获得了锁。
4. 如果在步骤3中发现自己并非所有子节点中最小的，说明自己还没有获取到锁。此时客户端需要找到比自己小的那个节点，然后对其调用exist()方法，同时注册事件监听。
5. 之后当这个被关注的节点被移除了，客户端会收到相应的通知。这个时候客户端需要再次调用getChildren(“*locknode*”)方法来获取所有已经创建的子节点，确保自己确实是最小的节点了，然后进入步骤3



代码实现：

Zookeeper连接类代码

```
import java.io.IOException;
import java.util.concurrent.CountDownLatch;

import org.apache.zookeeper.WatchedEvent;
import org.apache.zookeeper.Watcher;
import org.apache.zookeeper.ZooKeeper;
import org.apache.zookeeper.Watcher.Event.KeeperState;

public class ConnectionWatcher implements Watcher 
{
    private static final int SESSION_TIMEOUT = 5000;
    protected ZooKeeper zk;
    private CountDownLatch connectedSignal = new CountDownLatch(1);

    public void connect(String hosts) throws IOException, InterruptedException 
    {
        zk = new ZooKeeper(hosts, SESSION_TIMEOUT, this);
        connectedSignal.await();
    }

    @Override
    public void process(WatchedEvent event) 
    {
        if (event.getState() == KeeperState.SyncConnected) 
        {
            connectedSignal.countDown();
        }
    }

    public void close() throws InterruptedException 
    {
        zk.close();
    }
}
```

Java代码

```
import java.util.ArrayList;
import java.util.Collections;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.zookeeper.CreateMode;
import org.apache.zookeeper.KeeperException;
import org.apache.zookeeper.WatchedEvent;
import org.apache.zookeeper.Watcher;
import org.apache.zookeeper.ZooDefs.Ids;
import org.apache.zookeeper.data.Stat;

/** 
 * http://graduter.iteye.com/blog/2024190
 * 本类简单实现了分布式锁的机制
 * 采用单机zookeeper服务器测试；运行多次本机程序，相当于多个客户端用户 全部启动完成后，第一个客户端的会话需要手动中断，相当于触发客户端宕机现象
 * 本类实现的分布式锁避免羊群效应（Herd Effect），具体可详见代码
 */
public class DistributedLock extends ConnectionWatcher 
{
    public String join(String groupPath) throws KeeperException,InterruptedException 
    {
        String path = groupPath + "/lock-" + zk.getSessionId() + "-";
        // 建立一个顺序临时节点
        String createdPath = zk.create(path, null/* data */, Ids.OPEN_ACL_UNSAFE, CreateMode.EPHEMERAL_SEQUENTIAL);
        System.out.println("Created " + createdPath);

        return createdPath;
    }

    /**
     * 检查本客户端是否得到了分布式锁
     * 
     * @param groupPath
     * @param myName
     * @return 
     * @throws KeeperException
     * @throws InterruptedException
     */
    public boolean checkState(String groupPath, String myName) throws KeeperException, InterruptedException 
    {
        System.out.println("groupPath = " + groupPath);
        System.out.println("myName = " + myName);
        List<String> childList = zk.getChildren(groupPath, false);
        // myName = /zkRoot/_locknode_/lock-94103680129368072-0000000003
        String[] myStr = myName.split("-");
        long myId = Long.parseLong(myStr[2]);

        boolean minId = true;
        int index = 0;
        for (String childName : childList)
        {
            System.out.println(index + " \t " + childName);
            String[] str = childName.split("-");
            long id = Long.parseLong(str[2]);
            if (id < myId)
            {
                minId = false;
                break;
            }
            index ++;
        }

        if (minId) 
        {
            System.out.println(new Date() + "我得到了分布锁，哈哈！ myId:" + myId);
            return true;
        }
        else 
        {
            System.out.println(new Date() + "继续努力吧，  myId:" + myId);
            return false;
        }
    }

    /**
     * 若本客户端没有得到分布式锁，则进行监听本节点前面的节点（避免羊群效应）
     * 
     * @param groupPath
     * @param myName
     * @throws KeeperException
     * @throws InterruptedException
     */
    public void listenNode(final String groupPath, final String myName) throws KeeperException, InterruptedException 
    {
        List<String> childList = zk.getChildren(groupPath, false);

        String[] myStr = myName.split("-");
        long myId = Long.parseLong(myStr[2]);

        List<Long> idList = new ArrayList<Long>();
        Map<Long, String> sessionMap = new HashMap<Long, String>();

        for (String childName : childList) 
        {
            String[] str = childName.split("-");
            long id = Long.parseLong(str[2]);
            idList.add(id);
            sessionMap.put(id, str[1] + "-" + str[2]);
        }

        Collections.sort(idList);
        int i = idList.indexOf(myId);
        if (i <= 0) 
        {
            throw new IllegalArgumentException("数据错误！");
        }

        // 得到前面的一个节点
        long headId = idList.get(i - 1);

        String headPath = groupPath + "/lock-" + sessionMap.get(headId);
        // 添加监听：/zkRoot/_locknode_/lock-94103680129368071-0000000002
        System.out.println("添加监听：" + headPath);

        Stat stat = zk.exists(headPath, new Watcher() {
            @Override
            public void process(WatchedEvent event)
            {
                System.out.println("已经触发了" + event.getType() + "事件！");
                try 
                {
                    while (true) 
                    {
                        if (checkState(groupPath, myName)) 
                        {
                            Thread.sleep(3000);
                            System.out.println(new Date() + " 系统关闭！");
                            System.exit(0);
                        }
                        Thread.sleep(3000);
                    }
                } catch (KeeperException e) 
                {
                    e.printStackTrace();
                } catch (InterruptedException e) 
                {
                    e.printStackTrace();
                }
            }
        });
        System.out.println(stat);
    }
    /**
     * 1.
     * Exception in thread "main" org.apache.zookeeper.KeeperException$NoNodeException: KeeperErrorCode = NoNode for /zkRoot/_locknode_/lock-94103680129368068-
     * 2.
     * Exception in thread "main" org.apache.zookeeper.KeeperException$NoChildrenForEphemeralsException: KeeperErrorCode = NoChildrenForEphemerals for /zkRoot/_locknode_
     * 
     * @param args
     * @throws Exception
     */
    public static void main(String[] args) throws Exception 
    {
        DistributedLock joinGroup = new DistributedLock();
        joinGroup.connect("localhost:" + "2181");
        
        // zookeeper的根节点；运行本程序前，需要提前生成
        String groupName = "zkRoot";
        String memberName = "_locknode_";
        Stat stat = joinGroup.zk.exists("/" + groupName, true);
        if(stat == null)
        {
            joinGroup.zk.create("/" + groupName, groupName.getBytes(), Ids.OPEN_ACL_UNSAFE, CreateMode.PERSISTENT);
        }
        stat = joinGroup.zk.exists("/" + groupName + "/" + memberName, true);
        if(stat == null)
        {
            joinGroup.zk.create("/" + groupName + "/" + memberName, memberName.getBytes(), Ids.OPEN_ACL_UNSAFE, CreateMode.PERSISTENT);
        }
        String path = "/" + groupName + "/" + memberName;

        String myName = joinGroup.join(path);
        if (!joinGroup.checkState(path, myName)) {
            joinGroup.listenNode(path, myName);
        }

        Thread.sleep(Integer.MAX_VALUE);
        joinGroup.close();
    }
}
```

来源： [[http://my.oschina.net/u/658658/blog/474277?fromerr=HI7EFej1](http://my.oschina.net/u/658658/blog/474277?fromerr=HI7EFej1)](%5Bhttp://my.oschina.net/u/658658/blog/474277?fromerr=HI7EFej1%5D(http://my.oschina.net/u/658658/blog/474277?fromerr=HI7EFej1))

 