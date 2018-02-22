[TOC]



# spring @value 注入static



## 提问：

Spring中如何注入静态变量 

如下代码：

```Java
@Component
public class Sample {
    @Value("${my.name}")
    public static String name;
}

```

运行后`name`总是`null`。静态变量应该如何注入呢？或者说注入静态变量是不是一种好的方式，有没有其他方式处理类似场景。



## 回答

 Spring是不推荐静态变量或者静态方法注入的，因为Spring的哲学是由Spring去生成bean实例，并帮你维护bean的生命周期以及相对应的依赖式注入的属性。而静态方法或者变量实际上是某个类所共享的属性，而不属于某个bean实例的属性。一旦依赖式注入了某个静态变量，会造成测试、维护等方面的各种问题，所以最好还是要避免静态变量的注入。

当然，在某些情况下我们依然需要自己去实例化一些类并自己维护其生命周期，这时候我们确实又有需求使用到Spring context中的bean，这种情况下我们可以通过下面的方法将bean注入进来：

```java
@Component
public class Sample {

    public static String name;

    @Value("${my.name}")
    public void setName(String name){
        Sample.name = name;
    }

}
```

对于普通方法，@Value是可以生效的，这样我们就能够将Sample.name的值注入进来。





https://www.tianmaying.com/qa/88