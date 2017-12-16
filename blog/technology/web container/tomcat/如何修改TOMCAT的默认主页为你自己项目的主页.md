# 如何修改TOMCAT的默认主页为你自己项目的主页

- ​

**（最合适的）**

**最直接的办法是，删掉tomcat下原有Root文件夹，将自己的项目更名为Root。**



## （一）在ROOT文件夹下放自己主页

【转】 如何修改TOMCAT的默认主页为你自己项目的主页

启动tomcat之后，在猫页上有这么一段话:

As you may have guessed by now, this is the default Tomcat home page. It can be found on the local filesystem at: 
$CATALINA_HOME/webapps/ROOT/index.html

这就说明，无论你怎么折腾你自己的web.xml文件，对不起，tomcat只认它自己的web.xml定义的welcome页面。

而<welcome-file-list>标签上的这段注释:

> <!-- If you define welcome files in your own application's web.xml -->
> <!-- deployment descriptor, that list *replaces* the list configured -->
> <!-- here, so be sure that you include any of the default values that -->
> <!-- you wish to include.
>
> -->

修改过程

1.不要碰conf目录下的那个web.xml文件，让它老死在那里吧。

2.把原来的ROOT目录清空，里面什么都不要留。删掉或者改名随便你怎么弄都成。只要清空就好。

3.发布你自己的项目到ROOT目录下，用war包发布或者用直接拷贝的都一个效果。保证index.html/index.htm/index.jsp其中一个存在于ROOT目录下。

4.删除%CATALINA%/work目录下的一切。我就是没有清理这个目录，导致[http://localhost:8080](http://localhost:8080/)永远都是那只猫~~~~郁闷

5.通知服务商重启tomcat。

## （二）修改conf文件夹下server.xml文件

这里把用指定项目的主页替换tomcat主页的方法记录一下:

### 1、 更改tomcat端口为80

在tomcat目录conf下找到server.xml打开，找到

```
<Connector port="80" protocol="HTTP/1.1"
connectionTimeout="0"
redirectPort="8443" URIEncoding="gb2312"/>
```

port改为80.

如端口80被占用，解决方法：解决：在win的cmd命令窗口输入netstat -abn ->c:/port80.txt 然后到c盘port80.txt文件中找到占用80端口的程序pid，记下pid。打开任务管理器，点击“查看”/选择列，勾选“PID(进程标识符)”，然后单击“进程”标签，找到80端口对应的pid，就可以看到是那个程序占用的了，更改这个程序的port，再重启这个程序，使更改生效。

### 2、 设置默认访问主页为指定项目。

在server.xml中找到

```
<Host name="localhost" appBase="webapps"
unpackWARs="true" autoDeploy="true"
xmlValidation="false" xmlNamespaceAware="false">
</Host>
```

在标签中间插入：

```
<Context path="" docBase="xbwl" debug="0" reloadable="true"/>
```

docBase="xbwl" xbwl即为指定的项目。

完整如下：

```
<Host name="localhost" appBase="webapps"
unpackWARs="true" autoDeploy="true"
xmlValidation="false" xmlNamespaceAware="false">
<Context path="" docBase="xbwl" debug="0" reloadable="true"/>
</Host>
```

 

 http://xxs673076773.iteye.com/blog/1134805