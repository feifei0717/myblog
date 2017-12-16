# Java开发人员需要注意的五大Docker误区

【编者的话】Docker现在很火，容器技术看上不无所不能，但这实际上是一种误解，不要被炒作出来的泡沫迷住双眼，本文抛去炒作，理性地从Java程序员的角度，列举出Docker目前的五大误区，帮助你更好地理解Docker的优势和问题。

抛去那些媒体和厂商们的炒作，我们如何才能更好更理性的使用Docker？

Docker最近备受关注，原因显而易见。如何成功交付代码一直困扰着大家。传统的容器技术在众多需求和模板中乱成一团。而Docker可以简单且重复的创建容器。相比其它容器，使用Docker可以更快、更自然的交付代码。Duang，Docker火了！随之而来也有一些误解和误区。不要太相信别人说Docker好用或者不好用。自己理性地全面思考一下Docker，会帮助你真正理解是否真的需要它。

本文列举了从Java角度的五大Docker误读。不过首先介绍些背景知识。为了更好地理解Docker，我们咨询了[Fewbytes](http://www.fewbytes.com/)的[Avishai Ish-Shalom](https://www.linkedin.com/in/nukemberg)，他有丰富的Docker经验，也是DevOps Days会议的组织者。我们和他一起列举出了这些误解。

### 主要误区

#### 1. Docker是轻量级虚拟机

这是大家初学Docker时最主要的误解。这种误解倒也情有可原，Docker的确看上去有点像虚拟机。[Docker网站](https://www.docker.com/whatisdocker/)上甚至有人比较了Docker和虚拟机的区别。但是，Docker实际上不是轻量级虚拟机，而是改进了的Linux容器（[LXC](https://linuxcontainers.org/)）。Docker和虚拟机是完全不一样的，如果你把Docker容器当成轻量级虚拟机来用，会遇到很多问题。

在使用Docker之前，必须了解Docker容器和虚拟机有很多本质的区别。

资源隔离：Docker达不到虚拟机所能提供的资源隔离水平。虚拟机的资源是高度隔离的，而Docker从设计之初就需要共享一些资源，这些资源是Docker无法隔离和保护的，比如页缓存和[内核熵池](http://en.wikipedia.org/wiki/Entropy_%28computing%29)。（注：内核熵池很有趣，它收集并且存储系统操作生成的随机比特。机器在需要随机化时会使用这个池，比如密码相关。）如果Docker容器占用了这些共享资源，那么其它进程在这些资源被释放前只能等待。

开销：大多数人都知道虚拟机的CPU和RAM能提供类似物理机的性能，但是有很多额外的IO开销。因为放弃了虚拟机的guest OS，Docker的package更小，比起虚拟机需要更少的存储开销。但这并不意味着Docker没有任何开销问题。Docker容器依然需要注意IO开销的问题，只不过没有虚拟机严重而已。

内核使用：Docker容器和虚拟机在内核使用上完全不同。每个虚拟机使用一个内核。Docker容器则是在所有容器间共享内核。共享内核带来一些效率的提升，但是以高可用和冗余为代价。如果虚拟机发生了内核崩溃，只有这个内核上的虚拟机会受影响。而Docker容器如果内核崩溃了，所有的容器都会受影响。

#### 2. Docker使得应用可扩展

因为Docker可以在很短的时间内在多个服务器上部署代码，自然有人会觉得Docker可以让应用自身变得可扩展。不幸的是，这是错误的。代码是应用的基石，而Docker并不会重写代码。应用的可扩展性依然取决于程序员。使用Docker并不会自动得让你的代码易于扩展，只是让这些代码更容易跨服务器部署而已。

#### 3. Docker在生产环境广为使用

因为Docker势头正劲，很多人便认为Docker可以在生产环境上大规模使用。事实上，这是不对的。注意Docker还是很新的技术，还不成熟，正在成长，这意味着还有很多烦人的bug和待完善的功能。对新技术感兴趣这没错，但是最好要弄清楚新技术的正确使用场景和需要注意的地方。现在，Docker很容易应用到开发环境。使用Docker可以很容易地搭建出很多不同的环境（至少，给人的感觉是能够搭建出不同的环境），这对于开发很有用。

而在生产环境中，Docker的不成熟和不完善也限制了使用场景。比如，Docker不直接支持对多机器的网络和资源的监控，这使得它几乎无法在生产环境中使用。当然也有很多有潜力的地方，比如可以将同一个package从开发环境直接部署到生产环境。还有一些Docker运行时特性对于生产环境也很有用。但是总的来说，在生产环境里，目前不足多于优势。这并不是说无法成功运用到生产环境，只是现在还不能指望它一下子成熟和完美。

#### 4. Docker是跨OS的

另一个误解是Docker在任意操作系统和环境上都可以工作。这可能来自于装卸货物的集装箱的类比，但是软件和操作系统的关系可不像船位那么简单直接。

实际上，Docker只是Linux上的技术。并且Docker依赖特定的内核特性，必须要有最新版本的内核才行。基于不同OS的差异性，跨OS时，如果使用的不是最底层通用的特性，会遇到很多麻烦的问题。这些问题可能只有1%的发生率，但是当你在多台服务器上部署时，1%也是致命的。

虽然Docker只在Linux上运行，但是也可以在OS X或者Windows上使用Docker。使用[boot2docker](https://docs.docker.com/installation/mac/)会在OS X或Windows机器上运行一个Linux虚拟机，这样Docker可以在这个虚拟机里运行。

#### 5. Docker增强应用的安全性

觉得Docker可以改进代码和交付代码过程的安全性，这也是误解。这也是真实的集装箱和软件上容器的差别。Docker是一种容器化技术，添加了编排方法。但是Linux的容器有一些安全漏洞可能会被攻击。Docker并没有为这些漏洞添加任何安全层或者补丁。它还不是能保护应用的铁布衫。

### 从Java角度看

一些Java开发人员已经开始使用Docker。Docker的某些特性让我们更容易构建可扩展的上下文环境。不像[uber-jar](http://stackoverflow.com/questions/11947037/what-is-an-uber-jar)，Docker可以帮助你将所有的依赖（包括JVM）打包到一个随时可发布的镜像中。这也是Docker对于开发人员来说最迷人的地方。但是，这也会带来一些隐患。一般来说，程序员需要用不同的方式和代码交互 - 监控它，调试它，连接它，调优它....如果使用Docker，这些都会需要额外的工作。

比如，我们想使用[jconsole](http://openjdk.java.net/tools/svc/jconsole/)，它依赖于JMX功能，JMX因为要使用RMI又需要网络。使用Docker的话就不是很直接，需要[一些技巧](http://ptmccarthy.github.io/2014/07/24/remote-jmx-with-docker/)去开启所需端口。我们最初发现这个问题是当我们想要构建[Takipi](https://www.takipi.com/?utm_source=blog&utm_medium=in-post&utm_content=docker&utm_campaign=java)的Docker应用，我们不得不在容器里JVM之外运行了一个后台程序。详细的解决方案在[GitHub](https://github.com/chook/docker-takipi)上。

另外一个很严重的问题是Docker容器的性能调优相当困难。当使用容器时，你不知道每个容器到底会分配多少内存。如果你有20个容器，内存会以你不确定的方式分配给它们。如果你打算用参数-Xmx调优堆的大小，就很困难，因为对Docker容器内JVM的处理取决于能够自动得到该容器分配到的内存大小。如果都不知道分配了多少内存，性能调优几乎不可能。

### 结论

Docker是很有意思的技术，有一些真实有效的使用场景。作为一个新兴技术，还需要大量时间来解决缺失的功能和已知的bug。但是，现在这个领域的确有很多的炒作。不过记住哦，炒作可不是成功~



原文链接：[Ignore the Hype: 5 Docker Misconceptions Java Developers Should Consider](http://blog.takipi.com/ignore-the-hype-5-docker-misconceptions-java-developers-should-consider/)（翻译：崔婧雯 校对：郭蕾）

译者介绍

来源： <http://dockone.io/article/236>