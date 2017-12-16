# Linux删除文件夹命令


原文地址: [http://blog.chinaunix.net/uid-29632145-id-4607733.html](http://blog.chinaunix.net/uid-29632145-id-4607733.html)[Linux删除文件夹命令]()  



 linux删除目录很简单，很多人还是习惯用rmdir，不过一旦目录非空，就陷入深深的苦恼之中，现在使用rm -rf命令即可。
直接rm就可以了，不过要加两个参数-rf 即：rm -rf 目录名字
-r 就是向下递归，不管有多少级目录，一并删除
-f 就是直接强行删除，不作任何提示的意思

 

## 1删除文件夹实例：

rm -rf /var/log/httpd/access
将会删除/var/log/httpd/access目录以及其下所有文件、文件夹

## 2删除文件使用实例：

rm -f /var/log/httpd/access.log
将会强制删除/var/log/httpd/access.log这个文件

## 注意事项

使用这个rm -rf的时候一定要格外小心，linux没有回收站的 