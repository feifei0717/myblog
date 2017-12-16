让Tomcat解析php

分类: web container
日期: 2015-03-12

 

http://blog.chinaunix.net/uid-29632145-id-4887155.html

------

****[让Tomcat解析php]() *2015-03-12 17:14:11*

分类： Java

需要工具：

(1) apache tomcat
(2) Quercus

 

Quercus在web-inf/lib/下的jar包，放到$TOMCAT_HOME/lib下面，修改$TOMCAT_HOME/conf/web.xml文件，加入如下servlet映射：

```
<servlet>  
<servlet-name>Quercus Servletservlet-name>  
<servlet-class>com.caucho.quercus.servlet.QuercusServletservlet-class>  
```

