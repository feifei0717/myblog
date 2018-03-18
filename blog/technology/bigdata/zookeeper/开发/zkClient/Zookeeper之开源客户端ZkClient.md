[TOC]



#  Zookeeper之开源客户端ZkClient

ZkClient是由Datameer的工程师开发的开源客户端，对Zookeeper的原生API进行了包装，实现了超时重连、Watcher反复注册等功能。

## ZKClient版本及源码

### maven依赖

ZkClient目前有两个不同artifactId的系列。 其中最早的0.1版本maven依赖如下：

```
<dependency>
     <groupId>org.apache.zookeeper</groupId>
     <artifactId>zookeeper</artifactId>
     <version>3.4.9</version>
 </dependency>
 <dependency>
     <groupId>com.github.sgroschupf</groupId>
     <artifactId>zkclient</artifactId>
     <version>0.1</version>
 </dependency> 
```

另外一个系列为的maven依赖为：

```
<dependency>
     <groupId>org.apache.zookeeper</groupId>
     <artifactId>zookeeper</artifactId>
     <version>3.4.9</version>
 </dependency>
<dependency>
    <groupId>com.101tec</groupId>
    <artifactId>zkclient</artifactId>
    <version>0.10</version>
</dependency> 
```

其中第二个系列包含了从0.1~0.10的版本。查看dubbo的源代码，我们可以看到，dubbo采用了第一个系列的0.1版本。

### 源代码

github源代码地址：<https://github.com/sgroschupf/zkclient>

## ZkClient使用

以下我们以第二个系列的0.10版本为例来说明ZKClient的API和使用

### 创建会话

ZkClient提供了7中创建会话的方法：

```
public ZkClient(String serverstring)

public ZkClient(String zkServers, int connectionTimeout)

public ZkClient(String zkServers, int sessionTimeout, int connectionTimeout)

public ZkClient(String zkServers, int sessionTimeout, int connectionTimeout, ZkSerializer zkSerializer)

public ZkClient(final String zkServers, final int sessionTimeout, final int connectionTimeout, final ZkSerializer zkSerializer, final long operationRetryTimeout)

public ZkClient(IZkConnection connection)

public ZkClient(IZkConnection connection, int connectionTimeout)

public ZkClient(IZkConnection zkConnection, int connectionTimeout, ZkSerializer zkSerializer)

public ZkClient(final IZkConnection zkConnection, final int connectionTimeout, final ZkSerializer zkSerializer, final long operationRetryTimeout) 
```

上面方法的参数如果我们熟悉原生API的话，不难理解其参数，基本上参数名都是自描述的。值得留意的是ZkClient将ZK原生API中的异步处理进行了同步化。

其中一个参数IZkConnection是一个接口的定义。查看接口的方法不难发现它是对ZK原生接口最直接的包装。在此接口下面有两个实现方法ZkConnection和InMemoryConnection。在日常中直接使用ZkConnection方法就可以解决大部分的常见业务需求。

参数ZkSerializer同样是一个接口，定义了byte数组序列化和反序列化的两个方法。如果不传递此参数，则默认使用org.I0Itec.zkclient.serialize.SerializableSerializer实现类进行序列化。某些情况下此序列化接口会出现问题，比如乱码。此时，开发者可以直接实现ZkSerializer接口，重写自己的序列化方法。比如使用Hessian或Kryo等。

通观上面9个创建会话的构造方法，我们发现已经没有Watcher的存在了。同时，ZkClient通过Listener来实现Wather注册，从API级别来支持Watcher监听的注册。

```
package com.secbro.learn.zkclient;

import org.I0Itec.zkclient.ZkClient;

/**
 * Created by zhuzs on 2017/3/31.
 */
public class TestZkClient {
    public static void main(String[] args) {

        ZkClient zkClient = new ZkClient("127.0.0.1:2181",5000);
        System.out.println("ZK 成功建立连接！");
    }
} 
```

### 创建节点

ZkClient提供了15个创建节点的方法：

```
public void createPersistent(String path)

public void createPersistent(String path, boolean createParents)

public void createPersistent(String path, boolean createParents, List<ACL> acl)

public void createPersistent(String path, Object data)

public void createPersistent(String path, Object data, List<ACL> acl)

public String createPersistentSequential(String path, Object data)

public String createPersistentSequential(String path, Object data, List<ACL> acl) 

public void createEphemeral(final String path)

public void createEphemeral(final String path, final List<ACL> acl)

public String create(final String path, Object data, final CreateMode mode)

public String create(final String path, Object data, final List<ACL> acl, final CreateMode mode) 

public void createEphemeral(final String path, final Object data)

public void createEphemeral(final String path, final Object data, final List<ACL> acl)

public String createEphemeralSequential(final String path, final Object data)

public String createEphemeralSequential(final String path, final Object data, final List<ACL> acl) 
```

查看源代码可知，其实这些创建节点的方法都是对原生API的一层封装而已，底层实现基本相同。值得留意的一点是，原生API的参数通过byte[]来传递节点内容，而ZkClient支持自定义序列化，因此可以传输Object对象。

createParents参数决定了是否递归创建父节点。true表示递归创建，false表示不使用递归创建。这也正是ZkClient帮开发人员省去了不少繁琐的检查和创建父节点的过程。

### 删除节点

删除节点提供了以下方法：

```
public boolean delete(final String path)

public boolean delete(final String path, final int version)

public boolean deleteRecursive(String path) 
```

删除API其实很简单，重点说一下deleteRecursive接口，这个接口提供了递归删除的功能。在原生API中，如果一个节点存在子节点，那么它将无法直接删除，必须一层层遍历先删除全部子节点，然后才能将目标节点删除。

### 读取节点

#### 获取节点列表

```
public List<String> getChildren(String path) 
```

此接口返回子节点的相对路径列表。比如节点路径为/test/a1和/test/a2，那么当path为/test时，返回的结果为[a1,a2]。

其中在原始API中，对节点注册Watcher，当节点被删除或其下面的子节点新增或删除时，会通知客户端。在ZkClient中，通过Listener监听来实现，后续会将到具体的使用方法。

可以注册的Listener为，接口IZkChildListener下面的方法来实现：

```
public void handleChildChange(String parentPath, List<String> currentChilds) 
```

#### 获取节点内容

```
public <T extends Object> T readData(String path)

public <T extends Object> T readData(String path, boolean returnNullIfPathNotExists)

public <T extends Object> T readData(String path, Stat stat) 
```

通过方法返回参数的定义，就可以得知，返回的结果（节点的内容）已经被反序列化成对象了。

对本接口实现监听的接口为IZkDataListener，分别提供了处理数据变化和删除操作的监听：

```
public void handleDataChange(String dataPath, Object data) throws Exception;

public void handleDataDeleted(String dataPath) throws Exception; 
```

### 更新数据

更新操作可以通过以下接口来实现：

```
public void writeData(String path, Object object)

public void writeData(final String path, Object datat, final int expectedVersion)

public Stat writeDataReturnStat(final String path, Object datat, final int expectedVersion) 
```

### 监测节点是否存在

此API比较简单，调用以下方法即可：

```
protected boolean exists(final String path, final boolean watch) 
```

### 注册监听

在ZkClient中客户端可以通过注册相关的事件监听来实现对Zookeeper服务端时间的订阅。其中ZkClient提供的监听事件接口有以下几种：

| 接口类              | 注册监听方法                           | 解除监听方法                             |
| ---------------- | -------------------------------- | ---------------------------------- |
| IZkChildListener | ZkClient的subscribeChildChanges方法 | ZkClient的unsubscribeChildChanges方法 |
| IZkDataListener  | ZkClient的subscribeDataChanges方法  | ZkClient的subscribeChildChanges方法   |
| IZkStateListener | ZkClient的subscribeStateChanges方法 | ZkClient的unsubscribeStateChanges方法 |

其中ZkClient还提供了一个unsubscribeAll方法，来解除所有监听。

下面以IZkChildListener为例来举例说明使用方法：

```
package com.secbro.learn.zkclient;

import org.I0Itec.zkclient.IZkChildListener;
import org.I0Itec.zkclient.ZkClient;

import java.util.List;

/**
 * Created by zhuzs on 2017/3/31.
 */
public class TestZkClient {
    public static void main(String[] args) throws InterruptedException {

        ZkClient zkClient = new ZkClient("127.0.0.1:2181",5000);
        System.out.println("ZK 成功建立连接！");

        String path = "/zk-test";
        // 注册子节点变更监听（此时path节点并不存在，但可以进行监听注册）
        zkClient.subscribeChildChanges(path, new IZkChildListener() {
            public void handleChildChange(String parentPath, List<String> currentChilds) throws Exception {
                System.out.println("路径" + parentPath +"下面的子节点变更。子节点为：" + currentChilds );
            }
        });

        // 递归创建子节点（此时父节点并不存在）
        zkClient.createPersistent("/zk-test/a1",true);
        Thread.sleep(5000);
        System.out.println(zkClient.getChildren(path));
    }
}

```

执行结果为：

```
ZK 成功建立连接！
路径/zk-test下面的子节点变更。子节点为：[a1]
[a1] 
```

上面展示了Listener的基本使用方法，其他方法的使用读者可以自行尝试。



<http://blog.csdn.net/wo541075754/article/details/68929512#t11>