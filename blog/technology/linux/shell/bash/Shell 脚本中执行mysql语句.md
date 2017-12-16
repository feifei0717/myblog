# Shell 脚本中执行mysql语句

分类: linux
日期: 2015-06-26

原文地址: 

http://blog.chinaunix.net/uid-29632145-id-5098307.html

------

****[Shell 脚本中执行mysql语句]() *2015-06-26 17:52:01*

分类： LINUX

 对于自动化运维，诸如备份恢复之类的，DBA经常需要将SQL语句封装到shell脚本。本文描述了在Linux环境下mysql数据库中，shell脚本下调用sql语句的几种方法，供大家参考。对于脚本输出的结果美化，需要进一步完善和调整。以下为具体的示例及其方法。

 

## 1、将SQL语句直接嵌入到shell脚本文件中

```
--演示环境  
[root@SZDB ~]# more /etc/issue  
CentOS release 5.9 (Final)  
Kernel \r on an \m  
  
root@localhost[(none)]> show variables like 'version';  
+---------------+------------+  
| Variable_name | Value      |  
+---------------+------------+  
| version       | 5.6.12-log |  
+---------------+------------+  
  
[root@SZDB ~]# more shell_call_sql1.sh   
#!/bin/bash  
# Define log  
TIMESTAMP=`date +%Y%m%d%H%M%S`  
LOG=call_sql_${TIMESTAMP}.log  
echo "Start execute sql statement at `date`." >>${LOG}  
  
# execute sql stat  
mysql -uroot -p123456 -e "  
tee /tmp/temp.log  
drop database if exists tempdb;  
create database tempdb;  
use tempdb  
create table if not exists tb_tmp(id smallint,val varchar(20));  
insert into tb_tmp values (1,'jack'),(2,'robin'),(3,'mark');  
select * from tb_tmp;  
notee  
quit"  
  
echo -e "\n">>${LOG}  
echo "below is output result.">>${LOG}  
cat /tmp/temp.log>>${LOG}  
echo "script executed successful.">>${LOG}  
exit;  
  
[root@SZDB ~]# ./shell_call_sql1.sh   
Logging to file '/tmp/temp.log'  
+------+-------+  
| id   | val   |  
+------+-------+  
|    1 | jack  |  
|    2 | robin |  
|    3 | mark  |  
+------+-------+  
Outfile disabled.  
--Author : Leshami  
--Blog   : http://blog.csdn.net/leshami  
```

## 2、命令行调用单独的SQL文件

```
[root@SZDB ~]# more temp.sql   
tee /tmp/temp.log  
drop database if exists tempdb;  
create database tempdb;  
use tempdb  
create table if not exists tb_tmp(id smallint,val varchar(20));  
insert into tb_tmp values (1,'jack'),(2,'robin'),(3,'mark');  
select * from tb_tmp;  
notee  
  
[root@SZDB ~]# mysql -uroot -p123456 -e "source /root/temp.sql"  
Logging to file '/tmp/temp.log'  
+------+-------+  
| id   | val   |  
+------+-------+  
|    1 | jack  |  
|    2 | robin |  
|    3 | mark  |  
+------+-------+  
Outfile disabled.  
```



## 3、使用管道符调用SQL文件

```
[root@SZDB ~]# mysql -uroot -p123456 </root/temp.sql  
Logging to file '/tmp/temp.log'  
id      val  
1       jack  
2       robin  
3       mark  
Outfile disabled.  
  
#使用管道符调用SQL文件以及输出日志  
[root@SZDB ~]# mysql -uroot -p123456 </root/temp.sql >/tmp/temp.log  
[root@SZDB ~]# more /tmp/temp.log  
Logging to file '/tmp/temp.log'  
id      val  
1       jack  
2       robin  
3       mark  
Outfile disabled. 
```

## 4、shell脚本中MySQL提示符下调用SQL

```
[root@SZDB ~]# more shell_call_sql2.sh  
#!/bin/bash  
mysql -uroot -p123456 <<EOF  
source /root/temp.sql;  
select current_date();  
delete from tempdb.tb_tmp where id=3;  
select * from tempdb.tb_tmp where id=2;  
EOF  
exit;  
[root@SZDB ~]# ./shell_call_sql2.sh  
Logging to file '/tmp/temp.log'  
id      val  
1       jack  
2       robin  
3       mark  
Outfile disabled.  
current_date()  
2014-10-14  
id      val  
2       robin  
```



## 5、shell脚本中变量输入与输出

```
[root@SZDB ~]# more shell_call_sql3.sh  
#!/bin/bash  
cmd="select count(*) from tempdb.tb_tmp"  
cnt=$(mysql -uroot -p123456 -s -e "${cmd}")  
echo "Current count is : ${cnt}"  
exit   
[root@SZDB ~]# ./shell_call_sql3.sh   
Warning: Using a password on the command line interface can be insecure.  
Current count is : 3  
  
[root@SZDB ~]# echo "select count(*) from tempdb.tb_tmp"|mysql -uroot -p123456 -s  
3  
  
[root@SZDB ~]# more shell_call_sql4.sh  
#!/bin/bash  
id=1  
cmd="select count(*) from tempdb.tb_tmp where id=${id}"  
cnt=$(mysql -uroot -p123456 -s -e "${cmd}")  
echo "Current count is : ${cnt}"  
exit   
  
[root@SZDB ~]# ./shell_call_sql4.sh   
Current count is : 1  
```



以上脚本演示中，作抛砖引玉只用，对于输出的结果不是很规整友好，需要进一步改善和提高。