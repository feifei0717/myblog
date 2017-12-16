# MAC查看端口占用情况

#### 一、查看端口占用情况命令:

```
lsof -i:2181
```

输出结果：

```
jerrydeMacBookPro:zookeeper jerryye$ lsof -i:2181
COMMAND  PID    USER   FD   TYPE             DEVICE SIZE/OFF NODE NAME
java    5093 jerryye   28u  IPv6 0xf19e48cb761c7a59      0t0  TCP *:eforward (LISTEN)
```

字段说明：

> COMMAND：进程的名称PID：进程标识符USER：进程所有者FD：文件描述符，应用程序通过文件描述符识别该文件。如cwd、txt等 TYPE：文件类型，如DIR、REG等DEVICE：指定磁盘的名称SIZE：文件的大小NODE：索引节点（文件在磁盘上的标识）NAME：打开文件的确切名称

#### 二、kill进程（PID）

> kill 559

#### 三、lsof介绍

1）lsof(list open files)是一个列出当前系统打开文件的工具。2）lsof语法格式是：lsof ［options］ filename

详细的使用可参考这个链接[http://www.cnblogs.com/ggjucheng/archive/2012/01/08/2316599.html](http://www.cnblogs.com/ggjucheng/archive/2012/01/08/2316599.html)

[http://www.jianshu.com/p/8d167e3bca50](http://www.jianshu.com/p/8d167e3bca50)