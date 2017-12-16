# oracle导入导出工具exp_imp 命令使用解析 



oracle导入导出工具exp/imp 在dos，或命令行


一、exp/imp简介
exp/imp是oracle幸存的最古老的两个命令行备份工具 ，在小型数据库的转储、表空间的迁移、表的抽取、检测逻辑和物理冲突中使用非常广泛，我们可以把它作为小型数据库的物理备份后的一个逻辑备份。它可以跨平台、跨版本。


二、exp/imp工作原理：
        exp用户进程通过服务器进程连接到数据库，开启shadow进程，同时执行select语句查询数据库中的数据，通过buffer cache并通过SQL语句处理层再转移出exp导出文件，即exp进程需要占用服务器上的SGA和PGA资源。
        imp读取exp导出的.dmp文件，构造DDL语句，插入创建表与其他对象以及添加数据的语句。 


三、exp导出数据
        exp 导出数据的方式




全库导出
按用户导出
按表导出


1、查看exp 参数
[oracle@honey lost+found]$  exp help=y




2、全库导出
[oracle@honey lost+found]$  exp system/systempassword@orcl  full=y  file=/home/lost+found/full.dmp
3、按用户导出
[oracle@honey lost+found]$  exp system/systempassword@orcl  owner=olap  file=/home/lost+found/olap.dmp
4、按表导出
[oracle@honey lost+found]$  exp system/systempassword@orcl   tables=olap.D_TF_DATA_M4,olap.TB_TEST_1  file=/home/lost+found/olap_table_schem.dmp
5、只导出表结构不导出数据
[oracle@honey lost+found]$  exp system/systempassword@orcl   owner=olap  rows=n  file=/home/lost+found/olap_tables_nodata.dmp
6、exp工具的缺点




        速度慢，由于exp连接到数据库需要先select要导出的数据，再通过SGA、PGA传输给exp。
        如果此连接断开，则exp需从头开始导出，没有断点续传的功能。
        消耗服务端资源，只能服务端业务的前提下使用。


四、imp导入数据
1、查看imp参数
[oracle@honey lost+found]$  imp help=y


2、按用户导入
[oracle@honey lost+found]$  imp system/systempassword@orcl001   fromuser=olap  touser=user001  ignore=y  file=/home/lost+found/olap.dmp
注意：要确认touser=user001 这个oracle用户user001是否存在。
简言之就是：导入数据前需要在目标数据库中创建对应的用户，并给用户相应的权限和用户在自己默认表空间上的配额。
3、按表导入：
[oracle@honey lost+found]$  imp system/systempassword@orcl001  tables=tab1  fromuser=olap,user001  touser=user001,user001  ignore=y  file=/home/lost+found/olap1.dmp


自己用：
按用户导入导出
exp hnsjx/hnsjx@ORCL_vmware_rhel   owner=hnsjx  log= d:\exp_log  file=E:\successful.dmp

imp hnsjx/hnsjx@ORCL_vmware_rhel   fromuser=hnsjx  touser=hnsjx  ignore=y  log= d:\imp_log  file=e:\hnsjx_all.dmp


参考：http://chunke.blog.51cto.com/2753715/1219686