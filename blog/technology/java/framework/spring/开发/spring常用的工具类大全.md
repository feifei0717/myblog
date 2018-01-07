# spring常用的工具类大全

Java编程开发 2018-01-02 15:09:58

## 简介

spring给我们提供了很多的工具类, 应该在我们的日常工作中很好的利用起来. 它可以大大的减轻我们的平时编写代码的长度. 因我们只想用spring的工具类, 而不想把一个大大的spring工程给引入进来. 下面是我从spring3.0.5里抽取出来的工具类。

在最后给出我提取出来的spring代码打成的jar包

spring的里的resouce的概念, 在我们处理io时很有用.

## **内置的resouce类型**

1. UrlResource

2. ClassPathResource

3. FileSystemResource

4. ServletContextResource

5. InputStreamResource

6. ByteArrayResource

7. EncodedResource 也就是Resource加上encoding, 可以认为是有编码的资源

8. VfsResource(在jboss里经常用到, 相应还有 工具类 VfsUtils)

9. org.springframework.util.xml.ResourceUtils 用于处理表达资源字符串前缀描述资源的工具. 如: &quot;classpath:&quot;.

   有 getURL, getFile, isFileURL, isJarURL, extractJarFileURL

## **工具类**

1. org.springframework.core.annotation.AnnotationUtils 处理注解
2. org.springframework.core.io.support.PathMatchingResourcePatternResolver 用于处理 ant 匹配风格(com/*.jsp, com/**/*.jsp),找出所有的资源, 结合上面的resource的概念一起使用,对于遍历文件很有用. 具体请详细查看javadoc
3. org.springframework.core.io.support.PropertiesLoaderUtils 加载Properties资源工具类,和Resource结合
4. org.springframework.core.BridgeMethodResolver 桥接方法分析器. 关于桥接方法请参考: http://java.sun.com/docs/books/jls/third_edition/html/expressions.html#15.12.4.5
5. org.springframework.core.GenericTypeResolver 范型分析器, 在用于对范型方法, 参数分析.
6. org.springframework.core.NestedExceptionUtils 

## **xml工具**

1. org.springframework.util.xml.AbstractStaxContentHandler
2. org.springframework.util.xml.AbstractStaxXMLReader
3. org.springframework.util.xml.AbstractXMLReader
4. org.springframework.util.xml.AbstractXMLStreamReader
5. org.springframework.util.xml.DomUtils
6. org.springframework.util.xml.SimpleNamespaceContext
7. org.springframework.util.xml.SimpleSaxErrorHandler
8. org.springframework.util.xml.SimpleTransformErrorListener
9. org.springframework.util.xml.StaxUtils
10. org.springframework.util.xml.TransformerUtils

## **其它工具集**

1. org.springframework.util.xml.AntPathMatcherant风格的处理
2. org.springframework.util.xml.AntPathStringMatcher
3. org.springframework.util.xml.Assert断言,在我们的参数判断时应该经常用
4. org.springframework.util.xml.CachingMapDecorator
5. org.springframework.util.xml.ClassUtils用于Class的处理
6. org.springframework.util.xml.CollectionUtils用于处理集合的工具
7. org.springframework.util.xml.CommonsLogWriter
8. org.springframework.util.xml.CompositeIterator
9. org.springframework.util.xml.ConcurrencyThrottleSupport
10. org.springframework.util.xml.CustomizableThreadCreator
11. org.springframework.util.xml.DefaultPropertiesPersister
12. org.springframework.util.xml.DigestUtils摘要处理, 这里有用于md5处理信息的
13. org.springframework.util.xml.FileCopyUtils文件的拷贝处理, 结合Resource的概念一起来处理, 真的是很方便

14. org.springframework.util.xml.FileSystemUtils

15. org.springframework.util.xml.LinkedCaseInsensitiveMap

    key值不区分大小写的LinkedMap

16. org.springframework.util.xml.LinkedMultiValueMap一个key可以存放多个值的LinkedMap

17. org.springframework.util.xml.Log4jConfigurer一个log4j的启动加载指定配制文件的工具类

18. org.springframework.util.xml.NumberUtils处理数字的工具类, 有parseNumber 可以把字符串处理成我们指定的数字格式, 还支持format格式, convertNumberToTargetClass 可以实现Number类型的转化.

19. org.springframework.util.xml.ObjectUtils有很多处理null object的方法. 如nullSafeHashCode, nullSafeEquals, isArray, containsElement, addObjectToArray, 等有用的方法

20. org.springframework.util.xml.PatternMatchUtilsspring里用于处理简单的匹配. 如 Spring's typical &quot;xxx*&quot;, &quot;*xxx&quot; and &quot;*xxx*&quot; pattern styles

21. org.springframework.util.xml.PropertyPlaceholderHelper用于处理占位符的替换

22. org.springframework.util.xml.ReflectionUtils反映常用工具方法. 有 findField, setField, getField, findMethod, invokeMethod等有用的方法

23. org.springframework.util.xml.SerializationUtils用于java的序列化与反序列化. serialize与deserialize方法

24. org.springframework.util.xml.StopWatch一个很好的用于记录执行时间的工具类, 且可以用于任务分阶段的测试时间. 最后支持一个很好看的打印格式. 这个类应该经常用

25. org.springframework.util.xml.StringUtils

26. org.springframework.util.xml.SystemPropertyUtils

27. org.springframework.util.xml.TypeUtils用于类型相容的判断. isAssignable

28. org.springframework.util.xml.WeakReferenceMonitor弱引用的监控



## **和web相关的工具**

1. org.springframework.web.util.CookieGenerator

2. org.springframework.web.util.HtmlCharacterEntityDecoder

3. org.springframework.web.util.HtmlCharacterEntityReferences

4. org.springframework.web.util.HtmlUtils

5. org.springframework.web.util.HttpUrlTemplate

   这个类用于用字符串模板构建url, 它会自动处理url里的汉字及其它相关的编码. 在读取别人提供的url资源时, 应该经常用

   `String url = &quot;http://localhost/myapp/{name}/{id}&quot;`

6. org.springframework.web.util.JavaScriptUtils

7. org.springframework.web.util.Log4jConfigListener

   用listener的方式来配制log4j在web环境下的初始化

8. org.springframework.web.util.UriTemplate

9. org.springframework.web.util.UriUtils处理uri里特殊字符的编码

10. org.springframework.web.util.WebUtils

11. org.springframework.web.util.





https://www.toutiao.com/a6506347162224296452/?tt_from=android_share&utm_campaign=client_share&timestamp=1514954987&app=news_article&iid=22128443611&utm_medium=toutiao_android