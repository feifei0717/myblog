# Spring Boot 中文乱码解决

使用SpringBoot开发，对外开发接口供调用，传入参数中有中文，出现中文乱码，查了好多资料，总结解决方法如下：

## 第一步,约定传参编码格式

不管是使用httpclient，还是okhttp，都要设置传参的编码，为了统一，这里全部设置为utf-8

## 第二步，修改application.properties文件

增加如下配置：

```
spring.http.encoding.force=true
spring.http.encoding.charset=UTF-8
spring.http.encoding.enabled=true
server.tomcat.uri-encoding=UTF-81234
```

此时拦截器中返回的中文已经不乱码了，但是controller中返回的数据依旧乱码。

## 第三步，修改controller的@RequestMapping

修改如下：

```
produces="text/plain;charset=UTF-8"1
```

这种方法的弊端是限定了数据类型，继续查找资料，在stackoverflow上发现解决办法，是在配置类中增加如下代码：

```
@Configuration
public class CustomMVCConfiguration extends WebMvcConfigurerAdapter {

    @Bean
    public HttpMessageConverter<String> responseBodyConverter() {
        StringHttpMessageConverter converter = new StringHttpMessageConverter(
                Charset.forName("UTF-8"));
        return converter;
    }

    @Override
    public void configureMessageConverters(
            List<HttpMessageConverter<?>> converters) {
        super.configureMessageConverters(converters);
        converters.add(responseBodyConverter());
    }

    @Override
    public void configureContentNegotiation(
            ContentNegotiationConfigurer configurer) {
        configurer.favorPathExtension(false);
    }
}1234567891011121314151617181920212223
```

便可以解决SpringBoot的中文乱码问题了。 
ps：stackoverflow网址 
<http://stackoverflow.com/questions/27606769/how-to-overwrite-stringhttpmessageconverter-default-charset-to-use-utf8-in-sprin> 
<http://stackoverflow.com/questions/20935969/make-responsebody-annotated-spring-boot-mvc-controller-methods-return-utf-8>







http://blog.csdn.net/wangshuang1631/article/details/70753801