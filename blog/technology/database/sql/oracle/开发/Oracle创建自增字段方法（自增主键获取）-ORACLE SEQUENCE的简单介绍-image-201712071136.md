# Oracle创建自增字段方法（自增主键获取）-ORACLE SEQUENCE的简单介绍



## 说明

先假设有这么一个表：

```
create table S_Depart  (
   DepartId             INT                             not null,
   DepartName           NVARCHAR2(40)                   not null,
   DepartOrder          INT                            default 0,
   constraint PK_S_DEPART primary key (DepartId)
);
```

 

在oracle中sequence就是所谓的序列号，每次取的时候它会自动增加，一般用在需要按序列号排序的地方。 
1、Create Sequence 
你首先要有CREATE SEQUENCE或者CREATE ANY SEQUENCE权限， 
CREATE SEQUENCE emp_sequence 
INCREMENT BY 1 -- 每次加几个 
START WITH 1 -- 从1开始计数 
NOMAXvalue -- 不设置最大值 
NOCYCLE -- 一直累加，不循环 
CACHE 10; --设置缓存cache个序列，如果系统down掉了或者其它情况将会导致序列不连续，也可以设置为---------NOCACHE
针对S_Depart创建的sequence如下：

```
create sequence S_S_DEPART
minvalue 1
maxvalue 999999999999999999999999999
start with 1
increment by 1
nocache;
```

一旦定义了emp_sequence，你就可以用CURRVAL，NEXTVAL 
CURRVAL=返回 sequence的当前值 
NEXTVAL=增加sequence的值，然后返回 sequence 值 
比如： 
emp_sequence.CURRVAL 
emp_sequence.NEXTVAL 
可以使用sequence的地方： 
\- 不包含子查询、snapshot、VIEW的 SELECT 语句 
\- INSERT语句的子查询中 
\- NSERT语句的valueS中 
\- UPDATE 的 SET中 
可以看如下例子： 

```
insert into S_Depart(departId,Departname,Departorder)values(S_S_Depart.Nextval,'12345',1);
```

SELECT empseq.currval FROM DUAL; 
但是要注意的是： 
\- 第一次NEXTVAL返回的是初始值；随后的NEXTVAL会自动增加你定义的INCREMENT BY值，然后返回增加后的值。CURRVAL 总是返回当前SEQUENCE的值，但是在第一次NEXTVAL初始化之后才能使用CURRVAL，否则会出错。一次NEXTVAL会增加一次 SEQUENCE的值，所以如果你在同一个语句里面使用多个NEXTVAL，其值就是不一样的。明白？ 
\- 如果指定CACHE值，ORACLE就可以预先在内存里面放置一些sequence，这样存取的快些。cache里面的取完后，oracle自动再取一组到cache。 使用cache或许会跳号， 比如数据库突然不正常down掉（shutdown abort),cache中的sequence就会丢失. 所以可以在create sequence的时候用nocache防止这种情况。 
2、Alter Sequence 
你或者是该sequence的owner，或者有ALTER ANY SEQUENCE 权限才能改动sequence. 可以alter除start至以外的所有sequence参数.如果想要改变start值，必须 drop sequence 再 re-create . 
Alter sequence 的例子 
ALTER SEQUENCE emp_sequence 
INCREMENT BY 10 
MAXvalue 10000 
CYCLE -- 到10000后从头开始 
NOCACHE ; 
影响Sequence的初始化参数： 
SEQUENCE_CACHE_ENTRIES =设置能同时被cache的sequence数目。 
可以很简单的Drop Sequence 
DROP SEQUENCE order_seq; 

一个简单的例子：

```
create sequence SEQ_ID
minvalue 1
maxvalue 99999999
start with 1
increment by 1
nocache
order;
建解发器代码为：
create or replace trigger tri_test_id
  before insert on S_Depart   --S_Depart 是表名
  for each row
declare
  nextid number;
begin
  IF :new.DepartId IS NULLor :new.DepartId=0 THEN --DepartId是列名
    select SEQ_ID.nextval --SEQ_ID正是刚才创建的
    into nextid
    from sys.dual;
    :new.DepartId:=nextid;
  end if;
end tri_test_id;
```

OK，上面的代码就可以实现自动递增的功能了。

## 开发实例：

business service（业务service）：

```java
    /**
     * <B>Description:</B> 生成一个自增主键 <br>
     * <B>Create on:</B> 2016/8/23 10:28 <br>
     *
     * @author xiangyu.ye
     */
    @Transactional(propagation = Propagation.REQUIRES_NEW)//开启一个新的事物
    public String genSeq() {
        List<String> result = genSeqs(1);
        return result.get(0);
    }
    /**
     * <B>Description:</B>  生成num个自增主键 <br>
     * <B>Create on:</B> 2016/8/23 10:28 <br>
     *
     * @author xiangyu.ye
     */
    public List<String> genSeqs(int num) {
        List<String> resultList = Lists.newArrayList();
        String seqName = "SEQ_ITEM_ACTIVITY_KEEP_QTY_LOG";//oracle中sequence名字
        List<String> seqNameList = new ArrayList<>();
        for (int i = 0; i < num; i++) {
            seqNameList.add(seqName);
        }
        List<PkEntity> result = sequenceService.getSeqNextValWithSpecialCodeBatch(seqName,
                seqNameList, "C", 8);
        if (CollectionUtils.isNotEmpty(result)){
            for (PkEntity pkEntity : result) {
                resultList.add(pkEntity.getPk());
            }
        }
        return resultList;
    }
```

 SequenceService（产生序号的函数）：

```Java
    public List<PkEntity> getSeqNextValWithSpecialCode(String seqName, String code, int len) {
        List<PkEntity> result=  sequenceDao.getSeqNextValWithSpecialCode(seqName,code,len);
        return result;
    }
      
    public List<PkEntity> getSeqNextValWithSpecialCodeBatch(String seqName,
                                                            List<String> seqNameList,
                                                            String code,
                                                            int len) {
        String pkname=seqNameList.get(0);
        List<PkEntity> result=  sequenceDao.getSeqNextValWithSpecialCodeBatch(pkname,seqNameList,code,len);
        return result;
    }

```

SequenceDao：

```Java
     List<PkEntity> getSeqNextValWithSpecialCode(
        @Param("seqName") String seqName,
        @Param("code") String code,
        @Param("len")int len
     );
    
    List<PkEntity> getSeqNextValWithSpecialCodeBatch(
        @Param("seqName") String seqName,
        @Param("seqNameList")List<String> seqNameList,
        @Param("code") String code,
        @Param("len")int len
     );
```

seq.mapper.xml

```
    <!-- 兼容老的程序17位 -->
    <!-- cg+7 或者 c+8 -->
	<select id="getSeqNextValWithSpecialCode" resultMap="pkMap">
        SELECT  #{seqName} as pkName, to_char(sysdate,'yyyymm')||#{code}||to_char(sysdate,'dd')||lpad(#selforacle_master#${seqName}.nextval,#{len},'0') AS pk FROM dual
    </select>
     
    <!-- 兼容老的程序 17位-->
    <select id="getSeqNextValWithSpecialCodeBatch" resultMap="pkMap"  parameterType="map">
         SELECT   #{seqName} as pkName,to_char(sysdate,'yyyymm')||#{code}||to_char(sysdate,'dd')||lpad(#selforacle_master#${seqName}.nextval,#{len},'0') AS pk FROM (
              <foreach collection="seqNameList" item="item" index="index"  separator="UNION ALL" > 
                  select 1 from dual 
              </foreach>
        )
    </select>

```



oracle：

创建sequence：

```Sql
-- Create sequence 
create sequence UCORD.SEQ_ITEM_ACTIVITY_KEEP_QTY_LOG
minvalue 1
maxvalue 99999999999999999
start with 1001
increment by 1
cache 1000;
执行结果：  
SELECT  'SEQ_ITEM_ACTIVITY_KEEP_QTY_LOG' as pkName, to_char(sysdate,'yyyymm')||'C'||to_char(sysdate,'dd')||lpad(ucord.SEQ_ITEM_ACTIVITY_KEEP_QTY_LOG.nextval,8,'0' )  AS pk FROM dual 
```

![img](Oracle创建自增字段方法（自增主键获取）-ORACLE SEQUENCE的简单介绍_files/4641c0f0-e454-41f7-8137-0304f1d9efd4.png) 

来源： <<http://blog.csdn.net/zhoufoxcn/article/details/1762351>>

 