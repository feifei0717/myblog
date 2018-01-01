[TOC]



# Spring扩展点BeanDefinitionRegistryPostProcessor

## 前言

Spring的设计非常优雅，对修改关闭对扩展开放，今天学习一下Spring其中之一扩展点——BeanDefinitionRegistryPostProcessor。

## 说明

当我们用Spring来管理应用，我们会让Spring来管理所有的Bean。除了注解、Java配置和XML配置的方式来创建Bean，还有另外一种方式来创建我们的`BeanDefinition`。

通过`BeanDefinitionRegistryPostProcessor`可以创建一个特别后置处理器来将`BeanDefinition`添加到`BeanDefinitionRegistry`中。它和`BeanPostProcessor`不同，`BeanPostProcessor`只是在Bean初始化的时候有个钩子让我们加入一些自定义操作；而`BeanDefinitionRegistryPostProcessor`可以让我们在`BeanDefinition`中添加一些自定义操作。这就跟类与类实例之间的区别类似。

也就是说`BeanDefinitionRegistryPostProcessor`的作用就是可以让我们对`BeanDefinition`进行一些后置的自定义操作，这就是对扩展开放原则。

## 一个简单的例子

我们创建一个自定义的后置处理器，它实现了`BeanDefinitionRegistryPostProcessor`接口，然后实现它的`postProcessBeanDefinitionRegistry`方法，在此方法中对我们自己的`BeanDefinition`进行注册。

```java
import org.springframework.beans.BeansException;
import org.springframework.beans.factory.config.BeanDefinition;
import org.springframework.beans.factory.config.ConfigurableListableBeanFactory;
import org.springframework.beans.factory.support.BeanDefinitionRegistry;
import org.springframework.beans.factory.support.BeanDefinitionRegistryPostProcessor;
import org.springframework.beans.factory.support.RootBeanDefinition;
import org.springframework.stereotype.Component;

@Component
public class CustomServiceRegistryPostProcessor
        implements BeanDefinitionRegistryPostProcessor {

    @Override
    public void postProcessBeanDefinitionRegistry(BeanDefinitionRegistry registry)
            throws BeansException {

        //也就是把自己定义的bean注册到spring中.让spring管理
        RootBeanDefinition beanDefinition =
                new RootBeanDefinition(MyServiceImpl.class); //Service实现
        beanDefinition.setTargetType(MyService.class); //Service接口
        beanDefinition.setRole(BeanDefinition.ROLE_APPLICATION);
        registry.registerBeanDefinition("myBeanName", beanDefinition );
    }

    @Override
    public void postProcessBeanFactory(ConfigurableListableBeanFactory beanFactory) throws BeansException {
    }
}
```

## 应用

在Mybatis与Spring的整合中，就利用到了`BeanDefinitionRegistryPostProcessor`来对Mapper的`BeanDefinition`进行了后置的自定义处理。

在Spring的配置文件中，我们会配置以下代码来扫描Mapper：

```xml
<bean class="org.mybatis.spring.mapper.MapperScannerConfigurer">
	<property name="basePackage" value="com.rason.nba.mapper" />
	<property name="sqlSessionFactoryBeanName" value="sqlSessionFactory"></property>
</bean>
```

其中`org.mybatis.spring.mapper.MapperScannerConfigurer`类就实现了`BeanDefinitionRegistryPostProcessor`接口来对Mapper进行自定义的注册操作。

```java
// 代码有删减
public class MapperScannerConfigurer implements BeanDefinitionRegistryPostProcessor{
    public void postProcessBeanDefinitionRegistry(BeanDefinitionRegistry registry) throws BeansException {
	    ClassPathMapperScanner scanner = new ClassPathMapperScanner(registry);
	    scanner.scan(StringUtils.tokenizeToStringArray(this.basePackage, 
  	}
}

public class ClassPathMapperScanner extends ClassPathBeanDefinitionScanner {
	@Override
    public Set<BeanDefinitionHolder> doScan(String... basePackages) {
 		Set<BeanDefinitionHolder> beanDefinitions = super.doScan(basePackages);//首先调用Spring默认的扫描装配操作
	    if (beanDefinitions.isEmpty()) {
	
		} else {
			for (BeanDefinitionHolder holder : beanDefinitions) {//然后循环对每一个BeanDefinition进行一些自定义的操作
				GenericBeanDefinition definition = (GenericBeanDefinition) holder.getBeanDefinition();
				definition.getPropertyValues().add("mapperInterface", definition.getBeanClassName());
        		definition.setBeanClass(MapperFactoryBean.class);
        		definition.getPropertyValues().add("addToConfig", this.addToConfig);
			}
		}
    }
}
```

## 总结

`BeanDefinitionRegistryPostProcessor`提供了让我们对BeanDefinition进行自定义注册的方法，如果Spring中的默认配置方式不能满足你的要求，就可以通过实现`BeanDefinitionRegistryPostProcessor`接口来进行扩展。





http://rason.me/2016/12/16/BeanDefinitionRegistryPostProcessor/