# Java 队列入门介绍

由 rowline 创建，小路依依 最后一次修改 2017-01-09

## Java集合教程 - Java队列

队列是只能在其上执行操作的对象的集合两端的队列。

队列有两个末端，称为头和尾。

在简单队列中，对象被添加到尾部并从头部删除并首先删除首先添加的对象。

Java Collections Framework支持以下类型的队列。

- 简单的队列允许在尾部插入和从头部移除。
- 优先级队列为每个元素分配优先级，并允许从队列中删除具有最高优先级的元素。
- 延迟队列向每个元素添加延迟，并仅在其延迟已过去时删除该元素。
- 双端队列允许其元件从头部和尾部插入和移除。
- 阻塞队列阻塞线程，当线程已满时向其添加元素，当线程为空时，它阻止线程从中删除元素。
- 传输队列是阻塞队列，其中对象的切换发生在生产者线程和消费者线程之间。
- 阻塞双端队列是双端队列和阻塞队列的组合。

## 简单队列

简单队列由`Queue`接口的实例表示。

队列允许您执行三个基本操作:

- 从尾部添加元素
- 从其头部移除元素
- 在元素顶部审查

Queue接口为三个操作中的每一个定义了两个方法。如果操作不可能，一个方法抛出异常，另一个方法方法返回false或null以指示失败。

| 方法                 | 描述                                       |
| ------------------ | ---------------------------------------- |
| boolean add(E e)   | 如果可能，向队列中添加一个元素。否则，它抛出异常。                |
| boolean offer(E e) | 如果不能添加元素，则将元素添加到队列中，而不抛出异常。 它在失败时返回false，在成功时返回true。 |
| E remove()         | 删除队列的头。如果队列为空，它会抛出异常。此方法返回已移除的项目。        |
| E poll()           | 从队列中删除元素。如果队列为空而不是抛出异常，则返回null。          |
| Eelement()         | 偷看队列的头，而不从队列中删除它。 如果队列为空，它会抛出异常。         |
| E peek()           | 查看队列，如果队列为空而不是抛出异常，则返回null。              |

LinkedList和PriorityQueue是Queue接口的两个实现类。LinkedList还实现了List接口。

[Queue APIs](https://www.w3cschool.cn/java.util/Queue/index.html)

[LinkedList APIs](https://www.w3cschool.cn/java.util/LinkedList/index.html)

[Stack APIs](https://www.w3cschool.cn/java.util/Stack/index.html)

## 例子

/Users/jerryye/backup/studio/AvailableCode/basis/thread_queue/thread_demo/src/main/java/com/practice/queue/LinkedListQueueTest.java

以下代码显示如何将链表用作FIFO队列。

```

import java.util.LinkedList;
import java.util.NoSuchElementException;
import java.util.Queue;

/**
 * <B>Description:</B> LinkedList 队列测试demo <br>
 * <B>Create on:</B> 2017/10/28 下午4:28 <br>
 *
 * @author xiangyu.ye
 * @version 1.0
 */
public class LinkedListQueueTest {
    public static void main(String[] args) {
        Queue<String> queue = new LinkedList<>();
        queue.add("Java");
        // offer() will work the same as add()
        queue.offer("SQL");
        queue.offer("CSS");
        queue.offer("XML");

        System.out.println("Queue: " + queue);

        // Let"s remove elements until the queue is empty
        while (queue.peek() != null) {
            System.out.println("Head  Element: " + queue.peek());
            queue.remove();
            System.out.println("Removed one  element from  Queue");
            System.out.println("Queue: " + queue);
        }
        System.out.println("queue.isEmpty(): " + queue.isEmpty());
        System.out.println("queue.peek(): " + queue.peek());
        System.out.println("queue.poll(): " + queue.poll());
        try {
            String str = queue.element();
            System.out.println("queue.element(): " + str);
            str = queue.remove();
            System.out.println("queue.remove(): " + str);
        } catch (NoSuchElementException e) {
            System.out.println("queue.remove(): Queue is  empty.");
        }
    }
}
```

上面的代码生成以下结果。

```
Queue: [Java, SQL, CSS, XML]
Head  Element: Java
Removed one  element from  Queue
Queue: [SQL, CSS, XML]
Head  Element: SQL
Removed one  element from  Queue
Queue: [CSS, XML]
Head  Element: CSS
Removed one  element from  Queue
Queue: [XML]
Head  Element: XML
Removed one  element from  Queue
Queue: []
queue.isEmpty(): true
queue.peek(): null
queue.poll(): null
queue.remove(): Queue is  empty.
```





https://www.w3cschool.cn/java/java-queue.html