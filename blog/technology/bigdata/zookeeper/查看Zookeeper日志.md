# 查看Zookeeper日志

zookeeper的事务日志通过zoo.cfg文件中的dataLogDir配置项配置，文件如下：

zookeeper提供了查看事务日志的工具类LogFormatter，运行：

 java -classpath.:slf4j-api-1.6.1.jar:zookeeper-3.4.5.jarorg.apache.zookeeper.server.LogFormatter/export1/zookeeper/logs/version-2/log.1000003d2 

注意：slf4j-api-1.6.1.jar和jar:zookeeper-3.4.5.jar可以通过find命令找到，如find  / -name jar:zookeeper-3.4.5.jar

例如，我的环境得到的结果为:

```
jerrydeMacBookPro:3.4.9 jerryye$ java -classpath .:/Users/jerryye/.m2/repository/org/apache/zookeeper/zookeeper/3.4.9/slf4j-api-1.7.6.jar:/Users/jerryye/.m2/repository/org/apache/zookeeper/zookeeper/3.4.9/zookeeper-3.4.9.jar org.apache.zookeeper.server.LogFormatter /Users/jerryye/backup/software/development_software/zookeeper/single/tmp/datalog/version-2/log.1  | less
```

将看到格式化的日志内容类似：

```
ZooKeeper Transactional Log File with dbid 0 txnlog format version 2  
5/12/14 7:06:31 PM CST session 0x145ef610b530000 cxid 0x229e zxid 0x1000003e8 delete '/hbase/region-in-transition/e3d18e83988febe321e563f085210127  
5/12/14 7:06:31 PM CST session 0x245ef610b52004c cxid 0x0 zxid 0x1000003e9 createSession 40000  
5/12/14 7:06:31 PM CST session 0x245ef610b52004c cxid 0x3 zxid 0x1000003ea closeSession null  
5/12/14 7:06:31 PM CST session 0x545f01346c60001 cxid 0x0 zxid 0x1000003eb createSession 40000  
5/12/14 7:06:31 PM CST session 0x545f01346c60001 cxid 0x3 zxid 0x1000003ec closeSession null  
5/12/14 7:06:32 PM CST session 0x445f018d5e00002 cxid 0x0 zxid 0x1000003ed createSession 40000  
5/12/14 7:06:32 PM CST session 0x445f018d5e00002 cxid 0x3 zxid 0x1000003ee closeSession null  
5/12/14 7:06:32 PM CST session 0x145ef610b530000 cxid 0x22a1 zxid 0x1000003ef setData '/hbase/table/wyp,#ffffffff000146d61737465723a36303030303b36ffffffc765ffffffb0ffffffa5ffffffa3745042554681,5  
5/12/14 7:06:32 PM CST session 0x145ef610b530000 cxid 0x22a3 zxid 0x1000003f0 delete '/hbase/table-lock/wyp/write-master:600000000000002  
5/12/14 7:06:32 PM CST session 0x145ef610b530033 cxid 0x0 zxid 0x1000003f1 createSession 40000  
5/12/14 7:06:32 PM CST session 0x145ef610b530033 cxid 0x3 zxid 0x1000003f2 closeSession null  
```

http://blog.csdn.net/qq_16365849/article/details/45041293