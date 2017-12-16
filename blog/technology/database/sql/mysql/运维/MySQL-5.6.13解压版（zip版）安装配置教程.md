MySQL-5.6.13解压版（zip版）安装配置教程

分类: database
日期: 2014-09-16

原文地址: 

http://blog.chinaunix.net/uid-29632145-id-4474353.html

------

****[MySQL-5.6.13解压版（zip版）安装配置教程]() *2014-09-16 13:23:53*

分类： Mysql/postgreSQL

MySQL-5.6.13解压版（zip版）安装配置教程 

  

[[下载](http://www.2cto.com/soft)MySQL 5.6.13] 

  

从MySQL官方网站mysql.com找到MySQL Community Server 5.6.13的下载地址为http://dev.mysql.com/downloads/mysql/，在这里可以选择操作系统平台。洪哥选择的是Microsoft Windows平台。下面有三个可选的下载文件，第一个是MySQL Installer 5.6 for Windows，这将下载下来一个.msi可执行安装文件。另外有两个解压版（Zip版）分别是Windows (x86, 64-bit), ZIP Archive 和 Windows (x86, 32-bit), ZIP Archive。下载下来，分别是mysql-5.6.13-winx64.zip 和 mysql-5.6.13-win32.zip。洪哥选择的是Windows (x86, 64-bit), ZIP Archive，因为我的服务器操作系统是Windows 2008 R2 64bit。 

  

[安装MySQL 5.6.13] 

  

下载的zip包有212MB，下载了几分钟就好了。 

  

1、将mysql-5.6.13-winx64.zip 解压到D:\mysql-5.6.13\目录。 

  

2、清理里面的调试文件 

打开这个目录，发现里面的文件夹和文件跟一个安装好后的MySQL基本没有区别。可能你会很郁闷，这个MySQL5.6.13居然有1.04GB，呵呵，仔细一看你就会发现，里面有很有调试文件。后缀为.lib或.pdb的，其实可以删除掉。还有一些名为debug的目录，也删除掉吧。这样是不是就小很多了。 

  

3、创建my.ini作为MySQL的配置文件 

默认情况下没有my.ini文件，这需要我们手工创建一个。怎么创建呢？有没有像php.ini那样有模板呢？其实在MySQL5.6.13中带了一个my-default.ini，可以算作模板，只是里面的内容实在太少了。于是洪哥带大家手工创建一个my.ini。 

直接创建一个文本文件，命名为my.ini。打开它，输入如下内容： 

  

[mysqld] 

 

  

\#绑定IPv4和3306端口 

bind-address = 0.0.0.0 

port = 3306 

 

\# 设置mysql的安装目录 

basedir=D:/ToolKit/MySQL/mysql-5.6.20-winx64

 

\# 设置mysql数据库的数据的存放目录 

datadir=D:/ToolKit/MySQL/mysql-5.6.20-winx64/data 

 

\# 允许最大连接数 

max_connections=200 

 

\#字符集

[client]

\#修改客户端默认字符编码格式为utf8

default-character-set=utf8

[mysqld]

\#修改服务器端默认字符编码格式为utf8

character-set-server = utf8

  

好了，这样一个基本的MySQL环境所需要的参数就够了。 

  

4、将MySQL安装成服务 

打开一个cmd.exe，将目录切换到D:\MySQL-5.6.13\bin，运行： mysqld -install ，提示服务安装成功！运行services.msc一看，确实有一个名为MySQL的服务了，启动它。 

  

到此，MySQL5.6.13已经可以正常使用了。 

  

[配置MySQL 5.6.13] 

  

安装完后还要配置一下才能使用，对不对。 

  

1、my.ini的参数配置 

关于my.ini里面更多更复杂的参数配置，洪哥这里就不介绍了。需要对MySQL进行优化的兄弟们可以参照MySQL官网的手册来操作。 

  

2、配置root用户登录 

默认情况下root是空密码，所以直接运行d:\mysql-5.6.13\bin\mysql -uroot -p，提示输入密码时，直接回车即可以root身份进入管理MySQL了。 

root没有密码是太恐怖了，我们来给它设置一个密码。运行d:\mysql-5.6.13\bin\mysqladmin -uroot -p password mypasswd ，将mypasswd 替换为你的自定义密码，然后按回车。这时会提示输入密码，其实是指的原密码，原密码因为是空，所以这里再回车即可完成设置。 

  

3、其它操作 

用root用户及其新密码登录进去之后，就可以完成其它所有的正常工作了。 

  

 