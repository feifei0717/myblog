# oracle RETURNING 子句 返回

RETURNING 自己通常结合DML 语句使用。（INSERT UPDATE DELETE）

使用方法：

```
UPDATE table_name SET expr1
RETURNING column_name
INTO xxx
```

INSERT: 返回的是添加后的值
UPDATE：返回的是更新后的值

DELETE：返回删除前的值

RETURNING 可以再sqlplus 和plsql中使用

如果是plsql就如上面的代码，xxx为声明的变量名

如果是sqlplus，xxx 可以为变量，即

```
VARIABLE var_name varchar2(10)
UPDATE table_name SET expr1
RETURNING column_name INTO :var_name;
```

这里的 :var_name  使用的是绑定变量

另外，RETURNING 貌似可以与 RETURN通用

INSERT INTO VALUES 支持 RETURNING 

INSERT INTO SELECT、 和MERGE 语句 不支持 RETURNING

 

再另外，RETURNING 可以与BULK COLLECT 结合（批量绑定， 另外一个是 FORALL）

```
DECLARE
TYPE table_type IS TABLE OF column_name%TYPE;
v_tab table_type;
BEGINUPDATE table_name
  SET expr1
  RETURNING column_name BULK COLLECT INTO v_tab;

  FOR i IN v_tab.first .. v_tab.last LOOP
  DBMS_OUTPUT.put_line( l_tab(i));
END LOOP;

COMMIT;
END;
/
```

嵌套表的使用方法可以看
<http://www.cnblogs.com/Azhu/archive/2012/04/16/2452781.html>

来源： <http://www.cnblogs.com/Azhu/archive/2012/04/10/2439847.html>