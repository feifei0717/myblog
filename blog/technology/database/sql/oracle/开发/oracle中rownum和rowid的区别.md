ownum和rowid都是伪列，但是两者的根本是不同的，rownum是根据sql查询出的结果给每行分配一个逻辑编号，所以你的sql不同也就会导致最终rownum不同，但是rowid是物理结构上的，在每条记录insert到数据库中时，都会有一个唯一的物理记录 ，

例如  AAAMgzAAEAAAAAgAAB 7499 ALLEN SALESMAN 7698 1981/2/20 1600.00 300.00 30

这里的AAAMgzAAEAAAAAgAAB物理位置对应了这条记录，这个记录是不会随着sql的改变而改变。

因此，这就导致了他们的使用场景不同了，通常在sql分页时或是查找某一范围内的记录时，我们会使用rownum。

**1、rownum**

例如：

查找2到10范围内的记录（这里包括2和10的记录）

select *

  from (select rownum rn, a.* from emp a) t

where t.rn between 2 and 10;

查找前三名的记录

select * from emp a where rownum < 3；这里我们要注意，直接用rownum查找的范围必须要包含1；因为rownum是从1开始记录的，当然你可以把rownum查出来后放在一个虚表中作为这个虚表的字段再根据条件查询。

例如：

select *

  from (select rownum rn, a.* from emp a) t

where t.rn > 2;这就可以了

**2、rowid**

我们在处理一张表中重复记录时经常用到他，当然你也可以用一个很原始的方法，就是将有重复记录的表中的数据导到另外一张表中，最后再倒回去。

SQL>create table stu_tmp as select distinct* from stu;

SQL>truncate table sut;        //清空表记录

SQL>insert into stu select * from stu_tmp;    //将临时表中的数据添加回原表但是要是stu的表数据是百万级或是更大的千万级的，那这样的方法显然是不明智的，因此我们可以根据rowid来处理，rowid具有唯一性，查询时效率是很高的，

例如，学生表中的姓名会有重复的情况，但是学生的学号是不会重复的，如果我们要删除学生表中姓名重复只留学号最大的学生的记录，怎么办呢？

delete from stu a

​    where rowid not  in (select max(rowid)

​                          from stu b

​                         where a.name = b.name

​                           and a.stno < b.stno);

这样就可以了。

来源： <<http://blog.csdn.net/wonder1053/article/details/7268620>>

 