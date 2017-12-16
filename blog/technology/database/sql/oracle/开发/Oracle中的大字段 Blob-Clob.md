数据库中提供了两种字段类型 Blob  和 Clob 用于存储大型字符串或二进制数据（如图片）。
**Blob** 采用单字节存储，适合保存二进制数据，如图片文件。
**Clob** 采用多字节存储，适合保存大型文本数据。
Oracle中处理BLOB/CLOB字段的方式比较特别，所以需要特别注意下面两点：
**1. 在Oracle JDBC中采用流机制对 BLOB/CLOB 进行读写操作**，所以要注意不能在批处理中读写 BLOB/CLOB字段，否则将出现
Stream type cannot be used in batching 异常。
**2. Oracle BLOB/CLOB 字段本身拥有一个游标（cursor），**JDBC通过游标对Blob/Clob字段进行操作，在Blob/Clob字段创建之前，无法获取其游标句柄，会出现
Connection reset by peer: socket write error 异常。
正确的做法是：首先创建一个空 Blob/Clob 字段，再从这个空 Blob/Clob字段获取游标，例如下面的代码：

```
PreparedStatement ps  =  conn.prepareStatement( " insert into PICTURE(image,resume) values(?,?) " );
 //  通过oralce.sql.BLOB/CLOB.empty_lob()构造空Blob/Clob对象 
 ps.setBlob( 1 ,oracle.sql.BLOB.empty_lob());
ps.setClob( 2 ,oracle.sql.CLOB.empty_lob());

ps.excuteUpdate();
ps.close();

 //  再次对读出Blob/Clob句柄 
 ps  =  conn.prepareStatement( " select image,resume from PICTURE where id=? for update " );
ps.setInt( 1 , 100 );

ResultSet rs  =  ps.executeQuery();
rs.next();

oracle.sql.BLOB imgBlob  =  (oracle.sql.BLOB)rs.getBlob( 1 );
oracle.sql.CLOB resClob  =  (oracle.sql.CLOB)rs.getClob( 2 );

 //  将二进制数据写入Blob 
 FileInputStream inStream  =   new  FileInputStream( " c://image.jpg " );
OutputStream outStream  =  imgBlob.getBinaryOutputStream();

 byte [] buf  =   new   byte [ 10240 ];
 int  len;
 while (len = inStream.read(buf) > 0 )  {
  outStream.write(buf, 0 ,len);
} 
inStream.close();
outStream.cloese();

 //  将字符串写入Clob 
 resClob.putString( 1 , " this is a clob " );

 //  再将Blob/Clob字段更新到数据库 
 ps  =  conn.prepareStatement( " update PICTURE set image=? and resume=? where id=? " );
ps.setBlob( 1 ,imgBlob);
ps.setClob( 2 ,resClob);
ps.setInt( 3 , 100 );

ps.executeUpdate();
ps.close(); 
```



来源： <http://blog.csdn.net/nobody_java/article/details/1661624>