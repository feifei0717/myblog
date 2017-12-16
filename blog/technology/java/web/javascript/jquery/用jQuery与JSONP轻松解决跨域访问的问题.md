# 用jQuery与JSONP轻松解决跨域访问的问题

时间过得好快,又被拉回js战场时, 跨域问题这个伤疤又开疼了.

好在,有jquery帮忙,跨域问题似乎没那么难缠了.这次也借此机会对跨域问题来给刨根问底,结合实际的开发项目,查阅了相关资料,算是解决了跨域问题..有必要记下来备忘.

跨域的安全限制都是指浏览器端来说的.服务器端是不存在跨域安全限制的,所以通过本机服务器端通过类似httpclient方式完成“跨域访问”的工作，然后在浏览器端用AJAX获取本机服务器端“跨域访问”对应的url.来间接完成跨域访问也是可以的.但很显然开发量比较大,但限制也最少,很多widget开放平台server端(如sohu博客开放平台)其实就么搞的.不在本次讨论范围.

要讨论的是浏览器端的真正跨域访问,推荐的是目前jQuery $.ajax()支持get方式的跨域,这其实是采用jsonp的方式来完成的.

**真实案例:**

```

var qsData = {'searchWord':$("#searchWord").attr("value"),'currentUserId':$("#currentUserId").attr("value"),'conditionBean.pageSize':$("#pageSize").attr("value")};
$.ajax({
   async:false,
   url: http://跨域的dns/document!searchJSONResult.action,
   type: "GET",
   dataType: 'jsonp',
   jsonp: 'jsoncallback',
   data: qsData,
   timeout: 5000,
   beforeSend: function(){
   //jsonp 方式此方法不被触发.原因可能是dataType如果指定为jsonp的话,就已经不是ajax事件了
   },
   success: function (json) {//客户端jquery预先定义好的callback函数,成功获取跨域服务器上的json数据后,会动态执行这个callback函数
    if(json.actionErrors.length!=0){
           alert(json.actionErrors);
     }
       genDynamicContent(qsData,type,json);
   },
    complete: function(XMLHttpRequest, textStatus){
    $.unblockUI({ fadeOut: 10 }); 
   },
   error: function(xhr){
    //jsonp 方式此方法不被触发.原因可能是dataType如果指定为jsonp的话,就已经不是ajax事件了
    //请求出错处理
    alert("请求出错(请检查相关度网络状况.)");
   }
});
```

注意:

```
$.getJSON(" http://跨域的dns/document!searchJSONResult.action?name1="+value1+"&jsoncallback=?",
      function(json){
      if(json.属性名==值){
      // 执行代码
            }
        });
```

这种方式其实是上例$.ajax({..}) api的一种高级封装,有些$.ajax api底层的参数就被封装而不可见了.

这样,jquery就会拼装成如下的url get请求

http://跨域的dns/document!searchJSONResult.action?&jsoncallback=jsonp1236827957501&_=1236828192549&searchWord=%E7%94%A8%E4%BE%8B¤tUserId=5351&conditionBean.pageSize=15

在响应端(http://跨域的dns/document!searchJSONResult.action),
通过 jsoncallback = request.getParameter("jsoncallback") 得到jquery端随后要回调的js function name:jsonp1236827957501
然后 response的内容为一个Script Tags:"jsonp1236827957501("+按请求参数生成的json数组+")"; 
jquery就会通过回调方法动态加载调用这个js tag:jsonp1236827957501(json数组); 
这样就达到了跨域数据交换的目的.

jsonp的最基本的原理是:动态添加一个<script>标签，而script标签的src属性是没有跨域的限制的。这样说来,这种跨域方式其实与ajax XmlHttpRequest协议无关了.
这样其实"jQuery AJAX跨域问题"就成了个伪命题了,jquery $.ajax方法名有误导人之嫌.

如果设为dataType: 'jsonp', 这个$.ajax方法就和ajax XmlHttpRequest没什么关系了,取而代之的则是JSONP协议.

JSONP是一个非官方的协议，它允许在服务器端集成Script tags返回至客户端，通过javascript callback的形式实现跨域访问JSONP即JSON with Padding。由于同源策略的限制，XmlHttpRequest只允许请求当前源（域名、协议、端口）的资源。如果要进行跨域请求，我们可以通过使用html的script标记来进行跨域请求，并在响应中返回要执行的script代码，其中可以直接使用JSON传递javascript对象。这种跨域的通讯方式称为JSONP。

jsonCallback 函数jsonp1236827957501(....): 是浏览器客户端注册的，获取跨域服务器上的json数据后，回调的函数

**Jsonp原理：**

首先在客户端注册一个callback (如:'jsoncallback'), 然后把callback的名字(如:jsonp1236827957501)传给服务器。注意：服务端得到callback的数值后，要用jsonp1236827957501(......)把将要输出的json内容包括起来，此时，服务器生成 json 数据才能被客户端正确接收。

然后以 javascript 语法的方式，生成一个function , function 名字就是传递上来的参数 'jsoncallback'的值 jsonp1236827957501 .

最后将 json 数据直接以入参的方式，放置到 function 中，这样就生成了一段 js 语法的文档，返回给客户端。

客户端浏览器，解析script标签，并执行返回的 javascript 文档，此时javascript文档数据,作为参数，
传入到了客户端预先定义好的 callback 函数(如上例中jquery $.ajax()方法封装的的success: function (json))里.（动态执行回调函数）

可以说jsonp的方式原理上和<script src="http://跨域/...xx.js"></script>是一致的(qq空间就是大量采用这种方式来实现跨域数据交换的) .JSONP是一种脚本注入(Script Injection)行为,所以也有一定的安全隐患.

**原理的示例代码:**

```
//客户端的JAVASCRIPT代码 
var script=document.createElement("script"); 
script.src="http://www.pl4cj.com:8888/5/6/action.php?param=123&callback="+fnName; 
document.getElementsByTagName("head")[0].appendChild(script) 

//服务器端的PHP代码，一定要有callback来进行回调，在这里加上括号，是让它以语句块的方式来进行解析 
<?php 
<SPAN style="COLOR: #ff00ff">echo $_GET["callback"]."(".json_encode($_GET).");"; 
</SPAN>?
```

注意,jquey是不支持post方式跨域的.

**为什么呢?**

虽然采用post +动态生成iframe是可以达到post跨域的目的,但这样做是一个比较极端的方式,不建议采用.
也可以说get方式的跨域是合法的,post方式从安全角度上,被认为是不合法的, 万不得已还是不要剑走偏锋..

client端跨域访问的需求看来也引起w3c的注意了,看资料说html5 WebSocket标准支持跨域的数据交换,应该也是一个将来可选的跨域数据交换的解决方案

来源： <<http://www.jb51.net/article/46463.htm>>

 