${}:不要预处理形式，直接拼接，不会加引号 (应用于传入表名)

\#{}：要预处理，先用占位符？，后面赋值， 会帮你加引号

例子1 表名：

```
	<select id="getPrivilegeByCondition" resultType="Privilege"  >
		SELECT 
			<include refid="privilegeColumns"/>
		FROM ${tableName} a
		<include refid="privilegeJoins"/>
		WHERE a.gameid = #{gameid} and a.channelid = #{channelid} and lower(Privilege_code) = lower(#{privilegeCode}) AND del_flag= #{DEL_FLAG_NORMAL}
	</select>
```

​	

```
2015-07-08 13:55:22,145 DEBUG [modules.yz.dao.PrivilegeDao.getPrivilegeByCondition] - ==>  Preparing: SELECT a.id AS "id", a.gameid AS "gameid", a.channelid AS "channelid", a.gift AS "gift", a.gifts AS "gifts", a.privilege_code AS "privilegeCode", a.type AS "type", a.create_by AS "createBy.id", a.create_date AS "createDate", a.update_by AS "updateBy.id", a.update_date AS "updateDate", a.remarks AS "remarks", a.del_flag AS "delFlag" FROM yz_privilege_189 a WHERE a.gameid = ? and a.channelid = ? and lower(Privilege_code) = lower(?) AND del_flag= ? 
2015-07-08 13:55:22,419 DEBUG [modules.yz.dao.PrivilegeDao.getPrivilegeByCondition] - ==> Parameters: 189(String), soco(String), 1Re67m8(String), 0(String)
2015-07-08 13:55:22,715 DEBUG [modules.yz.dao.PrivilegeDao.getPrivilegeByCondition] - <==      Total: 1
```

例子2 测试字段直接显示：

```
<select id="selectByPrimaryKey" resultMap="BaseResultMap"  >
  select 
  <include refid="Base_Column_List" />
  from s_user
  where <![CDATA[ user_id = ${userId}]]> and user_name='${userName}'
</select>
```

```
2015-09-18 10:21:57,286 DEBUG [thinkgem.jeesite.dao.UserMapper.selectByPrimaryKey] - ==>  Preparing: select user_id, user_name, user_birthday, user_salary from s_user where user_id = 2 and user_name='tom3' 
2015-09-18 10:21:57,320 DEBUG [thinkgem.jeesite.dao.UserMapper.selectByPrimaryKey] - ==> Parameters: 
2015-09-18 10:21:57,335 DEBUG [thinkgem.jeesite.dao.UserMapper.selectByPrimaryKey] - <==      Total: 1
[User{userId=2, userName='tom3', userBirthday=Fri Apr 24 00:00:00 CST 2015, userSalary=1234.0}]
```

