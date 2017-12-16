由int类型转换为long类型是向上转换，可以直接进行隐式转换，但由long类型转换为int类型是向下转换，可能会出现数据溢出情况：

主要以下几种转换方法，供参考：

一、强制类型转换

```
long ll = 300000;  
int ii = (int)ll;  
```

二、调用intValue()方法

```
long ll = 300000;  
int ii= new Long(ll).intValue();  
```

三、先把long转换成字符串String，然后在转行成Integer

```
long ll = 300000;  
int ii = Integer.parseInt(String.valueOf(ll)); 
```

 
这三种方法都比较简单明了。

来源： <http://www.2cto.com/kf/201311/260815.html>