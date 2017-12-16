配置文件在config/server.properties

下面的一些配置可能是你需要进行修改的。

| broker.id                  | 整数，建议根据ip区分                 |                                      |
| -------------------------- | --------------------------- | ------------------------------------ |
| log.dirs                   | kafka存放消息文件的路径，             | 默认/tmp/kafka-logs                    |
| port                       | broker用于接收producer消息的端口     |                                      |
| zookeeper.connnect         | zookeeper连接                 | 格式为  ip1:port,ip2:port,ip3:port      |
| message.max.bytes          | 单条消息的最大长度                   |                                      |
| num.network.threads        | broker用于处理网络请求的线程数          | 如不配置默认为3，server.properties默认是2       |
| num.io.threads             | broker用于执行网络请求的IO线程数        | 如不配置默认为8，server.properties默认是2可适当增大， |
| queued.max.requests        | 排队等候IO线程执行的requests         | 默认为500                               |
| host.name                  | broker的hostname             | 默认null,建议写主机的ip,不然消费端不配置hosts会有麻烦    |
| num.partitions             | topic的默认分区数                 | 默认1                                  |
| log.retention.hours        | 消息被删除前保存多少小时                | 默认1周168小时                            |
| auto.create.topics.enable  | 是否可以程序自动创建Topic             | 默认true,建议false                       |
| default.replication.factor | 消息备份数目                      | 默认1不做复制，建议修改                         |
| num.replica.fetchers       | 用于复制leader消息到follower的IO线程数 | 默认1                                  |