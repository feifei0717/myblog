**这是一种悲观锁的例子：**



### **1、Oracle的for update行锁介绍：**

SELECT...FOR UPDATE 语句的语法如下： 
SELECT ... FOR UPDATE [OF column_list][WAIT n|NOWAIT][SKIP LOCKED]; 
其中： 
OF 子句用于指定即将更新的列，即锁定行上的特定列(有待验证)。 
WAIT 子句指定等待其他用户释放锁的秒数，防止无限期的等待。 
“使用FOR UPDATE WAIT”子句的优点如下： 
１防止无限期地等待被锁定的行； 
２允许应用程序中对锁的等待时间进行更多的控制。 
３对于交互式应用程序非常有用，因为这些用户不能等待不确定 
４ 若使用了skip locked，则可以越过锁定的行，不会报告由wait n 引发的‘资源忙’异常报告



示例: 
create table t(a varchar2(20),b varchar2(20)); 
insert into t values('1','1'); 
insert into t values('2','2'); 
insert into t values('3','3'); 
insert into t values('4','4'); 
现在执行如下操作： 
在plsql develope中打开两个sql窗口， 
在1窗口中运行sql 
select * from t where a='1' for update; 
在2窗口中运行sql1 
\1. select * from t where a='1'; 这一点问题也没有，因为行级锁不会影响纯粹的select语句 
再运行sql2 
\2. select * from t where a='1' for update; 则这一句sql在执行时，永远处于等待状态，除非窗口1中sql被提交或回滚。 
如何才能让sql2不等待或等待指定的时间呢？ 我们再运行sql3 
\3. select * from t where a='1' for update nowait; 则在执行此sql时，直接报资源忙的异常。 
若执行 select * from t where a='1' for update wait 6; 则在等待6秒后，报 资源忙的异常。 
如果我们执行sql4 
\4. select * from t where a='1' for update nowait skip Locked; 则执行sql时，即不等待，也不报资源忙异常。 
现在我们看看执行如下操作将会发生什么呢？ 
在窗口1中执行： 
select * from t where rownum<=3 nowait skip Locked; 
在窗口2中执行： 
select * from t where rownum<=6 nowait skip Locked; 
select for update 也就如此了吧，insert、update、delete操作默认加行级锁，其原理和操作与select for update并无两样。 
**select for update of，这个of子句在牵连到多个表时，具有较大作用，如不使用of指定锁定的表的列，则所有表的相关行均被锁定，若在of中指定了需修改的列，则只有与这些列相关的表的行才会被锁定。**

### **2、for update 和 for update nowait 的区别：**

 首先一点，如果只是select 的话，Oracle是不会加任何锁的，也就是Oracle对 select 读到的数据不会有任何限制，虽然这时候有可能另外一个进程正在修改表中的数据，并且修改的结果可能影响到你目前select语句的结果，但是因为没有锁，所以select结果为当前时刻表中记录的状态。

 如果加入了for update， 则Oracle一旦发现（符合查询条件的）这批数据正在被修改，则不会发出该select语句查询，直到数据被修改结束（被commit），马上自动执行这个select语句。

 同样，如果该查询语句发出后，有人需要修改这批数据（中的一条或几条），它也必须等到查询结束后（commit）后，才能修改。

for update nowait和 for update 都会对所查询到得结果集进行加锁，所不同的是，如果另外一个线程正在修改结果集中的数据，for update nowait 不会进行资源等待，只要发现结果集中有些数据被加锁，立刻返回 “ORA-00054错误，内容是资源正忙, 但指定以 NOWAIT 方式获取资源”。

for update 和 for update nowait 加上的是一个行级锁，也就是只有符合where条件的数据被加锁。如果仅仅用update语句来更改数据时，可能会因为加不上锁而没有响应地、莫名其妙地等待，但如果在此之前，for  update NOWAIT语句将要更改的数据试探性地加锁，就可以通过立即返回的错误提示而明白其中的道理，或许这就是For Update和NOWAIT的意义之所在。

 经过测试，以for update 或 for update nowait方式进行查询加锁，在select的结果集中，只要有任何一个记录在加锁，则整个结果集都在等待系统资源（如果是nowait，则抛出相应的异常）

 

### **3、for update nowait 与 for update 的目的**: 

锁定表的所有行，排斥其他针对这个表的写操作。确保只有当前事务对指定表进行写操作。

for update nowait

和

 for update

的区别：

别的事务要对这个表进行写操作时，是等待一段时间还是马上就被数据库系统拒绝而返回.制定采用nowait方式来进行检索，所以当发现数据被别的session锁定中的时候，就会迅速返回ORA-00054错误，内容是资源正忙, 但指定以 NOWAIT 方式获取资源。所以在程序中我们可以采用nowait方式迅速判断当前数据是否被锁定中，如果锁定中的话，就要采取相应的业务措施进行处理。 
如何理解上面的话. 
开启一会话 (就是开一个sqlwindow) 
  select  empno,ename from emp where empno='7369' for update nowait ; 
得到下面结果集: 
​    empno  ename 
​    7369    smith 
开启另一会话 
  select  empno,ename from emp where empno='7369' for update nowait ; 
返回RA-00054错误，内容是资源正忙, 但指定以 NOWAIT 方式获取资源 
上面会话都提交commit; 
\~~~~~~~~~~~~~~~~~~~~~ 
开启一会话, 
  select  empno,ename from emp where empno='7369' for update ; 
得到下面结果集: 
​    empno  ename 
​    7369    smith 
开启另一会话 
  select  empno,ename from emp where empno='7369' for update;

阻塞，不返回错误。 
提交第一个会话，第二个回话自动执行 
提交第二个会话 
\~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ 
   for update: 当第一个session最后commit或者rollback之后，第二个session中的检索结果就是自动跳出来，并且也把数据锁定住. 
  开启一会话： 
​     select empno,ename from emp   where empno="7369" for update； 
得到下面结果集: 
​    empno  ename 
​    7369    smith 
开启另一个会话， 
   update emp set ename='ALLEN'  where empno="7396"; 
阻塞。 
  提交第一个会话，update 语句执行 
再开启一会话 
​    update emp set ename="SMITH" where empno='7396'; 
同样阻塞，虽然第一个会话因为提交而释放了锁，但是第二个会话中的update 又给这一行加锁了; 
for update nowait:当你第一个session放开锁定以后,第二个session才能正常运行。当你第二个session语句运行后，数据又被你第二个session语句锁定住了，这个时候只要你第二个session语句后还没有commit，别的session照样不能对数据进行锁定更新等等。

对比区别： 
select * from TTable1 for update 锁定表的所有行，只能读不能写 
2  select * from TTable1 where pkid = 1 for update 只锁定pkid=1的行 
3  select * from Table1 a join Table2 b on a.pkid=b.pkid for update 锁定两个表的所有记录 
4 select * from Table1 a join Table2 b on a.pkid=b.pkid where a.pkid = 10 for update 锁定两个表的中满足条件的行 
\5. select * from Table1 a join Table2 b on a.pkid=b.pkid where a.pkid = 10 for update of a.pkid 只锁定Table1中满足条件的行 
for update 是把所有的表都锁点 for update of 根据of 后表的条件锁定相对应的表 
\----------- 
**关于NOWAIT(如果一定要用FOR UPDATE，我更建议加上NOWAIT)** 
当有LOCK冲突时会提示错误并结束STATEMENT而不是在那里等待(比如:要查的行已经被其它事务锁了,当前的锁事务与之冲突,加上nowait,当前的事务会结束会提示错误并立即结束 STATEMENT而不再等待). 
如果加了for update后 该语句用来锁定特定的行（如果有where子句，就是满足where条件的那些行）。当这些行被锁定后，其他会话可以选择这些行，但不能更改或删除这些行，直到该语句的事务被commit语句或rollback语句结束为止。 
因为FOR   UPDATE子句获得了锁，所以COMMIT将释放这些锁。当锁释放了，该游标就无效了。 
就是这些区别了 
**关于oracle中的select...for update of columns** 
问题，如下：select * from emp where empno = 7369 for update; 会对表中员工编号为7369的记录进行上锁。其他用户无法对该记录进行操作，只能查询。select * from emp where empno = 7369 for update of sal; 这条语句是不是意味着只对表中的7369 这一行的sal字段的数据进行了上锁，其他数据则可以被其他用户做更新操作呢。学员测试结果为二条语句的效果是一样的。其他用户对整行都无法更新，那么是不是意味着 for update of columns这句没有什么意义呢？

  这个问题估计很多玩ORACLE的同学们都没有去思考过【网上相关的帖子不多】。现在将其功能讲解一下。

  从单独一张表的操作来看，上面二条语句的效果确实是相同的。但是如果涉及到多表操作的时候 for update of columns就起到了非常大的作用了。现假定有二个用户，scott和mm。

scott执行语句：select * from emp e,dept d where e.deptno = d.deptno for update; --对二张表都进行了整表锁定 
mm执行语句：select * from scott.dept for update wait 3; --试图锁定scott用户的dept表

结果是： 
ERROR 位于第 1 行: 
ORA-30006: 资源已被占用; 执行操作时出现 WAIT 超时

现在，scott用户先进行解锁rollback,再在for update语句后面加上of columns，进行测试

scott执行语句：select * from emp e,dept d where e.deptno = d.deptno for update of sal ; 
mm执行语句：select * from scott.dept for update wait 3;

结果是： 
成功锁定了dept表的数据.

mm再次执行语句：select * from scott.emp for update wait 3;

结果是： 
ERROR 位于第 1 行: 
ORA-30006: 资源已被占用; 执行操作时出现 WAIT 超时

通过这段代码案例，我们可以得到结论，**for update of columns 用在多表连接锁定时，可以指定要锁定的是哪几张表，而如果表中的列没有在for update of 后面出现的话，就意味着这张表其实并没有被锁定，其他用户是可以对这些表的数据进行update操作的。这种情况经常会出现在用户对带有连接查询的视图进行操作场景下。用户只锁定相关表的数据，其他用户仍然可以对视图中其他原始表的数据来进行操作。** 

来源： <http://www.cnblogs.com/quanweiru/archive/2012/11/09/2762223.html>