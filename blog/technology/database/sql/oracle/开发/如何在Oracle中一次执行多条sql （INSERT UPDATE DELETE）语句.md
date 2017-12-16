# 如何在Oracle中一次执行多条sql （INSERT UPDATE DELETE）语句

有时我们需要一次性执行多条sql语句，而用来更新的sql是根据实际情况用代码拼出来的
解决方案是把sql拼成下面这种形式：

```sql
begin 
update TB_VG set seq = 1, vessel_id = 'Jin14', vessel_type = 'TRACK' where batch_number = '20837' and train_id = '0233086';
update TB_VG set seq = 2, vessel_id = 'Jin14', vessel_type = 'TRACK' where batch_number = '20992' and train_id = '0233110';
end;
```

总结如下：
**以begin开始，以end;结尾(end后的分号不能省)，中间的每个sql语句要以分号;结尾**

在实际编码中，发现即使这样也会有错误发生，**把sql语句中的换行符替换成空格**就可以了
比较稳妥的编码方式是：
1、以正常的方式编写sql，根据阅读与编写的需要，中间肯定会有换行符
2、在执行之前进行替换：strSql = strSql.Replace("r\n", " ").Replace('\n', ' ');
如果不采用这种方式，可能的异常有：

ORA-00933: SQL 命令未正确结束（如果sql没有以分号结尾）
ORA-00911: 无效字符（如果未加begin 和 end）
ORA-06550: 第x行, 第xxx列: PLS-00103: 出现符号 "end-of-file"在需要下列之一时：......（如果end后面没有;分号）
ORA-06550: 第x行, 第xxx列: PLS-00103: 出现符号 ""在需要下列之一时：......（语句之间有换行符）

来源： <http://www.cnblogs.com/teamleader/archive/2007/05/31/765943.html>