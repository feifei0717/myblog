# 1 问题描述

当使用Spring AOP对Controller层的Controller类的方法进行切面拦截，不起作用。AOP配置没有任何问题。

# 2 排查过程

1. Spring AOP配置没有任何问题；【正常】
2. 断点调试：Spring源码断点调试，在调用Controller方法时，Controller的实例被JDK进行动态代理了；【不正常】
3. Spring默认的代理方式为JDK动态代理；【正常】

# 3 解决问题

AOP有的人说拦截不到Controller。有的人说想拦AnnotationMethodHandlerAdapter截到Controller必须得拦截`org.springframework.web.servlet.mvc.annotation.AnnotationMethodHandlerAdapter`。

首先AOP可以拦截到Controller的，这个是毋容置疑的其次须拦截AnnotationMethodHandlerAdapter也不是必须的。最起码我没有验证成功过这个。这个方式就不在这儿介绍说明了。

AOP之所以有的人说拦截不到Controller,原因是该注解的Controller已被spring容器内部代理了。我们只要把它交给cglib代理就可以了。Spring MVC的配置文件dispatcher-servlet.xml：

```
<!-- 通知spring使用cglib而不是jdk的来生成代理方法 AOP可以拦截到Controller -->
<aop:aspectj-autoproxy proxy-target-class="true" />
```

# 4 问题总结

Spring MVC 和 Spring 整合的时候，SpringMVC的dispatcher-servlet.xml文件中配置扫描包，不要包含 service的注解，Spring的applicationContext.xml文件中配置扫描包时，不要包含controller的注解，如下所示：

**Spring MVC dispatcher-servlet.xml：**

```
    <context:component-scan base-package="com.qding">
        <context:exclude-filter type="annotation" expression="org.springframework.stereotype.Service"/>
    </context:component-scan>
```

Spring MVC启动时的配置文件，包含组件扫描、url映射以及设置freemarker参数，让spring不扫描带有@Service注解的类。为什么要这样设置？因为springmvc.xml与applicationContext.xml不是同时加载，如果不进行这样的设置，那么，spring就会将所有带@Service注解的类都扫描到容器中，等到加载applicationContext.xml的时候，会因为容器已经存在Service类，使得cglib将不对Service进行代理，直接导致的结果就是在applicationContext 中的事务配置不起作用，发生异常时，无法对数据进行回滚。以上就是原因所在。

**同样的在Spring的applicationContext.xml配置如下：**

```
    <context:component-scan base-package="com.qding">           
        <context:exclude-filter type="annotation" expression="org.springframework.stereotype.Controller"/>
    </context:component-scan>
```

**<context:component-scan/> 扫描指定的包中的类上的注解，常用的注解有：**

```
@Controller 声明Action组件
@Service    声明Service组件    @Service("myMovieLister") 
@Repository 声明Dao组件
@Component   泛指组件, 当不好归类时. 
@RequestMapping("/menu")  请求映射
@Resource  用于注入，( j2ee提供的 ) 默认按名称装配，@Resource(name="beanName") 
@Autowired 用于注入，(srping提供的) 默认按类型装配 
@Transactional( rollbackFor={Exception.class}) 事务管理
@ResponseBody@Scope("prototype")   设定bean的作用域
```

来源： http://my.oschina.net/xianggao/blog/524805