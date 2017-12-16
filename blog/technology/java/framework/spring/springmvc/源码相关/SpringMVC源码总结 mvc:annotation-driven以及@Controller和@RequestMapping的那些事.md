# SpringMVC源码总结 mvc:annotation-driven以及@Controller和@RequestMapping的那些事



上一篇文章让我们了解HandlerMapping和HandlerAdapter以及默认采取的策略，这篇文章就要讲述mvc:annotation-driven对默认策略的改变。它背后到底注册了哪些HandlerMapping和HandlerAdapter。 
首先可以在DispatcherServlet的initStrategies方法中的initHandlerMappings和initHandlerAdapters中打上断点，来查看注册了哪些HandlerMapping和HandlerAdapter

```
protected void initStrategies(ApplicationContext context) {  
        initMultipartResolver(context);  
        initLocaleResolver(context);  
        initThemeResolver(context);  
        initHandlerMappings(context);  
        initHandlerAdapters(context);  
        initHandlerExceptionResolvers(context);  
        initRequestToViewNameTranslator(context);  
        initViewResolvers(context);  
        initFlashMapManager(context);  
    }  
```

目前我的spring版本是4.0.5。我查看的结果： 
HandlerMapping：注册了 RequestMappingHandlerMapping和BeanNameUrlHandlerMapping 
HandlerAdapter：注册了 RequestMappingHandlerAdapter、HttpRequestHandlerAdapter和SimpleControllerHandlerAdapter 
这几个HandlerMapping和HandlerAdapter上文都提到过。 
下面就要查看下具体的注册过程： 
在xml文件中配置mvc:annotation-driven，肯定有一个专门的类来解析处理这个东西。 
会有这样的一个接口BeanDefinitionParser，它只有一个方法：

 

```
public interface BeanDefinitionParser {  
  
    /** 
     * Parse the specified {@link Element} and register the resulting 
     * {@link BeanDefinition BeanDefinition(s)} with the 
     * {@link org.springframework.beans.factory.xml.ParserContext#getRegistry() BeanDefinitionRegistry} 
     * embedded in the supplied {@link ParserContext}. 
     * <p>Implementations must return the primary {@link BeanDefinition} that results 
     * from the parse if they will ever be used in a nested fashion (for example as 
     * an inner tag in a {@code <property/>} tag). Implementations may return 
     * {@code null} if they will <strong>not</strong> be used in a nested fashion. 
     * @param element the element that is to be parsed into one or more {@link BeanDefinition BeanDefinitions} 
     * @param parserContext the object encapsulating the current state of the parsing process; 
     * provides access to a {@link org.springframework.beans.factory.support.BeanDefinitionRegistry} 
     * @return the primary {@link BeanDefinition} 
     */  
    BeanDefinition parse(Element element, ParserContext parserContext);  
  
}  
```

它是用来专门处理<beans></beans>里面的配置元素。然后我们会找到这样的一个实现类AnnotationDrivenBeanDefinitionParser，它的文档介绍如下：

 

```
/** 
 * 这里清清楚楚写着该类是专门处理 <mvc:annotation-driven/>标签的 
 * A {@link BeanDefinitionParser} that provides the configuration for the 
 * {@code <annotation-driven/>} MVC namespace  element. 
 * 
 * 这里说明了注册的HandlerMapping 
 * <p>This class registers the following {@link HandlerMapping}s:</p> 
 * <ul> 
 *  <li>{@link RequestMappingHandlerMapping} 
 *  ordered at 0 for mapping requests to annotated controller methods. 
 *  <li>{@link BeanNameUrlHandlerMapping} 
 *  ordered at 2 to map URL paths to controller bean names. 
 * </ul> 
 * 
 * <p><strong>Note:</strong> Additional HandlerMappings may be registered 
 * as a result of using the {@code <view-controller>} or the 
 * {@code <resources>} MVC namespace elements. 
 * 
 * 这里说明了注册的HandlerAdapter 
 * <p>This class registers the following {@link HandlerAdapter}s: 
 * <ul> 
 *  <li>{@link RequestMappingHandlerAdapter} 
 *  for processing requests with annotated controller methods. 
 *  <li>{@link HttpRequestHandlerAdapter} 
 *  for processing requests with {@link HttpRequestHandler}s. 
 *  <li>{@link SimpleControllerHandlerAdapter} 
 *  for processing requests with interface-based {@link Controller}s. 
 * </ul> 
 * 
 * <p>This class registers the following {@link HandlerExceptionResolver}s: 
 * <ul> 
 *  <li>{@link ExceptionHandlerExceptionResolver} for handling exceptions 
 *  through @{@link ExceptionHandler} methods. 
 *  <li>{@link ResponseStatusExceptionResolver} for exceptions annotated 
 *  with @{@link ResponseStatus}. 
 *  <li>{@link DefaultHandlerExceptionResolver} for resolving known Spring 
 *  exception types 
 * </ul> 
 * 
 * <p>Both the {@link RequestMappingHandlerAdapter} and the 
 * {@link ExceptionHandlerExceptionResolver} are configured with instances of 
 * the following by default: 
 * <ul> 
 *  <li>A {@link ContentNegotiationManager} 
 *  <li>A {@link DefaultFormattingConversionService} 
 *  <li>A {@link org.springframework.validation.beanvalidation.LocalValidatorFactoryBean} 
 *  if a JSR-303 implementation is available on the classpath 
 *  <li>A range of {@link HttpMessageConverter}s depending on what 3rd party 
 *  libraries are available on the classpath. 
 * </ul> 
 * 
 * @author Keith Donald 
 * @author Juergen Hoeller 
 * @author Arjen Poutsma 
 * @author Rossen Stoyanchev 
 * @author Brian Clozel 
 * @since 3.0 
 */  
class AnnotationDrivenBeanDefinitionParser implements BeanDefinitionParser {  
          //先省略，请详细看下它的文档介绍  
}  
```

上面的文档对mvc:annotation-driven注册的东西都有详细的说明。 
具体看解析过程的代码的内容：

```
@Override  
    public BeanDefinition parse(Element element, ParserContext parserContext) {  
        Object source = parserContext.extractSource(element);  
  
        //省略  
        RootBeanDefinition handlerMappingDef = new RootBeanDefinition(RequestMappingHandlerMapping.class);  
          
        RootBeanDefinition handlerAdapterDef = new RootBeanDefinition(RequestMappingHandlerAdapter.class);  
          
            //省略，  
        // Ensure BeanNameUrlHandlerMapping (SPR-8289) and default HandlerAdapters are not "turned off"  
        MvcNamespaceUtils.registerDefaultComponents(parserContext, source);  
  
        parserContext.popAndRegisterContainingComponent();  
  
        return null;  
    }  
```

MvcNamespaceUtils.registerDefaultComponents的内容如下：

```
public static void registerDefaultComponents(ParserContext parserContext, Object source) {  
        registerBeanNameUrlHandlerMapping(parserContext, source);  
        registerHttpRequestHandlerAdapter(parserContext, source);  
        registerSimpleControllerHandlerAdapter(parserContext, source);  
    }  
```

至此所注册的HandlerMapping和HandlerAdapter我们都找到了。 
然后我们就可以体验下RequestMappingHandlerMapping和BeanNameUrlHandlerMapping，这两个HandlerMapping。由于上一篇文章已经体验过了BeanNameUrlHandlerMapping，接下来就要体验下RequestMappingHandlerMapping，然后你会发觉又有一系列的新名词走进我们的视野，需要我们去弄清楚。 
先体验下： 
首先还是web.xml的配置：

 

```
<!DOCTYPE web-app PUBLIC  
 "-//Sun Microsystems, Inc.//DTD Web Application 2.3//EN"  
 "http://java.sun.com/dtd/web-app_2_3.dtd" >  
  
<web-app>  
  <display-name>Archetype Created Web Application</display-name>  
  <servlet>  
        <servlet-name>mvc</servlet-name>  
        <servlet-class>org.springframework.web.servlet.DispatcherServlet</servlet-class>  
        <load-on-startup>1</load-on-startup>  
    </servlet>  
  
    <servlet-mapping>  
        <servlet-name>mvc</servlet-name>  
        <url-pattern>/*</url-pattern>  
    </servlet-mapping>  
</web-app>  
```

最简单的配置，然后是[servlet-name]-servlet.xml，本工程即mvc-servlet.xml：

 

```
<?xml version="1.0" encoding="UTF-8" ?>  
<beans xmlns="http://www.springframework.org/schema/beans" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:mvc="http://www.springframework.org/schema/mvc" xmlns:util="http://www.springframework.org/schema/util" xmlns:context="http://www.springframework.org/schema/context"  
    xsi:schemaLocation="http://www.springframework.org/schema/beans  
    http://www.springframework.org/schema/beans/spring-beans-3.1.xsd  
    http://www.springframework.org/schema/mvc  
    http://www.springframework.org/schema/mvc/spring-mvc-3.1.xsd  
    http://www.springframework.org/schema/util  
    http://www.springframework.org/schema/util/spring-util-2.0.xsd  
    http://www.springframework.org/schema/context   
    http://www.springframework.org/schema/context/spring-context-3.2.xsd">  
      
      
    <mvc:annotation-driven/>  
      
    <bean class="com.lg.mvc.StringAction"/>  
    <bean name="/index" class="com.lg.mvc.HomeAction"></bean>  
      
      
    <bean class="org.springframework.web.servlet.view.freemarker.FreeMarkerConfigurer">  
        <property name="templateLoaderPath" value="/WEB-INF/views" />  
        <property name="defaultEncoding" value="utf-8" />  
        <property name="freemarkerSettings">  
            <props>  
                <prop key="locale">zh_CN</prop>  
            </props>  
        </property>  
    </bean>  
    <bean class="org.springframework.web.servlet.view.freemarker.FreeMarkerViewResolver">  
        <property name="suffix" value=".html" />  
        <property name="contentType" value="text/html;charset=utf-8" />  
        <property name="requestContextAttribute" value="request" />  
        <property name="exposeRequestAttributes" value="true" />  
        <property name="exposeSessionAttributes" value="true" />  
    </bean>  
</beans>  
```

开启了<mvc:annotation-driven/>，同时注册了两个bean。有RequestMappingHandlerMapping和RequestMappingHandlerAdapter作为后盾支持，然后我们就可以在bean中使用@Controller和@RequestMapping两个标签了。@Controller本身其实与@RequestMapping无关的，它只是@Component中的一个重要的标签而已，但是我们会在源码里看到它对RequestMappingHandlerMapping也是挺重要的，但不是必须的。这里简单说明下：RequestMappingHandlerMapping它会判断一个bean是否含有@Controller标签或者@RequestMapping，如果有其一则会将该bean纳入作为它的处理对象，之后会进一步处理该类上含有@RequestMapping注解的方法。这样做主要是由于@RequestMapping可以配置在类上（作为基础地址），也可以配置在方法上，我们有时候会在类上配置@RequestMapping，有时候又不会，所以只要类含有@Controller或者含有@RequestMapping，RequestMappingHandlerMapping都会将他们纳入自己的handler管辖范围。所以仅仅在方法中含有@RequestMapping注解是不被处理的，必须在类上加入@RequestMapping或者@Controller，而@Controller又不是必须的，你可以试验下，稍后会做源代码说明。下面继续，列出使用了@Controller和@RequestMapping注解的StringAction类

 

```
package com.lg.mvc;  
  
import java.io.UnsupportedEncodingException;  
  
import org.springframework.stereotype.Controller;  
import org.springframework.web.bind.annotation.RequestMapping;  
import org.springframework.web.bind.annotation.RequestMethod;  
import org.springframework.web.bind.annotation.ResponseBody;  
  
@Controller  
public class StringAction {  
      
    @ResponseBody  
    @RequestMapping(value="/string",method=RequestMethod.GET)  
    public String testMessageConverter(String name) throws UnsupportedEncodingException{  
        System.out.println(name);  
        return name;  
    }  
}  
```

然后就可以运行一下，体验一下，先不要管乱码问题，这个问题引出了下一篇文章spring框架中的乱码问题。 
运行结果如下： 

 ![](http://dl2.iteye.com/upload/attachment/0100/2900/49a4b62a-efdf-3256-8b29-7e8583eb396c.png)

证明整个流程跑通了。 
首先@Controller使得StringAction这个handler纳入RequestMappingHandlerMapping管理，RequestMappingHandlerMapping会将这个handler和handler中的每一个含有@RequestMapping的方法都会构建成一个HandlerMethod对象，该类的构造函数为HandlerMethod(Object bean, Method method)，经过这样的包装之后将构造的HandlerMethod对象作为新的handler，然后进行选择适配器，进行方法调用，当RequestMappingHandlerAdapter判断是否support一个类时，就是依据当前的handlelr是否是HandlerMethod类型。若是则由RequestMappingHandlerAdapter来调度执行该handler（handler为HandlerMethod类型）的中的method方法。以上就是整个大体的流程。下面就要用代码来事实说话： 
第一步要弄清RequestMappingHandlerMapping在初始化时是如何寻找它所管辖的bean。说说我找代码的具体流程： 
RequestMappingHandlerMapping的父类AbstractHandlerMethodMapping在初始化时，会调用到这样的一个方法initHandlerMethods，在该方法中，遍历所有的bean然后判断他们是不是含有@Controller或者@RequestMapping注解：

 

```
/** 
     * Scan beans in the ApplicationContext, detect and register handler methods. 
     * @see #isHandler(Class) 
     * @see #getMappingForMethod(Method, Class) 
     * @see #handlerMethodsInitialized(Map) 
     */  
    protected void initHandlerMethods() {  
        if (logger.isDebugEnabled()) {  
            logger.debug("Looking for request mappings in application context: " + getApplicationContext());  
        }  
  
        String[] beanNames = (this.detectHandlerMethodsInAncestorContexts ?  
                BeanFactoryUtils.beanNamesForTypeIncludingAncestors(getApplicationContext(), Object.class) :  
                getApplicationContext().getBeanNamesForType(Object.class));  
  
        for (String beanName : beanNames) {  
            if (!beanName.startsWith(SCOPED_TARGET_NAME_PREFIX) &&  
                    isHandler(getApplicationContext().getType(beanName))){  
                detectHandlerMethods(beanName);  
            }  
        }  
        handlerMethodsInitialized(getHandlerMethods());  
    }  
```

其中的isHandler的判断方法代码如下：

 

```
/** 
     * {@inheritDoc} 
     * Expects a handler to have a type-level @{@link Controller} annotation. 
     */  
    @Override  
    protected boolean isHandler(Class<?> beanType) {  
        return ((AnnotationUtils.findAnnotation(beanType, Controller.class) != null) ||  
                (AnnotationUtils.findAnnotation(beanType, RequestMapping.class) != null));  
    }  
```

如果handler含有了上述注解的其中之一，就会进一步处理该handler的方法中含有@RequestMapping的方法：

 

```
/** 
     * Look for handler methods in a handler. 
     * @param handler the bean name of a handler or a handler instance 
     */  
    protected void detectHandlerMethods(final Object handler) {  
        Class<?> handlerType =  
                (handler instanceof String ? getApplicationContext().getType((String) handler) : handler.getClass());  
  
        // Avoid repeated calls to getMappingForMethod which would rebuild RequestMappingInfo instances  
        final Map<Method, T> mappings = new IdentityHashMap<Method, T>();  
        final Class<?> userType = ClassUtils.getUserClass(handlerType);  
  
        Set<Method> methods = HandlerMethodSelector.selectMethods(userType, new MethodFilter() {  
            @Override  
            public boolean matches(Method method) {  
                T mapping = getMappingForMethod(method, userType);  
                if (mapping != null) {  
                    mappings.put(method, mapping);  
                    return true;  
                }  
                else {  
                    return false;  
                }  
            }  
        });  
  
        for (Method method : methods) {  
            registerHandlerMethod(handler, method, mappings.get(method));  
        }  
    }  
```

遍历这个handler类的所有方法，过滤条件就是这个内部类MethodFilter，其中的getMappingForMethod方法内容为：

 

```
/** 
     * Uses method and type-level @{@link RequestMapping} annotations to create 
     * the RequestMappingInfo. 
     * @return the created RequestMappingInfo, or {@code null} if the method 
     * does not have a {@code @RequestMapping} annotation. 
     * @see #getCustomMethodCondition(Method) 
     * @see #getCustomTypeCondition(Class) 
     */  
    @Override  
    protected RequestMappingInfo getMappingForMethod(Method method, Class<?> handlerType) {  
        RequestMappingInfo info = null;  
        RequestMapping methodAnnotation = AnnotationUtils.findAnnotation(method, RequestMapping.class);  
        if (methodAnnotation != null) {  
            RequestCondition<?> methodCondition = getCustomMethodCondition(method);  
            info = createRequestMappingInfo(methodAnnotation, methodCondition);  
            RequestMapping typeAnnotation = AnnotationUtils.findAnnotation(handlerType, RequestMapping.class);  
            if (typeAnnotation != null) {  
                RequestCondition<?> typeCondition = getCustomTypeCondition(handlerType);  
                info = createRequestMappingInfo(typeAnnotation, typeCondition).combine(info);  
            }  
        }  
        return info;  
    }  
```

如找到了含有RequestMapping注释的方法，则由这个注释的内容构建一个RequestMappingInfo对象：

 

```
/** 
     * Created a RequestMappingInfo from a RequestMapping annotation. 
     */  
    protected RequestMappingInfo createRequestMappingInfo(RequestMapping annotation, RequestCondition<?> customCondition) {  
        String[] patterns = resolveEmbeddedValuesInPatterns(annotation.value());  
        return new RequestMappingInfo(  
                new PatternsRequestCondition(patterns, getUrlPathHelper(), getPathMatcher(),  
                        this.useSuffixPatternMatch, this.useTrailingSlashMatch, this.fileExtensions),  
                new RequestMethodsRequestCondition(annotation.method()),  
                new ParamsRequestCondition(annotation.params()),  
                new HeadersRequestCondition(annotation.headers()),  
                new ConsumesRequestCondition(annotation.consumes(), annotation.headers()),  
                new ProducesRequestCondition(annotation.produces(), annotation.headers(), this.contentNegotiationManager),  
                customCondition);  
    }  
```

就是拿RequestMapping注释的内容进一步封装进RequestMappingInfo对象中。对handler的所有方法过滤完成之后，就要遍历这些方法，以一定的方式存储起来。

 

```
/** 
     * Register a handler method and its unique mapping. 
     * @param handler the bean name of the handler or the handler instance 
     * @param method the method to register 
     * @param mapping the mapping conditions associated with the handler method 
     * @throws IllegalStateException if another method was already registered 
     * under the same mapping 
     */  
    protected void registerHandlerMethod(Object handler, Method method, T mapping) {  
        HandlerMethod newHandlerMethod = createHandlerMethod(handler, method);  
        HandlerMethod oldHandlerMethod = this.handlerMethods.get(mapping);  
        if (oldHandlerMethod != null && !oldHandlerMethod.equals(newHandlerMethod)) {  
            throw new IllegalStateException("Ambiguous mapping found. Cannot map '" + newHandlerMethod.getBean() +  
                    "' bean method \n" + newHandlerMethod + "\nto " + mapping + ": There is already '" +  
                    oldHandlerMethod.getBean() + "' bean method\n" + oldHandlerMethod + " mapped.");  
        }  
  
        this.handlerMethods.put(mapping, newHandlerMethod);  
        if (logger.isInfoEnabled()) {  
            logger.info("Mapped \"" + mapping + "\" onto " + newHandlerMethod);  
        }  
  
        Set<String> patterns = getMappingPathPatterns(mapping);  
        for (String pattern : patterns) {  
            if (!getPathMatcher().isPattern(pattern)) {  
                this.urlMap.add(pattern, mapping);  
            }  
        }  
    }  
```

这里的this.handlerMethods就包含了所有管辖的bean，key为RequestMappingInfo对象，value为handler和它中含有@RequestMapping注释的方法method构建的HandlerMethod。 
如下所示：

 

```
/** 
     * Create the HandlerMethod instance. 
     * @param handler either a bean name or an actual handler instance 
     * @param method the target method 
     * @return the created HandlerMethod 
     */  
    protected HandlerMethod createHandlerMethod(Object handler, Method method) {  
        HandlerMethod handlerMethod;  
        if (handler instanceof String) {  
            String beanName = (String) handler;  
            handlerMethod = new HandlerMethod(beanName, getApplicationContext(), method);  
        }  
        else {  
            handlerMethod = new HandlerMethod(handler, method);  
        }  
        return handlerMethod;  
    }  
```

至此，RequestMappingHandlerMapping的初始化注册工作就完成了。然后就是等待请求，访问 
http://localhost:8080/string?name=aa，RequestMappingHandlerMapping会匹配到由StringAction对象和它的包含注释的方法testMessageConverter构建的HandlerMethod对象，该对象将作为handler，然后再遍历HandlerAdapter判断它们是否支持这个handler，RequestMappingHandlerAdapter的判断依据为是否是HandlerMethod 类型（在AbstractHandlerMethodAdapter类中）：

 

```
public final boolean supports(Object handler) {  
        return handler instanceof HandlerMethod && supportsInternal((HandlerMethod) handler);  
    }  
```

然后将得到匹配，有了这个HandlerMethod对象，便可以通过RequestMappingHandlerAdapter来调度执行HandlerMethod其中的方法。







http://lgbolgger.iteye.com/blog/2105108