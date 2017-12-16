# hadoop1.x MapReduce之JobTracker,TaskTracker,hadoop调度器



**DataNode 和NameNode 是针对数据存放来而言的**

**JobTracker和TaskTracker是对于MapReduce执行而言的**

## **一：JobTracker**

JobTracker协作作业的运行；

负责调度分配每一个子任务task运行于TaskTracker上，如果发现有失败的task就重新分配其任务到其他节点。

一般情况应该把JobTracker部署在单独的机器上。JobTracker与TaskTracker把持心跳；

​       **JobTracker失败：**

​           1：JobTracker失败在所有的失败中是最严重的一种；

​           2：hadoop没有处理jobtracker失败的机制。--它是一个单点故障。

​           3：在未来的新版本中可能可以运行多个JobTracker。（hadoop2.0以后）

​           4：可以使用ZooKeeper来协作JobTracker。（以后会有zookeeper专题）

## **二：TaskTracker**

TaskTracker运行作业划分后的任务

TaskTracker是运行在多个节点上的slaver服务。TaskTracker主动与JobTracker通信，接收作业，并负责直接

执行每一个任务，为了减少网络带宽TaskTracker最好运行在HDFS的DataNode上；

​      **TaskTracker失败：**

​            1：一个TaskTracker由于崩溃或运行过于缓慢而失败，它会向JobTracker发送“心跳”。

​            2：如果有未完成的作业，JobTracker会重新把这些任务分配到其他的TaskTracker上面运行。

​            3：即使TaskTracker没有失败也可以被JobTracker列入黑名单。

 

## **三：hadoop调度器 Hadoop Job Scheduler**

Hadoop默认的调度器是基于队列的FIFO调度器：

​    所有用户的作业都被提交到一个队列中，然后由JobTracker先按照作业的优先级高低，再按照作业提交时间     的先后顺序选择将被执行的作业。

​    优点: 调度算法简单明了，JobTracker工作负担轻。

​    缺点: 忽略了不同作业的需求差异。

Fair Scheduler(公平调度器)：

​    1：多个Pool，Job需要被提交到某个Pool中；

​    2：每个pool可以设置最小 task slot（猜测最小的job数），称为miniShare

​    3：FS会保证Pool的公平，Pool内部支持Priority（优先级）设置，支持资源抢占（优先级）

 





http://blog.csdn.net/u011630575/article/details/69396235