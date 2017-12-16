# Java 优先级队列

由 rowline 创建，小路依依 最后一次修改 2017-01-09

## Java集合教程 - Java优先级队列

优先级队列是其中每个元素具有相关联的优先级的队列。具有最高优先级的元素将从队列中删除。

`PriorityQueue`是一个实现类对于Java Collection Framework中的无界优先级队列。

我们可以使用在每个元素中实现的`Comparable`接口作为其优先事项。

或者我们可以提供一个`Comparator`对象，这将确定元素的优先级顺序。

当向优先级队列添加新元素时，它将根据其优先级位于队列中。

[PriorityQueue APIs](https://www.w3cschool.cn/java.util/PriorityQueue/index.html)

## 默认对象比较器例子

```
package com.practice.queue;

import com.practice.queue.vo.ComparablePerson;

import java.util.PriorityQueue;
import java.util.Queue;

/**
 * <B>Description:</B>  <br>
 * <B>Create on:</B> 2017/10/29 上午10:19 <br>
 *
 * @author xiangyu.ye
 * @version 1.0
 */
public class PriorityQueueTest {
    public static void main(String[] args) {
        Queue<ComparablePerson> pq = new PriorityQueue<>();
        pq.add(new ComparablePerson(1, "Oracle"));
        pq.add(new ComparablePerson(4, "XML"));
        pq.add(new ComparablePerson(2, "HTML"));
        pq.add(new ComparablePerson(3, "CSS"));
        pq.add(new ComparablePerson(4, "Java"));

        System.out.println(pq);
        while (pq.peek() != null) {
            System.out.println("Head  Element: " + pq.peek());
            pq.remove();
            System.out.println("Priority  queue: " + pq);
        }
    }
}
```

ComparablePerson对象类

```
package com.practice.queue.vo;

import java.util.PriorityQueue;
import java.util.Queue;

public class ComparablePerson implements Comparable<ComparablePerson> {
    private int    id;
    private String name;

    public ComparablePerson(int id, String name) {
        this.id = id;
        this.name = name;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    @Override
    public boolean equals(Object o) {
        if (!(o instanceof ComparablePerson)) {
            return false;
        }
        ComparablePerson p = (ComparablePerson) o;
        if (this.id == p.getId()) {
            return true;
        }

        return false;
    }

    @Override
    public int hashCode() {
        return this.id;
    }

    @Override
    public String toString() {
        return "(" + id + ", " + name + ")";
    }

    @Override
    public int compareTo(ComparablePerson cp) {

        int cpId = cp.getId();
        String cpName = cp.getName();

        if (this.getId() < cpId) {
            return -1;
        }

        if (this.getId() > cpId) {
            return 1;
        }

        if (this.getId() == cpId) {
            return this.getName().compareTo(cpName);
        }

        // Should not reach here
        return 0;
    }
}

```

上面的代码生成以下结果。

```
[(1, Oracle), (3, CSS), (2, HTML), (4, XML), (4, Java)]
Head  Element: (1, Oracle)
Priority  queue: [(2, HTML), (3, CSS), (4, Java), (4, XML)]
Head  Element: (2, HTML)
Priority  queue: [(3, CSS), (4, XML), (4, Java)]
Head  Element: (3, CSS)
Priority  queue: [(4, Java), (4, XML)]
Head  Element: (4, Java)
Priority  queue: [(4, XML)]
Head  Element: (4, XML)
Priority  queue: []
```



## 指定比较器例子

当您使用迭代器时，`PriorityQueue`类不保证元素的任何顺序。

它的toString()方法使用它的迭代器给你的元素的字符串表示。

以下代码显示如何使用`Comparator`对象为ComparablePerson列表创建优先级队列。指定比较器

```

import com.practice.queue.vo.ComparablePerson;

import java.util.Comparator;
import java.util.PriorityQueue;
import java.util.Queue;

/**
 * <B>Description:</B>  <br>
 * <B>Create on:</B> 2017/10/29 上午10:19 <br>
 *
 * @author xiangyu.ye
 * @version 1.0
 */
public class PriorityQueueTest {
    public static void main(String[] args) {
        int initialCapacity = 5;
        Comparator<ComparablePerson> nameComparator = Comparator
                .comparing(ComparablePerson::getName);

        Queue<ComparablePerson> pq = new PriorityQueue<>(initialCapacity,
                nameComparator);
        pq.add(new ComparablePerson(1, "Oracle"));
        pq.add(new ComparablePerson(4, "XML"));
        pq.add(new ComparablePerson(2, "HTML"));
        pq.add(new ComparablePerson(3, "CSS"));
        pq.add(new ComparablePerson(4, "Java"));

        System.out.println("Priority  queue: " + pq);

        while (pq.peek() != null) {
            System.out.println("Head  Element: " + pq.peek());
            pq.remove();
            System.out.println("Removed one  element from  Queue");
            System.out.println("Priority  queue: " + pq);
        }
    }
}

```

上面的代码生成以下结果。

```
Priority  queue: [(3, CSS), (2, HTML), (1, Oracle), (4, XML), (4, Java)]
Head  Element: (3, CSS)
Removed one  element from  Queue
Priority  queue: [(2, HTML), (4, Java), (1, Oracle), (4, XML)]
Head  Element: (2, HTML)
Removed one  element from  Queue
Priority  queue: [(4, Java), (4, XML), (1, Oracle)]
Head  Element: (4, Java)
Removed one  element from  Queue
Priority  queue: [(1, Oracle), (4, XML)]
Head  Element: (1, Oracle)
Removed one  element from  Queue
Priority  queue: [(4, XML)]
Head  Element: (4, XML)
Removed one  element from  Queue
Priority  queue: []
```



https://www.w3cschool.cn/java/java-priority-queues.html