# com.googlecode.log4jdbc的使用方法

## 说明

log4jdbc:jdbc层的一个日志框架

## 1.JDBC配置

  maven依赖： 

```
<dependency>  
    <groupId>com.googlecode.log4jdbc</groupId>  
    <artifactId>log4jdbc</artifactId>  
    <version>1.2</version>  
</dependency>  
```

以SQL Server为例，把原配置属性中的driverClass，url修改如下 

```
#jdbc_driverClass=net.sourceforge.jtds.jdbc.Driver  
jdbc_driverClass=net.sf.log4jdbc.DriverSpy  
#jdbcjdbc_url=jdbc:jtds:sqlserver://localhost:1433/dbname  
jdbcjdbc_url=jdbc:log4jdbc:jtds:sqlserver://localhost:1433/dbname  
jdbc_username=sa  
jdbc_password=123456  
```

以mysql 为例，把原配置属性中的driver，url修改如下 

```
#jdbc.driver=com.mysql.jdbc.Driver
jdbc.driver=net.sf.log4jdbc.DriverSpy
#jdbc.url=jdbc:mysql://192.168.99.100:3306/test?useUnicode=true&characterEncoding=utf-8
jdbc.url=jdbc:log4jdbc:mysql://192.168.99.100:3306/test?useUnicode=true&characterEncoding=utf-8
jdbc.username=root
jdbc.password=123456
```

## 2.日志层配置

### log4j配置

```
log4j.logger.jdbc.sqlonly=OFF  
log4j.logger.jdbc.sqltiming=INFO  
log4j.logger.jdbc.audit=OFF  
log4j.logger.jdbc.resultset=OFF  
log4j.logger.jdbc.connection=OFF  
```

### logback配置

```
    <!--sql 打印在控制台 Log4jdbc 日志种类都可以设置为 DEBUG , INFO 或 ERROR 级别。当设置为 FATAL 或 OFF 时，意味关闭记录。-->
    <!--记录 SQL 以及耗时信息-->
    <logger name="jdbc.sqltiming" level="INFO">
        <!--<appender-refref ref="STDOUT"/>-->
    </logger>
    <logger name="jdbc.resultsettable" level="INFO"></logger>
    <!--仅记录 SQL-->
    <logger name="jdbc.sqlonly" level="OFF"></logger>
    <!--记录除了 ResultSet 之外的所有 JDBC 调用信息，会产生大量的记录，有利于调试跟踪具体的 JDBC 问题-->
    <logger name="jdbc.audit" level="OFF"></logger>
    <!--会产生更多的记录信息，因为记录了 ResultSet 的信息-->
    <logger name="jdbc.resultset" level="OFF"></logger>
    <!--记录连接打开、关闭等信息，有利于调试数据库连接相关问题-->
    <logger name="jdbc.connection" level="OFF"></logger>
```

## 3.运行测试结果

```
[INFO][2014-08-17 21:50:48,533][jdbc.sqltiming]select organizati0_.id as id1_0_0_, organizati0_.locked as locked2_0_0_, organizati0_.name as name3_0_0_, organizati0_.parentId as parentId4_0_0_, organizati0_.code as code5_0_0_, organizati0_.type as type6_0_0_ from cz_branch organizati0_ where organizati0_.id=3 
{executed in 1 msec} 
```

来源： <http://hbczlp.iteye.com/blog/2105311>