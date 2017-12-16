VMware Workstation与VMware vSphere的区别

2014-09-19 10:47:33

在学完vSphere后，想起了VMware Workstation。这两个都是虚拟化的东西，这两者到底有什么本质的不同呢？顺着我的思路我开始将所学过的进行检索期望从中寻到一丝半点的线索。很快大脑中建立了两个对他们明显的标签

VMware Workstation：用于实验（个人）

VMware vSphere：用于生产（企业）

之后问了老师，老师连说不是

VMware Workstation是基于OS的虚拟OS资源的虚拟化工具，它能将OS闲置的资源加以充分利用，如果你的这台OS机器性能足够好，可以通过VMware Workstation创建DNS，DHCP，Apache等许多服务器，一个机子运行多个服务，节省了许多开支，这个作用是虚拟化所共有的特点。

因为生活中我们常常用它来虚拟实验环境我们大多数的人就把它当做一种用于玩操作系统的工具，这么理解是有偏差的。

VMware vSphere则是一种虚拟化方案包括很多东西，其核心是ESXi，ESXi独立安装在裸机上的操作系统（注意它不基于任何OS，它本身就是OS），通过它物理机的硬件资源被虚拟化为虚拟资源，之后再通过vCenter就能将安装了ESXi操作系统的物理机的资源进行整合，化为一个总的资源池，在这个资源池里面我们为各个部门划分不同大小的资源池方便其使用。

准确来说这两个不属于一个概念

VMware Workstation是一个基于OS的软件，而VMware vSphere则是根据企业的实际情况设计的一个虚拟化方案，它设计的软件，技术和要考虑的问题都要比VMware Workstation要多，要详细，要具体。

简单来说

VMware Workstation是一款基于OS的虚拟化软件

VMware vSphere则是一个具体的虚拟化方案

本文出自 “[张帆-IT的奇幻漂流](http://chawan.blog.51cto.com/)” 博客，请务必保留此出处<http://chawan.blog.51cto.com/9179874/1555047>