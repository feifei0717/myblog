[TOC]



## Spring的作用域RequestContextListener–org.springframework.web.context.request.RequestContextListener 的作用

## 说明

在Spring2.0中除了以前的Singleton和Prototype外又加入了三个新的web作用域，分别为request、session和global session，如果你想让你的容器里的某个bean拥有其中某种新的web作用域，除了在bean级上配置相应的scope属性，还必须在容器级做一个额外的初始化配置。 

## 一、配置方式 

Java代碼  

```
<web-app>  
  
      <listener>  
            <listener-class>org.springframework.web.context.request.RequestContextListener</listener-class>  
      </listener>  
  
</web-app>  
```

如果你用的是早期版本的web容器（Servlet 2.4以前），那麽你要使用一个javax.servlet.Filter的实现。  

Java代碼  

```
<web-app>  
...  
    <filter>  
        <filter-name>requestContextFilter</filter-name>  
        <filter-class>org.springframework.web.filter.RequestContextFilter</filter-class>  
    </filter>  
    <filter-mapping>  
        <filter-name>requestContextFilter</filter-name>  
        <url-pattern>/*</url-pattern>  
    </filter-mapping>  
...  
</web-app> 
```

两种方式完成完全一样的功能：基于LocalThread将HTTP request对象绑定到为该请求提供服务的线程上。这使得具有request和session作用域的bean能够在后面的调用链中被访问到。 

Request作用域 

```
<bean id="loginAction" class="com.foo.LoginAction" scope="request"/> 
```

针对每次HTTP请求，Spring容器会根据loginAction bean定义创建一个全新的LoginAction bean实例，且该loginAction bean实例仅在当前HTTP request内有效，因此可以根据需要放心的更改所建实例的内部状态，而其他请求中根据loginAction

bean定义创建的实例，将不会看到这些特定于某个请求的状态变化。当处理请求结束，request作用域的bean实例将被销毁。

Session作用域 

```
<bean id="userPreferences" class="com.foo.UserPreferences" scope="session"/> 
```

针对某个HTTP Session，Spring容器会根据userPreferences bean定义创建一个全新的userPreferences bean实例，且该userPreferences bean仅在当前HTTP Session内有效。与request作用域一样，你可以根据需要放心的更改所创建实例的内部状态，而别的HTTP

Session中根据userPreferences创建的实例，将不会看到这些特定于某个HTTP Session的状态变化。当HTTP Session最终被废弃的时候，在该HTTP Session作用域内的bean也会被废弃掉。 
global session作用域 

```
<bean id="userPreferences" class="com.foo.UserPreferences" scope="globalSession"/> 
```

global session作用域类似于标准的HTTP Session作用域，不过它仅仅在基于portlet的web应用中才有意义。Portlet规范定义了全局Session的概念，它被所有构成某个portlet web应用的各种不同的portlet所共享。在global

session作用域中定义的bean被限定于全局portlet Session的生命周期范围内。 

请注意，假如你在编写一个标准的基于Servlet的web应用，并且定义了一个或多个具有global session作用域的bean，系统会使用标准的HTTP Session作用域，并且不会引起任何错误

## 二、為什麼需要額外的配置RequestContextFilter 

也许会有一个疑问，已经通过ContextLoaderListener(或ContextLoaderServlet)将Web容器与Spring容器整合，为什麽这裡还要用额外的RequestContextListener以支持Bean的另外3个作用域，原因是ContextLoaderListener实现ServletContextListener监听器介面，而ServletContextListener只负责监听Web容器的启动和关闭的事件。RequestContextFilter实现ServletRequestListener监听器介面，该监听器监听HTTP请求事件，Web伺服器接收的每次请求都会通知该监听器。通过配置RequestContextFilter，Spring容器与Web容器结合的更加密切。 
三、作用域依賴問題 

如果將Web相關作用域的Bean注入到singleton或prototype的Bean中，這種情況下，需要Spring AOP 

Java代碼  

```
<bean name="car" class="com.demo.Car" scope="request">  
    <aop:scoped-proxy/>  
</bean>  
<bean id="boss" class="com.demo.Boss" >  
    <properrty name="car" ref="car" />  
</bean>  
```





http://www.xuebuyuan.com/zh-tw/1775659.html