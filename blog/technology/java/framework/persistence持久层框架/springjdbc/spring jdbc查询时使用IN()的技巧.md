### [spring jdbc查询时使用IN()的技巧](http://xupeixuan.iteye.com/blog/1953481)

在使用SELECT查询时IN比OR的效率好。那么在Spring中如何使用IN()呢？

这是我原来的使用方式，用字符串拼接：

```
StringBuilder buf = new StringBuilder("SELECT name FROM pos_user WHERE id IN (");  
// ids 是List<Integer>类型  
for(int i = 0; i < ids.size(); i++) {  
  if (i > 0) buf.append(","); 
  buf.append("'");
  buf.append(ids.get(i));  
  buf.append("'");
}  
buf.append(")");  
  
List<String> list = jdbcTemplate.queryForList(buf.toString(), String.class); 
```

 

实际上Spring JDBC提供了一种更优雅的方法：

```
NamedParameterJdbcTemplate namedParameterJdbcTemplate =   
    new NamedParameterJdbcTemplate(jdbcTemplate);  
  
MapSqlParameterSource parameters = new MapSqlParameterSource();  
parameters.addValue("ids", ids);  
List<String> list = namedParameterJdbcTemplate.query(
            "SELECT name FROM pos_user WHERE id in (:ids)", parameters,
            new BeanPropertyRowMapper(String.class));
```

来源： <http://xupeixuan.iteye.com/blog/1953481>