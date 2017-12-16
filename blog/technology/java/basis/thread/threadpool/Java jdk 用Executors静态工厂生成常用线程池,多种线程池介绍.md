# Java jdk 用Executors静态工厂生成常用线程池,多种线程池介绍

## **一： newSingleThreadExecutor**

创建一个单线程的线程池，以无界队列方式运行。这个线程池只有一个线程在工作（如果这个唯一的线程因为异常结束，那么会有一个新的线程来替代它。）此线程池能够保证所有任务的执行顺序按照任务的提交顺序执行，同一时段只有一个任务在运行。

此类型线程池特别适合于需要保证执行顺序的场合。



```

/**
 * <B>Description:</B> jdk线程使用示例 <br>
 * <B>Create on:</B> 2017/10/28 上午11:38 <br>
 *
 * @author xiangyu.ye
 * @version 1.0
 */
public class JdkThreadPoolUseDemo {

    public static void main(String[] args) {
        // 创建线程池
        //ExecutorService threadPool = Executors.newSingleThreadExecutor();
        //ExecutorService threadPool = Executors.newFixedThreadPool(3);
        ExecutorService threadPool = Executors.newCachedThreadPool();

        // 向线程池里面扔任务
        for (int i = 0; i < 4; i++) {
            threadPool.execute(new MyThread("task" + i));
        }

        // 关闭线程池
        threadPool.shutdown();
    }
}

class MyThread implements Runnable {
    private String name;

    public MyThread(String name) {
        this.name = name;
    }

    @Override
    public void run() {
        for (int i = 0; i < 2; i++) {
            // 做点事情
            try {
                Thread.sleep(100);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
            System.out.println("任务名称:"+name + " ,执行任务的线程名称:" + Thread.currentThread().getName() + " ,said:" + i);
        }
    }
}
```



**void execute(Runnable command):**

在未来某个时间执行给定命令。该命令可能在新的线程、已入池的线程或者正调用的线程中执行，这由Executor决定。

**void shutdown():**

启动一次顺序关闭，执行以前提交的任务，但不接受新任务。如果已经关闭，则调用没有其它作用。

**输出：**

Thread0 said:0
Thread0 said:1
Thread1 said:0
Thread1 said:1
Thread2 said:0
Thread2 said:1
Thread3 said:0
Thread3 said:1

## 二：**newFixedThreadPool**

创建固定大小的线程池，以无界队列方式运行。线程池满且线程都为活动状态的时候如果有新任务提交进来，它们会等待直到有线程可用。线程池的大小一旦达到最大值就会保持不变，如果某个线程因为执行异常而结束，那么线程池会补充一个新线程。显式调用shutdown将关闭线程池。

此类型线程池比较符合常用场合。

更改注释以使得上面的示范代码中下述这代码可用：

```
ExecutorService threadPool = Executors.newFixedThreadPool(2);
```

**输出：**

Thread0 said:0
Thread1 said:0
Thread0 said:1
Thread1 said:1
Thread2 said:0
Thread3 said:0
Thread3 said:1
Thread2 said:1

## **三：newCachedThreadPool**

创建一个可缓存的线程池。必要的时候创建新线程来处理请求，也会重用线程池中已经处于可用状态的线程。如果线程池的大小超过了处理任务所需要的线程，那么就会回收部分空闲（60秒不执行任务）的线程；当任务数增加时，此线程池又可以智能的添加新线程来处理任务。此线程池不会对线程池大小做限制，线程池大小完全依赖于操作系统（或者说JVM）能够创建的最大线程大小。

此类型线程池特别适合于耗时短，不需要考虑同步的场合。

更改注释以使得上面的示范代码中下述这代码可用：

```
ExecutorService threadPool = Executors.newCachedThreadPool();
```

**输出：**

Thread0 said:0
Thread2 said:0
Thread3 said:0
Thread1 said:0
Thread0 said:1
Thread2 said:1
Thread3 said:1
Thread1 said:1

## 四：**newScheduledThreadPool**

创建可定时运行（初始延时），运行频率（每隔多长时间运行，还是运行成功一次之后再隔多长时间再运行）的线程池。

此类型线程池适合定时以及周期性执行任务的场合。

```
package com.clzhang.sample.thread;

import java.util.*;
import java.text.SimpleDateFormat;

import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

public class ThreadPoolTest2 {
    // 格式化时间private static SimpleDateFormat MY_SDF = new SimpleDateFormat("mm:ss");

    static class MyThread implements Runnable {
        @Override
        public void run() {
            // 做点事情try {
                Thread.sleep(1000);

                System.out.println("[" + MY_SDF.format(new Date()) + "]finished job!");
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }
    }

    public static void main(String[] args) {
        // 创建线程池
        ScheduledExecutorService schedulePool = Executors.newScheduledThreadPool(1);
        System.out.println("[" + MY_SDF.format(new Date()) + "]starting...");

// 初始延迟2秒后，只运行一次
         schedulePool.schedule(new MyThread(), 2, TimeUnit.SECONDS);
        // 只运行一次，可以关闭池；下面的两种方式（scheduleAtFixedRate/scheduleWithFixedDelay）则不可以关闭线程池！         schedulePool.shutdown();

// 初始延迟2秒后，每间隔3秒运行一次线程
//        schedulePool.scheduleAtFixedRate(new MyThread(), 2, 3, TimeUnit.SECONDS);

        // 初始延迟2秒后，每运行成功后再等3秒运行一次线程
//        schedulePool.scheduleWithFixedDelay(new MyThread(), 2, 3, TimeUnit.SECONDS);
    }
}
```



**三个片段分别运行后的输出：**
[04:48]starting...
[04:51]finished job!　　　　　　// 延时2秒后启动线程

\-------------------------------------

[06:14]starting...
[06:17]finished job!　　　　　　// 初始延时2秒后启动线程
[06:20]finished job!　　　　　　// 每隔3秒运行一次线程
[06:23]finished job!
......

\-------------------------------------

[06:56]starting...
[06:59]finished job!　　　　　　// 初始延时2秒后启动线程
[07:03]finished job!　　　　　　// 上次线程运行成功后再等3秒再次启动
[07:07]finished job!
......

来源： <http://www.cnblogs.com/nayitian/p/3261678.html>