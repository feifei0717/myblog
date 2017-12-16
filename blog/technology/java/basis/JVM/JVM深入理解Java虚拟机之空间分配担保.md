# 深入理解Java虚拟机之空间分配担保

本文所属图书 > [深入理解Java虚拟机：JVM高级特性与最佳实践(第2版)](http://book.2cto.com/201306/25426.html)



​	在发生Minor GC之前，[虚拟机](http://www.2cto.com/os/xuniji/)会先检查老年代最大可用的连续空间是否大于新生代所有对象总空间，如果这个条件成立，那么Minor GC可以确保是安全的。如果不成立，则[虚拟机](http://www.2cto.com/os/xuniji/)会查看HandlePromotionFailure设置值是否允许担保失败。如果允许，那么会继续检查老年代最大可用的连续空间是否大于历次晋升到老年代对象的平均大小，如果大于，将尝试着进行一次Minor GC，尽管这次Minor GC是有风险的；如果小于，或者HandlePromotionFailure设置不允许冒险，那这时也要改为进行一次Full GC。

​	下面解释一下“冒险”是冒了什么风险，前面提到过，新生代使用复制收集算法，但为了内存利用率，只使用其中一个Survivor空间来作为轮换备份，因此当出现大量对象在Minor GC后仍然存活的情况（最极端的情况就是内存回收后新生代中所有对象都存活），就需要老年代进行分配担保，把Survivor无法容纳的对象直接进入老年代。与生活中的贷款担保类似，老年代要进行这样的担保，前提是老年代本身还有容纳这些对象的剩余空间，一共有多少对象会活下来在实际完成内存回收之前是无法明确知道的，所以只好取之前每一次回收晋升到老年代对象容量的平均大小值作为经验值，与老年代的剩余空间进行比较，决定是否进行Full GC来让老年代腾出更多空间。

​	取平均值进行比较其实仍然是一种动态概率的手段，也就是说，如果某次Minor GC存活后的对象突增，远远高于平均值的话，依然会导致担保失败（Handle Promotion Failure）。如果出现了HandlePromotionFailure失败，那就只好在失败后重新发起一次Full GC。虽然担保失败时绕的圈子是最大的，但大部分情况下都还是会将HandlePromotionFailure开关打开，避免Full GC过于频繁，参见代码清单3-9，请读者在JDK 6 Update 24之前的版本中运行测试。

代码清单3-9　空间分配担保

```java
private static final int _1MB = 1024 * 1024;

/**
 * VM参数：-Xms20M -Xmx20M -Xmn10M -XX:+PrintGCDetails -XX:SurvivorRatio=8 -XX:-HandlePromotionFailure
 */
@SuppressWarnings("unused")
public static void testHandlePromotion() {
  byte[] allocation1, allocation2, allocation3, allocation4, allocation5, allocation6, allocation7;
  allocation1 = new byte[2 * _1MB];
  allocation2 = new byte[2 * _1MB];
  allocation3 = new byte[2 * _1MB];
  allocation1 = null;
  allocation4 = new byte[2 * _1MB];
  allocation5 = new byte[2 * _1MB];
  allocation6 = new byte[2 * _1MB];
  allocation4 = null;
  allocation5 = null;
  allocation6 = null;
  allocation7 = new byte[2 * _1MB];
}
```

以HandlePromotionFailure = false参数来运行的结果：

```
[GC [DefNew: 6651K->148K(9216K), 0.0078936 secs] 6651K->4244K(19456K), 0.0079192 secs] [Times: user=0.00 sys=0.02, real=0.02 secs]
[GC [DefNew: 6378K->6378K(9216K), 0.0000206 secs][Tenured: 4096K->4244K(10240K), 0.0042901 secs] 10474K->4244K(19456K), [Perm : 2104K->2104K(12288K)], 0.0043613 secs] [Times: user=0.00 sys=0.00, real=0.00 secs]
```

以HandlePromotionFailure = true参数来运行的结果：

```
[GC [DefNew: 6651K->148K(9216K), 0.0054913 secs] 6651K->4244K(19456K), 0.0055327 secs] [Times: user=0.00 sys=0.00, real=0.00 secs]
[GC [DefNew: 6378K->148K(9216K), 0.0006584 secs] 10474K->4244K(19456K), 0.0006857 secs] [Times: user=0.00 sys=0.00, real=0.00 secs]
```

在JDK 6 Update 24之后，这个测试结果会有差异，HandlePromotionFailure参数不会再影响到虚拟机的空间分配担保策略，观察OpenJDK中的[源码](http://www.2cto.com/ym/)变化（见代码清单3-10），虽然[源码](http://www.2cto.com/ym/)中还定义了HandlePromotionFailure参数，但是在代码中已经不会再使用它。JDK 6 Update 24之后的规则变为只要老年代的连续空间大于新生代对象总大小或者历次晋升的平均大小就会进行Minor GC，否则将进行Full GC。

代码清单3-10　HotSpot中空间分配检查的代码片段

```Java
bool TenuredGeneration::promotion_attempt_is_safe(size_t
max_promotion_in_bytes) const {
   // 老年代最大可用的连续空间
   size_t available = max_contiguous_available();  
   // 每次晋升到老年代的平均大小
   size_t av_promo  = (size_t)gc_stats()->avg_promoted()->padded_average();
   // 老年代可用空间是否大于平均晋升大小，或者老年代可用空间是否大于当此GC时新生代所有对象容量
   bool   res = (available >= av_promo) || (available >=
max_promotion_in_bytes);
  return res;
}
```



http://book.2cto.com/201306/25499.html