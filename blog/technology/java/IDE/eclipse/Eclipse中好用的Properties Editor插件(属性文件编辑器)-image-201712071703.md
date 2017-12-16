# Eclipse中好用的Properties Editor插件(属性文件编辑器)

分类: java
日期: 2015-07-09

原文地址: 

http://blog.chinaunix.net/uid-29632145-id-5114956.html

------

****[Eclipse中好用的Properties Editor插件(属性文件编辑器) ]()*2015-07-09 13:59:36*

分类： Windows平台

一般使用 .properties 来作为i18n国际化支持的配置文件，在.properties文件中如果使用到中文信息，都要使用 jdk自带的[native2ascii](http://www.java3z.com/cwbwebhome/article/article2/2776.html)工具转成Unicode编码才能部署使用。而使用Properties Editor 插件则可以在Eclipse中直接编辑带中文信息的java属性文件，并自动存盘为Unicode格式，无需二次转码了。

**Eclipse中的编辑效果：**

![Eclipse中好用的Properties Editor插件(属性文件编辑器) - rongjih - 拥有自己的梦想，跟随心的召唤](Eclipse中好用的Properties 5114956_files/27866022695605536[1].jpg)

用记事本打开的效果：

![Eclipse中好用的Properties Editor插件(属性文件编辑器) - rongjih - 拥有自己的梦想，跟随心的召唤](Eclipse中好用的Properties 5114956_files/2101492176123593391[1].jpg)

官方网站：

http://propedit.sourceforge.jp/index_en.html

Eclipse插件安装地址：<http://propedit.sourceforge.jp/eclipse/updates/>，插件安装完毕后，IDE中属性文件对应的图标也会变成有醒目的P标记，如下图所示：

![Eclipse中好用的Properties Editor插件(属性文件编辑器) - rongjih - 拥有自己的梦想，跟随心的召唤](Eclipse中好用的Properties 5114956_files/103301316454028827[1].jpg)