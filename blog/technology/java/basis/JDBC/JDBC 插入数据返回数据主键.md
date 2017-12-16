参考代码：

  

```
package com.test;   
import java.sql.Connection;   
import java.sql.PreparedStatement;   
import java.sql.ResultSet;   
import java.sql.Statement;   
import java.util.Date;   
import java.util.Properties;   
/**  
 * 数据库连接对象管理类  
 * @说明  
 * @author cuisuqiang  
 * @version 1.0  
 * @since  
 */   
public class ConnectionManager {   
    private static final String url = "jdbc:mysql://localhost:3306/test";   
    private static final String username = "root";   
    private static final String userpass = "root";   
    @SuppressWarnings("deprecation")   
    public static void main(String[] args) throws Exception{   
        Connection conn = getConnection();   
        if (null != conn) {   
            String sql = "insert into common_user (name) values(?)";   
            // 指定返回生成的主键   
            PreparedStatement pstmt = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);    
            // 如果使用静态的SQL，则不需要动态插入参数   
            pstmt.setString(1, new Date().toLocaleString());   
            pstmt.executeUpdate();    
            // 检索由于执行此 Statement 对象而创建的所有自动生成的键    
            ResultSet rs = pstmt.getGeneratedKeys();    
            if (rs.next()) {   
                Long id = rs.getLong(1);    
                System.out.println("数据主键：" + id);    
            }   
        }   
    }   
    public static Connection getConnection() {   
        Connection conn = null;   
        try {              
            com.mysql.jdbc.Driver driver = new com.mysql.jdbc.Driver();   
            Properties properties = new Properties();   
            properties.put("user", username);   
            properties.put("password", userpass);   
            conn = driver.connect(url, properties);   
        } catch (Exception e) {   
            e.printStackTrace();   
        }   
        return conn;   
    }   
}  
```

 打印生成的主键：

`数据主键：25  `