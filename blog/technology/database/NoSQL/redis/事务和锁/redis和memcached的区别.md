问redis和memcached的区别

### 1、持久化的区别

### 2、存储数据的”结构“

相对的，redis支持的方法也多，相对memcached来说学习起来，也比memcached要稍微复杂一点点。

### 3、redis的事务处理

redis是单进程的程序，故对数据操作事务是加入队列中，最后exec提交

redis> set wang 200
redis> set zhao 700

redis> multi 开启事务
redis> decrby zhao 100 减掉zhao的100
redis> incrby wang 100 加上wang的100
redis> exec 执行事务
redis> discard 清除队列中的命令

如果事务中间加入错误的命令，redis报错，事务将会被取消掉
注意：命令是被加入队列中，挨个执行，但是其中一句语法正常，但是业务错误，例如，sadd wang hello，这样，这句的上一句执行成功，这一句执行失败，不能保证业务数据的一致性，也就是说，不支持mysql那种的回滚，只支持取消队列中的命令

执行事务时，要注意加锁，避免真正在exec执行队列中的命令时，操作的数据已被修改
悲观锁：先给数据（ticket）上锁，只有我能操作
乐观锁：监视数据，看有没有人修改数据（ticket）就行了，exec的数据修改，那么就取消事务即可。

Redis的事务中,启用的是乐观锁,只负责监测key没有被改动
------》watch命令
multi之前，先监控数据
redis> watch ticket
redis> multi 开启事务
....
...
redis> exec 执行事务
假如数据（ticket）被修改了，执行exec就返回（nil）
redis> watch key1,key2,key3 监视多个key，其中一个数据被修改，所有的都取消
取消监视 unwatch

- [2015年07月28日发布](https://segmentfault.com/a/1190000003027324)

来源： [https://segmentfault.com/a/1190000003027324](https://segmentfault.com/a/1190000003027324)