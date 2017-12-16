# Redis 远程连接redis

假设两台[Redis](http://lib.csdn.net/base/redis)服务器，ip分别为：192.168.1.101和192.168.1.103，如何在101上通过[redis](http://lib.csdn.net/base/redis)-cli访问103上的redis呢？在远程连接103之前，先讲下redis-cli的几个关键参数：

用法：

```
redis-cli [OPTIONS] [cmd [arg [arg ...]]]

-h <主机ip>，默认是127.0.0.1
-p <端口>，默认是6379
-a <密码>，如果redis加锁，需要传递密码
--help，显示帮助信息
```

通过对rendis-cli用法介绍，在101上连接103应该很简单：

```
[root@linuxidc001 ~]# redis-cli -h 192.168.1.103 -p 6379 
redis 192.168.1.103:6379> 
在101上对103设置个个string值 user.1.name=zhangsan
redis 192.168.1.103:6379> set user.1.name zhangsan 
OK 
```

看到ok，表明设置成功了。然后直接在103上登陆，看能不能获取到这个值。

```
redis 192.168.1.103:6379>  keys *
redis 192.168.1.103:6379>  select 1
```

### 

<http://blog.csdn.net/chen88358323/article/details/47318303>