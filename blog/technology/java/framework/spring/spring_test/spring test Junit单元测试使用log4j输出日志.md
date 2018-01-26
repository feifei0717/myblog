[TOC]



# Junit单元测试使用log4j输出日志

​      Junit+spring+log4j整合之所以麻烦，是因为spring与log4j的整合，是放在web.xml里的，随tomcat启动后，spring才会加载log4j，而用junit测试是不需要tomcat启动的，所以Junit与log4j的整合才比较费劲。Junit使用spring时，若spring没加载到log4j就会报以下警告： 

```
log4j:WARN No appenders could be found for logger(org.springframework.test.context.junit4.SpringJUnit4ClassRunner).  
log4j:WARN Please initialize the log4j system properly.  
log4j:WARN See http://logging.apache.org/log4j/1.2/faq.html#noconfig for more info.
```

## 解决办法1：最简单粗暴的方法

​      将log4j配置文件放到src根目录下，这是由于spring加载log4j默认从src目录里找。Junit代码如下：

```
@RunWith(SpringJUnit4ClassRunner.class)  
@ContextConfiguration(locations = { "classpath:com/config/springConfig.xml" })  
@Transactional  
@TransactionConfiguration(transactionManager = "transactionManager", defaultRollback = true)  
public class TestHibernate {  
    ...  
}  
```

​       这种方法，虽然直接简单，但很多项目中喜欢把所有配置文件进行统一管理并分类汇总到不同的文件夹下，例如：将所有配置文件放到com.config包下。那么测试的时候就还得手动将log4j.properties或log4j.xml移动到根目录下，但这么做，项目简单还行，如果是大型项目，需要加载很多配置文件时，还是恨麻烦也容易出问题的。因此并不推荐。 

## 解决办法2：推荐方法

​      新建JUnit4ClassRunner类：

```
public class JUnit4ClassRunner extends SpringJUnit4ClassRunner {  
    static {  
        try {  
            Log4jConfigurer.initLogging("classpath:com/config/log4j.properties");  
        } catch (FileNotFoundException ex) {  
            System.err.println("Cannot Initialize log4j");  
        }  
    }  
    public JUnit4ClassRunner(Class<?> clazz) throws InitializationError {  
        super(clazz);  
    }  
}  
```

​      引用此类：

```
@RunWith(JUnit4ClassRunner.class)  
@ContextConfiguration(locations = "classpath:com/config/springConfig.xml")  
@Transactional  
@TransactionConfiguration(transactionManager = "transactionManager", defaultRollback = true)  
public class TestHibernate {  
    ...  
}  
```

​      这样，在启动Junit测试时，spring就会加载log4j了。而且保持了灵活性。 
​      PS：Junit加载spring的runner（SpringJUnit4ClassRunner）要优先于spring加载log4j，因此采用普通方法，无法实现spring先加载log4j后被Junit加载。所以我们需要新建JUnit4ClassRunner类，修改SpringJUnit4ClassRunner加载log4j的策略。这样加载log4j就会优先于加载spring了。



http://coffee-yan.iteye.com/blog/2175441