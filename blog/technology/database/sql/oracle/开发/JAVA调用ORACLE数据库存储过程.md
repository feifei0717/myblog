# JAVA调用ORACLE数据库存储过程

##  ConnUtils连接工具类

ConnUtils连接工具类：用来获取连接、释放资源

```Java
package com.ljq.test;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

/**
 * 连接工具类
 * 
 * ConnUtils类声明为final类说明此类不可以被继承
 * 
 * @author jiqinlin
 * 
 */
public final class ConnUtils {
    private static String url = "jdbc:oracle:thin:@localhost:1521:orcl";
    private static String user = "test";
    private static String password = "test";

    /**
     * 说明要访问此类只能通过static或单例模式
     */
    private ConnUtils() {
    }

    // 注册驱动 (只做一次)
    static {
        try {
            Class.forName("oracle.jdbc.driver.OracleDriver");
        } catch (ClassNotFoundException e) {
            throw new ExceptionInInitializerError(e);
        }
    }

    /**
     * 获取Connection对象
     * 
     * @return
     * @throws SQLException
     */
    public static Connection getConnection() throws SQLException {
        return DriverManager.getConnection(url, user, password);
    }

    /**
     * 释放资源
     * 
     * @param rs
     * @param st
     * @param conn
     */
    public static void free(ResultSet rs, Statement st, Connection conn) {
        try {
            if (rs != null)
                rs.close();
        } catch (SQLException e) {
            e.printStackTrace();
        } finally {
            try {
                if (st != null)
                    st.close();
            } catch (SQLException e) {
                e.printStackTrace();
            } finally {
                if (conn != null)
                    try {
                        conn.close();
                    } catch (SQLException e) {
                        e.printStackTrace();
                    }
            }
        }
    }
}
```

​             

## 创建带入参和出参存储过程

代码：

```
--带出参存储过程
CREATE OR REPLACE PROCEDURE stu_proc(v_name OUT VARCHAR2) AS
BEGIN 
  SELECT o.sname INTO v_name FROM student o where o.id = 2;
END;
```



创建带出入参存储过程代码

```
--带出入参存储过程
CREATE OR REPLACE PROCEDURE stu_proc(v_id IN NUMBER, v_name OUT VARCHAR2) AS
BEGIN 
  SELECT o.sname INTO v_name FROM student o where o.id = v_id;
END;
```

​           

## 使用JAVA调用带出入参存储过程

```java
package com.ljq.test;

import java.sql.CallableStatement;
import java.sql.Connection;
import java.sql.SQLException;
import java.sql.Types;

public class ProceTest {

    public static void main(String[] args) throws Exception {
        Connection conn = null;
        CallableStatement statement = null;
        String sql = "{call stu_proc(?, ?)}";
        try {
            conn = ConnUtils.getConnection();
            statement = conn.prepareCall(sql);
            statement.setInt(1, 1);
            statement.registerOutParameter(2, Types.VARCHAR);
            statement.executeUpdate();
            //输出：zhangsan
            String sname = statement.getString(2);
            System.out.println(sname);
        } catch (SQLException e) {
            e.printStackTrace();
        }finally{
            ConnUtils.free(null, statement, conn);
        }
    }

}
```

 