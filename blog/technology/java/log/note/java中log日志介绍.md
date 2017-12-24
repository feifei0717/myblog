# java中log日志介绍



博：http://zhw2527.iteye.com/blog/1006302

http://zhw2527.iteye.com/blog/1099658

在项目开发中，记录错误日志是一个很有必要功能。

一是方便调试

二是便于发现系统运行过程中的错误

三是存储业务数据，便于后期分析

## 日志的实现方式：

1、自己写类，将日志数据，以io操作方式，写数据到文本文件。或者是写到数据库中。

2、使用log4j。log4j，这也是此文要记录的。log4j，以前在用.Net做web form时，用log4net。平台通吃。而且，log4j可以将日志，输出到console窗口，输出到文本文件，输出到数据库

等，功能还是很强大的！

3、使用jdk自带的logging.jar中的方法。

4、使用slfj。slfj，是也是一个很强大的功能。slfj旨在一统天下，也就是slfj提供了logging.jar 和 log4j的接口，可以通过slfj来调用log4j，也可以调用jdk的logging。

**Log4j三个主要的组件**，它们分别是 Logger、Appender和Layout，

Log4j 允许开发人员定义多个Logger，每个Logger拥有自己的名字，Logger之间通过名字来表明隶属关系。有一个Logger

称为Root，它永远存在，且不能通过名字检索或引用，可以通过Logger.getRootLogger（）方法获得，其它Logger通过

Logger.getLogger（String name）方法。

Appender则是用来指明将所有的log信息存放到什么地方，Log4j中支持多种appender，如 console、files、GUI

components、NT Event Loggers等，一个Logger可以拥有多个Appender，也就是你既可以将Log信息输出到屏幕，同时

存储到一个文件中。

Layout的作用是控制Log信息的输出方式，也就是格式化输出的信息。

## log日志级别

trace： 是追踪，就是程序推进以下，你就可以写个trace输出，所以trace应该会特别多，不过没关系，我们可以设置最低日志级别不让他输出。

debug： 调试么，我一般就只用这个作为最低级别，trace压根不用。是在没办法就用eclipse或者idea的debug功能就好了么。

info： 输出一下你感兴趣的或者重要的信息，这个用的最多了。

warn： 有些信息不是错误信息，但是也要给程序员的一些提示，类似于eclipse中代码的验证不是有error 和warn（不算错误但是也请注意，比如以下depressed的方法）。

error： 错误信息。用的也比较多。

fatal： 级别比较高了。重大错误，这种级别你可以直接停止程序了，是不应该出现的错误么！不用那么紧张，其实就是一个程度的问题。

## log4j的配置文件

```
%p: 输出日志信息优先级，即DEBUG，INFO，WARN，ERROR，FATAL,

%d: 输出日志时间点的日期或时间，默认格式为ISO8601，也可以在其后指定格式，比如：%d{yyy MMM dd HH:mm:ss,SSS}，输出类似：2002年10月18日 22：10：28，921
%r: 输出自应用启动到输出该log信息耗费的毫秒数
%c: 输出日志信息所属的类目，通常就是所在类的全名
%t: 输出产生该日志事件的线程名
%l: 输出日志事件的发生位置，相当于%C.%M(%F:%L)的组合,包括类目名、发生的线程，以及在代码中的行数。举例：Testlog4.main(TestLog4.java:10)
%x: 输出和当前线程相关联的NDC(嵌套诊断环境),尤其用到像java servlets这样的多客户多线程的应用中。
%%: 输出一个”%”字符
%F: 输出日志消息产生时所在的文件名称
%L: 输出代码中的行号
%m: 输出代码中指定的消息,产生的日志具体信息
%n: 输出一个回车换行符，Windows平台为”\r\n”，Unix平台为”\n”输出日志信息换行
可以在%与模式字符之间加上修饰符来控制其最小宽度、最大宽度、和文本的对齐方式。如：
1)%20c：指定输出category的名称，最小的宽度是20，如果category的名称小于20的话，默认的情况下右对齐。
2)%-20c:指定输出category的名称，最小的宽度是20，如果category的名称小于20的话，”-”号指定左对齐。
3)%.30c:指定输出category的名称，最大的宽度是30，如果category的名称大于30的话，就会将左边多出的字符截掉，但小于30的话也不会有空格。
4)%20.30c:如果category的名称小于20就补空格，并且右对齐，如果其名称长于30字符，就从左边交远销出的字符截掉。
 
```

## log的输出配置

Log4j提供的appender有以下几种：
org.apache.log4j.ConsoleAppender（控制台），
org.apache.log4j.FileAppender（文件），
org.apache.log4j.DailyRollingFileAppender（每天产生一个日志文件），
org.apache.log4j.RollingFileAppender（文件大小到达指定尺寸的时候产生一个新的文件），
org.apache.log4j.WriterAppender（将日志信息以流格式发送到任意指定的地方）

(1).ConsoleAppender选项
Threshold=WARN:指定日志消息的输出最低层次。
ImmediateFlush=true:默认值是true,意谓着所有的消息都会被立即输出。
Target=System.err：默认情况下是：System.out,指定输出控制台

(2).FileAppender 选项
Threshold=WARN:指定日志消息的输出最低层次。
ImmediateFlush=true:默认值是true,意谓着所有的消息都会被立即输出。
File=mylog.txt:指定消息输出到mylog.txt文件。
Append=false:默认值是true,即将消息增加到指定文件中，false指将消息覆盖指定的文件内容。

(3).DailyRollingFileAppender 选项
Threshold=WARN:指定日志消息的输出最低层次。
ImmediateFlush=true:默认值是true,意谓着所有的消息都会被立即输出。
File=mylog.txt:指定消息输出到mylog.txt文件。
Append=false:默认值是true,即将消息增加到指定文件中，false指将消息覆盖指定的文件内容。
DatePattern=’.’yyyy-ww:每周滚动一次文件，即每周产生一个新的文件。当然也可以指定按月、周、天、时和分。即对应的格式如下：
1)’.’yyyy-MM: 每月
2)’.’yyyy-ww: 每周
3)’.’yyyy-MM-dd: 每天
4)’.’yyyy-MM-dd-a: 每天两次
5)’.’yyyy-MM-dd-HH: 每小时
6)’.’yyyy-MM-dd-HH-mm: 每分钟

(4).RollingFileAppender 选项
Threshold=WARN:指定日志消息的输出最低层次。
ImmediateFlush=true:默认值是true,意谓着所有的消息都会被立即输出。
File=mylog.txt:指定消息输出到mylog.txt文件。
Append=false:默认值是true,即将消息增加到指定文件中，false指将消息覆盖指定的文件内容。
MaxFileSize=100KB: 后缀可以是KB, MB 或者是 GB. 在日志文件到达该大小时，将会自动滚动，即将原来的内容移到mylog.log.1文件。
MaxBackupIndex=2:指定可以产生的滚动文件的最大数。

## 配置日志信息的布局

org.apache.log4j.HTMLLayout（以HTML表格形式布局），
org.apache.log4j.PatternLayout（可以灵活地指定布局模式），
org.apache.log4j.SimpleLayout（包含日志信息的级别和信息字符串），
org.apache.log4j.TTCCLayout（包含日志产生的时间、线程、类别等等信息）

## log4j日志输出位置：

控制台

文本文件

数据库

```
log4j.rootCategory=DEBUG,logfile,stdout    
    
log4j.logger.SYSTEM = INFO,JDBC    
log4j.logger.OPERATION = INFO,JDBC2   

#JDBC configure    
log4j.appender.JDBC.Threshold=INFO    
log4j.appender.JDBC=org.apache.log4j.jdbc.JDBCAppender     
log4j.appender.JDBC.driver=oracle.jdbc.driver.OracleDriver    
log4j.appender.JDBC.URL=jdbc:oracle:thin:@127.0.0.1:1521:ORCL    
log4j.appender.JDBC.user=hh   
log4j.appender.JDBC.password=hh   
log4j.appender.JDBC.layout=org.apache.log4j.PatternLayout    
log4j.appender.JDBC.sql=INSERT INTO SYS_LOG(USERID,LOGTIME,LOGLEVEL,LOCATION,MESSAGE)VALUES('%X{userId}','%d{yyyy-MM-dd HH:mm:ss}','%p','%l','%m')    
    
    
log4j.appender.JDBC2.Threshold=INFO    
log4j.appender.JDBC2=org.apache.log4j.jdbc.JDBCAppender     
log4j.appender.JDBC2.driver=oracle.jdbc.driver.OracleDriver    
log4j.appender.JDBC2.URL=jdbc:oracle:thin:@127.0.0.1:1521:ORCL   
log4j.appender.JDBC2.user=userName    
log4j.appender.JDBC2.password=userPassword    
log4j.appender.JDBC2.layout=org.apache.log4j.PatternLayout    
log4j.appender.JDBC2.sql=INSERT INTO SYS_LOG_2(USERID,LOGTIME,LOGLEVEL,LOCATION,MESSAGE)VALUES('%X{userId}','%d{yyyy-MM-dd HH:mm:ss}','%p','%l','%m')
```

 

 

## log4j打印日志

1、首先在项目src目录下配置log4j.properties文件（必须）

2、导包到lib文件夹下commons- logging.jar和logging-log4j-1.2.9.jar

3、得到记录器 static Logger logger = Logger.getLogger ( ServerWithLog4j.class.getName () ) 

4、读取配置文件（**若将 log4j.properties放在工程根目录下也可不写此句，程序会自动找到配置文件。** ）

PropertyConfigurator.configure ( “log4j.properties”)就是说使用当前工程目录下的src文件夹中的log4j.properties文件

作为配置文件。

注意：

在**web程序中使用log4j**注意问题： 

1、由于jsp或servlet在执行状态时没有当前路径概念，所有使用PropertyConfigurator.configure（String）语句找log4j.properties文件时要给出相对于当前jsp或servlet的路径转化成为一个绝对的文件系统路径。方法是使用 servletcontext.getrealpath(string)语句。例： 

String prefix = getServletContext().getRealPath("/");   //得到当前jsp路径 

PropertyConfigurator.configure(prefix+"\\WEB-INF\\log4j.properties");    //读取log4j.properties 

 

2、相应的log4j.properties设置某个属性时也要在程序中设置绝对路径。例： 

log4j.appender.R.File属性设置日志文件存放位置。我们可以用读写.properties配置文件的方法进行灵活设置。 

 

配置文件

 

```
### 设置级别和目的地(这里多个目的地) ###
#级别为DEBUG
#目的地为CONSOLE，wangLog；wangLog为自定义输出端，可随意命名
log4j.rootLogger = DEBUG,CONSOLE,wangLog
### 这里的com.icss.log是包，也就是在这个包记录日志时，是只记录debug及以上级别的日志
log4j.logger.com.icss.log=DEBUG

#Log4j提供的appender有以下几种：
#org.apache.log4j.ConsoleAppender（控制台），
#org.apache.log4j.FileAppender（文件），
#org.apache.log4j.DailyRollingFileAppender（每天产生一个日志文件），
#org.apache.log4j.RollingFileAppender（文件大小到达指定尺寸的时候产生一个新的文件），
#org.apache.log4j.WriterAppender（将日志信息以流格式发送到任意指定的地方）

### 输出到控制台 ###
log4j.appender.CONSOLE = org.apache.log4j.ConsoleAppender
log4j.appender.CONSOLE.Target = System.out
log4j.appender.CONSOLE.layout = org.apache.log4j.PatternLayout
log4j.appender.CONSOLE.layout.ConversionPattern =  %d{ABSOLUTE} %5p %c{1}:%L - %m%n

### 输出到日志文件 ###
#写到文件中，并且追加
log4j.appender.wangLog = org.apache.log4j.DailyRollingFileAppender
log4j.appender.wangLog.File =C\:debug.log
#log4j.appender.wangLog.File =/var/alldata/zhenduan/debug.log
log4j.appender.wangLog.Append = true
## 只输出DEBUG级别以上的日志
log4j.appender.zhangsanLog.Threshold = DEBUG
#'.'yyyy-MM-dd: 设置为每天产生一个新的文件
#1)’.’yyyy-MM: 每月
#2)’.’yyyy-ww: 每周
#3)’.’yyyy-MM-dd: 每天
#4)’.’yyyy-MM-dd-a: 每天两次
#5)’.’yyyy-MM-dd-HH: 每小时
#6)’.’yyyy-MM-dd-HH-mm: 每分钟
log4j.appender.wangLog.DatePattern = '.'yyyy-MM-dd
#当文件达到2kb时，文件会被备份成"debug.txt.1"，新的"log.txt"继续记录log信息
log4j.appender.wangLog.MaxFileSize = 2KB
#最多建5个文件，当文件个数较多时，后面不再新建文件
log4j.appender.wangLog.MaxBackupIndex = 5
log4j.appender.wangLog.layout = org.apache.log4j.PatternLayout
log4j.appender.wangLog.layout.ConversionPattern = %-d{yyyy-MM-dd HH:mm:ss} [%t:%r] - [%p] [%c{1}:%L] [%M] %m%n
#设置子Logger是否继承父Logger的输出源
#默认情况下子Logger会继承父Logger的appender，也就是说子Logger会在父Logger的appender里输出
log4j.additivity.wangLog = false
```

 



https://www.cnblogs.com/wangwanchao/p/5310096.html