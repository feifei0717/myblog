web项目web.xml的配置中配置是起什么作用

1.启动一个WEB项目的时候,容器(如:Tomcat)会去读它的配置文件web.xml.读两个节点: <listener></listener> 和 <context-param></context-param>

2.紧接着,容器创建一个ServletContext(上下文),这个WEB项目所有部分都将共享这个上下文.

3.容器将<context-param></context-param>转化为键值对,并交给ServletContext.

4.容器创建<listener></listener>中的类实例,即创建监听.

5.在监听中会有contextInitialized(ServletContextEvent args)初始化方法,在这个方法中获得 

ServletContext = ServletContextEvent.getServletContext(); 

context-param的值 = ServletContext.getInitParameter("context-param的键");

6.得到这个context-param的值之后,你就可以做一些操作了.注意,这个时候你的WEB项目还没有完全启动完成.这个动作会比所有的Servlet都要早. 

换句话说,这个时候,你对<context-param>中的键值做的操作,将在你的WEB项目完全启动之前被执行.

7.举例.你可能想在项目启动之前就打开数据库. 

那么这里就可以在<context-param>中设置数据库的连接方式,在监听类中初始化数据库的连接.

8.这个监听是自己写的一个类,除了初始化方法,它还有销毁方法.用于关闭应用前释放资源.比如说数据库连接的关闭.

=========================================



应用事件监听器程序是建立或修改servlet环境或会话对象时通知的类。它们是servlet规范的版本2.3中的新内容。这里只简单地说明用来向Web应用注册一个监听程序的web.xml的用法。

​      注册一个监听程序涉及在web.xml的web-app元素内放置一个listener元素。在listener元素内，listener-class元素列出监听程序的完整的限定类名，如下所示：

```
<listener> 
<listener-class>package.ListenerClass</listener-class> 
</listener>
```

​      虽然listener元素的结构很简单，但请不要忘记，必须正确地给出web-app元素内的子元素的次序。listener元素位于所有的servlet元素之前以及所有filter-mapping元素之后。此外，因为应用生存期监听程序是serlvet规范的2.3版本中的新内容，所以必须使用web.xml DTD的2.3版本，而不是2.2版本。

​      例如，程序清单5-20给出一个名为ContextReporter的简单的监听程序，只要Web应用的Servlet-Context建立（如装载Web应用）或消除（如服务器关闭）时，它就在标准输出上显示一条消息。程序清单5-21给出此监听程序注册所需要的web.xml文件的一部分。



程序清单5-20 ContextReporterjava 

```
package moreservlets;

import javax.servlet.*; 
import java.util.*;

/** Simple listener that prints a report on the standard output 
* when the ServletContext is created or destroyed. 
* <P> 
* Taken from More Servlets and JavaServer Pages 
* from Prentice Hall and Sun Microsystems Press, 
* http://www.moreservlets.com/. 
* © 2002 Marty Hall; may be freely used or adapted. 
*/

public class ContextReporter implements ServletContextListener { 
public void contextInitialized(ServletContextEvent event) { 
System.out.println("Context created on " + 
new Date() + "."); 
}

public void contextDestroyed(ServletContextEvent event) { 
System.out.println("Context destroyed on " + 
new Date() + "."); 
} 
}

程序清单5-21 web.xml（声明一个监听程序的摘录） 
<?xml version="1.0" encoding="ISO-8859-1"?> 
<!DOCTYPE web-app 
PUBLIC "-//Sun Microsystems, Inc.//DTD Web Application 2.3//EN" 
"http://java.sun.com/dtd/web-app_2_3.dtd">

<web-app> 
<!-- ... --> 
<filter-mapping> … </filter-mapping> 
<listener> 
<listener-class>package.ListenerClass</listener-class> 
</listener> 
<servlet> ... </servlet> 
<!-- ... --> 
</web-app>
```

来源： http://www.xuebuyuan.com/724867.html