[TOC]



# Spring Aware相关接口介绍

Aware，是感应和感知的意思。当bean实现了对应的Aware接口时，BeanFactory会在生产bean时根据它所实现的Aware接口，给bean注入对应的属性，从而让bean获取外界的信息，也可以让开发者取得一些相对的资源。

Spring提供了一堆Aware接口：

![这里写图片描述](http://img.blog.csdn.net/20170410194744661?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvc29vbmZseQ==/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)

  

下面列出几个主要Aware接口作用：

## org.springframework.context.ApplicationContextAware接口:

实现类的实例将会获取ApplicationContext的引用,因此可以编程式的使用ApplicationContext手动创建bean.

```java
public interface ApplicationContextAware {
    void setApplicationContext(ApplicationContext applicationContext) throws BeansException;
}
```

自Spring2.5起，可使用自动装配模式获取ApplicationContext引用：

```java
@RestController
public class HelloWorldController2 {
    @Autowired
    ApplicationContext applicationContext;

    @RequestMapping("/helloworld")
    public String helloWorld() {
        System.out.println("通过applicationContext获取的bean实例："
                + applicationContext.getBean("helloService1"));
        return "Hello World!";
    }
}
```



### 实际应用：

通过实现ApplicationContextAware接口获取bean

场景：

在代码中需要动态获取其它bean

实例代码：

```java
import org.springframework.beans.BeansException;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationContextAware;

/**
 * 获取spring容器，以访问容器中定义的其他bean
 */
public class SpringContextUtil implements ApplicationContextAware {

	// Spring应用上下文环境
	private static ApplicationContext applicationContext;

	/**
	 * 实现ApplicationContextAware接口的回调方法，设置上下文环境
	 */
	public void setApplicationContext(ApplicationContext applicationContext)
			throws BeansException {
		SpringContextUtil.applicationContext = applicationContext;
	}

	public static ApplicationContext getApplicationContext() {
		return applicationContext;
	}

	/**
	 * 获取对象 这里重写了bean方法，起主要作用
	 * 
	 * @param name
	 * @return  Object 一个以所给名字注册的bean的实例
	 * @throws BeansException
	 */
	public static Object getBean(String beanId) throws BeansException {
		return applicationContext.getBean(beanId);
	}
}
```

Bean配置：

```
<beanid="SpringContextUtil"class="org.company.xxx.SpringContextUtil"/>
```

**注：**

**1、实现了ApplicationContextAware接口，在Bean的实例化时会自动调用setApplicationContext()方法!**

**2、通过调用静态方法getBean即可获取**



## org.springframework.beans.factory.BeanNameAware接口:

在bean内部，它并不知道容器给自己取了个什么id，如果想要获取自己在容器中的id，可以实现BeanNameAware接口获取。其setBeanName(string name)方法的参数就是容器为该bean注入的它本身的id。

```
public interface BeanNameAware {
    void setBeanName(string name) throws BeansException;
}
```

## org.springframework.beans.factory.BeanFactoryAware 接口：

实现类的实例将会获取BeanFactoryAware的引用。BeanFactoryAware 接口中只有一个方法setBeanFactory(BeanFactory beanFactory)。用法和ApplicationContextAware类似。

## 举个例子：

现在新建一个AwareTest类，实现了BeanNameAware和ApplicationContextAware接口，代码如下：

```java
import org.springframework.beans.BeansException;
import org.springframework.beans.factory.BeanFactory;
import org.springframework.beans.factory.BeanFactoryAware;
import org.springframework.beans.factory.BeanNameAware;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationContextAware;

import com.practice.spring.entity.FootballPlayer;

public class AwareTest implements BeanNameAware, ApplicationContextAware, BeanFactoryAware {
    String             beanname;
    ApplicationContext appct;
    BeanFactory        bFactory;

    @Override
    public void setBeanName(String name) {
        this.beanname = name;
        System.out.println("通过BeanNameAware接口的实现，我知道我的名字是：" + this.beanname);
    }

    @Override
    public void setApplicationContext(ApplicationContext applicationContext) throws BeansException {
        this.appct = applicationContext;
        System.out.println("通过ApplicationContextAware接口实现，获得了容器对象："
                           + this.appct.toString().substring(0, 35) + "......");
        FootballPlayer player = appct.getBean("messi", FootballPlayer.class);
        player.setName("maladona");
        player.pass();
        player.shoot();
    }

    @Override
    public void setBeanFactory(BeanFactory beanFactory) throws BeansException {
        this.bFactory = beanFactory;
        System.out.println("通过BeanFactoryAware接口实现，获得了容器对象："
                           + this.bFactory.toString().substring(0, 35) + "......");
    }
}
```

FootballPlayer类：

```java
public class FootballPlayer {
    private String name;
    private String team;


    public String getTeam() {
        return team;
    }

    public void setTeam(String team) {
        this.team = team;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;

    }
    public void pass() {
        System.out.println("pass");
    }

    public void shoot() {
        System.out.println("shoot");
    }
}

```

beans.xml：

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
 
http://www.springframework.org/schema/beans/spring-beans.xsd">

    <bean id="messi" class="com.practice.spring.entity.FootballPlayer">
        <property name="name" value="Messi"></property>
        <property name="team" value="Barcelona"></property>
    </bean>
    <bean id="aware_suibianqu" class="com.practice.spring.aware.AwareTest" />
</beans>
```

在程序中调用：`new ClassPathXmlApplicationContext("beans.xml");`初始化容器和bean时，输出结果：

> 通过BeanNameAware接口的实现，我知道我的名字是：aware_suibianqu 
> 通过BeanFactoryAware接口实现，获得了容器对象：org.springframework.beans.factory.s…… 
> 通过ApplicationContextAware接口实现，获得了容器对象：org.springframework.context.support…… 
> maladona边路传中 maladona射门





http://blog.csdn.net/soonfly/article/details/70017238