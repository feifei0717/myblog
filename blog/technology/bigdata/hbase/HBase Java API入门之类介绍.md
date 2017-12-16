#  HBase Java API入门类介绍

# 概括 

1. 创建、删除及启用禁用表、添加列等都需用到HBaseAdmin，另外需要注意删除，添加列等操作都需要禁用表
2. 表中添加数据，查询等都是和HTable相关，如果是多线程的情况下注意用HTablePool
3. 插入数据使用Put，可以单行添加也可批量添加
4. 查询数据需使用Get，Result，Scan、ResultScanner等



# 一、HBaseConfiguration

------

 

 

org.apache.hadoop.hbase.HBaseConfiguration 对HBase进行配置

| 返回值    | 函数                                       | 描述                                       |
| ------ | ---------------------------------------- | ---------------------------------------- |
| void   | addResource(Path file)                   | 通过给定的路径所指的文件来添加资源                        |
| void   | clear()                                  | 清空所有已设置的属性                               |
| string | get(String name)                         | 获取属性名对应的值                                |
| String | getBoolean(String name, boolean defaultValue) | 获取为boolean类型的属性值，如果其属性值类型部位boolean,则返回默认属性值 |
| void   | set(String name, String value)           | 通过属性名来设置值                                |
| void   | setBoolean(String name, boolean value)   | 设置boolean类型的属性值                          |

eg：



```
    static Configuration cfg = HBaseConfiguration.create();
    static {
        
        cfg.set("hbase.zookeeper.quorum", "192.168.1.95");
        cfg.set("hbase.zookeeper.property.clientPort", "2181");
    }
```



 

　

# 二、HBaseAdmin

------

 

 

org.apache.hadoop.hbase.client.HBaseAdmin 提供了一个接口来管理HBase数据库的表信息。它提供的方法包括：创建表，删除表，列出表项，使表有效或无效，以及添加或删除表列族成员等。

| 返回值                                      | 函数                                       | 描述                        |
| ---------------------------------------- | ---------------------------------------- | ------------------------- |
| void                                     | addColumn(String tableName, HColumnDescriptor column) | 向一个已经存在的表添加咧              |
| checkHBaseAvailable(HBaseConfiguration conf) | 静态函数，查看HBase是否处于运行状态                     |                           |
| createTable(HTableDescriptor desc)       | 创建一个表，同步操作                               |                           |
| deleteTable(byte[] tableName)            | 删除一个已经存在的表                               |                           |
| enableTable(byte[] tableName)            | 使表处于有效状态                                 |                           |
| disableTable(byte[] tableName)           | 使表处于无效状态                                 |                           |
| HTableDescriptor[]                       | listTables()                             | 列出所有用户控件表项                |
| void                                     | modifyTable(byte[] tableName, HTableDescriptor htd) | 修改表的模式，是异步的操作，可能需要花费一定的时间 |
| boolean                                  | tableExists(String tableName)            | 检查表是否存在                   |

 

eg：

判断表是否存在：



```
HBaseAdmin hBaseAdmin = new HBaseAdmin(cfg);
if (hBaseAdmin.tableExists(tableName)) {// 如果存在要创建的表，那么先删除，再创建
 　hBaseAdmin.disableTable(tableName);
　　hBaseAdmin.deleteTable(tableName);
　　System.out.println(tableName + " is exist");
}
```



创建表：

```
hBaseAdmin.createTable(tableDescriptor);
```

添加列：

```
hBaseAdmin = new HBaseAdmin(cfg);
hBaseAdmin.disableTable(tableName); 
HColumnDescriptor hd = new HColumnDescriptor(columnFamily);
hBaseAdmin.addColumn(tableName,hd);
```

 

 

# 三、HTableDescriptor

------

 

 

org.apache.hadoop.hbase.HTableDescriptor 包含了表的名字极其对应表的列族

| 返回值               | 函数                                 | 描述     |
| ----------------- | ---------------------------------- | ------ |
| void              | addFamily(HColumnDescriptor)       | 添加一个列族 |
| HColumnDescriptor | removeFamily(byte[] column)        | 移除一个列族 |
| byte[]            | getName()                          | 获取表的名字 |
| byte[]            | getValue(byte[] key)               | 获取属性的值 |
| void              | setValue(String key, String value) | 设置属性的值 |

 

eg：创建表时添加列

```
HTableDescriptor tableDescriptor = new HTableDescriptor(tableName);// 代表表的schema
tableDescriptor.addFamily(new HColumnDescriptor("name")); // 增加列簇
tableDescriptor.addFamily(new HColumnDescriptor("age"));
tableDescriptor.addFamily(new HColumnDescriptor("gender"));
hBaseAdmin.createTable(tableDescriptor);
```

 

 

 

 

# 四、HColumnDescriptor

------

 

 

关系：org.apache.hadoop.hbase.HColumnDescriptor

作用：维护着关于列族的信息，例如版本号，压缩设置等。它通常在创建表或者为表添加列族的时候使用。列族被创建后不能直接修改，只能通过删除然后重新创建的方式。列族被删除的时候，列族里面的数据也会同时被删除。

| 返回值    | 函数                                 | 描述        |
| ------ | ---------------------------------- | --------- |
| byte[] | getName()                          | 获取列族的名字   |
| byte[] | getValue(byte[] key)               | 获取对应的属性的值 |
| void   | setValue(String key, String value) | 设置对应属性的值  |

eg：见上面

 

# 五、HTable

------

 

 

org.apache.hadoop.hbase.client.HTable 可以用来和HBase表直接通信。此方法对于更新操作来说是非线程安全的。

| 返回值              | 函数                                       | 描述                                 |
| ---------------- | ---------------------------------------- | ---------------------------------- |
| void             | checkAdnPut(byte[] row, byte[] family, byte[] qualifier, byte[] value, Put put | 自动的检查row/family/qualifier是否与给定的值匹配 |
| void             | close()                                  | 释放所有的资源或挂起内部缓冲区中的更新                |
| Boolean          | exists(Get get)                          | 检查Get实例所指定的值是否存在于HTable的列中         |
| Result           | get(Get get)                             | 获取指定行的某些单元格所对应的值                   |
| byte[][]         | getEndKeys()                             | 获取当前一打开的表每个区域的结束键值                 |
| ResultScanner    | getScanner(byte[] family)                | 获取当前给定列族的scanner实例                 |
| HTableDescriptor | getTableDescriptor()                     | 获取当前表的HTableDescriptor实例           |
| byte[]           | getTableName()                           | 获取表名                               |
| static boolean   | isTableEnabled(HBaseConfiguration conf, String tableName) | 检查表是否有效                            |
| void             | put(Put put)                             | 向表中添加值                             |

eg：



```
    　　HTablePool pool = new HTablePool(cfg, 1000);
        // HTable table = (HTable) pool.getTable(tableName);

        Put put = new Put("*1111".getBytes());// 一个PUT代表一行数据，再NEW一个PUT表示第二行数据,每行一个唯一的ROWKEY，此处rowkey为put构造方法中传入的值
        put.add("name".getBytes(), null, "Chander".getBytes());// 本行数据的第一列
        put.add("age".getBytes(), null, "20".getBytes());// 本行数据的第三列
        put.add("gender".getBytes(), null, "male".getBytes());// 本行数据的第三列
        put.add("score".getBytes(), "Math".getBytes(), "99".getBytes());// 本行数据的第四列
        put.add("score".getBytes(), "English".getBytes(), "100".getBytes());// 本行数据的第四列
        put.add("score".getBytes(), "Chinese".getBytes(), "120".getBytes());// 本行数据的第四列   第二个参数对应qualifier
        try {
            pool.getTable(tableName).put(put);
        } catch (IOException e) {
            e.printStackTrace();
        }
```



 

 

# 六、Put

------

 

 

关系：org.apache.hadoop.hbase.client.Put

作用：用来对单个行执行添加操作

| 返回值     | 函数                                       | 描述                      |
| ------- | ---------------------------------------- | ----------------------- |
| Put     | add(byte[] family, byte[] qualifier, byte[] value) | 将指定的列和对应的值添加到Put实例中     |
| Put     | add(byte[] family, byte[] qualifier, long ts, byte[] value) | 将指定的列和对应的值及时间戳添加到Put实例中 |
| byte[]  | getRow()                                 | 获取Put实例的行               |
| RowLock | getRowLock()                             | 获取Put实例的行锁              |
| long    | getTimeStamp()                           | 获取Put实例的时间戳             |
| boolean | isEmpty()                                | 检查familyMap是否为空         |
| Put     | setTimeStamp(long timeStamp)             | 设置Put实例的时间戳             |

eg：见上例



# 七、Get

------

 

 

org.apache.hadoop.hbase.client.Get ：用来获取单个行的相关信息

| 返回值  | 函数                                       | 描述                  |
| ---- | ---------------------------------------- | ------------------- |
| Get  | addColumn(byte[] family, byte[] qualifier) | 获取指定列族和列修饰符对应的列     |
| Get  | addFamily(byte[] family)                 | 通过指定的列族获取其对应列的所有列   |
| Get  | setTimeRange(long minStamp,long maxStamp) | 获取指定取件的列的版本号        |
| Get  | setFilter(Filter filter)                 | 当执行Get操作时设置服务器端的过滤器 |

eg：



```
 　　　　HTable table = new HTable(cfg, tablename);
        Get g = new Get(rowKey.getBytes());
        Result rs = table.get(g);

        for (KeyValue kv : rs.raw())
        {
            System.out.println("rowkey:        " + new String(kv.getRow()));
            System.out.println("Column Family: " + new String(kv.getFamily()));
            System.out.println("Column       : " + new String(kv.getQualifier()));
            System.out.println("value        : " + new String(kv.getValue()));
        }
```



 

 

 

# 八、Result

------

 

org.apache.hadoop.hbase.client.Result 存储Get或者Scan操作后获取表的单行值。使用此类提供的方法可以直接获取值或者各种Map结构（key-value对）

| 返回值                         | 函数                                       | 描述                  |
| --------------------------- | ---------------------------------------- | ------------------- |
| boolean                     | containsColumn(byte[] family, byte[] qualifier) | 检查指定的列是否存在          |
| NavigableMap<byte[],byte[]> | getFamilyMap(byte[] family)              | 获取对应列族所包含的修饰符与值的键值对 |
| byte[]                      | getValue(byte[] family, byte[] qualifier) | 获取对应列的最新值           |



eg：



```
 　　　　HTable table = new HTable(cfg, tablename);
        Get g = new Get(rowKey.getBytes());
        Result rs = table.get(g);

        for (KeyValue kv : rs.raw())
        {
            System.out.println("rowkey:        " + new String(kv.getRow()));
            System.out.println("Column Family: " + new String(kv.getFamily()));
            System.out.println("Column       : " + new String(kv.getQualifier()));
            System.out.println("value        : " + new String(kv.getValue()));
        }
```



# 九、Scan

------

 

import org.apache.hadoop.hbase.client.Scan 扫描，类似于数据库中的cursor，使用和get类似，也类似于迭代器

可以使用new Scan() 也可以调用HTable的getScanner()方法次方法返回扫描器scanner

 

eg1：

```
Scan scan = new Scan();
ResultScanner scanner = htable.getScanner(scan);
for(Result rs: scanner){
   System.out.println(rs);  
}
```

 

eg2:



```
Scan scan = new Scan();
scan.addFamily(Bytes.toBytes("columnFamily1"));
ResultScanner scanner = htable.getScanner(scan);
for(Result rs: scanner){
   System.out.println(rs);  
}
```



 

eg3:



```
Scan scan = new Scan();
scan.addFamily(Bytes.toBytes("columnFamily1"),Bytes.toBytes("column1"));
ResultScanner scanner = htable.getScanner(scan);
for(Result rs: scanner){
   System.out.println(rs);  
}
```



 

eg4: 添加过滤器



```
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
```



 

 

# 十、ResultScanner

------

 见9中Scan

 

 

| 返回值    | 函数      | 描述                  |
| ------ | ------- | ------------------- |
| void   | close() | 关闭scanner并释放分配给它的资源 |
| Result | next()  | 获取下一行的值             |

 

 

eg：



```
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
```

  

 

参考：http://www.cnblogs.com/wishyouhappy/p/3753347.html

 