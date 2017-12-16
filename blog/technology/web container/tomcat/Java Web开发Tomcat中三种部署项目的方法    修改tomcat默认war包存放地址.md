# Java Web开发Tomcat中三种部署项目的方法  

 

## 第一种方法：

在tomcat中的conf目录中，在server.xml中的，\<Host\>节点中添加： 

```
<Context path="/hello" docBase="/home/work/dsp/disconf-rd/war/html"  debug="0" privileged="true"> 
</Context> 
```

至于Context 节点属性，可详细见相关文档。 

访问url： <http://localhost:8080/hello/index.html>

path：访问路径

docbase ：发布对应的位置

## 第二种方法：

将web项目文件件拷贝到webapps 目录中。 

## 第三种方法：

很灵活，在conf目录中，新建 Catalina（注意大小写）＼localhost目录，在该目录中新建一个xml文件，名字可以随意取，只要和当前文件中的文件名不重复就行了，该xml文件的内容为： 

```
<Context path="/hello" docBase="D:\eclipse3.2.2forwebtools\workspace\hello\WebRoot" debug="0" privileged="true"> 
</Context> 
```

第3个方法有个优点，可以定义别名。服务器端运行的项目名称为path，外部访问的URL则使用XML的文件名。这个方法很方便的隐藏了项目的名称，对一些项目名称被固定不能更换，但外部访问时又想换个路径，非常有效。 第2、3还有优点，可以定义一些个性配置，如数据源的配置等。 

 本文出自 “[On My Way](http://shuyangyang.blog.51cto.com/)” 博客，请务必保留此出处<http://shuyangyang.blog.51cto.com/1685768/1040127>