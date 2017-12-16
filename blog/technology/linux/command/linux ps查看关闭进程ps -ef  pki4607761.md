ps -ef是查看所有的进程的然后用grep筛选出你要的信息
ps -aux | grep redisps -ef | grep redis
 例子：
[root@localhost src]# ps -ef | grep redis
root     10903     1  0 04:56 ?        00:00:00 redis-server *:6379                            
root     11042  6959  0 04:59 pts/1    00:00:00 grep redis

pkill redis-server


[Linux下Tomcat的启动、关闭、杀死进程](http://blog.csdn.net/justfornn413/article/details/4945899)打开终端
cd /java/tomcat
#执行
bin/startup.sh #启动tomcat
bin/shutdown.sh #停止tomcat
tail -f logs/catalina.out #看tomcat的控制台输出；#看是否已经有tomcat在运行了
ps -ef |grep tomcat 
#如果有，用kill;
kill -9 pid #pid 为相应的进程号例如 ps -ef |grep tomcat 输出如下sun 5144 1 0 10:21 pts/1 00:00:06 /java/jdk/bin/java -Djava.util.logging.manager=org.apache.juli.ClassLoaderLogManager -Djava.endorsed.dirs=/java/tomcat/common/endorsed -classpath :/java/tomcat/bin/bootstrap.jar:/java/tomcat/bin/commons-logging-api.jar -Dcatalina.base=/java/tomcat -Dcatalina.home=/java/tomcat -Djava.io.tmpdir=/java/tomcat/temp org.apache.catalina.startup.Bootstrap start则 5144 就为进程号 pid = 5144
kill -9 5144 就可以彻底杀死tomcat