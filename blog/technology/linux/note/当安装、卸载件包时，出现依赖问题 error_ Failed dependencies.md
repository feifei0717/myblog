当安装、卸载件包时，出现依赖问题 error_ Failed dependencies

分类: linux
日期: 2014-11-07

原文地址: 

http://blog.chinaunix.net/uid-29632145-id-4605350.html 

 

# [当安装、卸载件包时，出现依赖问题 error: Failed dependencies](http://blog.csdn.net/cherish1forever/article/details/14522053)

2013-12-11 12:04 501人阅读 [评论](http://blog.csdn.net/cherish1forever/article/details/14522053#comments)(0) [收藏](.:void(0);) [举报](http://blog.csdn.net/cherish1forever/article/details/14522053#report)

error: Failed dependencies:……

依赖关系非常复杂，当你试图先安装任何一个包时都会出现这样的依赖关系错误，这时候你就应该强制安装了，我认为只要你把服务或软件需要的包都装上，强制安装也不会出问题的，不会有什么影响。

非常简单，只要加上一个--force （强制） 和--nodeps（不查找依赖关系）就可以了

如：rpm -vih httpd-2.2.3-6.el5.i386.rpm --force --nodeps

卸载时就不用--force了，只要加入--nodeps就ok了