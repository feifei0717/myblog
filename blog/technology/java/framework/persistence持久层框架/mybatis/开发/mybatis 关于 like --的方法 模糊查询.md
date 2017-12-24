没想到 这个地方会遇到麻烦，之前用惯了 hibernate 悲剧

 

网上的很多 其实 都不对！至少我没有发现是对的

 

 

首先我的mybatis版本是

```
       <dependency>  
            <groupId>org.apache.ibatis</groupId>  
            <artifactId>ibatis-sqlmap</artifactId>  
            <version>2.3.4.726</version>  
        </dependency>  
```

 

 

OK 然后数据库是 mysql

 

注意 这里数据库 非常重要！

 

```
SELECT * FROM t_app  
        <where>  
            <if test="name != null">  
                name like CONCAT('%','${name}','%' )  
            </if>  
            <if test="url != null">  
                AND url like CONCAT('%','${url}','%' )  
            </if>  
        </where>  
        limit #{begin},${end}  
```

 sql语句是这样的，其实mybatis就是 简单的替换${name}的内容为你传入的参数值

 

 

所以 如果要加入%，就要使用数据能够支持的函数或者表达式，这个应该明白吧

 

而mysql中便是 concat函数，其他数据库也类似了 呵呵

来源： <http://mxdba.iteye.com/blog/844748>