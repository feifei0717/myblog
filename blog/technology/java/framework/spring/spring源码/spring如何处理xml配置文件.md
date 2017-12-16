# spring如何处理xml配置文件

通过xml配置文件来使用spring是历来传统了.当然,我们现在也可以用annotation来进行配置.
但是两种方式孰好孰坏还有待商榷,抛开其他原因,个人觉得使用annotaion理解起来更容易让人迷糊.
我的目的是研究下spring的实际运行方式,知其然知其所以然.所以在此就从xml下手了.

##spring为什么需要配置文件

简单来说,spring最基本的功能是IOC容器.既然是容器,那么所容纳之物从何而来呢?当然是从配置文件中来.
根据ApplicationContext一系列类的定义,我们可以看出spring预留了扩展的接口.类的配置信息可以从文件中来,也可以从数据库中来,甚至从网络中获取.
单就从文件中来这一项就有多种可能,我看到spring内置的有基于properties文件的,有基于xml文件的.
基于xml文件的容器其实就是XmlApplicationContext的一系列类了.这些类依靠XmlBeanDefinitionReader对xml文件进行处理.

##如何处理xml文件

spring处理xml文件,主要有两点.

1. 我们通常意义上的处理xml,其实就是解析xml文件,获取里面的信息

2. 将从xml文件中解析出来的信息,转换成类定义也就是BeanDefinition,然后放到容器里面去.

第一点其实很容易做到,处理xml嘛,dom,sax之流的想怎么用就怎么用.
关键是第2点,如何转换成BeanDefinition.
我们来分析下spring的配置文件的内容:

- 我们见得最多用的最多的其实就是&lt;bean>标签,作用是定义一个类嘛,其属性放的是类名.

- 还会用到一些像小工具一样的&lt;map>,&lt;list>标签
- 然后就是各种神奇开关标签比如说&lt;context:component-scan>,&lt;mvc:annotation-driven>这些开关的作用就是启用XXX牛逼特性.

对于bean标签,我们完全可以硬编码嘛,遇到bean就直接转成一个BeanDefinition,简单粗暴.
map和list也是一样的,这种功能单一,简单明了的东西很好处理嘛,硬编码就行.
下面就是神奇标签们了.其实所有的神奇标签都有一个共同点,那就是都带着帽子,比如tx:,context:,mvc:这些.这些帽子的学名叫做命名空间,每个命名空间都有各自的schema(命名空间和schema是xml本身的一些知识点,不懂的自行了解).
其实bean这个大路货也有帽子的,帽子名可以是beans:(这个名字可以自己改的),同样也有自己的schema.由于bean是默认的,并且用的比较多,为了写着短,我们能省就省了.

那么神奇标签们应该如何转换呢?
首先我们要明白神奇标签其实也都对应着一些类定义,为了大家写着看着方便,spring把它给简化了.具体对应的类可以看它的schema,里面有注释的.
既然是类,那就好办了,转换成BeanDefinition吧.如何转呢,总不能还硬编码吧.新的帽子(命名空间)层出不穷,我怎么可能都提前给写进去呢.

spring本身是个有文化的框架,所谓有文化模块化,所以它也是一个高度模块化的框架,beans,tx,web,jdbc,jpa,data等模块(jar包)各司其职.
每个模块都有自己的schema,并且各自负责处理自己的schema,总不能这些都让老大哥core和beans干完吧,再说以后小弟多起来,他们也不可能个个都认识啊.
自己处理自己的schema,的确是个好主意,减轻了beans模块工作量的同时由于不用加载用不到的东西也缩减了我们程序的体积.方法这么好,如何实现呢?
**spring是这么规定的,想要跟我混得小弟都要在jar包的META-INF目录下放两个文件:spring.schema和spring.handlers.其中spring.handlers中列出了命名空间及对应的解析器的类名.而spring.schema则列出了命名空间URI和本地jar包中放的schema文件路径的对应关系,方便做xml的validation**.

这样流程就清晰了起来.当容器要开始解析xml文件的时候,会先扫描所有的jar包,把spring.handlers中得信息拿出来,然后开始解析xml文件,遇到默认空间的标签比如bean,就采用默认空间解析器来解析,遇到不认识的标签,就根据这个命名空间的名字去从spring.handlers获取的信息里面找,找到对应的解析器之后,把BeanFactory传给它,让它去解析,并注册.然后就没有然后了.

由此可见,只要符合这个规定,我们也可以定义自己的帽子(命名空间)和schema还有解析器,然后按照规定的格式放进去.这样就也成了spring的小弟了.





https://my.oschina.net/huanger/blog/290342