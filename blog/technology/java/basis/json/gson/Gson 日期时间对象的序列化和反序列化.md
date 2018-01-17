# 日期对象的序列化和反序列化

 

对日期类型的数据进行序列化和反序列化时，需要考虑如下问题：

 

1. 序列化时，Date对象序列化的字符串日期格式如何
2. 反序列化时，把日期字符串序列化为Date对象，也需要考虑日期格式问题
3. Date A -> str -> Date B,A和B对象是否equals

 

## 默认序列化和反序列化

```java
import com.google.gson.Gson;  
import com.google.gson.GsonBuilder;  
  
import java.util.Date;  
  
class Model {  
    private Date date;  
  
    public Date getDate() {  
        return date;  
    }  
  
    public void setDate(Date date) {  
        this.date = date;  
    }  
}  
  
public class Tests {  
    public static void main(String[] args) {  
        Model m = new Model();  
        Date d = new Date();  
        System.out.println(new Date()); //Wed Aug 13 13:27:01 CST 2014  
        m.setDate(d);  
        String str = new Gson().toJson(m);  
  
        System.out.println(str); //{"date":"Aug 13, 2014 1:27:01 PM"}  
  
        m = new Gson().fromJson(str, Model.class);  
  
        System.out.println(d.getTime()); //1407907621908  
        System.out.println(m.getDate().getTime()); //1407907621000  
        System.out.println(d.equals(m.getDate())); //false  
    }  
}  
```

1. System.out.println(new Date())，日期格式根据操作系统的Locale，这里是CST(中国标准时间，东八区)，而Gson把Date序列化为字符串时，默认的时间格式是GMT标准时间
2. 将Date对象A序列化，然后把得到的日期字符串进行反序列化得到对象B，此时B和A并不相等！！这是为什么？原因是JSON在将日期字符串反序列化时，默认将毫秒数进行割断，所以输出的毫秒数最后是3个0，Gson应该提供方法把这种默认的转换(数据已失真)替换掉

 

## 指定序列化和反序列化的日期格式

使用GsonBuilder的setDateFormat来指定Date对象序列化的日期格式以及日期字符串反序列化为Date对象的日期格式

```Java
import com.google.gson.Gson;  
import com.google.gson.GsonBuilder;  
  
import java.util.Date;  
  
class Model {  
    private Date date;  
  
    public Date getDate() {  
        return date;  
    }  
  
    public void setDate(Date date) {  
        this.date = date;  
    }  
}  
  
public class Tests {  
    public static void main(String[] args) {  
        Model m = new Model();  
        Date d = new Date();  
        System.out.println(new Date()); //Wed Aug 13 13:36:32 CST 2014  
        m.setDate(d);  
        Gson gson = new GsonBuilder().setDateFormat("YYYY-MM-dd HH:mm:ss").create();  
        String str = gson.toJson(m);  
        System.out.println(str);  //{"date":"2014-08-13 13:36:32"}  
        m = gson.fromJson(str, Model.class);  
  
        System.out.println(d.getTime()); //1407908192881  
        System.out.println(m.getDate().getTime()); //1388295392000  
    }  
}  
```

 

1.使用GsonBuilder.setDateFormat()可以按照指定的日期格式进行序列化和反序列化，

2.同样，这种方式下，反序列化回来的日期对象，毫秒数依然被割断

 

 

## 注意的问题

 我们可以按照指定的日期格式进行序列化和反序列化，但是格式必须要一致，否则就会发生解析错误，比如下面的代码序列化和反序列化使用的日期格式不一致，导致反序列化失败

```java
import com.google.gson.Gson;  
import com.google.gson.GsonBuilder;  
  
import java.util.Date;  
  
class Model {  
    private Date date;  
  
    public Date getDate() {  
        return date;  
    }  
  
    public void setDate(Date date) {  
        this.date = date;  
    }  
}  
  
public class Tests {  
    public static void main(String[] args) {  
        Model m = new Model();  
        Date d = new Date();  
        System.out.println(new Date()); //Wed Aug 13 13:36:32 CST 2014  
        m.setDate(d);  
        String str = new Gson().toJson(m);  
        System.out.println(str);  //{"date":"Aug 13, 2014 1:42:13 PM"}  
  
  
        Gson gson = new GsonBuilder().setDateFormat("YYYY-MM-dd HH:mm:ss").create();  
        //Exception  
        /*Caused by: java.text.ParseException: Unparseable date: "Aug 13, 2014 1:43:37 PM" 
        at java.text.DateFormat.parse(DateFormat.java:357) 
        at com.google.gson.DefaultDateTypeAdapter.deserializeToDate(DefaultDateTypeAdapter.java:105) 
        ... 15 more*/  
        gson.fromJson(str, Model.class);  
    }  
}  
```

 

反序列化时，毫秒数被割断问题，以后再看什么回事





http://bit1129.iteye.com/blog/2103424