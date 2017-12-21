# 详解log4j2之Async/MongoDB/Flume Appender 按日志级别区分文件输出

原创 2016年04月25日 20:23:20 

### 1. 按日志级别区分文件输出

有些人习惯按日志信息级别输出到不同名称的文件中，如info.log，error.log，warn.log等，在log4j2中可通过配置Filters来实现。

假定需求是把INFO及以下级别的信息输出到info.log，WARN和ERROR级别的信息输出到error.log，FATAL级别输出到fatal.log，配置文件如下：

```
<Configuration status="WARN" monitorInterval="300">  
    <properties>  
        <property name="LOG_HOME">D:/logs</property>  
    </properties>  
    <Appenders>  
        <Console name="Console" target="SYSTEM_OUT">  
            <PatternLayout pattern="%d{HH:mm:ss.SSS} [%t] %-5level %logger{36} - %msg%n" />  
        </Console>  
  
        <RollingRandomAccessFile name="InfoFile"  
            fileName="${LOG_HOME}/info.log"  
            filePattern="${LOG_HOME}/$${date:yyyy-MM}/info-%d{yyyy-MM-dd}-%i.log">  
            <Filters>  
                <ThresholdFilter level="warn" onMatch="DENY" onMismatch="NEUTRAL" />  
                <ThresholdFilter level="trace" onMatch="ACCEPT" onMismatch="DENY" />  
            </Filters>  
            <PatternLayout pattern="%date{yyyy-MM-dd HH:mm:ss.SSS} %level [%thread][%file:%line] - %msg%n" />  
            <Policies>  
                <TimeBasedTriggeringPolicy />  
                <SizeBasedTriggeringPolicy size="10 MB" />  
            </Policies>  
            <DefaultRolloverStrategy max="20" />  
        </RollingRandomAccessFile>  
          
        <RollingRandomAccessFile name="ErrorFile"  
            fileName="${LOG_HOME}/error.log"  
            filePattern="${LOG_HOME}/$${date:yyyy-MM}/error-%d{yyyy-MM-dd}-%i.log">  
            <Filters>  
                <ThresholdFilter level="fatal" onMatch="DENY" onMismatch="NEUTRAL" />  
                <ThresholdFilter level="warn" onMatch="ACCEPT" onMismatch="DENY" />  
            </Filters>  
            <PatternLayout pattern="%date{yyyy-MM-dd HH:mm:ss.SSS} %level [%thread][%file:%line] - %msg%n" />  
            <Policies>  
                <TimeBasedTriggeringPolicy />  
                <SizeBasedTriggeringPolicy size="10 MB" />  
            </Policies>  
            <DefaultRolloverStrategy max="20" />  
        </RollingRandomAccessFile>  
          
        <RollingRandomAccessFile name="FatalFile"  
            fileName="${LOG_HOME}/fatal.log"  
            filePattern="${LOG_HOME}/$${date:yyyy-MM}/fatal-%d{yyyy-MM-dd}-%i.log">  
            <Filters>  
                <ThresholdFilter level="fatal" onMatch="ACCEPT" onMismatch="DENY" />  
            </Filters>  
            <PatternLayout pattern="%date{yyyy-MM-dd HH:mm:ss.SSS} %level [%thread][%file:%line] - %msg%n" />  
            <Policies>  
                <TimeBasedTriggeringPolicy />  
                <SizeBasedTriggeringPolicy size="10 MB" />  
            </Policies>  
            <DefaultRolloverStrategy max="20" />  
        </RollingRandomAccessFile>  
    </Appenders>  
  
    <Loggers>  
        <Root level="trace">  
            <AppenderRef ref="Console" />  
            <AppenderRef ref="InfoFile" />  
            <AppenderRef ref="ErrorFile" />  
            <AppenderRef ref="FatalFile" />  
        </Root>  
    </Loggers>  
</Configuration>  
```

测试代码：

```
public static void main(String[] args) {  
    Logger logger = LogManager.getLogger(Client.class);  
    logger.trace("trace level");  
    logger.debug("debug level");  
    logger.info("info level");  
    logger.warn("warn level");  
    logger.error("error level");  
    logger.fatal("fatal level");  
}  
```



### 2 异步写日志

配置文件：

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
                pattern="%date{yyyy-MM-dd HH:mm:ss.SSS} %level [%thread][%file:%line] - %msg%n" />  
            <Policies>  
                <TimeBasedTriggeringPolicy interval="1" />  
                <SizeBasedTriggeringPolicy size="10 MB" />  
            </Policies>  
            <DefaultRolloverStrategy max="20" />  
        </RollingRandomAccessFile>  
        <Async name="Async">  
            <AppenderRef ref="MyFile" />  
        </Async>  
    </Appenders>  
  
    <Loggers>  
        <Logger name="asynclog" level="trace" additivity="false" >  
            <AppenderRef ref="Async" />  
        </Logger>  
        <Root level="error">  
            <AppenderRef ref="Console" />  
        </Root>  
    </Loggers>  
</Configuration>  
```

测试代码：

```
public static void main(String[] args) {  
    Logger logger = LogManager.getLogger("asynclog");  
    logger.trace("trace level");  
    logger.debug("debug level");  
    logger.info("info level");  
    logger.warn("warn level");  
    logger.error("error level");  
    logger.fatal("fatal level");  
}  
```



### 3 输出到MongoDB

添加依赖：

```
<dependency>  
    <groupId>org.apache.logging.log4j</groupId>  
    <artifactId>log4j-nosql</artifactId>  
    <version>2.5</version>  
</dependency>  
<dependency>  
    <groupId>org.mongodb</groupId>  
    <artifactId>mongo-java-driver</artifactId>  
    <version>3.2.2</version>  
</dependency>  
```

配置文件：

```
<Configuration status="WARN" monitorInterval="300">  
    <Appenders>  
        <Console name="Console" target="SYSTEM_OUT">  
            <PatternLayout pattern="%d{HH:mm:ss.SSS} [%t] %-5level %logger{36} - %msg%n" />  
        </Console>  
  
        <NoSql name="databaseAppender">  
            <MongoDb databaseName="test" collectionName="errorlog"  
                server="localhost" port="27017" />  
        </NoSql>  
    </Appenders>  
  
    <Loggers>  
        <Logger name="mongolog" level="trace" additivity="false">  
            <AppenderRef ref="databaseAppender" />  
        </Logger>  
        <Root level="error">  
            <AppenderRef ref="Console" />  
        </Root>  
    </Loggers>  
</Configuration>  
```



### 4 输出到Flume

Flume配置(flume-conf.properties)

```
agent1.sources=source1   
agent1.sinks=sink1   
agent1.channels=channel1   
  
agent1.sources.source1.type=avro  
agent1.sources.source1.channels=channel1  
agent1.sources.source1.bind=0.0.0.0  
agent1.sources.source1.port=41414  
  
agent1.sinks.sink1.type=file_roll   
agent1.sinks.sink1.sink.directory=D:/log  
agent1.sinks.sink1.channel=channel1  
agent1.sinks.sink1.sink.rollInterval=86400  
agent1.sinks.sink1.sink.batchSize=100  
agent1.sinks.sink1.sink.serializer=text  
agent1.sinks.sink1.sink.serializer.appendNewline = false  
  
agent1.channels.channel1.type=file   
agent1.channels.channel1.checkpointDir=D:/log/checkpoint   
agent1.channels.channel1.dataDirs=D:/log/data  
```

启动Flume（注：测试环境为windows）

```
flume-ng.cmd agent --conf ../conf/ --conf-file ../conf/flume-conf.properties -name agent1  
```

添加依赖：

```
<dependency>  
    <groupId>org.apache.logging.log4j</groupId>  
    <artifactId>log4j-flume-ng</artifactId>  
    <version>2.5</version>  
</dependency>  
```

配置文件：

```
<Configuration status="WARN" monitorInterval="300">  
    <Appenders>  
        <Flume name="eventLogger" compress="false">  
            <Agent host="127.0.0.1" port="41414" />  
            <RFC5424Layout enterpriseNumber="18060" includeMDC="true" appName="MyApp" />  
        </Flume>  
    </Appenders>  
    <Loggers>  
        <Root level="trace">  
            <AppenderRef ref="eventLogger" />  
        </Root>  
    </Loggers>  
</Configuration>  
```







http://blog.csdn.net/autfish/article/details/51244787