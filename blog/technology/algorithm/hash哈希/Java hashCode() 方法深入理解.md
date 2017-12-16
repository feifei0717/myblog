# [Java hashCode() 方法深入理解](http://www.codeceo.com/article/java-hashcode-learn.html)

 

Java.lang.Object 有一个hashCode()和一个equals()方法，这两个方法在软件设计中扮演着举足轻重的角色。在一些类中覆写这两个方法以完成某些重要功能。本文描述了为什么要用hashCode(), 如何使用，以及其他的一些扩展。阅读本文需要有基本的hash算法知识以及基本的Java集合知识，本文属于菜鸟入门级讲解，大神读至此请点击右上角的X，以免浪费您的时间^_^。

## WHY hashCode()?

集合Set中的元素是无序不可重复的，那判断两个元素是否重复的依据是什么呢？ “比较对象是否相等当然用Object.equal()了”，某猿如是说。但是，Set中存在大量对象，后添加到集合Set中的对象元素比较次数会逐渐增多，大大降低了程序运行效率。 Java中采用哈希算法(也叫散列算法)来解决这个问题，将对象(或数据)依特定算法直接映射到一个地址上，对象的存取效率大大提高。这样一来，当含有海量元素的集合Set需要添加某元素(对象)时，先调用这个元素的hashCode()，就能一下子定位到此元素实际存储位置，如果这个位置没有元素，说明此对象时第一次存储到集合Set, 直接将此对象存储在此位置上；若此位置有对象存在，调用equal()看看这两个对象是否相等，相等就舍弃此元素不存，不等则散列到其他地址。

## HOW use hashCode()?

Java语言对猿设计equal()有五个必须遵循的要求。

1. 对称性。若 a.equal(b) 返回”true”, 则 b.equal(a) 也必须返回 “true”.
2. 反射性。a.equal(a) 必须返回”true”.
3. 传递性。若a.equal(b) 返回 “true”, 且 b.equal(c)返回 “true”, 则c.equal(a)必返回”true”.
4. 一致性。若a.equal(b) 返回”true”, 只要a, b内容不变，不管重复多少次a.equal(b)必须返回”true”.
5. 任何情况下，a.equals(null)，永远返回是“false”；a.equals(和a不同类型的对象)永远返回是“false”.

hashCode()的返回值和equals()的关系.

1. 如果a.equals(b)返回“true”，那么a和b的hashCode()必须相等。
2. 如果a.equals(b)返回“false”，那么a和b的hashCode()有可能相等，也有可能不等。

下面是一个例子。在实际的软件开发中，最好重写这两个方法。

```
public class Employee {
    int        employeeId;
    String     name;

    // other methods would be in here 

    @Override
    public boolean equals(Object obj)
    {
        if(obj==this)
            return true;
        Employee emp=(Employee)obj;
        if(employeeId.equals(emp.getEmployeeId()) && name==emp.getName())
            return true;
        return false;
    }

    @Override
    public int hashCode() {
        int hash = 1;
        hash = hash * 17 + employeeId;
        hash = hash * 31 + name.hashCode();
        return hash;
    }
}
```

下面着重介绍一下常用类的hashCode()实现方法。

## String类的hasCode()

Java代码

```
public int hashCode() {
    int h = hash;
    if (h == 0) {
        int off = offset;
        char val[] = value;
        int len = count;

            for (int i = 0; i < len; i++) {
                h = 31*h + val[off++];
            }
            hash = h;
        }
        return h;
    }
```

这段代码最有意思的还是hash的实现方法了。最终计算的hash值为：

> s[0]31n-1 + s[1]31n-2 + … + s[n-1]

s[i]是string的第i个字符，n是String的长度。那为什么这里用31，而不是其它数呢?

31是个奇素数，如果乘数是偶数，并且乘法溢出的话，信息就会丢失，因为与2相乘等价于移位运算。使用素数的好处并不是很明显，但是习惯上都使用素数来计算散列结果。31有个很好的特性，就是用移位和减法来代替乘法，可以得到更好的性能：31*i==(i<<5)-i。现在的VM可以自动完成这种优化。(From Effective Java)

## Object类的hasCode()

Object类中hashCode()是一个Native方法。[Native方法如何调用?](http://stackvoid.com/cn/2014/05/JNI-usage1/)

```
public native int hashCode();
```

Object类的Native方法类可在[这里](http://hg.openjdk.java.net/jdk7/jdk7/jdk/file/9b8c96f96a0f/src/share/native/java/lang/Object.c)找到。 深入分析请看[另外一篇博客](http://stackvoid.com/cn/2014/06/default-Object-hashCode-implements/)

```
static JNINativeMethod methods[] = {
    {"hashCode",    "()I",                    (void *)&JVM_IHashCode},
    {"wait",        "(J)V",                   (void *)&JVM_MonitorWait},
    {"notify",      "()V",                    (void *)&JVM_MonitorNotify},
    {"notifyAll",   "()V",                    (void *)&JVM_MonitorNotifyAll},
    {"clone",       "()Ljava/lang/Object;",   (void *)&JVM_Clone},
};
```

源代码包括getClass()(See line58)等, hashCode()(See line43)被定义为一个指向JVM_IHashCode指针。

[jvm.cpp](http://hg.openjdk.java.net/jdk7/jdk7/hotspot/file/tip/src/share/vm/prims/jvm.cpp)中定义了JVM_IHashCode(line 504)函数, 此函数里调用ObjectSynchronizer::FastHashCode，其定在[ synchronizer.cpp](http://hg.openjdk.java.net/jdk7/jdk7/hotspot/file/tip/src/share/vm/runtime/synchronizer.cpp), 可参考576行的FastHashCode 和 530行的 get_next_hash 的实现。

[http://www.codeceo.com/article/java-hashcode-learn.html](http://www.codeceo.com/article/java-hashcode-learn.html)