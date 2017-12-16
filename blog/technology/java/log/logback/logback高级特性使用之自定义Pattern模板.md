# logback高级特性使用之自定义Pattern模板

**自定义Pattern模板**

创建自定义格式转换符有两步：

**1.写一个转换器类，继承ClassicConvert**

示例代码：

```java
package com.cj.log;  
  
import ch.qos.logback.classic.pattern.ClassicConverter;  
import ch.qos.logback.classic.spi.ILoggingEvent;  
  
public class IpConvert extends ClassicConverter {  
  
    @Override  
    public String convert(ILoggingEvent event) {  
        return "10.10.10.10";  
    }  
}  
```

**2.在logback.xml中注册该转换器，并自定义转换符**

注册：

```
<conversionRule conversionWord="ip" converterClass="com.cj.log.IpConvert" />
```

自定义ip转换符：

```
<Pattern>%d{yyyy-MM-dd HH:mm:ss.SSS}%ip [%thread] %-5level %logger{36} -% msg%n</Pattern>
```

经过这两步骤后，即可将自定义的ip转换符添加到输出模板当中了。

测试结果：

2013-04-01 15:25:16.887 10.10.10.10 [main] ERROR c.s.f.log.normal.TestAppender

这里的10.10.10.10便是转换后的值了。

上面的步骤只是基本的自定义模板方法，不好的地方就是要在配置文件里注册，实际上只要模仿logback原生创建的方法把这个转换符加进去就可以了。可以看下PatternLayout.java源码：

```Java
public class PatternLayout extends PatternLayoutBase<ILoggingEvent> {  
  public static final Map<String, String> defaultConverterMap = new HashMap<String, String>();  
  static {  
    defaultConverterMap.putAll(Parser.DEFAULT_COMPOSITE_CONVERTER_MAP);  
    defaultConverterMap.put("d",DateConverter.class.getName());  
    defaultConverterMap.put("date",DateConverter.class.getName());  
    defaultConverterMap.put("r",RelativeTimeConverter.class.getName());  
    defaultConverterMap.put("relative",RelativeTimeConverter.class.getName());  
     ...  
```

现在只需在这个static方法快里加上一句：
*defaultConverterMap*.put("ip",IpConvert.**class**.getName());
即可。"ip"是转换的字符，IpConvert是上面定义的转换器类。但如何添加进去呢？下面便是一种实现方案：

首先，定义一个类，该类继承PatternLayout.java：

```Java
package com.cj.log;  
import ch.qos.logback.classic.PatternLayout;  
public class MyPatternLayout extends PatternLayout {  
    static {  
        defaultConverterMap.put("ip",IpConvert.class.getName());  
    }  
}  
```

直接调用父类的属性，将自定义的转换符添加进去。IpConvert便是上面已实现的转换器。

**之后，便是在logback.xml中配置我们自定义的PatternLayout：**

```Xml
<!-- 日志输出格式 -->  
<layout class="com.cj.log.MyPatternLayout">  
      <Pattern>%d{yyyy-MM-dd HH:mm:ss.SSS} %ip [%thread] %-5level %logger{36} -%msg%n</Pattern>  
</layout>  
```

原先的layout的class类为"**ch.qos.logback.classic.PatternLayout**"，这里换成我们自定义的即可。

 

通过上述两种方案，便可实现自定义模板的功能。这种功能使用的一种场景便是在集群的环境下进行日志的分析，通常分析异常日志的时候，并不能准确定位到底是哪台主机上的哪个server出了错，如果添加了ip地址信息到日志中去，那么日志分析工作讲会变得更加准确高效。如果有类似于监控平台这样的系统，那么便可将所有的异常日志统一进行分析，只需在输出中定义一些类似于主机ip、系统应用id之类的区别的变量，这样处理的好处自然不言而喻。





http://blog.csdn.net/chenjie2000/article/details/8892764