# mysql如何查看锁信息



mysql中查看当前系统中那些语句存在锁阻塞的问题，可以通过下面的sql语句查看

```
show full processlist
```

这个语句显示当前正在执行的所有sql语句，可以从中找到存在锁的语句

下面sql语句可以直接查看mysql innodb的锁信息：

```
select * from information_schema.INNODB_LOCKS;
```





http://outofmemory.cn/code-snippet/16247/how-to-view-mysql-locks