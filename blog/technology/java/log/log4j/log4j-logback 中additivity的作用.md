**additivity**的作用在于 children-logger是否使用 rootLogger配置的appender进行输出。

false：表示只用当前logger的appender-ref。

true：表示当前logger的appender-ref和rootLogger的appender-ref都有效。

 

log4j:

```
<logger name="com.***" additivity="false">
    <priority value="info"/>
    <appender-ref ref="activexAppender"/>
</logger>
<root>
    <priority value="debug"/>
    <appender-ref ref="myConsole"/>
</root> 
```

logback：

```
<logger level="INFO" additivity="false" name="com.***">
    <appender-ref ref="ASYNC"/>
</logger>
<root level="WARN">
    <appender-ref ref="LOG_FILE"/>
</root>
```

来源： <http://lionbule.iteye.com/blog/1149854>