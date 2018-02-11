[TOC]



# oracle中取最新的前几条记录(rownum)

对于rownum来说它是oracle系统顺序分配为从查询返回的行的编号，返回的第一行分配的是1，第二行是2，依此类推，这个伪字段可以用于限制查询返回的总行数，且rownum不能以任何表的名称作为前缀。

## (1) rownum 对于等于某值的查询条件

如果希望找到学生表中第一条学生的信息，可以使用rownum=1作为条件。但是想找到学生表中第二条学生的信息，使用rownum=2结果查不到数据。因为rownum都是从1开始，但是1以上的自然数在rownum做等于判断是时认为都是false条件，所以无法查到rownum = n（n>1的自然数）。

```
SQL> select rownum,id,name from student where rownum=1;（可以用在限制返回记录条数的地方，保证不出错，如：隐式游标）
SQL> select rownum,id,name from student where rownum =2; 
     ROWNUM ID     NAME
---------- ------ ---------------------------------------------------
```

## (2) rownum对于大于某值的查询条件

   如果想找到从第二行记录以后的记录，当使用rownum>2是查不出记录的，原因是由于rownum是一个总是从1开始的伪列，Oracle 认为rownum> n(n>1的自然数)这种条件依旧不成立，所以查不到记录。

查找到第二行以后的记录可使用以下的子查询方法来解决。注意子查询中的rownum必须要有别名，否则还是不会查出记录来，这是因为rownum不是某个表的列，如果不起别名的话，无法知道rownum是子查询的列还是主查询的列。

```
SQL>select * from(select rownum no ,id,name from student) where no>2;
         NO ID     NAME
---------- ------ ---------------------------------------------------
          3 200003 李三
          4 200004 赵四
```

假如要返回前5条记录：

```
　select * from tablename where rownum<6;(或是rownum <= 5 或是rownum != 6)
```

注意：只能用以上符号(<、<=、!=)。不能用：>,>=,=,Between...and

 

## (3)在ORACLE中实现SELECT TOP N

   由于ORACLE不支持SELECT TOP语句，所以在ORACLE中经常是用ORDER BY跟ROWNUM的组合来实现SELECT TOP N的查询。

简单地说，实现方法如下所示：

```
SELECT　列名１．．．列名ｎ　FROM

     (SELECT　列名１．．．列名ｎ　FROM 表名 ORDER BY 列名１．．．列名ｎ)

   WHERE ROWNUM <= N（抽出记录数）

ORDER BY ROWNUM ASC
```



http://www.cnblogs.com/hzj-/articles/1708727.html