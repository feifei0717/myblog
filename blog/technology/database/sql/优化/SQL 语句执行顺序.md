[TOC]



# SQL 语句执行顺序

## SQL前言

SQL，脚本查询语言，处理代码的顺序不是按照脚本语言的顺序，这点是不同于其他编程语言的最明显特征。

SQL语言常见的比如，Mysql，HiveQL，Oracle等，虽然语法上存在一些差异，但它们在解释查询脚本上，尤其是在解析语句执行顺序上具有共性。如果将脚本语言分解为一系列的语句，那么这些语句的先后执行顺序是怎样的呢？

这篇文章，主要总结SQL语句的执行顺序。

## **Select语句执行顺序**

select查询语句的执行顺序，可以看出首先执行FROM子句，最后执行ORDER BY

执行顺序：

(1) FROM

(2) ON

(3) JOIN

(4) WHERE

(5) GROUP BY

(6) WITH {CUBE | ROLLUP}

(7) HAVING

(8)SELECT

(9) DISTINCT

(10) ORDER BY

(11) LIMIT

## **以上逻辑顺序简介**

以上每个步骤都会产生一个虚拟表，该虚拟表被用作下一个步骤的输入。只有最后一步生成的表才会返回给调用者。

1. FROM：对FROM子句中的前两个表执行笛卡尔积(交叉联接)，生成虚拟表VT1，选择相对小的表做基础表。
2. ON：对VT1应用ON筛选器，只有那些使为真才被插入到VT2。
3. OUTER (JOIN): 如果指定了OUTER JOIN(相对于CROSS JOIN或INNER JOIN)，保留表中未找到匹配的行将作为外部行添加到VT2，生成TV3。
4. WHERE：对VT3应用WHERE筛选器，只有使为true的行才插入VT4。
5. GROUP BY：按GROUP BY子句中的列对VT4中的行进行分组，生成VT5。
6. CUTE|ROLLUP：把超组插入VT5，生成VT6。
7. HAVING：对VT6应用HAVING筛选器，只有使为true的组插入到VT7。
8. SELECT：处理SELECT列表，产生VT8。
9. DISTINCT：将重复的行从VT8中删除，得到VT9。
10. ORDER BY：将VT9中的行按ORDER BY子句中的列列表顺序，生成一个游标(VC10)。
11. LIMIT(TOP)：从VC10的开始处选择指定数量或比例的行，生成表VT11，并返回给调用者。

## **以上步骤2和3的进一步说明**

ON子句 和 LEFT OUTER JOIN

有两张表：

1. 学生表，字段为：班级，姓名
2. 成绩表，字段为：姓名，成绩

现在需要返回编号班级为001班全体同学的成绩，但是这个班级有几个学生缺考，也就是说在成绩表中没有记录。

为了得到我们预期的结果我们就需要在on子句指定学生和成绩表的关系（学生.姓名=成绩.姓名），那么我们是否发现在执行第二步的时候，对于没有参加考试的学生记录就不会出现在vt2中，因为他们被on的逻辑表达式过滤掉了。

我们想返回001班所有同学的成绩，如何做？

要用LEFT OUTER JOIN就可以把左表（学生表）中没有参加考试的学生找回来。





https://www.toutiao.com/a6525192477027074563/?tt_from=android_share&utm_campaign=client_share&timestamp=1519392915&app=news_article&iid=25707689558&utm_medium=toutiao_android