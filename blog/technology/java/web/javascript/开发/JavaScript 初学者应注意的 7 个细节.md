# JavaScript 初学者应注意的 7 个细节

分类: javascript
日期: 2014-09-01

 

http://blog.chinaunix.net/uid-29632145-id-4448922.html

------

****[JavaScript 初学者应注意的 7 个细节]() *2014-09-01 15:12:30*

分类： JavaScript

原文出处： smashingmagazine   译文出处：梦想天空  

每种语言都有它特别的地方，对于JavaScript来说，使用var就可以声明任意类型的变量，这门脚本语言看起来很简单，然而想要写出优雅的代码却是需要不断积累经验的。本文利列举了JavaScript初学者应该注意的七个细节，与大家分享。

## **（1）简化代码**

JavaScript定义对象和数组非常简单，我们想要创建一个对象，一般是这样写的：

```
var car = new Object();
car.colour = 'red';
car.wheels = 4;
car.hubcaps = 'spinning';
car.age = 4;
```

下面的写法可以达到同样的效果：

```
var car = {
        colour:'red',
        wheels:4,
    　　hubcaps:'spinning',
    　　age:4
    }
```

后面的写法要短得多，而且你不需要重复写对象名称。

另外对于数组同样有简洁的写法，过去我们声明数组是这样写的：

```
var moviesThatNeedBetterWriters = new Array(
      'Transformers','Transformers2','Avatar','Indiana Jones 4'
    );
```

更简洁的写法是：

```
var moviesThatNeedBetterWriters = [
      'Transformers','Transformers2','Avatar','Indiana Jones 4'
    ];
```


对于数组，还有关联数组这样一个特别的东西。 你会发现很多代码是这样定义对象的：

```
var car = new Array();
    car['colour'] = 'red';
    car['wheels'] = 4;
    car['hubcaps'] = 'spinning';
    car['age'] = 4;
```

这太疯狂了，不要觉得困惑，“关联数组”只是对象的一个别名而已。

另外一个简化代码的方法是使用三元运算符，举个例子：

```
var direction;
    if(x < 200){
      direction = 1;
    } else {
      direction = -1;
    }
```

我们可以使用如下的代码替换这种写法：

```
var direction = x < 200 ? 1 : -1;
```

## **（2）使用JSON作为数据格式**

伟大的Douglas Crockford发明了JSON数据格式来存储数据，你可以使用原生的javascript方法来存储复杂的数据而不需要进行任何额外的转换，例如：

```
  var band = {
     "name":"The Red Hot Chili Peppers",
     "members":[
     {
       "name":"Anthony Kiedis",
          "role":"lead vocals"
        },
        {
          "name":"Michael 'Flea' Balzary",
          "role":"bass guitar, trumpet, backing vocals"
        },
      {
          "name":"Chad Smith",
          "role":"drums,percussion"
       },
        {
          "name":"John Frusciante",
          "role":"Lead Guitar"
        }
      ],
      "year":"2009"
    }
```

你可以使用在JavaScript中直接使用JSON，甚至作为API返回的一种格式，在许多的API中被应用，例如：



这里调用delicious 的Web服务获取最新书签，以JSON格式返回，然后将它们显示成无序列表的形式。

从本质上讲，JSON是用于描述复杂的数据最轻量级的方式，而且直接它运行在浏览器中。 你甚至可以在PHP中调用 json_decode（）函数来使用它。

## **（3）尽量使用JavaScript原生函数**

要找一组数字中的最大数，我们可能会写一个循环，例如：

    var numbers = [3,342,23,22,124];
    var max = 0;
       for(var i=0;i
          if(numbers[i] > max){
           max = numbers[i];
          }
        }
       alert(max);

其实，不用循环可以实现同样的功能：

    var numbers = [3,342,23,22,124];
       numbers.sort(function(a,b){return b - a});
      alert(numbers[0]);

而最简洁的写法是：

```
Math.max(12,123,3,2,433,4); // returns 433
```

你甚至可以使用Math.max来检测浏览器支持哪个属性：

```
var scrollTop= Math.max(
  doc.documentElement.scrollTop,
    doc.body.scrollTop
   );
```

如果你想给一个元素增加class样式，可能原始的写法是这样的：

```
function addclass(elm,newclass){
var c = elm.className;
elm.className = (c === '') ? newclass : c+' '+newclass;
```

 

而更优雅的写法是：

```
function addclass(elm,newclass){
var classes = elm.className.split(' ');
classes.push(newclass);
elm.className = classes.join(' ');
}
```

## **（4）事件委托**

事件是JavaScript非常重要的一部分。我们想给一个列表中的链接绑定点击事件，一般的做法是写一个循环，给每个链接对象绑定事件，HTML代码如下：

 

```
h2>Great Web resources
Opera Web Standards Curriculum
Sitepoint
A List Apart
YUI Blog
Blame it on the voices
Oddly specific
```

脚本如下：

 

```
// Classic event handling example
(function(){
var resources = document.getElementById('resources');
var links = resources.getElementsByTagName('a');
var all = links.length;
for(var i=0;i
// Attach a listener to each link
links[i].addEventListener('click',handler,false);
};
function handler(e){
var x = e.target; // Get the link that was clicked
alert(x);
e.preventDefault();
};
})();
```

更合理的写法是只给列表的父对象绑定事件，代码如下：

 

```
(function(){
var resources = document.getElementById('resources');
resources.addEventListener('click',handler,false);
function handler(e){
var x = e.target; // get the link tha
if(x.nodeName.toLowerCase() === 'a'){
alert('Event delegation:' + x);
e.preventDefault();
}
};
})();
```

## **（5）匿名函数**

关于JavaScript的最头疼的事情之一是，它的变量没有特定的作用范围。 一般情况下，任何变量，函数，数组或对象都是全局性，这意味着在同一页上的其他脚本可以访问并覆盖它们。解决方法是把变量封装在一个匿名函数中。 例如，下面的定义将产生三个全局变量和和两个全局函数：

```
var name = 'Chris';
var age = '34';
var status = 'single';
function createMember(){
// [...]
}
function getMemberDetails(){
// [...]
}
```


封装后如下：

 

```
var myApplication = function(){
var name = 'Chris';
var age = '34';
var status = 'single';
return{
createMember:function(){
// [...]
},
getMemberDetails:function(){
// [...]
}
}
}();
// myApplication.createMember() and
// myApplication.getMemberDetails() now works.
```

这被称为单体模式，是JavaScript设计模式的一种，这种模式在YUI中用得非常多，改进的写法是：

 

```
var myApplication = function(){
var name = 'Chris';
var age = '34';
var status = 'single';
function createMember(){
// [...]
}
function getMemberDetails(){
// [...]
}
return{
create:createMember,
get:getMemberDetails
}
}();
//myApplication.get() and myApplication.create() now work.
```

## （**6）代码可配置**

你写的代码如果想让别人更容易进行使用或者修改，则需要可配置，解决方案是在你写的脚本中增加一个配置对象。要点如下：

1、在你的脚本中新增一个叫configuration的对象。

2、在配置对象中存放所有其它人可能想要去改变的东西，例如CSS的ID、class名称、语言等等。

3、返回这个对象，作为公共属性以便其它人可以进行重写。

## **（7）代码兼容性**

兼容性是初学者容易忽略的部分，通常学习Javascript的时候都是在某 个固定的浏览器中进行测试，而这个浏览器很有可能就是IE，这是非常致命的，因为目前几大主流浏览器中偏偏IE对标准的支持是最差的。最终用户看到的结果 也许就是，你写的代码在某个浏览器无法正确运行。你应该把你的代码在主流的浏览器中都测试一下，这也许很费时间，但是应该这样做。

////////////////////////