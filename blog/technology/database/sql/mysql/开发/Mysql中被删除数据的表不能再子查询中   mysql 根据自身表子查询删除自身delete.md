在mysql中存在一个很困扰的问题，就是在删除的时候，如果条件用的时子查询，并且查询的是当前表，则不能删除，我们可以通过如下方式进行删除：

存在表demo，有两个字段，id， grade（成绩）

我们需要删除成绩是后三名的同学，一般我们会写出如下sql

delete from demo where id in (select n.id as nid from demo n order by grade asc limit 0,3)

但是这段sql会报错，不能执行。但是可以给子查询的表起个别名，然后再用就好了，如下：

delete from demo where id in (select * from (select n.id as nid from demo n order by grade asc limit 0,3) s)

这样删除就没有问题了！

其实不用这么麻烦，我们直接可以通过以下sql删除

delete from demo orer by grade asc limit 0,3;

这样就ok了！

实例：

Mysql中被删除数据的表不能再子查询中，必须多嵌套一层，请注意

```sql
DELETE FROM period_generic_rule
WHERE biz_code IN (
		SELECT tmp.biz_code
		FROM (
			SELECT b.biz_code
			FROM icon_sku_whg a, period_generic_rule b
			WHERE a.sku_seq = b.biz_code
				AND import_type = '2'
				AND a.islifeexpired = '1'
		) tmp
	);
```
