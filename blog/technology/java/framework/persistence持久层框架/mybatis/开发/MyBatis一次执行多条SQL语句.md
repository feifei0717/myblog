# mybatis一次执行多条SQL语句

有个常见的场景：删除用户的时候需要先删除用户的外键关联数据，否则会触发规则报错。

解决办法不外乎有三个：1、多条sql分批执行；2、存储过程或函数调用；3、sql批量执行。

今天我要说的是MyBatis中如何一次执行多条语句（使用mysql数据库）。

1、修改数据库连接参数加上allowMultiQueries=true，如：

```
hikariConfig.security.jdbcUrl=jdbc:mysql://xx.xx.xx:3306/xxxxx?characterEncoding=utf-8&autoReconnect=true&failOverReadOnly=false&allowMultiQueries=true
```

2、直接写多条语句，用“；”隔开即可

```xml
<delete id="deleteUserById" parameterType="String">
    delete from sec_user_role where userId=#{id};
    delete from sec_user where id=#{id};
</delete>
```





http://www.cnblogs.com/yuananyun/p/5445181.html