[TOC]

/Users/jerryye/backup/studio/AvailableCode/framework/spring/spring_el_value/spring_el_value_demo

# spring 3 表达式语言使用示例 Spring EL 

　　本篇讲述了Spring Expression Language —— 即Spring3中功能丰富强大的表达式语言，简称SpEL。SpEL是类似于OGNL和JSF EL的表达式语言，能够在运行时构建复杂表达式，存取对象属性、对象方法调用等。所有的SpEL都支持XML和Annotation两种方式，格式：#{ SpEL expression }

## 一、      第一个Spring EL例子—— HelloWorld Demo

这个例子将展示如何利用SpEL注入String、Integer、Bean到属性中。

**1.     Spring El的依赖包**

首先在Maven的pom.xml中加入依赖包，这样会自动下载SpEL的依赖。

文件：pom.xml



```
<dependencies>
    <dependency>
        <groupId>org.springframework</groupId>
        <artifactId>spring-core</artifactId>
        <version>3.2.4.RELEASE</version>
    </dependency>
    <dependency>
        <groupId>org.springframework</groupId>
        <artifactId>spring-context</artifactId>
        <version>3.2.4.RELEASE</version>
    </dependency>
  </dependencies>
```



 

 

**2.     Spring Bean**

接下来写两个简单的Bean，稍后会用SpEL注入value到属性中。

Item.java如下：



```
package com.lei.demo.el;

public class Item {

    private String name;
    private int total;
    
    //getter and setter...
}
```



 

Customer.java如下：



```
package com.lei.demo.el;

public class Customer {

    private Item item;
    private String itemName;

　　@Override
    public String toString() {
　　return "itemName=" +this.itemName+" "+"Item.total="+this.item.getTotal();
    }
    
    //getter and setter...

}
```



 

 

**3.     Spring EL——XML**

SpEL格式为#{ SpEL expression }，xml配置见下。

文件：Spring-EL.xml



```
<beans xmlns="http://www.springframework.org/schema/beans"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xsi:schemaLocation="http://www.springframework.org/schema/beans
    http://www.springframework.org/schema/beans/spring-beans-3.0.xsd">
 
    <bean id="itemBean" class="com.lei.demo.el.Item">
        <property name="name" value="itemA" />
        <property name="total" value="10" />
    </bean>
 
    <bean id="customerBean" class="com.lei.demo.el.Customer">
        <property name="item" value="#{itemBean}" />
        <property name="itemName" value="#{itemBean.name}" />
    </bean>
 
</beans>
```



 

注解：

1.* #{itemBean}*——将*itemBean*注入到*customerBean*的*item*属性中。

2.* #{itemBean.name}*——将*itemBean* 的*name*属性，注入到*customerBean*的属性*itemName*中。

 

**4.     Spring EL——Annotation**

SpEL的Annotation版本。

注意：要在Annotation中使用SpEL，必须要通过annotation注册组件。如果你在xml中注册了bean和在java class中定义了@Value，@Value在运行时将失败。

 

Item.java如下：



```
package com.lei.demo.el;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component("itemBean")
public class Item {

    @Value("itemA")//直接注入String
    private String name;
    
    @Value("10")//直接注入integer
    private int total;
    
    //getter and setter...
}
```



 

 

Customer.java如下：



```
package com.lei.demo.el;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component("customerBean")
public class Customer {

    @Value("#{itemBean}")
    private Item item;
    
    @Value("#{itemBean.name}")
    private String itemName;
    
　　//getter and setter...
}
```



 

 

Xml中配置组件自动扫描



```
<beans xmlns="http://www.springframework.org/schema/beans"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
    xmlns:context="http://www.springframework.org/schema/context"
    xsi:schemaLocation="http://www.springframework.org/schema/beans
    http://www.springframework.org/schema/beans/spring-beans-3.0.xsd
    http://www.springframework.org/schema/context
    http://www.springframework.org/schema/context/spring-context-3.0.xsd">
 
    <context:component-scan base-package="com.lei.demo.el" />
 
</beans>
```



 

 

在Annotation模式中，用@Value定义EL。在这种情况下，直接注入一个String和integer值到itemBean中，然后注入itemBean到customerBean中。

 

**5.     输出结果**

App.java如下：



```
package com.lei.demo.el;

import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

public class App {

    public static void main(String[] args) {

        ApplicationContext context = new ClassPathXmlApplicationContext("Spring-EL.xml");
         
        Customer obj = (Customer) context.getBean("customerBean");
        System.out.println(obj);

    }

}
```



 

 

输出结果如下：itemName=itemA item.total=10

 

## 二、      Spring EL Method Invocation——SpEL 方法调用

SpEL允许开发者用El运行方法函数，并且允许将方法返回值注入到属性中。

### 1.      Spring EL Method Invocation之Annotation

此段落演示用@Value注释，完成SpEL方法调用。

Customer.java如下：

```
package com.lei.demo.el;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
 
@Component("customerBean")
public class Customer {
 
    @Value("#{'lei'.toUpperCase()}")
    private String name;
 
    @Value("#{priceBean.getSpecialPrice()}")
    private double amount;
    
    //getter and setter...省略
 
    @Override
    public String toString() {
        return "Customer [name=" + name + ", amount=" + amount + "]";
    }
 
}
```

Price.java如下：

```
package com.lei.demo.el;
 
import org.springframework.stereotype.Component;
 
@Component("priceBean")
public class Price {
 
    public double getSpecialPrice() {
        return new Double(99.99);
    }
 
}
```



 

 

输出结果：Customer[name=LEI,amount=99.99]

上例中，以下语句调用toUpperCase()方法

```
@Value("#{'lei'.toUpperCase()}")
private String name;
```

 

 

上例中，以下语句调用priceBean中的getSpecialPrice()方法

```
@Value("#{priceBean.getSpecialPrice()}")
private double amount;
```

 

 

### 2.      Spring EL Method Invocation之XML

在XMl中配置如下，效果相同

 



```
<beans xmlns="http://www.springframework.org/schema/beans"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xsi:schemaLocation="http://www.springframework.org/schema/beans
    http://www.springframework.org/schema/beans/spring-beans-3.0.xsd">
 
    <bean id="customerBean" class="com.leidemo.el.Customer">
        <property name="name" value="#{'lei'.toUpperCase()}" />
        <property name="amount" value="#{priceBean.getSpecialPrice()}" />
    </bean>
 
    <bean id="priceBean" class="com.lei.demo.el.Price" />
 
</beans>
```



 

 

## 三、      Spring EL Operators——SpEL 操作符

　　Spring EL 支持大多数的数学操作符、逻辑操作符、关系操作符。

　　1.关系操作符

　　包括：等于 (==, eq)，不等于 (!=, ne)，小于 (<, lt),，小于等于(<= , le)，大于(>, gt)，大于等于 (>=, ge)

　　2.逻辑操作符

　　包括：and，or，and not(!)

　　3.数学操作符

　　包括：加 (+)，减 (-)，乘 (*)，除 (/)，取模 (%)，幂指数 (^)。

### 1.      Spring EL Operators之Annotation

Numer.java如下



```
package com.lei.demo.el;
 
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
 
@Component("numberBean")
public class Number {
 
    @Value("999")
    private int no;
 
    public int getNo() {
        return no;
    }
 
    public void setNo(int no) {
        this.no = no;
    }
 
}
```



 

 

Customer.java如下



```
package com.lei.demo.el;
 
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
 
@Component("customerBean")
public class Customer {
 
    //Relational operators
 
    @Value("#{1 == 1}") //true
    private boolean testEqual;
 
    @Value("#{1 != 1}") //false
    private boolean testNotEqual;
 
    @Value("#{1 < 1}") //false
    private boolean testLessThan;
 
    @Value("#{1 <= 1}") //true
    private boolean testLessThanOrEqual;
 
    @Value("#{1 > 1}") //false
    private boolean testGreaterThan;
 
    @Value("#{1 >= 1}") //true
    private boolean testGreaterThanOrEqual;
 
    //Logical operators , numberBean.no == 999
 
    @Value("#{numberBean.no == 999 and numberBean.no < 900}") //false
    private boolean testAnd;
 
    @Value("#{numberBean.no == 999 or numberBean.no < 900}") //true
    private boolean testOr;
 
    @Value("#{!(numberBean.no == 999)}") //false
    private boolean testNot;
 
    //Mathematical operators
 
    @Value("#{1 + 1}") //2.0
    private double testAdd;
 
    @Value("#{'1' + '@' + '1'}") //1@1
    private String testAddString;
 
    @Value("#{1 - 1}") //0.0
    private double testSubtraction;
 
    @Value("#{1 * 1}") //1.0
    private double testMultiplication;
 
    @Value("#{10 / 2}") //5.0
    private double testDivision;
 
    @Value("#{10 % 10}") //0.0
    private double testModulus ;
 
    @Value("#{2 ^ 2}") //4.0
    private double testExponentialPower;
 
    @Override
    public String toString() {
        return "Customer [testEqual=" + testEqual + ", testNotEqual="
                + testNotEqual + ", testLessThan=" + testLessThan
                + ", testLessThanOrEqual=" + testLessThanOrEqual
                + ", testGreaterThan=" + testGreaterThan
                + ", testGreaterThanOrEqual=" + testGreaterThanOrEqual
                + ", testAnd=" + testAnd + ", testOr=" + testOr + ", testNot="
                + testNot + ", testAdd=" + testAdd + ", testAddString="
                + testAddString + ", testSubtraction=" + testSubtraction
                + ", testMultiplication=" + testMultiplication
                + ", testDivision=" + testDivision + ", testModulus="
                + testModulus + ", testExponentialPower="
                + testExponentialPower + "]";
    }
 
}
```



 

 

运行如下代码：

```
Customer obj = (Customer) context.getBean("customerBean");
System.out.println(obj);
```

 

结果如下：



```
Customer [
    testEqual=true, 
    testNotEqual=false, 
    testLessThan=false, 
    testLessThanOrEqual=true, 
    testGreaterThan=false, 
    testGreaterThanOrEqual=true, 
    testAnd=false, 
    testOr=true, 
    testNot=false, 
    testAdd=2.0, 
    testAddString=1@1, 
    testSubtraction=0.0, 
    testMultiplication=1.0, 
    testDivision=5.0, 
    testModulus=0.0, 
    testExponentialPower=4.0
]
```



 

 

### 2.      Spring EL Operators之XML

以下是等同的xml配置。

注意，类似小于号“<”，或者小于等于“<=”，在xml中是不直接支持的，必须用等同的文本表示方法表示，

例如，“<”用“lt”替换；“<=”用“le”替换，等等。



```
<beans xmlns="http://www.springframework.org/schema/beans"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xsi:schemaLocation="http://www.springframework.org/schema/beans
    http://www.springframework.org/schema/beans/spring-beans-3.0.xsd">
 
    <bean id="customerBean" class="com.lei.demo.el.Customer">
 
      <property name="testEqual" value="#{1 == 1}" />
      <property name="testNotEqual" value="#{1 != 1}" />
      <property name="testLessThan" value="#{1 lt 1}" />
      <property name="testLessThanOrEqual" value="#{1 le 1}" />
      <property name="testGreaterThan" value="#{1 > 1}" />
      <property name="testGreaterThanOrEqual" value="#{1 >= 1}" />
 
      <property name="testAnd" value="#{numberBean.no == 999 and numberBean.no lt 900}" />
      <property name="testOr" value="#{numberBean.no == 999 or numberBean.no lt 900}" />
      <property name="testNot" value="#{!(numberBean.no == 999)}" />
 
      <property name="testAdd" value="#{1 + 1}" />
      <property name="testAddString" value="#{'1' + '@' + '1'}" />
      <property name="testSubtraction" value="#{1 - 1}" />
      <property name="testMultiplication" value="#{1 * 1}" />
      <property name="testDivision" value="#{10 / 2}" />
      <property name="testModulus" value="#{10 % 10}" />
      <property name="testExponentialPower" value="#{2 ^ 2}" />
 
    </bean>
 
    <bean id="numberBean" class="com.lei.demo.el.Number">
        <property name="no" value="999" />
    </bean>
 
</beans>
```



 

 

## 四、      Spring EL 三目操作符condition?true:false

SpEL支持三目运算符，以此来实现条件语句。

### 1.      Annotation

Item.java如下：



```
package com.lei.demo.el;
 
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
 
@Component("itemBean")
public class Item {
 
    @Value("99")
    private int qtyOnHand;
 
    public int getQtyOnHand() {
        return qtyOnHand;
    }
 
    public void setQtyOnHand(int qtyOnHand) {
        this.qtyOnHand = qtyOnHand;
    }
 
}
```



 

 

Customer.java如下：



```
package com.lei.demo.el;
 
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
 
@Component("customerBean")
public class Customer {
 
    @Value("#{itemBean.qtyOnHand < 100 ? true : false}")
    private boolean warning;
 
    public boolean isWarning() {
        return warning;
    }
 
    public void setWarning(boolean warning) {
        this.warning = warning;
    }
 
    @Override
    public String toString() {
        return "Customer [warning=" + warning + "]";
    }
 
}
```



 

 

```
输出：Customer [warning=true]
```

 

### 2.      XMl

Xml配置如下，注意：应该用“&lt；”代替小于号“<”



```
<beans xmlns="http://www.springframework.org/schema/beans"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xsi:schemaLocation="http://www.springframework.org/schema/beans
    http://www.springframework.org/schema/beans/spring-beans-3.0.xsd">
 
    <bean id="customerBean" class="com.lei.demo.el.Customer">
        <property name="warning" 
                          value="#{itemBean.qtyOnHand &lt; 100 ? true : false}" />
    </bean>
 
    <bean id="itemBean" class="com.lei.demo.el.Item">
        <property name="qtyOnHand" value="99" />
    </bean>
 
</beans>
```



 

 

```
输出：Customer [warning=true]
```

 

## 五、      Spring EL 操作List、Map集合取值

此段演示SpEL怎样从List、Map集合中取值，简单示例如下：



```
　　//get map where key = 'MapA'
    @Value("#{testBean.map['MapA']}")
    private String mapA;
 
    //get first value from list, list is 0-based.
    @Value("#{testBean.list[0]}")
    private String list;
```



 

 

### 1.      Annotation

首先，创建一个HashMap和ArrayList，并初始化一些值。

Test.java如下：



```
package com.lei.demo.el;
 
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.springframework.stereotype.Component;
 
@Component("testBean")
public class Test {
 
    private Map<String, String> map;
    private List<String> list;
 
    public Test() {
        map = new HashMap<String, String>();
        map.put("MapA", "This is A");
        map.put("MapB", "This is B");
        map.put("MapC", "This is C");
 
        list = new ArrayList<String>();
        list.add("List0");
        list.add("List1");
        list.add("List2");
 
    }
 
    public Map<String, String> getMap() {
        return map;
    }
 
    public void setMap(Map<String, String> map) {
        this.map = map;
    }
 
    public List<String> getList() {
        return list;
    }
 
    public void setList(List<String> list) {
        this.list = list;
    }
 
}
```



 

 

然后，用SpEL取值，Customer.java如下



```
package com.lei.demo.el;
 
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
 
@Component("customerBean")
public class Customer {
 
    @Value("#{testBean.map['MapA']}")
    private String mapA;
 
    @Value("#{testBean.list[0]}")
    private String list;
 
    public String getMapA() {
        return mapA;
    }
 
    public void setMapA(String mapA) {
        this.mapA = mapA;
    }
 
    public String getList() {
        return list;
    }
 
    public void setList(String list) {
        this.list = list;
    }
 
    @Override
    public String toString() {
        return "Customer [mapA=" + mapA + ", list=" + list + "]";
    }
 
}
```



 

 

调用代码如下：

 

```
Customer obj = (Customer) context.getBean("customerBean");
System.out.println(obj);
```

 

 

 

 

```
输出结果：Customer [mapA=This is A, list=List0]
```

 

### 2.      XML

Xml配置如下：



```
<beans xmlns="http://www.springframework.org/schema/beans"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xsi:schemaLocation="http://www.springframework.org/schema/beans
    http://www.springframework.org/schema/beans/spring-beans-3.0.xsd">
 
    <bean id="customerBean" class="com.lei.demo.el.Customer">
        <property name="mapA" value="#{testBean.map['MapA']}" />
        <property name="list" value="#{testBean.list[0]}" />
    </bean>
 
    <bean id="testBean" class="com.lei.demo.el.Test" />
 
</beans>
```




http://blog.csdn.net/a1610770854/article/details/51908390