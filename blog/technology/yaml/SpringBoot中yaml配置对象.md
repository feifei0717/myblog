[TOC]



# SpringBoot中yaml配置对象

## 一：前言

YAML可以代替传统的xx.properties文件，但是它支持声明map,数组，list，字符串，boolean值，数值，NULL，日期，基本满足开发过程中的所有配置。

长期以来，我们使用xml配置文件与properties配置文件。但是YAML却基本无人使用，故有了此文

 

## 二：常用配置文件的优缺点及演示

### 2.1:优缺点

XML优点:xml配置文件所用最多的地方就是spring的配置文件了。当然，它也很灵活，它以自定义的标签可以满足种种需要，而且可以声明多个同样的标签。

XML缺点:配置起来麻烦，读取繁琐。

properties优点:读取简单，配置简单，spring可以直接加载properties文件，不需要我们写代码读取。

properties缺点:但是不支持配置多个同样的属性，这是最大的缺点。 

### 2.2:优缺点演示

这里演示一下properties的缺点。

假定我有一个应用场景，我需要配置多台redis做为redis的集群。

现在写properties的配置文件

```
redis.ip=10.1.10.1
redis.port=6379
redis.password=123456
```

好吧，我只能配置一个。

当然，其实我也可以这样配置

```
#第一台
redis1.ip=10.1.10.1
redis1.port=6379
redis1.password=123456
#第二台
redis2.ip=10.1.10.1
redis2.port=6379
redis2.password=123456
```

以上面的这种配置，我基本上可以无限的配置，但是这对于代码上面读取又是一个问题，我根本不知道配置文件中配置了多少个节点。

这个时候我会想到xml的配置方式，它灵活，多变。

```
<xml>
    <redis>
        <node>
            <ip>10.1.2.1</ip>
            <port>6379</port>
            <password>123</password>
        </node>
        <node>
            <ip>10.1.2.1</ip>
            <port>6379</port>
            <password>123</password>
        </node>
        <node>
            <ip>10.1.2.1</ip>
            <port>6379</port>
            <password>123</password>
        </node>
        <node>
            <ip>10.1.2.1</ip>
            <port>6379</port>
            <password>123</password>
        </node>
    </redis>
</xml>
```

xml这种方式就完全支持多个节点的配置，我只需要遍历redis下的所有node节点就行了，但是它的配置与读取就相对繁琐了。

 

## 三：YAML的配置文件

第一次接触YAML是在spring-boot中的，刚开始接触的时候也是有点抵制，但是慢慢的就越来越喜欢它了。

### 3.1:基本用法

yml不能用制表符，必须输入空格，但是可以输入任意个空格，只需要对齐就行了。

```
project:
  redis:
    ip: 10.8.16.232      #冒号后台必须接空格，读取的时候会去掉前后空格，用#可以进行注释
    port: 6379
  mysql:
    url: jdbc://....
    user: root
    password: 111
```

这是一个简单的yaml,它就相当于properties中的

```
project.redis.ip=10.8.16.232
project.redis.port=6379
project.mysql.url=xxx
project.mysql.root=12
project.mysq.password=xx
```

可以看到yml就省略了前面的部分，并且在spring中，使用@Value()注解，同样可以把该值取出来 

### 3.2:配置对象

现在我们用yml来解决之前遇到配置多个redis的问题

```
xx:
  test:
    hehe: normal
    txtarray: 1,2,3,a  #这种对象形式的，只能单独写一个对象去接收，所以无法使用@value注解获取
    listmap:
      - host: zxj
        port: 10
        active: 9
      - host: ly
        port: 11
        active: 8
    liststr:
      - name
      - value
    map:
      a: a
      b: b    
```

可以看到在xxx.test.listmap中，我们定义了两个集合，以- 开头的，就是代表着数组集合。

可以参考 <http://www.ruanyifeng.com/blog/2016/07/yaml.html?f=tt>   来学习YAML的语法

### 3.2:java读取

在spring-boot中，定义一个application.yml，然后写入上面的配置，

然后定义这样一个类

```
import java.util.Arrays;
import java.util.List;
import java.util.Map;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

/**
 * @author 朱小杰
 * @since 2016年11月14日 上午10:33:36
 * 版本 1.0<br>
 * @see 需要生成set方法
 */
@Component
@ConfigurationProperties(prefix = "xx.test")
public class ConfigProperties {

    private String hehe;
    
    private String[] txtarray;
    
    private List<Map<String,String>> listmap;
    
    private List<String> liststr;
    
    private Map<String,String> map;
    

    /**
     * @param 设置 hehe
     */
    public void setHehe(String hehe) {
        this.hehe = hehe;
    }
    





    /**
     * @param 设置 txtarray
     */
    public void setTxtarray(String[] txtarray) {
        this.txtarray = txtarray;
    }
    





    /**
     * @param 设置 listmap
     */
    public void setListmap(List<Map<String, String>> listmap) {
        this.listmap = listmap;
    }
    





    /**
     * @param 设置 liststr
     */
    public void setListstr(List<String> liststr) {
        this.liststr = liststr;
    }
    





    /**
     * @return 获取 hehe
     */
    public String getHehe() {
        return hehe;
    }
    






    /**
     * @return 获取 txtarray
     */
    public String[] getTxtarray() {
        return txtarray;
    }
    






    /**
     * @return 获取 listmap
     */
    public List<Map<String, String>> getListmap() {
        return listmap;
    }
    






    /**
     * @return 获取 liststr
     */
    public List<String> getListstr() {
        return liststr;
    }
    






    /**
     * @return 获取 map
     */
    public Map<String, String> getMap() {
        return map;
    }
    






    /**
     * @param 设置 map
     */
    public void setMap(Map<String, String> map) {
        this.map = map;
    }
    





    /**
     * @see [说明这个方法]
     * @return
     * @since 2016年11月14日 上午10:38:49
     */
    @Override
    public String toString() {
        return "ConfigProperties [hehe=" + hehe + ", txtarray=" + Arrays.toString(txtarray) + ", listmap=" + listmap
                + ", liststr=" + liststr + ", map=" + map + "]";
    }
    
}
```

属性名必须与YAML中的参数名一致，必须声明get/set方法，get与set都要。而且使用了yaml的对象，不能使用@Value("${}")注解来获取值，当然，如果是普通的映射是可以的，数组，map，list这种是不行的，只能通过上面的方式，注入到一个对象里面去，

然后再@Autowird取这个对象来获取值





http://www.cnblogs.com/zhuxiaojie/p/6062014.html 