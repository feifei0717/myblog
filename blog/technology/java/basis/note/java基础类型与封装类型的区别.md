# 浅析Java基础类型与封装类型的区别

** 发表于 2017-10-08 | ** 分类于 [Java ](https://amyyanjie.github.io/categories/Java/)| ** | ** 阅读次数: 31

本篇博文主要讲解以下内容：

-  基础类型(Primitives)与封装类型(Wrappers)的区别在哪里

## 一、传递方式不同

封装类是引用类型。

**基本类型（原始数据类型）在传递参数时都是按值传递，而封装类型是按引用传递的**(其实“引用也是按值传递的”，传递的是对象的地址)。由于包装类型都是不可变量，因此没有提供改变它值的方法，增加了对“按引用传递”的理解难度。

int是基本类型，直接存放数值；Integer是类，产生对象时用一个引用指向这个对象。

## 二、封装类可以有方法和属性

封装类可以有方法和属性，利用这些方法和属性来处理数据，如Integer.parseInt(Strings)。**基本数据类型都是final修饰的**，不能继承扩展新的类、新的方法。

## 三、默认值不同

**基本类型跟封装类型的默认值是不一样的**。如int i,i的预设为0；Integer j，j的预设为null,因为封装类产生的是对象，对象默认值为null。

## 四、存储位置

**基本类型在内存中是存储在栈中，引用类型的引用（值的地址）存储在栈中，而实际的对象（值）是存在堆中**。

虽然基本类型在栈上分配内存效率高，但是在堆栈上分配内存可能有内存泄漏的问题。

------

**基本数据类型的好处就是速度快（不涉及到对象的构造和回收），封装类的目的主要是更好的处理数据之间的转换。**

JDK5.0开始可以自动封包了，**基本数据类型可以自动封装成封装类**。
比如集合List，往里添加对象Object，需要将数字封装成封装类型对象，再存到List中。

```
List list=new ArreyList();
list.add(new Integer(1));
```

在JDK5.0 以后可以自动封包，简写成

```
List list=new ArrayList();
list.add(1);
```

## 相关推荐：

- [分析int和Integer的区别](https://amyyanjie.github.io/2017/10/15/Analyze-the-difference-between-int-and-Integer/)

## 参考：

- [Java中九种基本数据类型以及他们的封装类](http://m.blog.csdn.net/oLaoHuBuChiRen1/article/details/51079738)

[# Java基础](https://amyyanjie.github.io/tags/Java-Foundation/)





https://amyyanjie.github.io/2017/10/08/Brief-Analysis-on-the-Differences-between-Java-Primitives-and-Wrappers/