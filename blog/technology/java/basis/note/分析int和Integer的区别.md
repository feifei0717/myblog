# 分析int和Integer的区别

2017.12.22 11:49 字数 672 阅读 991评论 5喜欢 34

int 和 Integer 哪个会占用更多的内存？ int 和 Integer 有什么区别？相等吗？

## int和Integer所占内存比较：

Integer对象会占用更多的内存。Integer是一个对象，需要存储对象的元数据。但是int是一个原始类型的数据，所以占用的空间更少。

## int和Integer的更多区别：

除了之前写的通用的[基本数据类型与包装类的区别](https://link.jianshu.com/?t=https%3A%2F%2Famyyanjie.github.io%2F2017%2F10%2F08%2FBrief-Analysis-on-the-Differences-between-Java-Primitives-and-Wrappers%2F)之外,还有以下方面的比较：

(注：对于引用类型变量，==操作符比较的是两个引用是否指向同一个对象；对于基本类型变量，==操作符比较的是两个变量的值是否相等。)

### 1.两个通过new出来的Integer变量比较，结果为false。

```
/**
 * 比较两个new出来的Integer
 */
public class Test {
    public static void main(String[] args) {
        Integer i = new Integer(200);
        Integer j = new Integer(200);
        System.out.print(i == j);
        //输出：false
    }
}

```

Integer变量实际上是对一个Integer对象的引用。当new一个Integer时，实际上是生成一个指针指向此对象，两次new Integer生成的是两个对象，其内存地址不同，所以两个new出来的Integer变量不等。

### 2.非new生成的Integer变量与new Integer()生成的变量比较，结果为false。

```
/**
 * 比较非new生成的Integer变量与new生成的Integer变量
 */
public class Test {
    public static void main(String[] args) {
        Integer i= new Integer(200);
        Integer j = 200;
        System.out.print(i == j);
        //输出：false
    }
}

```

因为非new生成的Integer变量指向的是java常量池中的对象，而new Integer()生成的变量指向堆中新建的对象，两者在内存中的地址不同。所以 输出为false。

### 3.两个非new生成的Integer对象进行比较，如果两个变量的值在区间[-128,127]之间，比较结果为true；否则，结果为false。 

```
/**
 * 比较两个非new生成的Integer变量
 */
public class Test {
    public static void main(String[] args) {
        Integer i1 = 127;
        Integer ji = 127;
        System.out.println(i1 == ji);//输出：true
        Integer i2 = 128;
        Integer j2 = 128;
        System.out.println(i2 == j2);//输出：false
    }
}

```

java在编译Integer i1 = 127时，会翻译成Integer i1 = Integer.valueOf(127)。查看Interger源码：

```
     /**
     * Cache to support the object identity semantics of autoboxing for values between
     * -128 and 127 (inclusive) as required by JLS.
     */

    private static class IntegerCache {
        static final int low = -128;
        static final int high;
        static final Integer cache[];

        static {
            // high value may be configured by property
            int h = 127;
            String integerCacheHighPropValue =
                sun.misc.VM.getSavedProperty("java.lang.Integer.IntegerCache.high");
            if (integerCacheHighPropValue != null) {
                try {
                    int i = parseInt(integerCacheHighPropValue);
                    i = Math.max(i, 127);
                    // Maximum array size is Integer.MAX_VALUE
                    h = Math.min(i, Integer.MAX_VALUE - (-low) -1);
                } catch( NumberFormatException nfe) {
                    // If the property cannot be parsed into an int, ignore it.
                }
            }
            high = h;

            cache = new Integer[(high - low) + 1];
            int j = low;
            for(int k = 0; k < cache.length; k++)
                cache[k] = new Integer(j++);

            // range [-128, 127] must be interned (JLS7 5.1.7)
            assert IntegerCache.high >= 127;
        }

        private IntegerCache() {}
    }

```

```
 * This method will always cache values in the range -128 to 127,
     * inclusive, and may cache other values outside of this range.
     */
    public static Integer valueOf(int i) {
        if (i >= IntegerCache.low && i <= IntegerCache.high)
            return IntegerCache.cache[i + (-IntegerCache.low)];
        return new Integer(i);
    }

```

可以看出，java会将[-128,127]之间的数进行缓存。Integer i1 = 127时，会将127缓存，Integer j2 = 127时，就直接从缓存中取，不会new了，所以结果为true。

Integer i2 = 128时，不会将128缓存，Integer j2 = 128时，会return new Integer(128)。所以结果为false。

### 4. Integer变量(无论是否是new生成的)与int变量比较，只要两个变量的值是相等的，结果都为true。

```
/**
 * 比较Integer变量与int变量
 */
public class Test {
    public static void main(String[] args) {
        Integer i1 = 200;
        Integer i2 = new Integer(200);
        int j = 200;
        System.out.println(i1 == j);//输出：true
        System.out.println(i2 == j);//输出：true
    }
}

```

包装类Integer变量在与基本数据类型int变量比较时，Integer会自动拆包装为int，然后进行比较，实际上就是两个int变量进行比较，值相等，所以为true。

## 参考资料：

> [Integer与int的种种比较你知道多少?](https://link.jianshu.com/?t=https%3A%2F%2Fwww.cnblogs.com%2Fliuling%2Farchive%2F2013%2F05%2F05%2FintAndInteger.html)

> [java面试题之int和integer的区别](https://link.jianshu.com/?t=https%3A%2F%2Fwww.cnblogs.com%2Fguodongdidi%2Fp%2F6953217.html)





https://www.jianshu.com/p/08010144d40f