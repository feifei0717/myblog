

# URLEncode 解释

URLEncode：是指针对网页url中的中文字符的一种编码转化方式，最常见的就是Baidu、Google等搜索引擎中输入中文查询时候，生成经过Encode过的网页URL。

URLEncode的方式一般有两种，一种是传统的基于GB2312的Encode（Baidu、Yisou等使用），另一种是基于UTF-8的Encode（Google、Yahoo等使用）。 

本工具分别实现两种方式的Encode与Decode:

中文 -> GB2312的Encode -> %D6%D0%CE%C4 

中文 -> UTF-8的Encode -> %E4%B8%AD%E6%96%87 



Html中的URLEncode： 

编码为GB2312的html文件中：

```
http://s.jb51.net/中文.rar -> 浏览器自动转换为 -> http://s.jb51.net/%D6%D0%CE%C4.rar 
```

注意：Firefox对GB2312的Encode的中文URL支持不好，因为它默认是UTF-8编码发送URL的，但是ftp://协议可以，我试过了，我认为这应该算是Firefox一个bug。

编码为UTF-8的html文件中：

```
http://s.jb51.net/中文.rar -> 浏览器自动转换为 -> http://s.jb51.net/%E4%B8%AD%E6%96%87.rar 
```

JavaScript中的URLEncode： 

```
如：%E4%B8%AD%E6%96%87-_.%20%E4%B8%AD%E6%96%87-_.%20 
encodeURI不对下列字符进行编码：“:”、“/”、“;”、“?”、“@”等特殊字符。 
如:ttp://s.jb51.net/%E4%B8%AD%E6%96%87.rarhttp%3A%2F%2Fs.jb51.net%2F%E4%B8%AD%E6%96%87.rar
```



来源： [http://blog.csdn.net/u011598153/article/details/39079847](http://blog.csdn.net/u011598153/article/details/39079847)