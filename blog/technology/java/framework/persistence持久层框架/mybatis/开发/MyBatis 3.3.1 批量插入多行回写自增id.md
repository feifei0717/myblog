[TOC]



# MyBatis 3.3.1 批量插入多行回写自增id

测试代码:/Users/jerryye/backup/studio/AvailableCode/framework/mybatis/mybatis_demo/src/main/java/com/practice/mybatis/spring/test/SpringCRUDTest.java



时间  2016-09-01

标签 [mybatis](http://www.voidcn.com/tag/mybatis) [批量插入](http://www.voidcn.com/tag/%E6%89%B9%E9%87%8F%E6%8F%92%E5%85%A5) [回写id](http://www.voidcn.com/tag/%E5%9B%9E%E5%86%99id) 栏目 [MyBatis](http://www.voidcn.com/column/mybatis)

*原文*   [http://blog.csdn.net/top_code/article/details/52404345](javascript:void())

[MyBatis](javascript:void()) 3.3.1支持批量插入多行回写自增id的功能，具体介绍请参看[Support insert multiple rows and write-back id #547](https://github.com/mybatis/mybatis-3/pull/547)。

### 实现原理

其实现原理就是一条SQL语句：

```
INSERT INTO tablename (column-a, [column-b, ...])
VALUES ('value-1a', ['value-1b', ...]),
('value-2a', ['value-2b', ...]),
```

支持上述SQL语法特性的数据库有：DB2, SQL Server (since version 10.0 - i.e. 2008), PostgreSQL (since version 8.2), MySQL, sqlite (since version 3.7.11) and H2。

### 实战

本文通过一个示例来演示如何使用MyBatis 3.3.1这一新特性。

#### 准备工作

MySQL建表SQL：

```
CREATE TABLE `tb_user` ( `id` BIGINT(12) NOT NULL AUTO_INCREMENT, `name` VARCHAR(20) NOT NULL, `password` VARCHAR(20) NOT NULL, `age` SMALLINT(3) NOT NULL, `email` VARCHAR(40) NOT NULL, `gender` SMALLINT(2) NOT NULL DEFAULT '0', `register_time` DATETIME NOT NULL, `status` SMALLINT(2) NOT NULL DEFAULT '0', PRIMARY KEY (`id`), KEY `user_index`(`name`) ) ENGINE=INNODB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
```

maven依赖

```
<dependency>
    <groupId>org.mybatis</groupId>
    <artifactId>mybatis</artifactId>
    <version>3.4.0</version>
</dependency>
<dependency>
    <groupId>org.mybatis</groupId>
    <artifactId>mybatis-spring</artifactId>
    <version>1.3.0</version>
</dependency>
```

#### 编码代码

1、User.java

```java
public class User {
    private long id;
    private String name;
    private String password;
    private int age;
    private String email;
    private int gender;
    private int status;
    private Date registerTime;  //注册时间

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }
    ...
}
```

2、UserMapper.xml

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE mapper PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN" "http://mybatis.org/dtd/mybatis-3-mapper.dtd" >
<mapper namespace="com.bytebeats.codelab.mybatis.mapper.UserMapper" >
    <insert id="batchInsert" useGeneratedKeys="true" keyProperty="id">
        INSERT INTO tb_user
        (name, password,age, email,gender,register_time)
        VALUES
        <foreach collection="list" item="user" index="index" separator="," >
          (#{user.name},#{user.password},#{user.age},#{user.email},
          #{user.gender},#{user.registerTime})
        </foreach>
      </insert>
</mapper>
```

注意foreach语句，collection的值必须为”list”，否则会报错。

3、UserDaoImpl.java

```java
@Repository("userDao")
public class UserDaoImpl implements IUserDao {

    @Autowired
    private IBaseDao baseDao;

    @Override
    public int insertBatch(List<User> list) {

        return baseDao.getSqlSession().insert("com.bytebeats.codelab.mybatis.mapper.UserMapper.batchInsert", list);
    }
}
```

4.测试用例

```java
@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(locations = { "classpath:applicationContext.xml" })
public class IUserDaoTest {

    @Autowired
    private IUserDao userDao;

    @Test
    public void testInsertBatch(){

        List<User> userList = new ArrayList<>();
        User user1 = new User();
        user1.setName("ricky");
        user1.setPassword("1234");
        user1.setAge(27);
        user1.setEmail("ricky_feng@163.com");
        user1.setGender(1);
        user1.setRegisterTime(new Date());
        userList.add(user1);

        User user2 = new User();
        user2.setName("张三");
        user2.setPassword("bat");
        user2.setAge(25);
        user2.setEmail("ricky_feng@163.com");
        user2.setGender(0);
        user2.setRegisterTime(new Date());
        userList.add(user2);

        int update = userDao.insertBatch(userList);
        System.out.println("update:"+update);

        for(User user: userList){
            System.out.println("id:"+user.getId());
        }
    }
}
```

执行一下，可以看到user对象id属性都有值啦。

### 小结

mapper insert语句中 \<foreach collection=”list” item=”user” index=”index” separator=”,”> collection的名称必须为list，不能叫别的名字否则会报错。内部实现原理可以参考： 
[Mybatis3.3.x技术内幕（十五）：Mybatis之foreach批量insert，返回主键id列表](javascript:void())这篇文章。



http://www.voidcn.com/article/p-xbakykar-bau.html