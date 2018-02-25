[TOC]



# TCC事务机制简介

关于TCC（Try-Confirm-Cancel）的概念，最早是由Pat Helland于2007年发表的一篇名为《Life beyond Distributed Transactions:an Apostate’s Opinion》的论文提出。在该论文中，TCC还是以Tentative-Confirmation-Cancellation作为名称；正式以Try-Confirm-Cancel作为名称的，可能是Atomikos（Gregor Hohpe所著书籍《Enterprise Integration Patterns》中收录了关于TCC的介绍，提到了Atomikos的Try-Confirm-Cancel，并认为二者是相似的概念）。

国内最早关于TCC的报道，应该是InfoQ上对阿里程立博士的一篇采访。经过程博士的这一次传道之后，TCC在国内逐渐被大家广为了解并接受。相应的实现方案和开源框架也先后被发布出来，[ByteTCC](https://github.com/liuyangming/ByteTCC)就是其中之一。

TCC事务机制相对于传统事务机制（X/Open XA Two-Phase-Commit），其特征在于它不依赖资源管理器(RM)对XA的支持，而是通过对（由业务系统提供的）业务逻辑的调度来实现分布式事务。

对于业务系统中一个特定的业务逻辑S，其对外提供服务时，必须接受一些不确定性，即对业务逻辑执行的一次调用仅是一个临时性操作，调用它的消费方服务M保留了后续的取消权。如果M认为全局事务应该rollback，它会要求取消之前的临时性操作，这将对应S的一个取消操作；而当M认为全局事务应该commit时，它会放弃之前临时性操作的取消权，这对应S的一个确认操作。

每一个初步操作，最终都会被确认或取消。因此，针对一个具体的业务服务，TCC事务机制需要业务系统提供三段业务逻辑：初步操作Try、确认操作Confirm、取消操作Cancel。

**1. 初步操作（Try）**
TCC事务机制中的业务逻辑（Try），从执行阶段来看，与传统事务机制中业务逻辑相同。但从业务角度来看，却不一样。TCC机制中的Try仅是一个初步操作，它和后续的确认一起才能真正构成一个完整的业务逻辑。可以认为

```
[传统事务机制]的业务逻辑 = [TCC事务机制]的初步操作（Try） + [TCC事务机制]的确认逻辑（Confirm）。
```

TCC机制将传统事务机制中的业务逻辑一分为二，拆分后保留的部分即为初步操作（Try）；而分离出的部分即为确认操作（Confirm），被延迟到事务提交阶段执行。
TCC事务机制以初步操作（Try）为中心的，确认操作（Confirm）和取消操作（Cancel）都是围绕初步操作（Try）而展开。因此，Try阶段中的操作，其保障性是最好的，即使失败，仍然有取消操作（Cancel）可以将其不良影响进行回撤。

**2. 确认操作（Confirm）**
确认操作（Confirm）是对初步操作（Try）的一个补充。当TCC事务管理器决定commit全局事务时，就会逐个执行初步操作（Try）指定的确认操作（Confirm），将初步操作（Try）未完成的事项最终完成。

**3. 取消操作（Cancel）**
取消操作（Cancel）是对初步操作（Try）的一个回撤。当TCC事务管理器决定rollback全局事务时，就会逐个执行初步操作（Try）指定的取消操作（Cancel），将初步操作（Try）已完成的事项全部撤回。

在传统事务机制中，业务逻辑的执行和事务的处理，是在不同的阶段由不同的部件来完成的：业务逻辑部分访问资源实现数据存储，其处理是由业务系统负责；事务处理部分通过协调资源管理器以实现事务管理，其处理由事务管理器来负责。二者没有太多交互的地方，所以，传统事务管理器的事务处理逻辑，仅需要着眼于事务完成（commit/rollback）阶段，而不必关注业务执行阶段。

而在TCC事务机制中的业务逻辑处理和事务处理，其关系就错综复杂：业务逻辑（Try/Confirm/Cancel）阶段涉及所参与资源事务的commit/rollback；全局事务commit/rollback时又涉及到业务逻辑（Try/Confirm/Cancel）的执行。其中关系，本站将另行撰文详细介绍，敬请关注！

参考文献：

1. <http://www.infoq.com/cn/interviews/soa-chengli>
2. <https://cs.brown.edu/courses/cs227/archives/2012/papers/weaker/cidr07p15.pdf>
3. <http://www.enterpriseintegrationpatterns.com/patterns/conversation/TryConfirmCancel.html>





http://www.bytesoft.org/tcc-intro/