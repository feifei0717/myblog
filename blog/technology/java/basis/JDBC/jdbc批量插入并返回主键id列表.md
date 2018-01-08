# Jdbc批量插入并返回主键id列表

代码示例:

```java
PreparedStatement pstm = conn.prepareStatement("insert into students(name, email) values(?, ?), (?, ?), (?, ?)",
				Statement.RETURN_GENERATED_KEYS);

pstm.setString(1, "name1");
pstm.setString(2, "email1");


pstm.setString(3, "name2");
pstm.setString(4, "email2");
		
pstm.setString(5, "name2");
pstm.setString(6, "email2");

pstm.addBatch();
pstm.executeBatch();

ResultSet rs = pstm.getGeneratedKeys();
while (rs.next()) {
	Object value = rs.getObject(1);
	System.out.println(value);
}
```

Output:

```
248
249
250
```

 



https://my.oschina.net/zudajun/blog/674946