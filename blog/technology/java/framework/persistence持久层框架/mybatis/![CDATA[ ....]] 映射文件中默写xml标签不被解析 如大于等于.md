  

```
  <select id="selectByPrimaryKey" resultMap="BaseResultMap"  >
    select 
    <include refid="Base_Column_List" />
    from s_user
    where <![CDATA[ user_id <= #{0}]]>   
  </select>
```

  mybatis  xml中<=会被解析，应该不要解析直接原封不动的输出。

  user_id <= #{0}包含xml格式的东西，<![CDATA[ ....]]>,这个在xml里表示该部分内容不会被xml解析器解析