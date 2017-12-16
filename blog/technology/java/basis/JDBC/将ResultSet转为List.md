将ResultSet转为List

分类: java
日期: 2014-11-18

原文地址: 

http://blog.chinaunix.net/uid-29632145-id-4632108.html

------

****[将ResultSet转为List]() *2014-11-18 21:54:01*

分类： Java

## [将ResultSet转为List](http://www.cnblogs.com/seaven/archive/2009/07/21/1527509.html)

点击(此处)折叠或打开

```
public static List resultSetToList(ResultSet rs) throws java.sql.SQLException { 
           if (rs == null) 
               return Collections.EMPTY_LIST; 
           ResultSetMetaData md = rs.getMetaData(); //得到结果集(rs)的结构信息，比如字段数、字段名等 
           int columnCount = md.getColumnCount(); //返回此 ResultSet 对象中的列数 
           List list = new ArrayList(); 
           Map rowData = new HashMap(); 
           while (rs.next()) { 
            rowData = new HashMap(columnCount); 
            for (int i = 1; i <= columnCount; i++) { 
                    rowData.put(md.getColumnName(i), rs.getObject(i)); 
            } 
            list.add(rowData); 
            System.out.println("list:" + list.toString()); 
           } 
           return list; 
   }
```

接着在其他方法里处理返回的List
点击(此处)折叠或打开List ls = resultSetToList(rs); 
Iterator it = ls.iterator(); 
while(it.hasNext()) { 
​    Map hm = (Map)it.next(); 
​    System.out.println(hm.get("字段名大写")); 
}