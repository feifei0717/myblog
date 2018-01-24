[TOC]



# BigDecimal 使用方法详解

## 简介

BigDecimal 由任意精度的整数非标度值 和 32 位的整数标度 (scale) 组成。如果为零或正数，则标度是小数点后的位数。如果为负数，则将该数的非标度值乘以 10 的负 scale 次幂。因此，BigDecimal 表示的数值是 (unscaledValue × 10-scale)。 
可以处理任意长度的浮点数运算。 



## 加减乘除计算

BigDecimal add(BigDecimal val) //BigDecimal 加法 
BigDecimal subtract (BigDecimal val) //BigDecimal 减法 
BigDecimal multiply (BigDecimal val)  //BigDecimal 乘法 
BigDecimal divide (BigDecimal val,RoundingMode mode)  除法 
具体使用 计算： 
　　加:   a.add(b); 
　　减: a.subtract(b); 
　　乘:   a.multiply(b); 
　　除:   a.divide(b,2);//2为精度取值 
除法细解： 
  //注意以下相除会抛出异常,原因: 通过BigDecimal的divide方法进行除法时当不整除，出现无限循环小数时，就会抛异常  
​        //BigDecimal divideBg = a.divide(b);   
​        //解决方法是：设置精确度;就是给divide设置精确的小数点 
divide(xxxxx,2, BigDecimal.ROUND_HALF_EVEN)   
​        //其中的第二个参数表示的是：保留小数点之后多少位  
BigDecimal不整除抛出的异常,请设置精确度！ 

```
Exception in thread "main" java.lang.ArithmeticException: Non-terminating decimal expansion; no exact representable decimal result. 
at java.math.BigDecimal.divide(BigDecimal.java:1278) 
at main.Main.main(Main.java:41) 
```


下面我们来看看除法的详细说明： 
   divide(BigDecimal divisor, int scale, introundingMode) 
BigDecimal的setScale方法 
BigDecimal.setScale() 
方法用于格式化小数点 
表示保留一位小数，默认用四舍五入方式 
setScale(1) 
直接删除多余的小数位，如2.35会变成2.3 setScale(1,BigDecimal.ROUND_DOWN) 
进位处理，2.35变成2.4  setScale(1,BigDecimal.ROUND_UP) 
四舍五入，2.35变成2.4  setScale(1,BigDecimal.ROUND_HALF_UP) 
四舍五入，2.35变成2.3，如果是5则向下舍setScaler(1,BigDecimal.ROUND_HALF_DOWN) 

注意点一 
scale指的是你小数点后的位数。 
scale()就是BigDecimal类中的方法。如 
BigDecimal b = new BigDecimal("123.456"); 
b.scale()返回的就是3 

注意点二

roundingMode是小数的保留模式。它们都是BigDecimal中的常量字段, 有很多种，如BigDecimal.ROUND_HALF_UP表示的就是4舍5入 

注意点三 
divide(BigDecimal divisor, int scale, introundingMode)的意思是说： 
我用一个BigDecimal对象除以divisor后的结果，并且要求这个结果保留有scale个小数位，roundingMode表示的就是保留模式是什么，是四舍五入啊还是其它的 
BigDecimal aa = new  BigDecimal(135.95 );  
BigDecimal bb=new  BigDecimal("100" );  
BigDecimal result=aa.multiply(bb);  //做加法 

## BigDecimal转double类型

java中 BigDecimal类型的可以转换到double类型： 
  用 变量.doubleValue();函数  即可将 BigDecimal 类型数据 转化为 double类型！ 

## BigDecimal比较大小 

可以通过BigDecimal的compareTo方法来进行比较。 
返回的结果是int类型，-1表示小于，0是等于，1是大于。 
看下面这个例子： 
BigDecimal a = new BigDecimal("1.00"); 
BigDecmial b = new BigDecimal(1); 
想比较一下a和b的大小，一般都会用equals 
System.out.println(a.equals(b)); 
但是输出结果是：false 
原因是：BigDecimal比较时，不仅比较值，而且还比较精度？ 
if(a.compareTo(b)==0) 结果是true 
比较大小可以用 a.compareTo(b) 
返回值    -1 小于   0 等于    1 大于 

## BigDecimal取其中最大、最小值、绝对值、相反数

　　a.max (b) //比较取最大值 
　　a.min(b) //比较取最小值 
　　a.abs()//取最绝对值 
　　a.negate()//取相反数 

## BigDecimal枚举常量用法

6.下面是注意 ： 
BigDecimal枚举常量用法摘要  ： 
CEILING   
​          向正无限大方向舍入的舍入模式。 
DOWN   
​          向零方向舍入的舍入模式。 
FLOOR   
​          向负无限大方向舍入的舍入模式。 
HALF_DOWN   
​          向最接近数字方向舍入的舍入模式，如果与两个相邻数字的距离相等，则向下舍入。 
HALF_EVEN   
​          向最接近数字方向舍入的舍入模式，如果与两个相邻数字的距离相等，则向相邻的偶数舍入。 
HALF_UP   
​          向最接近数字方向舍入的舍入模式，如果与两个相邻数字的距离相等，则向上舍入。 
UNNECESSARY   
​          用于断言请求的操作具有精确结果的舍入模式，因此不需要舍入。 
UP   
​          远离零方向舍入的舍入模式。 

## 关于BigDecimal格式化 

public String formatValue(Object value){ 
​        String content = null; 
​        if (value == null) { 
​             content = ""; 
​         } else { 
​             if(value instanceof BigDecimal){ 
​                 //conver to fortmat String 
​                 NumberFormat nf = NumberFormat.getInstance(); 
​                 nf.setMinimumFractionDigits(2); 
​                 nf.setMaximumFractionDigits(2); 
​                 content = nf.format(value);  
​             }else{ 
​                 content = String.valueOf(value); 
​             } 
​         } 
​        return content; 
​    } 
使用这样一个方法可以达到格式化的效果，其中value instanceof BigDecimal，表示的是字符类型是BigDecimal类型的时候执行，这里的NumberFormat就表示字符类型，下面的两句代码就表示小数点后面的精确位数。 
这里还要提到NumberFormat的其他两个类型： 
getCurrencyInstance()： 返回当前默认 环境的货币格式 
CurrencyInstance（）： 返回指定语言 环境的数字格式，一般是百分比格式 



## 计算原则

 在《Effective Java》这本书中也提到这个原则，float和double只能用来做科学计算或者是工程计算，在商业计算中我们要用java.math.BigDecimal。 

我们如果需要精确计算，非要用String来够造BigDecimal不可！ 
下面的这个工具类是是转载别人的，可以通过个工具类实现小数的精确计算。 

```Java

/**
* 由于Java的简单类型不能够精确的对浮点数进行运算，这个工具类提供精
* 确的浮点数运算，包括加减乘除和四舍五入。
*/
public class Arith {
    //默认除法运算精度
    private static final int DEF_DIV_SCALE = 10;

    //这个类不能实例化
    private Arith() {
    }

    /**
    * 提供精确的加法运算。
    * @param v1 被加数
    * @param v2 加数
    * @return 两个参数的和
    */
    public static double add(double v1, double v2) {
        BigDecimal b1 = new BigDecimal(Double.toString(v1));
        BigDecimal b2 = new BigDecimal(Double.toString(v2));
        return b1.add(b2).doubleValue();
    }

    /**
    * 提供精确的减法运算。
    * @param v1 被减数
    * @param v2 减数
    * @return 两个参数的差
    */
    public static double sub(double v1, double v2) {
        BigDecimal b1 = new BigDecimal(Double.toString(v1));
        BigDecimal b2 = new BigDecimal(Double.toString(v2));
        return b1.subtract(b2).doubleValue();
    }

    /**
    * 提供精确的乘法运算。
    * @param v1 被乘数
    * @param v2 乘数
    * @return 两个参数的积
    */
    public static double mul(double v1, double v2) {
        BigDecimal b1 = new BigDecimal(Double.toString(v1));
        BigDecimal b2 = new BigDecimal(Double.toString(v2));
        return b1.multiply(b2).doubleValue();
    }

    /**
    * 提供（相对）精确的除法运算，当发生除不尽的情况时，精确到
    * 小数点以后10位，以后的数字四舍五入。
    * @param v1 被除数
    * @param v2 除数
    * @return 两个参数的商
    */
    public static double div(double v1, double v2) {
        return div(v1, v2, DEF_DIV_SCALE);

    }

    /**
    * 提供（相对）精确的除法运算。当发生除不尽的情况时，由scale参数指
    * 定精度，以后的数字四舍五入。
    * @param v1 被除数
    * @param v2 除数
    * @param scale 表示表示需要精确到小数点以后几位。
    * @return 两个参数的商
    */
    public static double div(double v1, double v2, int scale) {
        if (scale < 0) {
            throw new IllegalArgumentException("The scale must be a positive integer or zero");
        }
        BigDecimal b1 = new BigDecimal(Double.toString(v1));
        BigDecimal b2 = new BigDecimal(Double.toString(v2));
        return b1.divide(b2, scale, BigDecimal.ROUND_HALF_UP).doubleValue();
    }

    /**
    * 提供精确的小数位四舍五入处理。
    * @param v 需要四舍五入的数字
    * @param scale 小数点后保留几位
    * @return 四舍五入后的结果
    */
    public static double round(double v, int scale) {
        if (scale < 0) {
            throw new IllegalArgumentException("The scale must be a positive integer or zero");
        }
        BigDecimal b = new BigDecimal(Double.toString(v));
        BigDecimal one = new BigDecimal("1");
        return b.divide(one, scale, BigDecimal.ROUND_HALF_UP).doubleValue();
    }
}
```


详细BigDecimal 算法请参考 http://zhenchengchagangzi.iteye.com/blog/1258453 





http://zhangyinhu8680.iteye.com/blog/1536397