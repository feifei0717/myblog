# Java 双端队列

由 rowline 创建，小路依依 最后一次修改 2017-01-09

/Users/jerryye/backup/studio/AvailableCode/basis/thread_queue/thread_demo

## 介绍

双端队列或deque扩展队列以允许元件从两端插入和移除。

`Deque`类的实例表示双端队列。`Deque`接口扩展了`Queue`接口。

它声明了方便所有操作的其他方法对于头部以及尾部的队列。它可以用作FIFO队列或LIFO队列。

ArrayDeque和LinkedList类是Deque接口的两个实现类。

`ArrayDeque`类由数组支持，而`LinkedList`类由链表支持。

如果您使用Deque作为堆栈，则应该使用`ArrayDeque`作为`Deque`实现。

如果使用`Deque`作为FIFO队列，`LinkedList`

以下代码显示如何使用`Deque`作为FIFO队列。

## LinkedList 实现双端队列例子

```

import java.util.Deque;
import java.util.LinkedList;

/**
 * <B>Description:</B> LinkedList 双端队列 <br>
 * <B>Create on:</B> 2017/10/29 上午10:38 <br>
 *
 * @author xiangyu.ye
 * @version 1.0
 */
public class LinkedListDequeTest {
    public static void main(String[] args) {
        Deque<String> deque = new LinkedList<>();
        deque.addLast("Oracle");
        deque.offerLast("Java");
        deque.offerLast("CSS");
        deque.offerLast("XML");

        System.out.println("Deque: " + deque);

        // remove elements from the Deque until it is empty
        while (deque.peekFirst() != null) {
            System.out.println("Head  Element: " + deque.peekFirst());
            deque.removeFirst();
            System.out.println("Removed one  element from  Deque");
            System.out.println("Deque: " + deque);
        }

        // the Deque is empty. Try to call its peekFirst(),
        // getFirst(), pollFirst() and removeFirst() methods
        System.out.println("deque.isEmpty(): " + deque.isEmpty());

        System.out.println("deque.peekFirst(): " + deque.peekFirst());
        System.out.println("deque.pollFirst(): " + deque.pollFirst());

        String str = deque.getFirst();
        System.out.println("deque.getFirst(): " + str);
        str = deque.removeFirst();
        System.out.println("deque.removeFirst(): " + str);

    }
}

```

上面的代码生成以下结果。

```
Deque: [Oracle, Java, CSS, XML]
Head  Element: Oracle
Removed one  element from  Deque
Deque: [Java, CSS, XML]
Head  Element: Java
Removed one  element from  Deque
Deque: [CSS, XML]
Head  Element: CSS
Removed one  element from  Deque
Deque: [XML]
Head  Element: XML
Removed one  element from  Deque
Deque: []
deque.isEmpty(): true
deque.peekFirst(): null
deque.pollFirst(): null
java.util.NoSuchElementException
	at java.util.LinkedList.getFirst(LinkedList.java:244)
	at com.practice.queue.LinkedListDequeTest.main(LinkedListDequeTest.java:38)
```



## ArrayDeque 堆栈(或LIFO队列)例子

以下代码显示如何使用Deque作为堆栈(或LIFO队列)。

```
import java.util.ArrayDeque;
import java.util.Deque;

public class Main {
  public static void main(String[] args) {
    // Create a Deque and use it as stack
    Deque<String> deque = new ArrayDeque<>();
    deque.push("Oracle");
    deque.push("HTML");
    deque.push("CSS");
    deque.push("XML");

    System.out.println("Stack: " + deque);

    // remove all elements from the Deque
    while (deque.peek() != null) {
      System.out.println("Element at  top:  " + deque.peek());
      System.out.println("Popped: " + deque.pop());
      System.out.println("Stack: " + deque);
    }

    System.out.println("Stack is  empty:  " + deque.isEmpty());
  }
}

```

上面的代码生成以下结果。