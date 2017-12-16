# Rank() over()的用法

创建一个test表，并插入6条数据。

```
CREATE TABLE test
(
	a INT,
	b INT,
	c CHAR
)
INSERT INTO test VALUES(1,3,'E')
INSERT INTO test VALUES(2,4,'A')
INSERT INTO test VALUES(3,2,'D')
INSERT INTO test VALUES(3,5,'B')
INSERT INTO test VALUES(4,2,'C')
INSERT INTO test VALUES(2,4,'B')
 

 

SELECT * from test
 

 

a           b           c
----------- ----------- ----
1           3           E
2           4           A
3           2           D
3           5           B
4           2           C
2           4           B
(6 行受影响)
```

1、整个结果集是一个分组，以a进行排名

```
SELECT a,b,c,rank () OVER (ORDER BY a) rank FROM test
 

 

a           b           c    rank
----------- ----------- ---- --------------------
1           3           E    1
2           4           A    2
2           4           B    2
3           2           D    4
3           5           B    4
4           2           C    6

(6 行受影响)
```

2、整个结果集是一个分组，以b进行排名

```
SELECT a,b,c,rank () OVER (ORDER BY b) rank FROM test
 

 

a           b           c    rank
----------- ----------- ---- --------------------
3           2           D    1
4           2           C    1
1           3           E    3
2           4           A    4
2           4           B    4
3           5           B    6

(6 行受影响)
```

3、以a,b进行分组，在每个组内以b进行排名。分了5个组，第2行跟第3行是一个组，其他的每行是一个组。在第2行与第3行的组内以b排名，并列为1

```
SELECT a,b,c,rank () OVER (PARTITION BY a,b ORDER BY b) rank FROM test
 

a           b           c    rank
----------- ----------- ---- --------------------
1           3           E    1
2           4           A    1
2           4           B    1
3           2           D    1
3           5           B    1
4           2           C    1

(6 行受影响)
```

4、以a,b进行分组，在每个组内以c进行排名。分了5个组，第2行跟第3行是一个组，其他的每行是一个组。在第2行与第3行的组内以c排名，由于c列一个是A，一个是B，所以Rank分别为1、2。

```
SELECT a,b,c,rank () OVER (PARTITION BY a,b ORDER BY c) rank FROM test
 

 

a           b           c    rank
----------- ----------- ---- --------------------
1           3           E    1
2           4           A    1
2           4           B    2
3           2           D    1
3           5           B    1
4           2           C    1

(6 行受影响)
```

总结：1、partition  by用于给结果集分组，如果没有指定那么它把整个结果集作为一个分组。

> 2、Rank 是在每个分组内部进行排名的。
>
> Technorati 标签: [rank over](http://technorati.com/tags/rank+over),[partition](http://technorati.com/tags/partition),[sql](http://technorati.com/tags/sql)

分类: [SQL SERVER](http://www.cnblogs.com/mycoding/category/249102.html)

来源： http://www.cnblogs.com/mycoding/archive/2010/05/29/1747065.html

 