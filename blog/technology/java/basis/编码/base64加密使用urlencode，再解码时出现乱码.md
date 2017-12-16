base64加密使用urlencode出现的问题

 

最近用了base64加解密的问题，在使用的过程中出现了不少问题，上网查了一下 ，收获颇多，所以自己也总结了一下，以后再遇到这个问题，也好知道从哪里下手。

 

base64编码是网络传输的比较被青睐的一种编码，因为base64编码的字符集也是基本的asscii字符，所以经常会被当做安全的编码放在url里面传输，当做urlencode编码使用了，其实我们应该明白一下两点：

 

​    1. base64编码里面有一个 “+” 号，在urlecode编码中 “+” 会被解码成空格，urlencode时，"+" 号肯定是由空格编码出来的，但是base64编码的结果中 "+" 不是空格编码出来的，如果将base64编码作为安全的url编码使用，则 “+” 将被解码成空格，这是我们不愿看到的； 所以不要base64编码作为url编码来使用.

 

 

​    2. 我们知道http头里面可能会用base64编码来传输一些信息，因为这些信息不会被web服务器默认做url解码的，我们可以得到原始的编码信息，所以http头里面使用base64编码是可以接受的。

**用base64编码后再进行URL编码，再传输可能会避免此类问题。**

 

这个是从http://blog.greycode.cn/128.html 这里看到的，总结的挺好的，

 

还有http://phpor.net/blog/starred/1/2/  这里面的文章写得也不错，收藏了，呵呵

 

Base64编码将二进制数据按照每三个字节转换成四个字节可读字符，编码后的字符长度大约为136.1%。字符范围为 A-Z  a-z  0-9  \  +。但编码后的字符串不太适合使用URL传输，中文加密后的乱码也多是因为这个原因引起：放在url中传输时+号会被替换成空格；并且每76个字符都会添加一个换行"\n"，这个换行符合会丢失。

 

例如：

哈哈哈哈哈哈。。。。

 

哈哈哈哈哈哈。。。。

 

哈哈哈哈哈哈。。。。

会被编码为：

uf65/rn+uf65/rn+oaOho6GjDQoNCrn+uf65/rn+uf65/qGjoaOhow0KDQq5/rn+uf65/rn+uf6h\no6GjoaM=

放在URL中传输时会变成

uf65/rn uf65/rn oaOho6GjDQoNCrn uf65/rn uf65/qGjoaOhow0KDQq5/rn uf65/rn uf6h

o6GjoaM=

 

解析肯定会出问题。

 

所以在传输或解密时要做如下处理：

 

1.去掉\n

 

2.替换空格为+ 

java代码：

```
content=content.replaceAll(" ", "+");//1.替换空格为+  
content=content.replaceAll("\n", "").replaceAll("\r", "");//2.去掉\n\r
// 解码，然后将字节转换为文件
byte[] bytes = new BASE64Decoder().decodeBuffer(content);   //将字符串转换为byte数组
```