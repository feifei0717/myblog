# 一. Kafka中的相关概念的介绍

Kafka是一个scala实现的分布式消息中间件,其中涉及到的相关概念如下:

Kafka中传递的内容称为message(消息),message 是通过topic(话题)进行分组的 topic 和message 的关系是一对多的关系

我们称发布message的进程为producer ,就是说producer生成<topic->message>对然后 丢进kafka集群

相对应的称订阅topic处理对应message的进程为consumer

Kafka集群中的节点被称为broker 附加个图说明下:http://kafka.apache.org/documentation.

html

\#introduction

# 二. Kafka中的关键参数的配置

------

Broker(集群总的节点)配置

broker.id : 唯一确定的一个int 类型数字 log.dirs :存储kafka数据,默认路径 为/tmp/kafka-logs port:comsumer连接的端口号 zookeeper.conect: zookeeper的链接字符串,定义的格式如下 hostname1:port1,hostname2:port2,hostname3

num.partitions : 一个topic可以被分成多个paritions 管道,每个partiions中的message有序但是多个paritions中的顺序不能保证

2.Consumer 配置

group.id :string 类型 标志consumer隶属的consumer process 组 zookeeper.connect: hostname1:port1,hostname2:port2(/chroot/path 统一数据存储路径) zookeeper 中存储了kafka的comsumers和brokers(包括topic和partition)的基本信息

3.Producer配置 metadata.book.list :host1:port1,host2:port2 request.required.acks: 0.数据完成就直接提交(可能在服务器崩溃了的时候丢失数据) 1.wait until the server acknowledges the request as successful -1.no messages lost producer.type : 确定messages是否同步提交 sync serializer.class :kafka.serializer.DefaultEncoder message 的序列化类,默认编码器处理类型都是byte[]类型

# 三.Kafka的简单命令

------

Step 1: 启动服务器

 

首先启动zookeeper

 

linux：

bin/zookeeper-server-start.sh config/zookeeper.properties

window：

bin\windows\zookeeper-server-start.bat config\zookeeper.properties

(远程启动的时候需要在后面加上一个 & 作为后台进程,然后断开和远程的链接)

 

接着启动kafka服务器

 

linux：

bin/kafka-server-start.sh config/server.properties

window：

bin\windows\kafka-server-start.bat config\server.properties

 

Step 2: 创建 一个 topic

 

linux：

bin/kafka-topics.sh --create --zookeeper localhost:2181 --replication-factor 1 --partitions 1 --topic test

window：

bin\windows\kafka-topics.bat --create --zookeeper localhost:2181 --replication-factor 1 --partitions 1 --topic test

 

查看topic

linux：

bin/kafka-topics.sh --list --zookeeper localhost:2181

window：

bin\windows\kafka-topics.bat --list --zookeeper localhost:2181

 

Step 3:发送一些消息

 

linux：

bin/kafka-console-producer.sh --broker-list localhost:9092 --topic test

window：

bin\windows\kafka-console-producer.bat --broker-list localhost:9092 --topic test

This is a message

This is another message

Step 4: 启动一个客户端(消费者)

 

linux：

bin/kafka-console-consumer.sh --zookeeper localhost:2181 --topic test --from-beginning

window：

bin\windows\kafka-console-consumer.bat --zookeeper localhost:2181 --topic test --from-beginning

来源： <<http://www.2cto.com/os/201411/352021.html>>