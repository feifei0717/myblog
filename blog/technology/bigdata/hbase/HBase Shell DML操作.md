# HBase Shell DML操作

DML（Data Manipulation Language）是数据操纵语言，用户通过它可以实现对数据库的基本操作。例如，对表中数据的查询、插入、删除和修改。 在DML中，应用程序可以对数据库作插，删，改，排，检等五种操作。本节将针对Hbase数据库执行如下DML操作，包括：添加记录、查看记录、查看表中的记录总数，删除记录、删除一张表、查看某个列族的所有记录等。 


## 开发环境

------

硬件环境：Centos 6.5 服务器4台（一台为Master节点，三台为Slave节点） 
软件环境：Java 1.7.0_45、Eclipse Juno Service Release 2、hadoop-1.2.1、hbase-0.94.20。

## 1、 向表user插入记录

------

1) 向user表的行键andieguo的info列族成员：age、birthday、compay分别添加数据

```
# 语法：put <table>,<rowkey>,<family:column>,<value>,<timestamp>
# 例如：给表user的添加一行记录：<rowkey>是'andieguo'，<family:column>是'info:age'，value是'27'，timestamp：系统默认
hbase(main):021:0> put 'user','andieguo','info:age','27'
hbase(main):022:0> put 'user','andieguo','info:birthday','1989-09-01'
hbase(main):026:0> put 'user','andieguo','info:company','zonesion' 
```

2) 向user表的行键andieguo的address列族成员：contry、province、city分别添加数据

```
# 语法：put <table>,<rowkey>,<family:column>,<value>,<timestamp>
# 例如：给表user的添加一行记录：<rowkey>是'andieguo'，<family:column>是'address:contry',value是'china'，timestamp：系统默认
hbase(main):028:0> put 'user','andieguo','address:contry','china'
hbase(main):029:0> put 'user','andieguo','address:province','wuhan'
hbase(main):030:0> put 'user','andieguo','address:city','wuhan' 
```

## 2、 获取一条记录

------

1) 获取一个ID的所有记录

```
# 语法：get <table>,<rowkey>,[<family:column>,....]
# 例如：查询<table>为'user'，<rowkey>为'andieguo'下的所有记录
hbase(main):031:0> get 'user','andieguo'
COLUMNCELL  
 address:city timestamp=1409303693005, value=wuhan  
 address:contry   timestamp=1409303656326, value=china  
 address:province timestamp=1409303678219, value=wuhan  
 info:age timestamp=1409303518077, value=27 
 info:birthdaytimestamp=1409303557859, value=1989-09-01 
 info:company timestamp=1409303628168, value=zonesion   
6 row(s) in 0.0350 seconds 
```

2) 获取一个ID的一个列族的所有数据

```
# 语法：get <table>,<rowkey>,[<family:column>,....]
# 例如：查询<table>为'user'，<rowkey>为'andieguo', <family>为'info'下的所有记录
hbase(main):032:0> get 'user','andieguo','info'
COLUMNCELL  
 info:age timestamp=1409303518077, value=27 
 info:birthdaytimestamp=1409303557859, value=1989-09-01 
 info:company timestamp=1409303628168, value=zonesion   
3 row(s) in 0.0200 seconds 
```

3) 获取一个ID的一个列族中的一个列的所有数据

```
# 语法：get <table>,<rowkey>,[<family:column>,....]
# 例如：查询<table>为'user'，<rowkey>为'andieguo', <family:column >为'info:age'下的所有记录
hbase(main):034:0> get 'user','andieguo','info:age'
COLUMNCELL  
 info:age timestamp=1409303518077, value=27 
1 row(s) in 0.0240 seconds 
```

## 3、 更新一条记录

------

将andieguo的年龄修改为28，命令如下：

```
hbase(main):035:0> put 'user','andieguo','info:age','28'
0 row(s) in 0.0090 seconds

hbase(main):036:0> get 'user','andieguo','info:age'
COLUMNCELL  
 info:age timestamp=1409304167955, value=28 
1 row(s) in 0.0160 seconds 
```

## 4、 获取指定版本的数据

------

```
hbase(main)::037:0> get 'user','andieguo',{COLUMN=>'info:age',TIMESTAMP=>1409304}
COLUMNCELL  
 info:age timestamp=1409304167955, value=28 
1 row(s) in 0.0090 seconds 
```

## 5、 全表扫描

------

```
hbase(main):042:0> scan 'user'
ROWCOLUMN+CELL
 andieguo  column=address:city, timestamp=1409303693005,value=wuhan
 andieguo  column=address:contry, timestamp=1409303656326,value=china   
 andieguo  column=address:province, timestamp=1409303678219,value=wuhan   
 andieguo  column=info:age, timestamp=1409304167955,value=28   
 andieguo  column=info:birthday, timestamp=1409303557859,value=1989-09-01
 andieguo  column=info:company, timestamp=1409303628168,value=zonesion   
1 row(s) in 0.0340 seconds 
```

## 6、 删除ID为”andieguo”的列为’info:age’字段

------

```
hbase(main):043:0> delete 'user','andieguo','info:age'
0 row(s) in 0.0200 seconds

hbase(main):044:0> get 'user','andieguo'
COLUMN CELL   
 address:city  timestamp=1409303693005,value=wuhan 
 address:contrytimestamp=1409303656326,value=china  
 address:province  timestamp=1409303678219,value=wuhan 
 info:birthday timestamp=1409303557859,value=1989-09-01  
 info:company  timestamp=1409303628168,value=zonesion
5 row(s) in 0.0180 seconds 
```

## 7、 查询表中有多少行

------

```
hbase(main):045:0> count 'user'
1 row(s) in 0.0770 seconds 
```

## 8、 向ID为”andieguo”添加’info:age’字段

------

1) 第一次添加(默认使用counter实现递增）

```
hbase(main):048:0> incr 'user','andieguo','info:age'
COUNTER VALUE = 1

hbase(main):052:0> get 'user','andieguo','info:age'
COLUMN CELL   
 info:age  timestamp=1409304832249, value=\x00\x00\x00\x00\x00\x00\x00\x01   
1 row(s) in 0.0150 seconds 
```

2) 第二次添加(默认使用counter实现递增）

```
hbase(main):050:0> incr 'user','andieguo','info:age'
COUNTER VALUE = 2

hbase(main):052:0> get 'user','andieguo','info:age'
COLUMN CELL   
 info:age  timestamp=1409304832249, value=\x00\x00\x00\x00\x00\x00\x00\x02
1 row(s) in 0.0150 seconds 
```

3) 获取当前的COUNTER值

```
hbase(main):053:0> get_counter 'user','andieguo','info:age'
COUNTER VALUE = 2 
```

## 9、 将表数据清空

------

```
hbase(main):054:0> truncate 'user'
Truncating 'user' table (it may take a while):
 - Disabling table...
 - Dropping table...
 - Creating table...
0 row(s) in 3.5320 seconds 
```

可以看出，HBase在执行truncate命令时，通过先对表执行disable，再执行drop操作，最后执行重新建表来实现数据清空。







http://blog.csdn.net/andie_guo/article/details/44086461