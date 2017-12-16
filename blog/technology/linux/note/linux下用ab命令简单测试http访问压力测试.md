linux下用ab命令简单测试http访问压力测试

分类: linux
日期: 2014-12-02

原文地址: 

http://blog.chinaunix.net/uid-29632145-id-4667080.html

------

****[linux下用ab命令简单测试http访问压力测试]() *2014-12-02 17:31:09*

分类： LINUX

视频教程地址：https://www.youtube.com/watch?v=XWIYb78qwvg
ab -c 1 -n 1000 http://221.228.196.113:8080/log_admin/admin/success-login.html
a b  c
a；current并发 
b:对服务器同时有一个访问连接进行压力测试
c:指定一千次http请求