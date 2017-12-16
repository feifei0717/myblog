# Java 特殊队列之阻塞队列.延迟队列.传输队列

由 rowline 创建，小路依依 最后一次修改 2017-01-09

## 阻塞队列

阻塞队列通过添加两组方法来扩展队列:

- 一组方法无限期地阻塞
- 另一组方法允许您指定要阻止的时间段。

`BlockingQueue`接口的实例表示阻塞队列。`BlockingQueue`接口继承自`Queue`接口。

`put()`和`offer()`方法在阻塞队列的尾部添加一个元素。如果阻塞队列已满，则put()方法将无限期阻塞，直到队列中的空间可用。offer()方法允许您指定等待空间可用的时间段。 如果指定的元素添加成功，则返回true; 否则为假。

take()和poll()方法检索和删除阻塞队列的头。如果阻塞队列为空，take()方法将无限期阻塞。poll()方法允许您指定在阻塞队列为空时要等待的时间段; 如果在元素可用之前过去了指定的时间，则返回null。

来自`BlockingQueue`中`Queue`接口的方法就像使用`Queue`。

`BlockingQueue`被设计为线程安全的并且可以使用在生产者/消费者的情况下。

阻塞队列不允许空元素和可以是有界的或无界的。

`BlockingQueue`中的`remainingCapacity()`返回可以添加到阻止队列中而不阻塞的元素数。

`BlockingQueue`可以控制多个线程被阻塞时的公平性。 如果阻塞队列是公平的，它可以选择最长的等待线程来执行操作。如果阻塞队列不公平，则不指定选择的顺序。

`BlockingQueue`接口及其所有实现类都在`java.util.concurrent`包中。 以下是`BlockingQueue`接口的实现类:

由数组支持的`ArrayBlockingQueue`是`BlockingQueue`的有界实现类。 我们可以在其构造函数中指定阻塞队列的公平性。 默认情况下，它不公平。

`LinkedBlockingQueue`可以用作有界或无界阻塞队列。 它不允许为阻塞队列指定公平规则。

`PriorityBlockingQueue`是`BlockingQueue`的无界实现类。 它的工作方式与`PriortyQueue`相同，用于排序阻塞队列中的元素，并将阻塞特性添加到`PriorityQueue`中。

`SynchronousQueue`实现`BlockingQueue`，没有任何容量。 put操作等待take操作以获取元素。 它可以在两个线程之间进行握手，并在两个线程之间交换对象。 它的isEmpty()方法总是返回true。

DelayQueue是BlockingQueue的无界实现类。它保持一个元素，直到该元素经过指定的延迟。 如果有超过一个元素的延迟已经过去，那么其延迟最早传递的元素将被放置在队列的头部。

### 生产者/消费者应用程序中使用阻塞队列例子

以下代码显示了如何在生产者/消费者应用程序中使用阻塞队列。

```

import java.util.UUID;
import java.util.concurrent.ArrayBlockingQueue;
import java.util.concurrent.BlockingQueue;

/**
 * <B>Description:</B> 生产者/消费者应用程序中使用阻塞队列 <br>
 * <B>Create on:</B> 2017/10/29 上午11:04 <br>
 *
 * @author xiangyu.ye
 * @version 1.0
 */
public class BlockingQueueTest {
    public static void main(String[] args) {
        int capacity = 5;
        boolean fair = true;
        BlockingQueue<String> queue = new ArrayBlockingQueue<>(capacity, fair);

        new BQProducer(queue, "Producer1").start();
        new BQProducer(queue, "Producer2").start();
        new BQProducer(queue, "Producer3").start();
        new BQConsumer(queue, "Consumer1").start();
        new BQConsumer(queue, "Consumer2").start();
    }
}



class BQProducer extends Thread {
    private final BlockingQueue<String> queue;
    private final String name;
    public BQProducer(BlockingQueue<String> queue, String name) {
        this.queue = queue;
        this.name = name;
    }
    @Override
    public void run() {
        while (true) {
            try {
                this.queue.put(UUID.randomUUID().toString());
                Thread.sleep(4000);
            }
            catch (InterruptedException e) {
                e.printStackTrace();
                break;
            }
        }
    }
}
class BQConsumer extends Thread {
    private final BlockingQueue<String> queue;
    private final String name;
    public BQConsumer(BlockingQueue<String> queue, String name) {
        this.queue = queue;
        this.name = name;
    }

    @Override
    public void run() {
        while (true) {
            try {
                String str = this.queue.take();
                System.out.println(name + "  took: " + str);
                Thread.sleep(3000);
            } catch (InterruptedException e) {
                e.printStackTrace();
                break;
            }
        }
    }
}
```

上面的代码生成以下结果。

```
Consumer1  took: acb8149c-f586-476e-b720-b8bd8205a5ed
Consumer2  took: 156bb01b-c60f-43d3-95bb-3bf793af0966
Consumer2  took: 677b7431-fab3-47ef-8214-6a85b22eb354
Consumer1  took: 4cb3746c-3b61-489d-82e0-21fc0504998b
Consumer2  took: d06afe7c-d34f-4430-8b11-5fa1e5eaf85f
Consumer1  took: b6d21866-5665-4c86-8d6a-1cf110421a43
Consumer2  took: 09058449-701c-4865-bd84-402d8d47f6dd
...
```



## 延迟队列

`DelayQueue`实现`BlockingQueue`接口。`DelayQueue`中的元素必须保留一定的时间。

`DelayQueue`使用一个名为`Delayed`的接口来获取延迟时间。

该接口在java.util.concurrent包中。 其声明如下：

```
public interface  Delayed  extends Comparable<Delayed>  {
   long  getDelay(TimeUnit timeUnit);
}

```

它扩展了`Comparable`接口，它的`compareTo()`方法接受一个Delayed对象。

`DelayQueue`调用每个元素的`getDelay()`方法来获取元素必须保留多长时间。 `DelayQueue`将传递`TimeUnit`到此方法。

当`getDelay()`方法返回一个零或一个负数时，是元素离开队列的时间。

队列通过调用元素的`compareTo()`方法确定要弹出的那个。 此方法确定要从队列中删除的过期元素的优先级。

以下代码显示了如何使用DelayQueue。

```
package com.practice.queue.delayqueue;

import java.sql.Date;
import java.time.Instant;
import java.util.concurrent.BlockingQueue;
import java.util.concurrent.DelayQueue;
import java.util.concurrent.Delayed;
import java.util.concurrent.TimeUnit;
import static java.time.temporal.ChronoUnit.MILLIS;
import static java.util.concurrent.TimeUnit.MILLISECONDS;


/**
 * <B>Description:</B> 延迟队列 <br>
 * <B>Create on:</B> 2017/10/29 上午11:10 <br>
 *
 * @author xiangyu.ye
 * @version 1.0
 */
public class DelayQueueTest {
    public static void main(String[] args) throws InterruptedException {
        BlockingQueue<DelayedJob> queue = new DelayQueue<>();
        Instant now = Instant.now();

        queue.put(new DelayedJob("A", now.plusSeconds(9)));
        queue.put(new DelayedJob("B", now.plusSeconds(3)));
        queue.put(new DelayedJob("C", now.plusSeconds(6)));
        queue.put(new DelayedJob("D", now.plusSeconds(1)));

        while (queue.size() > 0) {
            System.out.println("started...");
            DelayedJob job = queue.take();
            System.out.println("Job: " + job);
        }
        System.out.println("Finished.");
    }
}

class DelayedJob implements Delayed {
    private Instant scheduledTime;
    String jobName;

    public DelayedJob(String jobName, Instant scheduledTime) {
        this.scheduledTime = scheduledTime;
        this.jobName = jobName;
    }

    @Override
    public long getDelay(TimeUnit unit) {
        long delay = MILLIS.between(Instant.now(), scheduledTime);
        long returnValue = unit.convert(delay, MILLISECONDS);
        return returnValue;
    }

    @Override
    public int compareTo(Delayed job) {
        long currentJobDelay = this.getDelay(MILLISECONDS);
        long jobDelay = job.getDelay(MILLISECONDS);

        int diff = 0;
        if (currentJobDelay > jobDelay) {
            diff = 1;
        } else if (currentJobDelay < jobDelay) {
            diff = -1;
        }
        return diff;
    }

    @Override
    public String toString() {
        String str = this.jobName + ", " + "Scheduled Time:  "
                + java.util.Date.from(this.scheduledTime).toLocaleString();
        return str;
    }
}
```

上面的代码生成以下结果。

```
started...
Job: D, Scheduled Time:  2017-10-29 11:20:44
started...
Job: B, Scheduled Time:  2017-10-29 11:20:46
started...
Job: C, Scheduled Time:  2017-10-29 11:20:49
started...
Job: A, Scheduled Time:  2017-10-29 11:20:52
Finished.
```



## 传输队列

传输队列扩展阻塞队列。

生产者使用`TransferQueue`的`transfer(E element)`方法将元素传递给消费者。

当生产者调用传递（E元素）方法时，它等待直到消费者获取其元素。 tryTransfer()方法提供了该方法的非阻塞和超时版本。

`getWaitingConsumerCount()`方法返回等待消费者的数量。

如果有一个等待消费者，`hasWaitingConsumer()`方法返回true; 否则，返回false。`LinkedTransferQueue`是`TransferQueue`接口的实现类。 它提供了一个无界的`TransferQueue`。

以下代码显示如何使用`TransferQueue`。

```
import java.util.concurrent.LinkedTransferQueue;
import java.util.concurrent.TransferQueue;
import java.util.concurrent.atomic.AtomicInteger;

class TQProducer extends Thread {
  private String name;
  private TransferQueue<Integer> tQueue;
  private AtomicInteger sequence;
  public TQProducer(String name, TransferQueue<Integer> tQueue,
      AtomicInteger sequence) {
    this.name = name;
    this.tQueue = tQueue;
    this.sequence = sequence;
  }

  @Override
  public void run() {
    while (true) {
      try {
        Thread.sleep(4000);
        int nextNum = this.sequence.incrementAndGet();
        if (nextNum % 2 == 0) {
          System.out.format("%s:  Enqueuing: %d%n", name, nextNum);
          tQueue.put(nextNum); // Enqueue
        } else {
          System.out.format("%s: Handing  off: %d%n", name, nextNum);
          System.out.format("%s: has  a  waiting  consumer: %b%n", name,
              tQueue.hasWaitingConsumer());
          tQueue.transfer(nextNum); // A hand off
        }
      } catch (InterruptedException e) {
        e.printStackTrace();
      }
    }
  }
}

class TQConsumer extends Thread {
  private final String name;
  private final TransferQueue<Integer> tQueue;

  public TQConsumer(String name, TransferQueue<Integer> tQueue) {
    this.name = name;
    this.tQueue = tQueue;
  }

  @Override
  public void run() {
    while (true) {
      try {
        Thread.sleep(3000);

        int item = tQueue.take();
        System.out.format("%s removed:  %d%n", name, item);

      }
      catch (InterruptedException e) {
        e.printStackTrace();
      }
    }
  }
}

public class Main {
  public static void main(String[] args) {
    final TransferQueue<Integer> tQueue = new LinkedTransferQueue<>();
    final AtomicInteger sequence = new AtomicInteger();

    for (int i = 0; i < 5; i++) {
      try {
        tQueue.put(sequence.incrementAndGet());
        System.out.println("Initial queue: " + tQueue);

        new TQProducer("Producer-1", tQueue, sequence).start();
        new TQConsumer("Consumer-1", tQueue).start();

      } catch (InterruptedException e) {
        e.printStackTrace();
      }
    }

  }
}

```

上面的代码生成以下结果。

```
Initial queue: [1]
Initial queue: [1, 2]
Initial queue: [1, 2, 3]
Initial queue: [1, 2, 3, 4]
Initial queue: [1, 2, 3, 4, 5]
Consumer-1 removed:  1
Producer-1:  Enqueuing: 6
Consumer-1 removed:  3
Consumer-1 removed:  5
Consumer-1 removed:  4
Consumer-1 removed:  2
Consumer-1 removed:  6
Producer-1:  Enqueuing: 8
Producer-1: Handing  off: 7
Producer-1:  Enqueuing: 10
Producer-1: Handing  off: 9
Producer-1: has  a  waiting  consumer: false
Producer-1: has  a  waiting  consumer: false
Producer-1: Handing  off: 11
Producer-1: has  a  waiting  consumer: false
Consumer-1 removed:  8
Consumer-1 removed:  10
Consumer-1 removed:  7
Consumer-1 removed:  9
Consumer-1 removed:  11
Producer-1: Handing  off: 13
Producer-1: has  a  waiting  consumer: false
Producer-1:  Enqueuing: 12
Consumer-1 removed:  12
Consumer-1 removed:  13
Producer-1: Handing  off: 15
Producer-1: has  a  waiting  consumer: true
Producer-1:  Enqueuing: 14
Consumer-1 removed:  15
Consumer-1 removed:  14
Producer-1:  Enqueuing: 16
Consumer-1 removed:  16
Producer-1: Handing  off: 17
Producer-1: has  a  waiting  consumer: true
Consumer-1 removed:  17
Producer-1:  Enqueuing: 18
Consumer-1 removed:  18
Producer-1: Handing  off: 19
Producer-1: has  a  waiting  consumer: true
Producer-1:  Enqueuing: 20
Consumer-1 removed:  19
Consumer-1 removed:  20
Producer-1: Handing  off: 21
Producer-1: has  a  waiting  consumer: true
Consumer-1 removed:  21
Producer-1:  Enqueuing: 22
Consumer-1 removed:  22
Producer-1: Handing  off: 23
Producer-1: has  a  waiting  consumer: true
Consumer-1 removed:  23
Producer-1:  Enqueuing: 24
Producer-1: Handing  off: 25
Producer-1: has  a  waiting  consumer: true
Consumer-1 removed:  24
Consumer-1 removed:  25
Producer-1:  Enqueuing: 26
Consumer-1 removed:  26
Producer-1: Handing  off: 27
Producer-1: has  a  waiting  consumer: true
Consumer-1 removed:  27
Producer-1:  Enqueuing: 28
Consumer-1 removed:  28
Producer-1:  Enqueuing: 30
Producer-1: Handing  off: 29
Producer-1: has  a  waiting  consumer: true
Consumer-1 removed:  30
Consumer-1 removed:  29
Producer-1: Handing  off: 31
Producer-1: has  a  waiting  consumer: true
Consumer-1 removed:  31
```





https://www.w3cschool.cn/java/java-special-queues.html