# fastJson解析报 create instance error

今天用fastJson解析报 create instance error的错误

   认真检查，bean类内的字段都和服务端返回的字段一致，格式都是正确的，为什么会报错呢。

   在网上找到答案，如果存在内嵌的情况：

比如public class  A{

​          private String haha;

​          private  int   gogo;

​          private B   bb;

set和get方法省略。。。。。

​         public class B{

​          private String name;

​          private  int   price;

set和get方法省略。。。。。

​              }

}

### 解决办法：

B嵌套在A里，那么我们要声明内嵌类static属性,如下（这样问题解决）

public class  A{

​          private String haha;

​          private  int   gogo;

​          private B   bb;

set和get方法省略。。。。。

​         public**static** class B{

​          private String name;

​          private  int   price;

set和get方法省略。。。。。

​              }

}

来源： <http://blog.csdn.net/gogolaile/article/details/54631139>