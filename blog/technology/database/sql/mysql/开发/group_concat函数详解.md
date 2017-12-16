问了好多人，都不知道group_concat这个函数。

 

这个函数好啊，能将相同的行组合起来，省老事了。

 

MySQL中group_concat函数

完整的语法如下：

group_concat([DISTINCT] 要连接的字段 [Order BY ASC/DESC 排序字段] [Separator '分隔符'])

 

基本查询

 

Sql代码  [![收藏代码](group_concat函数详解_files/42789f09-3578-4468-a197-75b2296685dd.png)]()

1. select * from aa;  

+------+------+
| id| name |
+------+------+
|1 | 10|
|1 | 20|
|1 | 20|
|2 | 20|
|3 | 200 |
|3 | 500 |
+------+------+
6 rows in set (0.00 sec)

 

以id分组，把name字段的值打印在一行，逗号分隔(默认)

 

Sql代码  [![收藏代码](group_concat函数详解_files/42789f09-3578-4468-a197-75b2296685dd.png)]()

1. select id,group_concat(name) from aa group by id;  

+------+--------------------+
| id| group_concat(name) |
+------+--------------------+
|1 | 10,20,20|
|2 | 20 |
|3 | 200,500|
+------+--------------------+
3 rows in set (0.00 sec)

 

以id分组，把name字段的值打印在一行，分号分隔

 

Java代码  [![收藏代码](group_concat函数详解_files/42789f09-3578-4468-a197-75b2296685dd.png)]()

1. select id,group_concat(name separator ';') from aa group by id;  

+------+----------------------------------+
| id| group_concat(name separator ';') |
+------+----------------------------------+
|1 | 10;20;20 |
|2 | 20|
|3 | 200;500 |
+------+----------------------------------+
3 rows in set (0.00 sec)

 

以id分组，把去冗余的name字段的值打印在一行，

逗号分隔

 

Sql代码  [![收藏代码](group_concat函数详解_files/42789f09-3578-4468-a197-75b2296685dd.png)]()

1. select id,group_concat(distinct name) from aa group by id;  

+------+-----------------------------+
| id| group_concat(distinct name) |
+------+-----------------------------+
|1 | 10,20|
|2 | 20 |
|3 | 200,500 |
+------+-----------------------------+
3 rows in set (0.00 sec)

 

以id分组，把name字段的值打印在一行，逗号分隔，以name排倒序

 

Sql代码  [![收藏代码](group_concat函数详解_files/42789f09-3578-4468-a197-75b2296685dd.png)]()

1. select id,group_concat(name order by name desc) from aa group by id;  

+------+---------------------------------------+
| id| group_concat(name order by name desc) |
+------+---------------------------------------+
|1 | 20,20,10 |
|2 | 20|
|3 | 500,200|
+------+---------------------------------------+
3 rows in set (0.00 sec)

 

测试sql，项目中用到的。

Sql代码  [![收藏代码](group_concat函数详解_files/42789f09-3578-4468-a197-75b2296685dd.png)]()

```
SELECT  
        EMPLOYEES.EMPID  
        ,EMPLOYEES.EMPNAME  
        ,DEPARTMENTS.DEPARTMENTNAME  
        ,EMPLOYEES.DEPTID  
        ,EMPLOYEES.EMPPWD  
        ,EMPLOYEES.INSIDEEMAIL  
        ,EMPLOYEES.OUTSIDEEMAIL  
        ,EMPLOYEES.DELEFLAG  
        ,EMPLOYEES.EMPCLASS  
        ,(CONCAT('[', <span style="color: #ff0000;">GROUP_CONCAT</span>  
(ROLE.Role_Name SEPARATOR '],['), ']')) AS ROLENAME  
        ,(concat( '[', (  
            SELECT  
                    <span style="color: #ff0000;">GROUP_CONCAT</span>  
(DEPARTMENTS.DEPARTMENTNAME separator '],[')  
                FROM  
                    EMP_ROLE_DEPT  
                        LEFT JOIN DEPARTMENTS  
                            ON (  
                                DEPARTMENTS.DEPARTMENTID = EMP_ROLE_DEPT.DEPTID  
                                AND DEPARTMENTS.DELEFLAG = 0  
                            )  
                GROUP BY  
                    EMP_ROLE_DEPT.EMPID  
                HAVING  
                    EMP_ROLE_DEPT.EMPID = EMPLOYEES.EMPID  
        ),']')) AS DEPARTMENTRIGHT  
    FROM  
        EMPLOYEES  
            LEFT JOIN DEPARTMENTS  
                ON (  
                    DEPARTMENTS.DEPARTMENTID = EMPLOYEES.DEPTID  
                    AND DEPARTMENTS.DELEFLAG = 0  
                )  
            LEFT JOIN ROLE_EMP  
                ON (ROLE_EMP.EMP_ID = EMPLOYEES.EMPID)  
            LEFT JOIN ROLE  
                ON (ROLE_EMP.ROLE_ID = ROLE.ROLE_ID)  
<span style="color: #ff0000;">    GROUP BY  
        EMPLOYEES.EMPID</span>  
  
    HAVING  
        EMPLOYEES.EMPID LIKE '%%'  
        AND EMPLOYEES.EMPNAME LIKE '%%'  
        AND EMPLOYEES.DELEFLAG = 0  
        AND (  
            EMPLOYEES.EMPCLASS = '1'  
            OR EMPLOYEES.EMPCLASS = '2'  
        )  
        AND EMPLOYEES.DEPTID = '001' LIMIT 0  
        ,16   
```



来源： <http://hchmsguo.iteye.com/blog/555543>