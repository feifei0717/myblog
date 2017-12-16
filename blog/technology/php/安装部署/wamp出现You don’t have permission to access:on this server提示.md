# wamp出现You don’t have permission to access/on this server提示



本地搭建wamp，输入http://127.0.0.1访问正常，当输入http://localhost/，apache出现You don't have permission to access/on this server.的提示，如何解决？

- 找到httpd.conf，用记事本打开httpd.conf，然后将

```
<Directory />
    Options FollowSymLinks
    AllowOverride None
    Order deny,allow
    Deny from all
</Directory>
```

这里改成：

```
<Directory />
    Options FollowSymLinks
    AllowOverride None
    Order deny,allow
    Allow from all
</Directory>
```

 还有一处将下面

```
# onlineoffline tag - don't remove
Order Deny,Allow
Deny from all  
Allow from 127.0.0.1
</Directory>
```

将Deny from all  改为：Allow from all  ，然后重新启动所有服务。

现在打开localhost或127.0.0.1时发现可以访问了，但访问phpmyadmin时候，出现“You don't have permission to access /phpmyadmin/ on this server.”的提示。

- 解决方法，打开如下文件:

> C:\wamp\alias\phpmyadmin.conf　　　　//这个就是你的wamp的安装目录下的内容，用记事本打开

修改成这样：

```
<Directory "c:/wamp/apps/phpmyadmin3.5.1/">
    Options Indexes FollowSymLinks MultiViews
    AllowOverride all
    Order Deny,Allow
    Allow from all
    Allow from 127.0.0.1
</Directory>
```

修改保存后，重启wamp ，搞定收工！





http://blog.csdn.net/hong0220/article/details/40262729/