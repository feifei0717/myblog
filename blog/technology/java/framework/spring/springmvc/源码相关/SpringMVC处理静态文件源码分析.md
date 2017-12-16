# SpringMVC处理静态文件源码分析

SpringMVC处理静态资源，主要是两个标签，mvc:resources和mvc:default-servlet-handler。在详细说明他们的原理之前，需要先简单说明下SpringMVC中请求处理机制：HandlerMapping和HandlerAdapter。

#1 HandlerMapping和HandlerAdapter的来由

用过python Django框架的都知道Django对于访问方式的配置就是，一个url路径和一个函数配对，你访问这个url，就会直接调用这个函数，简单明了

然而对于SpringMVC框架来说，由于java的面向对象,就要找到对应的类以及对应的方法，所以就需要分成2步走

- 第一步 先找到url对应的处理类，叫handler,这里就用到HandlerMapping来寻找
- 第二步 找到了对应的handler之后，我们该调用这个handler的哪个方法呢？这就需要HandlerAdapter来决定

#2 常用的HandlerMapping和HandlerAdapter简单介绍

##2.1 HandlerMapping接口设计和实现

```
public interface HandlerMapping {
	HandlerExecutionChain getHandler(HttpServletRequest request) throws Exception;
}

```

根据request请求，找到对应的HandlerExecutionChain，HandlerExecutionChain是handler和拦截器的结合。如下：

```
public class HandlerExecutionChain {
	private final Object handler;
	private List<HandlerInterceptor> interceptorList;
}
```

即针对某个请求，会有对应的handler和拦截器来处理。HandlerMapping仅仅是找到对应的handler和拦截器罢了，它并不限制handler的类型，任何一个存在于Spring的IOC容器中的bean都可以成为handler，所以这个handler是Object。

下面来看下常见的几个HandlerMapping实现：

- BeanNameUrlHandlerMapping ： 对url直接配置一个bean作为这个url的handler。如在xml中如下配置

  ```
  	<bean id="beanNameUrlMapping" class="org.springframework.web.servlet.handler.BeanNameUrlHandlerMapping"></bean>
  	<bean name="/home" class="com.practice.controller.HomePageController"></bean>
  ```
  controller如下：

  ```
  import org.springframework.web.servlet.ModelAndView;
  import org.springframework.web.servlet.mvc.Controller;

  /**
   * Created by jerryye on 2017/9/6.
   */
  public class HomePageController implements Controller {

      @Override
      public ModelAndView handleRequest(javax.servlet.http.HttpServletRequest httpServletRequest,
                                        javax.servlet.http.HttpServletResponse httpServletResponse) throws Exception {
          return new ModelAndView("home", "rants", "hello,world");
      }

  }
  ```

  当我们访问 http://localhost:8080/home 时，就直接找到这个bean作为handler。

- SimpleUrlHandlerMapping ： 上述只能配置一个url对应的bean，SimpleUrlHandlerMapping就可以配置多个，功能上更强大，它内部有一个Map<String, Object> urlMap，存放着各个url对应的handler，如下

  ```
  <bean id="handler1" class="XXXX"/>
  <bean id="handler2" class="XXXXX"/>
  <bean id="handlerMapping" class="org.springframework.web.servlet.handler.SimpleUrlHandlerMapping">
  	 <property name="urlMap">
           <map>
              <entry key="/user/login.do" value-ref="handler1"/>
  			<entry key="/admin/admin.do" value-ref="handler2"/>
           </map>
       </property>
  </bean>
  ```

##2.2 HandlerAdapter接口设计和实现

```
public interface HandlerAdapter {
	boolean supports(Object handler);
	ModelAndView handle(HttpServletRequest request, HttpServletResponse response,
			 Object handler) throws Exception;
}
```

根据HandlerMapping找到了handler之后，我们该调用handler的哪个方法呢？handler又有哪些方法呢？这里就需要采用适配器的模式，对不同的handler进行不同的处理。因此HandlerAdapter的supports方法首先判断这个handler是否是我能支持的，如果能支持，那我就按照我的处理模式来处理，即调用上述的handle方法。

下面来看下常见的几个HandlerAdapter的实现：

- SimpleServletHandlerAdapter ： 它支持的handler必须是Servlet，这样的话该handler就必然有service(request, response)方法，所以就会调用handler的service(request, response)方法来处理请求，源码如下

  ```
  public class SimpleServletHandlerAdapter implements HandlerAdapter {
  	@Override
  	public boolean supports(Object handler) {
  		return (handler instanceof Servlet);
  	}
  	@Override
  	public ModelAndView handle(HttpServletRequest request, HttpServletResponse response
  			, Object handler)throws Exception {
  		((Servlet) handler).service(request, response);
  		return null;
  	}
  }

  ```

- SimpleControllerHandlerAdapter ： 它支持的handler必须是Controller，Controller接口定义了一个ModelAndView handleRequest(HttpServletRequest request, HttpServletResponse response)方法，所以我们知道该handler必然有一个handleRequest方法，就调用它来处理请求，源码如下

  ```
  public class SimpleControllerHandlerAdapter implements HandlerAdapter {
  	@Override
  	public boolean supports(Object handler) {
  		return (handler instanceof Controller);
  	}
  	@Override
  	public ModelAndView handle(HttpServletRequest request, HttpServletResponse response
  			, Object handler)throws Exception {
  		return ((Controller) handler).handleRequest(request, response);
  	}
  }

  ```

- HttpRequestHandlerAdapter ： 它支持的handler必须是HttpRequestHandler，HttpRequestHandler接口定义了一个void handleRequest(HttpServletRequest request, HttpServletResponse response)方法，所以就知道该调用这个handler的handleRequest方法，源码如下：

  ```
  public class HttpRequestHandlerAdapter implements HandlerAdapter {
  	@Override
  	public boolean supports(Object handler) {
  		return (handler instanceof HttpRequestHandler);
  	}
  	@Override
  	public ModelAndView handle(HttpServletRequest request, HttpServletResponse response
  			, Object handler)throws Exception {
  		((HttpRequestHandler) handler).handleRequest(request, response);
  		return null;
  	}
  }

  ```

以上的几个HandlerMapping和HandlerAdapter属于SpringMVC最初的设计思路。即HandlerMapping和HandlerAdapter毫无关系，HandlerMapping只负责找到对应的handler，HandlerAdapter负责找到handler的哪个方法。然而随着注解的兴起，即@RequestMapping注解直接标注请求对应某个类的某个方法，使得后来的HandlerMapping和HandlerAdapter即 DefaultAnnotationHandlerMapping、AnnotationMethodHandlerAdapter 、RequestMappingHandlerMapping 、RequestMappingHandlerAdapter（前两者已被后两者取代）不再像之前的思路那样，开始争夺权力了，RequestMappingHandlerMapping 在寻找对应的handler时，不仅要匹配到对应的handler，还要找到对应的方法。它们具体详细的内容，可以参考我的之前的博客 [mvc:annotation-driven以及@Controller和@RequestMapping的那些事](http://lgbolgger.iteye.com/blog/2105108)

接下来就轮到重点了（上面的铺垫够长的了，哈哈） 

#3 mvc:resources源码分析

来看下一般的mvc:resources的使用，如下：

```
<mvc:resources location="/WEB-INF/views/css/**" mapping="/css/**"/>

```

然后来看源码。首先要再次声明下，所有在xml中配置的标签，都会有对应的BeanDefinitionParser的实现类来进行处理，对于mvc:resources标签，对应的实现类是ResourcesBeanDefinitionParser，查看其中的源码（这里不再列出，自行去查看），可以知道

注册了一个SimpleUrlHandlerMapping（上文已提到）。它是拥有一个Map<String, Object> urlMap的，它把mvc:resources标签中的mapping属性作为key,把ResourceHttpRequestHandler作为handler。即/css/**类似的url请求，会由这个SimpleUrlHandlerMapping匹配到ResourceHttpRequestHandler上。

再看下，到底调用ResourceHttpRequestHandler的哪个方法来处理请求呢？

ResourceHttpRequestHandler实现了HttpRequestHandler，即是上文提到的HttpRequestHandlerAdapter支持的handler类型，所以就会调用ResourceHttpRequestHandler的void handleRequest(HttpServletRequest request, HttpServletResponse response)方法

其实很容易就明白了，ResourceHttpRequestHandler会根据mvc:resources标签中的location属性作为目录，去寻找对应的资源，然后返回资源的内容。这里就不再详细说明了，可以自行查看ResourceHttpRequestHandler的所实现的handleRequest方法。

#4 mvc:default-servlet-handler 源码分析

同理，mvc:default-servlet-handler标签对应的BeanDefinitionParser的实现类是DefaultServletHandlerBeanDefinitionParser。

这里注册了SimpleUrlHandlerMapping，它的Map<String, Object> urlMap中存放了一个 key为/** ，对应的handler为DefaultServletHttpRequestHandler。即请求路径匹配 /* * 的时候，这个SimpleUrlHandlerMapping会交给DefaultServletHttpRequestHandler来处理。这种情况一般是其他HandlerMapping无法匹配处理，最后才无奈交给DefaultServletHttpRequestHandler。

来看下DefaultServletHttpRequestHandler是怎么处理的：

它同样实现了HttpRequestHandler接口，拥有void handleRequest(HttpServletRequest request, HttpServletResponse response)方法，如下：

```
@Override
public void handleRequest(HttpServletRequest request, HttpServletResponse response)
		throws ServletException, IOException {

	RequestDispatcher rd = this.servletContext.getNamedDispatcher(this.defaultServletName);
	if (rd == null) {
		throw new IllegalStateException("A RequestDispatcher could not be located for the default servlet '" +
				this.defaultServletName +"'");
	}
	rd.forward(request, response);
}

```

我们可以看到，这里其实就是转发给了web容器自身的servlet。这个servlet名称可以在mvc:default-servlet-handler标签中进行配置，如果没有配置，采用默认的配置，如下：

```
/** Default Servlet name used by Tomcat, Jetty, JBoss, and GlassFish */
private static final String COMMON_DEFAULT_SERVLET_NAME = "default";

/** Default Servlet name used by Google App Engine */
private static final String GAE_DEFAULT_SERVLET_NAME = "_ah_default";

/** Default Servlet name used by Resin */
private static final String RESIN_DEFAULT_SERVLET_NAME = "resin-file";

/** Default Servlet name used by WebLogic */
private static final String WEBLOGIC_DEFAULT_SERVLET_NAME = "FileServlet";

/** Default Servlet name used by WebSphere */
private static final String WEBSPHERE_DEFAULT_SERVLET_NAME = "SimpleFileServlet";

```

即tomcat、Jetty等，在容器启动的时候，自身就默认注册了一个name叫default的servlet，可以从我的上一篇文章进行了解[tomcat的url-pattern的源码分析](http://my.oschina.net/pingpangkuangmo/blog/384580)。DefaultServletHttpRequestHandler就是转发给这些servlet。

其实这个时候，请求先经过tomcat的servlet的url-pattern的匹配，进入到了SpringMVC,然后经过SpringMVC的HandlerMapping的一系列匹配，没有对应的handler匹配，导致又再次转发给tomcat等默认的servlet上了，绕了很大的弯，所以要尽量避免这样的操作。

#5 结合tomcat的url-pattern来综合案例

这里举一个案例进行分析，在tomcat发布的根目录中，有一个a.html和a.jsp文件，以及一个SpringMVC项目，如下：

![综合案例](http://static.oschina.net/uploads/space/2015/0318/001034_uybG_2287728.png)

其中SpringMVC项目配置了mvc:default-servlet-handler标签，接下来以SpringMVC的DispatcherServlet的两种配置进行说明，分别是

```
/ 和 /* 两种方式

```

结果分别是：

- DispatcherServlet配置为 / 的时候，a.html和a.jsp都可以正常访问到，如下

  ![访问a.html](http://static.oschina.net/uploads/space/2015/0318/002526_QPsM_2287728.png) ![访问a.jsp](http://static.oschina.net/uploads/space/2015/0318/002558_LxJK_2287728.png)

- DispatcherServlet配置为 /* 的时候,a.html可以正常访问到，a.jsp就不行了，如下

  ![访问a.html](http://static.oschina.net/uploads/space/2015/0318/002526_QPsM_2287728.png) ![访问a.jsp源码输出](http://static.oschina.net/uploads/space/2015/0318/003004_oXIG_2287728.png)

分析如下：

我们知道 /* 的优先级大于 *.jsp的优先级，*.jsp的优先级大于 / （可以由我的上一篇文章了解到[tomcat的url-pattern的源码分析](http://my.oschina.net/pingpangkuangmo/blog/384580)），在这个前提下

访问a.html时：

- 当DispatcherServlet配置为 / 的时候，tomcat仍会选择SpringMVC的DispatcherServlet来处理a.html-》它也处理不了，交给默认配置的mvc:default-servlet-handler来处理-》转发到tomcat默认的servlet的，即DefaultServlet来处理-》DefaultServlet去寻找有没有该文件，找到了，返回文件内容
- 当DispatcherServlet配置为 /* 的时候，tomcat仍然是选择SpringMVC的DispatcherServlet来处理a.html，同上面是一样的过程

访问a.jsp时：

- 当DispatcherServlet配置为 / 的时候，tomcat会优先选择自己已经默认注册的JspServlet来处理-》JspServlet翻译文件内容，返回
- 当DispatcherServlet配置为 /* 的时候，tomcat会选择SpringMVC的DispatcherServlet来处理a.jsp-》发现SpringMVC找不到匹配的handler，交给配置的mvc:default-servlet-handler来处理-》转发到tomcat默认的servlet的，即DefaultServlet来处理-》DefaultServlet仅仅将a.jsp的源码内容进行返回





https://my.oschina.net/pingpangkuangmo/blog/388208

