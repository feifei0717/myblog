linux下tomcat开机启动配置

分类: linux
日期: 2015-03-15

原文地址: 

http://blog.chinaunix.net/uid-29632145-id-4894245.html

------

****[linux下tomcat开机启动配置]() *2015-03-15 22:17:11*

分类： LINUX

linux下tomcat开机启动配置

 

linux下配置完tomcat后，要想tomcat开机自动启动的话，需要另外的配置，下面介绍两种方法！

 

tomcat开机启动方法一：

 linux 下tomcat开机自启动

 修改Tomcat/bin/startup.sh 为:

 export JAVA_HOME=/usr/java/j2sdk1.4.2_08

 export CLASSPATH=$CLASSPATH:$JAVA_HOME/lib/tools.jar:$JAVA_HOME/lib/dt.jar:.

 export PATH=$PATH:$JAVA_HOME/bin

 export CATALINA_HOME=/usr/local/tomcat

 /usr/local/tomcat/bin/catalina.sh start

 

在/etc/rc.d/rc.local中加入:

 /usr/local/tomcat/bin/startup.sh

 

tomcat开机启动方法二(推荐灵活)：

 1、把下面的代码保存为tomcat文件，并让它成为可执行文件 chmod 755 tomcat.

 #!/bin/bash

 #

 # kenny kenny.zhou@tom.com

 # /etc/rc.d/init.d/tomcat

 # init script for tomcat precesses

 #

 # processname: tomcat

 # description: tomcat is a j2se server

 # chkconfig: 2345 86 16

 # description:  Start up the Tomcat servlet engine.

 if [ -f /etc/init.d/functions ]; then

​         . /etc/init.d/functions

 elif [ -f /etc/rc.d/init.d/functions ]; then

​         . /etc/rc.d/init.d/functions

 else

​         echo -e "\atomcat: unable to locate functions lib. Cannot continue."

​         exit -1

 fi

 RETVAL=$?

 CATALINA_HOME="/usr/local/tomcat"

 case "$1" in

 start)

​         if [ -f $CATALINA_HOME/bin/startup.sh ];

​           then

​             echo $"Starting Tomcat"

​             $CATALINA_HOME/bin/startup.sh

​         fi

​         ;;

 stop)

​         if [ -f $CATALINA_HOME/bin/shutdown.sh ];

​           then

​             echo $"Stopping Tomcat"

​             $CATALINA_HOME/bin/shutdown.sh

​         fi

​         ;;

 *)

​         echo $"Usage: $0 {start|stop}"

​         exit 1

​         ;;

 esac

 exit $RETVAL

 #以上为tomcat开机启动的启动脚本代码

 2、将tomcat文件拷贝到/etc/init.d/下，并运行：chkconfig --add tomcat  //这句的意思是添加tomcat服务

 3、在tomcat/bin/catalina.sh文件中加入以下语句：

 export JAVA_HOME=/YOURPATH/tomcat/jdk

 export CATALINA_HOME=/YOURPATH/tomcat

 export CATALINA_BASE=/YOURPATH/tomcat

 export CATALINA_TMPDIR=/YOURPATH/tomcat/temp

 启动tomcat： service tomcat start

 

停止tomcat:  service tomcat stop

 

至此tomcat开机启动全部配置完毕，下次linux重启的时候就会自动启动tomcat了！

 