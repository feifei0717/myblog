[TOC]



# mysql悲观锁总结和实践  for update



最近学习了一下数据库的悲观锁和乐观锁，根据自己的理解和网上参考资料总结如下：

 

## **悲观锁介绍（百科）：**

悲观锁，正如其名，它指的是对数据被外界（包括本系统当前的其他事务，以及来自外部系统的事务处理）修改持保守态度，因此，在整个数据处理过程中，将数据处于锁定状态。悲观锁的实现，往往依靠数据库提供的锁机制（也只有数据库层提供的锁机制才能真正保证数据访问的排他性，否则，即使在本系统中实现了加锁机制，也无法保证外部系统不会修改数据）。

 

## **使用场景举例**：

以MySQL InnoDB为例

商品goods表中有一个字段status，status为1代表商品未被下单，status为2代表商品已经被下单，那么我们对某个商品下单时必须确保该商品status为1。假设商品的id为1。

 

**1如果不采用锁，那么操作方法如下：**

//1.查询出商品信息

select status from t_goods where id=1;

//2.根据商品信息生成订单

insert into t_orders (id,goods_id) values (null,1);

//3.修改商品status为2

update t_goods set status=2;

 

上面这种场景在高并发访问的情况下很可能会出现问题。

前面已经提到，只有当goods status为1时才能对该商品下单，上面第一步操作中，查询出来的商品status为1。但是当我们执行第三步Update操作的时候，有可能出现其他人先一步对商品下单把goods status修改为2了，但是我们并不知道数据已经被修改了，这样就可能造成同一个商品被下单2次，使得数据不一致。所以说这种方式是不安全的。

 

**2使用悲观锁来实现：**

在上面的场景中，商品信息从查询出来到修改，中间有一个处理订单的过程，使用悲观锁的原理就是，当我们在查询出goods信息后就把当前的数据锁定，直到我们修改完毕后再解锁。那么在这个过程中，因为goods被锁定了，就不会出现有第三者来对其进行修改了。

 

注：要使用悲观锁，我们必须关闭mysql数据库的自动提交属性，因为MySQL默认使用autocommit模式，也就是说，当你执行一个更新操作后，MySQL会立刻将结果进行提交。

 

我们可以使用命令设置MySQL为非autocommit模式：

set autocommit=0;

 

设置完autocommit后，我们就可以执行我们的正常业务了。具体如下：

//0.开始事务

begin;/begin work;/start transaction; (三者选一就可以)

//1.查询出商品信息

select status from t_goods where id=1 for update;

//2.根据商品信息生成订单

insert into t_orders (id,goods_id) values (null,1);

//3.修改商品status为2

update t_goods set status=2;

//4.提交事务

commit;/commit work;

 

注：上面的begin/commit为事务的开始和结束，因为在前一步我们关闭了mysql的autocommit，所以需要手动控制事务的提交，在这里就不细表了。

 

上面的第一步我们执行了一次查询操作：select status from t_goods where id=1 for update;

与普通查询不一样的是，我们使用了select…for update的方式，这样就通过数据库实现了悲观锁。此时在t_goods表中，id为1的 那条数据就被我们锁定了，其它的事务必须等本次事务提交之后才能执行。这样我们可以保证当前的数据不会被其它事务修改。

 

注：需要注意的是，在事务中，只有SELECT ... FOR UPDATE 或LOCK IN SHARE MODE 同一笔数据时会等待其它事务结束后才执行，一般SELECT ... 则不受此影响。拿上面的实例来说，当我执行select status from t_goods where id=1 for update;后。我在另外的事务中如果再次执行select status from t_goods where id=1 for update;则第二个事务会一直等待第一个事务的提交，此时第二个查询处于阻塞的状态，但是如果我是在第二个事务中执行select status from t_goods where id=1;则能正常查询出数据，不会受第一个事务的影响。

 

**补充：MySQL select…for update的Row Lock与Table Lock**

上面我们提到，使用select…for update会把数据给锁住，不过我们需要注意一些锁的级别，MySQL InnoDB默认Row-Level Lock，所以只有where 条件「明确」地查询主键或者索引，MySQL 才会执行Row lock (只锁住被选取的数据) ，否则MySQL 将会执行Table Lock (将整个数据表单给锁住)。

如果再有索引情况下的例子就更好了，在使用含有索引的条件进行筛选时存在差异，等值查询时会是行级锁，非等值情况下是表锁，在Mysql5.5版本上测试的。

 

**举例说明：**

数据库表t_goods，包括id,status,name三个字段，id为主键，数据库中记录如下;

Sql代码  

1. mysql> select * from t_goods;  
2. +----+--------+------+  
3. | id | status | name |  
4. +----+--------+------+  
5. |  1 |      1 | 道具 |  
6. |  2 |      1 | 装备 |  
7. +----+--------+------+  
8. 2 rows in set  
9.   ​
10. mysql>  

注：为了测试数据库锁，我使用两个console来模拟不同的事务操作，分别用console1、console2来表示。 

 

**例1: (明确指定主键，并且有此数据，row lock)**

console1：查询出结果，但是把该条数据锁定了

Sql代码   

1. mysql> select * from t_goods where id=1 for update;  
2. +----+--------+------+  
3. | id | status | name |  
4. +----+--------+------+  
5. |  1 |      1 | 道具 |  
6. +----+--------+------+  
7. 1 row in set  
8.   ​
9. mysql>  

console2：查询被阻塞

Sql代码  

1. mysql> select * from t_goods where id=1 for update;  

console2：如果console1长时间未提交，则会报错

Sql代码   

1. mysql> select * from t_goods where id=1 for update;  
2. ERROR 1205 : Lock wait timeout exceeded; try restarting transaction  



**例2: (明确指定主键，若查无此数据，无lock)**

console1：查询结果为空

Sql代码   

1. mysql> select * from t_goods where id=3 for update;  
2. Empty set  

console2：查询结果为空，查询无阻塞，说明console1没有对数据执行锁定

Sql代码  

1. mysql> select * from t_goods where id=3 for update;  
2. Empty set  



**例3: (无主键，table lock)**

console1：查询name=道具 的数据，查询正常

Sql代码   

1. mysql> select * from t_goods where name='道具' for update;  
2. +----+--------+------+  
3. | id | status | name |  
4. +----+--------+------+  
5. |  1 |      1 | 道具 |  
6. +----+--------+------+  
7. 1 row in set  
8.   ​
9. mysql>  

console2：查询name=装备 的数据，查询阻塞，说明console1把表给锁住了

Sql代码   

1. mysql> select * from t_goods where name='装备' for update;  

console2：若console1长时间未提交，则查询返回为空

Sql代码   

1. mysql> select * from t_goods where name='装备' for update;  
2. Query OK, -1 rows affected  



**例4: (主键不明确，table lock)**

console1：查询正常

Sql代码   

1. mysql> begin;  
2. Query OK, 0 rows affected  
3.   ​
4. mysql> select * from t_goods where id>0 for update;  
5. +----+--------+------+  
6. | id | status | name |  
7. +----+--------+------+  
8. |  1 |      1 | 道具 |  
9. |  2 |      1 | 装备 |  
10. +----+--------+------+  
11. 2 rows in set  
12.   ​
13. mysql>  

console2：查询被阻塞，说明console1把表给锁住了

Sql代码   

1. mysql> select * from t_goods where id>1 for update;  



**例5: (主键不明确，table lock)**

console1：

Sql代码   

1. mysql> begin;  
2. Query OK, 0 rows affected  
3.   ​
4. mysql> select * from t_goods where id<>1 for update;  
5. +----+--------+------+  
6. | id | status | name |  
7. +----+--------+------+  
8. |  2 |      1 | 装备 |  
9. +----+--------+------+  
10. 1 row in set  
11.   ​
12. mysql>  

console2：查询被阻塞，说明console1把表给锁住了

Sql代码   

1. mysql> select * from t_goods where id<>2 for update;  

console1：提交事务

Sql代码  

1. mysql> commit;  
2. Query OK, 0 rows affected  

console2：console1事务提交后，console2查询结果正常

Sql代码   

1. mysql> select * from t_goods where id<>2 for update;  
2. +----+--------+------+  
3. | id | status | name |  
4. +----+--------+------+  
5. |  1 |      1 | 道具 |  
6. +----+--------+------+  
7. 1 row in set  
8.   ​
9. mysql>  



以上就是关于数据库主键对MySQL锁级别的影响实例，需要注意的是，除了主键外，使用索引也会影响数据库的锁定级别

 

举例：

我们修改t_goods表，给status字段创建一个索引

修改id为2的数据的status为2，此时表中数据为：

Sql代码   

1. mysql> select * from t_goods;  
2. +----+--------+------+  
3. | id | status | name |  
4. +----+--------+------+  
5. |  1 |      1 | 道具 |  
6. |  2 |      2 | 装备 |  
7. +----+--------+------+  
8. 2 rows in set  
9.   ​
10. mysql>  



**例6: (明确指定索引，并且有此数据，row lock)**

console1：

Sql代码   

1. mysql> select * from t_goods where status=1 for update;  
2. +----+--------+------+  
3. | id | status | name |  
4. +----+--------+------+  
5. |  1 |      1 | 道具 |  
6. +----+--------+------+  
7. 1 row in set  
8.   ​
9. mysql>  

console2：查询status=1的数据时阻塞，超时后返回为空，说明数据被console1锁定了

Sql代码   

1. mysql> select * from t_goods where status=1 for update;  
2. Query OK, -1 rows affected  

console2：查询status=2的数据，能正常查询，说明console1只锁住了行，未锁表

Sql代码   

1. mysql> select * from t_goods where status=2 for update;  
2. +----+--------+------+  
3. | id | status | name |  
4. +----+--------+------+  
5. |  2 |      2 | 装备 |  
6. +----+--------+------+  
7. 1 row in set  
8.   ​
9. mysql>  



**例7: (明确指定索引，若查无此数据，无lock)**

console1：查询status=3的数据，返回空数据

Sql代码   

1. mysql> select * from t_goods where status=3 for update;  
2. Empty set  

console2：查询status=3的数据，返回空数据

Sql代码  

1. mysql> select * from t_goods where status=3 for update;  
2. Empty set  





以上就是关于我对数据库悲观锁的理解和总结，有不对的地方欢迎拍砖，下一次会带来[数据库乐观锁的总结和实践](http://chenzhou123520.iteye.com/blog/1863407)

 

参考资料：

MySQL事务与锁定命令：http://www.docin.com/p-16805970.html

悲观锁：http://www.cnblogs.com/chenwenbiao/archive/2012/06/06/2537508.html 

来源： <http://chenzhou123520.iteye.com/blog/1860954>