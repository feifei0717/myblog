# 《SLF4J官方文档》传统桥接API

[原文地址](http://www.slf4j.org/legacy.html)

通常，有些组件取决或依赖Logging API，而不是SLF4J。你也可以假设不久的将来这些组件不会转变成SLF4J。为了处理这种情况，SLF4J装载了几个可以重定向调用的桥接模块，这些模块使得log4j, JCL and java.util.logging APIs

表现得仿佛他们是SLF4J的代替。下图阐述了这个想法。

请注意在你控制下的源代码，你真得应该用[slf4j-migrator](http://www.slf4j.org/migrator.html)。本页所描述的基于二进制的解决方案是适合超出你控制范围的软件。

![legacy](http://ifeve.com/wp-content/uploads/2016/04/legacy.png)

## 从Jakarta Commons Logging(JCL)逐渐迁移到SLF4J

**jcl-over-slf4j.jar**

为了简易从JCL到SLF4J的迁移，SLF4J分步包含了jar文件*jcl-over-slf4j.jar*。这个jar文件是用来替代JCL1.1.1版本的。它实现了JCL的公共API，但它用的是SLF4J的底层，因此命名为“SLF4J上的JCL”.

SLF4J上的JCL实现允许你逐渐迁移到SLF4J，特别是如果一些软件依赖包在可见的将来继续使用JCL.你可以立即享受SLF4J可靠性的益处，同时也保持向后兼容性。只需将*common-logging.jar*替换为*jcl-over-slf4j.jar**。*随后，底层日志框架的选择将由SLF4J完成而不是JCL,但 [没有折磨JCL类加载的头疼]。底层日志框架可以是任何SLF4J支持的框架。通常，用*jcl-over-slf4j*代替*common-logging.jar*将立即地、永久地解决commons日志相关的类加载问题。

**Slf4j-jcl.jar**

部分我们的用户在转换到SLF4J API后意识到在一些环境下，使用JCL是强制的，使用SLF4J可能成为问题。在这种不常见但很重要的情况下，SLF4J提供一个JCL绑定，在*slf4j-jcl.jar*中可以找到。JCL绑定将所有的由SLF4J产生的日志调用分发给JCL。这样，如果由于某些原因一个已存在的应用必须使用JCL,应用的部分仍可以用透明的方式编码到大的应用环境，而不是SLF4J API。你选择的SLF4J API将在应用的其余部分不可见，这样你可以继续使用JCL.

**jcl-over-slf4j.jar不能和 slf4j-jcl.jar混淆**

SLF4J上的JCL, 也就是*jcl-over-slf4j.jar*，在JCL需要支持向后兼容的原因下，它派上了用场。与JCL联系，它可以解决这些问题，没有一定要采取SLF4J API，推迟到一段时间后再作决定。

另一方面，在你的组件已经采用了SLF4J API后，*slf4j-jcl.jar*是有用的，你需要把组件嵌入到更大的应用环境中，在这个环境下JCL表面上是需要的。在没有扰乱应用的更大部分，你的软件组件仍可以使用。实际上，*slf4j-jcl.jar*将分发所有的日志决定给JCL,那样组件依赖的SLF4J API将对更大的整体透明。

注意*jcl-over-slf4j.jar*和*slf4j-jcl.jar*不能同时部署。前一个jar文件将导致JCL分发日志系统的选择命令给SLF4J，后一个jar文件将导致SLF4J分发日志系统的选择命令给JCL。将导致[无限循环](http://www.slf4j.org/codes.html#jclDelegationLoop) 。

 

## log4j-over-slf4j（slf4j上的log4j）

SLF4J装载了一个叫*log4j-over-slf4j*的模块。它允许log4j用户转移已存在的应用到SLF4J，同时不用改变一行代码，只需要简单地用*log4j-over-slf4j.jar*代替*log4j.jar*。

**它如何工作？**

*log4j-over-slf4j*模块包含了大部分使用的log4j类的替代类，是org.apache.log4j.Category, org.apache.log4j.Logger, org.apache.log4j.Priority,org.apache.log4j.Level, org.apache.log4j.MDC, and org.apache.log4j.BasicConfigurator.这些被替代类重新把所有的工作指向相关的SLF4J类。

在你自己的应用中使用*log4j-over-slf4j*，第一部是定位，然后用*log4j-over-slf4j.jar*代替*log4j.jar**。*注意你仍需要SLF4J绑定，它是*log4j-over-slf4j.jar*完全工作的根基。

在大部分情况下，为了从log4j迁移到SLF4J，所有的花费只是替换jar文件。

注意由于这个迁移，log4j配置文件将不再被获得。如果你需要迁移log4j.properties文件到logback，[log4j转换器](http://logback.qos.ch/translator/)会给帮助。配置logback，请参考[它的手册](http://logback.qos.ch/manual/index.html) 。

**何时工作？**

当应用调用不存在于桥接中log4j组件时，*log4j-over-slf4j*模块将不会工作。比如，当应用代码直接引用log4j输出端，过滤器或者属性配置器，*log4j-over0slf4j*将不会完全替代log4j。然而，当log4j通过配置文件配置后，变成*log4j.properties* 或 *log4j.xml**，**log4j-over-slf4j*模块应该只是工作良好。

**系统开销怎么样？**

直接使用*log4j-over-slf4j*代替log4j的系统开销相对小很多。之前已经给出，*log4j-over-slf4j*立即分配所有的工作给SLF4J, CPU的系统开销在几纳秒内应该忽略不计。有个内存系统开销，对应于每个日志器的hashmap的入口，这个对于有几千个日志器的大应用来说是可以接受的。另外，如果你选择logback作为底层日志系统，已知logback比log4j更快同时更节省内存，使用logback直接代替log4j的增益应该补偿了使用*log4j-over-slf4j*的过度花费。

**log4j-over-slf4j.jar 和slf4j-log4j12.jar 二者不能同时存在**

*slf4j-log4j12.jar*是给SLF4J提供log4j绑定，这将迫使所有的SLF4J的调用分配给log4j。*log4j-over-slf4j.jar*将反过来讲所有的log4J API调用分配给SLF4J等效的方法。如果二者同时存在，SLF4J调用将分发给log4j, 同时log4j调用重定向到SLF4J，导致进入一个[死循环](http://www.slf4j.org/codes.html#log4jDelegationLoop) 。

 

## jul-to-slf4j bridge（jul到slf4j桥接）

jul-to-slf4j模块包括java.util.logging(jul)handler.叫做SLF4JBridgeHandler，它将所有接收到的jul记录发送到SLF4J API。请看[SLF4JBridgeHandler javadocs](http://www.slf4j.org/api/org/slf4j/bridge/SLF4JBridgeHandler.html)使用指导。

 

**注意性能**–与其他桥接模块相反的名称为jcl-over-slf4j和log4j-over-slf4j，二者重实现了JCL和独立地log4j，jul-to-slf4j模块没有重实现java.util.logging，因为java.*下的包命名空间不能替换。反而，jul-to-slf4j等价地转换[LogRecord](http://java.sun.com/j2se/1.5.0/docs/api/java/util/logging/LogRecord.html?is-external=true) 对象到它们的SLF4J中。请注意转换工程导致的构建LogRecord实例的花费，而不是SLF4J日志器对于给定的等级是否已禁用了。因此，jul-to-slf4j转换可能严重地增加了禁用日志声明的系统开销（60倍或6000%），同时明显地影响开启日志声明的性能（大体上增加20%）。在LevelChangePropagator的帮助下，logback0.9.25版本可能完全消除禁用日志声明引起的60倍转换系统开销。

如果你关心应用的性能，只有当下列2种情况是真的时，是用SLF4JBridgeHandler是合适的：

1.  几乎没有u.l日志声明在运行

2．已安装LevelChangePropagator

## jul-to-slf4j.jar 和slf4j-jdk14.jar 二者不能同时存在

*slf4j-jdk14.jar*是jul到SLF4J的绑定，将强制SLF4J的调用分配给jul。另一方面，jul-to-slf4j.jar，加上SLF4JBridgeHandler的安装，加上SLF4JBridgeHandler的安装,通过调用“SLF4JBridgeHandler.install()“将jul记录发送给SLF4J。因此，如果两个jar文件同时存在（SLF4JBridgeHandler已安装），slf4的调用将被分配给jul, jul记录将发送到SLF4J，导致一个死循环。

 





http://www.bijishequ.com/detail/337658