 

# [spring自带的定时任务功能，基于注解和xml配置](http://blog.csdn.net/wxwzy738/article/details/25158787)



## 1、spring的配置文件

```
<beans xmlns="http://www.springframework.org/schema/beans"  
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"   
    xmlns:p="http://www.springframework.org/schema/p"  
    xmlns:task="http://www.springframework.org/schema/task"  
    xmlns:context="http://www.springframework.org/schema/context"  
    xmlns:aop="http://www.springframework.org/schema/aop"   
    xsi:schemaLocation="http://www.springframework.org/schema/beans   
    http://www.springframework.org/schema/beans/spring-beans-3.0.xsd  
    http://www.springframework.org/schema/tx http://www.springframework.org/schema/tx/spring-tx-3.0.xsd    
    http://www.springframework.org/schema/jee http://www.springframework.org/schema/jee/spring-jee-3.0.xsd    
    http://www.springframework.org/schema/context http://www.springframework.org/schema/context/spring-context-3.0.xsd    
    http://www.springframework.org/schema/aop http://www.springframework.org/schema/aop/spring-aop-3.0.xsd    
    http://www.springframework.org/schema/task http://www.springframework.org/schema/task/spring-task-3.0.xsd">  
  
    <task:annotation-driven />   
  
    <bean id="myTaskXml" class="com.spring.task.MyTaskXml">bean>  
  
    <task:scheduled-tasks>  
          
        <task:scheduled ref="myTaskXml" method="show" cron="*/5 * * * * ?" />  
        <task:scheduled ref="myTaskXml" method="print" cron="*/10 * * * * ?"/>  
    task:scheduled-tasks>  
      
        
    <context:component-scan base-package="com.spring.task" />  
      
beans>  
```





## 2、基于xml的定时器任务

```
package com.spring.task;  
  
/** 
 * 基于xml的定时器 
 * @author hj 
 */  
public class MyTaskXml {  
      
      
    public void show(){  
        System.out.println("XMl:is show run");  
    }  
      
    public void print(){  
        System.out.println("XMl:print run");  
    }  
}  
```

## 3、基于注解的定时器任务

```
package com.spring.task;  
  
import org.springframework.scheduling.annotation.Scheduled;  
import org.springframework.stereotype.Component;  
  
/** 
 * 基于注解的定时器 
 * @author hj 
 */  
@Component  
public class MyTaskAnnotation {  
      
    /**  
     * 定时计算。每天凌晨 01:00 执行一次  
     */    
    @Scheduled(cron = "0 0 1 * * *")   
    public void show(){  
        System.out.println("Annotation：is show run");  
    }  
      
    /**  
     * 心跳更新。启动时执行一次，之后每隔2秒执行一次  
     */    
    @Scheduled(fixedRate = 1000*2)   
    public void print(){  
        System.out.println("Annotation：print run");  
    }  
}  
```



## 4、测试

```
package com.spring.test;  
  
import org.springframework.context.ApplicationContext;  
import org.springframework.context.support.ClassPathXmlApplicationContext;  
  
  
public class Main {  
    public static void main(String[] args) {  
        ApplicationContext ctx = new ClassPathXmlApplicationContext("spring-mvc.xml");  
    }  
}  
```



运行结果：

Annotation：print run

Annotation：print run

Annotation：print run

XMl:print run

XMl:is show run

Annotation：print run

Annotation：print run

工程下载地址：http://download.csdn.net/detail/wxwzy738/7305741