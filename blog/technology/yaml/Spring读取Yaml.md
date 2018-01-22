# Spring读取Yaml

## Spring 4.1开始支持 Yaml支持 

http://jinnianshilongnian.iteye.com/blog/2103752

YAML类似于JSON，做配置文件还是不错的，需要添加org.yaml.snakeyaml依赖。目前支持把YAML文本转换成Map和Properties：

yaml.txt

```
env:  
    one:  
        name: zhangsan  
  
    two:  
        -   a: 1  
            b: 2  
        -   c: "3"  
            d: 4  
    three: 
```

yaml-override.txt

```
env:  
    three: 11
```

配置文件

```
<bean id="yamlMap" class="org.springframework.beans.factory.config.YamlMapFactoryBean">  
    <property name="resources">  
        <list>  
            <value>classpath:yaml.txt</value>  
            <value>classpath:yaml-override.txt</value>  
        </list>  
    </property>  
    <property name="resolutionMethod" value="FIRST_FOUND"/>  
</bean>  
  
<bean id="yamlProperties" class="org.springframework.beans.factory.config.YamlPropertiesFactoryBean">  
    <property name="resources">  
        <list>  
            <value>classpath:yaml.txt</value>  
            <value>classpath:yaml-override.txt</value>  
        </list>  
    </property>  
    <property name="resolutionMethod" value="FIRST_FOUND"/>  
</bean>  
```

在应用中使用：

```
@Autowired  
private ApplicationContext ctx;  
  
@Autowired  
@Qualifier("yamlProperties")  
private Properties yamlProperties;  

@Test  
public void testYmlMap() {  
    //Map（不能直接注入@Autowired Map）  
    //请参考 Map依赖注入（http://jinnianshilongnian.iteye.com/blog/1989379）  
    System.out.println(this.yamlMap);  
    Map<String, Object> yamlMap = ctx.getBean("yamlMap", Map.class);  
    //需要snakeyaml 该功能是从spring-boot引入的  
    Map<String, Object> env = (Map<String, Object>) yamlMap.get("env");  
    Map<String, Object> one = (Map<String, Object>) env.get("one");  
    Assert.assertEquals("zhangsan", one.get("name"));  
  
    List<Map<String, Object>> two = (List) env.get("two");  
    Assert.assertEquals(1, two.get(0).get("a"));  
    Assert.assertEquals("3", two.get(1).get("c"));  
  
    Assert.assertEquals(null, env.get("three"));  
  
  
    //Properties  
    Assert.assertEquals("zhangsan", yamlProperties.getProperty("env.one.name"));  
    //getProperty如果返回的数据时非String的则返回null  
    Assert.assertEquals(1, yamlProperties.get("env.two[0].a"));  
    Assert.assertEquals("3", yamlProperties.getProperty("env.two[1].c"));  
    Assert.assertEquals("", yamlProperties.getProperty("env.three"));  
  
  
    //spring.profiles  
    //http://docs.spring.io/spring-boot/docs/current-SNAPSHOT/reference/htmlsingle/#boot-features-external-config-yaml  
}  
```

该特性是从Spring Boot引入，可以直接参考其[文档](http://docs.spring.io/spring-boot/docs/current-SNAPSHOT/reference/htmlsingle/#boot-features-external-config-yaml)。

 

此处需要注意不能：

```
@Autowired  
@Qualifier("yamlMap")  
private Map<String, Object> yamlMap;  
```

原因请参考 Map依赖注入（<http://jinnianshilongnian.iteye.com/blog/1989379>）。

 







## 简明教程

https://yq.aliyun.com/articles/60723

To use `Maven: org.springframework:spring-beans:4.3.2.RELEASE2`

```
public class YamlUtils {
    private static final Logger logger = LogManager.getLogger(YamlUtils.class);

    public static Map<String, Object> yaml2Map(String yamlSource) {
        try {
            YamlMapFactoryBean yaml = new YamlMapFactoryBean();
            yaml.setResources(new ClassPathResource(yamlSource));
            return yaml.getObject();
        } catch (Exception e) {
            logger.error("Cannot read yaml", e);
            return null;
        }
    }

    public static Properties yaml2Properties(String yamlSource) {
        try {
            YamlPropertiesFactoryBean yaml = new YamlPropertiesFactoryBean();
            yaml.setResources(new ClassPathResource(yamlSource));
            return yaml.getObject();
        } catch (Exception e) {
            logger.error("Cannot read yaml", e);
            return null;
        }
    }
}
public class TestYamlUtils {
    private static final Logger logger = LogManager.getLogger(TestYamlUtils.class);

    @Test
    public void testYaml2Map() {
        Map<String, Object> map = YamlUtils.yaml2Map("neiwai.yml");
        Assert.assertNotNull(map);
        map.forEach((k, v) -> {
            logger.info("k={},v={}", k, v);
        });
    }

    @Test
    public void testYaml2Properties() {
        Properties prop =  YamlUtils.yaml2Properties("neiwai.yml");
        Assert.assertNotNull(prop);
        prop.forEach((k, v) -> {
            logger.info("k={},v={}", k, v);
        });
    }
}
```

 



