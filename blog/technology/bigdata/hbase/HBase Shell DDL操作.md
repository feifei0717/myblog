# HBase Shell DDL操作

DDL(Data Definition Language)是数据库模式定义语言，是用于描述数据库中要存储的现实世界实体的语言，本节内容将执行关于Hbase的DDL操作，包括：数据库表的建立、查看所有表、查表结构、删除列族、删除表等操作。

## 开发环境

------

硬件环境：Centos 6.5 服务器4台（一台为Master节点，三台为Slave节点） 
软件环境：Java 1.7.0_45、Eclipse Juno Service Release 2、hadoop-1.2.1、hbase-0.94.20。

## 1、 一般操作

------

本小节的所有操作均是在HBase伪分布式配置模式下运行的，故需先运行Hadoop集群（如果已启动则不需再启动），再运行HBase，最后进入Hbase Shell模式。

### 1） 准备工作

```
启动Hadoop集群
[hadoop@K-Master hbase]$start-all.sh       #启动hadoop
[hadoop@K-Master hbase]$jps                #查看进程
启动Hbase
[hadoop@K-Master hbase]$ start-hbase.sh        #启动Hbase
[hadoop@K-Master hbase]$jps                #查看进程
进入shell模式
[hadoop@K-Master hbase]$ hbase shell
123456789
```

### 2） 查看HBase服务器状态信息

```
hbase(main):002:0> status
1 servers, 0 dead, 3.0000 average load
123
```

### 3） 查看HBase版本信息

```
hbase(main):002:0> version
0.94.20, r09c60d770f2869ca315910ba0f9a5ee9797b1edc, Fri May 23 22:00:41 PDT 2014
123
```

## 2、 DDL操作

------

使用个人信息为列演示HBase的用法。创建一个user表，其结构如表所示。

这里address和info对于表来说是一个有三个列的列族：address列族由三个列contry、province和city组成；info列族由三个列age、birthday和company组成。当然可以根据需要在address和info中建立更多的列族，如name、telephone等相应的列族加入info列族。

### 1） 创建一个表member

user是表的名字，’user_id’,’address’,’info’分别为user表的三个列族。

```
hbase(main):002:0> create 'user','user_id','address','info'
0 row(s) in 1.4270 seconds
123
```

### 2） 查看所有表

```
hbase(main):002:0> list
TABLE   
test
user
wordcount   
3 row(s) in 0.0950 seconds
1234567
```

### 3） 查看表结构

也可以用desc  'user'

```
hbase(main):002:0> describe 'user'
DESCRIPTION  ENABLED
 'user', {NAME => 'address', DATA_BLOCK_ENCODING =>  true   
 'NONE', BLOOMFILTER => 'NONE', REPLICATION_SCOPE =>
  '0', VERSIONS => '3', COMPRESSION => 'NONE', MIN_V
 ERSIONS => '0', TTL => '2147483647', KEEP_DELETED_C
 ELLS => 'false', BLOCKSIZE => '65536', IN_MEMORY =>
  'false', ENCODE_ON_DISK => 'true', BLOCKCACHE => '
 true'}, {NAME => 'info', DATA_BLOCK_ENCODING => 'NO
 NE', BLOOMFILTER => 'NONE', REPLICATION_SCOPE => '0
 ', VERSIONS => '3', COMPRESSION => 'NONE', MIN_VERS
 IONS => '0', TTL => '2147483647', KEEP_DELETED_CELL
 S => 'false', BLOCKSIZE => '65536', IN_MEMORY => 'f
 alse', ENCODE_ON_DISK => 'true', BLOCKCACHE => 'tru
 e'}, {NAME => 'user_id', DATA_BLOCK_ENCODING => 'NO
 NE', BLOOMFILTER => 'NONE', REPLICATION_SCOPE => '0
 ', VERSIONS => '3', COMPRESSION => 'NONE', MIN_VERS
 IONS => '0', TTL => '2147483647', KEEP_DELETED_CELL
 S => 'false', BLOCKSIZE => '65536', IN_MEMORY => 'f
 alse', ENCODE_ON_DISK => 'true', BLOCKCACHE => 'tru
 e'}
1 row(s) in 0.0950 seconds 
```

### 4） 删除一个列族。

删除一个列族分为三步，第一步disable表，第二步alter表，第三步enable表； 
在第一步创建user表时创建了三个列族，但是发现user_id这个列族是多余的，现在需要将其删除，操作如下：

第一步：disable表

```
hbase(main):008:0> disable 'user'
row(s) in 1.3790 seconds 
```

第二步：alter表

```
hbase(main):010:0> alter 'user',{NAME=>'user_id',METHOD=>'delete'}
Updating all regions with the new schema...
1/1 regions updated.
Done.
0 row(s) in 1.3660 seconds
hbase(main):010:0> describe 'user'
DESCRIPTION  ENABLED
 'user', {NAME => 'address', DATA_BLOCK_ENCODING =>  false  
 'NONE', BLOOMFILTER => 'NONE', REPLICATION_SCOPE =>
  '0', VERSIONS => '3', COMPRESSION => 'NONE', MIN_V
 ERSIONS => '0', TTL => '2147483647', KEEP_DELETED_C
 ELLS => 'false', BLOCKSIZE => '65536', IN_MEMORY =>
  'false', ENCODE_ON_DISK => 'true', BLOCKCACHE => '
 true'}, {NAME => 'info', DATA_BLOCK_ENCODING => 'NO
 NE', BLOOMFILTER => 'NONE', REPLICATION_SCOPE => '0
 ', VERSIONS => '3', COMPRESSION => 'NONE', MIN_VERS
 IONS => '0', TTL => '2147483647', KEEP_DELETED_CELL
 S => 'false', BLOCKSIZE => '65536', IN_MEMORY => 'f
 alse', ENCODE_ON_DISK => 'true', BLOCKCACHE => 'tru
 e'}
1 row(s) in 0.1050 seconds 
```

第二步：enable表

```
hbase(main):010:0> enable 'user'
0 row(s) in 1.3040 seconds 
```

### 5） 删除表

删除一个列族分为两步，第一步disable表，第二步drop表；

第一步：disable表

```
hbase(main):010:0> list
TABLE   
test
user
wordcount   
hbase(main):015:0> disable 'test'
0 row(s) in 1.3530 seconds 
```

第二步：drop表

```
hbase(main):016:0> drop 'test'
0 row(s) in 1.5380 seconds 
```

### 6） 查询表是否存在

```
hbase(main):017:0> exists 'user'
Table user does exist   
0 row(s) in 0.3530 seconds 
```

### 7） 判断表是否enable

```
hbase(main):018:0> is_enabled 'user'
true
0 row(s) in 0.0750 seconds 
```

### 8） 判断表是否disable

```
hbase(main):019:0> is_disabled 'user'
false   
0 row(s) in 0.0600 seconds
```





http://blog.csdn.net/andie_guo/article/details/44086445