### **一.XML配置文件形式：**

1.在applicationContext.xml文件中配置bean

注意：业务类SayHello的property属性helloworld在业务类中命名必须一致，且有该属性的get/set方法

```
    <!--第一种方式 这样子最清晰 -->
    <bean id="helloWorldImpl" class="com.impl.HelloWorldImpl"></bean>
    <bean id="sayHello" class="com.say.SayHello">
        <property name="helloWorld" ref="helloWorldImpl"></property>
    </bean>
    <!--第二种方式 直接这么设置  更简洁点-->
    <bean id="sayHello" class="com.say.SayHello" autowire="byType"></bean>
```

 2.在Test类中添加HelloWorld类的get/set方法——set注入

```
public class SayHello{    
    private HelloWorld helloWorld;    
        
    public HelloWorld getHelloWorld() {    
            return helloWorld;    
    }    
        
    public void setHelloWorld(HelloWorld helloWorld) {    
            this.helloWorld = helloWorld;    
    }    
}  
```

 3.加载配置文件，获取bean

```
ApplicationContext applicationContext = new ClassPathXmlApplicationContext(  
                new String[] { "classpath:/applicationContext.xml" });  
SayHello sayHello = applicationContext.getBean("sayHello");  
```



### **二.注解形式：**

1.在配置文件中配置spring注解扫描

Xml代码  

```
<context:component-scan base-package="com"/><!---通过该语句可以搜索com及com下子包中的类->    
<mvc:annotation-driven/>   
```

 2.在需要托管的bean的类名上添加注解：@Controller

Java代码  

```
@Repository  
public class HelloWorldImpl implements HelloWorld{}  
```

 3.在业务类中调用上面的托管bean，并在属性上添加注解：@Autowired

Java代码  

```
public class SayHello{  
    @Autowired    
    private HelloWorld hello;    
}  
```

 

**区别：**

1.无须再在配置文件中配置一大堆的bean——（用@Controller/@Service/@Repository/@Component）

2.不用再在调用某个bean的业务类中写该bean的set/get方法——（用@Resource/@Autowired）

3.不用再继续通过加载配置文件后用getBean(“***”)方式来获取某个类的实例

 

### **二.注解形式和XML配置共存：**

在此过程中需要注意注解方式与配置文件配置方式混合使用（由于业务需求的不同，例如注解方式的情况下使用定时器时就存在混合使用的情况）时的命名规范，当使用注解方式时bean在spring bean容器中的id首字母小写的类全名，而通过配置文件配置时id为自定义。

1.在spring配置文件中添加如下配置：

Java代码  

```
<bean id="hello" class="com.impl.HelloWorldImpl" />   
```

   

 2.在托管bean（HelloWorldImpl）上添加注解：

Java代码  

```
@Repository  
public class HelloWorldImpl implements HelloWorld{}  
```

 

 这样HelloWorldImpl在Spring的bean容器中注册了两个实例。即（hello与helloWorldImpl） 

3.在业务类的HelloWorld属性上添加标注：

​    ——即不通过在配置文件中配置hello对应的类，而通过标签自动匹配

Java代码  

```
public class SayHello{  
    @Autowired    
    private HelloWorld hello; //注意此处的属性名不是helloWorld,而是hello  
}  
```

 此时，运行后会报异常：

Java代码  

```
nested exception is org.springframework.beans.factory.NoSuchBeanDefinitionException:     
No unique bean of type [com.HelloWorld] is defined:     
expected single matching bean but found 2: [helloWorld, helloWorldImpl]  
```

 

 

由于此处的指针名为hello，通过自动匹配的方式无法确认具体需要用到哪个实例(因为找到了两个！)

 

在混用的情况下需要对bean实例的命名与bean的名称管理。

上述情况不使用@Controller，直接在配置文件中注册bean（bean的id不为hello），即一个bean在配置文件中注册了两次。

Java代码  

```
<bean id="helloWorldImpl" class="com.remote.impl.HelloWorldImpl"></bean>  
```

 也会出现同样的效果。

 

 

**如果必须使用混用，可以采用四种方式解决该问题：**

(1).在业务类（调用类）的属性名与bean容器中的名称相同

如：

Java代码  

```
public class SayHello{  
    @Autowired    
    private HelloWorld helloWorld; //此处属性名为helloWorld  
} 
```

(2.).去除@Autowired，直接在spring的bean配置文件中指定业务类属性对应的实例名称

Java代码  

```
<bean id="sayHello" class="com.say.SayHello">    
        <property name="hello" ref="helloWorldImpl"></property>    
</bean>    
```

(3).在@Autowired注解后面加上@Qualifie——（因为@Autowired默认是按照类型查找的） 

Java代码  

```
public class SayHello{  
    @Autowired  @Qualifie("hello")  
    private HelloWorld hello; //注意此处的属性名不是helloWorld,而是hello  
}  
```

(4).将@Autowired替换成@Resource——（因为@Resource默认按照名称查找）

Java代码  

```
public class SayHello{  
    @Resource  
    private HelloWorld hello; //注意此处的属性名不是helloWorld,而是hello  
} 
```

 

 

常见错误：

1.通过配置文件配置bean时：

   启动项目时报错：spring找不到该类名

Java代码  

```
Cannot resolve reference to bean 'hessianHelloWorldImpl' while setting bean property 'hello';     
nested exception is org.springframework.beans.factory.NoSuchBeanDefinitionException:     
No bean named 'helloWorldImpl' is defined    
```

 

2.通过注解配置时：

   启动时不会报错，但是调用时会出现空指针异常

 

解决方式：检查配置文件是否有下面两行

Xml代码  

```
<context:component-scan base-package="com"/>  
<mvc:annotation-driven/>  
```

 

来源： <http://zyjustin9.iteye.com/blog/2022712>