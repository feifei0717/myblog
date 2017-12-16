tomcat添加用户帐号

分类: web container
日期: 2014-12-15

原文地址: 

http://blog.chinaunix.net/uid-29632145-id-4697057.html

------

****[tomcat添加用户帐号]()*2014-12-15 20:12:05*

分类： Java

tomcat添加帐号：
apache-tomcat-7.0.56-windows-x64\conf\tomcat-users.xml编辑添加

```
        <role rolename="manager"/> 
        <role rolename="manager-gui"/> 
        <role rolename="manager-script"/> 
        <role rolename="admin"/> 
        <user username="admin" password="soco_2015_easy" roles="admin,manager,manager-script,manager-gui"/>
```

