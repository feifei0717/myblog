Oracle11g使用exp导出空表

分类: database
日期: 2014-05-09

 

http://blog.chinaunix.net/uid-29632145-id-4246105.html

------

****[Oracle11g使用exp导出空表 ]()*2014-05-09 22:52:17*

分类： Oracle

1、Oracle11g默认对空表不分配segment，故使用exp导出Oracle11g数据库时，空表不会导出。

2、设置deferred_segment_creation 参数为FALSE后，无论是空表还是非空表，都分配segment。

在sqlplus中，执行如下命令：

SQL>alter system set deferred_segment_creation=false;

查看：
   SQL>show parameter deferred_segment_creation;

   该值设置后只对后面新增的表产生作用，对之前建立的空表不起作用。

3、可以使用手工为空表分配Extent的方式，来解决导出之前建立的空表的问题。说明如下：

3.1 使用ALLOCATE EXTENT的说明

   使用ALLOCATE EXTENT可以为数据库对象分配Extent。其语法如下：

\-----------
   ALLOCATE EXTENT { SIZE integer [K | M] | DATAFILE 'filename' | INSTANCE integer }
   -----------

可以针对数据表、索引、物化视图等手工分配Extent。

ALLOCATE EXTENT使用样例:
​    ALLOCATE EXTENT 
​    ALLOCATE EXTENT(SIZE integer [K | M]) 
​    ALLOCATE EXTENT(DATAFILE 'filename') 
​    ALLOCATE EXTENT(INSTANCE integer) 
​    ALLOCATE EXTENT(SIZE integer [K | M]   DATAFILE 'filename') 
​    ALLOCATE EXTENT(SIZE integer [K | M]   INSTANCE integer) 

针对数据表操作的完整语法如下：

\-----------
​    ALTER TABLE [schema.]table_name ALLOCATE EXTENT [({ SIZE integer [K | M] | DATAFILE 'filename' | INSTANCE integer})]
   -----------

​    故，需要构建如下样子简单的SQL命令：

\-----------
   alter table aTabelName allocate extent
   -----------

3.2 构建对空表分配空间的SQL命令，

​    查询当前用户下的所有空表（一个用户最好对应一个默认表空间）。命令如下：

\-----------
   SQL>select table_name from user_tables where NUM_ROWS=0;
   -----------

   根据上述查询，可以构建针对空表分配空间的命令语句，如下：

\-----------
   SQL>Select 'alter table '||table_name||' allocate extent;' from user_tables where num_rows=0
   -----------

   批量输出上述生成的SQL语句，建立C:\createsql.sql，其内容如下：

\-----------
   set heading off;
   set echo off;
   set feedback off;
   set termout on;
   spool C:\allocate.sql;
   Select 'alter table '||table_name||' allocate extent;' from user_tables where num_rows=0;
   spool off;
   -----------

   执行C:\createsql.sql，命令如下：
   -----------
   SQL>@ C:\createsql.sql;
   -----------

执行完毕后，得到C:\allocate.sql文件。

打开该文件会看到，已经得到对所有空表分配空间的命令SQL语句。

3.4 执行SQL命令，对空表分配空间：

执行C:\allocate.sql，命令如下：
   -----------
   SQL>@ C:\allocate.sql;
   -----------
   执行完毕，表已更改。

3.4 此时执行exp命令，即可把包括空表在内的所有表，正常导出。

另外：Oracle11g中，对密码是大小写敏感的，即密码中的字母是区分大小写的。

在Oracle10g中及以前，密码中的字母大小写无所谓。

[－完－]