### [MyBatis insert操作返回主键](http://289972458.iteye.com/blog/1001851)

在使用MyBatis做持久层时，insert语句默认是不返回记录的主键值，而是返回插入的记录条数；如果业务层需要得到记录的主键时，可以通过配置的方式来完成这个功能

#### 针对Sequence主键而言，在执行insert sql前必须指定一个主键值给要插入的记录，如Oracle、DB2，可以采用如下配置方式：

```
<insert id="add" parameterType="vo.Category">
		<selectKey resultType="java.lang.Short" order="BEFORE" keyProperty="id">
			SELECT SEQ_TEST.NEXTVAL FROM DUAL
		</selectKey>
		insert into category (name_zh, parent_id,
		show_order, delete_status, description
		)
		values (#{nameZh,jdbcType=VARCHAR},
		#{parentId,jdbcType=SMALLINT},
		#{showOrder,jdbcType=SMALLINT},
		#{deleteStatus,jdbcType=BIT},
		#{description,jdbcType=VARCHAR}
		)
</insert>
```



#### 针对自增主键的表，在插入时不需要主键，而是在插入过程自动获取一个自增的主键，比如MySQL，可以采用如下两种配置方式：

```
<insert id="add" parameterType="vo.Category" useGeneratedKeys="true" keyProperty="id">
		insert into category (name_zh, parent_id,
		show_order, delete_status, description
		)
		values (#{nameZh,jdbcType=VARCHAR},
		#{parentId,jdbcType=SMALLINT},
		#{showOrder,jdbcType=SMALLINT},
		#{deleteStatus,jdbcType=BIT},
		#{description,jdbcType=VARCHAR}
		)
</insert>
```

或

```
<insert id="add" parameterType="vo.Category">
		<selectKey resultType="java.lang.Short" order="AFTER" keyProperty="id">
			SELECT LAST_INSERT_ID() AS id
		</selectKey>
		insert into category (name_zh, parent_id,
		show_order, delete_status, description
		)
		values (#{nameZh,jdbcType=VARCHAR},
		#{parentId,jdbcType=SMALLINT},
		#{showOrder,jdbcType=SMALLINT},
		#{deleteStatus,jdbcType=BIT},
		#{description,jdbcType=VARCHAR}
		)
</insert>
```

在插入操作完成之后，参数category的id属性就已经被赋值了

如果数据库表的主键不是自增的类型，那么就需要应用层生成主键的方式··········这个就不多说了，需要的朋友，可以留言交流··

来源： <http://289972458.iteye.com/blog/1001851>