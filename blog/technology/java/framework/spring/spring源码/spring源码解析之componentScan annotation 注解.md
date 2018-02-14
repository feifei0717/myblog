[TOC]



# spring源码解析之componentScan annotation 注解

主要用来记录源码位置方便需要了解的时候可以直接定位

源码位置：

## componentScan注解方式

处理分析componentScan注解的实现类 ComponentScanAnnotationParser.parse



## xml配置context:component-scan方式

源码位置:

ComponentScanBeanDefinitionParser.parse 





## 说明：

最终都会调用 ClassPathBeanDefinitionScanner.doScan 方法

就是把指定目录的所有类都读出来，一个一个循环解析包含注解的类。springboot没有写包范 围默认是启动类 app类的目录。