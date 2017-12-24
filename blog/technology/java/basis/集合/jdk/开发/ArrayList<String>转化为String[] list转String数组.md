# ArrayList\<String>转化为String[] list转String数组

初始化数据：

```
ArrayList<String> heightArrayList = new ArrayList<String>();  
      for (int i = 20; i <= 300; i++) {  
          heightArrayList.add(String.valueOf(i).concat("cm"));  
      }  
```

将ArrayList转化为String数组，我们可以使用

```
String[] array = (String[])heightArrayList.toArray();
```

运行程序报类型转换错误。

解决方式：

```
String[] array =  heightArrayList.toArray(new String[0]);
```

