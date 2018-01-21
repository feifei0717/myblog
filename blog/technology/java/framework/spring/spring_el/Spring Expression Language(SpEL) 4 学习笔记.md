[TOC]

/Users/jerryye/backup/studio/AvailableCode/framework/spring/spring_el_value/spring_el_value_demo

# Spring Expression Language(SpEL) 4 学习笔记



## 前言

时隔多年重新开始学习Spring，之前只用过Spring 2，掰掰指头已经过了快10年了。
看到书里提到了SpEL，一头雾水，在2的时代好像从来没见过。把学习到的做个总结。

## SpEL概述

SpEL是Spring内置的表达式语言，语法与OGNL等其他表达式语言十分类似。SpEL设计之初就是朝着做一个表达式语言的通用框架，可以独立运行。

## SpEL的主要相关类

SpEL对表达式语法解析过程进行了很高的抽象，抽象出解析器、表达式、解析上下文、估值(Evaluate)上下文等对象，非常优雅的表达了解析逻辑。主要的对象如下：

| 类名                | 说明                                       |
| ----------------- | ---------------------------------------- |
| ExpressionParser  | 表达式解析器接口，包含了`(Expression) parseExpression(String)`, `(Expression) parseExpression(String, ParserContext)`两个接口方法 |
| ParserContext     | 解析器上下文接口，主要是对解析器Token的抽象类，包含3个方法：`getExpressionPrefix`,`getExpressionSuffix`和`isTemplate`，就是表示表达式从什么符号开始什么符号结束，是否是作为模板（包含字面量和表达式）解析。一般保持默认。 |
| Expression        | 表达式的抽象，是经过解析后的字符串表达式的形式表示。通过`expressionInstance.getValue`方法，可以获取表示式的值。也可以通过调用`getValue(EvaluationContext)`，从评估（evaluation)上下文中获取表达式对于当前上下文的值 |
| EvaluationContext | 估值上下文接口，只有一个setter方法：`setVariable(String, Object)`，通过调用该方法，可以为evaluation提供上下文变量 |

- 解析器(ExpressionParser)：用于将字符串表达式解析为表达式对象，从我们角度来看是“谁来干”；
- 上下文(ParserContext)：表达式对象执行的环境，该环境可能定义变量、定义自定义函数、提供类型转换等等，从我们角度看是“在哪干”；
- 表达式(Expression)：表达式是表达式语言的核心，所以表达式语言都是围绕表达式进行的，从我们角度来看是“干什么”；
- 根对象及活动上下文对象(EvaluationContext)：根对象是默认的活动上下文对象，活动上下文对象表示了当前表达式操作的对象，从我们角度看是“对谁干”。



完整的例子：

```Java
import org.springframework.expression.EvaluationContext;
import org.springframework.expression.Expression;
import org.springframework.expression.ExpressionParser;
import org.springframework.expression.common.TemplateParserContext;
import org.springframework.expression.spel.standard.SpelExpressionParser;
import org.springframework.expression.spel.support.StandardEvaluationContext;

/**
 * <B>Description:</B>  <br>
 * <B>Create on:</B> 2018/1/20 下午10:53 <br>
 *
 * @author xiangyu.ye
 * @version 1.0
 */
public class SpringELDemo {
    public static void main(String[] args) {
        String greetingExp = "Hello, #{ #user }"; //（1）
        ExpressionParser parser = new SpelExpressionParser(); //（2）
        EvaluationContext context = new StandardEvaluationContext();
        context.setVariable("user", "Gangyou"); //(3)

        Expression expression = parser.parseExpression(greetingExp, new TemplateParserContext()); //(4)
        System.out.println(expression.getValue(context, String.class)); //(5)
    }

}
```

代码解释：

1. 创建一个模板表达式，所谓模板就是带字面量和表达式的字符串。其中**#{}**表示表达式的起止，`#user`是表达式字符串，表示引用一个变量。
2. 创建表达式解析器，SpEL框架创建了一个语言无关的处理框架，所以对于其他的表达式语言，完全可以创建不同的ExpressionParser。在这里我们学习的是SpEL所以使用`SpelExpressionParser()`
3. 通过`evaluationContext.setVariable`可以在上下文中设定变量。
4. 解析表达式，如果表达式是一个模板表达式，需要为解析传入模板解析器上下文。如果不传入模板解析器上下文，指定表达式为模板，那么表达式字符串`Hello, #{ #user }`，解析器会首先去尝试解析`Hello`。例子中的模板表达式，与`'Hello, ' + #user`是等价的。
5. 使用`Expression.getValue()`获取表达式的值，这里传入了Evalution上下文，第二个参数是类型参数，表示返回值的类型。

## SpEL语法



### **1. 字面值**

我们可以在\<property> 元素的value 属性中使用#{} 界定符把这个值装配到Bean 的属性中，如下例：

```
<bean id = "yoona" class = "com.sjf.bean.Student">
	<property name="age" value="#{24}"/>
	<property name="school" value="#{'西电'}"/>
	<property name="name" value="my name is #{'yoona'}"/>
	<property name="weight" value="#{120.4}"/>
	<property name="sex" value="#{true}"/>
</bean>
```

第一个SpEL表达式中使用了一个整型：#{24}

第二个SpEL表达式中使用了String类型：#{'西电'} 

**注意**：里面有个单引号，如果去掉会报错。String 类型的字面值可以使用单引号或双引号作为字符串的界定符。如果使用单引号作为XML 属性的界定符则：\<propertyname='school'value='#{"西电"}'/>

第三个SpEL表达式中使用了String类型，并且与非SpEL 表达式的值混用：my name is #{'yoona'}

第四个SpEL表达式中使用了浮点型数字：#{120.4}，也可以采用科学计数法的表示方法：#{'1e4'}  ** **

第五个SpEL表达式中使用布尔值："#{true}"

**运行结果：**

```
name：my name is yoona   age：24   school：西电 sex：true   weight：120.4
```

感觉杀鸡焉用牛刀，毕竟，我们没必要使用SpEL 将一个整型的属性赋值为24，或者将Boolean 类型的属性赋值为true。我承认在SpEL 表达式中仅包含字面值没有太多用处。但是复杂的SpEL 表达式通常是由简单的表达式构成的。所以了解如何在SpEL 中使用字面值是很有意义的。

### **2.  引用Bean、Properties 和方法**

#### **2.1 调用引用Bean的属性**

SpEL 表达式能做的另一个事情是通过ID 引用其他Bean。举个例子，我们需要在SpEL 表达式中使用Bean ID 将一个Bean 装配到另一个Bean 的属性中：

```
<property name="school" value="#{xidianSchool}"/>
```

上述代码中的SpEL 表达式相当于：

```
<property name="school" ref="xidianSchool"/>
```

没错，结果是相同的，我们使用SpEL也没感觉出便利多少。但是有一点是ref做不到的，就是在一个SpEL 表达式中使用Bean 的引用来获取Bean 的属性。

```
<property name="address" value="#{xidianSchool.location}"/>
```

假设一个Student的address（地址）属性跟School（学校）的location（地址）是一样的，都是"西安"的，那我们可以引用School的属性location为Student的属性address赋值。

第一部分（在句号分割符之前的部分xidianSchool）通过其ID 指向xidianSchool Bean。第二部分指向xidianSchool Bean 的location 属性。通过这种方式装配address属性，其实等价于执行下面的示例代码：

```
Student student = new Student();
student.setAddress(xidianSchool.getLocation());
```

#### 2.2 调用引用Bean的方法

我们不只可以调用引用Bean的**属性**，还可以调用引用Bean的**方法**，假设xidianSchool Bean有个getLocation()方法：

```
<property name="address" value="#{xidianSchool.getLocation()}"/>
```

#### **2.3 null-safe 存取器避免空指针异常**

假设有SpEL中有xidianSchool.getLocation().getCity()，并且 如果getLocation() 返回一个null 值， 那么SpEL 表达式求值时会抛出一个NullPointerException 异常。那么避免抛出空指针异常（NullPointerException）的方法是使用null-safe 存取器（？.）：

```
<property name="address" value="#{xidianSchool.getLocation()?.getCity()}"/> 
```

现在我们使用?. 运算符代替点（.）来访问getCity() 方法。在访问右边方法之前，该运算符会确保左边项的值不会为null。所以，如果getLocation()返回null 值，SpEL 不再尝试调用getCity() 方法。

### **3. 操作类**

在SpEL 中，使用T() 运算符会调用类作用域的方法和常量。例如，在SpEL 中使用Java 的Math 类，我们可以像下面的示例这样使用T() 运算符：

```
T(java.lang.Math) 
```

在上面示例中，T() 运算符的结果会返回一个java.lang.Math 的类对象。但是，T()运算符真正的价值在于，通过该运算符可以访问指定类的静态方法和常量。

假设需要把PI 的值装配到Bean 的一个属性中。只需简单引用Math 类的PI 常量即可，如下所示：

```
<property name="pi" value="#{T(java.lang.Math).PI}"/> 
```

同样，使用T() 运算符也可以调用静态方法。

```
<property name="randomNumber" value="#{T(java.lang.Math).random()}"/> 
```

### **4. 在SpEL值上执行操作**

SpEL 提供了几种运算符，这些运算符可以用在SpEL 表达式中的值上。

| 运算符类型 | 运算符                          |
| ----- | ---------------------------- |
| 算术运算  | +， -， *， /， %， ^             |
| 关系运算  | Li YanHong                   |
| 逻辑运算  | < ，>，==，<=，>=，lt，gt，eq，le，ge |
| 条件运算  | and，or，not，\|                |
| 正则表达式 | ？：（ternary），？：（Elvis）        |
| Nokia | matches                      |

#### **4.1 算术运算**

SpEL 提供了所有Java 支持的基础算术运算符，它还增加了（^）运算符来执行乘方运算。

（1）加法，这里我们把counter Bean 的total 属性值与42 相加。

```
<property name="adjustedAmount" value="#{counter.total + 42}"/> 
```

（2）减法，这里我们把counter Bean 的total 属性值与20 相减。

```
<property name="adjustedAmount" value="#{counter.total - 20}"/> 
```

（3）乘法，这里我们计算一个圆的周长。

```
<property name="circumference" value="#{2 * T(java.lang.Math).PI * circle.radius}"/> 
```

（4）除法，这里我们把counter Bean 的total 属性值与 count 属性值相除。

```
<property name="average" value="#{counter.total / counter.count}"/> 
```

（5）求余

```
<property name="remainder" value="#{counter.total % counter.count}"/> 
```

（6）乘方，不同于Java ，SpEL提供了乘方运算，这里求圆的面积。

```
<property name="area" value="#{T(java.lang.Math).PI * circle.radius ^ 2}"/> 
```

（7）+不只提供加法运算，还提供了字符串连接的功能。

```
<property name="fullName" value="#{student.firstName + ' ' + student.lastName}"/>
```

#### **4.2 关系运算**

判断两个值是否相等或者两者之间哪个更大，这种情况很常见。对于这种类型的比较，SpEL 同样提供了Java 所支持的比较运算符。

（1）相等，这里equal属性为布尔类型。如果age等于24则将会true装配给equal属性。

```
<property name="equal" value="#{student.age == 24}"/> 
```

（2）类似地，小于（<）和大于（>）运算符用于比较不同的值。而且SpEL 还提供了大于等于（>=）和小于等于（<=）运算符。不过，在Spring 的XML 配置文件中使用小于等于和大于等于符号时，会报错，这是因为这两个符号在XML 中有特殊含义。当在XML 中使用SpEL时，最好对这些运算符使用SpEL 的文本替代方式。

```
<property name="hasCapacity" value="#{counter.total le 100000}"/> 
```

其实相当于（其实这样是不正确的，只是演示而用，明显看出代码高亮显示不对）：

```
<property name="hasCapacity" value="#{counter.total <= 100000}"/> 
```

文本型比较运算符如下表：

| 运算符  | 符号   | 文本类型 |
| ---- | ---- | ---- |
| 等于   | ==   | eq   |
| 小于   | <    | lt   |
| 小于等于 | <=   | le   |
| 大于   | >    | gt   |
| 大于等于 | >=   | ge   |

即使等于运算符（==）在XML 文件中不会产生问题，但是SpEL 还是提供了文本型的eq 运算符，从而与其他运算符保持一致性。这是因为某些开发者更倾向于使用文本型运算符，而不是符号型运算符。

#### **4.3 逻辑运算**

SpEL 提供了多种运算符，你可以使用它们来对表达式进行求值：

| 运算符     | 操作                                  |
| ------- | ----------------------------------- |
| and     | 逻辑AND运算操作，只有运算符两边都是true，表达式才能是true。 |
| or      | 逻辑OR运算操作，只有运算符任意一边是true，表达式就会是true。 |
| not 或 ! | 逻辑NOT运算操作，对运算结果求反。                  |

（1）在这个示例中， 如果xiaosiStudent Bean 的name 属性为xiaosi， 并且age属性的值大于24，则isHer属性将被设为true，否则为false。

```
<property name="isHer" value="#{xiaosiStudent.age gt 24 and xiaosiStudent.name == 'xiaosi'}"/>
```

（2）使用not运算符

```
<property name="otherStudent" value="#{not xiaosiStudent.sex}"/> 
```

#### **4.4 条件运算**

如果我们希望在某个条件为true 时，SpEL 表达式的求值结果是某个值；如果该条件为false 时，它的求值结果是另一个值，那么这要如何实现呢？使用？：符号。

（1）如果yoonaStudent Bean的sex属性为true，则把boy装配给sex属性，否则装配girl。

```
<property name="sex" value="#{yoonaStudent.sex == true ? 'boy' : 'girl'}"/>
```

（2）如果kenny.song 不为null，那么表达式的求值结果是kenny.song，否则就是“Greensleeves”。当我们以这种方式使用时，“?:”通常被称为elvis 运算符。

```
<property name="song" value="#{kenny.song ?: 'Greensleeves'}"/> 
```

#### **4.5 正则表达式**

matches 运算符对String 类型的文本（作为左边参数）应用正则表达式（作为右边参数）。matches 的运算结果将返回一个布尔类型的值：如果与正则表达式相匹配，则返回true ；否则返回false。

假设我们想判断一个字符串是否是有效的邮件地址。

```
<property name="validEmail" value= "#{admin.email matches '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.com'}"/> 
```

### **5. 在SpEL 中筛选集合**

我们可以引用集合中的某个成员，就像在Java 里操作一样，同样具有基于属性值来过滤集合成员的能力，还可以从集合的成员中提取某些属性放到一个新的集合中。

**注意：**

我们使用<util:list> 元素在Spring 里配置了一个包含School 对象的List 集合（学校集合）：

```
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
	xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
	xmlns:util="http://www.springframework.org/schema/util"
	xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd http://www.springframework.org/schema/util http://www.springframework.org/schema/util/spring-util.xsd">
	
	<util:list id = "schools">
		<bean class="com.sjf.bean.School">
				<property name="name" value="西安电子科技大学"/>
				<property name="location" value="西安"></property>
		</bean>
		<bean class="com.sjf.bean.School">
				<property name="name" value="西安交通大学"/>
				<property name="location" value="西安"></property>
		</bean>
		<bean class="com.sjf.bean.School">
				<property name="name" value="西北工业大学"/>
				<property name="location" value="西安"></property>
		</bean>
		<bean class="com.sjf.bean.School">
				<property name="name" value="山东大学"/>
				<property name="location" value="山东"></property>
		</bean>
		<bean class="com.sjf.bean.School">
				<property name="name" value="山东科技大学"/>
				<property name="location" value="山东"></property>
		</bean>
		<bean class="com.sjf.bean.School">
				<property name="name" value="北京大学"/>
				<property name="location" value="北京"></property>
		</bean>
		<bean class="com.sjf.bean.School">
				<property name="name" value="上海交通大学"/>
				<property name="location" value="上海"></property>
		</bean>
	</util:list>
	
	<bean id = "yoonaStudent" class = "com.sjf.bean.Student">
		<property name="name" value="yoona"/>
		<property name="age" value="24"/>
		<property name="school" value="#{schools[2]}"/>
	</bean>
</beans>
```

<util:list> 元素是由Spring 的util 命名空间所定义的。它创建了一个java.util.List 类型的Bean。在这种场景下，它是一个包含7 个School 学校 的List 集合。

Student类：

```
package com.sjf.bean;
 
import java.util.Collection;
 
/**
 * Student实体类
 * @author sjf0115
 *
 */
public class Student {
	
	public String name;
	public int age;
	public School school;
	private Collection<School> likeSchools;
	private Collection<String>visitedSchool;
	
	public void setName(String name) {
		this.name = name;
	}
 
	public void setAge(int age) {
		this.age = age;
	}
	
	public void setSchool(School school) {
		this.school = school;
	}
	
	public void setLikeSchool(Collection<School> likeSchools) {
		this.likeSchools = likeSchools;
	}
	
	
	public void setVisitedSchool(Collection<String> visitedSchool) {
		this.visitedSchool = visitedSchool;
	}
 
	@Override
	public String toString() {
		StringBuilder sb = new StringBuilder();
		sb.append("name：" + name + "   age：" + age + "   school：" + school.toString());
		sb.append("   向往的学校：");
		for(School school : likeSchools){
			sb.append("   " + school.getName());
		}//for
		sb.append("   去过的学校：");
		for(String schoolName : visitedSchool){
			sb.append("   " + schoolName);
		}//for
		return sb.toString();
	}
}
```

School类：

```
package com.sjf.bean;
 
 
public class School {
	public String name;
	public String location;
	
	public void setName(String name) {
		this.name = name;
	}
	public void setLocation(String location) {
		this.location = location;
	}
	
	public String getName() {
		return name;
	}
	public String getLocation() {
		return location;
	}
	@Override
	public String toString() {
		return "name：" + name + "   location：" + location;
	}
}

```

#### 5.1 访问集合成员（[]）

我们能做的最简单的事情就是从集合中提取一个成员，并将它装配到某个属性中：

```
<property name="school" value="#{schools[2]}"/>

```

我们从集合中挑选出第3 个学校（注意，集合的下标是从0 开始的），然后将它装配到school 属性中。中括号（[]）运算符会始终通过索引访问集合中的成员。

#### **5.2 查询集合成员（**.?[] ， .^[]  和 .$[]）

如果我们想从学校集合中查询位于西安的学校，一种实现方式是将所有的schools Bean 都装配到Bean 的属性中，然后在该Bean 中增加过滤不符合条件的学校的逻辑。但是在SpEL 中，只需使用一个查询运算符（**.?[]**）就可以简单做到，如下所示：

```
<property name="likeSchool" value="#{schools.?[location == '西安']}"/>

```

注：likeSchool属性是Collection\<School>类型

查询运算符会创建一个新的集合，新的集合中只存放符合中括号内的表达式的成员。在这种场景下，likeSchool 属性被注入了位于西安的学校集合（西安电子科技大学，西安交通大学，西北工业大学）。

SpEL 同样提供两种其他查询运算符：**.^[]  和 .$[] **，从集合中查询出**第一个匹配项和最后一个匹配项**。

```
<property name="school" value="#{schools.^[location == '山东']}"/>
```

在这种场景下，school 属性被注入了符合条件的第一个匹配项：山东大学

```
<property name="school" value="#{schools.$[location == '山东']}"/>

```

在这种场景下，school 属性被注入了符合条件的最后一个匹配项：山东科技大学

#### 5.3 投影集合（.![]）

集合投影是从集合的每一个成员中选择特定的属性放入一个新的集合中。SpEL的投影运算符（**.![]**）完全可以做到这点。

例如，假设我们仅仅需要包含学校名称的一个String 类型的集合，而不是School 对象的集合：

```
<property name="visitedSchool" value="#{schools.![name]}"/>

```

这个表达式的结果是visitedSchool属性将被赋予一个String 类型的集合，包含西安电子科技大学，山东大学，北京大学诸如此类的值。在中括号内的name属性决定了结果集合中要包含什么样的成员。这里只选择schools集合中每一个成员的name属性，即学校名称。

**实例：**

```
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
	xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
	xmlns:util="http://www.springframework.org/schema/util"
	xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd http://www.springframework.org/schema/util http://www.springframework.org/schema/util/spring-util.xsd">
	
	<util:list id = "schools">
		<bean class="com.sjf.bean.School">
				<property name="name" value="西安电子科技大学"/>
				<property name="location" value="西安"></property>
		</bean>
		<bean class="com.sjf.bean.School">
				<property name="name" value="西安交通大学"/>
				<property name="location" value="西安"></property>
		</bean>
		<bean class="com.sjf.bean.School">
				<property name="name" value="西北工业大学"/>
				<property name="location" value="西安"></property>
		</bean>
		<bean class="com.sjf.bean.School">
				<property name="name" value="山东大学"/>
				<property name="location" value="山东"></property>
		</bean>
		<bean class="com.sjf.bean.School">
				<property name="name" value="山东科技大学"/>
				<property name="location" value="山东"></property>
		</bean>
		<bean class="com.sjf.bean.School">
				<property name="name" value="北京大学"/>
				<property name="location" value="北京"></property>
		</bean>
		<bean class="com.sjf.bean.School">
				<property name="name" value="上海交通大学"/>
				<property name="location" value="上海"></property>
		</bean>
	</util:list>
	
	<bean id = "yoonaStudent" class = "com.sjf.bean.Student">
		<property name="name" value="yoona"/>
		<property name="age" value="24"/>
		<property name="school" value="#{schools.^[location == '西安']}"/>
		<property name="likeSchool" value="#{schools.?[location == '北京']}"/>
		<property name="visitedSchool" value="#{schools.![name]}"/>
	</bean>
</beans>

```

**运行结果：**

```
name：yoona   age：24   school：name：西安电子科技大学   location：西安   向往的学校：   北京大学   去过的学校：   西安电子科技大学   西安交通大学   西北工业大学   山东大学   山东科技大学   北京大学   上海交通大学

```

来源于：《Spring实战》

### 自定义函数

SpEL提供了Java的基础功能，也引入了3个借鉴自Groovy的特性语法提供更为简洁的表达能力。作为一款设计为框架的语言，更提供了自定义的扩展能力。

比如下面的例子：

```Java
public abstract class StringUtils {

    public static String reverseString(String input) {
        StringBuilder backwards = new StringBuilder();
        for (int i = 0; i < input.length(); i++)
            backwards.append(input.charAt(input.length() - 1 - i));
        }
        return backwards.toString();
    }

    public static void main(String[] args){
        ExpressionParser parser = new SpelExpressionParser();
        StandardEvaluationContext context = new StandardEvaluationContext();

        context.registerFunction("reverseString",
        StringUtils.class.getDeclaredMethod("reverseString", new Class[] { String.class }));

        String helloWorldReversed = parser.parseExpression(
            "#reverseString('hello')").getValue(context, String.class);
    }
}

```

通过使用`StandardEvalutinContext.registerFunction`可以注册自定义的函数，唯一的一点要求就是需要在表达式中通过`#注册函数名`的方式引用函数。

## 参考资料

[Spring Expression Language 官方文档](https://link.jianshu.com/?t=http://docs.spring.io/spring/docs/current/spring-framework-reference/html/expressions.html)





https://www.jianshu.com/p/6a0a1fa453c8

http://blog.csdn.net/sunnyyoona/article/details/50638957