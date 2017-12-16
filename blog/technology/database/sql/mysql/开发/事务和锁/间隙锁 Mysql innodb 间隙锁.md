前段时间系统老是出现insert死锁，很是纠结。经过排查发现是间隙锁！间隙锁是innodb中行锁的一种， 但是这种锁锁住的却不止一行数据，他锁住的是多行，是一个数据范围。间隙锁的主要作用是为了防止出现幻读，但是它会把锁定范围扩大，有时候也会给我们带来麻烦，我们就遇到了。 在数据库参数中， 控制间隙锁的参数是：innodb_locks_unsafe_for_binlog， 这个参数默认值是OFF， 也就是启用间隙锁， 他是一个bool值， 当值为true时表示disable间隙锁。那为了防止间隙锁是不是直接将innodb_locaks_unsafe_for_binlog设置为true就可以了呢？ 不一定！而且这个参数会影响到主从复制及灾难恢复， 这个方法还尚待商量。

间隙锁的出现主要集中在同一个事务中先delete 后 insert的情况下， 当我们通过一个参数去删除一条记录的时候， 如果参数在数据库中存在， 那么这个时候产生的是普通行锁， 锁住这个记录， 然后删除， 然后释放锁。如果这条记录不存在，问题就来了， 数据库会扫描索引，发现这个记录不存在， 这个时候的delete语句获取到的就是一个间隙锁，然后数据库会向左扫描扫到第一个比给定参数小的值， 向右扫描扫描到第一个比给定参数大的值， 然后以此为界，构建一个区间， 锁住整个区间内的数据， 一个特别容易出现死锁的间隙锁诞生了。

举个例子：

表task_queue

Id           taskId

1              2

3              9

10            20

40            41

开启一个会话： session 1

sql> set autocommit=0;


取消自动提交

sql> delete from task_queue where taskId = 20;

sql> insert into task_queue values(20, 20);

在开启一个会话： session 2

sql> set autocommit=0;


取消自动提交

sql> delete from task_queue where taskId = 25;

sql> insert into task_queue values(30, 25);

在没有并发，或是极少并发的情况下， 这样会可能会正常执行，在Mysql中， 事务最终都是穿行执行， 但是在高并发的情况下， 执行的顺序就极有可能发生改变， 变成下面这个样子：

sql> delete from task_queue where taskId = 20;

sql> delete from task_queue where taskId = 25;

sql> insert into task_queue values(20, 20);

sql> insert into task_queue values(30, 25);

这个时候最后一条语句：insert into task_queue values(30, 25); 执行时就会爆出死锁错误。因为删除taskId = 20这条记录的时候，20 --  41 都被锁住了， 他们都取得了这一个数据段的共享锁， 所以在获取这个数据段的排它锁时出现死锁。

这种问题的解决办法：前面说了， 通过修改innodb_locaks_unsafe_for_binlog参数来取消间隙锁从而达到避免这种情况的死锁的方式尚待商量， 那就只有修改代码逻辑， 存在才删除，尽量不去删除不存在的记录。
来源： <http://blog.csdn.net/andyxm/article/details/44810417>