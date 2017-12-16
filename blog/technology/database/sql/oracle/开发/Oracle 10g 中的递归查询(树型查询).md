# Oracle 10g 中的递归查询(树型查询)



一、树型表结构：
节点ID  上级ID  节点名称
二、公式： 

```
select 节点ID,节点名称,level
from 表
connect by prior 节点ID=上级节点ID
start with 上级节点ID=节点值
```



说明：
1、常见的树形结构为公司组织机构、地区……
2、求节点ID以上的结构，或以上的结构，将“节点ID=上级节点ID”左右顺序换一下即可。
3、Level为Oracle的特殊字段，表示“层”的意思。当前节点ID的下一层节点为“1”。

测试SQL: 1，建立表结构

```
create table Dept(
DepartNO  varchar2(10),
DepartName  varchar2(20),
TopNo    varchar2(10)
);

```

 插入数据： 



```
insert into Dept values('001',' 董事会','0');
commit;
insert into Dept values('002','总裁办 ','001');
commit;
insert into Dept values('003','财务部 ','001');
commit;
insert into Dept values('004','市场部 ','002');
commit;
insert into Dept values('005','公关部 ','002');
commit;
insert into Dept values('006','销售部 ','002');
commit;
insert into Dept values('007','分销处 ','006');
commit;
insert into Dept values('008','业务拓展处','004');
commit;
insert into Dept values('009','销售科','007');
commit;

```



 

 1，向前查 (从查询本身一直到最上面的机构）

比如:

```
select distinct departno,departname,level
from dept
connect by prior topno=departno
start with
departno='005';
```

  2，向后查：（从查询本身一直到最下面的机构）

```
select distinct departno,departname,level
from dept
connect by prior departno=topno
start with
topno='001';
```

  COND2是连接条件，其中用PRIOR表示上一条记录，比如 CONNECT BY PRIOR ID=PRAENTID就是说上一条记录的ID(比如**根记录**）是（**下一条**）本条记录的PRAENTID，即本记录的父亲是上一条记录。

分类: [Oracle 学习](http://www.cnblogs.com/zping/category/147359.html)

标签: [http://www.zping.com 或 http://zping.cnblogs.com/](http://www.cnblogs.com/zping/tag/http%3A%2F%2Fwww.zping.com%20%E6%88%96%20http%3A%2F%2Fzping.cnblogs.com%2F/)

来源： <<http://www.cnblogs.com/zping/archive/2008/10/05/1303503.html>>

 