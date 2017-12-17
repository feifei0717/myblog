# 详解log4j2(上) - 从基础到实战

原创 2016年04月20日 23:23:39

log4j2相对于log4j 1.x有了脱胎换骨的变化，其官网宣称的优势有多线程异步记录器下10几倍于log4j 1.x和logback的高吞吐量、可配置的审计型日志、基于插件架构的各种灵活配置等。如果已经掌握log4j 1.x，使用log4j2还是非常简单的。

先看一个示例

### 1 基础配置

普通java项目手动添加jar包

```
log4j-api-2.5.jar  
log4j-core-2.5.jar 
```

Maven项目pom.xml

```
<dependencies>  
    <dependency>  
        <groupId>org.apache.logging.log4j</groupId>  
        <artifactId>log4j-api</artifactId>  
        <version>2.5</version>  
    </dependency>  
    <dependency>  
        <groupId>org.apache.logging.log4j</groupId>  
        <artifactId>log4j-core</artifactId>  
        <version>2.5</version>  
    </dependency>  
</dependencies>  
```

测试代码

```
public static void main(String[] args) {  
    Logger logger = LogManager.getLogger(LogManager.ROOT_LOGGER_NAME);  
    logger.trace("trace level");  
    logger.debug("debug level");  
    logger.info("info level");  
    logger.warn("warn level");  
    logger.error("error level");  
    logger.fatal("fatal level");  
}
```

运行后输出

```
ERROR StatusLogger No log4j2 configuration file found. Using default configuration: logging only errors to the console.  
20:37:11.965 [main] ERROR  - error level  
20:37:11.965 [main] FATAL  - fatal level  
```

log4j2默认会在classpath目录下寻找log4j.json、log4j.jsn、log4j2.xml等名称的文件，如果都没有找到，则会按默认配置输出，也就是输出到控制台。

下面我们按默认配置添加一个log4j2.xml，添加到src根目录即可

```重新执行测试代码，可以看到输出结果相同，但是没有再提示找不到配置文件。 来看我们添加的配置文件log4j2.xml，以Configuration为根节点，有一个status属性，这个属性表示log4j2本身的日志信息打印级别。如果把status改为TRACE再执行测试代码，可以看到控制台中打印了一些log4j加载插件、组装logger等调试信息。
<?xml version="1.0" encoding="UTF-8"?>  
<Configuration status="WARN">  
    <Appenders>  
        <Console name="Console" target="SYSTEM_OUT">  
            <PatternLayout pattern="%d{HH:mm:ss.SSS} [%t] %-5level %logger{36} - %msg%n" />  
        </Console>  
    </Appenders>  
    <Loggers>  
        <Root level="error">  
            <AppenderRef ref="Console" />  
        </Root>  
    </Loggers>  
</Configuration> 
```

重新执行测试代码，可以看到输出结果相同，但是没有再提示找不到配置文件。
来看我们添加的配置文件log4j2.xml，以Configuration为根节点，有一个status属性，这个属性表示log4j2本身的日志信息打印级别。如果把status改为TRACE再执行测试代码，可以看到控制台中打印了一些log4j加载插件、组装logger等调试信息。

日志级别从低到高分为TRACE < DEBUG < INFO < WARN < ERROR < FATAL，如果设置为WARN，则低于WARN的信息都不会输出。对于Loggers中level的定义同样适用。

下面是Appender配置，Appender可以理解为日志的输出目的地，这里配置了一个类型为Console的Appender，也就是输出到控制台。Console节点中的PatternLayout定义了输出日志时的格式：

%d{HH:mm:ss.SSS} 表示输出到毫秒的时间

%t 输出当前线程名称

%-5level 输出日志级别，-5表示左对齐并且固定输出5个字符，如果不足在右边补0

%logger 输出logger名称，因为Root Logger没有名称，所以没有输出

%msg 日志文本

%n 换行

其他常用的占位符有：

%F 输出所在的类文件名，如Client.java

%L 输出行号

%M 输出所在方法名

%l  输出语句所在的行数, 包括类名、方法名、文件名、行数

最后是Logger的配置，这里只配置了一个Root Logger。

### 2 自定义Logger

首先修改测试代码

```
public static void main(String[] args) {  
    Logger logger = LogManager.getLogger("mylog");  
    logger.trace("trace level");  
    logger.debug("debug level");  
    logger.info("info level");  
    logger.warn("warn level");  
    logger.error("error level");  
    logger.fatal("fatal level");  
} 
```

下面修改配置文件

```
<Configuration status="WARN" monitorInterval="300">  
    <Appenders>  
        <Console name="Console" target="SYSTEM_OUT">  
            <PatternLayout pattern="%d{HH:mm:ss.SSS} [%t] %-5level %logger{36} - %msg%n" />  
        </Console>  
    </Appenders>  
    <Loggers>  
        <Logger name="mylog" level="trace" additivity="false">  
        <AppenderRef ref="Console" />  
    </Logger>  
        <Root level="error">  
            <AppenderRef ref="Console" />  
        </Root>  
    </Loggers>  
</Configuration> 
```

additivity="false"表示在该logger中输出的日志不会再延伸到父层logger。这里如果改为true，则会延伸到Root Logger，遵循Root Logger的配置也输出一次。

注意根节点增加了一个monitorInterval属性，含义是每隔300秒重新读取配置文件，可以不重启应用的情况下修改配置，还是很好用的功能。

### 3 自定义Appender

修改配置文件，添加一个文件类型的Appender，并且把mylog的AppenderRef改为新加的Appender

```
<Configuration status="WARN" monitorInterval="300">  
    <Appenders>  
        <Console name="Console" target="SYSTEM_OUT">  
            <PatternLayout pattern="%d{HH:mm:ss.SSS} [%t] %-5level %logger{36} - %msg%n" />  
        </Console>  
        <File name="MyFile" fileName="D:/logs/app.log">  
            <PatternLayout pattern="%d{HH:mm:ss.SSS} [%t] %-5level %logger{36} - %msg%n" />  
        </File>  
    </Appenders>  
    <Loggers>  
        <Logger name="mylog" level="trace" additivity="true">  
            <AppenderRef ref="MyFile" />  
        </Logger>  
        <Root level="error">  
            <AppenderRef ref="Console" />  
        </Root>  
    </Loggers>  
</Configuration>  
```

执行并查看控制台和D:/logs/app.log的输出结果

### 4 实用型配置

下面配置一个按时间和文件大小滚动的RollingRandomAccessFile Appender，名字真是够长，但不光只是名字长，相比RollingFileAppender有很大的性能提升，官网宣称是20-200%。

Rolling的意思是当满足一定条件后，就重命名原日志文件用于备份，并从新生成一个新的日志文件。例如需求是每天生成一个日志文件，但是如果一天内的日志文件体积已经超过1G，就从新生成，两个条件满足一个即可。这在log4j 1.x原生功能中无法实现，在log4j2中就很简单了。

看下面的配置

```
<Configuration status="WARN" monitorInterval="300">  
    <properties>  
        <property name="LOG_HOME">D:/logs</property>  
        <property name="FILE_NAME">mylog</property>  
    </properties>  
    <Appenders>  
        <Console name="Console" target="SYSTEM_OUT">  
            <PatternLayout pattern="%d{HH:mm:ss.SSS} [%t] %-5level %logger{36} - %msg%n" />  
        </Console>  
        <RollingRandomAccessFile name="MyFile"  
            fileName="${LOG_HOME}/${FILE_NAME}.log"  
            filePattern="${LOG_HOME}/$${date:yyyy-MM}/${FILE_NAME}-%d{yyyy-MM-dd HH-mm}-%i.log">  
            <PatternLayout  
                pattern="%d{yyyy-MM-dd HH:mm:ss.SSS} [%t] %-5level %logger{36} - %msg%n" />  
            <Policies>  
                <TimeBasedTriggeringPolicy interval="1" />  
                <SizeBasedTriggeringPolicy size="10 MB" />  
            </Policies>  
            <DefaultRolloverStrategy max="20" />  
        </RollingRandomAccessFile>  
    </Appenders>  
  
    <Loggers>  
        <Logger name="mylog" level="trace" additivity="false">  
            <AppenderRef ref="MyFile" />  
        </Logger>  
        <Root level="error">  
            <AppenderRef ref="Console" />  
        </Root>  
    </Loggers>  
</Configuration> 
```

\<properties>定义了两个常量方便后面复用

RollingRandomAccessFile的属性：

fileName  指定当前日志文件的位置和文件名称

filePattern  指定当发生Rolling时，文件的转移和重命名规则

SizeBasedTriggeringPolicy  指定当文件体积大于size指定的值时，触发Rolling

DefaultRolloverStrategy  指定最多保存的文件个数

TimeBasedTriggeringPolicy  这个配置需要和filePattern结合使用，注意filePattern中配置的文件重命名规则是${FILE_NAME}-%d{yyyy-MM-dd HH-mm}-%i，最小的时间粒度是mm，即分钟，TimeBasedTriggeringPolicy指定的size是1，结合起来就是每1分钟生成一个新文件。如果改成%d{yyyy-MM-dd HH}，最小粒度为小时，则每一个小时生成一个文件。

修改测试代码，模拟文件体积超过10M和时间超过1分钟来验证结果

```
public static void main(String[] args) {  
    Logger logger = LogManager.getLogger("mylog");  
    for(int i = 0; i < 50000; i++) {  
        logger.trace("trace level");  
        logger.debug("debug level");  
        logger.info("info level");  
        logger.warn("warn level");  
        logger.error("error level");  
        logger.fatal("fatal level");  
    }  
    try {  
        Thread.sleep(1000 * 61);  
    } catch (InterruptedException e) {}  
    logger.trace("trace level");  
    logger.debug("debug level");  
    logger.info("info level");  
    logger.warn("warn level");  
    logger.error("error level");  
    logger.fatal("fatal level");  
}  
```



### 5 自定义配置文件位置

log4j2默认在classpath下查找配置文件，可以修改配置文件的位置。在非web项目中：

```
public static void main(String[] args) throws IOException {  
    File file = new File("D:/log4j2.xml");  
    BufferedInputStream in = new BufferedInputStream(new FileInputStream(file));  
    final ConfigurationSource source = new ConfigurationSource(in);  
    Configurator.initialize(null, source);  
      
    Logger logger = LogManager.getLogger("mylog");  
}  
```

如果是web项目，在web.xml中添加

```
<context-param>  
    <param-name>log4jConfiguration</param-name>  
    <param-value>/WEB-INF/conf/log4j2.xml</param-value>  
</context-param>  
  
<listener>  
    <listener-class>org.apache.logging.log4j.web.Log4jServletContextListener</listener-class>  
</listener>  
```

掌握这些基本可以实际使用了，下篇介绍一些高级应用，异步Appender、MongoDB Appender和基于Filters的按级别输出到不同文件的设置