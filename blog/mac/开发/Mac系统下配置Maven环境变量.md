# [Mac系统下配置Maven环境变量](http://www.cnblogs.com/zhouhongfu1991/p/5971192.html)

1、在官网下载Maven安装包，网址：[https://maven.apache.org/download.cgi](https://maven.apache.org/download.cgi)；

2、进入终端Terminal，验证JDK是否配置成功，输入java -version，显示JDK版本信息则配置成功；

3、打开配置文件.bash_profile，输入open .bash_profile；

4、输入Maven安装包路径：

export M2_HOME=/Library/apache-maven-3.3.9

`export PATH=$PATH:$M2_HOME/bin`

保存修改并关闭.bash_profile；

5、输入source .bash_profile使`修改生效；`

6、输入mvn -v验证Maven是否配置成功，如果显示Maven版本信息则配置成功。