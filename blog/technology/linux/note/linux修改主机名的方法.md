linux修改主机名的方法

分类: linux
日期: 2014-04-27

原文地址: 

http://blog.chinaunix.net/uid-29632145-id-4228885.html

------

****[linux修改主机名的方法]() *2014-04-27 23:37:55*

分类： LINUX

linux修改主机名的方法

用hostname命令可以临时修改机器名，但机器重新启动之后就会恢复原来的值。

\#hostname   //查看机器名
\#hostname -i  //查看本机器名对应的ip地址

另外一种方法就是之久修改配置文件

修改/etc/sysconfig/network   修改这个文件，系统才有效
​    /etc/hosts       hostname命令读这个配置文件

网上有很多朋友说直接修改/etc/hosts文件就可以，但系统本身用到主机名的地方不会变化，所以我觉得
 /etc/hosts 是网络中用的，/etc/sysconfig/network是本机起作用，而且经络测试也是这样的，我得版本是

linux as3

总结：所以要修改主机名，就两个文件都更改 