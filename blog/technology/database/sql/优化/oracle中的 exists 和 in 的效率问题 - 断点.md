
有两个简单例子，以说明 “exists”和“in”的效率问题

1) select * from T1 where exists(select * from T2 where T1.a=T2.a) ;[select * from T1 where exists(select * from T1 where T1.a=T2.a) ;]

​    T1数据量小而T2数据量非常大时，T1<<T2 时，1) 的查询效率高。

2) select * from T1 where T1.a in (select T2.a from T2) ;

​     T1数据量非常大而T2数据量小时，T1>>T2 时，2) 的查询效率高。

exists 用法：

1）句中的“select * from T2 where T1.a=T2.a” 相当于一个关联表查询，

​     相当于“select * from T1,T2  where T1.a=T2.a”；

​    “exists（xxx）”它只在乎括号里的数据能不能查找出来，是否存在这样的记录，如果存在，这1）句的where 条件成立。in的用法：

2）句中的“select * from T1 where T1.a in (select T2.a from T2) ”，这里的“in”后面括号里的语句搜索出来的字段的内容一定要相对应，一般来说，T1和T2这两个表的a字段表达的意义应该是一样的，否则这样查没什么意义。

\---------------------------------------------------------------

+++++++++++++   下面转载  +++++++++++++++++++

\---------------------------------------------------------------

今天市场报告有个sql及慢，运行需要20多分钟，如下：
update p_container_decl cd
set cd.ANNUL_FLAG=\'0001\',ANNUL_DATE = sysdate
where exists(
select 1
from (
select tc.decl_no,tc.goods_no
from p_transfer_cont tc,P_AFFIRM_DO ad
where tc.GOODS_DECL_NO = ad.DECL_NO
and ad.DECL_NO = \'sssssssssssssssss\'
) a
where a.decl_no = cd.decl_no
and a.goods_no = cd.goods_no
)
上面涉及的3个表的记录数都不小，均在百万左右。根据这种情况，我想到了前不久看的tom的一篇文章，说的是exists和in的区别，in 是把外表和那表作hash join，而exists是对外表作loop，每次loop再对那表进行查询。
这样的话，in适合内外表都很大的情况，exists适合外表结果集很小的情况。

而我目前的情况适合用in来作查询，于是我改写了sql，如下：
update p_container_decl cd
set cd.ANNUL_FLAG=\'0001\',ANNUL_DATE = sysdate
where (decl_no,goods_no) in
(
select tc.decl_no,tc.goods_no
from p_transfer_cont tc,P_AFFIRM_DO ad
where tc.GOODS_DECL_NO = ad.DECL_NO
and ad.DECL_NO = ‘ssssssssssss’
)

让市场人员测试，结果运行时间在1分钟内。问题解决了，看来exists和in确实是要根据表的数据量来决定使用。

\--------------------------------------------------------------------------

 