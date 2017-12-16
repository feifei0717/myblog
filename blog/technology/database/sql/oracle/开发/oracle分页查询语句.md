Oracle分页查询格式：

　　以下是代码：

```Sql
　　SELECT * FROM
　　(
　　SELECT A.*, ROWNUM RN
　　FROM (SELECT * FROM 表名) A
　　WHERE ROWNUM <= 40
　　)
　　WHERE RN > 20
```

  格式化：

```Sql
 SELECT * FROM ( SELECT A.*, ROWNUM RN FROM (
 SELECT * FROM 表名
 ) A WHERE ROWNUM <= 40 ) WHERE RN > 20
```

​       查询第21到40的数据。

　　其中最内层的查询SELECT * FROM 表名表示不进行翻页的原始查询语句。ROWNUM <= 40和RN > 20控制分页查询的每页的范围。

　　上面给出的这个Oracle分页查询语句，在大多数情况拥有较高的效率。分页的目的就是控制输出结果集大小，将结果尽快的返回。在上面的分页查询语句中，这种考虑主要体现在WHERE ROWNUM <= 40这句上。

来源： <<http://blog.csdn.net/wonder1053/article/details/7268588>>

 