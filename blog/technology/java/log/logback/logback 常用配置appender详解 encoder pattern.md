[TOC]



# logback 常用配置appender详解 encoder pattern



 

![img](http://logback.qos.ch/manual/images/chapters/configuration/appenderSyntax.png)

## appender标签

**\<appender>：**

\<appender>是\<configuration>的子节点，是负责写日志的组件。

\<appender>有两个必要属性name和class。name指定appender名称，class指定appender的全限定名。

 

## 1.ConsoleAppender类

把日志添加到控制台，有以下子节点：

\<encoder>：对日志进行格式化。（具体参数稍后讲解 ）

\<target>：字符串 *System.out 或者 System.err* ，默认 *System.out* ；

例如：

```xml
<configuration>  
  
  <appender name="STDOUT" class="ch.qos.logback.core.ConsoleAppender">  
    <encoder>  
      <pattern>%-4relative [%thread] %-5level %logger{35} - %msg %n</pattern>  
    </encoder>  
  </appender>  
  
  <root level="DEBUG">  
    <appender-ref ref="STDOUT" />  
  </root>  
</configuration>
```

## 2.FileAppender类

把日志添加到文件，有以下子节点：

\<file>：被写入的文件名，可以是相对目录，也可以是绝对目录，如果上级目录不存在会自动创建，没有默认值。

\<append>：如果是 true，日志被追加到文件结尾，如果是 false，清空现存文件，默认是true。

\<encoder>：对记录事件进行格式化。（具体参数稍后讲解 ）

\<prudent>：如果是 true，日志会被安全的写入文件，即使其他的FileAppender也在向此文件做写入操作，效率低，默认是 false。

例如：

```xml
<configuration>  
  
  <appender name="FILE" class="ch.qos.logback.core.FileAppender">  
    <file>testFile.log</file>  
    <append>true</append>  
    <encoder>  
      <pattern>%-4relative [%thread] %-5level %logger{35} - %msg%n</pattern>  
    </encoder>  
  </appender>  
          
  <root level="DEBUG">  
    <appender-ref ref="FILE" />  
  </root>  
</configuration>  
```



## 3.RollingFileAppender类

滚动记录文件，先将日志记录到指定文件，当符合某个条件时，将日志记录到其他文件。有以下子节点：

\<file>：被写入的文件名，可以是相对目录，也可以是绝对目录，如果上级目录不存在会自动创建，没有默认值。

\<append>：如果是 true，日志被追加到文件结尾，如果是 false，清空现存文件，默认是true。

\<encoder>：对记录事件进行格式化。（具体参数稍后讲解 ）

\<rollingPolicy>:当发生滚动时，决定 **RollingFileAppender** 的行为，涉及文件移动和重命名。

\<triggeringPolicy >:  告知  **RollingFileAppender** 合适激活滚动。

\<prudent>：当为true时，不支持FixedWindowRollingPolicy。支持TimeBasedRollingPolicy，但是有两个限制，1不支持也不允许文件压缩，2不能设置file属性，必须留空。

 

### rollingPolicy滚动政策

#### **TimeBasedRollingPolicy：** 

最常用的滚动策略，它根据时间来制定滚动策略，既负责滚动也负责出发滚动。有以下子节点：
\<fileNamePattern>:
必要节点，包含文件名及“%d”转换符， “%d”可以包含一个 java.text.SimpleDateFormat指定的时间格式，如：%d{yyyy-MM}。如果直接使用 %d，默认格式是 yyyy-MM-dd。 RollingFileAppender 的file字节点可有可无，通过设置file，可以为活动文件和归档文件指定不同位置，当前日志总是记录到file指定的文件（活动文件），活动文件的名字不会改变；如果没设置file，活动文件的名字会根据fileNamePattern 的值，每隔一段时间改变一次。“/”或者“\”会被当做目录分隔符。

\<maxHistory>:
可选节点，控制保留的归档文件的最大数量，超出数量就删除旧文件。假设设置每个月滚动，且 \<maxHistory>是6，则只保存最近6个月的文件，删除之前的旧文件。注意，删除旧文件是，那些为了归档而创建的目录也会被删除。 

#### **FixedWindowRollingPolicy：** 

根据固定窗口算法重命名文件的滚动策略。有以下子节点：

\<minIndex>:窗口索引最小值

\<maxIndex>:窗口索引最大值，当用户指定的窗口过大时，会自动将窗口设置为12。

\<fileNamePattern >:

必须包含“%i”例如，假设最小值和最大值分别为1和2，命名模式为 mylog%i.log,会产生归档文件mylog1.log和mylog2.log。还可以指定文件压缩选项，例如，mylog%i.log.gz 或者 没有log%i.log.zip 

#### triggeringPolicy: 

**SizeBasedTriggeringPolicy：** 查看当前活动文件的大小，如果超过指定大小会告知

**RollingFileAppender **触发当前活动文件滚动。只有一个节点**:**

\<maxFileSize>:这是活动文件的大小，默认值是10MB。



### 例子

例如：每天生成一个日志文件，保存30天的日志文件。

```xml
<configuration>   
  <appender name="FILE" class="ch.qos.logback.core.rolling.RollingFileAppender">   
      
    <rollingPolicy class="ch.qos.logback.core.rolling.TimeBasedRollingPolicy">   
      <fileNamePattern>logFile.%d{yyyy-MM-dd}.log</fileNamePattern>   
      <maxHistory>30</maxHistory>    
    </rollingPolicy>   
   
    <encoder>   
      <pattern>%-4relative [%thread] %-5level %logger{35} - %msg%n</pattern>   
    </encoder>   
  </appender>    
   
  <root level="DEBUG">   
    <appender-ref ref="FILE" />   
  </root>   
</configuration>  
```


  例如：按照固定窗口模式生成日志文件，当文件大于20MB时，生成新的日志文件。窗口大小是1到3，当保存了3个归档文件后，将覆盖最早的日志。

```xml
<configuration>   
  <appender name="FILE" class="ch.qos.logback.core.rolling.RollingFileAppender">   
    <file>test.log</file>   
   
    <rollingPolicy class="ch.qos.logback.core.rolling.FixedWindowRollingPolicy">   
      <fileNamePattern>tests.%i.log.zip</fileNamePattern>   
      <minIndex>1</minIndex>   
      <maxIndex>3</maxIndex>   
    </rollingPolicy>   
   
    <triggeringPolicy class="ch.qos.logback.core.rolling.SizeBasedTriggeringPolicy">   
      <maxFileSize>5MB</maxFileSize>   
    </triggeringPolicy>   
    <encoder>   
      <pattern>%-4relative [%thread] %-5level %logger{35} - %msg%n</pattern>   
    </encoder>   
  </appender>   
           
  <root level="DEBUG">   
    <appender-ref ref="FILE" />   
  </root>   
</configuration>  
```

4.另外还有SocketAppender、SMTPAppender、DBAppender、SyslogAppender、SiftingAppender，并不常用，这些就不在这里讲解了，大家可以参考官方文档。当然大家可以编写自己的Appender。



## encoder标签说明 pattern

### 简介

\<encoder>：

负责两件事，一是把日志信息转换成字节数组，二是把字节数组写入到输出流。

目前**PatternLayoutEncoder** 是唯一有用的且默认的**encoder** ，有一个\<pattern>节点，用来设置日志的输入格式。使用“%”加“转换符”方式，如果要输出“%”，则必须用“\”对“\%”进行转义。

例如：

```
<encoder>   
   <pattern>%-4relative [%thread] %-5level %logger{35} - %msg%n</pattern>   
</encoder>  
```

**\<pattern>里面的转换符说明：**



### 具体说明

#### c {length }  lo {length }   logger{length }:

输出日志的logger名，可有一个整形参数，功能是缩短logger名，设置为0表示只输入logger最右边点符号之后的字符串。 Conversion specifier Logger name Result

|             |                            |                            |
| ----------- | -------------------------- | -------------------------- |
| %logger     | mainPackage.sub.sample.Bar | mainPackage.sub.sample.Bar |
| %logger{0}  | mainPackage.sub.sample.Bar | Bar                        |
| %logger{5}  | mainPackage.sub.sample.Bar | m.s.s.Bar                  |
| %logger{10} | mainPackage.sub.sample.Bar | m.s.s.Bar                  |
| %logger{15} | mainPackage.sub.sample.Bar | m.s.sample.Bar             |
| %logger{16} | mainPackage.sub.sample.Bar | m.sub.sample.Bar           |
| %logger{26} | mainPackage.sub.sample.Bar | mainPackage.sub.sample.Bar |

#### C {length } class {length }

输出执行记录请求的调用者的全限定名。参数与上面的一样。尽量避免使用，除非执行速度不造成任何问题。



#### contextName   cn

输出上下文名称。



#### d {pattern }  date {pattern }

输出日志的打印日志，模式语法与

```
java.text.SimpleDateFormat
```

 兼容。 Conversion Pattern Result

|                                  |                           |
| -------------------------------- | ------------------------- |
| %d                               | 2006-10-20 14:06:49,812   |
| %date                            | 2006-10-20 14:06:49,812   |
| %date{ISO8601}                   | 2006-10-20 14:06:49,812   |
| %date{HH:mm:ss.SSS}              | 14:06:49.812              |
| %date{dd MMM yyyy ;HH:mm:ss.SSS} | 20 oct. 2006;14:06:49.812 |

#### F / file

输出执行记录请求的java源文件名。尽量避免使用，除非执行速度不造成任何问题。



#### caller{depth} caller{depth, evaluator-1, ... evaluator-n}

输出生成日志的调用者的位置信息，整数选项表示输出信息深度。

例如， **%caller{2}**   输出为：

```
0    [main] DEBUG - logging statement 
Caller+0   at mainPackage.sub.sample.Bar.sampleMethodName(Bar.java:22)
Caller+1   at mainPackage.sub.sample.Bar.createLoggingRequest(Bar.java:17)
```

例如， **%caller{3}**   输出为：

```
16   [main] DEBUG - logging statement 
Caller+0   at mainPackage.sub.sample.Bar.sampleMethodName(Bar.java:22)
Caller+1   at mainPackage.sub.sample.Bar.createLoggingRequest(Bar.java:17)
Caller+2   at mainPackage.ConfigTester.main(ConfigTester.java:38)
```

#### L / line

输出执行日志请求的行号。尽量避免使用，除非执行速度不造成任何问题。

#### m / msg / message

输出应用程序提供的信息。

#### M / method

输出执行日志请求的方法名。尽量避免使用，除非执行速度不造成任何问题。

#### n

输出平台先关的分行符“\n”或者“\r\n”。

#### p / le / level

输出日志级别。

#### r / relative

输出从程序启动到创建日志记录的时间，单位是毫秒

#### t / thread

输出产生日志的线程名。

#### replace(p ){r, t}

**p** 为日志内容，**r** 是正则表达式，将**p** 中符合**r** 的内容替换为**t** 。

例如， "%replace(%msg){'\s', ''}"





**格式修饰符，与转换符共同使用：**

可选的格式修饰符位于“%”和转换符之间。

第一个可选修饰符是**左对齐** 标志，符号是减号“-”；接着是可选的**最小宽度** 修饰符，用十进制数表示。如果字符小于最小宽度，则左填充或右填充，默认是左填充（即右对齐），填充符为空格。如果字符大于最小宽度，字符永远不会被截断。**最大宽度** 修饰符，符号是点号"."后面加十进制数。如果字符大于最大宽度，则从前面截断。点符号“.”后面加减号“-”在加数字，表示从尾部截断。

 

 

例如：%-4relative 表示，将输出从程序启动到创建日志记录的时间 进行左对齐 且最小宽度为4。

 

 



http://aub.iteye.com/blog/1103685 

  
