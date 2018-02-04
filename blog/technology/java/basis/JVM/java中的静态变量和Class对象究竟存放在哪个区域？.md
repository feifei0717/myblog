[TOC]



# java中的静态变量和Class对象究竟存放在哪个区域？

## 问题

我们先区分一下概念：

1. GC Heap = Java Heap + Other Areas
2. Method Area是Heap的逻辑组成部分

\1. 先说静态变量

- 对于静态变量的存储位置有很多很多说法，在《深入理解Java虚拟机》第二版中P41指出静态变量是存放是方法区(Method Area)，原句如下

> 方法区与Java堆一样，是各个线程共享的内存区域，它用于存储已被虚拟机加载的类信息、常量、**静态变量**、即时编译器编译后的代码等数据。

- 而在《Java并发编程的艺术》一书中gne则说静态变量存放与堆（应该是Java Heap）中，论据在P22，原文如下

> 在Java中，所有示例域、**静态域**和数组元素都存储在堆内存中，堆内存在线程之间共享。

- 在StackOverflow上有人认为静态变量的字面量和引用会存放于PermGen（Method Area的一部分），如果是引用的话那么他的实例将会放在Java堆中。([where is a static method and a static variable stored in java. In heap or in stack memory](https://link.zhihu.com/?target=http%3A//stackoverflow.com/questions/8387989/where-is-a-static-method-and-a-static-variable-stored-in-java-in-heap-or-in-sta))

\2. 再说方法区

- 同样是在《深入理解Java虚拟机》第二版P215，指出Class对象是个特例，存放在Method Area，原文如下

> 对于HotSpot虚拟机而言，Class对象比较特殊，它虽然是对象，但是存放在方法区里面。

- 而R大则指出“至于java.lang.Class对象，它们从来都是“普通”Java对象，跟其它Java对象一样存在普通的Java堆（GC堆的一部分）里。”（[JVM符号引用转换直接引用的过程? - 知乎](https://www.zhihu.com/question/50258991)）

那这些问题在JDK7中究竟孰是孰非呢？





## 回答

先说结论：**JDK7以上版本，静态域存储于定义类型的Class对象中，Class对象如同堆中其他对象一样，存在于GC堆中**。再说一堆题外话：尽信书则不如无书，题主的疑惑我也有过，到底孰是孰非，还要靠论据来佐证，当各种文献发生矛盾的时候，也是我们满脑子疑惑的时候。这时候真想把作者拉过来问问：XX大神啊，你这个结论到底是怎么得出来的？！最后，只能带着问题看代码了。就像柯蓝中的——真相只有一个——代码是真相最好的诠释。

----------------------------------------------------

**做些补充**：ClassLoader加载过程中，对字节码流解析的过程中会创建对应类元数据类型Klass的java镜像-Class对象，参考Class对象的创建函数java_lang_Class::create_mirror()会发现，创建Class对象的同时会对用户定义类型中的static成员变量做初始化赋值，当然这里的初始化仅仅是根据相应static field的类型赋予相应的初始值，并非用户实际给定的值——除非用户没有给static field指定初始值或者用户指定了一个与默认值相同的初始值；字节码流解析完成之后，在类加载的初始化阶段，会调用< clinit >这样一个特殊的函数——如果用户给一个static field指定了一个默认值，static int i = 10;

…..

省略  详情查看  :https://www.zhihu.com/question/59174759

关于Class对象的存储位置的证明，可以参考我的另一个回答：hotpot java虚拟机Class对象是放在 方法区 还是堆中 ？
————————————————————————————

题主说我关于java_lang_Class对象的分配所贴的代码是jdk1.8的，我就在放个jdk1.7的链接（相关部分变化不大）：http://hg.openjdk.java.net/jdk7/jdk7/hotspot/file/9b0ca45cd756/src/share/vm/classfile/javaClasses.cpp?#l452

JVM Specification关于ClassLoader初始化：Chapter 5. Loading, Linking, and Initializing









https://www.zhihu.com/question/59174759