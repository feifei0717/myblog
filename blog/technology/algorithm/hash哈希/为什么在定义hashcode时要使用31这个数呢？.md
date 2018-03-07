[TOC]



# 为什么在定义hashcode时要使用31这个数呢

散列计算就是计算元素应该放在数组的哪个元素里。准确的说是放到哪个链表里面。按照Java的规则，如果你要想将一个对象放入HashMap中，你的对象的类必须提供hashcode方法，返回一个整数值。比如String类就有如下方法：

```java
public int hashCode() {  
        int h = hash;  
        int len = count;  
        if (h == 0 && len > 0) {  
            int off = offset;  
            char val[] = value;  
  
            for (int i = 0; i < len; i++) {  
                h = 31*h + val[off++];  
            }  
            hash = h;  
        }  
        return h;  
    } 
```

注意上面的for循环，有点搞吧？我来举个例子，让你很容易明白它在搞什么名堂。比如有一个字符串“abcde”,采用31进制的计算方法来计算这个字符串的总和，你会写出下面的计算式子：

a*31^4+b*31^3+c*31^2+d*31^1+e*31^0.注意，这里的a,b,c,d或者e指的是它们的ASCII值。很有趣的循环，居然可以用来算N进制。这个循环可以抽出来单独作为计算进制的好工具：

```java
public static void main(String[] args) {  
        int[] a={1,0};  
        System.out.println(calculate(2,a));  
    }  
  
    private static int calculate(int radix,int[] a){  
        int sum = 0;  
        for(int i=0;i<a.length;++i){  
            sum = sum*radix+a[i];  
        }  
        return sum;  
    }  
```

  静态方法caculate接受radix作为进制基数，数组a模拟要计算的进制的数字，只是注意表面顺序需要一致。比如 01 二进制串，在数组中要按照{0,1}排列。上面的输出结果是1，符合01的真实值。

  那么为什么选用31作为基数呢？先要明白为什么需要HashCode.每个对象根据值计算HashCode,这个code大小虽然不奢求必须唯一（因为这样通常计算会非常慢），但是要尽可能的不要重复，因此基数要尽量的大。另外，31*N可以被编译器优化为

左移5位后减1，有较高的性能。其实选用31还是有争议，反对者（参考

http://stackoverflow.com/questions/299304/why-does-javas-hashcode-in-string-use-31-as-a-multiplier）

认为这个东西还是会导致较多的重复，应该用更大的数字。所以，或许将来Java的实现中会有所变化。下面这篇文章介绍了两个结论：

1.基数要用质数

质数的特性（只有1和自己是因子）能够使得它和其他数相乘后得到的结果比其他方式更容易产成唯一性，也就是hash code值的冲突概率最小。

2.选择31是观测分布结果后的一个选择，不清楚原因，但的确有利。

[http://computinglife.wordpress.com/2008/11/20/why-do-hash-functions-use-prime-numbers/](http://computinglife.wordpress.com/2008/11/20/why-do-hash-functions-use-prime-numbers/)

另外，String.hashCode内部会缓存第一次计算的值，因为这是一个final（不可变）类，也就是String对象的内容是不会变的。这能够在多次put到HashMap的场合提高性能，不过似乎用处不多。

来源： [http://blog.csdn.net/steveguoshao/article/details/12576849](http://blog.csdn.net/steveguoshao/article/details/12576849)