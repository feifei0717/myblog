# JVM GC分代收集算法和Eden Space、Survivor Space、Tenured Gen，Perm Gen解释

jvm区域总体分两类，heap区和非heap区。

- heap区又分：Eden Space（伊甸园）、Survivor Space(幸存者区)、Tenured Gen（老年代-养老区）。 
- 非heap区又分：Code Cache(代码缓存区)、Perm Gen（永久代）、Jvm Stack(java虚拟机栈)、Local Method Statck(本地方法栈)。

HotSpot虚拟机GC算法采用分代收集算法：

1、一个人（对象）出来（new 出来）后会在Eden Space（伊甸园）无忧无虑的生活，直到GC到来打破了他们平静的生活。GC会逐一问清楚每个对象的情况，有没有钱（此对象的引用）啊，因为GC想赚钱呀，有钱的才可以敲诈嘛。然后富人就会进入Survivor Space（幸存者区），穷人的就直接kill掉。

2、并不是进入Survivor Space（幸存者区）后就保证人身是安全的，但至少可以活段时间。GC会定期（可以自定义）会对这些人进行敲诈，亿万富翁每次都给钱，GC很满意，就让其进入了Genured Gen(养老区)。万元户经不住几次敲诈就没钱了，GC看没有啥价值啦，就直接kill掉了。

3、进入到养老区的人基本就可以保证人身安全啦，但是亿万富豪有的也会挥霍成穷光蛋，只要钱没了，GC还是kill掉。

分区的目的：新生区由于对象产生的比较多并且大都是朝生夕灭的，所以直接采用标记-清理算法。而养老区生命力很强，则采用复制算法，针对不同情况使用不同算法。

非heap区域中Perm Gen中放着类、方法的定义，jvm Stack区域放着方法参数、局域变量等的引用，方法执行顺序按照栈的先入后出方式。

以上转自：[http://lhc1986.iteye.com/blog/1421832](http://lhc1986.iteye.com/blog/1421832)

以下转自：[http://www.cnblogs.com/xhr8334/archive/2011/12/01/2270994.html](http://www.cnblogs.com/xhr8334/archive/2011/12/01/2270994.html)







## GC工作机制

SUN的jvm内存池被划分为以下几个部分：

**EdenSpace (heap)**

内存最初从这个线程池分配给大部分对象。

 

**Survivor Space (heap)**

用于保存在eden space内存池中经过垃圾回收后没有被回收的对象。

 

**Tenured Generation (heap)**

用于保持已经在survivor space内存池中存在了一段时间的对象。

 

**Permanent Generation (non-heap)**

保存虚拟机自己的静态(reflective)数据，例如类（class）和方法（method）对象。Java虚拟机共享这些类数据。这个区域被分割为只读的和只写的。

 

**Code Cache (non-heap)**

HotSpot Java虚拟机包括一个用于编译和保存本地代码（native code）的内存，叫做“代码缓存区”（code cache）。

 

简单来讲，jvm的内存回收过程是这样的：

对象在Eden Space创建，当Eden Space满了的时候，gc就把所有在Eden Space中的对象扫描一次，把所有有效的对象复制到第一个Survivor Space，同时把无效的对象所占用的空间释放。当Eden Space再次变满了的时候，就启动移动程序把Eden Space中有效的对象复制到第二个Survivor Space，同时，也将第一个Survivor Space中的有效对象复制到第二个Survivor Space。如果填充到第二个Survivor Space中的有效对象被第一个Survivor Space或Eden Space中的对象引用，那么这些对象就是长期存在的，此时这些对象将被复制到Permanent Generation。

若垃圾收集器依据这种小幅度的调整收集不能腾出足够的空间，就会运行Full GC，此时jvm gc停止所有在堆中运行的线程并执行清除动作。