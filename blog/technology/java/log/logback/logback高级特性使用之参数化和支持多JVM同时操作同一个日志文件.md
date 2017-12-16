# logback高级特性使用之参数化和支持多JVM同时操作同一个日志文件

  

## 参数化

 

logback支持类似于占位符的变量替换功能，即如果输出的msg里面带有{}符号且括号中间不带其他字符，那么logback在构造LoggingEvent的时候，会用MessageFormat类来格式化msg，将{}替换成具体的参数值。

示例如下：

*logger*.info("{},it's OK.","Hi");

则输出结果如下：

Hi,it's OK.

 

## 支持多JVM同时操作同一个日志文件

 

如果多个jvm同时操作同一个日志文件，则需要使用下面的方式

```xml
<appender name="FILE" class= "ch.qos.logback.core.rolling.RollingFileAppender">  
            <!-- 支持多JVM同时操作同一个日志文件 -->  
            <prudent>true</prudent>  
            <!-- 按天来回滚，如果需要按小时来回滚，则设置为{yyyy-MM-dd_HH} -->  
            <rollingPolicy class="ch.qos.logback.core.rolling.TimeBasedRollingPolicy">  
                 <fileNamePattern>/opt/log/testC.%d{yyyy-MM-dd}.%i.log</fileNamePattern>  
                 <!-- 如果按天来回滚，则最大保存时间为1天，1天之前的都将被清理掉 -->  
                 <maxHistory>30</maxHistory>  
                 <!-- 按时间回滚的同时，按文件大小来回滚 -->  
                 <timeBasedFileNamingAndTriggeringPolicy  
                      class="ch.qos.logback.core.rolling.SizeAndTimeBasedFNATP">  
                      <maxFileSize>100MB</maxFileSize>  
                 </timeBasedFileNamingAndTriggeringPolicy>  
            </rollingPolicy>  
             
            <!-- 日志输出格式 -->  
            <layout class="ch.qos.logback.classic.PatternLayout">  
                 <Pattern>%d{yyyy-MM-dd HH:mm:ss.SSS} [%thread] %-5level %logger{36}  
                     -%msg%n</Pattern>  
            </layout>  
</appender>  
```

有几点要注意：

1.如果多JVM同时操作同一个文件，则会出现日志不回滚、打出的日志串掉的场景。

2.如果按小时来回滚，并且一个小时内并没有业务日志输出，那么这个小时的日志文件是不会生成的，会跳过这个小时的日志文件的生成。<maxHistory>也是同样的，如果隔一段时间没有输出日志，前面过期的日志不会被删除，只有再重新打印日志的时候，会触发删除过期日志的操作。

3.官方给的说明如下：如果使用prudent模式，FileAppender将安全的写入到指定文件，即使存在运行在不同机器上的、其他JVM中运行的其他FileAppender实例。Prudent模式更依赖于排他文件锁，经验表明加了文件锁后，写日志的开始是正常的3倍以上。当prudent模式关闭时，每秒logging event的吞吐量为100,000，当prudent模式开启时，大约为每秒33,000。

4.如果日志打印较多，则可能会出现将硬盘撑爆的情况，还是建议使用*FixedWindowRollingPolicy*回滚策略，这种策略固定了日志文件大小，超出则回滚。业务上出现了多个jvm同时操作同一个日志文件，仍建议每个jvm只操作一个日志文件。





http://blog.csdn.net/chenjie2000/article/details/8881581