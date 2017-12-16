这篇文章主要介绍了如何使用BigDecimal进行精确运算，最后提供了一个工具类，该工具类提供加，减，乘，除运算

首先我们先来看如下代码示例：

[复制代码]()代码如下:

```
public class Test_1 {
public static void main(String[] args) {
System.out.println(0.06+0.01);
System.out.println(1.0-0.42);
System.out.println(4.015*100);
System.out.println(303.1/1000);
}
}
```

运行结果如下
0.06999999999999999
 0.5800000000000001
 401.49999999999994
 0.30310000000000004

你认为你看错了，但结果却是是这样的。问题在哪里呢？原因在于我们的计算机是二进制的。浮点数没有办法是用二进制进行精确表示。我们的CPU表示浮点数由两个部分组成：指数和尾数，这样的表示方法一般都会失去一定的精确度，有些浮点数运算也会产生一定的误差。如：2.4的二进制表示并非就是精确的2.4。反而最为接近的二进制表示是 2.3999999999999999。浮点数的值实际上是由一个特定的数学公式计算得到的。
其实java的float只能用来进行科学计算或工程计算，在大多数的商业计算中，一般采用java.math.BigDecimal类来进行精确计算。
在使用BigDecimal类来进行计算的时候，主要分为以下步骤：
1、用float或者double变量构建BigDecimal对象。
2、通过调用BigDecimal的加，减，乘，除等相应的方法进行算术运算。
3、把BigDecimal对象转换成float，double，int等类型。
一般来说，可以使用BigDecimal的构造方法或者静态方法的valueOf()方法把基本类型的变量构建成BigDecimal对象。

[复制代码]()代码如下:

BigDecimal b1 = new BigDecimal(Double.toString(0.48));
BigDecimal b2 = BigDecimal.valueOf(0.48);

对于常用的加，减，乘，除，BigDecimal类提供了相应的成员方法。

[复制代码]()代码如下:

public BigDecimal add(BigDecimal value);//加法
public BigDecimal subtract(BigDecimal value); //减法 
public BigDecimal multiply(BigDecimal value); //乘法
public BigDecimal divide(BigDecimal value); //除法

进行相应的计算后，我们可能需要将BigDecimal对象转换成相应的基本数据类型的变量，可以使用floatValue()，doubleValue()等方法。
下面是一个工具类，该工具类提供加，减，乘，除运算。

[复制代码]()代码如下:

/**
 * 提供精确减法运算的sub方法
 * @param value1 被减数
 * @param value2 减数
 * @return 两个参数的差
 */
public static double sub(double value1,double value2){
BigDecimal b1 = new BigDecimal(Double.valueOf(value1));
BigDecimal b2 = new BigDecimal(Double.valueOf(value2));
return b1.subtract(b2).doubleValue();
}

/**
 * 提供精确乘法运算的mul方法
 * @param value1 被乘数
 * @param value2 乘数
 * @return 两个参数的积
 */
public static double mul(double value1,double value2){
BigDecimal b1 = new BigDecimal(Double.valueOf(value1));
BigDecimal b2 = new BigDecimal(Double.valueOf(value2));
return b1.multiply(b2).doubleValue();
}

/**
 * 提供精确的除法运算方法div
 * @param value1 被除数
 * @param value2 除数
 * @param scale 精确范围
 * @return 两个参数的商
 * @throws IllegalAccessException
 */
public static double div(double value1,double value2,int scale) throws IllegalAccessException{
//如果精确范围小于0，抛出异常信息
if(scale<0){ 
  throw new IllegalAccessException("精确度不能小于0");
}
BigDecimal b1 = new BigDecimal(Double.valueOf(value1));
BigDecimal b2 = new BigDecimal(Double.valueOf(value2));
return b1.divide(b2, scale).doubleValue();
}
}

来源： <<http://www.jb51.net/article/43513.htm>>

 