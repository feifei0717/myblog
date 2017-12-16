# 1      查询缓存

 

## 1.1  什么是查询缓存

mybatis提供查询缓存，用于减轻数据压力，提高[数据库](http://lib.csdn.net/base/mysql)性能。

mybaits提供一级缓存，和二级缓存。

 ![img](image-201709191026/0.7814300044901743.png)

一级缓存是SqlSession级别的缓存。在操作数据库时需要构造 sqlSession对象，在对象中有一个(内存区域)[数据结构](http://lib.csdn.net/base/datastructure)（HashMap）用于存储缓存数据。不同的sqlSession之间的缓存数据区域（HashMap）是互相不影响的。

一级缓存的作用域是同一个SqlSession，在同一个sqlSession中两次执行相同的sql语句，[第一次执行完毕会将数据库中查询的数据写到缓存（内存），第二次会从缓存中获取数据将不再从数据库查询，从而提高查询效率。]()当一个sqlSession结束后该sqlSession中的一级缓存也就不存在了。Mybatis默认开启一级缓存。

二级缓存是mapper级别的缓存，多个SqlSession去操作同一个Mapper的sql语句，多个SqlSession去操作数据库得到数据会存在二级缓存区域，多个SqlSession可以共用二级缓存，二级缓存是跨SqlSession的。

​    二级缓存是多个SqlSession共享的，其作用域是mapper的同一个namespace，不同的sqlSession两次执行相同namespace下的sql语句且向sql中传递参数也相同即最终执行相同的sql语句，第一次执行完毕会将数据库中查询的数据写到缓存（内存），第二次会从缓存中获取数据将不再从数据库查询，从而提高查询效率。Mybatis默认没有开启二级缓存需要在setting全局参数中配置开启二级缓存。

如果缓存中有数据就不用从数据库中获取，大大提高系统性能。

## 1.2  一级缓存

### 1.2.1    一级缓存工作原理

下图是根据id查询用户的一级缓存图解

 ![img](image-201709191026/0.2658047271131043.png)

第一次发起查询用户id为1的用户信息，先去找缓存中是否有id为1的用户信息，如果没有，从数据库查询用户信息。

得到用户信息，将用户信息存储到一级缓存中。

 

如果**sqlSession去执行commit操作（执行插入、更新、删除），清空SqlSession中的一级缓**存，这样做的目的为了让缓存中存储的是最新的信息，避免脏读。

 

第二次发起查询用户id为1的用户信息，先去找缓存中是否有id为1的用户信息，缓存中有，直接从缓存中获取用户信息。

### 1.2.2    一级缓存测试

mybatis默认支持一级缓存，不需要在配置文件去配置。

 

按照上边一级缓存原理步骤去[测试](http://lib.csdn.net/base/softwaretest)。

```
@Test
   public void testCache1() throws Exception{
      SqlSessionsqlSession = sqlSessionFactory.openSession();//创建代理对象
      UserMapperuserMapper = sqlSession.getMapper(UserMapper.class);
     
      //下边查询使用一个SqlSession
      //第一次发起请求，查询id为1的用户
      Useruser1 = userMapper.findUserById(1);
      System.out.println(user1);
     
//    如果sqlSession去执行commit操作（执行插入、更新、删除），清空SqlSession中的一级缓存，这样做的目的为了让缓存中存储的是最新的信息，避免脏读。
     
      //更新user1的信息
      user1.setUsername("测试用户22");
      userMapper.updateUser(user1);
      //执行commit操作去清空缓存
      sqlSession.commit();
     
      //第二次发起请求，查询id为1的用户
      Useruser2 = userMapper.findUserById(1);
      System.out.println(user2);
     
      sqlSession.close();
     
   }
```



### 1.2.3    一级缓存应用

正式开发，是将mybatis和[spring](http://lib.csdn.net/base/javaee)进行整合开发，事务控制在service中。

一个service方法中包括很多mapper方法调用。

```
service{
         //开始执行时，开启事务，创建SqlSession对象
         //第一次调用mapper的方法findUserById(1)
        
         //第二次调用mapper的方法findUserById(1)，从一级缓存中取数据
        
//aop控制 只要方法结束，sqlSession关闭 sqlsession关闭后就销毁数据结构，清空缓存
         Service结束sqlsession关闭
}
```

如果是执行两次service调用查询相同的用户信息，不走一级缓存，因为Service方法结束，sqlSession就关闭，一级缓存就清空。

## 1.3  二级缓存

### 1.3.1    原理

 ![img](image-201709191026/0.46930741488508576.png)

首先开启mybatis的二级缓存。

 

sqlSession1去查询用户id为1的用户信息，查询到用户信息会将查询数据存储到二级缓存中。

 

如果**SqlSession3去执行相同 mapper下sql，执行commit提交，清空该 mapper下的二级缓存区域的数据。**

 

sqlSession2去查询用户id为1的用户信息，去缓存中找是否存在数据，如果存在直接从缓存中取出数据。

 

二级缓存与一级缓存区别，二级缓存的范围更大，多个sqlSession可以共享一个UserMapper的二级缓存区域。数据类型仍然为HashMap

UserMapper有一个二级缓存区域（按namespace分，如果namespace相同则使用同一个相同的二级缓存区），其它mapper也有自己的二级缓存区域（按namespace分）。

每一个namespace的mapper都有一个二缓存区域，两个mapper的namespace如果相同，这两个mapper执行sql查询到数据将存在相同的二级缓存区域中。

### 1.3.2    开启二级缓存

mybaits的二级缓存是mapper范围级别，除了在SqlMapConfig.xml设置二级缓存的总开关，还要在具体的mapper.xml中开启二级缓存。

 

在核心配置文件SqlMapConfig.xml中加入

```
<setting name="cacheEnabled"value="true"/>
<!-- 全局配置参数，需要时再设置 -->
    <settings>
       <!-- 开启二级缓存  默认值为true -->
    <setting name="cacheEnabled" value="true"/>
</settings>
```

 

| 描述           | 允许值                          | 默认值        |      |
| ------------ | ---------------------------- | ---------- | ---- |
| cacheEnabled | 对在此配置文件下的所有cache 进行全局性开/关设置。 | true false | true |

 

在UserMapper.xml中开启二缓存，UserMapper.xml下的sql执行完成会存储到它的缓存区域（HashMap）。

```
<mapper namespace="cn.hpu.mybatis.mapper.UserMapper">
<!-- 开启本mapper namespace下的二级缓存 -->
<cache></cache>
```



### 1.3.3    调用pojo类实现序列化接口

```
public class Userimplements Serializable {
    //Serializable实现序列化，为了将来反序列化
}
```

二级缓存需要查询结果映射的pojo对象实现[Java](http://lib.csdn.net/base/javase).io.Serializable接口实现序列化和反序列化操作，注意如果存在父类、成员pojo都需要实现序列化接口。

pojo类实现序列化接口是为了将缓存数据取出执行反序列化操作，因为二级缓存数据存储介质多种多样，不一定在内存有可能是硬盘或者远程服务器。

### 1.3.4    测试方法

```

// 二级缓存测试
   @Test
   public void testCache2() throws Exception {
      SqlSessionsqlSession1 = sqlSessionFactory.openSession();
      SqlSessionsqlSession2 = sqlSessionFactory.openSession();
      SqlSessionsqlSession3 = sqlSessionFactory.openSession();
      // 创建代理对象
      UserMapperuserMapper1 = sqlSession1.getMapper(UserMapper.class);
      // 第一次发起请求，查询id为1的用户
      Useruser1 = userMapper1.findUserById(1);
      System.out.println(user1);
     
      //这里执行关闭操作，将sqlsession中的数据写到二级缓存区域
      sqlSession1.close();
     
      //使用sqlSession3执行commit()操作
      UserMapperuserMapper3 = sqlSession3.getMapper(UserMapper.class);
      Useruser  = userMapper3.findUserById(1);
      user.setUsername("张明明");
      userMapper3.updateUser(user);
      //执行提交，清空UserMapper下边的二级缓存
      sqlSession3.commit();
      sqlSession3.close();
     
      UserMapperuserMapper2 = sqlSession2.getMapper(UserMapper.class);
      // 第二次发起请求，查询id为1的用户
      Useruser2 = userMapper2.findUserById(1);
      System.out.println(user2);
 
      sqlSession2.close();
   }
```



### 1.3.5  useCache配置禁用二级缓存

在statement中设置useCache=false可以禁用当前select语句的二级缓存，即每次查询都会发出sql去查询，默认情况是true，即该sql使用二级缓存。

```
<selectid="findOrderListResultMap" resultMap="ordersUserMap" useCache="false">
```

总结：针对每次查询都需要最新的数据sql，要设置成useCache=false，禁用二级缓存。 

### 1.3.6    mybatis刷新缓存（就是清空缓存）

在mapper的同一个namespace中，如果有其它insert、update、delete操作数据后需要刷新缓存，如果不执行刷新缓存会出现脏读。

 设置statement配置中的flushCache="true" 属性，默认情况下为true即刷新缓存，如果改成false则不会刷新。使用缓存时如果手动修改数据库表中的查询数据会出现脏读。

如下：

```
<insertid="insertUser" parameterType="cn.itcast.mybatis.po.User" flushCache="true">
```

 

总结：一般下执行完commit操作都需要刷新缓存，flushCache=true表示刷新缓存默认情况下为true,我们不用去设置它，这样可以避免数据库脏读。

### 1.3.7  Mybatis Cache参数

flushInterval（刷新间隔）可以被设置为任意的正整数，而且它们代表一个合理的毫秒形式的时间段。默认情况是不设置，也就是没有刷新间隔，缓存仅仅调用语句时刷新。

size（引用数目）可以被设置为任意正整数，要记住你缓存的对象数目和你运行环境的可用内存资源数目。默认值是1024。

readOnly（只读）属性可以被设置为true或false。只读的缓存会给所有调用者返回缓存对象的相同实例。因此这些对象不能被修改。这提供了很重要的性能优势。可读写的缓存会返回缓存对象的拷贝（通过序列化）。这会慢一些，但是安全，因此默认是false。

如下例子：

```
<cache  eviction="FIFO" flushInterval="60000"  size="512" readOnly="true"/>
```

这个更高级的配置创建了一个 FIFO 缓存,并每隔 60 秒刷新,存数结果对象或列表的 512 个引用,而且返回的对象被认为是只读的,因此在不同线程中的调用者之间修改它们会导致冲突。可用的收回策略有, 默认的是 LRU:

1.      LRU – 最近最少使用的:移除最长时间不被使用的对象。

2.      FIFO – 先进先出:按对象进入缓存的顺序来移除它们。

3.      SOFT – 软引用:移除基于垃圾回收器状态和软引用规则的对象。

4.      WEAK – 弱引用:更积极地移除基于垃圾收集器状态和弱引用规则的对象。

## 1.4  mybatis整合ehcache

ehcache是一个分布式缓存框架。

EhCache 是一个纯Java的进程内缓存框架，是一种广泛使用的开源Java分布式缓存，具有快速、精干等特点，是[hibernate](http://lib.csdn.net/base/javaee)中默认的CacheProvider。

### 1.4.1    分布缓存

我们系统为了提高系统并发，性能、一般对系统进行分布式部署（集群部署方式）

![img](image-201709191026/0.8941598564145365.png)

不使用分布缓存，缓存的数据在各各服务单独存储，不方便系统开发。所以要使用分布式缓存对缓存数据进行集中管理。

mybatis无法实现分布式缓存，需要和其它分布式缓存框架进行整合。

### 1.4.2    整合方法(掌握无论整合谁，首先想到改type接口)

mybatis提供了一个cache接口，如果要实现自己的缓存逻辑，实现cache接口开发即可。

mybatis和ehcache整合，mybatis和ehcache整合包中提供了一个cache接口的实现类。

### 1.4.3    第一步加入ehcache包

 ![img](image-201709191026/0.48526987061643334.png)

### 1.4.4    整合ehcache

配置mapper中cache中的type为ehcache对cache接口的实现类型。

 

```
<mapper namespace="cn.hpu.mybatis.mapper.UserMapper">
<!-- 开启本mapper namespace下的二级缓存
   type：指定cache接口实现类，mybatis默认使用PerpetualCache
   要和eache整合，需要配置type为ehcahe实现cache接口的类型
 -->
<cache type="org.mybatis.caches.ehcache.EhcacheCache">
</cache>
```

 

可以根据需求调整缓存参数：

```
<cache type="org.mybatis.caches.ehcache.EhcacheCache">
        <property name="timeToIdleSeconds" value="3600"/>
        <property name="timeToLiveSeconds" value="3600"/>
        <!-- 同ehcache参数maxElementsInMemory-->
       <property name="maxEntriesLocalHeap"value="1000"/>
       <!-- 同ehcache参数maxElementsOnDisk -->
        <property name="maxEntriesLocalDisk" value="10000000"/>
        <property name="memoryStoreEvictionPolicy" value="LRU"/>
    </cache>
```



### 1.4.5    加入ehcache的配置文件

在classpath下配置ehcache.xml

```
<ehcache xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xsi:noNamespaceSchemaLocation="../config/ehcache.xsd">
    <diskStore path="F:\develop\ehcache"/>
    <defaultCache
maxElementsInMemory="1000"
       maxElementsOnDisk="10000000"
       eternal="false"
       overflowToDisk="false"
       timeToIdleSeconds="120"
       timeToLiveSeconds="120"
       diskExpiryThreadIntervalSeconds="120"
       memoryStoreEvictionPolicy="LRU">
    </defaultCache>
</ehcache>
```

属性说明：

 diskStore：指定数据在磁盘中的存储位置。

 defaultCache：当借助CacheManager.add("demoCache")创建Cache时，EhCache便会采用<defalutCache/>指定的的管理策略

以下属性是必须的：

maxElementsInMemory - 在内存中缓存的element的最大数目

maxElementsOnDisk - 在磁盘上缓存的element的最大数目，若是0表示无穷大

 eternal - 设定缓存的elements是否永远不过期。如果为true，则缓存的数据始终有效，如果为false那么还要根据timeToIdleSeconds，timeToLiveSeconds判断

 overflowToDisk- 设定当内存缓存溢出的时候是否将过期的element缓存到磁盘上

以下属性是可选的：

timeToIdleSeconds - 当缓存在EhCache中的数据前后两次访问的时间超过timeToIdleSeconds的属性取值时，这些数据便会删除，默认值是0,也就是[可闲置时间]()无穷大

timeToLiveSeconds - 缓存element的有效生命期，默认是0.,也就是element存活时间无穷大

​       diskSpoolBufferSizeMB 这个参数设置DiskStore(磁盘缓存)的缓存区大小.默认是30MB.每个Cache都应该有自己的一个缓冲区.

diskPersistent在VM重启的时候是否启用磁盘保存EhCache中的数据，默认是false。

diskExpiryThreadIntervalSeconds - 磁盘缓存的清理线程运行间隔，默认是120秒。每个120s，相应的线程会进行一次EhCache中数据的清理工作

memoryStoreEvictionPolicy - 当内存缓存达到最大，有新的element加入的时候，移除缓存中element的策略。默认是LRU（最近最少使用），可选的有LFU（最不常使用）和FIFO（先进先出）

## 1.5  二级应用场景

对于访问多的查询请求且用户对查询结果实时性要求不高，此时可采用mybatis二级缓存技术降低数据库访问量，提高访问速度，业务场景比如：耗时较高的统计分析sql、电话账单查询sql等。

​         实现方法如下：通过设置刷新间隔时间，由mybatis每隔一段时间自动清空缓存，根据数据变化频率设置缓存刷新间隔**flushInterval**，比如设置为30分钟、60分钟、24小时等，根据需求而定。

## 1.6  二级缓存局限性

​         mybatis二级缓存对细粒度的数据级别的缓存实现不好，对同时缓存较多条数据的缓存，比如如下需求：对商品信息进行缓存，由于商品信息查询访问量大，但是要求用户每次都能查询最新的商品信息，此时如果使用mybatis的二级缓存就无法实现当一个商品变化时只刷新该商品的缓存信息而不刷新其它商品的信息，因为mybaits的二级缓存区域以mapper为单位划分，当一个商品信息变化会将所有商品信息的缓存数据全部清空。解决此类问题需要在业务层根据需求对数据有针对性缓存。需要使用三级缓存

摘自传智博客燕青老师的视频

来源： <http://blog.csdn.net/u012373815/article/details/47069223>