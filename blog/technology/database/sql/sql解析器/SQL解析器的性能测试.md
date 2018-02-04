# SQL解析器的性能测试 

maven版本:

```
        <dependency>
            <groupId>com.github.jsqlparser</groupId>
            <artifactId>jsqlparser</artifactId>
            <version>0.9.6</version>
            <!--<version>1.0</version>-->
        </dependency>
        <dependency>
            <groupId>com.foundationdb</groupId>
            <artifactId>fdb-sql-parser</artifactId>
            <version>1.6.1</version>
        </dependency>
        <dependency>
            <groupId>com.alibaba</groupId>
            <artifactId>druid</artifactId>
            <version>1.0.11</version>
        </dependency>
```

对同一个sql语句，使用3种解析器解析出ast语法树（这是编译原理上的说法，在sql解析式可能就是解析器自定义的statement类型），执行100万次的时间对比。

```
package com.practice;

import java.io.StringReader;
import java.sql.SQLSyntaxErrorException;

import net.sf.jsqlparser.JSQLParserException;
import net.sf.jsqlparser.parser.CCJSqlParser;
import net.sf.jsqlparser.parser.CCJSqlParserManager;
import net.sf.jsqlparser.statement.Statement;

//import org.opencloudb.parser.SQLParserDelegate;

import com.alibaba.druid.sql.ast.SQLStatement;
import com.alibaba.druid.sql.dialect.mysql.parser.MySqlStatementParser;
import com.foundationdb.sql.parser.QueryTreeNode;
import com.foundationdb.sql.parser.SQLParser;
import com.foundationdb.sql.parser.SQLParserFeature;


public class TestParser {
    public static void main(String[] args) {
        String sql = "insert into employee(id,name,sharding_id) values(5, 'wdw',10010)";
        int count = 1000000;
        long start = System.currentTimeMillis();
        System.out.println(start);
        try {
            for(int i = 0; i < count; i++) {
                SQLParser parser = new SQLParser();
                parser.getFeatures().add(SQLParserFeature.DOUBLE_QUOTED_STRING);
                parser.getFeatures().add(SQLParserFeature.MYSQL_HINTS);
                parser.getFeatures().add(SQLParserFeature.MYSQL_INTERVAL);
                // fix 位操作符号解析问题 add by micmiu
                parser.getFeatures().add(SQLParserFeature.INFIX_BIT_OPERATORS);
                QueryTreeNode ast =parser.parseStatement(sql);
                //  QueryTreeNode ast = SQLParserDelegate.parse(sql,"utf-8" );
            }

        } catch (Exception e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }
        long end = System.currentTimeMillis();
        System.out.println(count + "times parse,fdb cost:" + (end - start) + "ms");

        start = end;
        try {
            for(int i = 0; i < count; i++) {
                //Statements stmt = CCJSqlParserUtil.parseStatements(sql);
                Statement stmt =new CCJSqlParserManager().parse(new StringReader(sql));
            }
        } catch (JSQLParserException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }
        end = System.currentTimeMillis();
        System.out.println(count + "times parse,JSQLParser cost:" + (end - start) + "ms");

        start = end;
        for(int i = 0; i < count; i++) {
            MySqlStatementParser parser = new MySqlStatementParser(sql);
            SQLStatement statement = parser.parseStatement();
        }

        end = System.currentTimeMillis();
        System.out.println(count + "times parse ,druid cost:" + (end - start) + "ms");
    }
}
```

1419327695186
1000000times parse,fdb cost:24468ms
1000000times parse,JSQLParser cost:11469ms
1000000times parse ,druid cost:1454ms

```
1517628709002
1000000times parse,fdb cost:19676ms
1000000times parse,JSQLParser cost:13532ms
1000000times parse ,druid cost:1225ms
```

**100万次：druid比fdbparser快16倍，比JSQLParser快近8倍**

参考：Mycat路由新解析器选型分析与结果.docx

https://github.com/MyCATApache/Mycat-doc/blob/master/Mycat%E8%B7%AF%E7%94%B1%E6%96%B0%E8%A7%A3%E6%9E%90%E5%99%A8%E9%80%89%E5%9E%8B%E5%88%86%E6%9E%90%E4%B8%8E%E7%BB%93%E6%9E%9C.docx



http://blog.csdn.net/wind520/article/details/42109061