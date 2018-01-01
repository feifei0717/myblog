[TOC]



# 通过Spring @PostConstruct 和 @PreDestroy 方法 实现初始化和销毁bean之前进行的操作

关于在spring  容器初始化 bean 和销毁前所做的操作定义方式有三种：

第一种：通过@PostConstruct 和 @PreDestroy 方法 实现初始化和销毁bean之前进行的操作

第二种是：通过 在xml中定义init-method 和  destroy-method方法

第三种是： 通过bean实现InitializingBean和 DisposableBean接口



演示代码：

## 第一种：通过@PostConstruct 和 @PreDestroy 方法：

1:定义相关的实现类：

```
package com.myapp.core.annotation.init;  
  
import javax.annotation.PostConstruct;  
import javax.annotation.PreDestroy;  
  
public class PersonService {  
    
    private String  message;  
  
    public String getMessage() {  
        return message;  
    }  
  
    public void setMessage(String message) {  
        this.message = message;  
    }  
      
    @PostConstruct  
    public void  init(){  
        System.out.println("I'm  init  method  using  @PostConstrut...."+message);  
    }  
      
    @PreDestroy  
    public void  dostory(){  
        System.out.println("I'm  destory method  using  @PreDestroy....."+message);  
    }  
      
} 
```

2：定义相关的配置文件：

```
<?xml version="1.0" encoding="UTF-8"?>  
<beans xmlns="http://www.springframework.org/schema/beans"  
xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"  
xmlns:context="http://www.springframework.org/schema/context"  
xsi:schemaLocation="http://www.springframework.org/schema/beans  
http://www.springframework.org/schema/beans/spring-beans-3.1.xsd  
http://www.springframework.org/schema/context  
http://www.springframework.org/schema/context/spring-context-3.1.xsd">  
  
<!-- <context:component-scan  base-package="com.myapp.core.jsr330"/> -->  
  
<context:annotation-config />  
  
<bean id="personService" class="com.myapp.core.annotation.init.PersonService">  
  <property name="message" value="123"></property>  
</bean>  
  
</beans>  
```

其中<context:annotation-config />告诉spring 容器采用注解配置：扫描注解配置；

测试类：

```
package com.myapp.core.annotation.init;  
  
import org.springframework.context.ApplicationContext;  
import org.springframework.context.support.ClassPathXmlApplicationContext;  
  
public class MainTest {  
      
    public static void main(String[] args) {  
          
        ApplicationContext  context = new ClassPathXmlApplicationContext("resource/annotation.xml");  
          
        PersonService   personService  =  (PersonService)context.getBean("personService");  
          
        personService.dostory();  
    }  
  
}  
```

测试结果：

I'm  init  method  using  @PostConstrut....123
I'm  destory method  using  @PreDestroy.....123

其中也可以通过申明加载org.springframework.context.annotation.CommonAnnotationBeanPostProcessor

类来告诉Spring容器采用的 常用 注解配置的方式：

只需要修改配置文件为：

```
<?xml version="1.0" encoding="UTF-8"?>  
<beans xmlns="http://www.springframework.org/schema/beans"  
xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"  
xmlns:context="http://www.springframework.org/schema/context"  
xsi:schemaLocation="http://www.springframework.org/schema/beans  
http://www.springframework.org/schema/beans/spring-beans-3.1.xsd  
http://www.springframework.org/schema/context  
http://www.springframework.org/schema/context/spring-context-3.1.xsd">  
  
<!-- <context:component-scan  base-package="com.myapp.core.jsr330"/> -->  
  
<!-- <context:annotation-config /> -->  
  
  
<bean class="org.springframework.context.annotation.CommonAnnotationBeanPostProcessor" />  
<bean id="personService" class="com.myapp.core.annotation.init.PersonService">  
          <property name="message" value="123"></property>  
</bean>  
  
  
  
</beans>  
```

同样可以得到以上测试的输出结果。

## 第二种是：通过 在xml中定义init-method 和  destroy-method方法

bean配置：

```
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
 
http://www.springframework.org/schema/beans/spring-beans.xsd">
 
    <bean id="myBean" class="com.hmkcode.spring.beans.MyBean">
        <property name="name" value="xmlBean" />
    </bean>
 
    <bean id="anotherBean" class="com.hmkcode.spring.beans.AnotherBean" init-method="init" destroy-method="destory">
                <property name="myBean" ref="myBean" />
    </bean>
</beans>
```

AnotherBean.java

```
package com.hmkcode.spring.beans;
 
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Component;
 
public class AnotherBean {
 
    private MyBean myBean;
 
    public MyBean getMyBean() {
        return myBean;
    }
    public void setMyBean(MyBean myBean) {
        this.myBean = myBean;
    }
 
    public void init(){
        System.out.println("AnotherBean :I'm  init  method  using init-method");
    }
    public void destory(){
        System.out.println("AnotherBean :I'm  destory  method  using destory-method");
    }
}
```

## 第三种是： 通过bean实现InitializingBean和 DisposableBean接口

```

public class MyBean implements InitializingBean,DisposableBean {
 
    private String name;
 
    public String getName() {
        return name;
    }
 
    
    public void setName(String name) {
        this.name = name;
    }
    public void afterPropertiesSet() throws Exception {
        System.out.println("init ======");
    }
    public void destroy() throws Exception {
        System.out.println("destroy ======");
    }
}
```

来源： <http://blog.csdn.net/topwqp/article/details/8681497>