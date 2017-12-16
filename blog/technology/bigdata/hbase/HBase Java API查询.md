# HBase java API查询

查询操作，不管是关系型数据库，还是非关系型数据库，相对于增删改，都占了很大的比重。

查询不易，且行且珍惜。

使用HBase的java api来进行查询，

主要有两种方式，一种是直接通过rowkey（类似于主键）来查询；另一种是scan，扫描表（扫描某一列族，扫描某一colume，以rowkey的开始和结束做为一个范围进行扫描）

## 方式一:直接通过rowkey（类似于主键）来查询

### 1、通过rowkey来查询一条记录

```
//根据rowkey查询一条记录
public void queryByRowKey(Configuration conf,String tableName,String rowKey){
          HTable hTable = null;
        try {
            hTable = new HTable(conf, tableName);
            Get get = new Get( rowKey.getBytes());
            Result result = hTable.get(get);
            System.out.println("rowkey为:" + rowKey);
            for (KeyValue kv: result.raw()) {
                System.out.println("columnFamily:" + new String(kv.getFamily()) +",   column:" + new String(kv.getQualifier()) + ",   value:" + new String(kv.getValue()));
            }
        } catch (IOException e) {
            e.printStackTrace();
        }finally {
            try {
                hTable.close();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
}
```

## 方式二:通过scan，扫描表（扫描某一列族，扫描某一colume，以rowkey的开始和结束做为一个范围进行扫描）

### 1、扫描整个表

```
//扫描hbase表，获取所有记录
public void getAllRow(Configuration conf, String tableName){
    HTable hTable = null;
    ResultScanner rs = null;
    try {
        hTable = new HTable(conf, "DANIU");
        rs = hTable.getScanner(new Scan());
        //循环rowkey
        for (Result result : rs) {
            for (KeyValue kv : result.raw()) {
                System.err.println("rowkey:" + new String(kv.getKey()));
                System.err.println("-------------------------------");
                System.err.println("columnFamily:" + new String(kv.getFamily()) +"===column:" + new String(kv.getQualifier()) + "===getValue:" + new String(kv.getValue()));
            }
        }
    } catch (IOException e) {
        e.printStackTrace();
    } finally{
        rs.close();
        try {
            hTable.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
```

### 2、根据一个条件，扫描。使用一个filter

```
//根据查询多条记录，一个filter的使用
public void filterSingleColumnValueFilter(Configuration conf,String tableName){
    HTable hTable = null;
    ResultScanner rs = null;
    try {
        hTable = new HTable(conf, tableName);
        Filter filter = new SingleColumnValueFilter("columnfamily1".getBytes(), null, CompareOp.EQUAL, "value1".getBytes());
        Scan scan = new Scan();
        scan.setFilter(filter);
        rs = hTable.getScanner(scan);
        for (Result result : rs) {
            for (KeyValue kv : result.raw()) {
                System.err.println("rowkey:" + new String(kv.getKey()));
                System.err.println("-------------------------------");
                System.err.println("columnFamily:" + new String(kv.getFamily()) +"===column:" + new String(kv.getQualifier()) + "===getValue:" + new String(kv.getValue()));
            }
        }
    } catch (IOException e) {
        e.printStackTrace();
    }finally{
        rs.close();
        try {
            hTable.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
```

### 3、使用多个条件来查询数据。多个filter的使用。

```
//更多条件，查询更多数据，多个filter的使用。
public void filterMore(Configuration conf,String tableName){
    HTable hTable = null;
    ResultScanner rs = null;
    try {
        hTable = new HTable(conf, tableName);
        List<Filter> filters = new ArrayList<Filter>();
         
        Filter filter1 = new SingleColumnValueFilter("columnfamily1".getBytes(), null, CompareOp.EQUAL, "value1".getBytes());
        filters.add(filter1);
         
        Filter filter2 = new SingleColumnValueFilter("columnfamily2".getBytes(), null, CompareOp.EQUAL, "value2".getBytes());
        filters.add(filter2);
         
        //还可以添加更多的filter
        Scan scan = new Scan();
        rs = hTable.getScanner(scan);
        for (Result result : rs) {
            for (KeyValue kv : result.raw()) {
                System.err.println("rowkey:" + new String(kv.getKey()));
                System.err.println("-------------------------------");
                System.err.println("columnFamily:" + new String(kv.getFamily()) +"===column:" + new String(kv.getQualifier()) + "===getValue:" + new String(kv.getValue()));
            }
        }
    } catch (IOException e) {
        e.printStackTrace();
    }finally{
        rs.close();
        try {
            hTable.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
```





 http://www.daniubiji.cn/archives/219

 

 