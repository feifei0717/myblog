# Oracle中复制表结构和表数据



**注意一下复制过去的表结构，没有注释索引和主键。想复制完整最好把创建表结构的sql拿出来改下。然后在复制数据。**

 

## **一、复制表结构及其数据 **

```
create table new_table as (select * from old_table);  
```

## **二、只复制表结构**

```
create table new_table as (select * from old_table where 1=2);  
```

## **三、只复制表数据**

如果两个表结构一样：

```
insert into new_table select * from old_table;  
```

如果两个表结构不一样：

```
insert into new_table(column1,column2...) select column1,column2... from old_table;  
```


来源： <http://blog.csdn.net/itmyhome1990/article/details/18040585>