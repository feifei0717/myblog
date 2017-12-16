# in/exists和not in/not exists执行效率

发表于 [2011 年 12 月 16 日](http://www.xifenfei.com/2011/12/inexists%e5%92%8cnot-innot-exists%e6%89%a7%e8%a1%8c%e6%95%88%e7%8e%87.html) 由 [惜分飞](http://www.xifenfei.com/author/xifenfei)



标题：[in/exists和not in/not exists执行效率](http://www.xifenfei.com/2011/12/inexists%e5%92%8cnot-innot-exists%e6%89%a7%e8%a1%8c%e6%95%88%e7%8e%87.html)

作者：[惜分飞](http://www.xifenfei.com/)©版权所有[未经本人同意,请不得以任何形式转载,否则有进一步追究法律责任的权利.]

## **一、IN 与EXISTS**

**1、理解**
IN的执行流程
SELECT * FROM T1 WHERE X IN (SELECT Y FROM T2)
事实上可以理解为：
SELECT * FROM T1, (SELECT DISTINCT Y FROM T2) T2 WHERE T1.X = T2.Y
从这里可以看出，IN需要先处理T2表，然后再和T1进行关联
EXISTS的执行流程

从这里看出，EXISXTS会先查询T1表，然后再LOOP处理T2表
**2、结论**
对于in 和 exists的区别: 如果子查询得出的结果集记录较少，主查询中的表较大且又有索引时应该用in, 反之如果外层的主查询记录较少，子查询中的表大，又有索引时使用exists。其实我们区分in和exists主要是造成了驱动顺序的改变（这是性能变化的关键），如果是exists，那么以外层表为驱动表，先被访问，如果是IN，那么先执行子查询，所以我们会以驱动表的快速返回为目标，那么就会考虑到索 引及结果集的关系了。
综合以上对IN/EXISTS的讨论，我们可以得出一个基本通用的结论：IN适合于外表大而内表小的情况；EXISTS适合于外表小而内表大的情况。

## **二、NOT IN 与NOT EXISTS**

**1、理解**
NOT IN的执行流程
SELECT * FROM T1 WHERE X NOT IN (SELECT Y FROM T2)
事实上可以理解为：
SELECT * FROM T1, (SELECT DISTINCT Y FROM T2) T2 WHERE T1.X != T2.Y
NOT EXISTS的执行流程

注意:NOT EXISTS 与 NOT IN 不能完全互相替换，看具体的需求。如果选择的列可以为空，则不能被替换。具体见:[in/exists和not in/not exists语意探讨](http://www.xifenfei.com/2108.html)
**2、结论**
not in 只有当子查询中，select 关键字后的字段有not null约束或者有这种暗示时用not in,另外如果主查询中表大，子查询中的表小但是记录多，则应当使用not in,并使用anti hash join.如果主查询表中记录少，子查询表中记录多，并有索引，可以使用not exists,另外not in最好也可以用/*+ HASH_AJ */或者外连接+is null.一般情况下建议使用not exists

- [in/exists和not in/not exists语意探讨](http://www.xifenfei.com/2011/12/inexists%e5%92%8cnot-innot-exists%e8%af%ad%e6%84%8f%e6%8e%a2%e8%ae%a8.html)
- [清空schema中所有表的comment信息](http://www.xifenfei.com/2011/11/%e6%b8%85%e7%a9%baschema%e4%b8%ad%e6%89%80%e6%9c%89%e8%a1%a8%e7%9a%84comment%e4%bf%a1%e6%81%af.html)
- [rollup和grouping使用](http://www.xifenfei.com/2011/03/rollup%e5%92%8cgrouping%e4%bd%bf%e7%94%a8.html)
- [数据库启动ORA-08103故障恢复](http://www.xifenfei.com/2014/07/%e6%95%b0%e6%8d%ae%e5%ba%93%e5%90%af%e5%8a%a8ora-08103%e6%95%85%e9%9a%9c%e6%81%a2%e5%a4%8d.html)
- [DBMS_SCHEDULER常规操作](http://www.xifenfei.com/2011/12/dbms_scheduler%e5%b8%b8%e8%a7%84%e6%93%8d%e4%bd%9c.html)
- [两表连接，取出其中某些项不重复的数据](http://www.xifenfei.com/2010/08/%e4%b8%a4%e8%a1%a8%e8%bf%9e%e6%8e%a5%ef%bc%8c%e5%8f%96%e5%87%ba%e5%85%b6%e4%b8%ad%e6%9f%90%e4%ba%9b%e9%a1%b9%e4%b8%8d%e9%87%8d%e5%a4%8d%e7%9a%84%e6%95%b0%e6%8d%ae.html)
- [LNNVL函数使用](http://www.xifenfei.com/2012/03/lnnvl%e5%87%bd%e6%95%b0%e4%bd%bf%e7%94%a8.html)
- [library cache lock等待事件](http://www.xifenfei.com/2012/05/library-cache-lock%e7%ad%89%e5%be%85%e4%ba%8b%e4%bb%b6.html)
- [使用plsql抢救数据](http://www.xifenfei.com/2012/09/%e4%bd%bf%e7%94%a8plsql%e6%8a%a2%e6%95%91%e6%95%b0%e6%8d%ae.html)
- [通过sql server 数据库中的sql语句实现项目需求](http://www.xifenfei.com/2010/06/%e9%80%9a%e8%bf%87sql-server-%e6%95%b0%e6%8d%ae%e5%ba%93%e4%b8%ad%e7%9a%84sql%e8%af%ad%e5%8f%a5%e5%ae%9e%e7%8e%b0%e9%a1%b9%e7%9b%ae%e9%9c%80%e6%b1%82.html)
- [ogg同步部分列配置](http://www.xifenfei.com/2015/09/ogg%e5%90%8c%e6%ad%a5%e9%83%a8%e5%88%86%e5%88%97%e9%85%8d%e7%bd%ae.html)
- [模拟普通ORA-08103并解决](http://www.xifenfei.com/2012/09/%e6%a8%a1%e6%8b%9f%e6%99%ae%e9%80%9aora-08103%e5%b9%b6%e8%a7%a3%e5%86%b3.html)

此条目发表在 [Oracle 开发](http://www.xifenfei.com/category/database/oracle/oracle_dev) 分类目录。将[固定链接](http://www.xifenfei.com/2011/12/inexists%e5%92%8cnot-innot-exists%e6%89%a7%e8%a1%8c%e6%95%88%e7%8e%87.html)加入收藏夹。

[← hosts中缺少localhost.localdomain导致监听启动时间超长](http://www.xifenfei.com/2011/12/hosts%e4%b8%ad%e7%bc%ba%e5%b0%91localhost-localdomain%e5%af%bc%e8%87%b4%e7%9b%91%e5%90%ac%e5%90%af%e5%8a%a8%e6%97%b6%e9%97%b4%e8%b6%85%e9%95%bf.html)





来源： 

http://www.xifenfei.com/2011/12/inexists%E5%92%8Cnot-innot-exists%E6%89%A7%E8%A1%8C%E6%95%88%E7%8E%87.html

 