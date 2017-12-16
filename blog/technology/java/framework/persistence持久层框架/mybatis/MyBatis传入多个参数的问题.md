# MyBatis传入多个参数的问题



## **一、单个参数：**

```
public List<XXBean> getXXBeanList(String xxCode); 

<select id="getXXXBeanList" parameterType="java.lang.String" resultType="XXBean">

　　select t.* from tableName t where t.id= #{id} 

</select> 

其中方法名和ID一致，#{}中的参数名与方法中的参数名一直， 我这里采用的是XXXBean是采用的短名字,

select 后的字段列表要和bean中的属性名一致， 如果不一致的可以用 as 来补充。
```

## **二、多参数：**

```
public List<XXXBean> getXXXBeanList(String xxId, String xxCode); 

<select id="getXXXBeanList" resultType="XXBean">

　　select t.* from tableName where id = #{0} and name = #{1} 

</select> 

由于是多参数那么就不能使用parameterType， 改用#｛index｝是第几个就用第几个的索引，索引从0开始
```

## **三、Map封装多参数：**  

```
public List<XXXBean> getXXXBeanList(HashMap map); 

<select id="getXXXBeanList" parameterType="hashmap" resultType="XXBean">

　　select 字段... from XXX where id=#{xxId} code = #{xxCode} 

</select> 

其中hashmap是mybatis自己配置好的直接使用就行。map中key的名字是那个就在#{}使用那个，map如何封装就不用了我说了吧。
```

## **四、List封装in：**

```
public List<XXXBean> getXXXBeanList(List<String> list); 

<select id="getXXXBeanList" resultType="XXBean">
　　select 字段... from XXX where id in
　　<foreach item="item" index="index" collection="list" open="(" separator="," close=")"> 
　　　　#{item} 
　　</foreach> 
</select> 

foreach 最后的效果是select 字段... from XXX where id in ('1','2','3','4')
```

## **五、多参数传递之注解方式示：**    

 

```
public AddrInfo getAddrInfo(@Param("corpId")int corpId, @Param("addrId")int addrId);
 
xml配置这样写：
 
<select id="getAddrInfo" resultMap="com.xxx.xxx.AddrInfo">
       SELECT * FROM addr__info 
　　　　where addr_id=#{addrId} and corp_id=#{corpId}
</select>
 
以前在<select>语句中要带parameterType的，现在可以不要这样写。
```

 

## **六、selectList()只能传递一个参数，但实际所需参数既要包含String类型，又要包含List类型时的处理方法：**

将参数放入Map，再取出Map中的List遍历。如下：

```
List<String> list_3 = new ArrayList<String>();
Map<String, Object> map2 = new HashMap<String, Object>();

list.add("1");

list.add("2");
map2.put("list", list); //网址id

map2.put("siteTag", "0");//网址类型
```



```
public List<SysWeb> getSysInfo(Map<String, Object> map2) {
　　return getSqlSession().selectList("sysweb.getSysInfo", map2);
}
```



```
<select id="getSysInfo" parameterType="java.util.Map" resultType="SysWeb">
　　select t.sysSiteId, t.siteName, t1.mzNum as siteTagNum, t1.mzName as siteTag, t.url, t.iconPath
   from TD_WEB_SYSSITE t
   left join TD_MZ_MZDY t1 on t1.mzNum = t.siteTag and t1.mzType = 10
   WHERE t.siteTag = #{siteTag } 
   and t.sysSiteId not in 
   <foreach collection="list" item="item" index="index" open="(" close=")" separator=",">
       #{item}
   </foreach>
 </select>
```

