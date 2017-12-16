# jQuery实现AJAX定时刷新局部页面实例

投稿：mrr 字体：[[增加]() [减小]()] 类型：转载 时间：2015-09-23[ 我要评论](http://www.jb51.net/article/72597.htm#comments)

本篇文章通过两种方法实例讲解ajax定时刷新局部页面，当然方法有很多种，也可以不使用ajax来刷新页面，可以使用jquery中的append来给指定内容加东西，但是都不太实用，最实用的方法还是ajax加载数据了。

方法一：

局部刷新我们讲述到最多的是ajax 了，当然也可以不使用ajax来刷新页面了，我们可以使用jquery中的append来给指定内容加东西了，当然最实用的还是ajax加载数据了。

**例子，定时局部刷新**

定时局部刷新用到jQuery里面的setInterval方法，setInterval方法两个参数，第一个是设置定时执行的函数名，第二个是时间，如下代码所示，设置每隔10毫秒定时执行一次aa方法。

```
<script>
$(function(){
 setInterval(aa,10);
 function aa(){
   $("#aa").append("fdsadfsa");
 }
})
</script>


```

**例子2**

```
<head>
<script src="jQuery/jquery-1.4.1.min.js" type="text/javascript"></script>
<script>
$(document).ready(function () {
setInterval("startRequest()",1000);
});
function startRequest()
{
$("#date").text((new Date()).toString());
}
</script>
</head>
```

**例子3 下面我们就看一下这种刷新方式是如何实现的。**

**jsp页面ajax**

```
$("#waitWork").click(function(){
 var url = "请求地址";
 var data = {type:1};
 $.ajax({
  type : "get",
  async : false, //同步请求
  url : url,
  data : data,
  timeout:1000,
  success:function(dates){
  //alert(dates);
  $("#mainContent").html(dates);//要刷新的div
  },
  error: function() {
        // alert("失败，请稍后再试！");
      }
 });
 });
```

**html**

```
<div id="mainContent">
```

注意：后台需要针对div里的信息单独用一个jsp页面，不然就需要自己封装好需要的页面信息返回

方法二：

不时，我需要某种机制，不断刷新网页，以提供一个实时的仪表板某种。如果我只能刷新一个特定的页面的一部分，这将是很大的，例如：仪表盘上的交通灯显示系统状态。

这是很容易通过使用jQuery JavaScript库，只刷新页面的一部分。一旦我们纳入我们的页面的jQuery库，我们只需要1行的

JavaScript得到它的工作：

```
<script src="/js/jquery-1.3.2.min.js" type="text/javascript"></script>
```

所以我们只要我们的页面放入这个小的JS代码片段刷新里面的内容ID标签的一切，让我们说，每5秒：

```
setInterval(function() {
  $("#content").load(location.href+" #content>*","");
}, 5000);
```

这就是它！！因此，这是很容易完成一些实时监控的行为，只是那行代码。没有更奇怪的元刷新标记或iframe一种解决方法，在Web应用程序。

每5秒，我们将刷新内容相同的URL和所有元素，驻留在元素ID为content元素的内容：内容。

#### 您可能感兴趣的文章:

- [Jquery、Ajax、Struts2完成定时刷新的方法](http://www.jb51.net/article/36646.htm)
- [JQuery实现定时刷新功能代码](http://www.jb51.net/article/113353.htm)