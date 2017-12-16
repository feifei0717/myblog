# ExecutorService对象的shutdown()和shutdownNow()的区别

##  介绍区别

​      从[上篇](http://bijian1013.iteye.com/blog/2281155)文章的实例中，我们用了ExecutorService的shutdown方法，但我们不难发现它还有shutdownNow方法，它们到底有什么区别呢？

​        这两个方法都可以关闭 ExecutorService，这将导致其拒绝新任务。shutdown() 方法在终止前允许执行以前提交的任务，而 shutdownNow() 方法阻止等待任务启动并试图停止当前正在执行的任务。在终止时，执行程序没有任务在执行，也没有任务在等待执行，并且无法提交新任务。应该关闭未使用的 ExecutorService 以允许回收其资源。 

​        下列方法分两个阶段关闭 ExecutorService。第一阶段调用 shutdown 拒绝传入任务，然后调用 shutdownNow（如有必要）取消所有遗留的任务：

```
private static void shutdownAndAwaitTermination(ExecutorService pool) {  
    pool.shutdown(); // Disable new tasks from being submitted  
    try {  
        // Wait a while for existing tasks to terminate  
        if (!pool.awaitTermination(60, TimeUnit.SECONDS)) {  
            pool.shutdownNow(); // Cancel currently executing tasks  
            // Wait a while for tasks to respond to being cancelled  
            if (!pool.awaitTermination(60, TimeUnit.SECONDS))  
                System.err.println("Pool did not terminate");  
        }  
    } catch (InterruptedException ie) {  
        // (Re-)Cancel if current thread also interrupted  
        pool.shutdownNow();  
        // Preserve interrupt status  
        Thread.currentThread().interrupt();  
    }  
}  
```

​        下面我们以[上篇](http://bijian1013.iteye.com/blog/2281155)文章的实例来做测试验证：

## 1.在submit(task2)后shutdown()

```
package com.bijian.study;  
  
import java.util.concurrent.Callable;  
import java.util.concurrent.ExecutorService;  
import java.util.concurrent.Executors;  
import java.util.concurrent.Future;  
  
/**  
 * Callable 和 Future接口 
 * Callable是类似于Runnable的接口，实现Callable接口的类和实现Runnable的类都是可被其它线程执行的任务。 
 * Callable和Runnable有几点不同： 
 * （1）Callable规定的方法是call()，而Runnable规定的方法是run(). 
 * （2）Callable的任务执行后可返回值，而Runnable的任务是不能返回值的。 
 * （3）call()方法可抛出异常，而run()方法是不能抛出异常的。 
 * （4）运行Callable任务可拿到一个Future对象，Future 表示异步计算的结果。它提供了检查计算是否完成的方法，以等待计算的完成，并检索计算的结果。通过Future对象可了解任务执行情况，可取消任务的执行，还可获取任务执行的结果。 
 */  
public class CallableAndFuture {  
  
    public static class MyCallable implements Callable {  
  
        private int flag = 0;  
  
        public MyCallable(int flag) {  
            this.flag = flag;  
        }  
  
        public String call() throws Exception {  
  
            if (this.flag == 0) {  
                return "flag = 0";  
            }  
            if (this.flag == 1) {  
                try {  
                    while (true) {  
                        System.out.println("looping.");  
                        Thread.sleep(2000);  
                    }  
                } catch (InterruptedException e) {  
                    System.out.println("Interrupted");  
                }  
                return "false";  
            } else {  
                throw new Exception("Bad flag value!");  
            }  
        }  
    }  
  
    public static void main(String[] args) {  
  
        // 定义3个Callable类型的任务  
        MyCallable task1 = new MyCallable(0);  
        MyCallable task2 = new MyCallable(1);  
        MyCallable task3 = new MyCallable(2);  
  
        // 创建一个执行任务的服务  
        ExecutorService es = Executors.newFixedThreadPool(3);  
        try {  
            // 提交并执行任务，任务启动时返回了一个Future对象，  
            // 如果想得到任务执行的结果或者是异常可对这个Future对象进行操作  
            Future future1 = es.submit(task1);  
            // 获得第一个任务的结果，如果调用get方法，当前线程会等待任务执行完毕后才往下执行  
            System.out.println("task1: " + future1.get());  
  
            Future future2 = es.submit(task2);  
              
            es.shutdown();  
              
            // 等待5秒后，再停止第二个任务。因为第二个任务进行的是无限循环  
            Thread.sleep(5000);  
            System.out.println("task2 cancel: " + future2.cancel(true));  
              
            // 获取第三个任务的输出，因为执行第三个任务会引起异常  
            // 所以下面的语句将引起异常的抛出  
            Future future3 = es.submit(task3);  
            System.out.println("task3: " + future3.get());  
        } catch (Exception e) {  
            System.out.println(e.toString());  
        }  
        // 停止任务执行服务  
        //es.shutdown();  
    }  
}  
```

​        运行结果：

```
task1: flag = 0  
looping.  
looping.  
looping.  
task2 cancel: true  
java.util.concurrent.RejectedExecutionException  
Interrupted 
```

 

## 2.在submit(task2)后shutdownNow()

Java代码  

```
package com.bijian.study;  
  
import java.util.concurrent.Callable;  
import java.util.concurrent.ExecutorService;  
import java.util.concurrent.Executors;  
import java.util.concurrent.Future;  
  
/**  
 * Callable 和 Future接口 
 * Callable是类似于Runnable的接口，实现Callable接口的类和实现Runnable的类都是可被其它线程执行的任务。 
 * Callable和Runnable有几点不同： 
 * （1）Callable规定的方法是call()，而Runnable规定的方法是run(). 
 * （2）Callable的任务执行后可返回值，而Runnable的任务是不能返回值的。 
 * （3）call()方法可抛出异常，而run()方法是不能抛出异常的。 
 * （4）运行Callable任务可拿到一个Future对象，Future 表示异步计算的结果。它提供了检查计算是否完成的方法，以等待计算的完成，并检索计算的结果。通过Future对象可了解任务执行情况，可取消任务的执行，还可获取任务执行的结果。 
 */  
public class CallableAndFuture {  
  
    public static class MyCallable implements Callable {  
  
        private int flag = 0;  
  
        public MyCallable(int flag) {  
            this.flag = flag;  
        }  
  
        public String call() throws Exception {  
  
            if (this.flag == 0) {  
                return "flag = 0";  
            }  
            if (this.flag == 1) {  
                try {  
                    while (true) {  
                        System.out.println("looping.");  
                        Thread.sleep(2000);  
                    }  
                } catch (InterruptedException e) {  
                    System.out.println("Interrupted");  
                }  
                return "false";  
            } else {  
                throw new Exception("Bad flag value!");  
            }  
        }  
    }  
  
    public static void main(String[] args) {  
  
        // 定义3个Callable类型的任务  
        MyCallable task1 = new MyCallable(0);  
        MyCallable task2 = new MyCallable(1);  
        MyCallable task3 = new MyCallable(2);  
  
        // 创建一个执行任务的服务  
        ExecutorService es = Executors.newFixedThreadPool(3);  
        try {  
            // 提交并执行任务，任务启动时返回了一个Future对象，  
            // 如果想得到任务执行的结果或者是异常可对这个Future对象进行操作  
            Future future1 = es.submit(task1);  
            // 获得第一个任务的结果，如果调用get方法，当前线程会等待任务执行完毕后才往下执行  
            System.out.println("task1: " + future1.get());  
  
            Future future2 = es.submit(task2);  
              
            es.shutdownNow();  
              
            // 等待5秒后，再停止第二个任务。因为第二个任务进行的是无限循环  
            Thread.sleep(5000);  
            System.out.println("task2 cancel: " + future2.cancel(true));  
              
            // 获取第三个任务的输出，因为执行第三个任务会引起异常  
            // 所以下面的语句将引起异常的抛出  
            Future future3 = es.submit(task3);  
            System.out.println("task3: " + future3.get());  
        } catch (Exception e) {  
            System.out.println(e.toString());  
        }  
        // 停止任务执行服务  
        //es.shutdown();  
    }  
}  
```

​        运行结果：

```
task1: flag = 0  
looping.  
Interrupted  
task2 cancel: false  
java.util.concurrent.RejectedExecutionException  
```

​        

## 3.在submit(task2)后shutdownAndAwaitTermination()

当然，我们也可以分两个阶段关闭 ExecutorService。第一阶段调用 shutdown 拒绝传入任务，然后调用 shutdownNow（如有必要）取消所有遗留的任务。修改此实例如下：

Java代码  

```
package com.bijian.study;  
  
import java.util.concurrent.Callable;  
import java.util.concurrent.ExecutorService;  
import java.util.concurrent.Executors;  
import java.util.concurrent.Future;  
import java.util.concurrent.TimeUnit;  
  
/**  
 * Callable 和 Future接口 
 * Callable是类似于Runnable的接口，实现Callable接口的类和实现Runnable的类都是可被其它线程执行的任务。 
 * Callable和Runnable有几点不同： 
 * （1）Callable规定的方法是call()，而Runnable规定的方法是run(). 
 * （2）Callable的任务执行后可返回值，而Runnable的任务是不能返回值的。 
 * （3）call()方法可抛出异常，而run()方法是不能抛出异常的。 
 * （4）运行Callable任务可拿到一个Future对象，Future 表示异步计算的结果。它提供了检查计算是否完成的方法，以等待计算的完成，并检索计算的结果。通过Future对象可了解任务执行情况，可取消任务的执行，还可获取任务执行的结果。 
 */  
public class CallableAndFuture {  
  
    public static class MyCallable implements Callable {  
  
        private int flag = 0;  
  
        public MyCallable(int flag) {  
            this.flag = flag;  
        }  
  
        public String call() throws Exception {  
  
            if (this.flag == 0) {  
                return "flag = 0";  
            }  
            if (this.flag == 1) {  
                try {  
                    while (true) {  
                        System.out.println("looping.");  
                        Thread.sleep(2000);  
                    }  
                } catch (InterruptedException e) {  
                    System.out.println("Interrupted");  
                }  
                return "false";  
            } else {  
                throw new Exception("Bad flag value!");  
            }  
        }  
    }  
  
    public static void main(String[] args) {  
  
        // 定义3个Callable类型的任务  
        MyCallable task1 = new MyCallable(0);  
        MyCallable task2 = new MyCallable(1);  
        MyCallable task3 = new MyCallable(2);  
  
        // 创建一个执行任务的服务  
        ExecutorService es = Executors.newFixedThreadPool(3);  
        try {  
            // 提交并执行任务，任务启动时返回了一个Future对象，  
            // 如果想得到任务执行的结果或者是异常可对这个Future对象进行操作  
            Future future1 = es.submit(task1);  
            // 获得第一个任务的结果，如果调用get方法，当前线程会等待任务执行完毕后才往下执行  
            System.out.println("task1: " + future1.get());  
  
            Future future2 = es.submit(task2);  
              
            shutdownAndAwaitTermination(es);  
              
            // 等待5秒后，再停止第二个任务。因为第二个任务进行的是无限循环  
            Thread.sleep(5000);  
            System.out.println("task2 cancel: " + future2.cancel(true));  
              
            // 获取第三个任务的输出，因为执行第三个任务会引起异常  
            // 所以下面的语句将引起异常的抛出  
            Future future3 = es.submit(task3);  
            System.out.println("task3: " + future3.get());  
        } catch (Exception e) {  
            System.out.println(e.toString());  
        }  
        // 停止任务执行服务  
        //es.shutdown();  
          
    }  
      
    private static void shutdownAndAwaitTermination(ExecutorService pool) {  
        pool.shutdown(); // Disable new tasks from being submitted  
        try {  
            // Wait a while for existing tasks to terminate  
            if (!pool.awaitTermination(10, TimeUnit.SECONDS)) {  
                pool.shutdownNow(); // Cancel currently executing tasks  
                // Wait a while for tasks to respond to being cancelled  
                if (!pool.awaitTermination(10, TimeUnit.SECONDS))  
                    System.err.println("Pool did not terminate");  
            }  
        } catch (InterruptedException ie) {  
            // (Re-)Cancel if current thread also interrupted  
            pool.shutdownNow();  
            // Preserve interrupt status  
            Thread.currentThread().interrupt();  
        }  
    }  
}  
```

​        运行结果：

```
task1: flag = 0  
looping.  
looping.  
looping.  
looping.  
looping.  
looping.  
Interrupted  
task2 cancel: false  
java.util.concurrent.RejectedExecutionException
```







http://bijian1013.iteye.com/blog/2281156