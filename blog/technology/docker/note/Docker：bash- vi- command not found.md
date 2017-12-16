在使用[Docker](http://lib.csdn.net/base/docker)容器时，有时候里边没有安装vim，敲vim命令时提示说：vim: command not found，这个时候就需要安装vim，可是当你敲apt-get install vim命令时，提示：

```
Reading package lists... Done Building dependency tree Reading state information... Done E: Unable to locate package vim1234
1234
```

操作步鄹：

> 1)这时候需要敲：apt-get update，这个命令的作用是：同步 /etc/apt/sources.list 和 /etc/apt/sources.list.d 中列出的源的索引，这样才能获取到最新的软件包。 
> 2)等更新完毕以后再敲命令：apt-get install -y vim命令即可。

如果是：bash:ping: command not found

> apt-get install iputils-ping

来源： <http://blog.csdn.net/silentwolfyh/article/details/52336007>