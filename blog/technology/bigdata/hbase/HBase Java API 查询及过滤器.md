# HBase Java API 查询及过滤器



# 简介

查询操作，不管是关系型数据库，还是非关系型数据库，相对于增删改，都占了很大的比重。

查询不易，且行且珍惜。

使用HBase的java api来进行查询，

主要有两种方式，

1. 一种是直接通过rowkey（类似于主键）、行、列簇等查询；
2. 另一种是scan，扫描表过滤（扫描某一列族，扫描某一colume，以rowkey的开始和结束做为一个范围进行扫描）;

 

# 按rowKey、行、列簇等查询

/Users/jerryye/backup/studio/AvailableCode/bigdata/hbase/hbase_demo/src/main/java/com/practice/HBaseQuerydata.java

```
package com.practice;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import org.apache.hadoop.conf.Configuration;
import org.apache.hadoop.hbase.HBaseConfiguration;
import org.apache.hadoop.hbase.KeyValue;
import org.apache.hadoop.hbase.client.Get;
import org.apache.hadoop.hbase.client.HTable;
import org.apache.hadoop.hbase.client.HTablePool;
import org.apache.hadoop.hbase.client.Result;
import org.apache.hadoop.hbase.client.ResultScanner;
import org.apache.hadoop.hbase.client.Scan;
import org.apache.hadoop.hbase.filter.CompareFilter.CompareOp;
import org.apache.hadoop.hbase.filter.FilterList;
import org.apache.hadoop.hbase.filter.SingleColumnValueFilter;
import org.apache.hadoop.hbase.util.Bytes;

/**
 * <B>Description:</B> habse 查询数据示例 <br>
 * <B>Create on:</B> 2017/11/17 下午4:21 <br>
 *
 * @author xiangyu.ye
 * @version 1.0
 */
public class HBaseQuerydata {
    static Configuration cfg = HBaseConfiguration.create();
    static {
        cfg.set("hbase.zookeeper.quorum", "localhost");
        cfg.set("hbase.zookeeper.property.clientPort", "2181");
    }

    public static void queryByRowKey(String tablename, String rowKey) throws IOException {
        HTable table = new HTable(cfg, tablename);
        Get g = new Get(rowKey.getBytes());
        Result rs = table.get(g);

        for (KeyValue kv : rs.raw()) {
            System.out.println("rowkey:        " + new String(kv.getRow()));
            System.out.println("Column Family: " + new String(kv.getFamily()));
            System.out.println("Column       : " + new String(kv.getQualifier()));
            System.out.println("value        : " + new String(kv.getValue()));
        }
    }

    public static void queryByRowKeyFamily(String tablename, String rowKey,
                                           String family) throws IOException {
        HTable table = new HTable(cfg, tablename);
        Get g = new Get(rowKey.getBytes());
        g.addFamily(Bytes.toBytes(family));
        Result rs = table.get(g);
        for (KeyValue kv : rs.raw()) {
            System.out.println("rowkey:        " + new String(kv.getRow()));
            System.out.println("Column Family: " + new String(kv.getFamily()));
            System.out.println("Column       : " + new String(kv.getQualifier()));
            System.out.println("value        : " + new String(kv.getValue()));
        }
    }

    public static void queryByRowKeyFamilyColumn(String tablename, String rowKey, String family,
                                                 String column) throws IOException {
        HTable table = new HTable(cfg, tablename);
        Get g = new Get(rowKey.getBytes());
        g.addColumn(family.getBytes(), column.getBytes());

        Result rs = table.get(g);

        for (KeyValue kv : rs.raw()) {
            System.out.println("rowkey:        " + new String(kv.getRow()));
            System.out.println("Column Family: " + new String(kv.getFamily()));
            System.out.println("Column       : " + new String(kv.getQualifier()));
            System.out.println("value        : " + new String(kv.getValue()));
        }
    }

    /*
     * 查询所有
     */
    public static void queryAll(String tableName) {
        HTablePool pool = new HTablePool(cfg, 1000);
        try {
            ResultScanner rs = pool.getTable(tableName).getScanner(new Scan());
            for (Result r : rs) {
                System.out.println("rowkey:" + new String(r.getRow()));
                for (KeyValue keyValue : r.raw()) {
                    System.out.println("列族：" + new String(keyValue.getFamily()) + "     列:"
                                       + new String(keyValue.getQualifier()) + "     值:"
                                       + new String(keyValue.getValue()));
                }
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    public static void main(String[] args) throws Exception {
        System.out.println("******************************queryall******************************");
        queryAll("wishTest1");
        System.out
            .println("******************************query by rowkey******************************");
        queryByRowKey("wishTest1", "6");
        System.out.println(
            "******************************query by rowkey family******************************");
        queryByRowKeyFamily("wishTest1", "6", "name");
        System.out.println(
            "******************************query by rowkey family column******************************");
        queryByRowKeyFamilyColumn("wishTest1", "6", "score", "Chinese");
    }
}
```

输出如下：

```

******************************queryall****************************** 
rowkey:6
列族：age     列:     值:20
列族：gender     列:     值:male
列族：name     列:     值:Joey
列族：score     列:Chinese     值:100
列族：score     列:English     值:100
列族：score     列:Math     值:90
******************************query by rowkey******************************
rowkey:        6
Column Family: age
Column       : 
value        : 20
rowkey:        6
Column Family: gender
Column       : 
value        : male
rowkey:        6
Column Family: name
Column       : 
value        : Joey
rowkey:        6
Column Family: score
Column       : Chinese
value        : 100
rowkey:        6
Column Family: score
Column       : English
value        : 100
rowkey:        6
Column Family: score
Column       : Math
value        : 90
******************************query by rowkey family******************************
rowkey:        6
Column Family: name
Column       : 
value        : Joey
******************************query by rowkey family column******************************
rowkey:        6
Column Family: score
Column       : Chinese
value        : 100
 

```



# 行过滤器 

使用过滤器可以提高操作表的效率，HBase中两种数据读取函数get()和scan()都支持过滤器

可以使用预定义好的过滤器或者是实现自定义过滤器

过滤器在客户端创建，通过RPC传送到服务器端，在服务器端执行过滤操作

 

行过滤器简单例子如下：

测试table中所有数据如下：

```
rowkey:1121
列：age     值:20
列：gender     值:male
列：name     值:Chander
列：score     值:120
列：score     值:100
列：score     值:99
rowkey:1111
列：age     值:20
列：gender     值:male
列：name     值:Chander
列：score     值:120
列：score     值:100
列：score     值:99
rowkey:1
列：age     值:20
列：gender     值:male
列：name     值:rain
rowkey:2
列：age     值:20
列：gender     值:female
列：name     值:wish
rowkey:3
列：age     值:20
列：gender     值:male
列：name     值:Joey
rowkey:4
列：age     值:20
列：gender     值:male
列：name     值:Jenny
列：score     值:90
列：score     值:100
列：score     值:100
列：score     值:90
rowkey:5
列：age     值:20
列：gender     值:male
列：name     值:Chander
列：score     值:120
列：score     值:100
列：score     值:99
rowkey:6
列：age     值:20
列：gender     值:male
列：name     值:Joey
列：score     值:100
列：score     值:100
列：score     值:90
```

eg1：

```
public static void rowFilterLESS_OR_EQUAL(String tableName, String columnFamily, String column, String condition){
        System.out.println("***********************start rowFilterLESS_OR_EQUAL***************************");
        Scan scan = new Scan();
        scan.addColumn(Bytes.toBytes(columnFamily),Bytes.toBytes(column));
        
        Filter f = new RowFilter(CompareFilter.CompareOp.LESS_OR_EQUAL, new BinaryComparator(Bytes.toBytes(condition)));
        scan.setFilter(f);
        HTablePool pool = new HTablePool(cfg, 1000); 
        try {
            ResultScanner resultScanner = pool.getTable(tableName).getScanner(scan);
            Result rs = resultScanner.next();
                for (; rs != null; rs = resultScanner.next())
                {
                    for (KeyValue kv : rs.list())
                    {
                        System.out.println("-------------------------------");
                        System.out.println("rowkey:        " + new String(kv.getRow()));
                        System.out.println("Column Family: " + new String(kv.getFamily()));
                        System.out.println("Column       :" + new String(kv.getQualifier()));
                        System.out.println("value        : " + new String(kv.getValue()));
                    }
                }
            
        } catch (IOException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }
        System.out.println("***********************end rowFilterLESS_OR_EQUAL***************************");

    }
```



```
public static void main(String[] args) {
        String tableName = "wishTest1";
        HBaseFilter.rowFilterLESS_OR_EQUAL(tableName, "score", "Math", "4");
    }
```



输出：

```
***********************start rowFilterLESS_OR_EQUAL***************************

-------------------------------
rowkey:        ****1121
Column Family: score
Column       :Math
value        : 99
-------------------------------
rowkey:        *1111
Column Family: score
Column       :Math
value        : 99
-------------------------------
rowkey:        4
Column Family: score
Column       :Math
value        : 90
-------------------------------
rowkey:        5
Column Family: score
Column       :Math
value        : 99
***********************end rowFilterLESS_OR_EQUAL***************************
```



 

eg2：



```
    /*
     * rowFilterRegex
     */
    public static void rowFilterRegex(String tableName, String columnFamily, String column, String condition){
        System.out.println("***********************start rowFilterRegex***************************");
        Scan scan = new Scan();
        scan.addColumn(Bytes.toBytes(columnFamily),Bytes.toBytes(column));
        
        Filter f = new RowFilter(CompareFilter.CompareOp.EQUAL, new RegexStringComparator("\\*."));
        scan.setFilter(f);
        HTablePool pool = new HTablePool(cfg, 1000); 
        try {
            ResultScanner resultScanner = pool.getTable(tableName).getScanner(scan);
            Result rs = resultScanner.next();
                for (; rs != null; rs = resultScanner.next())
                {
                    for (KeyValue kv : rs.list())
                    {
                        System.out.println("-------------------------------");
                        System.out.println("rowkey:        " + new String(kv.getRow()));
                        System.out.println("Column Family: " + new String(kv.getFamily()));
                        System.out.println("Column       :" + new String(kv.getQualifier()));
                        System.out.println("value        : " + new String(kv.getValue()));
                    }
                }
            
        } catch (IOException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }
        System.out.println("***********************end rowFilterRegex***************************");

    }
```



```
public static void main(String[] args) {
        String tableName = "wishTest1";
        HBaseFilter.rowFilterRegex(tableName, "score", "Math", "\\*");
    }
```

输出：



```
***********************start rowFilterRegex***************************
-------------------------------
rowkey:        ****1121
Column Family: score
Column       :Math
value        : 99
-------------------------------
rowkey:        *1111
Column Family: score
Column       :Math
value        : 99
***********************end rowFilterRegex***************************
```



 

eg3：



```
/*
     * rowFilterSubstring
     */
    public static void rowFilterSubstring(String tableName, String columnFamily, String column, String condition){
        System.out.println("***********************start rowFilterSubstring***************************");
        Scan scan = new Scan();
        scan.addColumn(Bytes.toBytes(columnFamily),Bytes.toBytes(column));
        
        Filter f = new RowFilter(CompareFilter.CompareOp.EQUAL, new RegexStringComparator("\\*"));
        scan.setFilter(f);
        HTablePool pool = new HTablePool(cfg, 1000); 
        try {
            ResultScanner resultScanner = pool.getTable(tableName).getScanner(scan);
            Result rs = resultScanner.next();
            for (; rs != null; rs = resultScanner.next())
            {
                for (KeyValue kv : rs.list())
                {
                    System.out.println("-------------------------------");
                    System.out.println("rowkey:        " + new String(kv.getRow()));
                    System.out.println("Column Family: " + new String(kv.getFamily()));
                    System.out.println("Column       :" + new String(kv.getQualifier()));
                    System.out.println("value        : " + new String(kv.getValue()));
                }
            }
            
        } catch (IOException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }
        System.out.println("***********************end rowFilterSubstring***************************");
        
    }
```



```
    public static void main(String[] args) {
        String tableName = "wishTest1";
        HBaseFilter.rowFilterSubstring(tableName, "score", "Math", "\\*");
    }
```

输出同上

 

#  列簇过滤器

```
public static void familyFilterLess(String tableName, String condition){
        Filter filter = new FamilyFilter(CompareFilter.CompareOp.LESS, new BinaryComparator(Bytes.toBytes(condition)));
        Scan scan = new Scan();
        scan.setFilter(filter);
        HTablePool pool = new HTablePool(cfg,100);
        try {
            ResultScanner resultScanner = pool.getTable(tableName).getScanner(scan);
            Result rs = resultScanner.next();
            for (; rs != null; rs = resultScanner.next())
            {
                for (KeyValue kv : rs.list())
                {
                    System.out.println("-------------------------------");
                    System.out.println("rowkey:        " + new String(kv.getRow()));
                    System.out.println("Column Family: " + new String(kv.getFamily()));
                    System.out.println("Column       :" + new String(kv.getQualifier()));
                    System.out.println("value        : " + new String(kv.getValue()));
                }
            }
            
            resultScanner.close();
        } catch (IOException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }        
    }
    
    
    public static void main(String[] args) {
        String tableName = "wishTest1";
        HBaseFilter.familyFilterLess(tableName, "gender");
        //HBaseFilter.rowFilterSubstring(tableName, "score", "Math", "\\*");
    }
```



 

输出：



```
-------------------------------
rowkey:        ****1121
Column Family: age
Column       :
value        : 20
-------------------------------
rowkey:        *1111
Column Family: age
Column       :
value        : 20
-------------------------------
rowkey:        1
Column Family: age
Column       :
value        : 20
-------------------------------
rowkey:        2
Column Family: age
Column       :
value        : 20
-------------------------------
rowkey:        3
Column Family: age
Column       :
value        : 20
-------------------------------
rowkey:        4
Column Family: age
Column       :
value        : 20
-------------------------------
rowkey:        5
Column Family: age
Column       :
value        : 20
-------------------------------
rowkey:        6
Column Family: age
Column       :
value        : 20
```



 

 

# 列名过滤器

```
    /*
     * 列名过滤器
     */
    
    public static void qualifierFilterLess(String tableName, String condition){
        Filter filter = new QualifierFilter(CompareFilter.CompareOp.LESS, new BinaryComparator(Bytes.toBytes(condition)));
        Scan scan = new Scan();
        scan.setFilter(filter);
        HTablePool pool = new HTablePool(cfg,100);
        try {
            ResultScanner resultScanner = pool.getTable(tableName).getScanner(scan);
            Result rs = resultScanner.next();
            for (; rs != null; rs = resultScanner.next())
            {
                for (KeyValue kv : rs.list())
                {
                    System.out.println("-------------------------------");
                    System.out.println("rowkey:        " + new String(kv.getRow()));
                    System.out.println("Column Family: " + new String(kv.getFamily()));
                    System.out.println("Column       :" + new String(kv.getQualifier()));
                    System.out.println("value        : " + new String(kv.getValue()));
                }
            }
            
            resultScanner.close();
        } catch (IOException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }        
    }
    
```



 

#  值过滤器

```
    /*
     * 值过滤器
     */
    public static void valueFilterLess(String tableName, String condition){
        Filter filter = new ValueFilter(CompareFilter.CompareOp.LESS, new BinaryComparator(Bytes.toBytes(condition)));
        Scan scan = new Scan();
        scan.setFilter(filter);
        HTablePool pool = new HTablePool(cfg,100);
        try {
            ResultScanner resultScanner = pool.getTable(tableName).getScanner(scan);
            Result rs = resultScanner.next();
            for (; rs != null; rs = resultScanner.next())
            {
                for (KeyValue kv : rs.list())
                {
                    System.out.println("-------------------------------");
                    System.out.println("rowkey:        " + new String(kv.getRow()));
                    System.out.println("Column Family: " + new String(kv.getFamily()));
                    System.out.println("Column       :" + new String(kv.getQualifier()));
                    System.out.println("value        : " + new String(kv.getValue()));
                }
            }
            
            resultScanner.close();
        } catch (IOException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }        
    }
```





参考: http://www.cnblogs.com/wishyouhappy/p/3753760.html