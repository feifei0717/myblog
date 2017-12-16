# ExecutorService中submit和execute的区别

在Java5之后，并发线程这块发生了根本的变化，最重要的莫过于新的启动、调度、管理线程的一大堆API了。在Java5以后，通过Executor来启动线程比用Thread的start()更好。在新特征中，可以很容易控制线程的启动、执行和关闭过程，还可以很容易使用线程池的特性。



##  ExecutorService使用介绍

### **一、创建任务**

 

任务就是一个实现了Runnable接口的类。

创建的时候实run方法即可。

 

### **二、执行任务**

 

通过java.util.concurrent.ExecutorService接口对象来执行任务，该接口对象通过工具类java.util.concurrent.Executors的静态方法来创建。

 

Executors此包中所定义的 Executor、ExecutorService、ScheduledExecutorService、ThreadFactory 和 Callable 类的工厂和实用方法。

 

ExecutorService提供了管理终止的方法，以及可为跟踪一个或多个异步任务执行状况而生成 Future 的方法。 可以关闭 ExecutorService，这将导致其停止接受新任务。关闭后，执行程序将最后终止，这时没有任务在执行，也没有任务在等待执行，并且无法提交新任务。

​            executorService.execute(new TestRunnable());

 

#### 1、创建ExecutorService

通过工具类java.util.concurrent.Executors的静态方法来创建。

Executors此包中所定义的 Executor、ExecutorService、ScheduledExecutorService、ThreadFactory 和 Callable 类的工厂和实用方法。

 

比如，创建一个ExecutorService的实例，ExecutorService实际上是一个线程池的管理工具：

​        ExecutorService executorService = Executors.newCachedThreadPool();

​        ExecutorService executorService = Executors.newFixedThreadPool(3);

​        ExecutorService executorService = Executors.newSingleThreadExecutor();

 

#### 2、将任务添加到线程去执行

当将一个任务添加到线程池中的时候，线程池会为每个任务创建一个线程，该线程会在之后的某个时刻自动执行。

 

### **三、关闭执行服务对象**

​        executorService.shutdown();

 

### **四、综合实例**

 

```
package com.practice.executorService;
import com.google.common.util.concurrent.MoreExecutors;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
/**
 * Created by IntelliJ IDEA.
 *
 * @author leizhimin 2008-11-25 14:28:59
 */
public class TestCachedThreadPool {
    public static void main(String[] args) {
        //                ExecutorService executorService = Executors.newCachedThreadPool();
        ExecutorService executorService = Executors.newFixedThreadPool(5);
        //         ExecutorService executorService = Executors.newSingleThreadExecutor();
        for (int i = 0; i < 5; i++) {
            executorService.execute(new TestRunnable());
            System.out.println("************* a" + (i + 1) + " *************");
        }
        //shutdownNow试图停止当前正执行的task，并返回尚未执行的task的list
        //executorService.shutdownNow();
        //shutdown调用后，不可以再submit新的task，已经submit的将继续执行。
        executorService.shutdown();
        System.out.println("主程序执行完！");
    }
}
class TestRunnable implements Runnable {
    public void run() {
        System.out.println(Thread.currentThread().getName() + " 线程被调用了。");
        while (true) {
            try {
                Thread.sleep(5000);
                System.out.println(Thread.currentThread().getName() + " 线程执行中。。。");
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }
    }
}
```

 

运行结果：

```
************* a1 *************
pool-1-thread-1 线程被调用了。
************* a2 *************
pool-1-thread-2 线程被调用了。
************* a3 *************
pool-1-thread-3 线程被调用了。
************* a4 *************
************* a5 *************
pool-1-thread-5 线程被调用了。
主程序执行完！
pool-1-thread-4 线程被调用了。
pool-1-thread-2 线程执行中。。。
pool-1-thread-1 线程执行中。。。
pool-1-thread-3 线程执行中。。。
pool-1-thread-5 线程执行中。。。
pool-1-thread-4 线程执行中。。。
pool-1-thread-1 线程执行中。。。
pool-1-thread-3 线程执行中。。。
pool-1-thread-2 线程执行中。。。
pool-1-thread-4 线程执行中。。。
pool-1-thread-5 线程执行中。。。
pool-1-thread-3 线程执行中。。。
     ......
```

### 五、获取任务的执行的返回值

在Java5之后，任务分两类：一类是实现了Runnable接口的类，一类是实现了Callable接口的类。两者都可以被ExecutorService执行，但是Runnable任务没有返回值，而Callable任务有返回值。并且Callable的call()方法只能通过ExecutorService的(<T> task) 方法来执行，并且返回一个 <T><T>，是表示任务等待完成的 Future。

 

public interface 

Callable<V>

返回结果并且可能抛出异常的任务。实现者定义了一个不带任何参数的叫做 call 的方法。

类包含一些从其他普通形式转换成 Callable 类的实用方法。

 

 

Callable中的call()方法类似Runnable的run()方法，就是前者有返回值，后者没有。

 

当将一个Callable的对象传递给ExecutorService的submit方法，则该call方法自动在一个线程上执行，并且会返回执行结果Future对象。

 

同样，将Runnable的对象传递给ExecutorService的submit方法，则该run方法自动在一个线程上执行，并且会返回执行结果Future对象，但是在该Future对象上调用get方法，将返回null。

 

遗憾的是，在Java API文档中，这块介绍的很糊涂，估计是翻译人员还没搞清楚的缘故吧。或者说是注释不到位。下面看个例子：

```
package com.practice.executorService;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.*;
/**
 * Callable接口测试
 *
 * @author leizhimin 2008-11-26 9:20:13
 */
public class CallableDemo {
    public static void main(String[] args) {
        //在你的方法第一行加上:
        long starTimeMillis = System.currentTimeMillis();
        ExecutorService executorService = Executors.newCachedThreadPool();
        List<Future<String>> resultList = new ArrayList<Future<String>>();
        //创建10个任务并执行
        for (int i = 0; i < 10; i++) {
            //使用ExecutorService执行Callable类型的任务，并将结果保存在future变量中
            Future<String> future = executorService.submit(new TaskWithResult(i));
            //将任务执行结果存储到List中
            resultList.add(future);
        }
        //遍历任务的结果
        for (Future<String> fs : resultList) {
            try {
                System.out.println(fs.get()); //打印各个线程（任务）执行的结果
            } catch (InterruptedException e) {
                e.printStackTrace();
            } catch (ExecutionException e) {
                e.printStackTrace();
            } finally {
                //启动一次顺序关闭，执行以前提交的任务，但不接受新任务。如果已经关闭，则调用没有其他作用。
                executorService.shutdown();
            }
        }
        System.out.println("主程序执行完！");
        //在最好的一行加上:
        System.out.println("\r<br>执行耗时 : " + (System.currentTimeMillis() - starTimeMillis) / 1000f + "秒");
    }
}
class TaskWithResult implements Callable<String> {
    private int id;
    public TaskWithResult(int id) {
        this.id = id;
    }
    /**
     * 任务的具体过程，一旦任务传给ExecutorService的submit方法，则该方法自动在一个线程上执行。
     *
     * @return
     * @throws Exception
     */
    public String call() throws Exception {
        System.out.println("call()方法被自动调用,干活！！！             " + Thread.currentThread().getName());
        //一个模拟耗时的操作
        Thread.sleep(3000);
        System.out.println("call()方法被自动调用,干完活了！！！             " + Thread.currentThread().getName());
        return "call()方法被自动调用，任务的结果是：" + id + "    " + Thread.currentThread().getName();
    }
}
```

运行结果：

```
call()方法被自动调用,干活！！！             pool-1-thread-1
call()方法被自动调用,干活！！！             pool-1-thread-2
call()方法被自动调用,干活！！！             pool-1-thread-4
call()方法被自动调用,干活！！！             pool-1-thread-6
call()方法被自动调用,干活！！！             pool-1-thread-5
call()方法被自动调用,干活！！！             pool-1-thread-8
call()方法被自动调用,干活！！！             pool-1-thread-9
call()方法被自动调用,干活！！！             pool-1-thread-10
call()方法被自动调用,干活！！！             pool-1-thread-3
call()方法被自动调用,干活！！！             pool-1-thread-7
call()方法被自动调用,干完活了！！！             pool-1-thread-9
call()方法被自动调用,干完活了！！！             pool-1-thread-5
call()方法被自动调用,干完活了！！！             pool-1-thread-1
call()方法被自动调用,干完活了！！！             pool-1-thread-8
call()方法被自动调用，任务的结果是：0    pool-1-thread-1
call()方法被自动调用,干完活了！！！             pool-1-thread-2
call()方法被自动调用,干完活了！！！             pool-1-thread-6
call()方法被自动调用,干完活了！！！             pool-1-thread-4
call()方法被自动调用,干完活了！！！             pool-1-thread-10
call()方法被自动调用，任务的结果是：1    pool-1-thread-2
call()方法被自动调用,干完活了！！！             pool-1-thread-7
call()方法被自动调用,干完活了！！！             pool-1-thread-3
call()方法被自动调用，任务的结果是：2    pool-1-thread-3
call()方法被自动调用，任务的结果是：3    pool-1-thread-4
call()方法被自动调用，任务的结果是：4    pool-1-thread-5
call()方法被自动调用，任务的结果是：5    pool-1-thread-6
call()方法被自动调用，任务的结果是：6    pool-1-thread-7
call()方法被自动调用，任务的结果是：7    pool-1-thread-8
call()方法被自动调用，任务的结果是：8    pool-1-thread-9
call()方法被自动调用，任务的结果是：9    pool-1-thread-10
主程序执行完！
<br>执行耗时 : 3.006秒
```

因为之前一直是用的execute方法，最近有个情况需要用到submit方法，所以研究了下。

## 区别：

### 1、接收的参数不一样

### 2、submit有返回值，而execute没有

Method submit extends base method Executor.execute by creating and returning a Future that can be used to cancel execution and/or wait for completion. 

用到返回值的例子，比如说我有很多个做validation的task，我希望所有的task执行完，然后每个task告诉我它的执行结果，是成功还是失败，如果是失败，原因是什么。然后我就可以把所有失败的原因综合起来发给调用者。

个人觉得cancel execution这个用处不大，很少有需要去取消执行的。

而最大的用处应该是第二点。

### 3、submit方便Exception处理

There is a difference when looking at exception handling. If your tasks throws an exception and if it was submitted with `execute` this exception will go to the uncaught exception handler (when you don't have provided one explicitly, the default one will just print the stack trace to `System.err`). If you submitted the task with `submit` **any** thrown exception, checked or not, is then part of the task's return status. For a task that was submitted with `submit` and that terminates with an exception, the `Future.get` will rethrow this exception, wrapped in an `ExecutionException`.

意思就是如果你在你的task里会抛出checked或者unchecked exception，而你又希望外面的调用者能够感知这些exception并做出及时的处理，那么就需要用到submit，通过捕获Future.get抛出的异常。

比如说，我有很多更新各种数据的task，我希望如果其中一个task失败，其它的task就不需要执行了。那我就需要catch Future.get抛出的异常，然后终止其它task的执行，代码如下：

51cto上有一篇非常好的文章“Java5并发学习”（<http://lavasoft.blog.51cto.com/62575/115112>），下面的代码是基于它之上修改的。

```
package com.practice.executorService;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;
import java.util.concurrent.Callable;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;
public class ExecutorServiceTest {
    public static void main(String[] args) {
        //在你的方法第一行加上:
        long starTimeMillis = System.currentTimeMillis();
        ExecutorService executorService = Executors.newCachedThreadPool();
        List<Future<String>> resultList = new ArrayList<Future<String>>();
        //创建10个任务并执行
        for (int i = 0; i < 10; i++) {
            //使用ExecutorService执行Callable类型的任务，并将结果保存在future变量中
            Future<String> future = executorService.submit(new TaskWithResult2(i));
            //将任务执行结果存储到List中
            resultList.add(future);
        }
        //遍历任务的结果
        for (Future<String> fs : resultList) {
            try {
                System.out.println(fs.get()); //打印各个线程（任务）执行的结果
            } catch (InterruptedException e) {
                e.printStackTrace();
            } catch (ExecutionException e) {
                executorService.shutdownNow();
                e.printStackTrace();
                return;
            } finally {
                //启动一次顺序关闭，执行以前提交的任务，但不接受新任务。如果已经关闭，则调用没有其他作用。
                executorService.shutdown();
            }
        }
        System.out.println("主程序执行完！");
        //在最好的一行加上:
        System.out.println("\r<br>执行耗时 : " + (System.currentTimeMillis() - starTimeMillis) / 1000f + "秒");
    }
}
class TaskWithResult2 implements Callable<String> {
    private int id;
    public TaskWithResult2(int id) {
        this.id = id;
    }
    /**
     * 任务的具体过程，一旦任务传给ExecutorService的submit方法，则该方法自动在一个线程上执行。 
     *
     * @return
     * @throws Exception
     */
    public String call() throws Exception {
        System.out.println("call()方法被自动调用,干活！！！             " + Thread.currentThread().getName());
        if ( Thread.currentThread().getName().equals("pool-1-thread-3"))//运行到线程3抛出异常
            throw new TaskException("Meet error in task." + Thread.currentThread().getName());
        //一个模拟耗时的操作
        Thread.sleep(3000);
        System.out.println("call()方法被自动调用,干完活了！！！             " + Thread.currentThread().getName());
        return "call()方法被自动调用，任务的结果是：" + id + "    " + Thread.currentThread().getName();
    }
}
class TaskException extends Exception {
    public TaskException(String message) {
        super(message);
    }
}
```

```
call()方法被自动调用,干活！！！             pool-1-thread-2
call()方法被自动调用,干活！！！             pool-1-thread-1
call()方法被自动调用,干活！！！             pool-1-thread-3
call()方法被自动调用,干活！！！             pool-1-thread-4
call()方法被自动调用,干活！！！             pool-1-thread-5
call()方法被自动调用,干活！！！             pool-1-thread-6
call()方法被自动调用,干活！！！             pool-1-thread-8
call()方法被自动调用,干活！！！             pool-1-thread-9
call()方法被自动调用,干活！！！             pool-1-thread-10
call()方法被自动调用,干活！！！             pool-1-thread-7
call()方法被自动调用,干完活了！！！             pool-1-thread-1
call()方法被自动调用,干完活了！！！             pool-1-thread-2
call()方法被自动调用，任务的结果是：0    pool-1-thread-1
call()方法被自动调用，任务的结果是：1    pool-1-thread-2
java.util.concurrent.ExecutionException: com.practice.executorService.TaskException: Meet error in task.pool-1-thread-3
	at java.util.concurrent.FutureTask.report(FutureTask.java:122)
	at java.util.concurrent.FutureTask.get(FutureTask.java:188)
	at com.practice.executorService.ExecutorServiceTest.main(ExecutorServiceTest.java:30)
Caused by: com.practice.executorService.TaskException: Meet error in task.pool-1-thread-3
	at com.practice.executorService.TaskWithResult2.call(ExecutorServiceTest.java:65)
	at com.practice.executorService.TaskWithResult2.call(ExecutorServiceTest.java:49)
	at java.util.concurrent.FutureTask.run(FutureTask.java:262)
	at java.util.concurrent.ThreadPoolExecutor.runWorker(ThreadPoolExecutor.java:1145)
	at java.util.concurrent.ThreadPoolExecutor$Worker.run(ThreadPoolExecutor.java:615)
	at java.lang.Thread.run(Thread.java:745)
```

可以看见一旦某个task出错，其它的task就停止执行。

来源： <http://blog.csdn.net/yuzhiboyi/article/details/7775266>