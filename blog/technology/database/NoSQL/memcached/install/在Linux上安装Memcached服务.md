## [在Linux上安装Memcached服务](http://www.cnblogs.com/zgx/archive/2011/08/10/2134097.html)

2011-08-10 20:01 by 周国选, 

下载并安装Memcache服务器端
服务器端主要是安装memcache服务器端.
下载：http://www.danga.com/memcached/dist/memcached-1.2.2.tar.gz
另外，Memcache用到了libevent这个库用于Socket的处理，所以还需要安装libevent，libevent的最新版本是libevent-1.3。（如果你的系统已经安装了libevent，可以不用安装）
官网：http://www.monkey.org/~provos/libevent/
下载：http://www.monkey.org/~provos/libevent-1.3.tar.gz

用wget指令直接下载这两个东西.下载回源文件后。
1.先安装libevent。这个东西在配置时需要指定一个安装路径，即./configure –prefix=/usr；然后make；然后make install；
2.再安装memcached，只是需要在配置时需要指定libevent的安装路径即./configure –with-libevent=/usr；然后make；然后make install；
这样就完成了Linux下Memcache服务器端的安装。详细的方法如下：

 

> 1.分别把memcached和libevent下载回来，放到 /tmp 目录下：
> \# cd /tmp
> \# wget http://www.danga.com/memcached/dist/memcached-1.2.0.tar.gz
> \# wget http://www.monkey.org/~provos/libevent-1.2.tar.gz
>
> 3.测试libevent是否安装成功：
> \# ls -al /usr/lib | grep libevent
> lrwxrwxrwx 1 root root 21 11?? 12 17:38 libevent-1.2.so.1 -> libevent-1.2.so.1.0.3
> -rwxr-xr-x 1 root root 263546 11?? 12 17:38 libevent-1.2.so.1.0.3
> -rw-r–r– 1 root root 454156 11?? 12 17:38 libevent.a
> -rwxr-xr-x 1 root root 811 11?? 12 17:38 libevent.la
> lrwxrwxrwx 1 root root 21 11?? 12 17:38 libevent.so -> libevent-1.2.so.1.0.3
> 还不错，都安装上了。
>
> 5.测试是否成功安装memcached：
> \# ls -al /usr/local/bin/mem*
> -rwxr-xr-x 1 root root 137986 11?? 12 17:39 /usr/local/bin/memcached
> -rwxr-xr-x 1 root root 140179 11?? 12 17:39 /usr/local/bin/memcached-debug

 

启动Memcached服务：
1.启动Memcache的服务器端：
\# /usr/local/bin/memcached -d -m 10 -u root -l 192.168.141.64 -p 12000 -c 256 -P /tmp/memcached.pid

\# /usr/local/bin/memcached -d -m 512 -l 127.0.0.1 -p 12000 -u root -P /tmp/memcached.pid

> -d选项是启动一个守护进程，
> -m是分配给Memcache使用的内存数量，单位是MB，我这里是10MB，
> -u是运行Memcache的用户，我这里是root，
> -l是监听的服务器IP地址，如果有多个地址的话，我这里指定了服务器的IP地址192.168.0.200，
> -p是设置Memcache监听的端口，我这里设置了12000，最好是1024以上的端口，
> -c选项是最大运行的并发连接数，默认是1024，我这里设置了256，按照你服务器的负载量来设定，
> -P是设置保存Memcache的pid文件，我这里是保存在 /tmp/memcached.pid，

2.如果要结束Memcache进程，执行：

> \# kill `cat /tmp/memcached.pid`

也可以启动多个守护进程，不过端口不能重复。

 

测试Memcached:

 

[![复制代码](在Linux上安装Memcached服务_files/9306782a-6296-40b8-9982-c6c90af85a52.gif)]()

[root@localhost /]# telnet 127.0.0.1 12000

Trying 192.168.141.64...
Connected to 192.168.141.64 (192.168.141.64).
Escape character is '^]'.
set key1 0 60 4
zhou
STORED
get key1
VALUE key1 0 4
zhou
END

[![复制代码](在Linux上安装Memcached服务_files/9306782a-6296-40b8-9982-c6c90af85a52.gif)]()

至此Memcached安装成功!

 

 

常见问题:

1.如果启动Memcached服务的时候遇到了

/usr/local/bin/memcached: error while loading shared libraries: libevent-1.2.so.1: cannot open shared object file: No such file or directory;

解决方案:

[![复制代码](在Linux上安装Memcached服务_files/9306782a-6296-40b8-9982-c6c90af85a52.gif)]()

[root@localhost bin]# LD_DEBUG=libs memcached -v 
[root@localhost bin]# ln -s /usr/lib/libevent-1.2.so.1 /usr/lib64/libevent-1.2.so.1
[root@localhost bin]# /usr/local/bin/memcached -d -m 100 -u root -p 12000 -c 1000 -P /tmp/memcached.pid
[root@localhost bin]# ps -aux

[![复制代码](在Linux上安装Memcached服务_files/9306782a-6296-40b8-9982-c6c90af85a52.gif)]()

可以看到启动的Memcached服务了.

 

2.把Memcached服务加载到Linux的启动项中.万一机器断电系统重启.那么Memcached就会自动启动了.

假如启动Memcache的服务器端的命令为：
\# /usr/local/bin/memcached -d -m 10 -u root -l 192.168.141.64 -p 12000 -c 256 -P /tmp/memcached.pid容来自17jquery

想开机自动启动的话，只需在/etc/rc.d/rc.local中加入一行，下面命令
/usr/local/memcached/bin/memcached -d -m 10 -p 12000 -u apache -c 256 

/usr/local/bin/memcached -d -m 512 -l 127.0.0.1 -p 12000 -u root -P /tmp/memcached.pid
上面有些东西可以参考一下：即，ip不指定时，默认是本机，用户:最好选择是：apache 或 deamon
这样，也就是属于哪个用户的服务，由哪个用户启动。

 

来源： <[http://www.cnblogs.com/zgx/archive/2011/08/10/2134097.html](http://www.cnblogs.com/zgx/archive/2011/08/10/2134097.html)>