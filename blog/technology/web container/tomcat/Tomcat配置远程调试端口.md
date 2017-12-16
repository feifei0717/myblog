#  Tomcat配置远程调试端口 

1.Linxu系统: apach/bin/startup.sh开始处中增加如下内容： 

Java代码 

1. declare -x CATALINA_OPTS="-server -Xdebug -Xnoagent -Djava.compiler=NONE -Xrunjdwp:transport=dt_socket,server=y,suspend=n,address=8788"   

2.Windows系统: apach/bin/startup.bat开始处中增加如下内容： 

Java代码 

1. SET CATALINA_OPTS=-server -Xdebug -Xnoagent -Djava.compiler=NONE -Xrunjdwp:transport=dt_socket,server=y,suspend=n,address=8788  

3.linux打开端口命令的使用方法。 

nc -lp 8788 &（打开8788端口） 

4.查看是否打开8788端口 

netstat -an | grep 8788 

注：linux下1010端口是默认开的，可以直接设置为调试1010端口即可 