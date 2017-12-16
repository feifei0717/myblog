# JPA/Hibernate/Spring Data概念

【从零开始学习Spirng Boot—常见异常汇总】

事情的起源，无意当中在一个群里看到这么一句描述：”有人么？默默的问一句，现在开发用mybatis还是hibernate还是jpa”?然后大家就进行各种回答，但是没有有质疑这句话描述的合理性，个人觉得需要清楚概念的，在这里mybatis大家肯定是没有什么疑问，我们把上面那句话更改下，方便我们抛出一些点出来，去掉mybatis修改为：“现在开发是使用hibernate还是jpa”?那么在这里的话，我们就要清楚hibernate/jpa/spring

data/spring data jpa到底怎么一个关系？

## **什么是JPA?**

JPA全称Java Persistence API.JPA通过JDK 5.0注解或XML描述对象－关系表的映射关系，并将运行期的实体对象持久化到数据库中。[百度百科JPA](http://baike.baidu.com/link?url=5x4ncJTsKTOKerWYJlMwHLoPINPP6VGi33BlAvWDKC5RrGCmhNYKvVcmcop1gNW4fjH1ILnLqDZHlzOw_f7-6a)

在上面只是一个JPA的定义，我们看看另外一段更能看出是什么的描述：

JPA(Java Persistence API)是Sun官方提出的Java持久化规范。它为Java开发人员提供了一种对象/关系映射工具来管理Java应用中的关系数据。

在这段话就比较清晰了，这里有一个关键词“持久化规范”。我们可以拆成两部分进行解读“持久化”、“规范”。所谓的持久化是将程序数据在瞬时数据（比如内存中的数据）转换为持久数据（比如：保存到数据库中，磁盘文件…）。这个个人粗糙的描述，看看专业的描述，如下：

持久化（Persistence），即把数据（如内存中的对象）保存到可永久保存的存储设备中（如磁盘）。持久化的主要应用是将内存中的对象存储在的数据库中，或者存储在磁盘文件中、XML数据文件中等等。

持久化是将程序数据在持久状态和瞬时状态间转换的机制。

JDBC就是一种持久化机制。文件IO也是一种持久化机制。

好了，上面已经描述很清楚了，我们在说说“规范”： 所谓的规范意指明文规定或约定俗成的标准。如：道德规范、技术规范，公司管理规范。

那么“持久化规范”就是Sun针对持久化这一层操作指定的规范，如果没有指定JPA规范，那么新起的框架就随意按照自己的标准来了，那我们开发者的世界就玩完了，我们就没法把我们的经历全部集中在我们的业务层上，而是在想我们进行兼容了，这种情况有点像Android开发，Android本身有官方的SDK,但是由于SDK过于开源了，结果导致很多厂商基于SDK二次开发，但是开发完兼容性就不是很好，最好的例子就是Android的头像上传，就是一件很烦人的事情。好了，JPA就唠叨到这里。

## **什么是Hibernate?**

这里引用百度百科的话[hibernate](http://baike.baidu.com/link?url=VBjBmRmgo1_Rn3XOkSJ4RfmPzaar9UNH9Oi1LyWdsvwiKK5wgmnm6spC1aCsuWkhvhOSOPML1UxQmAfmHu8Q_mhUBRRHvmId7vkS2sFdMM7)：

Hibernate是一个开放源代码的对象关系映射框架，它对JDBC进行了非常轻量级的对象封装，它将POJO与数据库表建立映射关系，是一个全自动的orm框架，hibernate可以自动生成SQL语句，自动执行，使得Java程序员可以随心所欲的使用对象编程思维来操纵数据库。Hibernate可以应用在任何使用JDBC的场合，既可以在Java的客户端程序使用，也可以在Servlet/JSP的Web应用中使用，最具革命意义的是，Hibernate可以在应用EJB的[J2EE](http://baike.baidu.com/view/1507.htm)架构中取代CMP，完成[数据持久化](http://baike.baidu.com/view/4549557.htm)的重任。

在上面这段描述中抓住核心的一句话就可以了“是一个全自动的ORM框架”。那么是ORM呢? ORM是对象关系映射的意思，英语：Object Relational Mapping简称ORM，是一种程序技术，用于实现面向对象编程语言里不同系统类型的系统之间的数据转换。好了，更多的概念需要自己去挖掘，这里只是抛装引玉下。

## **什么是Spring Data?**

Spring Data是一个用于简化数据库访问，并支持云服务的开源框架。其主要目标是使得数据库的访问变得方便快捷，并支持map-reduce框架和云计算数据服务。此外，它还支持基于关系型数据库的数据服务，如Oracle

RAC等。对于拥有海量数据的项目，可以用Spring Data来简化项目的开发，就如Spring Framework对JDBC、ORM的支持一样，Spring Data会让数据的访问变得更加方便。

在上面这段描述中我觉得核心的就是“Spring Data是用于简化数据库访问，支持云服务的开源框架”。所以Spring Data本身就是一个开源的框架。

## **什么是Spring Data JPA?**

我们先看一个描述：

Spring Data JPA能干什么

可以极大的简化JPA的写法，可以在几乎不用写实现的情况下，实现对数据的访问和操作。除了CRUD外，还包括如分页、排序等一些常用的功能。

首先我们需要清楚的是Spring Data是一个开源框架，在这个框架中Spring Data JPA只是这个框架中的一个模块，所以名称才叫Spring

Data JPA。如果单独使用JPA开发，你会发现这个代码量和使用JDBC开发一样有点烦人，所以Spring Data JPA的出现就是为了简化JPA的写法，让你只需要编写一个接口继承一个类就能实现CRUD操作了。

## **JPA/Hibernate**关系？

我们先看下别人的描述：

Jpa是一种规范，而Hibernate是它的一种实现。除了Hibernate，还有EclipseLink(曾经的toplink)，OpenJPA等可供选择，所以使用Jpa的一个好处是，可以更换实现而不必改动太多代码。

从上面这个描述，我们能就是能看出: JPA定义了一个规范，Hibernate是其中的一种实现方式可以，所以我们可以说：Hibernate是JPA的一种实现方式。但是这么说就有点欠妥当了：开发是使用hibernate还是jpa。如果你回答使用JPA的话，那么你根本做不了什么事情，因为你需要使用它具体的一种实现方式，比如：Hibernate,EclipseLink,toplink。如果回答说是使用Hibernate的话，还勉强说的过去，但是在Hibernate中也有JPA的影子。但是这里不要造成一个误解，hibernate一定依赖JPA什么之类的，JPA现在只是Hibernate功能的一个子集。Hibernate从3.2开始，开始兼容JPA的。Hibernate3.2获得了Sun

TCK的JPA(JavaPersistence API)兼容认证。

那么我们在描述的时候，别人问你持久化具体使用了什么，我们可以说：使用了基于Hibernate实现的JPA，或者是Hibernate JPA，那么加上spring data的，我们一般都简化说：spring data jpa，一般默认的就是使用了hibernate进行实现，现在网上这方面的资料也比较多，可能就约定俗成了。当然你要别人清楚的话，可以自己在进行补充下。

好了，这个困惑就到这里，在这里就是博主个人的一些见解，有什么个别的见解都可以在评论中探讨，如有错误之处，请指正。

这篇也是博主花了一些心血去梳理的，请大家都都支持。



http://www.jianshu.com/p/49b31ef74ff3