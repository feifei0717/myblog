[TOC]



# Java String类型数据的字节长度

## 问题描述：

​        向Oracle[数据库](http://lib.csdn.net/base/14)中一varchar2(64)类型字段中插入一条String类型数据，程序使用String.length()来进行数据的长度校验，如果数据是纯英文，没有问题，但是如果数据中包含中文，校验可以通过，但是在数据入库时经常会报数据超长。

 

## 问题分析：

​        既然问题是数据超长，那么问题应该就是出在数据长度校验上，也就是出在String.length()这个方法上，来看看JDK是如何描述这个方法的：

```
length  
public int length()返回此字符串的长度。长度等于字符串中 Unicode 代码单元的数量。   
  
指定者：  
接口 CharSequence 中的 length  
返回：  
此对象表示的字符序列的长度。  
```

  

```
public static void main(String[] args) throws UnsupportedEncodingException {  
    String a = "123abc";  
    System.out.println(a.length());  
    a = "中文";  
    System.out.println(a.length());  
}  
```

结果为6和2。这个方法判断的是String串的字符长度，但是Oracle数据库中却是以字节来判断varchar2类型数据长度（如：字段定义为varchar2(64)，则存入该字段的字符串的字节长度不得超过64）。如果String串为纯英文，那么一个英文字母是一个字符，长度为1，占1个字节，不会出错，但如果String串中包含中文，一个中文汉字也是一个字符，长度为1，但是却占多个字节（具体占几个字节跟使用的编码有关），如果数据中包含中文，数据的长度就很有可能会超过数据库中对应字段的长度限制

不同数据库对字符串类型数据长度的计算方式不同，如：[MySQL](http://lib.csdn.net/base/14)数据库中以字符长度来判断varchar类型数据的长度（如：字段定义varchar，长度定为64，小数位定义为0，则存入该字段的字符串的字符长度不得超过64）

 

## 解决方式：

​        既然是判断数据长度时以字符为标准导致出错，那么思路就很明确了，在进行数据长度校验时，取数据的字节长度：

```
public static void main(String[] args) throws UnsupportedEncodingException {  
    String a = "123abc";  
    int num = a.getBytes("utf-8").length;  
    System.out.println(num);  
    a = "中文";  
    num = a.getBytes("utf-8").length;  
    System.out.println(num);  
}  
```

结果为6和6，为什么转换成utf-8呢，因为数据库使用的是utf-8编码，既然数据最终是要存到数据库中，那么首先先要保证数据在程序中时、在数据库中时的编码一致（同一个字符在不同的编码格式中所占的字节位数不一致，这点很关键），然后再保证程序和数据库判断数据长度的方式一致，才能避免程序校验通过，入库时却提示数据长度超长的问题

来源： <http://blog.csdn.net/a19881029/article/details/7902701>