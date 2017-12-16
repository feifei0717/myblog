# Centos linux 安装配置nginx1.6

 我这里是内网搭建的一个centos6.3mini版的虚拟机环境。

- nginx版本：1.6
- tomcat版本：7.0.54

## 1. 安装nginx

​    在安装nginx前，需要确保系统安装了g++、gcc、openssl-devel、pcre-devel和zlib-devel软件。

​    安装必须软件：这里我使用的是yum安装，刚装好的操作系统是纯净的什么都没有， 

点击(此处)折叠或打开

1. [root@unique ~]# yum -y install gcc-c++
2. [root@unique ~]# yum -y install zlib zlib-devel openssl openssl-devel pcre pcre-devel

[?](http://my.oschina.net/biezhi/blog/287614#)

​    检查系统安装的Nginx：

点击(此处)折叠或打开

1. [root@unique ~]# rpm -qa|grep nginx

​    如果有的话卸载掉他即可，我这里还没有装。我用wget命令下载一个1.6.0版本的，移动在/usr/local下

点击(此处)折叠或打开

1. [root@unique ~]# wget http://nginx.org/download/nginx-1.6.0.tar.gz
2. [root@unique ~]# mv nginx-1.6.0.tar.gz /usr/local
3. [root@unique local]# tar -zxv -f nginx-1.6.0.tar.gz
4. [root@unique local]# mv nginx-1.6.0 nginx
5. [root@unique local]# cd nginx
6. [root@unique nginx]# ./configure --prefix=/usr/local/nginx/
7. [root@unique nginx]# make && make install

[?](http://my.oschina.net/biezhi/blog/287614#)

​    在make install的时候遇到

点击(此处)折叠或打开

1. [root@unique nginx]# make install
2. make -f objs/Makefile install
3. make[1]: Entering directory `/usr/local/nginx'
4. test -d '/usr/local/nginx/' || mkdir -p '/usr/local/nginx/'
5. test -d '/usr/local/nginx//sbin' || mkdir -p '/usr/local/nginx//sbin'
6. test ! -f '/usr/local/nginx//sbin/nginx' || mv '/usr/local/nginx//sbin/nginx' '/usr/local/nginx//sbin/nginx.old'
7. cp objs/nginx '/usr/local/nginx//sbin/nginx'
8. test -d '/usr/local/nginx//conf' || mkdir -p '/usr/local/nginx//conf'
9. cp conf/koi-win '/usr/local/nginx//conf'
10. cp: "conf/koi-win" 与"/usr/local/nginx//conf/koi-win" 为同一文件
11. make[1]: *** [install] 错误 1
12. make[1]: Leaving directory `/usr/local/nginx'
13. make: *** [install] 错误 2

[?](http://my.oschina.net/biezhi/blog/287614#)

​    这里估计不少人已经出错了，很多编译安装的说明都没有设置conf-path，但是我没有设置的话，在make install 阶段，会出现cp: `conf/koi-win’ and `/usr/local/nginx/conf/koi-win’ are the same file错误。所以我们在这里设置一下，那我们就指定好nginx的conf重新来配置一遍

点击(此处)折叠或打开

1. [root@unique nginx]# ./configure --prefix=/usr/local/nginx/ --conf-path=/usr/local/nginx/nginx.conf
2. [root@unique nginx]# make && make install

​    O了，nginx就已经成功安装在我的系统上了。

## 2. 配置防火墙

点击(此处)折叠或打开

1. \#修改防火墙配置： 
2. [root@unique nginx]# vi + /etc/sysconfig/iptables
3. \#添加配置项 
4. -A INPUT -m state --state NEW -m tcp -p tcp --dport 80 -j ACCEPT
5. ​
6. \#重启防火墙和网络配置
7. [root@unique nginx]# service iptables restart
8. [root@unique nginx]# /etc/init.d/network restart

[?](http://my.oschina.net/biezhi/blog/287614#)

​    这样nginx的web服务就可以通过80端口访问了

## 3. 启动nginx

点击(此处)折叠或打开

1. \#方法1 
2. [root@unique nginx]# /usr/local/nginx/sbin/nginx -c /usr/local/nginx/conf/nginx.conf 
3. \#方法2 
4. [root@unique nginx]# cd /usr/local/nginx/sbin 
5. [root@unique sbin]# ./nginx

[?](http://my.oschina.net/biezhi/blog/287614#)

## 4. 停止nginx

点击(此处)折叠或打开

1. \#查询nginx主进程号 
2. ps -ef | grep nginx
3. \#停止进程 
4. kill -QUIT 主进程号 
5. \#快速停止 
6. kill -TERM 主进程号 
7. \#强制停止 
8. pkill -9 nginx

[?](http://my.oschina.net/biezhi/blog/287614#)

## 5. 重启nginx

点击(此处)折叠或打开

1. [root@unique sbin]# /usr/local/nginx/sbin/nginx -s reload

[?](http://my.oschina.net/biezhi/blog/287614#)

## 6. 测试nginx

点击(此处)折叠或打开

1. \#测试端口 
2. netstat –na|grep 80
3. \#浏览器中测试 
4. http://ip:80


[![img](http://static.oschina.net/uploads/space/2014/0705/171711_hhmd_1767531.png) 

​    酷炫的nginx就配置完成了~

## 7. 扩展：配置自定义命令

​    这里就做一个自定义的nginx启动停止脚本

点击(此处)折叠或打开

1. [root@unique sbin]# vi /etc/init.d/nginx

[?](http://my.oschina.net/biezhi/blog/287614#)

​    把下面的脚本复制进去然后保存

点击(此处)折叠或打开

1. \#! /bin/sh
2. \# Default-Start: 2 3 4 5
3. \# Default-Stop: 0 1 6
4. \# Short-Description: starts the nginx web server
5. \# chkconfig: - 85 15
   \# description: nginx is a World Wide Web server. It is used to serve
6. ​
7. PATH=/usr/local/sbin:/usr/local/bin:/sbin:/bin:/usr/sbin:/usr/bin
8. DESC="nginx daemon"
9. NAME=nginx
10. DAEMON=/usr/local/nginx/sbin/$NAME
11. CONFIGFILE=/usr/local/nginx/conf/$NAME.conf
12. PIDFILE=/usr/local/nginx/logs/$NAME.pid
13. SCRIPTNAME=/etc/init.d/$NAME
14. ​
15. set -e
16. [ -x "$DAEMON" ] || exit 0
17. ​
18. do_start() {
19. $DAEMON -c $CONFIGFILE || echo -n "nginx already running"
20. }
21. ​
22. do_stop() {
23. kill -INT `cat $PIDFILE` || echo -n "nginx not running"
24. }
25. ​
26. do_reload() {
27. kill -HUP `cat $PIDFILE` || echo -n "nginx can't reload"
28. }
29. ​
30. case "$1" in
31. start)
32. echo -n "Starting $DESC: $NAME"
33. do_start
34. echo "."
35. ;;
36. stop)
37. echo -n "Stopping $DESC: $NAME"
38. do_stop
39. echo "."
40. ;;
41. reload|graceful)
42. echo -n "Reloading $DESC configuration..."
43. do_reload
44. echo "."
45. ;;
46. restart)
47. echo -n "Restarting $DESC: $NAME"
48. do_stop
49. do_start
50. echo "."
51. ;;
52. *)
53. echo "Usage: $SCRIPTNAME {start|stop|reload|restart}" >&2
54. exit 3
55. ;;
56. esac
57. ​
58. exit 0

[?](http://my.oschina.net/biezhi/blog/287614#)

​    给文件添加执行权限

点击(此处)折叠或打开

1. [root@unique sbin]# chmod +x /etc/init.d/nginx
2. \#然后可以通过
3. \#/etc/init.d/nginx start 命令启动nginx
4. \#/etc/init.d/nginx stop 命令停止nginx
5. \#/etc/init.d/nginx restart 命令重启nginx
6. ​
7. \#重启nginx
8. [root@unique init.d]# /etc/init.d/nginx restart
9. Restarting nginx daemon: nginx.

[?](http://my.oschina.net/biezhi/blog/287614#)

## 8. 扩展：配置开机启动

如果需要开机启动服务，保存好 /etc/init.d/nginx文件后，执行以下命令:

点击(此处)折叠或打开

1. [root@unique init.d]#chkconfig --add nginx
2. [root@unique init.d]#chkconfig --level nginx 2345 on