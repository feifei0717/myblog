# PHP字符串的连接的简单实例

很多时候我们需要将几个字符串连接起来显示，在PHP中，字符串之间使用“点”来连接，也就是英文中的句号”.”，具体使用方式如下：

[复制代码]()代码如下:

```
<?php
  //定义字符串
  $str1 = "Hello World!";
  $str2 = "Welcome to HutaoW's BLOG!";

  //连接上面两个字符串 中间用空格分隔
  $str3 = $str1 . " " . $str2;

  //输出连接后的字符串
  echo $str3;
  /*
   该段代码执行后浏览器页面将显示
       "Hello World! Welcome to HutaoW's BLOG!"
  */
?>
```

连接字符串还有另外一种方法，有点像C中”printf”的占位符，不过PHP是直接把变量名写到占位符上了。使用方法就是在变量前后加上大括号，这样显示时，字符串中没有用大括号括起来的部分依旧会直接输出，而括起来的部分会根据变量名替换输出相应的字符串。可以看下面的例子更清晰些，注意其中下划线的部分：

[复制代码]()代码如下:

```
<?php
  //定义待插入的字符串
  $author = "HutaoW";
  //生成新的字符串
  $str = "Welcome to {$author}'s BLOG!";
  //输出$str字符串
  echo $str;  /*
   该段代码执行后浏览器页面将显示
       "Welcome to HutaoW's BLOG!"
  */
?>
```

来源： <http://www.jb51.net/article/45042.htm>