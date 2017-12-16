# Zookeeper节点类型

ZooKeeper 节点是有生命周期的，这取决于节点的类型。在 ZooKeeper 中，节点类型可以分为持久节点（PERSISTENT ）、临时节点（EPHEMERAL），以及时序节点（SEQUENTIAL ），具体在节点创建过程中，一般是组合使用，可以生成以下 4 种节点类型。

## **1、临时节点（EPHEMERAL）**

临时节点的生命周期和客户端会话绑定。也就是说，如果客户端会话失效，那么这个节点就会自动被清除掉。实例：

```
String root = "/ephemeral";
String createdPath = zk.create(root, root.getBytes(),
          Ids.OPEN_ACL_UNSAFE, CreateMode.PERSISTENT);
System.out.println("createdPath = " + createdPath);
        
String path = "/ephemeral/test01" ; 
createdPath = zk.create(path, path.getBytes(),
            Ids.OPEN_ACL_UNSAFE, CreateMode.EPHEMERAL);
System.out.println("createdPath = " + createdPath);
Thread.sleep(1000 * 20); // 等待20秒关闭ZooKeeper连接
zk.close(); // 关闭连接后创建的临时节点将自动删除
```

注意：这里提到的是会话失效，而非连接断开。另外，在临时节点下面不能创建子节点。

## **2、临时顺序节点（EPHEMERAL_SEQUENTIAL）**

临时节点的生命周期和客户端会话绑定。也就是说，如果客户端会话失效，那么这个节点就会自动被清除掉。注意创建的节点会自动加上编号。实例：

```
String root = "/ephemeral";
String createdPath = zk.create(root, root.getBytes(),
          Ids.OPEN_ACL_UNSAFE, CreateMode.PERSISTENT);
System.out.println("createdPath = " + createdPath);
        
String path = "/ephemeral/test01" ; 
createdPath = zk.create(path, path.getBytes(),
            Ids.OPEN_ACL_UNSAFE, CreateMode.EPHEMERAL_SEQUENTIAL);
System.out.println("createdPath = " + createdPath);
Thread.sleep(1000 * 20); // 等待20秒关闭ZooKeeper连接
zk.close(); // 关闭连接后创建的临时节点将自动删除
```

输出结果：

type = None

createdPath = /ephemeral/test0000000003

createdPath = /ephemeral/test0000000004

createdPath = /ephemeral/test0000000005

createdPath = /ephemeral/test0000000006

## **3、持久节点（PERSISTENT）**

所谓持久节点，是指在节点创建后，就一直存在，直到有删除操作来主动清除这个节点——不会因为创建该节点的客户端会话失效而消失。实例：

```
String root = "/computer";
String createdPath = zk.create(root, root.getBytes(),
       Ids.OPEN_ACL_UNSAFE, CreateMode.PERSISTENT);
System.out.println("createdPath = " + createdPath);
```



## **4、持久顺序节点（PERSISTENT_SEQUENTIAL）**

这类节点的基本特性和持久节点类型是一致的。额外的特性是，在ZooKeeper中，每个父节点会为他的第一级子节点维护一份时序，会记录每个子节点创建的先后顺序。基于这个特性，在创建子节点的时候，可以设置这个属性，那么在创建节点过程中，ZooKeeper会自动为给定节点名加上一个数字后缀，作为新的节点名。这个数字后缀的范围是整型的最大值。实例：

```
String root = "/computer";
String createdPath = zk.create(root, root.getBytes(),
       Ids.OPEN_ACL_UNSAFE, CreateMode.PERSISTENT);
System.out.println("createdPath = " + createdPath);
for (int i=0; i<5; i++) {
   String path = "/computer/node";
   String createdPath = zk.create(path, path.getBytes(),
       Ids.OPEN_ACL_UNSAFE, CreateMode.PERSISTENT_SEQUENTIAL);
   System.out.println("createdPath = " + createdPath);
}
zk.close();
```

运行结果：

createdPath = /computer

createdPath = /computer/node0000000000

createdPath = /computer/node0000000001

createdPath = /computer/node0000000002

createdPath = /computer/node0000000003

createdPath = /computer/node0000000004

结果中的0000000000~0000000004都是自动添加的序列号

来源： <<http://www.bug315.com/article/166.htm>>

 