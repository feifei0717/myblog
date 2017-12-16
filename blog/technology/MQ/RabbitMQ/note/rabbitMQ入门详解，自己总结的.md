# rabbitMQ说明文档

## rabbitMQ是什么

RabbitMQ是由 LShift提供的一个 Advanced Message Queuing Protocol (AMQP)的开源实现，由以高性能、健壮以及可伸缩性出名的 Erlang写成（因此也是继承了这些优点）。

首先介绍AMQP和一些基本概念：

 当前各种应用大量使用异步消息模型，并随之产生众多消息中间件产品及协议，标准的不一致使应用与中间件之间的耦合限制产品的选择，并增加维护成本。AMQP是一个提供统一消息服务的应用层标准协议，基于此协议的客户端与消息中间件可传递消息，并不受客户端/中间件不同产品，不同开发语言等条件的限制。当然这种降低耦合的机制是基于与上层产品，语言无关的协议。AMQP协议是一种二进制协议，提供客户端应用与消息中间件之间异步、安全、高效地交互。从整体来看，AMQP协议可划分为三层。

这种分层[架构](http://lib.csdn.net/base/16)类似于OSI网络协议，可替换各层实现而不影响与其它层的交互。AMQP定义了合适的服务器端域模型，用于规范服务器的行为(AMQP服务器端可称为broker)。

Model层决定这些基本域模型所产生的行为，这种行为在AMQP中用”command”表示，在后文中会着重来分析这些域模型。

Session层定义客户端与broker之间的通信(通信双方都是一个peer，可互称做partner)，为command的可靠传输提供保障。

Transport层专注于数据传送，并与Session保持交互，接受上层的数据，组装成二进制流，传送到receiver后再解析数据，交付给Session层。Session层需要Transport层完成网络异常情况的汇报，顺序传送command等工作。

AMQP当中有四个概念非常重要：虚拟主机（virtual host），交换机（exchange），队列（queue）和绑定（binding）。

虚拟主机（virtual host）：一个虚拟主机持有一组交换机、队列和绑定。为什么需要多个虚拟主机呢？RabbitMQ当中，用户只能在虚拟主机的粒度进行权限控制。因此，如果需要禁止A组访问B组的交换机/队列/绑定，必须为A和B分别创建一个虚拟主机。每一个RabbitMQ服务器都有一个默认的虚拟主机“/”。

队列（Queue）：由消费者建立的，是messages的终点，可以理解成装消息的容器。消息一直存在队列里，直到有客户端或者称为Consumer消费者连接到这个队列并将message取走为止。队列可以有多个。

交换机（Exchange）：可以理解成具有路由表的路由程序。每个消息都有一个路由键（routing key），就是一个简单的字符串。交换机中有一系列的绑定（binding），即路由规则（routes）。交换机可以有多个。多个队列可以和同一个交换机绑定，同时多个交换机也可以和同一个队列绑定。（多对多的关系）

三种交换机：

\1.  Fanout Exchange（不处理路由键）：一个发送到交换机上的消息都会被转发到与该交换机绑定的所有队列上。Fanout交换机发消息是最快的。

\2.  Direct Exchange（处理路由键）：如果一个队列绑定到该交换机上，并且当前要求路由键为X，只有路由键是X的消息才会被这个队列转发。

\3.  Topic Exchange（将路由键和某模式进行匹配，可以理解成模糊处理）：路由键的词由“.”隔开，符号“#”表示匹配0个或多个词，符号“*”表示匹配不多不少一个词。因此“**audit.#**”能够匹配到“**audit.irs.corporate**”，但是“**audit.\***”只会匹配到“**audit.irs**”

具体例子可以看下图

持久化：队列和交换机有一个创建时候指定的标志durable，直译叫做坚固的。durable的唯一含义就是具有这个标志的队列和交换机会在重启之后重新建立，它不表示说在队列当中的消息会在重启后恢复。那么如何才能做到不只是队列和交换机，还有消息都是持久的呢？

但是首先一个问题是，你真的需要消息是持久的吗？对于一个需要在重启之后回复的消息来说，它需要被写入到磁盘上，而即使是最简单的磁盘操作也是要消耗时间的。如果和消息的内容相比，你更看重的是消息处理的速度，那么不要使用持久化的消息。

当你将消息发布到交换机的时候，可以指定一个标志“Delivery Mode”（投递模式）。根据你使用的AMQP的库不同，指定这个标志的方法可能不太一样。简单的说，就是将 Delivery Mode设置成2，也就是持久的即可。一般的AMQP库都是将Delivery Mode设置成1，也就是非持久的。所以要持久化消息的步骤如下：

\1.  将交换机设成 durable。

\2.  将队列设成 durable。

\3.  将消息的 Delivery Mode 设置成2。

绑定（Bindings）如何持久化？我们无法在创建绑定的时候设置成durable。没问题，如果绑定了一个 durable的队列和一个durable的交换机，RabbitMQ会自动保留这个绑定。类似的，如果删除了某个队列或交换机（无论是不是 durable），依赖它的绑定都会自动删除。

注意两点：

\1.  RabbitMQ不允许绑定一个非坚固（non-durable）的交换机和一个durable的队列。反之亦然。要想成功必须队列和交换机都是durable的。

\2.  一旦创建了队列和交换机，就不能修改其标志了。例如，如果创建了一个non-durable的队列，然后想把它改变成durable的，唯一的办法就是删除这个队列然后重现创建。因此，最好仔细检查创建的标志。

## 消息队列（MQ）使用过程

几个概念说明：

\1.  Broker：简单来说就是消息队列服务器实体。

\2.  Exchange：消息交换机，它指定消息按什么规则，路由到哪个队列。

\3.  Queue：消息队列载体，每个消息都会被投入到一个或多个队列。

\4.  Binding：绑定，它的作用就是把exchange和queue按照路由规则绑定起来。

\5.  Routing Key：路由关键字，exchange根据这个关键字进行消息投递。

\6.  vhost：虚拟主机，一个broker里可以开设多个vhost，用作不同用户的权限分离。

\7.  producer：消息生产者，就是投递消息的程序。

\8.  consumer：消息消费者，就是接受消息的程序。

\9.  channel：消息通道，在客户端的每个连接里，可建立多个channel，每个channel代表一个会话任务。

消息队列的使用过程大概如下：

\1.  客户端连接到消息队列服务器，打开一个channel。

\2.  客户端声明一个exchange，并设置相关属性。

\3.  客户端声明一个queue，并设置相关属性。

\4.  客户端使用routing key，在exchange和queue之间建立好绑定关系。

\5.  客户端投递消息到exchange。

\6.  exchange接收到消息后，就根据消息的key和已经设置的binding，进行消息路由，将消息投递到一个或多个队列里。

## rabbitMQ的优点（适用范围）

\1.        基于erlang语言开发具有高可用高并发的优点，适合集群服务器。

\2.        健壮、稳定、易用、跨平台、支持多种语言、文档齐全。

\3.        有消息确认机制和持久化机制，可靠性高。

\4.        开源

其他MQ的优势：

\1.        Apache ActiveMQ曝光率最高，但是可能会丢消息。

\2.        ZeroMQ延迟很低、支持灵活拓扑，但是不支持消息持久化和崩溃恢复。

# rabbitMQ单个节点部署文档

## Ubuntu(12.04)安装rabbitMQ(python使用rabbitMQ服务)

\1.   添加rabbitmq源：

1)   sudo vim /etc/apt/sources.list

2)   把 deb[ http://www.rabbitmq.com/debian/](http://www.rabbitmq.com/debian/) testing main 添加进去

\2.   添加公钥：

1)   wget[ http://www.rabbitmq.com/rabbitmq-signing-key-public.asc](http://www.rabbitmq.com/rabbitmq-signing-key-public.asc)

2)   sudo apt-key add rabbitmq-signing-key-public.asc

\3.   更新并安装rabbitmq-server：

1)   wget http://www.rabbitmq.com/releases/rabbitmq-server/v3.2.2/rabbitmq-server_3.2.2-1_all.deb

2)   sudo dpkg -i rabbitmq-server_3.2.2-1_all.deb

\4.   安装pika：

1)   sudo apt-get install [Python](http://lib.csdn.net/base/11)-pip

2)   sudo pip install pika

\5.   配置文件：官方地址：http://www.rabbitmq.com/configure.html一般情况下，RabbitMQ的默认配置就足够了。如果希望特殊设置的话，有两个途径：一个是环境变量的配置文件rabbitmq-env.conf；一个是配置信息的配置文件 rabbitmq.config；注意，这两个文件默认是没有的，如果需要必须自己创建。

1)   rabbitmq-env.conf：这个文件的位置是确定和不能改变的，位于：/etc/rabbitmq目录下（这个目录需要自己创建）。文件的内容包括了RabbitMQ的一些环境变量，常用的有：端口号、配置文件的路径、需要使用的MNESIA[数据库](http://lib.csdn.net/base/14)的路径、log的路径插件的路径。

具体的列表见：<http://www.rabbitmq.com/configure.html#define-environment-variables>

2)   rabbitmq.config：这是一个标准的erlang配置文件。它必须符合erlang配置文件的标准。它既有默认的目录，也可以在rabbitmq-env.conf文件中配置。文件的内容详见：[http://www.rabbitmq.com/configure.html#config-items(更改完密码配置除了重启一定要再用命令行改一下)](http://www.rabbitmq.com/configure.html#config-items)

## 安装相关组件

\1. rabbitmq-plugins:

a) sudo rabbitmq-plugins enable rabbitmq_management

b) sudo rabbitmqctl stop

c) sudo rabbitmq-server –detached

\2. rabbitmqadmin:

a) wget[ http://hg.rabbitmq.com/rabbitmq-management/raw-file/rabbitmq_v3_2_1/bin/rabbitmqadmin](http://hg.rabbitmq.com/rabbitmq-management/raw-file/rabbitmq_v3_2_1/bin/rabbitmqadmin)

b) sudo cp rabbitmqadmin /usr/local/bin

c) cd /usr/local/bin

d) sudo chmod 777 rabbitmqadmin

## 自动安装rabbitmq脚本

\#!/bin/sh

echo "deb http://www.rabbitmq.com/debian/ testing main" >>/etc/apt/sources.list

wget http://www.rabbitmq.com/rabbitmq-signing-key-public.asc

sudo apt-key add rabbitmq-signing-key-public.asc

sudo apt-get update

sudo apt-get install rabbitmq-server

sudo rabbitmq-plugins enable rabbitmq_management

sudo rabbitmqctl stop

sleep 5

sudo rabbitmq-server -detached

wget http://hg.rabbitmq.com/rabbitmq-management/raw-file/rabbitmq_v3_2_1/bin/rabbitmqadmin

sudo cp rabbitmqadmin /usr/local/bin

sudo chmod 777 /usr/local/bin/rabbitmqadmin

## rabbitMQ的管理（rabbitMQ常用命令文档中会详细说明）

\1.   web界面

1)   rabbitmq-plugins enable rabbitmq_management

2)   invoke-rc.d rabbitmq-server stop

3)   invoke-rc.d rabbitmq-server start

4)   访问[http://localhost:15672](http://localhost:15672/)，用户名密码都是guest

\2.   Linux命令行

rabbitmqctl [-n node] [-q] {command} [command options...]

Command分类：

1)   Application Management

2)   Cluster Management

3)   User management

4)   Access control

5)   Parameter Management

6)   Policy Management

7)   Server Status

8)   Miscellaneous

详见：<https://www.rabbitmq.com/man/rabbitmqctl.1.man.html>

# rabbitMQ集群配置

rabbitMQ是用erlang开发的，集群非常方便，因为erlang天生就是一门分布式语言,但其本身并不支持负载均衡。

rabbit模式大概分为以下三种：

单一模式：最简单的情况，非集群模式。没什么好说的。

普通模式：默认的集群模式。对于Queue来说，消息实体只存在于其中一个节点，A、B两个节点仅有相同的元数据，即队列结构。当消息进入A节点的Queue中后，consumer从B节点拉取时，rabbitMQ会临时在A、B间进行消息传输，把A中的消息实体取出并经过B发送给consumer。所以consumer应尽量连接每一个节点，从中取消息。即对于同一个逻辑队列，要在多个节点建立物理Queue。否则无论consumer连A或B，出口总在A，会产生瓶颈。该模式存在一个问题就是当A节点故障后，B节点无法取到A节点中还未消费的消息实体。如果做了消息持久化，那么得等A节点恢复，然后才可被消费；如果没有持久化的话，然后就没有然后了……

镜像模式：把需要的队列做成镜像队列，存在于多个节点，属于rabbitMQ的HA方案。该模式解决了上述问题，其实质和普通模式不同之处在于，消息实体会主动在镜像节点间同步，而不是在consumer取数据时临时拉取。该模式带来的副作用也很明显，除了降低系统性能外，如果镜像队列数量过多，加之大量的消息进入，集群内部的网络带宽将会被这种同步通讯大大消耗掉。所以在对可靠性要求较高的场合中适用(后面会详细介绍这种模式，目前我们搭建的环境属于该模式)了解集群中的基本概念：rabbitMQ的集群节点包括内存节点、磁盘节点。顾名思义内存节点就是将所有数据放在内存，磁盘节点将数据放在磁盘。不过，如前文所述，如果在投递消息时，打开了消息的持久化，那么即使是内存节点，数据还是安全的放在磁盘。一个rabbitMQ集 群中可以共享 user，vhost，queue，exchange等，所有的数据和状态都是必须在所有节点上复制的，一个例外是，那些当前只属于创建它的节点的消息队列，尽管它们可见且可被所有节点读取。rabbitMQ节点可以动态的加入到集群中，一个节点它可以加入到集群中，也可以从集群环集群会进行一个基本的负载均衡。

集群中有两种节点：

内存节点：只保存状态到内存（一个例外的情况是：持久的queue的持久内容将被保存到disk）

磁盘节点：保存状态到内存和磁盘。内存节点虽然不写入磁盘，但是它执行比磁盘节点要好。集群中，只需要一个磁盘节点来保存状态 就足够了 如果集群中只有内存节点，那么不能停止它们，否则所有的状态，消息等都会丢失。

## 集群配置

我们这边有两台服务器，hostname分别为：rabbit1（192.168.8.35）、rabbit3（192.168.8.34）。

配置步骤如下：

\1.   rabbit1和rabbit3做为rabbitMQ集群节点，分别安装rabbitMQ-Server ，安装后分别启动rabbitMQ-server

\2.   在安装好的两台节点服务器中，分别修改/etc/hosts文件，指定rabbit1和rabbit3的hosts：192.168.8.35 rabbit1 192.168.8.34 rabbit3

\3.   还有hostname文件也要正确，分别是rabbit1和rabbit3，如果修改hostname建议安装rabbitMQ前修改。请注意rabbitMQ集群节点必须在同一个网段里，如果是跨广域网效果就差。

修改hostname的方法：

a)   启用root用户

运行命令 sudo passwd root 为root用户设置密码

b)   以root用户身份登录

c)   编辑文件/etc/hosts 将下面的一行

127.0.1.1  xxxxx

替换为

127.0.1.1  newhostname

d)   编辑 /etc/hostname文件 删除该文件的所有内容，添加newhostname

e)   运行一下命令 hostname newhostname

f)   退出root用户 改用一般用户登录即可

\4.   设置每个节点Cookie：rabbitMQ的集群是依赖于erlang的集群来工作的，所以必须先构建起erlang的集群环境。Erlang的集群中各节点是通过一个magic cookie来实现的，这个cookie存放在 /var/lib/rabbitMQ/.erlang.cookie 中，文件是400的权限。所以必须保证各节点cookie保持一致，否则节点之间就无法通信。将其中一台节点上的.erlang.cookie值复制下来保存到其他节点上，要注意文件的权限和属主属组。先修改下.erlang.cookie权限：

\#chmod 777  /var/lib/rabbitMQ/.erlang.cookie

复制完后重启下rabbitMQ。

复制好后别忘记还原.erlang.cookie的权限，否则可能会遇到错误：

\#chmod 400 /var/lib/rabbitMQ/.erlang.cookie

设置好cookie后先将三个节点的rabbitMQ重启：

\# rabbitmqctl stop

\# rabbitMQ-server start

\5.   停止所有节点rabbitMQ服务，然后使用detached参数独立运行，这步很关键，尤其增加节点停止节点后再次启动遇到无法启动都可以参照这个顺序：

rabbit@rabbit3# rabbitmqctl stop

rabbit@rabbit3# rabbitMQ-server –detached

\6.   将rabbit1和rabbit3连接起来，执行如下命令：

rabbit@rabbit3# rabbitmqctl stop_app

rabbit@rabbit3# rabbitmqctl reset

rabbit@rabbit3# rabbitmqctl cluster rabbit@rabbit3 rabbit@rabbit1   

rabbit@rabbit3# rabbitmqctl start_app

\7.   在rabbit1和rabbit3上，运行cluster_status命令查看集群状态：

rabbit@rabbit3# rabbitmqctl cluster_status

Cluster status of node rabbit@rabbit1 ...

[{nodes,[{disc,[rabbit@rabbit3,rabbit@rabbit1]}]},

{running_nodes,[rabbit@rabbit3,rabbit@rabbit1]}]

...done.这时我们可以看到每个节点的集群信息，分别有两个磁盘节点。

这样rabbitMQ集群就正常工作了,这种模式更适合非持久化队列，只有该队列是非持久的，客户端才能重新连接到集群里的其他节点，并重新创建队列。假如该队列是持久化的，那么唯一办法是将故障节点恢复起来。

为什么rabbitMQ不将队列复制到集群里每个节点呢？这与它的集群的设计本意相冲突，集群的设计目的就是增加更多节点时，能线性的增加性能（CPU、内存）和容量（内存、磁盘）。理由如下：

\1. storage space: If every cluster node had a full copy of every queue, adding nodes wouldn’t give you more storage capacity. For example, if one node could store 1GB of messages, adding two more nodes would simply give you two more copies of the same 1GB of messages.

\2. performance: Publishing messages would require replicating those messages to every cluster node. For durable messages that would require triggering disk activity on all nodes for every message. Your network and disk load would increase every time you added a node, keeping the performance of the cluster the same (or possibly worse).

# rabbitMQ Highly Available Queue

如果你 的 rabbitMQ broker 只是由单独一个 node 构成，那么该 node 的失效将导致整个服务临时性的不可用，并且可能会导致 message 丢失（尤其是在非持久化 message 存储于非持久化的 queue 中的时候）。你当然可以将所有 publish 的 message 都设置为持久化的，并且使用持久化的 queue ，但是你仍然无法避免 由于 buffering 导致的问题：因为在 message 被发出后和被 写入磁盘并 fsync 之间存在一个虽然短暂但是会产生问题的时间窗。通过 [publisher confirms] 机制能够确保客户端知道哪些消息已经写入磁盘，尽管如此，你一定仍不希望遇到因为单点故障导致的服务器停用，进而导致服务不可用的尴尬局面，同样，你也一定不喜欢将每一条 message 都写入磁盘导致的服务器性能退化。

你可以使用 rabbitMQ node 构成的cluster 来构建属于你的 rabbitMQ broker 。如此做，从服务的整体可用性上来讲，该 cluster 对于单独 node 的失效是具有弹性的，但是同时存在一些需要重点注意的点：尽管exchange和binding能够在单点失效的问题上幸免于难，但是 queue 和其上持有的 messgage 却不行。这是 因为 queue 及其内容仅仅贮存于单个 node 之上，所以一个 node 的失效将表现为其对应的 queue 的不可用。

你可以使用 [ active/passive] 形式的 node 对，一旦 active node 失效了，passive node 将会启用并从失效 node 处接管工作。这种方式甚至可以同 cluster 应用结合起来使用。尽管该方式可以确保对失效问题的快速检测和恢复，但是仍然会 存在问题：如 passive node 会花费很长时间才能完全启动起来或者甚至根本启动不起来。这在最坏情况下会导致存在于失效 node 上的 queue 的临时不可用状态。

为了解决上述各种问题，我们开发了 active/active HA queue 。从原理上讲，是 采用将 queue 镜像到 cluster 中的其他 node 上的方式实现的。 在该实现下，如果 cluster 中的一个 node 失效了，queue 能够自动地切换到镜像 queue 中的一个继续工作以保证服务的可用性。该解决方案仍然要求使用 rabbitMQ cluster ，这也意味着其无法在 cluster 内无缝地处理 network partition 问题。因此，不推荐跨 WAN 使用（虽然如此，客户端当然可以从远端或者近端进行连接）。

## Mirrored Queue Behaviour

在通常的用法中，针对每一个mirrored-queue都包含一个 master和多个slave，分别对应于不同的node。slave会准确地按照master 执行命令的顺序进行命令执行，故slave与master上维护的状态应该是相同的。除publish外的所有动作都只会向master发送，然后再由 master将命令执行的结果广播给 slave 们，故看似从mirrored queue 中 consuming 的客户端实际上是从 master 上进行的 consuming 。

如果某个 slave 失效了，系统除了做些许记录外几乎啥都不做：master 仍旧是 master ，客户端不需要采取任何行动，或者被通知 slave 的失效。

如果 master 失效了，那么 slave 中的一个必须被提升为 master ，在这种情况下，将发生下面的事情：

某一个 slave 会被提升为新的 master 。被 选中作为新的 master 的 slave 通常是看哪个 slave 最老（这个也论资排辈！~），因为最老的 slave 与前任 master 之间的同步状态应该是最好的（估计一起吃过不少饭喝过不少酒）。然而，需要注意的是，如果存在没有任何一个 slave 与 master 进行过 [ synchronised]的情况（新官上任没干多就 master 就挂了），那么前任 master “私有的” message 将会丢失。

slave 会认为所有之前有联系的 consumer 都被突然地（粗鲁地）断开了。在 这种情况下，slave （根据上下文补充翻译：被提升为 master 的那个家伙）会 requeue 所有已经投递给客户端但尚未收到 acknowledgement 的 message 。这类 message 中将包括那些客户端已发送过 acknowledgement 进行确认的消息：或者因为 acknowledgement 抵达 master 之前其丢失了，或者因为 acknowledgement 在 master 向 slave 进行广播的时候丢失了。无论是上述哪种情况，新 master 除了将其认为尚未 acknowledged 的消息进行 requeue 外没有更好的处理办法。

从 mirrored-queue 处 consume 消息的客户端如果支持我们提供的 [ Consumer Cancellation Notifications ]机制，将可以收到关于他们对 mirrored-queue 的订阅被突然地（粗鲁地）取消掉的通知。在 这种情况下，他们应该对 queue 执行 re-consume ，此时将会从新任 master 处获取消息。发送该通知的原因是：通知客户端“master 已经失效”这个结果是必要的；否则客户端可能继续对之前过时的、已经失效的前任 master 发送确认消息，并期望能够再次从前任 master 处收 message （此处为本人按照自己的理解进行解读），然后之后的 message 将是从新的 master 处发来。可以确定的是，连接到失效 node 上的客户端将会发现之前的连接已经断开，之后会重新连接到 cluster 中的其他存活的 node 上。

作为 requeue 的结果，从 queue 中 re-consume 的客户端必须意识到自己非常可能在随后的交互过程中收到自己之前已经收到过的消息。

一旦完成了选中的 slave 被提 升成 master 的动作，发送到 mirrored-queue 的所有 message 将不会再丢失：publish 到 mirrored-queue 的所有消息总是被直接 publish 到 master 和所有的 slave 上。这样一旦 master 失效了，message 仍然可以继续发送到其他 slave 上，并且在新 slave 被提升为 master 之后，将这些 message 添加到（该 master 所在的） queue 中。

同样地， 如果客户端使用了 [ publisher confirm ] 机制，即使“在 message 被 publish 后和 message 被确认前”的期间，出现 master（或者任何 slave）失效的情况，其所 publish 的 message 仍旧可以被正确无误地确认。故从 publisher 的角度来看，将消息 publish 到 mirrored-queue 与 publish 到任何种类的 queue 中没有任何差别。只有 consumer 需要意识到当收到 [ Consumer Cancellation Notification] 时，自己可能需要再次从 mirrored-queue 中 re-consume 。

如果你使用 noAck=true 属性从 mirrored-queue 中 consume message（即客户端不发送 message 确认），则消息存在丢失的可能。这个和标准情形没有任何差别： broker 认为 message 一旦向具有 noAck=true 属性的 consumer 执行了发送行为，broker 就认为该消息已经被确认了。此 时如果客户端突然地断开了，message 将会丢失（假设客户端此时尚未收到该 message）。在采用 mirrored-queue 的情况下，如果 master 失效了，那些仍处于发送给具有 noAck=true 属性的 consumer 路上的 message 将不会被这些客户端接收到，并且不会被新任 master 执行 requeue 操作。因为有可能处于 consuming 状态的客户端是与存活着的 node 连接着的，此时可以采用 [Consumer Cancellation Notification] 机制在此类事件发生时用于进行相关处理。当然，在实际中，如果你比较关心丢失 message 的问题，则建议你在 consume 时使用 noAck=false 。

## Publisher Confirms and Transactions

Mirrored queue 同时支持 [Publisher Confirm] 和 [Transaction] 两种机制。在两种机制中进行选择的依据是，其在 queue 的全部镜像中产生波及的范围。在 Transaction 机制中，只有在当前事务在全部镜像 queue 中执行后，客户端才会在收到 tx.commit-ok 消息。同样地，在 publisher confirm 机制中，向 publisher 进行当前 message 确认的前提是该 message 被全部镜像所 accept 了。你可以按照如下语义对上述机制进行理解：即 message 被路由到多个普通的 queue 中，更进一步，在带有 publish 的事务中也同样会路由到多个 queue 中。

## Unsynchronised Slaves

一个 node 可以在任意时刻加入到一个 cluster 中。 按照 queue 的自身配置信息，当一个 node 加入到一个 cluster 中时，可能将当前 node 设置成 slave 。如果是这样，新增 slave 上（的 queue）将会是空的：其不会包含任何当前（cluster 中） queue 上业已存在的内容，且当前也没有任何同步协议可用。新增 slave 将可以收到 publish 到其对应 queue 的新 message ，并且在一定的运行时间后，（其 queue 中的内容）将可以准确呈现（当前 cluster 中的） mirrored-queue 的尾部 message 的“面貌”。随着（当前 cluster 中） mirrored-queue 上的 message 被逐渐 consume ，新增 slave 之前“错失”的 message 数量（以 queue 头上的 size 表示 - 即 message 的多少）将会逐步缩减，直到 slave 的内容与 master 的内容 最终完全变成一致。此时，我们可以认为 slave 已经处于完全同步状态了，需要注意的是，上述同步行为的产生是基于客户端的动作触发，即其会逐步消耗光 queue 中业已存在的 message 。

故新增 slave 并没有为提高 queue 内容的冗余性或可用性提供额外的好处，只有在新增 slave 前，就已将存在于 queue 中的内容移除的情况下才能产生确实的好处。鉴于这个原因，推荐你最好在创建 mirrored queue 前先设置相应的 node 为 slave ，或者更进一步，你可以确保你进行 message 相关操作时，只会导致产生“存活期非常短或者空的 queue”，因为这种 queue 中的 message 会很快被 consume 光。

你可以通过如下 rabbitMQctl 命令或者管理插件来确定哪些 slave 已经进行了同步：

1

rabbitMQctl list_queues name slave_pids synchronised_slave_pids

Starting and Stopping Nodes

启动和停止 node

如果你停止了 mirrored-queue 中具有 master 行为的 rabbitMQ node ，那么将会发生某个作为 slave 的 node 被提升为 master 的情况（假定确实存在一个这样的 slave）。如果你继续停止（具有 master 行为的）node ，你最终会面临 mirrored-queue 中没有任何 slave 的情况：即只存在一个 node ，且其为 master 。 在 mirrored-queue 被声明为持久的情况下，如果其所包含的最后一个可用 node（ 需要注意：此时该 node 已经成为了 master）被停止，那么位于该 queue 中的持久化 message 将在该 node 重启后得到恢复。通常来说， 当你重启一些 node - 如果这些 node 当初 mirrored-queue 的一部分 - 那么这些 node 将会在重启后重新加入到该 mirrored-queue 中。

然而， 当前没有任何方式可以让重新加入到 mirrored-queue 中的 slave 确认是否自身拥有的 queue 的内容与 master 的不同（例 如，可能出现在 network partition 的情况中）。所以，当一个 slave 重新加入到 mirrored-queue 中时，它将果断抛弃任何自身之前拥有的本地的持久化内容，并以空（ queue ）的状态启动。该 slave 的行为从某种意义上来说像是一个新加入到 cluster 中的 node 。

## Configuring Mirroring

queue 可以通过[ policy]对镜像功能进行控制。任何时候策略都是可以改变的；你可以首先创建一个 non-mirrored queue ，然后在之后的某一个时候将其再变成镜像的（或者相反操作）。在  non-mirrored queue 和不包含任何 slave 的镜像 queue 之间存在一点差别 - 前者因为不需要使用 额外 支持镜像功能的基础组件，故可以运行的更快。

（相对来讲）你更应该关注为 queue 添加镜像的行为。

# 用两台机器建立镜像队列解决HA问题

## 前提

\1.         两台机器已经建立rabbitMQ集群。

\2.         rabbitmq-plugins 和 rabbitmqadmin安装正常。

\3.         /etc/hosts文件，在我们的服务器上，两台机器的IP是192.168.8.34和192.168.8.35，hosts如下：

127.0.0.1localhost

127.0.1.1rabbit3

192.168.8.11  ubuntu

192.168.8.35  rabbit1

127.0.0.1       localhost

127.0.1.1       rabbit1

192.168.8.11    ubuntu

192.168.8.34    rabbit3

| ha-mode | ha-params  | Result                                   |
| ------- | ---------- | ---------------------------------------- |
| all     | (absent)   | Queue is mirrored across all nodes in the cluster. When a new node is added to the cluster, the queue will be mirrored to that node. |
| exactly | count      | Queue is mirrored to count nodes in the cluster. If there are less than count nodes in the cluster, the queue is mirrored to all nodes. If there are more than countnodes in the cluster, and a node containing a mirror goes down, then a new mirror will not be created on another node. (This is to prevent queues migrating across a cluster as it is brought down.) |
| nodes   | node names | Queue is mirrored to the nodes listed in node names. If any of those node names are not a part of the cluster, this does not constitute an error. If none of the nodes in the list are online at the time when the queue is declared then the queue will be created on the node that the declaring client is connected to. |

## 通过set_policy来建立镜像队列

Some examples

rabbitmqctl set_policy ha-all "^ha\." '{"ha-mode":"all"}'

所有ha.开头的队列自动成为镜像队列，每个节点都会有这个队列。

## 一些测试

\1.         声明一个policy，以ha.开头的队列自动成为镜像队列：

rabbitmqctl set_policy ha-all "^ha\." '{"ha-mode":"all"}'

\2.         在rabbit3节点上建立一个名字为ha.123的队列,durable设为true：

sudo rabbitmqadmin declare queue name=ha.123 durable=true

\3.         在rabbit3节点上建立一个名字为aaaaaa的队列，durable设为true：

sudo rabbitmqadmin declare queue name=aaaaaa durable=true

\4.         查看rabbit1节点的queues：

test@rabbit1:~$ sudo rabbitmqctl list_queues

Listing queues ...

aaaaaa  0

ha.123  0

\5.         停止rabbit3：

sudo rabbitmqctl stop_app

\6.         再次查看rabbit1节点的queues：

test@rabbit1:~$ sudo rabbitmqctl list_queues

Listing queues ...

ha.123  0

由上面这个小测试可以发现，ha.123保留了，而aaaaaa没有保留，这就说明了policy生效了，符合policy的ha.123自动建立了镜像队列，所以即使rabbit1关掉了服务，ha.123依旧在其他节点存在着，这样就保证了HA。

# rabbitMQ一些常用命令

## rabbitctl

rabbitmqctl 是rabbitMQ中间件的一个命令行管理工具。它通过连接一个中间件节点执行所有的动作。

rabbitmqctl [-n node] [-q] {command} [command options…]

[-n node]

默认的节点是”rabbit@server”,一般是本地节点。

rabbitmqctl 默认产生详细输出。通过”-q”标示可选择安静模式。

## 应用和集群管理

\1.  停止rabbitMQ应用，关闭节点 ： rabbitmqctl stop

\2.  停止rabbitMQ应用 ： rabbitmqctl stop_app

\3.  启动rabbitMQ应用 ： rabbitmqctl start_app

\4.  显示rabbitMQ中间件各种信息 ： rabbitmqctl status

\5.  重置rabbitMQ节点 ： rabbitmqctl reset和  rabbitmqctl force_reset 从它属于的任何集群中移除，从管理数据库中移除所有数据，例如配置过的用户和虚拟宿主, 删除所有持久化的消息。 force_reset命令和reset的区别是无条件重置节点，不管当前管理数据库状态以及集群的配置。如果数据库或者集群配置发生错误才使用这个最后 的手段。 注意：只有在停止rabbitMQ应用后，reset和force_reset才能成功。

\6.  循环日志文件 ： rabbitmqctl rotate_logs[suffix]

\7.  加入到某个节点中：rabbitmqctl join_cluster {clusternode} [--ram]默认是ram类型的，也可以是disc类型

\8.  集群目前的状态：rabbitmqctl cluster_status

\9.  改变当前节点的类型：rabbitmqctl change_cluster_node_type {disc | ram}使用这个命令的时候必须先把该节点stop。

\10. 同步某个队列（建立镜像队列）：rabbitmqctl sync_queue {queue-name}

\11. 取消同步某个队列：rabbitmqctl cancel_sync_queue{queue-name}

## 用户管理

\1.  添加用户：rabbitmqctl add_user username password

\2.  删除用户：rabbitmqctl delete_user username

\3.  修改密码：rabbitmqctl change_password username newpassword

\4.  清除密码：rabbitmqctl clear_password {username}

\5.  设置用户标签：rabbitmqctl set_user_tags {username} {tag…}如果tag为空则表示清除这个用户的所有标签

\6.  列出所有用户 ：rabbitmqctl list_users

## 权限控制

\1.  创建[虚拟主机](http://www.honhei.com/)：rabbitmqctl add_vhost vhostpath

\2.  删除虚拟主机：rabbitmqctl delete_vhost vhostpath

\3.  列出所有虚拟主机：rabbitmqctl list_vhosts

\4.  设置用户权限：rabbitmqctl set_permissions [-p vhostpath] {username} {conf} {write} {read}

\5.  清除用户权限：rabbitmqctl clear_permissions [-p vhostpath] {username}

\6.  列出虚拟主机上的所有权限：rabbitmqctl list_permissions [-p vhostpath]

\7.  列出用户权限：rabbitmqctl list_user_permissions {username}

## 参数管理

这个不常用,具体的可以去官网看文档

## 协议管理

\1.  设置协议：rabbitmqctl set_policy [-p vhostpath] [--priority priority] [--apply-to apply-to] {name} {pattern} {definition}

a)  name

协议的名字

b)  pattern

匹配的正则表达式

c)  definition

json term的形式来定义这个协议

d)  priority

优先级，数字越大优先级越高，默认为0

e)  apply-to

policy的类型，有三种：queues exchanges all 默认为all，具体定义可以去官网看文档

\2.  清除协议：rabbitmqctl clear_policy [-p vhostpath] {name}

\3.  列出协议列表：rabbitmqctl list_policies [-p vhostpath]

## 服务器状态

\1.  队列列表：rabbitmqctl list_queues [-p vhostpath] [queueinfoitem…]

queueinfoitem:

a)  name

b)  durable

c)  auto_delete

d)  arguments

e)  policy

f)  pid

g)  owner_pid

h)  exclusive_consumer_pid

i)  exclusive_consumer_tag

j)  messages_ready

k)  messages_unacknowledged

l)  messages

m)  consumers

n)  active_consumers

o)  memory

p)  slave_pids

q)  synchronized_slave_pids

r)  status

\2.  交换机列表：rabbitmqctl list_exchanges [-p vhostpath] [exchangeinfoitem…]

exchangeinfoitem:

a)  name

b)  type

c)  durable

d)  auto_delete

e)  internal

f)  arguments

g)  policy

\3.  绑定列表：rabbitmqctl list_bindings [-p vhostpath] [bindinginfoitem…]

bindinginfoitem:

a)  source_name

b)  source_kind

c)  destination_name

d)  destination_kind

e)  routing_key

f)  arguments

\4.  连接列表：rabbitmqctl list_connections不常用，具体去官网看文档

\5.  通道列表：rabbitmqctl list_channels不常用，具体去官网看文档

\6.  消费者列表：rabbitmqctl list_consumers

\7.  当前状态：rabbitmqctl status

\8.  当前环境：rabbitmqctl environment

\9.  相关报告：rabbitmqctl report

## 一些其他的命令

后台开启rabbitmq服务：rabbitmq-server –detached

声明队列：rabbitmqadmin declare queue name=queue-name durable={false | true}

发布消息：rabbitmqadmin publish exchange=exchange-name routing_key=key payload=”context”

如果有任何疑问可以去官网看文档：

<https://www.rabbitmq.com/man/rabbitmqctl.1.man.html>

# OpenStack中rabbitMQ的使用

## Nova各个模块直接基于AMQP实现通信

经过一番调研，发现OpenStack之中，与rabbitMQ直接相关联的模块是NOVA模块，NOVA中的每个组件可能是一个消息的发送者（如API、Scheduler），也可能是一个消息的接受者（如compute、volume、network）。Nova各个模块之间基于AMQP消息实现通信，但是真正实现消息调用的应用流程主要是RPC机制。Nova基于RabbitMQ实现两种RPC调用：RPC.CALL和RPC.CAST，其中RPC.CALL基于请求与响应方式，RPC.CAST只是提供单向请求，两种RPC调用方式在Nova中均有不同的应用场景。

在Nova中主要实现Direct和Topic两种交换器的应用，在系统初始化的过程中，各个模块基于Direct交换器针对每一条系统消息自动生成多个队列注入RabbitMQ服务器中，依据Direct交换器的特性要求，Binding Key=“MSG-ID”的消息队列只会存储与转发Routing Key=“MSG-ID”的消息。同时，各个模块作为消息消费者基于Topic交换器自动生成两个队列注入RabbitMQ服务器中。

Nova的各个模块在逻辑功能是可以划分为两种：Invoker和Worker，其中Invoker模块主要功能是向消息队列中发送系统请求消息，如Nova-API和Nova-Scheduler；Worker模块则从消息队列中获取Invoker模块发送的系统请求消息以及向Invoker模块回复系统响应消息，如Nova-Compute、Nova-Volume和Nova-Network。Invoker通过RPC.CALL和RPC.CAST两个进程发送系统请求消息；Worker从消息队列中接收消息，并对RPC.CALL做出响应。Invoker、Worker与RabbitMQ中不同类型的交换器和队列之间的通信关系如图所示。

  Nova根据Invoker和Worker之间的通信关系可逻辑划分为两个交换域：Topic交换域与Direct交换域，两个交换域之间并不是严格割裂，在信息通信的流程上是深度嵌入的关系。Topic交换域中的Topic消息生产者（Nova-API或者Nova-Scheduler）与Topic交换器生成逻辑连接，通过PRC.CALL或者RPC.CAST进程将系统请求消息发往Topic交换器。Topic交换器根据系统请求消息的Routing Key分别送入不同的消息队列进行转发，如果消息的Routing Key=“NODE-TYPE.NODE-ID”，则将被转发至点对点消息队列；如果消息的Routing Key=“NODE-TYPE”，则将被转发至共享消息队列。Topic消息消费者探测到新消息已进入响应队列，立即从队列中接收消息并调用执行系统消息所请求的应用程序。每一个Worker都具有两个Topic消息消费者程序，对应点对点消息队列和共享消息队列，链接点对点消息队列的Topic消息消费者应用程序接收RPC.CALL的远程调用请求，并在执行相关计算任务之后将结果以系统响应消息的方式通过Direct交换器反馈给Direct消息消费者；同时链接共享消息队列的Topic消息消费者应用程序只是接收RPC.CAST的远程调用请求来执行相关的计算任务，并没有响应消息反馈。因此，Direct交换域并不是独立运作，而是受限于Topic交换域中RPC.CALL的远程调用流程与结果，每一个RPC.CALL激活一次Direct消息交换的运作，针对每一条系统响应消息会生成一组相应的消息队列与交换器组合。因此，对于规模化的OpenStack云平台系统来讲，Direct交换域会因大量的消息处理而形成整个系统的性能瓶颈点。

## 系统RPC.CALL以及RPC.CAST调用流程

  由前文可以看出，RPC.CALL是一种双向通信流程，即Worker程序接收消息生产者生成的系统请求消息，消息消费者经过处理之后将系统相应结果反馈给Invoker程序。例如，一个用户通过外部系统将“启动虚拟机”的需求发送给NOVA-API，此时NOVA-API作为消息生产者，将该消息包装为AMQP信息以RPC.CALL方式通过Topic交换器转发至点对点消息队列，此时，Nova-Compute作为消息消费者，接收该信息并通过底层虚拟化软件执行相应虚拟机的启动进程；待用户虚拟机成功启动之后，Nova-Compute作为消息生产者通过Direct交换器和响应的消息队列将“虚拟机启动成功”响应消息反馈给Nova-API，此时Nova-API作为消息消费者接收该消息并通知用户虚拟机启动成功，一次完整的虚拟机启动的RPC.CALL调用流程结束。其具体流程如图所示：

  （1）Invoker端生成一个Topic消息生产者和一个Direct消息消费者。其中，Topic消息生产者发送系统请求消息到Topic交换器；Direct消息消费者等待响应消息。

  （2）Topic交换器根据消息的Routing Key转发消息，Topic消费者从相应的消息队列中接收消息，并传递给负责执行相关任务的Worker。

  （3）Worker根据请求消息执行完任务之后，分配一个Direct消息生产者，Direct消息生产者将响应消息发送到Direct交换器。

  （4）Direct交换器根据响应消息的Routing Key转发至相应的消息队列，Direct消费者接收并把它传递给Invoker。

  RPC.CAST的远程调用流程与RPC.CALL类似，只是缺少了系统消息响应流程。一个Topic消息生产者发送系统请求消息到Topic交换器，Topic交换器根据消息的Routing Key将消息转发至共享消息队列，与共享消息队列相连的所有Topic消费者接收该系统请求消息，并把它传递给响应的Worker进行处理，其调用流程如图所示：

## 自动创建的exchange和queue

主机名为hostname，openstack各个组件启动后：

Exchanges

\1.      nova (topic exchange)

Queues

\1.      compute. hostname

\2.      compute

\3.      network. hostname

\4.      network

\5.      volume. hostname

\6.      volume

\7.      scheduler. hostname

\8.      scheduler

\9.      ce

# rabbitMQ测试

## 硬件环境

INTEL 四核2.13主频

5506*2

300G*6 3.5寸 SAS 15K （1.8TB）

8G

RAID 0 1

DVD

2*1000M网卡

冗余电源570W

原厂3年服务

## 软件环境

OS：Linux version 3.2.0-29-generic

rabbitMQ：3.2.1

## 功能测试

Nova工作状态：正常

Cinder工作状态：正常

Ceilmoter工作状态：正常

Glance工作状态：

Network工作状态：

## 非功能测试

### 可用性测试

在rabbitMQ可承受的最大压力（32连接，发送10W个大小为4KB的消息）下进行测试（镜像）：

1.发送消息的时候暴力停掉master节点，然后将消息传递切换到slave节点上，观察服务器是否能正常运行、消息是否有丢失。再恢复挂掉的旧master节点，观察是否能再同步到一致的状态。

32连接发送1W个4KB的消息，发送过程中突然停掉master，此时slave节点的镜像队列上有131679个消息。再给slave传递消息。最终slave有451679个消息，此时恢复之前的master，经过查询发现该队列依旧有451679个消息，消息没有丢失。

2.发送消息的时候暴力停掉slave节点，观察服务器是否能正常运行、消息是否有丢失。再恢复挂掉的slave节点，观察是否能再同步到一致的状态。

经过测试，恢复的slave节点状态最终和master一致。

3.给mater的节点发送消息时暴力停掉master节点，删除相关数据（模拟磁盘损坏），再切换到给slave节点发消息，发送完毕之后，重启mater节点，观察是否能同步一致，是否有消息丢失。

经过测试，停掉master、清除相关数据之后，slave节点还有87900个消息，将清楚过数据的master重新和slave建立集群，经过同步后slave和mater都有87900个消息，没有丢失。

4.发送消息时暴力停掉slave节点，删除相关数据（模拟磁盘损坏），消息发送完毕之后，重启slave节点，观察是否能同步一致，是否有消息丢失。

经过测试，slave节点重新加入集群后，和master同步一致，没有丢失消息。

5.模拟断网，stop networking，使得两台直接无法互联，输入cluster_status指令，观察各个节点是否能检测到已经断网。

将rabbit1的networking stop之后，在rabbit2上查看cluster_status，发现rabbit2在running，rabbit1 down掉了。能检测到是否已经断网。

### 扩展性测试

  由于rabbitMQ自带集群功能，扩展性很好，只要再往里面加入节点就可以实现扩展。

### 性能测试

单点单连接的性能极限：

测试单连接发送1KB消息、32KB消息、64KB消息、128KB消息...的速度，直到无法发送消息或者性能有明显下降为止。每次测试要先purge清空队列。

单点多连接的性能极限：

用分别用32、64、128...个连接发送1KB、32KB、64KB...的消息，直到无法发送消息或者性能有明显下降为止。每次测试要先purge清空队列。

集群单连接的性能极限（镜像）：

测试单连接发送1KB消息、32KB消息、64KB消息、128KB消息...的速度，直到无法发送消息或者性能有明显下降为止。每次测试要先purge清空队列。

集群多连接的性能极限（镜像）：

用分别用32、64、128...个连接发送1KB、32KB、64KB...的消息，直到无法发送消息或者性能有明显下降为止。每次测试要先purge清空队列。

| 发送速度\|CPU使用率\|内存占用         | 1KB                                      | 32KB                                     | 64KB                                     | 128KB                                    |
| -------------------------- | ---------------------------------------- | ---------------------------------------- | ---------------------------------------- | ---------------------------------------- |
| 单连接（每个连接100000个消息）         | 313\|5%-6%\|1.2%                         | 234\|6%\|3%                              | 186\|7%-8%\| 3.6%                        | 133\|6%-8%\|19%                          |
| 32个连接（每个连接10000个消息）        | 9900\|110%-144%\| 2.3%                   | 7300-7500\|190%-210%\| 32%               | 5800\|190%-230%\|被强行停掉了因为内存超过阈值了（60%）    | 4200\|260%-270%\|强行被停掉了因为内存超过了阈值（60%）    |
| 64个连接（每个连接10000个消息）        | 20000\|308%-320%\|3.8%                   | 15000\|338%-348%\|被强行停掉了因为内存超过了阈值（60%）   | 9000\|348%-355%\|被强行停掉了因为内存超过了阈值（60%）    | 5000-6000\|355%370%\| 被强行停掉了因为内存超过了阈值（60%） |
| 128个连接（每个连接10000个消息）       | 26000-35000\|255%-255%\| 被强行停掉了因为内存超过了阈值（60%） | 5000-13000\|107%-255% \| 被强行停掉了因为内存超过了阈值（60%） | 900-7500\|30%-314%  \| 被强行停掉了因为内存超过了阈值（60%） | 0-4000\|60%-355%  \| 被强行停掉了因为内存超过了阈值（60%） |
| 集群单连接（镜像）（每个连接100000个消息）   | 313\|13%-17%\| 1.1%                      | 233\|16%-19%\|10.8%                      | 187\|17%-20% \|20.4%                     | 133\|19%-22%\| 35.7%                     |
| 集群32个连接（镜像）（每个连接10000个消息）  | 10000\|270%-304%\|2.2%                   | 很不稳定、被强行停掉了                              | 很不稳定、被强行停掉了                              | 很不稳定、被强行停掉了                              |
| 集群64个连接（镜像）（每个连接10000个消息）  | 很不稳定、被强行停掉了                              | 很不稳定、被强行停掉了                              | 很不稳定、被强行停掉了                              | 很不稳定、被强行停掉了                              |
| 集群128个连接（镜像）（每个连接10000个消息） | 很不稳定、被强行停掉了                              | 很不稳定、被强行停掉了                              | 很不稳定、被强行停掉了                              | 很不稳定、被强行停掉了                              |

在单节点的测试中，可以发现64个连接的时候，服务器传输速度还很稳定，但是到了128连接就发现发送32KB大小的消息，传输速度浮动都很大，所以预测rabbitmq单节点的性能极限应该在128连接发送16KB大小的消息。后经过测试单节点极限在128连接发送8KB大小的消息。

在集群测试中，发现在32个连接发送1W个32KB大小的消息的时候，直接被强行停掉了，之后又测试了16KB，8KB，4KB的情况，发现只有4KB的情况下，才能稳定运行。由此大致得出集群（镜像队列）的极限性能是32个连接每个连接发1W个4KB大小的消息。速度5000/s左右,CPU占用350%-377%

## 与cinder联调

1.同时启动rabbit1和rabbit2，cinder工作正常。

2.rabbit1stop，cinder工作正常。

3.把rabbit1恢复，rabbit2stop，cinder工作正常。

## 与ceilometer联调

1.同时启动rabbit1和rabbit2，ceilometor工作正常。

2.rabbit1stop，ceilometer工作正常。

3.把rabbit1恢复，rabbit4stop，ceilometer工作正常。

## 与nova联调

4.同时启动rabbit1和rabbit2，nova工作正常。

5.rabbit1stop，nova工作正常。

6.把rabbit1恢复，rabbit4stop，nova工作正常。

# 监控rabbitMQ的方案

## 一些基本情况

****每个模块的负责人会单独监控自己的模块，rabbitMQ的监控更倾向于发生问题之后的解决，比如purge掉队列中的冗余消息。另外，openstack中与rabbitmq相关的各个模块用的是同一个rabbitmq的user，这也就是说，不需要单独对某个模块add user，并且每个模块使用rabbitmq所建立的queue和exchange等都是自动完成的，也不需要care创建队列的权限等。基于以上一些情况，个人制定了下面的监控方案。

## 命令行查看最基本的运行状态

输入sudo rabbitmqctl -n rabbit@rabbit1 status查看该节点目前的状态

如果提示没有连接到该节点，则表示该节点挂掉了，需要重新启动。

如果能查看到该节点的状态，则输入sudo rabbitmqctl –n rabbit@rabbit1 list_connections查看连接是否都是running状态， 如果有block状态则表示该进程目前阻塞了。

在目前节点状态查看中，可以查看已经内存使用率、磁盘剩余空间等状态。

## 所要监控的信息

内存占用：超过60%报警。

磁盘占用：超过70%报警。

sudo rabbitmqctl status

每个队列的name、messages、memory。

队列的消息数上限为10*10^4个，memory最大为512MB。如果超过这些阈值，就需要立即进行处理，以免影响整个服务正常运转。

sudo rabbitmqctl list_queues name messages memory

每个连接的state、timeout。

在我们的整个服务中，每个连接的state都应该是running，最大延迟为1s。如果状态不是running或者延迟过高，则需要立即处理。

sudo rabbitmqctl list_connections host state timeout

如果相关阈值需要修改，与每个模块相关负责人商议之后可修改阈值。

在192.168.8.14和192.168.8.35上，有两个脚本，可以查看rabbitmq消息队列状态。

sudo sh /usr/local/bin/monitor_rabbitmq_queue_state.sh

根据提示来进行一些输入就可以了。

截图如下：

## Web插件

查看connection exchange queue等状态，消息数量，内存占用，disc占用等。需要根据实际情况判断是否正常。

消息状态：

节点状态：

connection：

channel：

exchange：

queue：

policy：

一般来说rabbitMQ自带各种流量阈值限制，如果挂掉一般都是因为超过了阈值，要等实际运行的时候进行阈值调整。

来源： <http://blog.csdn.net/cugb1004101218/article/details/21243927>