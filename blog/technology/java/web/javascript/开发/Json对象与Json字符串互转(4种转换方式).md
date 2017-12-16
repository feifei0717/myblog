# Json对象与Json字符串互转(4种转换方式)

投稿：whsnow 字体：[[增加]() [减小]()] 类型：转载 时间：2013-03-27[ 我要评论](http://www.jb51.net/article/35090.htm#comments)

Json字符与Json对象的相互转换方式有很多，接下来将为大家一一介绍下，感兴趣的朋友可以参考下哈，希望可以帮助到你

**1>jQuery插件支持的转换方式**： 

```
$.parseJSON( jsonstr ); //jQuery.parseJSON(jsonstr),可以将json字符串转换成json对象 
```

2>浏览器支持的转换方式

(Firefox，chrome，opera，safari，ie9，ie8)等浏览器： 

```
JSON.parse(jsonstr); //可以将json字符串转换成json对象 
JSON.stringify(jsonobj); //可以将json对象转换成json对符串 
```

注：ie8(兼容模式),ie7和ie6没有JSON对象，推荐采用JSON官方的方式，引入json.js。 

3>Javascript支持的转换方式

： 

eval('(' + jsonstr + ')'); //可以将json字符串转换成json对象,注意需要在json字符外包裹一对小括号 

注：ie8(兼容模式),ie7和ie6也可以使用eval()将字符串转为JSON对象，但不推荐这些方式，这种方式不安全eval会执行json串中的表达式。 

4>JSON官方的转换方式

： 

http://www.json.org/提供了一个json.js,这样ie8(兼容模式),ie7和ie6就可以支持JSON对象以及其stringify()和parse()方法； 

可以在https://github.com/douglascrockford/JSON-js上获取到这个js，一般现在用json2.js。

**PS：这里再为大家提供几款功能十分强大的json解析、转换与格式化工具供大家选择使用，相信对于大家接下来的json格式数据处理会有所帮助：**

**在线JSON代码检验、检验、美化、格式化工具：**<http://tools.jb51.net/code/json>

**在线XML/JSON互相转换：**<http://tools.jb51.net/code/xmljson>

**json代码在线格式化/美化/压缩/编辑/转换工具：**<http://tools.jb51.net/code/jsoncodeformat>

**C语言风格/HTML/CSS/json代码格式化美化工具：**<http://tools.jb51.net/code/ccode_html_css_json>

http://www.jb51.net/article/35090.htm