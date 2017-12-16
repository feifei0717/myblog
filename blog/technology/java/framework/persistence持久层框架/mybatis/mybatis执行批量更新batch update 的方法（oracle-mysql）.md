oracle和mysql数据库的批量update在mybatis中配置不太一样：

## oracle数据库：

```
<update id="batchUpdate"  parameterType="java.util.List">
      
       <foreach collection="list" item="item" index="index" open="begin" close="end;" separator=";">
                update test 
                <set>
                  test=${item.test}+1
                </set>
                where id = ${item.id}
       </foreach>
          
    </update>
```

## mysql数据库：

mysql数据库采用一下写法即可执行，但是数据库连接必须配置：&allowMultiQueries=true

例如：jdbc:mysql://192.168.1.236:3306/test?useUnicode=true&amp;characterEncoding=UTF-8&allowMultiQueries=true

```
<update id="batchUpdate"  parameterType="java.util.List">
      
          <foreach collection="list" item="item" index="index" open="" close="" separator=";">
                update test 
                <set>
                  test=${item.test}+1
                </set>
                where id = ${item.id}
         </foreach>
          
    </update>
```