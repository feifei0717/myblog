将jdbc结果集ResultSet转换成对象列表

分类: java
日期: 2014-11-23

原文地址: 

http://blog.chinaunix.net/uid-29632145-id-4642954.html

------

****[将jdbc结果集ResultSet转换成对象列表 ]()*2014-11-23 11:45:52*

分类： Java

将jdbc结果集转换成对象列表 

估计hibernate就是用得这种方式进行转换的。 

实体对象 

点击(此处)折叠或打开

```
package test;
//实体对象，该对象的属性与数据库中的字段相同，当然可以改变具体看需求
public class Person {
    private int id;
    private int age;
    private String name;
    public int getId() {
        return id;
    }
    public void setId(int id) {
        this.id = id;
    }
    public int getAge() {
        return age;
    }
    public void setAge(int age) {
        this.age = age;
    }
    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }
    
}
```

点击(此处)折叠或打开

```
package test;

import java.lang.reflect.Field;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;

public class Main {
    //用于测试的方法
    public static void main(String[] args) throws InstantiationException, IllegalAccessException, IllegalArgumentException, ClassNotFoundException {
        Connection conn = DbUtils.getConn();
        ResultSet rs = null;
        PreparedStatement psmt = null;
        System.out.println(conn);
        try {
            psmt = conn.prepareStatement("select * from person");
            rs = psmt.executeQuery();
            List list = DbUtils.populate(rs, Person.class);
            for(int i = 0 ; i<list.size() ; i++){
                Person per = (Person) list.get(i);
                System.out.println("person : id = "+per.getId()+" name = "+per.getName()+" age = "+per.getAge());
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }finally{
            if(rs!=null){
                try {
                    rs.close();
                } catch (SQLException e) {
                    e.printStackTrace();
                }
                rs=null;
            }
            if(psmt!=null){
                try {
                    psmt.close();
                } catch (SQLException e) {
                    e.printStackTrace();
                }
                psmt=null;
            }
            if(conn!=null){
                try {
                    conn.close();
                } catch (SQLException e) {
                    e.printStackTrace();
                }
                conn=null;
            }
        }
        
    }

}
```

具体的工具类 
点击(此处)折叠或打开

```
package test;

import java.lang.reflect.Field;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

public class DbUtils {
    private static String url = "jdbc:mysql://localhost:3306/test";
    private static String username = "root";
    private static String password = "";
    private static String driverClass = "com.mysql.jdbc.Driver";
    //没什么好说的，获取数据库连接
    public static Connection getConn(){
        Connection conn = null;
        try {
            Class.forName(driverClass);
            conn = DriverManager.getConnection(url,username,password);
        } catch (ClassNotFoundException e) {
            e.printStackTrace();
        } catch (SQLException e) {
            e.printStackTrace();
        }
        
        return conn;
    }
    /*
     * 将rs结果转换成对象列表
     * @param rs jdbc结果集
     * @param clazz 对象的映射类
     * return 封装了对象的结果列表
     */
    public static List populate(ResultSet rs , Class clazz) throws SQLException, InstantiationException, IllegalAccessException{
        //结果集的元素对象 
        ResultSetMetaData rsmd = rs.getMetaData();
        //获取结果集的元素个数
         int colCount = rsmd.getColumnCount();
//         System.out.println("#");
//         for(int i = 1;i<=colCount;i++){
//             System.out.println(rsmd.getColumnName(i));
//             System.out.println(rsmd.getColumnClassName(i));
//             System.out.println("#");
//         }
         //返回结果的列表集合
         List list = new ArrayList();
         //业务对象的属性数组
         Field[] fields = clazz.getDeclaredFields();
         while(rs.next()){//对每一条记录进行操作
             Object obj = clazz.newInstance();//构造业务对象实体
             //将每一个字段取出进行赋值
             for(int i = 1;i<=colCount;i++){
                 Object value = rs.getObject(i);
                 //寻找该列对应的对象属性
                 for(int j=0;j<fields.length;j++){
                     Field f = fields[j];
                     //如果匹配进行赋值
                     if(f.getName().equalsIgnoreCase(rsmd.getColumnName(i))){
                         boolean flag = f.isAccessible();
                         f.setAccessible(true);
                         f.set(obj, value);
                         f.setAccessible(flag);
                     }
                 }
             }
             list.add(obj);
         }
        return list;
    }
}
```

