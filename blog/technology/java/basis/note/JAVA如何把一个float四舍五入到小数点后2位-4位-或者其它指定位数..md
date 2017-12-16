两种方法：

import   java.math.*;  
  ……  
  方法1：  

```
  float   f   =   34.232323f;  
  BigDecimal   b   =   new   BigDecimal(f);  
  float   f1   =   b.setScale(2,   BigDecimal.ROUND_HALF_UP).floatValue();  
  //   b.setScale(2,   BigDecimal.ROUND_HALF_UP)   表明四舍五入，保留两位小数
```

  方法2：  

```
  float   scale   =   34.236323f;  
  DecimalFormat   fnum   =   new   DecimalFormat("##0.00");  
  String   dd=fnum.format(scale);      
  System.out.println(dd);  
```







JAVA如何把一个float四舍五入到小数点后2位,4位,或者其它指定位数

​        以前以为很容易,一直没在意,今天突然用到了,才发现,系统没有这样的函数.狂晕,同事们用的方法为,先转成String,再取其中几位,再转成float型,(如:String.valueOf(c).substring(0,String.valueOf(c).indexOf(".")   +   3)): 我觉得这样不爽,于是找了书看看,书上还真没找到,晕晕.到网上找了一些方法,还真行.如下(以下都是取2位,如果要取其它位,自己修改一下):

 (一):这种方法方便,我就使用这种方法

   float   a   =   123.2334f;  
   float   b   =   (float)(Math.round(a*100))/100;//(这里的100就是2位小数点,如果要其它位,如4位,这里两个100改成10000)

(二):这个方法也简单,不过还要再转成float型：  
  import   java.text.DecimalFormat;       
  String   a   =   new   DecimalFormat("###,###,###.##").format(100.12345   );

(三):这个也可以用

float   ft   =   134.3435f;  
  int   scale   =   2;//设置位数  
  int   roundingMode   =   4;//表示四舍五入，可以选择其他舍值方式，例如去尾，等等.  
  BigDecimal   bd   =   new   BigDecimal((double)ft);  
  bd   =   bd.setScale(scale,roundingMode);  
  ft   =   bd.floatValue();  

(四):个人想法,还没去做

就是先放大10的N次方,变成整数,再除以10的N次方变回float型 , 不知道这样可以不?

 

 

以下没有验证，先放到起：

今天在数值计算时碰到一个问题.程序如下:
double a = (3.3-2.4)/0.1;
System.out.println(a);
你可能认为结果很简单,不就是9嘛,是事实上,结果为:8.999999998,为什么呢?我翻阅了一些资料,终于找出了原因.
为什么浮点数会丢失精度？  
十进制数的二进制表示可能不够精确

浮点数或是双精度浮点数无法精确表示的情况并不少见。浮点数值没办法用十进制来精确表示的原因要归咎于CPU表示浮点数的方法。这样的话您就可能会牺牲一些精度，有些浮点数运算也会引入误差。以上面提到的情况为例，2.4的二进制表示并非就是精确的2.4。反而最为接近的二进制表示是 2.3999999999999999。原因在于浮点数由两部分组成：指数和尾数。浮点数的值实际上是由一个特定的数学公式计算得到的。您所遇到的精度损失会在任何操作系统和编程环境中遇到。
注意： 您可以使用Binary Coded Decimal (BCD)库来保持精度。BCD数字编码方法会把每一个十进制数字位单独编码。  
类型失配
您可能混合了浮点数和双精度浮点数类型。请确定您在进行数学运算的时候所有的数据类型全部相同。
注意：float类型的变量只有7位的精度，而double类型的变量有15位的精度。 
如何进行浮点数精度计算？             
​      Java中的简单浮点数类型float和double不能够进行运算。不光是Java，在其它很多编程语言中也有这样的问题。在大多数情况下，计算的结果是准确的，但是多试几次（可以做一个循环）就可以试出类似上面的错误。现在终于理解为什么要有BCD码了。
这个问题相当严重，如果你有9.999999999999元，你的计算机是不会认为你可以购买10元的商品的。
在有的编程语言中提供了专门的货币类型来处理这种情况，但是Java没有。现在让我们看看如何解决这个问题。
四舍五入
我们的第一个反应是做四舍五入。Math类中的round方法不能设置保留几位小数，我们只能象这样（保留两位）：
public double round(double value){
​    return Math.round(value*100)/100.0;
}
非常不幸，上面的代码并不能正常工作，给这个方法传入4.015它将返回4.01而不是4.02，如我们在上面看到的
4.015*100=401.49999999999994
因此如果我们要做到精确的四舍五入，不能利用简单类型做任何运算
java.text.DecimalFormat也不能解决这个问题：
System.out.println(new java.text.DecimalFormat("0.00").format(4.025));
输出是4.02
BigDecimal
在《Effective Java》这本书中也提到这个原则，float和double只能用来做科学计算或者是工程计算，在商业计算中我们要用java.math.BigDecimal。BigDecimal一共有4个够造方法，我们不关心用BigInteger来够造的那两个，那么还有两个，它们是：
BigDecimal(double val) 
​          Translates a double into a BigDecimal. 
BigDecimal(String val) 
​          Translates the String repre sentation of a BigDecimal into a BigDecimal.
上面的API简要描述相当的明确，而且通常情况下，上面的那一个使用起来要方便一些。我们可能想都不想就用上了，会有什么问题呢？等到出了问题的时候，才发现上面哪个够造方法的详细说明中有这么一段：
Note: the results of this constructor can be somewhat unpredictable. One might assume that new BigDecimal(.1) is exactly equal to .1, but it is actually equal to .1000000000000000055511151231257827021181583404541015625. This is so because .1 cannot be represented exactly as a double (or, for that matter, as a binary fraction of any finite length). Thus, the long value that is being passed in to the constructor is not exactly equal to .1, appearances nonwithstanding.
The (String) constructor, on the other hand, is perfectly predictable: new BigDecimal(".1") is exactly equal to .1, as one would expect. Therefore, it is generally recommended that the (String) constructor be used in preference to this one.
原来我们如果需要精确计算，非要用String来够造BigDecimal不可！在《Effective Java》一书中的例子是用String来够造BigDecimal的，但是书上却没有强调这一点，这也许是一个小小的失误吧。
解决方案
现在我们已经可以解决这个问题了，原则是使用BigDecimal并且一定要用String来够造。
但是想像一下吧，如果我们要做一个加法运算，需要先将两个浮点数转为String，然后够造成BigDecimal，在其中一个上调用add方法，传入另一个作为参数，然后把运算的结果（BigDecimal）再转换为浮点数。你能够忍受这么烦琐的过程吗？下面我们提供一个工具类Arith来简化操作。它提供以下静态方法，包括加减乘除和四舍五入：
public static double add(double v1,double v2)
public static double sub(double v1,double v2)
public static double mul(double v1,double v2)
public static double div(double v1,double v2)
public static double div(double v1,double v2,int scale)
public static double round(double v,int scale)
附录
源文件Arith.java：
import java.math.BigDecimal;
/**
\* 由于Java的简单类型不能够精确的对浮点数进行运算，这个工具类提供精
\* 确的浮点数运算，包括加减乘除和四舍五入。
*/
public class Arith{
​    //默认除法运算精度
​    private static final int DEF_DIV_SCALE = 10;
​    //这个类不能实例化
​    private Arith(){
​    }
​    /**
​     * 提供精确的加法运算。
​     * @param v1 被加数
​     * @param v2 加数
​     * @return 两个参数的和
​     */
​    public static double add(double v1,double v2){
​        BigDecimal b1 = new BigDecimal(Double.toString(v1));
​        BigDecimal b2 = new BigDecimal(Double.toString(v2));
​        return b1.add(b2).doubleValue();
​    }
​    /**
​     * 提供精确的减法运算。
​     * @param v1 被减数
​     * @param v2 减数
​     * @return 两个参数的差
​     */
​    public static double sub(double v1,double v2){
​        BigDecimal b1 = new BigDecimal(Double.toString(v1));
​        BigDecimal b2 = new BigDecimal(Double.toString(v2));
​        return b1.subtract(b2).doubleValue();
​    } 
​    /**
​     * 提供精确的乘法运算。
​     * @param v1 被乘数
​     * @param v2 乘数
​     * @return 两个参数的积
​     */
​    public static double mul(double v1,double v2){
​        BigDecimal b1 = new BigDecimal(Double.toString(v1));
​        BigDecimal b2 = new BigDecimal(Double.toString(v2));
​        return b1.multiply(b2).doubleValue();
​    }
​    /**
​     * 提供（相对）精确的除法运算，当发生除不尽的情况时，精确到
​     * 小数点以后10位，以后的数字四舍五入。
​     * @param v1 被除数
​     * @param v2 除数
​     * @return 两个参数的商
​     */
​    public static double div(double v1,double v2){
​        return div(v1,v2,DEF_DIV_SCALE);
​    }
​    /**
​     * 提供（相对）精确的除法运算。当发生除不尽的情况时，由scale参数指
​     * 定精度，以后的数字四舍五入。
​     * @param v1 被除数
​     * @param v2 除数
​     * @param scale 表示表示需要精确到小数点以后几位。
​     * @return 两个参数的商
​     */
​    public static double div(double v1,double v2,int scale){
​        if(scale<0){
​            throw new IllegalArgumentException(
​                "The scale must be a positive integer or zero");
​        }
​        BigDecimal b1 = new BigDecimal(Double.toString(v1));
​        BigDecimal b2 = new BigDecimal(Double.toString(v2));
​        return b1.divide(b2,scale,BigDecimal.ROUND_HALF_UP).doubleValue();
​    }
​    /**
​     * 提供精确的小数位四舍五入处理。
​     * @param v 需要四舍五入的数字
​     * @param scale 小数点后保留几位
​     * @return 四舍五入后的结果
​     */
​    public static double round(double v,int scale){

​        if(scale<0){
​            throw new IllegalArgumentException(
​                "The scale must be a positive integer or zero");
​        }
​        BigDecimal b = new BigDecimal(Double.toString(v));
​        BigDecimal one = new BigDecimal("1");
​        return b.divide(one,scale,BigDecimal.ROUND_HALF_UP).doubleValue();
​    }
};

针对double d = 2.4; 
System.out.println(d);//输出2.4，却不是2.3999999999999999呢？
翻阅了一些资料,当单个输出double 型值时,可以正确的用 十进制显示,具体为什么,俺也似懂非懂,但进行浮点计算,浮点计算是指浮点数参与的运算，這種运算通常伴随着因为无法精确表示而进行的近似或舍入。也许和Double.toString方法的 FloatingDecimal(d).toJavaFormatString()有关系
猜测大概是2.3999999999999999超出了输出的精度所以被截取的原因吧

来源： <<http://blog.csdn.net/lizhenmingdirk/article/details/7335285>>

 