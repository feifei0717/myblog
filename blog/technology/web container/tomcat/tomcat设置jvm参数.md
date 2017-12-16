tomcat设置jvm参数

分类: web container
日期: 2014-12-15

 

http://blog.chinaunix.net/uid-29632145-id-4697079.html

------

****[tomcat设置jvm参数]() *2014-12-15 20:26:32*

分类： Java

----------------------Linux下修改TomcatJVM内存大小----------------------

要添加在tomcat 的bin 下catalina.sh 里，位置cygwin=false前 。注意引号要带上,红色的为新添加的.

\# OS specific support.  $var _must_ be set to either true or false.
**JAVA_OPTS="-Xms512m -Xmx512m -XX:ParallelGCThreads=8 -XX:PermSize=128m -XX:MaxPermSize=256m"** 
cygwin=false

 

----------------------windows下修改Tomcat JVM内存大小----------------------

**情况一:解压版本的Tomcat** , 要通过startup.bat启动tomcat才能加载配置

要添加在tomcat 的bin 下catalina.bat 里

rem Guess CATALINA_HOME if not defined
set CURRENT_DIR=%cd%后面添加,红色的为新添加的.

**set JAVA_OPTS=-Xms512m -Xmx512m -XX:ParallelGCThreads=8 -XX:PermSize=128m -XX:MaxPermSize=256m**
----------------------eclispe下修改Tomcat JVM内存大小----------------------

找到eclispe 中window->preferences->Java->Installed JRE ，点击右侧的Edit 
按钮，在编辑界面中的 “Default VM Arguments ”选项中，填入如下值即可。

-Xms256m -Xmx256m