mysql中如何查询表中的主键？语句怎么写？

举个简单的例子：

```
SELECT k.column_name
FROM information_schema.table_constraints t
JOIN information_schema.key_column_usage k
USING (constraint_name,table_schema,table_name)
WHERE t.constraint_type='PRIMARY KEY'
  AND t.table_schema='db'
  AND t.table_name='tbl'


```

select COLUMN_KEY,COLUMN_NAME from INFORMATION_SCHEMA.COLUMNS where table_name='表名' AND COLUMN_KEY='PRI';
这样吗·获取主键字段名

desc 表名； 有一个Key的字段，值为'PRI'的就是主键

来源： <http://www.dewen.net.cn/q/4908>