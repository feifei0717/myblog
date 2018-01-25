事务就是一个逻辑工作单元的一系列步骤。事务是用来保证数据操作的安全性

## 事务的特征**:**

Atomicity**(**原子性**)**

Consistency**(**稳定性**,**一致性**)**

Isolation**(**隔离性**)**

Durability**(**可靠性**)**

【事务只针对对数据数据产生影响的语句有效】

 

show engines  //查看mysql锁支持的数据引擎

MyISAM不支持事物，InnoDB支持事物

默认情况下，MySQL将以自动提交模式运行，这意味着没一条小命令都将当做一个只有一条命令的事物来执行。

 

如果要让mysql支持支持事务，只需要修改数据引擎（alter table person type**=**INNODB）

使用start transaction或者begin命令来开启一个事物**,**使用commit**,**或者rollback来结束事物。

事物的结束：事物除了commit**,**rollback会结束外**,**使用DDL或者DCL语句也会结束。

保存点：通过保存点机制**:**用户可以在事物里用savepoint name命令设置一些保存点**,**以后用户在使用rollback to savepoint name结束事物时，name之前的数据保存，之后的数据不保存。

 

## mysql使用事务的关键字

1.begin  //打开一个事务

2.commit //提交到数据库

3.rollback //取消操作

4.savepoint //保存，部分取消，部分提交

 

alter table person type**=**INNODB      //修改数据引擎

## 简单示例

示例：

begin

update person set  name**=**'efgh' where id **=**10

select  *****  from person

rollback

select  *****  from person

 

示例：

alter table person type**=**INNODB

begin

update person set  name**=**'efgh' where id **=**10

select  *****  from person

commit

select  *****  from person

 

begin

delete from person where id**=**21

update person set  name**=**'efgh' where id **=**10

commit**/**rollback

针对上面部分提交，必须用到保存点

## 事务保存点使用示例

保存点注意：

1.只能取消到某个保存点  rollback  to savepoint p1

2.不能提交某个保存  commit to savepoint p2//错误写法

3.最后commit  把未取消的保存点去不提交到数据

 

事务保存点使用例子

1. begin**;**

2. update score set score**=**40 where scoreid**=**1**;**

3. savepoint s1**;**

4. update score set score**=**50 where scoreid**=**2**;**

5. select ***** from score**;**

6. rollback to savepoint s1**;**

7. select ***** from score**;**

8. commit；

来源： <http://blog.chinaunix.net/uid-24219701-id-1746744.html>w