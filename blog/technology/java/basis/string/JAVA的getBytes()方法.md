 在Java中，String的getBytes()方法是得到一个操作系统默认的编码格式的字节数组。这个表示在不同OS下，返回的东西不一样！ 

​    String.getBytes(String decode)方法会根据指定的decode编码返回某字符串在该编码下的byte数组表示，如：

Java代码 

```
byte[] b_gbk = "深".getBytes("GBK");   
byte[] b_utf8 = "深".getBytes("UTF-8");   
byte[] b_iso88591 = "深".getBytes("ISO8859-1");   
byte[] b_unicode = "深".getBytes("unicode");  
```

​    将分别返回“深”这个汉字在GBK、UTF-8、ISO8859-1和unicode编码下的byte数组表示，此时b_gbk的长度为2，b_utf8的长度为3，b_iso88591的长度为1，unicode为4。 

​    而与getBytes相对的，可以通过new String(byte[], decode)的方式来还原这个“深”字时，这个new String(byte[], decode)实际是使用decode指定的编码来将byte[]解析成字符串。 

Java代码 

```
String s_gbk = new String(b_gbk,"GBK");   
String s_utf8 = new String(b_utf8,"UTF-8");   
String s_iso88591 = new String(b_iso88591,"ISO8859-1");   
String s_unicode = new String(b_unicode, "unicode");  
```

 

​     通过打印s_gbk、s_utf8、s_iso88591和unicode，会发现，s_gbk、s_utf8和unicode都是“深”，而只有s_iso88591是一个不认识的字符，为什么使用ISO8859-1编码再组合之后，无法还原“深”字呢，其实原因很简单，因为ISO8859-1编码的编码表中，根本就没有包含汉字字符，当然也就无法通过"深".getBytes("ISO8859-1");来得到正确的“深”字在ISO8859-1中的编码值了，所以再通过new String()来还原就无从谈起了。 

​    因此，通过String.getBytes(String decode)方法来得到byte[]时，一定要确定decode的编码表中确实存在String表示的码值，这样得到的byte[]数组才能正确被还原。 

​    有时候，为了让中文字符适应某些特殊要求（如http header头要求其内容必须为iso8859-1编码），可能会通过将中文字符按照字节方式来编码的情况，如 

​    String s_iso88591 = new String("深".getBytes("UTF-8"),"ISO8859-1")， 

​    这样得到的s_iso8859-1字符串实际是三个在 ISO8859-1中的字符，在将这些字符传递到目的地后，目的地程序再通过相反的方式String s_utf8 = new String(s_iso88591.getBytes("ISO8859-1"),"UTF-8")来得到正确的中文汉字“深”。这样就既保证了遵守协议规定、也支持中文。 

​    同样，在开发会检查字符长度，以免数据库字段的长度不够而报错，考虑到中英文的差异，肯定不能用String.length()方法判断,而需采用String.getBytes().length;而本方法将返回该操作系统默认的编码格式的字节数组。如字符串“Hello!你好！”，在一个中文WindowsXP系统下，结果为12，而在英文的UNIX环境下，结果将为9。因为该方法和平台（编码）相关的。在中文操作系统中，getBytes方法返回的是一个GBK或者GB2312的中文编码的字节数组，其中中文字符，各占两个字节，而在英文平台中，一般的默认编码是"ISO-8859-1",每个字符都只取一个字节（而不管是否非拉丁字符）。所以在这种情况下，应该给其传入字符编码字符串，即String.getBytes("GBK").length。

​    附：如下语句在Eclipse中，能正确读取当前JAVA文件的字符编码。

Java代码  

```
java.security.PrivilegedAction pa = new GetPropertyAction("file.encoding");  
String csn = (String)AccessController.doPrivileged(pa);     
System.out.println(csn); 
```

 

​        System.out.println("学java".getBytes().length);   //上面解释的（从存储大小考虑）：   7  

​        System.out.println("学java".length());  // 字符串的个数（字符串的长度。） ：5

来源： <http://bijian1013.iteye.com/blog/1765253>