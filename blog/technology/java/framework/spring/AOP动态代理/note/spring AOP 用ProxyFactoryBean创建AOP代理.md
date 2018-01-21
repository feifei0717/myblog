# spring AOP 用ProxyFactoryBean创建AOP代理

 代码：/Users/jerryye/backup/studio/AvailableCode/framework/spring/aop/spring_aop_xml_proxyfactorybean_demo

## 简介

- ProxyFactoryBean是spring可以管理的 aop动态代理类

  使用Spring提供的类org.springframework.aop.framework.ProxyFactoryBean是创建AOP的最基本的方式 。

  使用 ProxyFactoryBean 来创建 AOP 代理的最重要的优点之一是 IoC 可以管理通知和切入点。 这是一个非常的强大的功能，能够实现其他 AOP 框架很难实现的特定的方法。例如，一个通知本身可以引用应用对象（除了目标对象，它在任何AOP 框架中都可以引用应用对象），这完全得益于依赖注入所提供的可插入性。

  ​

- ProxyFactory是用简易封装jdk代理类



## 1.一个代理模式的实例 通过 ProxyFactory类进行代理

wait.java

```
//定义一个接口
public interface wait {
    void say();
}
```



```
//目标对象实现接口并重写方法
public class waiter implements wait {
    @Override
    public void say() {
        // TODO Auto-generated method stub
        System.out.println("先生");
    }

}
```





```
public class SayHelloBeforemale implements MethodBeforeAdvice {//实现相应增强类的接口
    @Override
    public void before(Method arg0, Object[] arg1, Object arg2) throws Throwable {
        //arg0 是 目标类的方法     arg1是目标类的入参数   arg2是目标类实例  发生异常则抛给Throwable
        // TODO Auto-generated method stub
        System.out.println("hello");
    }
}
```



 

UnitTest.java



```
public class UnitTest {
        //实明变量
    private SayHelloBeforemale male ;
    private waiter wait;
    private ProxyFactory xy;
    @Before
    public void init(){
              //实例化并赋值
        male = new SayHelloBeforemale();
        wait = new waiter();
        xy = new ProxyFactory();
             //设置目标对象
        xy.setTarget(wait);
            //设置增强类对象
        xy.addAdvice(male);
        
    }
    @Test
    public void test(){
               //
        waiter w = (waiter)xy.getProxy();
        w.say();
    }
}                                    
```



 

## 2.通过spring的配置文件进行代理 ProxyFactoryBean

　　这个方法进行代理所需的类和上面的 wait接口 和 它的实现类waiter 还有sayhelloadvice类

　　不同之处在于不是使用 ProxtyFactory来进行代理目标对象，而是通过Schema 的xml文件进行配置代理。

beans.xml



```
<bean id="sayhelloadvice" class="test3.SayHelloBeforemale"/>
    <bean id="target" class="test3.waiter"/>
    <bean id="waiter" class="org.springframework.aop.framework.ProxyFactoryBean"
        p:proxyInterfaces="test3.wait"
        p:interceptorNames="sayhelloadvice"
        p:target-ref="target"
    />
```



\- target:代理的目标对象 

\- proxyInterfaces:代理所需要实现的接口，可以多个接口。该属性还有一个别名是Interfaces

\- interceptorNames:需要植入目标对象的bean列表。采用bean的名称指定。这些bean必须实现类 org.aopalliance.intercept.MethodInterceptor

​      　　或 org.springframework.aop.Advisor的bean ,配置中的顺序对应调用的顺序。

\- proxyTargetClass:是否对类进行代理(而不是进行对接口进行代理),设置为true时，使用CGLib代理，且proxyInterfaces属性被ProxyFactoryBean忽略。

 

UnitTest.java



```
public class UnitTest { 
    @Test //测试在spring 通过ProxyFactoryBean 配置代理
    public void test2(){
        ApplicationContext a = new ClassPathXmlApplicationContext("test3/beans.xml");
        wait w = (wait)a.getBean("waiter");
        w.say();
    }
}    
```





http://www.cnblogs.com/tjc1996/p/5720447.html