# 问题：[LogBack default charset for LayoutWrappingEncoder?](http://stackoverflow.com/questions/32207432/logback-default-charset-for-layoutwrappingencoder)

The Logback 1.1.3 [`LayoutWrappingEncoder` documentation](http://logback.qos.ch/manual/encoders.html) doesn't indicate what the default charset will be if the user doesn't set it, but the source code says:

> By default this property has the value null which corresponds to the system's default charset.

However I'm using a `PatternLayoutEncoder` (with a `RollingFileAppender`), and it seems to be outputting files in UTF-8 (and the default charset of my Windows 7 Professional system is probably not UTF-8).

UTF-8 output is actually what I want, but I want to make sure I'm not getting this by chance, since the documentation seems to indicate something else. So why is Logback giving me UTF-8 output when I haven't explicitly specified a charset?

回答：

## Answers

**Logback Character Encoding**

You can use `<charset>` in the definition of your `PatternLayoutEncoder` as this is a subclass of `LayoutWrappingEncoder`, which provides the `setCharset` method. This is indicated in the documentation by an excerpt from the class, but no example xml configuration is given. For the LayoutWrappingEncoder an answer has been given here: [[Logback-user\]: How to use UTF-8](http://mailman.qos.ch/pipermail/logback-user/2011-May/002326.html).

So if you configure via code you can call the `setCharset` method with UTF-8. Or if you are configuring via xml this is:

```
<encoder class="ch.qos.logback.classic.encoder.PatternLayoutEncoder">
        <charset>UTF-8</charset>            
        <outputPatternAsHeader>true</outputPatternAsHeader>
        <pattern>[%thread] %-5level %logger{35} - %msg%n</pattern>
</encoder>

```

```
    <!-- 文件输出日志 (文件大小策略进行文件输出，超过指定大小对文件备份) -->
    <appender name="FILE" class="ch.qos.logback.core.rolling.RollingFileAppender">
        <file>${LOG_DIR}/${LOG_FILE_NAME}.log</file>
        <rollingPolicy class="ch.qos.logback.core.rolling.TimeBasedRollingPolicy">
            <FileNamePattern>${LOG_DIR}/${logFileNamePattern}.log.zip</FileNamePattern>
            <timeBasedFileNamingAndTriggeringPolicy class="ch.qos.logback.core.rolling.SizeAndTimeBasedFNATP">
                <maxFileSize>50MB</maxFileSize>
            </timeBasedFileNamingAndTriggeringPolicy>
            <maxHistory>30</maxHistory>
        </rollingPolicy>
       <!-- <layout class="ch.qos.logback.classic.PatternLayout">
            <Pattern>${logLayoutPattern}</Pattern>
        </layout>-->
        <encoder class="ch.qos.logback.classic.encoder.PatternLayoutEncoder">
            <charset>UTF-8</charset>
            <outputPatternAsHeader>true</outputPatternAsHeader>
            <Pattern>${logLayoutPattern}</Pattern>
        </encoder>
    </appender>
```



**Default File Encoding**

Logback's documentation is correct in stating that the default character encoding is used. The default character set is not typically UTF-8 on windows (mine is `windows-1252` for instance). The correct thing to do it configure logback to be UTF-8 as above. Even if logback is picking UTF-8 up from somewhere, or `file.encoding` is somehow being set by you, there's no guarentee that this will happen in the future.

Incidentally Sun had previously said about file.encoding, if you are setting this on an Oracle VM:

> The "file.encoding" property is not required by the J2SE platform specification; it's an internal detail of Sun's implementations and should not be examined or modified by user code. It's also intended to be read-only; it's technically impossible to support the setting of this property to arbitrary values on the command line or at any other time during program execution.

**Eclipse and Maven**

If you are running maven from eclipse and you've already set your environment to be UTF-8 either in for the environment/project or the Run Configuration (for me in the common tab) then eclipse will arrange for the new JVM to have UTF-8 encoding by setting `file.encoding`. See: [Eclipse's encoding documentation](http://help.eclipse.org/mars/index.jsp?topic=%2Forg.eclipse.platform.doc.isv%2Fguide%2FwrkAdv_encoding.htm)

来源： <http://stackoverflow.com/questions/32207432/logback-default-charset-for-layoutwrappingencoder>