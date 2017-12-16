# Data URL和图片，及Data URI的利弊 在Data URL协议中，图片被转换成base64



[Data URL](http://en.wikipedia.org/wiki/Data_URL)给了我们一种很巧妙的将图片“嵌入”到HTML中的方法。跟传统的用`img`标记将服务器上的图片引用到页面中的方式不一样，在Data URL协议中，图片被转换成[base64](http://en.wikipedia.org/wiki/Base64)编码的字符串形式，并存储在URL中，冠以mime-type。本文中，我将介绍如何巧妙的使用Data URL优化网站加载速度和执行效率。

[观看演示](http://www.webhek.com/demo/data-url/)

##### 1. Data URL基本原理

图片在网页中的使用方法通常是下面这种利用`img`标记的形式：

```
<img src="images/myimage.gif ">  
```

这种方式中，`img`标记的`src`属性指定了一个远程服务器上的资源。当网页加载到浏览器中 时，浏览器会针对每个外部资源都向服务器发送一次拉取资源请求，占用网络资源。大多数的浏览器都有一个并发请求数不能超过4个的限制。这意味着，如果一个 网页里嵌入了过多的外部资源，这些请求会导致整个页面的加载延迟。而使用Data URL技术，图片数据以base64字符串格式嵌入到了页面中，与HTML成为一体，它的形式如下：

```
<img src="data:image/gif;base64,R0lGODlhMwAxAIAAAAAAAP///  
yH5BAAAAAAALAAAAAAzADEAAAK8jI+pBr0PowytzotTtbm/DTqQ6C3hGX  
ElcraA9jIr66ozVpM3nseUvYP1UEHF0FUUHkNJxhLZfEJNvol06tzwrgd  
LbXsFZYmSMPnHLB+zNJFbq15+SOf50+6rG7lKOjwV1ibGdhHYRVYVJ9Wn  
k2HWtLdIWMSH9lfyODZoZTb4xdnpxQSEF9oyOWIqp6gaI9pI1Qo7BijbF  
ZkoaAtEeiiLeKn72xM7vMZofJy8zJys2UxsCT3kO229LH1tXAAAOw==">  
```

 

从上面的base64字符串中你看不出任何跟图片相关的东西，但下面，我们将传统的`img`写法和现在的Data URL用法左右对比显示，你就能看出它们是完全一样的效果。但实际上它们是不一样的，它们一个是引用了外部资源，一个是使用了Data URL。

![thufir](image-201710201430/e1a51787-9fe0-4e01-afeb-2c8606a0c9f4.png)

几乎所有的现代浏览器都支持Data URL格式，包括火狐浏览器，谷歌浏览器，Safari浏览器，opera浏览器。IE8也支持，但有部分限制，IE9完全支持。



##### 2. 为什么Data URL是个好东西

Data URL能用在很多场合，跟传统的外部资源引用方式相比，它有如下独到的用处：

> - 当访问外部资源很麻烦或受限时
> - 当图片是在服务器端用程序动态生成，每个访问用户显示的都不同时。
> - 当图片的体积太小，占用一个HTTP会话不是很值得时。

Data URL也有一些不适用的场合

> - Base64编码的数据体积通常是原数据的体积4/3，也就是Data URL形式的图片会比二进制格式的图片体积大1/3。
> - Data URL形式的图片不会被浏览器缓存，这意味着每次访问这样页面时都被下载一次。这是一个使用效率方面的问题——尤其当这个图片被整个网站大量使用的时候。

然而，Data URL这些不利的地方完全可以避免或转化。本文的重点就是要讨论这个问题。



##### 3. 在CSS里使用Data URL

当第一次看到Data URL的作用和用法时，你也许会很不疑惑，“为什么要麻烦的将图片转换成base64编码字符串，还要嵌入的网页中，将HTML代码弄的混乱不堪，甚至还会有性能上的问题。”

 

诚然，无法否认缓存在浏览器性能中的重要作用——如何能将Data URL数据也放入浏览器缓存中呢？答案是：通过CSS样式文件。CSS中的`url`操作符是用来指定网页元素的背景图片的，而浏览器并不在意URL里写的是什么——只要能通过它获取需要的数据。所以，我们就有了可以将Data URL形式的图片存储在CSS样式表中的可能。而所有浏览器都会积极的缓存CSS文件来提高页面加载效率。

 

假设我们的页面里有一个很小的`div`元素，我们想用一种灰色的斜纹图案做它的背景，这种背景在当今的网站设计者中非常流行。传统的方法是制作一个3×3像素的图片，保存成GIF或PNG格式，然后在CSS的`background-image`属性中引用它的地址。而Data URL则是一种更高效的替代方法，就像下面这样。

下面是CSS代码：

```
.striped_box  
  {  
  width: 100px;  
  height: 100px;  
  background-image: url("data:image/gif;base64,R0lGODlhAwADAIAAAP///8zMzCH5BAAAAAAALAAAAAADAAMAAAIEBHIJBQA7");  
  border: 1px solid gray;  
  padding: 10px;  
  }  
```

在我们的HTML里放入下面的代码：

```
<div class="striped_box lazy ">  
这是一个有条纹的方块  
</div>  
```

实际输出效果就是下面这样

这是一个有条纹的方块

在这个例子中，Data URL的使用是完全符合场景的。它避免了让这个小小的背景图片独自产生一次HTTP请求，而且，这个小图片还能同CSS文件一起被浏览器缓存起来，重复使 用，不会每次使用时都加载一次。只要这个图片不是很大，而且不是在CSS文件里反复使用，就可以以Data URL方法呈现图片降低页面的加载时间，改善用户的浏览体验。

 

[观看演示](http://www.webhek.com/demo/data-url/)



##### 4. 将图片转换成Data URL格式的方法

用Data URL来展示图片的例子以及它的好处我们说完了，下面我们转入下一个问题，如何将图片转换成Base64编码的字符串。其实网上有很多工具都可以使用，下面列举了几个。其中一个是在线工具，一个Mac OS X桌面应用。

- [DataURLMaker在线工具](http://dataurl.net/#dataurlmaker)
- [DataURLMaker Mac OS X 桌面](https://github.com/sveinbjornt/Data-URL-Toolkit)



##### Data URL总结

IE6/7是不支持Data URL技术的，不幸的是在中国还有很多用户在使用这种古老的浏览器。希望各方面包括官方和民间都多做努力工作，让现代浏览器(谷歌浏览器，火狐浏览器，IE11+)尽快的占领市场，这是我们Web程序员最大的愿望。

原文：<http://www.webhek.com/data-url/>

 

最近Data URI似乎热了起来，特别是从淘宝UED上发了一篇《 [Data URI小试 —— 在旺旺点灯(JS)上的应用](http://ued.taobao.com/blog/2009/10/28/data-uri-try/) 》后，陆续出现这方面的文章。看到不少人提到Data URL时都只是提到了优点，我也好奇了一把，借这机会更全面了解了下。

 

说到Data URI的优点，自然少不了“减少链接数”，把图片转为Base64编码，以减少图片的链接数。我们先想当然一下，同样一张图片，如果不用发起一个下载请求，打开速度是会更快的。但是，有几个问题需要关注下：

- 图片始终是要下载的，那么下载一张图片的速度快还是下载一堆编码快？
- 浏览器对图片的显示，处理效率哪个更快？
- 图片的缓存问题

做了几个Demo，我们来看对比下：
多小图的处理对比： [Demo1 DataURI](http://www.cssforest.org/trys/DataURI/Data-URI-1a.htm) ； [Demo2 img](http://www.cssforest.org/trys/DataURI/Data-URI-1b.htm)
单图处理对比： [Demo1 DataURI](http://www.cssforest.org/trys/DataURI/Data-URI-2a.htm) ； [Demo2 img](http://www.cssforest.org/trys/DataURI/Data-URI-2b.htm)

 

多刷新几次，可以发现，使用Data URI方式的Demo在渲染时会比不使用 **多消耗53%左右的CPU资源，内存多出4倍左右，耗时平均高出24.6倍** 。由此可见，使用Data URl方式还是需要更多的考量，在可接受的范围内适量使用。

 

有关Data URI的介绍可以看下《 [data URI scheme](http://en.wikipedia.org/wiki/Data_URI_scheme) 》和《 [利用 Data URL 加速你的網頁](http://www.hksilicon.com/kb/articles/2882/1/-Data-URL-/Page1.html) 》，里面提到的IE8以下浏览器不支持的问题，相应的解决方案可以看《 [MHTML – when you need data: URIs in IE7 and under](http://www.phpied.com/mhtml-when-you-need-data-uris-in-ie7-and-under/) 》，当然使用这种方法的代价就是为了兼容IE6\7，使代码量多出一倍；优点是可以被Cache和Gzip压缩。

在 [CSS森林](http://www.cssforest.org/blog/) 下方使用了另一种兼容IE6\7的方式，有兴趣的同学可以找找。

base64编码使用八比特表示六比特的内容，因此会打一些，4/3，但是网页一版都有gzip压缩，所以不会大太多，5%以内吧（没测过，等普及知识被打脸）。 不能缓存这点技术可以解决。

来源： <<http://justcoding.iteye.com/blog/2090964>>

 