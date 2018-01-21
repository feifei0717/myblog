# spring aop  aspect与advisor 的区别

在开发过程中，不少有Spring Aop的使用，在面向切面编程时，我们会使用< aop:aspect>；在进行事务管理时，我们会使用< aop:advisor>。那么，对于< aop:aspect>与< aop:advisor>的区别，具体是怎样的呢？

至于两者的区别，网上有很多资料，但是似乎都不能说清楚。 
首先，我们需要明确两者的概念。

- < aop:aspect>：定义切面（切面包括通知和切点）
- < aop:advisor>：定义通知器（通知器跟切面一样，也包括通知和切点）

下面，我们列举两者的几个区别。



### 名词介绍：

#### Advice通知：

为切面增强提供织入接口。就是切面点需要执行的逻辑处理。

#### Pointcut切点：

决定advice通知应该作用于哪个连接点。

#### Advisor通知器：

完成对目标方法的切面增强设计（Advice）和关注点的设计（Pointcut）以后，需要一个对象把它们结合起来，完成这个作用的就是Advisor（通知器）。





## 大致区别

advisor只持有一个Pointcut和一个advice，而aspect可以多个pointcut和多个advice

## 1、编写方式不同

< aop:aspect>定义切面时，只需要定义一般的bean就行，而定义< aop:advisor>中引用的通知时，通知必须实现Advice接口。

下面我们举例说明。 
首先，我们定义一个接口Sleepable和这个接口的实现Human，代码如下：

```
public interface Sleepable {
    public void sleep();
}

public class Human implements Sleepable {

    @Override
    public void sleep() {
        System.out.println("我要睡觉了！");
    }
} 
```

**下面是< aop:advisor>的实现方式：**

```
//定义通知
public class SleepHelper implements MethodBeforeAdvice,AfterReturningAdvice{
    @Override
    public void before(Method arg0, Object[] arg1, Object arg2)
            throws Throwable {
        System.out.println("睡觉前要脱衣服！");
    }

    @Override
    public void afterReturning(Object arg0, Method arg1, Object[] arg2,
            Object arg3) throws Throwable {
        System.out.println("起床后要穿衣服！");
    }
}

//aop配置
<bean id="sleepHelper" class="com.ghs.aop.SleepHelper"></bean>

<aop:config>
    <aop:pointcut expression="execution(* *.sleep(..))" id="sleepPointcut"/>
    <aop:advisor advice-ref="sleepHelper" pointcut-ref="sleepPointcut"/>
</aop:config>

<bean id="human" class="com.ghs.aop.Human"/>
```

**下面是< aop:aspect>的实现方式：**

```
//定义切面
public class SleepHelperAspect{
    public void beforeSleep(){
        System.out.println("睡觉前要脱衣服！");
    }

    public void afterSleep(){
        System.out.println("起床后要穿衣服！");
    }
}

//aop配置
<bean id="sleepHelperAspect" class="com.ghs.aop.SleepHelperAspect"></bean>

<aop:config>
    <aop:pointcut expression="execution(* *.sleep(..))" id="sleepPointcut"/>
    <aop:aspect ref="sleepHelperAspect">
        <!--前置通知-->
        <aop:before method="beforeSleep" pointcut-ref="sleepPointcut"/>
        <!--后置通知-->
        <aop:after method="afterSleep" pointcut-ref="sleepPointcut"/>
    </aop:aspect>
</aop:config>

<bean id="human" class="com.ghs.aop.Human"/> 
```

测试代码如下：

```
public class TestAOP {
    public static void main(String[] args) {
        method1();
//      method2();
    }

    private static void method1() {
        ApplicationContext context = new ClassPathXmlApplicationContext("applicationContext1.xml");
        Sleepable sleeper = (Sleepable) context.getBean("human");
        sleeper.sleep();
    }

    private static void method2() {
        ApplicationContext context = new ClassPathXmlApplicationContext("applicationContext2.xml");
        Sleepable sleeper = (Sleepable) context.getBean("human");
        sleeper.sleep();
    }

//执行结果
睡觉前要脱衣服！
我要睡觉了！
起床后要穿衣服！
} 
```

## 2、使用场景不同

**< aop:advisor>大多用于事务管理。** 
例如：

```
<!-- 会重复读，不会脏读事务 -->
<tx:advice id="txAdvice" transaction-manager="transactionManager">
    <tx:attributes>
        <tx:method name="*" timeout="120" propagation="REQUIRED" rollback-for="Exception" />
    </tx:attributes>
</tx:advice>

<aop:config proxy-target-class="true">
    <aop:pointcut id="txPointCut" expression="..."/>
    <aop:advisor advice-ref="txAdvice" pointcut-ref="txPointCut" />
</aop:config>1234567891011
```

**< aop:aspect>大多用于日志，缓存**

其实，不管是< aop:advisor>还是< aop:aspect>最终的实现逻辑是一样的。

小结： 
可以看出，< aop:advisor>和< aop:aspect>其实都是将通知和切面进行了封装，原理基本上是一样的，只是使用的方式不同而已。

附： 
对于这个问题的理解，其实尚未有一个深入的认识，下面推荐大家几篇博文，希望共同交流。 
<http://www.iteye.com/problems/69785> 
<http://blog.sina.com.cn/s/blog_5198c7370100hw1p.html> 
<http://blog.csdn.net/huitoukest/article/details/46469177> 
<http://www.tz365.cn/ask/shenghuo/2016/0804/739237.html> 
<https://zhidao.baidu.com/question/371238289198208804.html>





http://blog.csdn.net/u011983531/article/details/70504281