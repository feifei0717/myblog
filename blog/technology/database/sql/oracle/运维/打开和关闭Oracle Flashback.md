# 打开和关闭Oracle Flashback

分类: database
日期: 2014-09-10

原文地址: 

http://blog.chinaunix.net/uid-29632145-id-4464797.html

------

****[打开和关闭Oracle Flashback]() *2014-09-10 19:15:34*

分类： Oracle

1、打开flashback：

关闭数据库

> SQL>shutdown immediate;

启动到mount方式

> SQL>startup mount;

如果归档没有打开，打开归档[因为flashback依赖Media recovery,所以在打开flashback之前必须先启用归档]

> SQL>alter database archivelog;

打开闪回

> SQL> alter database flashback on;

 

2、关闭flashback：

关闭数据库：

> SQL>shutdown immediate

启动到mount方式

> SQL>startup mount;

关闭闪回

> SQL> alter database flashback off;

 

关于[Oracle](http://www.linuxidc.com/topicnews.aspx?tid=12)闪回的打开和关闭，主要就是需要注意以下几点：

1、闪开打开的前提是数据库归档必须打开

2、闪回打开/关闭和归档打开/关闭一样，都是在mount模式下

3、如果要在打开闪回的数据库上关闭归档则必须先关闭依赖于归档的闪回功能

查看flashback是否开启：select name,flashback_on from v$database; 查看闪回恢复区及大小是否设置：show parameter db_recovery； 先设置闪回恢复区的大小：alter system set db_recovery_file_dest_size='2G'; 再设置闪回恢复区路径：alter system set db_recovery_file_dest='E:\oracle\product\10.2.0\db_recovery_file_dest'; 设置数据库回退的时间，默认1440分钟为一天时间：alter system set db_flashback_retention_target = 1440；