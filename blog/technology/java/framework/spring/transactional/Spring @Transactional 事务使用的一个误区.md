[TOC]



# Spring @Transactional 事务使用的一个误区

## 问题描述

Spring bean 假设有如下类

```
public class Service implement IService{
    @Transactional(readOnly = false, propagation=Propagation.REQUIRED)   
    public void methodA(){
       .....

      methodB()
      ......
    }
    @Transactional(readOnly = false, propagation=Propagation.REQUIRES_NEW)   
    public void methodB{
      ......
    }
}
```

```
public class ServiceFacade{
    @Autowired
    private Iservice service;
    public void method(){
        service.methodA();
    }
}
```

问调用ServiceFacade的method（）方法，请问methodA和methodB事务是怎么样的？
在同一个事务还是两个事务，methodA事务生效还是methodB事务生效，还是都生效？
答案是methodA的事务生效，methodB被嵌入到methodA中变成一个事务。
为什么会这样呢？methodB不是声明了Propagation.REQUIRES_NEW吗？
答案得从Spring的事务实现说起，spring的事务是通过AOP动态代理实现的。
为bean生成代理。因为methodB在Service内部被调用，此时执行的并不是代理bean的methodB，所以methodB上面的事务声明失效
ServiceFacade 调用service的methodA方法的时候，实际上执行的是serviceProxy.methodA，所以method被spring事务接管。事务声明生效。



## 解决的办法    

1，methodB放在另外的bean中被methodA调用或者facade调用service.methodA(),然后调用service.methodB    

**2，事务方法调用同一个类里面的另一个事务方法，被调用的方法事务会失效，因为spring的事务是基于代理类来实现的。在controller里的service其实是代理对象，所以b方法的事务有效。解决方法很简单，在a方法类获取当前对象的代理对象 IService s=(IService)AopContext.currentProxy();  s.b();前提要在spring中配置，<aop:aspectj-autoproxy expose-proxy="true"/>  expose-proxy="true" 表示将当前代理对象暴露出去，不然 AopContext.currentProxy() 或得的是 null .**



## 总结


总结：Spring的事务是基于AOP动态代理实现的。默认情况下，在同一个类中调用不同的方法，上面的事务声明是无效的。
来源： [http://blog.csdn.net/seven_3306/article/details/41829121](http://blog.csdn.net/seven_3306/article/details/41829121)