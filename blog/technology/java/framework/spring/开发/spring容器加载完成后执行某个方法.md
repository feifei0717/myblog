[TOC]

# spring 容器加载完成后执行某个方法

## **理论**

　　刚好再开发过程中遇到了要在项目启动后自动开启某个服务，由于使用了spring，我在使用了spring的listener，它有**onApplicationEvent**（）方法，**在Spring容器将所有的Bean都初始化完成之后，就会执行该方法**。

Spring中默认存在的事件有

> - ContextStartedEvent：ApplicationContext启动后触发的事件
> - ContextStoppedEvent：ApplicationContext停止后触发的事件
> - ContextRefreshedEvent：ApplicationContext初始化或刷新完成后触发的事件
> - ContextClosedEvent：ApplicationContext关闭后触发的事件

详情请查看 : Spring中的事件机制(直接本博客搜索)

## 应用场景

很多时候我们想要在某个类加载完毕时干某件事情，但是使用了spring管理对象，我们这个类引用了其他类（可能是更复杂的关联），所以当我们去使用这个类做事情时发现包空指针错误，这是因为我们这个类有可能已经初始化完成，但是引用的其他类不一定初始化完成，所以发生了空指针错误，

解决方案如下： 
1、写一个类实现spring的ApplicationListener接口监听，并监控ContextRefreshedEvent事件 
2、定义简单的bean：\<bean id="beanDefineConfigue" class="com.creatar.portal.webservice.BeanDefineConfigue">\</bean> 
或者直接使用@Service注解方式 

　　  

## 实例

这里就只给出直接使用**注解**的方式

1、编写一个实现ApplicationListener的listener类

```java
import org.springframework.context.ApplicationListener;
import org.springframework.context.event.ContextRefreshedEvent;
import org.springframework.stereotype.Service;

@Service
public class StartAddDataListener implements ApplicationListener<ContextRefreshedEvent> {

    @Override
    public void onApplicationEvent(ContextRefreshedEvent event) {
        if (event.getApplicationContext().getParent() == null)//root application context 没有parent，他就是老大.
        {
            //需要执行的逻辑代码，当spring容器初始化完成后就会执行该方法。
            System.out.println("\n\n\n\n\n______________\n\n\n加载了\n\n_________\n\n");
        }
    }
}
```

 

2、在配置文件（applicationContext-servlet.xml）中设置Service扫描的包

```xml
<!-- 注册@Controller 、@Service-->
    <context:component-scan base-package="com.test.controller" use-default-filters="false">
        <context:include-filter type="annotation" expression="org.springframework.stereotype.Controller" />
        <context:include-filter type="annotation" expression="org.springframework.stereotype.Service" />
    </context:component-scan>
    
```

3、部署启动项目，即可在加载完spring后就打印出 “加载”

## 知识扩展：

```xml
<?xml version="1.0" encoding="UTF-8" ?> 
<beans xmlns="http://www.springframework.org/schema/beans"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xmlns:context="http://www.springframework.org/schema/context"
    xsi:schemaLocation="http://www.springframework.org/schema/beans
                http://www.springframework.org/schema/beans/spring-beans-2.5.xsd
        http://www.springframework.org/schema/context
        http://www.springframework.org/schema/context/spring-context-2.5.xsd"> 
   
    <context:component-scan base-package=”com.eric.spring”>   
</beans>  
```

**component-scan**标签默认情况下自动扫描指定路径下的包（含所有子包），将**带有@Component、@Repository、@Service、@Controller标签的类自动注册到spring容器**。对标记了 Spring's @Required、@Autowired、JSR250's @PostConstruct、@PreDestroy、@Resource、JAX-WS's @WebServiceRef、EJB3's @EJB、JPA's @PersistenceContext、@PersistenceUnit等注解的类进行对应的操作使注解生效（包含了annotation-config标签的作用）



可以使用对扫描的标签进行过滤

**context:exclude-filter**：**取消**对被这些标签标示的**类加载**

**context:include-filter**：扫描过程中要**加载**这些类

 

eg：

**1 在主容器中（applicationContext.xml），将Controller的注解打消掉**

```xml
<context:component-scan base-package="com">
  <context:exclude-filter type="annotation" expression="org.springframework.stereotype.Controller" />
</context:component-scan> 
```

  

**2 而在springMVC配置文件中将Service注解给去掉，只加载@Controller **

```xml
<context:component-scan base-package="com">
  <context:include-filter type="annotation" expression="org.springframework.stereotype.Controller" />
  <context:exclude-filter type="annotation" expression="org.springframework.stereotype.Service" />
  </context:component-scan> 
```

 

 

 

http://www.cnblogs.com/0201zcr/p/4720803.html