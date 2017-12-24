# Java集合框架：WeakHashMap

 

## WeakHashMap定义

```
package java.util;
import java.lang.ref.WeakReference;
import java.lang.ref.ReferenceQueue;

public class WeakHashMap<K,V>
    extends AbstractMap<K,V>
    implements Map<K,V> {
}12345678
```

  WeakHashMap实现了Map接口，是HashMap的一种实现，它比HashMap多了一个引用队列：

```
private final ReferenceQueue<Object> queue = new ReferenceQueue<>();1
```

  博主认真比对过WeakHashMap和HashMap的源码，发现WeakHashMap中方法的实现方式基本和HashMap的一样，注意“基本”两个字，除了没有实现Cloneable和Serializable这两个标记接口，最大的区别在于在于expungeStaleEntries()这个方法，这个是整个WeakHashMap的精髓，我们稍后进行阐述。 
  它使用弱引用作为内部数据的存储方案。WeakHashMap是弱引用的一种典型应用，它可以为简单的缓存表解决方案。

------

## WeakHashMap使用

  我们举一个简单的例子来说明一下WeakHashMap的使用：

```
        Map<String,Integer> map = new WeakHashMap<>();
        map.put("s1", 1);
        map.put("s2", 2);
        map.put("s3", 3);
        map.put("s4", 4);
        map.put("s5", 5);
        map.put(null, 9);
        map.put("s6", 6);
        map.put("s7", 7);
        map.put("s8", 8);
        map.put(null, 11);
        for(Map.Entry<String,Integer> entry:map.entrySet())
        {
            System.out.println(entry.getKey()+":"+entry.getValue());
        }
        System.out.println(map);12345678910111213141516
```

  运行结果：

```
s4:4
s3:3
s6:6
null:11
s5:5
s8:8
s7:7
s1:1
s2:2
{s4=4, s3=3, s6=6, null=11, s5=5, s8=8, s7=7, s1=1, s2=2}12345678910
```

  WeakHashMap和HashMap一样key和value的值都可以为null，并且也是无序的。但是HashMap的null是存在table[0]中的，这是固定的，并且null的hash为0，而在WeakHashMap中的null却没有存入table[0]中。 
  这是因为WeakHashMap对null值进行了包装：

```
 private static final Object NULL_KEY = new Object();
    private static Object maskNull(Object key) {
        return (key == null) ? NULL_KEY : key;
    }
    static Object unmaskNull(Object key) {
        return (key == NULL_KEY) ? null : key;
    }1234567
```

  当对map进行put和get操作的时候，将null值标记为NULL_KEY,然后对NULL_KEY即对new Object()进行与其他对象一视同仁的hash，这样就使得null和其他非null的值毫无区别。

------

## JDK关键源码分析

  首先看一下Entry<K,V>这个静态内部类：

```
private static class Entry<K,V> extends WeakReference<Object> implements Map.Entry<K,V> {
        V value;
        int hash;
        Entry<K,V> next;

        /**
         * Creates new entry.
         */
        Entry(Object key, V value,
              ReferenceQueue<Object> queue,
              int hash, Entry<K,V> next) {
            super(key, queue);
            this.value = value;
            this.hash  = hash;
            this.next  = next;
        }
    //其余代码略
}123456789101112131415161718
```

  可以看到Entry继承扩展了WeakReference类（有关Java的引用类型可以参考《[Java引用类型](http://blog.csdn.net/u013256816/article/details/50907595)》）。并在其构造函数中，构造了key的弱引用。 
  此外，在WeakHashMap的各项操作中，比如get()、put()、size()都间接或者直接调用了expungeStaleEntries()方法，以清理持有弱引用的key的表象。 
  expungeStaleEntries()方法的实现如下：

```
private void expungeStaleEntries() {
        for (Object x; (x = queue.poll()) != null; ) {
            synchronized (queue) {
                @SuppressWarnings("unchecked")
                    Entry<K,V> e = (Entry<K,V>) x;
                int i = indexFor(e.hash, table.length);

                Entry<K,V> prev = table[i];
                Entry<K,V> p = prev;
                while (p != null) {
                    Entry<K,V> next = p.next;
                    if (p == e) {
                        if (prev == e)
                            table[i] = next;
                        else
                            prev.next = next;
                        // Must not null out e.next;
                        // stale entries may be in use by a HashIterator
                        e.value = null; // Help GC
                        size--;
                        break;
                    }
                    prev = p;
                    p = next;
                }
            }
        }
    }12345678910111213141516171819202122232425262728
```

  可以看到每调用一次expungeStaleEntries()方法，就会在引用队列中寻找是否有被清楚的key对象，如果有则在table中找到其值，并将value设置为null，next指针也设置为null，让GC去回收这些资源。

------

## 案例应用

  如果在一个普通的HashMap中存储一些比较大的值如下：

```
        Map<Integer,Object> map = new HashMap<>();
        for(int i=0;i<10000;i++)
        {
            Integer ii = new Integer(i);
            map.put(ii, new byte[i]);
        }123456
```

  运行参数：-Xmx5M 
  运行结果：

```
     Exception in thread "main" java.lang.OutOfMemoryError: Java heap space
    at collections.WeakHashMapTest.main(WeakHashMapTest.java:39)12
```

  同样我们将HashMap换成WeakHashMap其余都不变：

```
         Map<Integer,Object> map = new WeakHashMap<>();
        for(int i=0;i<10000;i++)
        {
            Integer ii = new Integer(i);
            map.put(ii, new byte[i]);
        }123456
```

  运行结果：（无任何报错） 
  这两段代码比较可以看到WeakHashMap的功效，如果在系统中需要一张很大的Map表，Map中的表项作为缓存只用，这也意味着即使没能从该Map中取得相应的数据，系统也可以通过候选方案获取这些数据。虽然这样会消耗更多的时间，但是不影响系统的正常运行。 
  在这种场景下，使用WeakHashMap是最合适的。因为WeakHashMap会在系统内存范围内，保存所有表项，而一旦内存不够，在GC时，没有被引用的表项又会很快被清除掉，从而避免系统内存溢出。 
  我们这里稍微改变一下上面的代码（加了一个List）：

```
Map<Integer,Object> map = new WeakHashMap<>();
        List<Integer> list = new ArrayList<>();
        for(int i=0;i<10000;i++)
        {
            Integer ii = new Integer(i);
            list.add(ii);
            map.put(ii, new byte[i]);
        }   12345678
```

  运行结果：

```
Exception in thread "main" java.lang.OutOfMemoryError: Java heap space
    at collections.WeakHashMapTest.main(WeakHashMapTest.java:43)12
```

  **如果存放在WeakHashMap中的key都存在强引用，那么WeakHashMap就会退化成HashMap。如果在系统中希望通过WeakHashMap自动清楚数据，请尽量不要在系统的其他地方强引用WeakHashMap的key，否则，这些key就不会被回收，WeakHashMap也就无法正常释放它们所占用的表项**。

> 博主如是说：要想WeakHashMap能够释放掉key被GC的value的对象，尽可能的多调用下put/size/get等操作，因为这些方法会调用expungeStaleEntries方法，expungeStaleEntries方法是关键，而如果不操作WeakHashMap，以企图WeakHashMap“自动”释放内存是不可取的，这里的“自动”是指譬如map.put(obj,new byte[10M])；之后obj=null了，之后再也没掉用过map的任何方法，那么new出来的10M空间是不会释放的。

------

## 疑问

  楼主对于WeakHashMap一直有一个疑问，是这样的： 
  我们知道WeakHashMap的key可以为null，那么当put一个key为null，value为一个很大对象的时候，这个很大的对象怎么采用WeakHashMap的自带的功能自动释放呢？ 
  代码如下：

```
Map<Object,Object> map = new WeakHashMap<>();
        map.put(null,new byte[5*1024*928]);
        int i = 1;
        while(true)
        {
            System.out.println();
            TimeUnit.SECONDS.sleep(2);
            System.out.println(map.size());
            System.gc();
            System.out.println("==================第"+i+++"次GC结束====================");
        }1234567891011
```

  运行参数：-Xmx5M -XX:+PrintGCDetails 
  运行结果：

```
1
[GC [PSYoungGen: 680K->504K(2560K)] 5320K->5240K(7680K), 0.0035741 secs] [Times: user=0.00 sys=0.00, real=0.00 secs] 
[Full GC [PSYoungGen: 504K->403K(2560K)] [ParOldGen: 4736K->4719K(5120K)] 5240K->5123K(7680K) [PSPermGen: 2518K->2517K(21504K)], 0.0254473 secs] [Times: user=0.06 sys=0.00, real=0.03 secs] 
==================第1次GC结束====================

1
[Full GC [PSYoungGen: 526K->0K(2560K)] [ParOldGen: 4719K->5112K(5120K)] 5246K->5112K(7680K) [PSPermGen: 2520K->2520K(21504K)], 0.0172785 secs] [Times: user=0.01 sys=0.00, real=0.02 secs] 
==================第2次GC结束====================

1
[Full GC [PSYoungGen: 41K->0K(2560K)] [ParOldGen: 5112K->5112K(5120K)] 5153K->5112K(7680K) [PSPermGen: 2520K->2520K(21504K)], 0.0178421 secs] [Times: user=0.03 sys=0.00, real=0.02 secs] 
==================第3次GC结束====================

1
[Full GC [PSYoungGen: 41K->0K(2560K)] [ParOldGen: 5112K->5112K(5120K)] 5153K->5112K(7680K) [PSPermGen: 2520K->2520K(21504K)], 0.0164874 secs] [Times: user=0.01 sys=0.00, real=0.02 secs] 
==================第4次GC结束====================

1
[Full GC [PSYoungGen: 41K->0K(2560K)] [ParOldGen: 5112K->5112K(5120K)] 5153K->5112K(7680K) [PSPermGen: 2520K->2520K(21504K)], 0.0191096 secs] [Times: user=0.05 sys=0.00, real=0.02 secs] 
==================第5次GC结束====================
(一直循环下去)123456789101112131415161718192021
```

  **可以看到在map.put(null,new byte[5\*1024*928]);之后，相应的内存一直没有得到释放**。 
  **通过显式的调用map.remove(null)可以将内存释放掉（如下代码所示）**。

```
    Map<Integer,Object> map = new WeakHashMap<>();
        System.gc();
        System.out.println("===========gc:1=============");
        map.put(null,new byte[4*1024*1024]);
        TimeUnit.SECONDS.sleep(5);
        System.gc();
        System.out.println("===========gc:2=============");
        TimeUnit.SECONDS.sleep(5);
        System.gc();
        System.out.println("===========gc:3=============");
        map.remove(null);
        TimeUnit.SECONDS.sleep(5);
        System.gc();
        System.out.println("===========gc:4=============");1234567891011121314
```

  运行参数：-Xmx5M -XX:+PrintGCDetails 
  运行结果：

```
[GC [PSYoungGen: 720K->504K(2560K)] 720K->544K(6144K), 0.0023652 secs] [Times: user=0.00 sys=0.00, real=0.00 secs] 
[Full GC [PSYoungGen: 504K->0K(2560K)] [ParOldGen: 40K->480K(3584K)] 544K->480K(6144K) [PSPermGen: 2486K->2485K(21504K)], 0.0198023 secs] [Times: user=0.11 sys=0.00, real=0.02 secs] 
===========gc:1=============
[GC [PSYoungGen: 123K->32K(2560K)] 4699K->4608K(7680K), 0.0026722 secs] [Times: user=0.00 sys=0.00, real=0.00 secs] 
[Full GC [PSYoungGen: 32K->0K(2560K)] [ParOldGen: 4576K->4578K(5120K)] 4608K->4578K(7680K) [PSPermGen: 2519K->2519K(21504K)], 0.0145734 secs] [Times: user=0.03 sys=0.00, real=0.01 secs] 
===========gc:2=============
[GC [PSYoungGen: 40K->32K(2560K)] 4619K->4610K(7680K), 0.0013068 secs] [Times: user=0.00 sys=0.00, real=0.00 secs] 
[Full GC [PSYoungGen: 32K->0K(2560K)] [ParOldGen: 4578K->4568K(5120K)] 4610K->4568K(7680K) [PSPermGen: 2519K->2519K(21504K)], 0.0189642 secs] [Times: user=0.06 sys=0.00, real=0.02 secs] 
===========gc:3=============
[GC [PSYoungGen: 40K->32K(2560K)] 4609K->4600K(7680K), 0.0011742 secs] [Times: user=0.00 sys=0.00, real=0.00 secs] 
[Full GC [PSYoungGen: 32K->0K(2560K)] [ParOldGen: 4568K->472K(5120K)] 4600K->472K(7680K) [PSPermGen: 2519K->2519K(21504K)], 0.0175907 secs] [Times: user=0.02 sys=0.00, real=0.02 secs] 
===========gc:4=============
Heap
 PSYoungGen      total 2560K, used 82K [0x00000000ffd00000, 0x0000000100000000, 0x0000000100000000)
  eden space 2048K, 4% used [0x00000000ffd00000,0x00000000ffd14820,0x00000000fff00000)
  from space 512K, 0% used [0x00000000fff80000,0x00000000fff80000,0x0000000100000000)
  to   space 512K, 0% used [0x00000000fff00000,0x00000000fff00000,0x00000000fff80000)
 ParOldGen       total 5120K, used 472K [0x00000000ff800000, 0x00000000ffd00000, 0x00000000ffd00000)
  object space 5120K, 9% used [0x00000000ff800000,0x00000000ff876128,0x00000000ffd00000)
 PSPermGen       total 21504K, used 2526K [0x00000000fa600000, 0x00000000fbb00000, 0x00000000ff800000)
  object space 21504K, 11% used [0x00000000fa600000,0x00000000fa8778f8,0x00000000fbb00000)123456789101112131415161718192021
```

  如果真是只有通过remove的方式去删除null的键所指向的value的话，博主建议在使用WeakHashMap的时候尽量避免使用null作为键。如果有大神可以解答一下这个问题，请在下方留言。

------

参考资料： 
\1. 《[Java引用类型](http://blog.csdn.net/u013256816/article/details/50907595)》 
\2. 《Java程序性能优化——让你的Java程序更快、更稳定》葛一鸣 等编著。







http://blog.csdn.net/u013256816/article/details/50916504