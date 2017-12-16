利用ORACLE的闪回功能恢复数据

分类: database
日期: 2014-09-10

 

http://blog.chinaunix.net/uid-29632145-id-4464794.html

------

****[利用ORACLE的闪回功能恢复数据]() *2014-09-10 19:13:31*

分类： Oracle

利用ORACLE的闪回功能恢复数据

一、 闪回表数据
​    从9i开始，Oracle提供了闪回（FLASHBACK）功能。使用FLASHBACK TABLE语句从撤消段中（undo segment）读取该表的过去映像，并利用Oracle9i中引入的回闪查询重建表行。UNDO_RETENTION给出了闪回支持的最小时间。也就是说，FLASHBACK最少可以支持UNDO_RETENTION给出的时间，如果系统比较闲，则可以闪回更长的时间。（当然，如果回滚表空间的空间分配不足，当系统处于忙时，有可能重用还没有达到UNDO_RETENTION时间限制的数据的空间）。使用闪回的一个前提是表不能进行DDL操作。不但不能对DDL操作进行回闪，而且，也无法闪回到DDL操作以前的数据了。
SQL> select * from v$version;
BANNER
\----------------------------------------------------------------
Oracle Database 10g Enterprise Edition Release 10.2.0.1.0 - Prod
PL/SQL Release 10.2.0.1.0 - Production
CORE    10.2.0.1.0      Production
TNS for 32-bit Windows: Version 10.2.0.1.0 - Production
NLSRTL Version 10.2.0.1.0 – Production

 

--获得系统变更号
C:\Documents and Settings\linyuefeng>sqlplus /nolog
SQL*Plus: Release 10.2.0.1.0 - Production on 星期四 10月 26 20:41:28 2006
Copyright (c) 1982, 2005, Oracle.  All rights reserved.
SQL> conn [scott/scott@ora10g](mailto:scott/scott@ora10g);
已连接。

SQL> var scn number
SQL> exec :scn :=dbms_flashback.get_system_change_number
PL/SQL 过程已成功完成。

SQL> print scn
​       SCN
\----------
914958

SQL> select count(*) from emp;
  COUNT(*)
\----------
​        14

SQL> delete from emp;
已删除14行。

SQL> select count(*) from emp;
  COUNT(*)
\----------
​         0

SQL> commit;
提交完成。

SQL> select count(*) from emp as of scn :scn;
  COUNT(*)
\----------
​        14

SQL> flashback table emp to scn :scn;
flashback table emp to scn :scn
​                *
第 1 行出现错误:
ORA-08189: 因为未启用行移动功能, 不能闪回表

SQL> alter table emp enable row movement;
表已更改。

​    这个命令的作用就是允许ORACLE修改分配给行的rowid。在ORACLE中，插入一行时就会为它分配一个rowid，而且这一行永远拥有这个rowid。闪回表处理时会对EMP表完成DELETE 操作，并且重新插入行，这样就会为这些行分配一个新的rowid。要支持闪回功能就必须允许ORACLE执行这个操作。

SQL> flashback table emp to scn :scn;
闪回完成。

SQL> select count(*) from emp;
  COUNT(*)
\----------
​        14

---也可以通过时间进行闪回
SQL> select to_char(sysdate,'yyyy-mm-dd hh24:mi:ss')  TIME from dual;
TIME
\-------------------
2006-10-26 20:55:48

SQL> select count(*) from emp;
  COUNT(*)
\----------
​        14

SQL> delete from emp;
已删除14行。

SQL> commit;
提交完成。

SQL> flashback table emp to timestamp to_date('2006-10-26 20:55:48','yyyy-mm-dd
hh24:mi:ss');
闪回完成。

SQL> select count(*) from emp;
  COUNT(*)
\----------
​        14

二、 闪回删除的表
​    flashback drop特性从Oracle10g开始才有的，这个新特性，允许你从当前数据库中恢复一个被drop了的对象。在执行drop操作时，现在Oracle不是真正删除它，而是将该对象自动将放入回收站（一个虚拟的容器，用于存放所有被删除的对象）。对于一个对象的删除，ORACLE的操作仅仅就是简单的重令名而已。
​    在回收站中，被删除的对象将占用创建时的同样的空间，可以利用flashback功能来恢复它， 这个就是flashback drop功能。

SQL> create table emp_test as select * from emp;
Table created

SQL> drop table emp_test;
Table dropped

​    当一个表被删除并移动到"回收站"中，它的名字要进行一些转换。这样的目的显而易见是为了避免同类对象名称的重复。

SQL> select owner,object_name,original_name,DROPTIME from dba_recyclebin order by droptime;
OWNER  OBJECT_NAME                       ORIGINAL_NAME      DROPTIME
------------------------------ ------------------------------
SCOTT   BIN$rtpdTNe6SIysmO+ZB0t3aQ==$0    EMP_TEST          2006-10-26:22:23:06

SQL> create table emp_test as select * from emp;
Table created

SQL> drop table emp_test;
Table dropped

SQL> select owner,object_name,original_name, DROPTIME from dba_recyclebin order by droptime;
OWNER  OBJECT_NAME                     ORIGINAL_NAME   DROPTIME
------------------------------ ------------------------------
SCOTT  BIN$rtpdTNe6SIysmO+ZB0t3aQ==$0  EMP_TEST        2006-10-26:22:23:06
SCOTT  BIN$roQhkx6tQneThvaRlsjrhw==$0  EMP_TEST        2006-10-26:22:23:50

--使用flashback table 进行恢复,默认恢复最近删除的表
SQL> flashback table emp_test to before drop;
Done

SQL> select owner,object_name,original_name,DROPTIME from dba_recyclebin order by droptime;
OWNER   OBJECT_NAME                      ORIGINAL_NAME   DROPTIME
------------------------------ ------------------------------
SCOTT   BIN$rtpdTNe6SIysmO+ZB0t3aQ==$0   EMP_TEST        2006-10-26:22:23:06

--也可以指定表名进行恢复
SQL> flashback table "BIN$rtpdTNe6SIysmO+ZB0t3aQ==$0" to before drop;
flashback table "BIN$rtpdTNe6SIysmO+ZB0t3aQ==$0" to before drop
ORA-38312: 原始名称已被现有对象使用

​    此时被恢复的表名称仍然采用以前的名字，我们之前已经恢复一次EMP_TEST,所以现在恢复就出现了重名，不过可以为其指定新的名字。
SQL> flashback table "BIN$rtpdTNe6SIysmO+ZB0t3aQ==$0" to before drop rename to emp_test2;
Done

SQL> select table_name from user_tables where table_name like '%EMP_TEST%';
TABLE_NAME
\------------------------------
EMP_TEST
EMP_TEST2

--删除回收站里的对象，不能使用DROP命令进行删除，必须使用PURGE命令
SQL> drop table emp_test;
Table dropped

SQL> drop table emp_test2;
Table dropped

SQL> select owner,object_name,original_name,DROPTIME from dba_recyclebin order by droptime;
OWNER   OBJECT_NAME                      ORIGINAL_NAME    DROPTIME
------------------------------ ------------------------------
SCOTT   BIN$M4Q0Pb94SOWSFGarOpI5Og==$0   EMP_TEST         2006-10-26:22:46:07
SCOTT   BIN$7P+osQdjSs+5CcSXBc0NAA==$0   EMP_TEST2        2006-10-26:22:46:10

SQL> drop table "BIN$M4Q0Pb94SOWSFGarOpI5Og==$0";
drop table "BIN$M4Q0Pb94SOWSFGarOpI5Og==$0"
ORA-38301: 无法对回收站中的对象执行 DDL/DML

SQL> purge table "BIN$M4Q0Pb94SOWSFGarOpI5Og==$0";
Done

SQL> select owner,object_name,original_name,DROPTIME from dba_recyclebin order by droptime;
OWNER    OBJECT_NAME                     ORIGINAL_NAME    DROPTIME
------------------------------ ------------------------------
SCOTT    BIN$7P+osQdjSs+5CcSXBc0NAA==$0  EMP_TEST2        2006-10-26:22:46:10

--删除整个回收站里的对象
SQL> purge recyclebin;
Done

SQL> select owner,object_name,original_name,DROPTIME from dba_recyclebin order by droptime;
OWNER    OBJECT_NAME                     ORIGINAL_NAME    DROPTIME
------------------------------ ------------------------------
未选定行

 