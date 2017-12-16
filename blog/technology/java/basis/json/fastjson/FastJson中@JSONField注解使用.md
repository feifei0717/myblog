### [FastJson中@JSONField注解使用](http://blog.csdn.net/u011425751/article/details/51219242)

最近做项目中，使用了json格式在服务器之间进行数据传输。但是发现json格式数据不符合JAVA中的变量定义规则，并且难以理解，因此需要在后台中做二次处理，将数据处理成我们系统中定义的格式。

思路：

​    1. 定义需要返回的bean,bean中定义需要返回的数据

​     2. 获取到需要处理的JSON字符串

​    3. 将JSON字符串转换为bean, 再将转换后的bean返回给客户端。

由于json中的key与bean中的属性不能匹配，因此在转换过程中出现了部分属性为null的情况。经过查看官方文档，发现可以使用@JSONField进行解释，但是并没有详细的使用说明。

**@JSONField的作用对象:**

 1. Field

  2. Setter 和 Getter方法

**注：FastJson在进行操作时，是根据getter和setter的方法进行的，并不是依据Field进行。**

介绍完@JSONField之后，针对以上场景,给出JAVA代码

一、作用Field

​       @JSONField作用在Field时，其name不仅定义了输入key的名称，同时也定义了输出的名称。代码如下:

```
package org.java.json.fastjson.bean;  
  
import com.alibaba.fastjson.JSONObject;  
import com.alibaba.fastjson.annotation.JSONField;  
  
public class Person {  
  
    @JSONField(name="name")  
    private String name;  
      
    @JSONField(name="age")  
    private String age;  
      
    @JSONField(name="desc")  
    private String desc;  
      
    public String getName() {  
        return name;  
    }  
    public void setName(String name) {  
        this.name = name;  
    }  
    public String getAge() {  
        return age;  
    }  
    public void setAge(String age) {  
        this.age = age;  
    }  
    public String getDesc() {  
        return desc;  
    }  
    public void setDesc(String desc) {  
        this.desc = desc;  
    }  
      
    public void setNAME(String NAME) {  
        this.name = NAME;  
    }  
      
    public void setAGE(String AGE) {  
        this.age = AGE;  
    }  
      
    public void setDESC(String DESC) {  
        this.desc = DESC;  
    }  
      
    public String toString() {  
        return JSONObject.toJSONString(this);  
    }  
}  
```

```
package org.java.json.fastjson.json;  
  
import org.java.json.fastjson.bean.Person;  
import org.junit.Before;  
import org.junit.Test;  
  
import com.alibaba.fastjson.JSONObject;  
  
public class PersonTest {  
  
    private Person person;  
      
    /**  
     * 初始化对象  
     */  
    @Before  
    public void setUp() {  
        person = new Person();  
        person.setName("xianglj");  
        person.setAge("20");  
        person.setDesc("只是一个测试");  
    }  
      
    @Test  
    public void test() {  
        String jsonStr = JSONObject.toJSONString(person);  
        System.out.println("bean to json:" + jsonStr);  
          
        //改变json的key为大写  
        jsonStr = jsonStr.toUpperCase();  
          
        System.out.println("需要转换的json:" + jsonStr);  
        person = JSONObject.toJavaObject(JSONObject.parseObject(jsonStr), Person.class);  
        System.out.println("json to bean:" + person.getName());  
    }  
}  
```

输出如下:

```
bean to json:{"age":"20","desc":"只是一个测试","name":"xianglj"}  
需要转换的json:{"AGE":"20","DESC":"只是一个测试","NAME":"XIANGLJ"}  
json to bean:null  
```

从上面我们可以看出，当@JSONField作用在Fileld上时，定义了输入和输出，如果我们传输过来的json格式不符合这个格式时，则不能够正确转换。

二、作用在setter和getter方法上

顾名思义，当作用在setter方法上时，就相当于根据 name 到 json中寻找对应的值，并调用该setter对象赋值。

当作用在getter上时，在bean转换为json时，其key值为name定义的值。实例如下：

```
<pre name="code" class="java">package org.java.json.fastjson.bean;  
  
import com.alibaba.fastjson.JSONObject;  
import com.alibaba.fastjson.annotation.JSONField;  
  
public class Product {  
  
    private String productName;  
    private String desc;  
    private String price;  
      
    @JSONField(name="name")  
    public String getProductName() {  
        return productName;  
    }  
      
    @JSONField(name="NAME")  
    public void setProductName(String productName) {  
        this.productName = productName;  
    }  
      
    @JSONField(name="desc")  
    public String getDesc() {  
        return desc;  
    }  
      
    @JSONField(name="DESC")  
    public void setDesc(String desc) {  
        this.desc = desc;  
    }  
      
    @JSONField(name="price")  
    public String getPrice() {  
        return price;  
    }  
      
    @JSONField(name="PRICE")  
    public void setPrice(String price) {  
        this.price = price;  
    }  
      
    public String toString() {  
        return JSONObject.toJSONString(this);  
    }  
      
}  

```

```
package org.java.json.fastjson.json;  
  
import org.java.json.fastjson.bean.Product;  
import org.junit.Test;  
  
import com.alibaba.fastjson.JSONObject;  
  
/** 
 * 对fastjson中的JSON转换做一个测试 
 * @author xianglj 
 */  
public class JsonObjectTest {  
  
    public static void main(String[] args) {  
        Product product = new Product();  
        product.setProductName("产品");  
        product.setDesc("这是一个产品");  
        product.setPrice("22.3");  
          
        String jsonStr = JSONObject.toJSONString(product);  
        System.out.println("转换为json:" + JSONObject.toJSONString(product));  
          
        //jsonStr = jsonStr.toUpperCase();  
        System.out.println(jsonStr);  
          
        product = JSONObject.toJavaObject(JSONObject.parseObject(jsonStr), Product.class);  
        System.out.println(product.toString());  
    }  
      
    @Test  
    public void test() {  
        Product product = new Product();  
        product.setProductName("产品");  
        product.setDesc("这是一个产品");  
        product.setPrice("22.3");  
          
        String jsonStr = JSONObject.toJSONString(product);  
        System.out.println("转换为json:" + JSONObject.toJSONString(product));  
          
        jsonStr = jsonStr.toUpperCase();  
        System.out.println(jsonStr);  
          
        product = JSONObject.toJavaObject(JSONObject.parseObject(jsonStr), Product.class);  
        System.out.println(product.toString());  
    }  
}  
```

输出如下:

```
转换为json:{"desc":"这是一个产品","name":"产品","price":"22.3"}  
{"DESC":"这是一个产品","NAME":"产品","PRICE":"22.3"}  
{"desc":"这是一个产品","name":"产品","price":"22.3"}  
```

有了这个注解之后，我们在转换bean时，就不需要在手工方式，为不能转换的属性进行赋值。即使以后返回数据反生变化，也能够快速的进行修改。不用修改大片代码。只需要修改注解name值就可以了。

这个注解使用就到这里，希望大家喜欢，支持。

来源： <http://blog.csdn.net/u011425751/article/details/51219242>