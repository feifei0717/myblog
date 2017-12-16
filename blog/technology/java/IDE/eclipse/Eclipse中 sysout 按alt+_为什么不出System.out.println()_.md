Eclipse中 sysout 按alt+_为什么不出System.out.println()_

分类: java
日期: 2014-09-29

原文地址: 

http://blog.chinaunix.net/uid-29632145-id-4514116.html

------

****[Eclipse中 sysout 按alt+/为什么不出System.out.println(); ]()*2014-09-29 17:36:29*

分类： Java

## [Eclipse中 sysout 按alt+/为什么不出System.out.println();](http://www.cnblogs.com/syc001/archive/2012/09/04/2671087.html)

自从笔记本的系统更换为Win7 64位后，Eclipse官网上下了个64位版本，每次运行到sysout ，eclipse总是不自动补全，很是恼火。。。。

今天在网上中找了解决方案，作为备份，解决方案如下：

**需要重新设置快捷键。**
按快捷键ctrl+shirt+L，然后在按一下L。设置快捷键的对话框就出来了，然你将Word Completion移除，在将Content Assist 这个设置为alt+/。就可以了。

 

1、myeclpse–>Preferences–>General–>Keys    

删掉word completion的快捷键设置alt+/ 【这个跟Content Assist起冲突了】

2、把Content Assist的快捷键由ctrl+space改成alt+/ 