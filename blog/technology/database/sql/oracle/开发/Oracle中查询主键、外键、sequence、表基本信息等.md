# Oracle中查询主键、外键、sequence、表基本信息等

一次看到某张表中有几条ID相同的数据，通过业务确认该ID应该是唯一的，后来找到原因，因为DBA未对该表建[**主键**](http://www.cnblogs.com/canyangfeixue/admin/javascript:;)。

现在DBA工作比较忙，我们项目有时需要新增或者修改[**数据库**](http://www.cnblogs.com/canyangfeixue/admin/javascript:;)表结构时，可能需要对表结构进行确认。下面提供几个比较有用对[**SQL**](http://www.cnblogs.com/canyangfeixue/admin/javascript:;)，可以帮助大家看看数据库 中表结构定义怎样的，以PRODUCT表为例，请自行更换为所需的表名。

注意：如果oracle用的用户不是当前用  把user改成all   例如：user_constraints 改成 all_constraints

## **1.查询主键：**

 

```sql
select  col.*from user_constraints con,user_cons_columns col
where con.constraint_name=col.constraint_name and con.constraint_type='P'and col.table_name='PRODUCT'
select   *   from   user_constraints   where   table_name = 'PRODUCT'and   constraint_type ='P'
        
对所有用户有效：
select  col.* from all_constraints con,all_cons_columns col
where
con.constraint_name=col.constraint_name and con.constraint_type='P'
and col.table_name='ICON'
```

 

## **2.查看表结构基本信息：**

 

```sql
select
utc.column_name,utc.data_type,utc.data_length,utc.data_precision,
utc.data_Scale,utc.nullable,utc.data_default,ucc.comments
from
user_tab_columns utc,user_col_comments ucc
where
utc.table_name = ucc.table_name
and utc.column_name = ucc.column_name
and utc.table_name = 'PRODUCT'
order by
column_id
```

## **3.查看SEQUENCE：**

 

```
SELECT SEQ_PRODUCT_DRAFT.nextval FROM dual
```

 能查出来就说明该SEQ存在

（PRODUCT表中的ID是没有设SEQ的，业务逻辑是该从product_draft那边的ID写入product.id，所以此处查的是 product_draft中的seq）

## 4.查看外键：

 

```sql
select distinct(ucc.column_name) column_name,rela.table_name,rela.column_name column_name1
from
 user_constraints uc,user_cons_columns ucc,
 (select t2.table_name,t2.column_name,t1.r_constraint_name from user_constraints t1,user_cons_columns t2 where t1.r_constraint_name=t2.constraint_name and t1.table_name='ONLINEXLS') rela
where
 uc.constraint_name=ucc.constraint_name
 and uc.r_constraint_name=rela.r_constraint_name
 and uc.table_name='PRODUCT'
```



 

参考：http://blog.sina.com.cn/s/blog_497cdcc10100bi85.html