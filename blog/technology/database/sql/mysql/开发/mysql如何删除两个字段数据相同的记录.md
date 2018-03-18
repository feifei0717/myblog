# mysql如何删除两个字段数据相同的记录



表结构

```sql
CREATE TABLE users
(
  id   INT AUTO_INCREMENT
    PRIMARY KEY,
  name VARCHAR(20) NULL,
  age  INT         NULL
)
  ENGINE = InnoDB;
```



语句

```sql
DELETE FROM users
WHERE id NOT IN (
  SELECT max(tb.id)
  FROM (
         SELECT tmp.*
         FROM users tmp
       ) tb
  GROUP BY tb.name, tb.age
);
```

保留id最大的



https://www.zhihu.com/question/33189744