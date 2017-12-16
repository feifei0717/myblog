#  mysql prepare 存储过程使用

语法

```
PREPARE statement_name FROM sql_text /*定义*/   
EXECUTE statement_name [USING variable [,variable...]] /*执行预处理语句*/   
DEALLOCATE PREPARE statement_name /*删除定义*/  
```

例

```
mysql> PREPARE prod FROM "INSERT INTO examlple VALUES(?,?)";   
mysql> SET @p='1';   
mysql> SET @q='2';   
mysql> EXECUTE prod USING @p,@q;   
mysql> SET @name='3';   
mysql> EXECUTE prod USING @p,@name;   
mysql> DEALLOCATE PREPARE prod;  
```

1.用变量做表名： 简单的用set或者declare语句定义变量，然后直接作为sql的表名是不行的，mysql会把变量名当作表名。在其他的sql数据库中也是如 此，mssql的解决方法是将整条sql语句作为变量，其中穿插变量作为表名，然后用sp_executesql调用该语句。 这在mysql5.0之前是不行的，5.0之后引入了一个全新的语句，可以达到类似sp_executesql的功能（仅对procedure有 效，function不支持动态查询）： 

PREPARE stmt_name FROM preparable_stmt; 
EXECUTE stmt_name [USING @var_name [, @var_name] ...]; 
{DEALLOCATE | DROP} PREPARE stmt_name; 

 

为了有一个感性的认识，下面先给几个小例子： 

 

**[sql]**

```
mysql> PREPARE stmt1 FROM 'SELECT SQRT(POW(?,2) + POW(?,2)) AS hypotenuse';   
mysql> SET @a = 3;   
mysql> SET @b = 4;   
mysql> EXECUTE stmt1 USING @a, @b;   
+------------+   
| hypotenuse |   
+------------+   
| 5 |   
+------------+   
mysql> DEALLOCATE PREPARE stmt1;   
mysql> SET @s = 'SELECT SQRT(POW(?,2) + POW(?,2)) AS hypotenuse';   
mysql> PREPARE stmt2 FROM @s;   
mysql> SET @a = 6;   
mysql> SET @b = 8;   
mysql> EXECUTE stmt2 USING @a, @b;   
+------------+   
| hypotenuse |   
+------------+   
| 10 |   
+------------+   
mysql> DEALLOCATE PREPARE stmt2;  
```

 

如果你的MySQL 版本是 5.0.7 或者更高的，你还可以在 LIMIT 子句中使用它，示例如下：

 

**[sql]**

```
mysql> SET @a=1;  
mysql> PREPARE STMT FROM "SELECT * FROM tbl LIMIT ?";   
mysql> EXECUTE STMT USING @a;   
mysql> SET @skip=1; SET @numrows=5;   
mysql> PREPARE STMT FROM "SELECT * FROM tbl LIMIT ?, ?";   
mysql> EXECUTE STMT USING @skip, @numrows;  
```

使用 PREPARE 的几个注意点： 
A：PREPARE stmt_name FROM preparable_stmt;预定义一个语句，并将它赋给 stmt_name ，tmt_name 是不区分大小写的。
B： 即使 preparable_stmt 语句中的 ? 所代表的是一个字符串，你也不需要将 ? 用引号包含起来。 
C： 如果新的 PREPARE 语句使用了一个已存在的 stmt_name ，那么原有的将被立即释放！ 即使这个新的 PREPARE 语句因为错误而不能被正确执行。
D： PREPARE stmt_name 的作用域是当前客户端连接会话可见。 
E： 要释放一个预定义语句的资源，可以使用 DEALLOCATE PREPARE 句法。 
F： EXECUTE stmt_name 句法中，如果 stmt_name 不存在，将会引发一个错误。 
G： 如果在终止客户端连接会话时，没有显式地调用 DEALLOCATE PREPARE 句法释放资源，服务器端会自己动释放它。 
H： 在预定义语句中，CREATE TABLE, DELETE, DO, INSERT, REPLACE, SELECT, SET, UPDATE, 和大部分的 SHOW 句法被支持。
I： PREPARE 语句不可以用于存储过程，自定义函数！但从 MySQL 5.0.13 开始，它可以被用于存储过程，仍不支持在函数中使用！

 

下面给个示例：

Sql代码  

```
CREATE PROCEDURE `p1`(IN id INT UNSIGNED,IN name VARCHAR(11))  
BEGIN lable_exit:  
BEGIN  
SET @SqlCmd = 'SELECT * FROM tA ';  
IF id IS NOT NULL THEN  
SET @SqlCmd = CONCAT(@SqlCmd , 'WHERE id=?');  
PREPARE stmt FROM @SqlCmd;  
SET @a = id;  
EXECUTE stmt USING @a;  
LEAVE lable_exit;  
END IF;  
IF name IS NOT NULL THEN  
SET @SqlCmd = CONCAT(@SqlCmd , 'WHERE name LIKE ?');  
PREPARE stmt FROM @SqlCmd;  
SET @a = CONCAT(name, '%');  
EXECUTE stmt USING @a;  
LEAVE lable_exit;  
END IF;  
END lable_exit;  
END;  
CALL `p1`(1,NULL);  
CALL `p1`(NULL,'QQ');  
DROP PROCEDURE `p1`;   
```

 

了解了PREPARE的用法，再用变量做表名就很容易了。不过在实际操作过程中还发现其他一些问题，比如变量定义，declare变量和set @var=value变量的用法以及参数传入的变量。 
测试后发现，set @var=value这样定义的变量直接写在字符串中就会被当作变量转换，declare的变量和参数传入的变量则必须用CONCAT来连接。具体的原理没有研究。 
EXECUTE stmt USING @a;这样的语句USING后面的变量也只能用set @var=value这种，declare和参数传入的变量不行。





http://maoyifa100.iteye.com/blog/1900305