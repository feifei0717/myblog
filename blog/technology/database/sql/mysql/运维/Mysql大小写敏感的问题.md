Mysql大小写敏感的问题

一、1 CREATE TABLE NAME(name VARCHAR(10));

​        对这个表，缺省情况下，下面两个查询的结果是一样的：

​        SELECT * FROM TABLE NAME WHERE name='clip';

​        SELECT * FROM TABLE NAME WHERE name='Clip';

​        MySql默认查询是不区分大小写的,如果需要区分他,必须在建表的时候,Binary标示敏感的属性.

​        CREATE TABLE NAME(

​          name VARCHAR(10) BINARY

​        );

​         2 在SQL语句中实现 SELECT * FROM TABLE NAME WHERE  BINARY name='Clip';

​	 3 设置字符集：

​	 

​	 utf8_general_ci --不区分大小写

​	 

​	 utf8_bin--区分大小写

二、 MySQL在windows下是不区分大小写的，将script文件导入MySQL后表名也会自动转化为小写，结果再 想要将数据库导出放到linux服务器中使用时就出错了。因为在linux下表名区分大小写而找不到表，查了很多都是说在linux下更改MySQL的设置使其也不区分大小写，但是有没有办法反过来让windows 下大小写敏感呢。其实方法是一样的，相应的更改windows中MySQL的设置就行了。

​        具体操作：

​        在MySQL的配置文件my.ini中增加一行：

```
# 0：区分大小写，1：不区分大小写
lower_case_table_names=1
```

​        MySQL在Linux下数据库名、表名、列名、别名大小写规则是这样的：

　　    1、数据库名与表名是严格区分大小写的；

　　    2、表的别名是严格区分大小写的；

　　    3、列名与列的别名在所有的情况下均是忽略大小写的；

　　    4、变量名也是严格区分大小写的；    MySQL在Windows下都不区分大小写