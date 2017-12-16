# Mysql 分组聚合实现 over partition by 功能类似oracle中分组排序函数用法 

mysql中没有类似oracle和postgreSQL的 OVER(PARTITION BY)功能. 那么如何在MYSQL中搞定分组聚合的查询呢

 

先说结论: 利用 group_concat + substr等函数处理

 

例如: 订单表一张, 只保留关键字段

| id   | user_id | money | create_time |
| ---- | ------- | ----- | ----------- |
| 1    | 1       | 50    | 1420520000  |
| 2    | 1       | 100   | 1420520010  |
| 3    | 2       | 100   | 1420520020  |
| 4    | 2       | 200   | 1420520030  |

业务: 查找每个用户的最近一笔消费金额

单纯使用group by user_id, 只能按user_id 将money进行聚合, 是无法将最近一单的金额筛选出来的, 只能满足这些需求, 例如:　每个用户的总消费金额 sum(money), 最大消费金额 max(money), 消费次数count(1) 等

 

但是我们有一个group_concat可以用, 思路如下:

## 1.查找出符合条件的记录, 按user_id asc, create_time desc 排序; 

```
SELECT ord.user_id, ord.money, ord.create_time
FROM orders ord
WHERE ord.user_id > 0
	AND create_time > 0
ORDER BY ord.user_id ASC, ord.create_time DESC
```

| user_id | money | create_time |
| ------- | ----- | ----------- |
| 1       | 100   | 1420520010  |
| 1       | 50    | 1420520000  |
| 2       | 200   | 1420520030  |
| 2       | 100   | 1420520020  |

 

## 2.将(1)中记录按user_id分组, group_concat(money);

```
SELECT t.user_id, GROUP_CONCAT(t.money ORDER BY t.create_time DESC) AS moneys
FROM (
	SELECT ord.user_id, ord.money, ord.create_time
	FROM orders ord
	WHERE ord.user_id > 0
		AND ord.create_time > 0
	ORDER BY ord.user_id ASC, ord.create_time DESC
) t
GROUP BY t.user_id
```

 

| user_id | moneys  |
| ------- | ------- |
| 1       | 100,50  |
| 2       | 200,100 |

## 3.这时, 如果用户有多个消费记录, 就会按照时间顺序排列好, 再利用 subString_index 函数进行切分即可

 

完整SQL, 注意group_concat的内排序, 否则顺序不保证, 拿到的就不一定是第一个了

```
SELECT t.user_id
	, substring_index(GROUP_CONCAT(t.money ORDER BY t.create_time DESC), ',', 1) AS lastest_money
FROM (
	SELECT ord.user_id, ord.money, ord.create_time
	FROM orders ord
	WHERE ord.user_id > 0
		AND create_time > 0
	ORDER BY user_id ASC, create_time DESC
) t
GROUP BY user_id;
```

 

| user_id | moneys |
| ------- | ------ |
| 1       | 100    |
| 2       | 200    |

利用这个方案, 以下类似业务需求都可以这么做, 如:

\1. 查找每个用户过去10个的登陆IP

\2. 查找每个班级中总分最高的两个人

 

补充: 如果是只找出一行记录, 则可以直接只用聚合函数来进行

```
SELECT t.user_id, t.money
FROM (
	SELECT ord.user_id, ord.money, ord.create_time
	FROM orders ord
	WHERE ord.user_id > 0
		AND create_time > 0
	ORDER BY user_id ASC, create_time DESC
) t
GROUP BY user_id;
```

前提一定是(1) 只需要一行数据, (2) 子查询中已排好序, (3) mysql关闭 strict-mode

 

参考资料:

http://dev.mysql.com/doc/refman/5.0/en/sql-mode.html#sql-mode-strict

http://dev.mysql.com/doc/refman/5.0/en/group-by-functions.html#function_group-concat

来源： <http://www.cnblogs.com/zhwbqd/p/4205821.html?utm_source=tuicool>