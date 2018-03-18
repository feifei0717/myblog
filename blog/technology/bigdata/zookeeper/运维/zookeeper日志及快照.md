# zookeeper日志及快照

目录

## 事务日志可视化转换

```
#!/bin/sh
# scriptname: zkLog2txt.sh
# zookeeper事务日志为二进制格式，使用LogFormatter方法转换为可阅读的日志
if [ -z "$1" -o "$1" = "-h" ];then
    echo "Useage: $0 <LogFile> [zkDir]"
    echo "eg:
$0 /opt/zpdata/version-2/log.3000002c7 /opt/Timasync/zookeeper \\
|grep '^7/24/13'|grep -A 10 -B 10 GAEI_AF_NotifyServer|more"
    exit 0
fi
 
#LogFile=/dfs/zpdata/version-2/log.100000001
LogFile=$1
zkDir=$2
[ -z "$zkDir" ] && zkDir=/opt/zookeeper
[ ! -f "$LogFile" ] && echo "LogFile:$LogFile not exist!" && exit 1
[ ! -d "$zkDir" ] && echo "zkDir:$zkDir not exist!" && exit 1
[ ! -d "$zkDir/lib" ] && echo "zkDir:$zkDir/lib not exist!" && exit 1
 
#java -cp $zkDir/zookeeper.jar:$zkDir/lib/slf4j-api-1.6.1.jar:$zkDir/lib/slf4j-log4j12-1.6.1.jar:$zkDir/lib/log4j-1.2.15.jar \
#org.apache.zookeeper.server.LogFormatter "$LogFile"
 
JAVA_OPTS="$JAVA_OPTS -Djava.ext.dirs=$zkDir:$zkDir/lib"
java $JAVA_OPTS org.apache.zookeeper.server.LogFormatter "$LogFile"
```

查看zookeeper日志的方法：在zookeeper主机上执行 zkLog2txt.sh <zk日志文件>，如下：

```
zkLog2txt.sh /hadoop/zookeeper/version-2/log.a00000001 /opt/zookeeper|more
```

## 日志及快照清理

zookeeper主要存放了两类文件，一个是snapshot和log,前者是内存数的快照，后者类似mysql的binlog，将所有与修改数据相关的操作记录在log中，两类文件的目录可在配置文件中指定。

- 参考:
  - ZooKeepr日志清理: <http://blog.csdn.net/xiaolang85/article/details/21184293>
  - zookeeper 存储之文件格式分析: <http://blog.csdn.net/pwlazy/article/details/8080626>

正常运行过程中，ZK会不断地把快照数据和事务日志输出到这两个目录，并且如果没有人为操作的话，ZK自己是不会清理这些文件的，需要管理员来清理，这里介绍4种清理日志的方法。在这4种方法中，推荐使用第一种方法，对于运维人员来说，将日志清理工作独立出来，便于统一管理也更可控。毕竟zk自带的一些工具并不怎么给力，这里是社区反映的两个问题：

- <https://issues.apache.org/jira/browse/ZOOKEEPER-957>
- <http://zookeeper-user.578899.n2.nabble.com/PurgeTxnLog-td6304244.html>

### 文件删除脚本

第一种，也是运维人员最常用的，写一个删除日志脚本，每天定时执行即可：

```
#!/bin/bash 
#snapshot file dir 
dataDir=/home/yinshi.nc/test/zk_data/version-2
#tran log dir 
dataLogDir=/home/yinshi.nc/test/zk_log/version-2
#zk log dir 
logDir=/home/yinshi.nc/test/logs
#Leave 66 files 
count=66 
count=$[$count+1] 
ls -t $dataLogDir/log.* | tail -n +$count | xargs rm -f 
ls -t $dataDir/snapshot.* | tail -n +$count | xargs rm -f 
ls -t $logDir/zookeeper.log.* | tail -n +$count | xargs rm -f 
```

以上这个脚本定义了删除对应两个目录中的文件，保留最新的66个文件，可以将他写到crontab中，设置为每天凌晨2点执行一次就可以了。

## zkPurgeTxnLog工具

第二种，使用ZK的工具类PurgeTxnLog，它的实现了一种简单的历史文件清理策略，可以在这里看一下他的使用方法：<http://zookeeper.apache.org/doc/r3.4.3/api/index.html>

可以指定要清理的目录和需要保留的文件数目，简单使用如下：

```
java -cp zookeeper.jar:lib/slf4j-api-1.6.1.jar:lib/slf4j-log4j12-1.6.1.jar:lib/log4j-1.2.15.jar:conf \
org.apache.zookeeper.server.PurgeTxnLog <dataDir> <snapDir> -n <count> 
```

## zkCleanup.sh

第三种，对于上面这个Java类的执行，ZK自己已经写好了脚本，在bin/zkCleanup.sh中，所以直接使用这个脚本也是可以执行清理工作的。

```
/usr/lib/zookeeper/bin/zkCleanup.sh /hadoop/zookeeper/version-2/ 5
```

自动清理配置项

第四种，从3.4.0开始，zookeeper提供了自动清理snapshot和事务日志的功能，通过配置 autopurge.snapRetainCount 和 autopurge.purgeInterval 这两个参数能够实现定时清理了。这两个参数都是在zoo.cfg中配置的：

```
# 指定清理频率，单位是小时，默认是0，表示不开启自己清理功能。
autopurge.purgeInterval=6
 
# 和上面的参数搭配使用，指定需要保留的文件数目，默认是保留3个。
autopurge.snapRetainCount=5
```

来源： <<http://xstarcd.github.io/wiki/Cloud/zookeeper_log_snapshot.html>>