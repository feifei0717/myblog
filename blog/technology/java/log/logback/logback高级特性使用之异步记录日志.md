# logback高级特性使用之异步记录日志



**异步记录日志**

注意：该功能需要高版本才能支持，如1.0.11。

AsyncAppender，异步记录日志。

## 工作原理：

当Logging Event进入AsyncAppender后，AsyncAppender会调用appender方法，append方法中在将event填入Buffer(这里选用的数据结构为BlockingQueue)中前，会先判断当前buffer的容量以及丢弃日志特性是否开启，当消费能力不如生产能力时，AsyncAppender会超出Buffer容量的Logging Event的级别，进行丢弃，作为消费速度一旦跟不上生产速度，中转buffer的溢出处理的一种方案。AsyncAppender有个线程类Worker，它是一个简单的线程类，是AsyncAppender的后台线程，所要做的工作是：从buffer中取出event交给对应的appender进行后面的日志推送。

从上面的描述中可以看出，AsyncAppender并不处理日志，只是将日志缓冲到一个BlockingQueue里面去，并在内部创建一个工作线程从队列头部获取日志，之后将获取的日志循环记录到附加的其他appender上去，从而达到不阻塞主线程的效果。因此AsynAppender仅仅充当事件转发器，必须引用另一个appender来做事。
在使用AsyncAppender的时候，有些选项还是要注意的。由于使用了BlockingQueue来缓存日志，因此就会出现队列满的情况。正如上面原理中所说的，在这种情况下，AsyncAppender会做出一些处理：默认情况下，如果队列80%已满，AsyncAppender将丢弃TRACE、DEBUG和INFO级别的event，从这点就可以看出，该策略有一个惊人的对event丢失的代价性能的影响。另外其他的一些选项信息，也会对性能产生影响，下面列出常用的几个属性配置信息：

| 属性名                 | 类型      | 描述                                       |
| ------------------- | ------- | ---------------------------------------- |
| queueSize           | int     | BlockingQueue的最大容量，默认情况下，大小为256。         |
| discardingThreshold | int     | 默认情况下，当BlockingQueue还有20%容量，他将丢弃TRACE、DEBUG和INFO级别的event，只保留WARN和ERROR级别的event。为了保持所有的events，设置该值为0。 |
| includeCallerData   | boolean | 提取调用者数据的代价是相当昂贵的。为了提升性能，默认情况下，当event被加入到queue时，event关联的调用者数据不会被提取。默认情况下，只有"cheap"的数据，如线程名。 |

默认情况下，event queue配置最大容量为256个events。如果队列被填满，应用程序线程被阻止记录新的events，直到工作线程有机会来转发一个或多个events。因此队列深度需要根据业务场景进行相应的测试，做出相应的更改，以达到较好的性能。

## 配置示例

下面给出一个使用的配置示例：

```xml
<appender name="FILE" class= "ch.qos.logback.core.rolling.RollingFileAppender">  
            <!-- 按天来回滚，如果需要按小时来回滚，则设置为{yyyy-MM-dd_HH} -->  
            <rollingPolicy class="ch.qos.logback.core.rolling.TimeBasedRollingPolicy">  
                 <fileNamePattern>/opt/log/test.%d{yyyy-MM-dd}.log</fileNamePattern>  
                 <!-- 如果按天来回滚，则最大保存时间为1天，1天之前的都将被清理掉 -->  
                 <maxHistory>30</maxHistory>  
            <!-- 日志输出格式 -->  
            <layout class="ch.qos.logback.classic.PatternLayout">  
                 <Pattern>%d{yyyy-MM-dd HH:mm:ss.SSS} [%thread] %-5level %logger{36} -%msg%n</Pattern>  
            </layout>  
</appender>  
     <!-- 异步输出 -->  
     <appender name ="ASYNC" class= "ch.qos.logback.classic.AsyncAppender">  
            <!-- 不丢失日志.默认的,如果队列的80%已满,则会丢弃TRACT、DEBUG、INFO级别的日志 -->  
            <discardingThreshold >0</discardingThreshold>  
            <!-- 更改默认的队列的深度,该值会影响性能.默认值为256 -->  
            <queueSize>512</queueSize>  
            <!-- 添加附加的appender,最多只能添加一个 -->  
         <appender-ref ref ="FILE"/>  
     </appender>  
       
     <root level ="trace">  
            <appender-ref ref ="ASYNC"/>  
     </root>  
```





http://blog.csdn.net/chenjie2000/article/details/8902727