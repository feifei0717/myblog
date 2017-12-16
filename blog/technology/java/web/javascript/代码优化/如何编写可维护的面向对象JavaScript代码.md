如何编写可维护的面向对象 JavaScript 代码

分类: javascript
日期: 2015-07-15

 

http://blog.chinaunix.net/uid-29632145-id-5122545.html

------

****[如何编写可维护的面向对象 JavaScript 代码]() *2015-07-15 16:26:08*

分类： JavaScript

​	

# 如何编写可维护的面向对象JavaScript代码

作者：[Ara Pehlivanian](http://msdn.microsoft.com/en-us/magazine/gg602402.aspx?utm_source=javascriptweekly&utm_medium=email#author) 

发表时间：2011年2月1日

[原文地址](http://msdn.microsoft.com/en-us/magazine/gg602402.aspx?utm_source=javascriptweekly&utm_medium=email)

能够写出可维护的面向对象JavaScript代码不仅可以节约金钱，还能让你很受欢迎。不信？有可能你自己或者其他什么人有一天会回来重用你的代码。如果能尽量让这个经历不那么痛苦，就可以节省不少时间。地球人都知道，时间就是金钱。同样的，你也会因为帮某人省去了头疼的过程而获得他的偏爱。但是，在开始探索如何编写可维护的面向对象JavaScript代码之前，我们先来快速看看什么是面向对象。如果已经了解面向对象的概念了，就可以直接跳过下一节。

### 什么是面向对象？

面向对象编程主要通过代码代表现实世界中的实质对象。要创建对象，首先需要写一个“类”来定义。 类几乎可以代表所有的东西：账户，员工，导航菜单，汽车，植物，广告，饮料，等等。而每次要创建对象的时候，就从类实例化一个对象。换句话说，就是创建类的实例做为对象。事实上，通常处理一个以上的同类事物时就会使用到对象。另外，只需要简单的函数式程序就可以做的很好。对象实质上是数据的容器。因此在一个employee对象中，你可能要储存员工号，姓名，入职日期，职称，工资，资历，等等。对象也包括处理数据的函数（也叫做“方法”）。方法被用作媒介来确保数据的完整性，以及在储存之前对数据进行转换。例如，方法可以接收任意格式的日期然后在储存之前将其转化成标准化格式。最后，类还可以继承其他的类。继承可以让你在不同类中重复使用相同代码。例如，银行账户和音像店账户都可以继承一个基本的账户类，里面包括个人信息，开户日期，分部信息，等等。然后每个都可以定义自己的交易或者借款处理等数据结构和方法。

### 警告：JavaScript面向对象是不一样的

在上一节中，概述了经典的面向对象编程的基本知识。说经典是因为JavaScript并不遵循这些规则。相反地，JavaScript的类是写成函数的样子，而继承则是通过原型实现的。原型继承基本上意味着使用原型属性来实现对象的继承，而不是从类继承类。

### 对象的实例化

以下是JavaScript中对象实例化的例子：

```
 // 定义Employee类
 function Employee(num, fname, lname) {
     this.getFullName = function () {
         return fname + " " + lname;
     }
 };
  
 // 实例化Employee对象
 var john = new Employee("4815162342", "John", "Doe");
 alert("The employee's full name is " + john.getFullName());
```

在这里，有三个重点需要注意：

1 “class”函数名的第一个字母要大写。这表明该函数的目的是被实例化而不是像一般函数一样被调用。

2 在实例化的时候使用了new操作符。如果省略掉new而仅仅调用函数则会产生很多问题。

3 因为getFullName指定给this操作符了，所以是公共可用的，但是fname和lname则不是。由Employee函数产生的[闭包](http://extjs.org.cn/node/400)给了getFullName到fname和lname的入口，但同时对于其他类仍然是私有的。

原型继承

下面是JavaScript中原型继承的例子：

```
1 // 定义Human类
2 function Human() {
3     this.setName = function (fname, lname) {
4         this.fname = fname;
5         this.lname = lname;
6     }
7     this.getFullName = function () {
8         return this.fname + " " + this.lname;
9     }
10 }
11  
12 // 定义Employee类
13 function Employee(num) {
14     this.getNum = function () {
15         return num;
16     }
17 };
18 //让Employee继承Human类
19 Employee.prototype = new Human();
20  
21 // 实例化Employee对象
22 var john = new Employee("4815162342");
23     john.setName("John", "Doe");
24 alert(john.getFullName() + "'s employee number is " + john.getNum());
```

这一次，创建的Human类包含人类的一切共有属性——我也将fname和lname放进去了，因为不仅仅是员工才有名字，所有人都有名字。然后将Human对象赋值给它的prototype属性。

**通过继承实现代码重用**

在前面的例子中，原来的Employee类被分解成两个部分。所有的人类通用属性被移到了Human类中，然后让Employee继承Human。这样的话，Human里面的属性就可以被其他的对象使用，例如Student（学生），Client（顾客），Citizen（公民），Visitor（游客），等等。现在你可能注意到了，这是分割和重用代码很好的方式。处理Human对象时，只需要继承Human来使用已存在的属性，而不需要对每种不同的对象都重新一一创建。除此以外，如果要添加一个“中间名字”的属性，只需要加一次，那些继承了 Human 类的就可以立马使用了。反而言之，如果我们只是想要给一个对象加“中间名字”的属性，我们就直接加在那个对象里面，而不需要在 Human 类里面加。

Public（公有的）和Private（私有的）

接下来的主题，我想谈谈类中的公有和私有变量。根据对象中处理数据的方式不同，数据会被处理为私有的或者公有的。私有属性并不一定意味着其他人无法访问。可能只是某个方法需要用到。

只读

有时，你只是想要在创建对象的时候能有一个值。一旦创建，就不想要其他人再改变这个值。为了做到这点，可以创建一个私有变量，在实例化的时候给它赋值。

```
1 function Animal(type) {
2     var data = [];
3     data['type'] = type;
4     this.getType = function () {
5         return data['type'];
6     }
7 }
8  
9 var fluffy = new Animal('dog');
10 fluffy.getType(); // 返回 'dog'
```

在这个例子中，Animal类中创建了一个本地数组data。当 Animal对象被实例化时，传递了一个type的值并将该值放置在data数组中。因为它是私有的，所以该值无法被覆盖（Animal函数定义了它的范围）。一旦对象被实例化了，读取type值的唯一方式是调用getType方法。因为getType是在Animal中定义的，因此凭借Animal产生的闭包，getType可以进到data中。这样的话，虽可以读到对象的类型却无法改变。

有一点非常重要，就是当对象被继承时，“只读”技术就无法运用。在执行继承后，每个实例化的对象都会共享那些只读变量并覆盖其值。最简单的解决办法是将类中的只读变量转换成公共变量。但是你必须保持它们是私有的，你可以使用Philippe在评论中提到的技术。

Public（公有）

当然也有些时候你想要任意读写某个属性的值。要实现这一点，需要使用this操作符。

```
 function Animal() {
     this.mood = '';
 }
  
 var fluffy = new Animal();
 fluffy.mood = 'happy';
 fluffy.mood; // 返回 'happy'
```

这次Animal类公开了一个叫mood的属性，可以被随意读写。同样地，你还可以将函数指定给公有的属性，例如之前例子中的getType函数。只是要注意不要给getType赋值，不然的话你会毁了它的。

完全私有

最后，可能你发现你需要一个完全私有化的本地变量。这样的话，你可以使用与第一个例子中一样的模式而不需要创建公有方法。

```
 function Animal() {
     var secret = "You'll never know!"
 }
  
 var fluffy = new Animal();
```

写灵活的API

既然我们已经谈到类的创建，为了保持与产品需求变化同步，我们需要保持代码不过时。如果你已经做过某些项目或者是长期维护过某个产品，那么你就应该知道需求是变化的。这是一个不争的事实。如果你不是这么想的话，那么你的代码在还没有写之前就将注定荒废。可能你突然就需要将选项卡中的内容弄成动画形式，或是需要通过Ajax调用来获取数据。尽管准确预测未来是不大可能，但是却完全可以将代码写灵活以备将来不时之需。

Saner参数列表

在设计参数列表的时候可以让代码有前瞻性。参数列表是让别人实现你代码的主要接触点，如果没有设计好的话，是会很有问题的。你应该避免下面这样的参数列表：

```
 function Person(employeeId, fname, lname, tel, fax, email, email2, dob) {
 };

```

这个类十分脆弱。如果在你发布代码后想要添加一个中间名参数，因为顺序问题，你不得不在列表的最后往上加。这让工作变得尴尬。如果你没有为每个参数赋值的话，将会十分困难。例如：

```
var ara = new Person(1234, "Ara", "Pehlivanian", "514-555-1234", null, null, null, "1976-05-17");
```

操作参数列表更整洁也更灵活的方式是使用这个模式：

```
 function Person(employeeId, data) {
 };
```

有第一个参数因为这是必需的。剩下的就混在对象的里面，这样才可以灵活运用。

```
 var ara = new Person(1234, {
     fname: "Ara",
     lname: "Pehlivanian",
     tel: "514-555-1234",
     dob: "1976-05-17"
 });
```

这个模式的漂亮之处在于它即方便阅读又高度灵活。注意到fax, email和email2完全被忽略了。不仅如此，对象是没有特定顺序的，因此哪里方便就在哪里添加一个中间名参数是非常容易的：

```
 var ara = new Person(1234, {
     fname: "Ara",
     mname: "Chris",
     lname: "Pehlivanian",
     tel: "514-555-1234",
     dob: "1976-05-17"
 });
```

类里面的代码不重要，因为里面的值可以通过索引来访问：

```
 function Person(employeeId, data) {
 this.fname = data['fname'];
 };
```

如果data['fname'] 返回一个值，那么他就被设定好了。否则的话，没被设定好，也没有什么损失。

让代码可嵌入

随着时间流逝，产品需求可能对你类的行为有更多的要求。而该行为却与你类的核心功能没有半毛钱关系。也有可能是类的唯一一种实现，好比在一个选项卡的面板获取另一个选项卡的外部数据时，将这个选项卡面板中的内容变灰。你可能想把这些功能放在类的里面，但是它们不属于那里。选项卡条的责任在于管理选项卡。动画和获取数据是完全不同的两码事，也必须与选项卡条的代码分开。唯一一个让你的选项卡条不过时而又将那些额外的功能排除在外的方法是，允许将行为嵌入到代码当中。换句话说，通过创建事件，让它们在你的代码中与关键时刻挂钩，例如onTabChange, afterTabChange, onShowPanel, afterShowPanel等等。那样的话，他们可以轻易地与你的onShowPanel事件挂钩，写一个将面板内容变灰的处理器，这样就皆大欢喜了。JavaScript库让你可以足够容易地做到这一点，但是你自己写也不那么难。下面是使用YUI 3的一个例子。

```
<script type="text/javascript" src="http://yui.yahooapis.com/combo?3.2.0/build/yui/yui-min.js"></script>
<script type="text/javascript">
    YUI().use('event', function (Y) {
 
        function TabStrip() {
            this.showPanel = function () {
                this.fire('onShowPanel');
 
                // 展现面板的代码
  
                 this.fire('afterShowPanel');
             };
         };
  
         // 让TabStrip有能力激发常用事件
         Y.augment(TabStrip, Y.EventTarget);
  
         var ts = new TabStrip();
  
         // 给TabStrip的这个实例创建常用时间处理器
         ts.on('onShowPanel', function () {
             //在展示面板之前要做的事
         });
         ts.on('onShowPanel', function () {
             //在展示面板之前要做的其他事
         });
         ts.on('afterShowPanel', function () {
             //在展示面板之后要做的事
         });
  
         ts.showPanel();
     });
 </script>
```

这个例子有一个简单的 TabStrip 类，其中有个showPanel方法。这个方法激发两个事件，onShowPanel和afterShowPanel。这个能力是通过用Y.EventTarget扩大类来实现的。一旦做成，我们就实例化了一个TabStrip对象，并将一堆处理器都分配给它。这是用来处理实例的唯一行为而又能避免混乱当前类的常用代码。

总结

如果你打算重用代码，无论是在同一网页，同一网站还是跨项目操作，考虑一下在类里面将其打包和组织起来。面向对象JavaScript很自然地帮助实现更好的代码组织以及代码重用。除此以外，有点远见的你可以确保代码具有足够的灵活性，可以在你写完代码后持续使用很长时间。编写可重用的不过时JavaScript代码可以节省你，你的团队还有你公司的时间和金钱。这绝对能让你大受欢迎。