VM虚拟机装centos无法自动获取IP的解决方法

分类: software
日期: 2015-06-28

原文地址: 

http://blog.chinaunix.net/uid-29632145-id-5101226.html

------

****[VM虚拟机装centos无法自动获取IP的解决方法]() *2015-06-28 22:00:23*

分类： Windows平台

在[虚拟机](http://www.cr173.com/s/VmareWorkstation/)VM里面装了centos系统，网卡选用桥接方式。

刚开始的时候还能自动获取到IP地址，突然有一天IP消失了，再怎么重启都无法获取IP地址。因为之前是可以获取IP，而且 VMware NAT Service 和 VMware DHCP Service 两个已启动，没做任何的改动，所以配置肯定是没问题的。百思不得其解啊！！！

后来检查Edit--Virtual Network Editor...，进去以后看到VMnet0  Bridged Auto-bridging - - -  ，点选VMnet0，在VMnet Information里面，点击“Bridged to: ”后面的“Automatic”下拉菜单，发现有两个网卡，**一个是VPN的，一个物理网卡。果断将“Automatic”更换为物理网卡**，重新启动Centos系统，久违的IP回来了。PS：我的物理网卡连接的网络是自动分配IP的。

哥有记笔记的习惯，所以赶紧写下来了。希望对大家有用。

**CentOS配置网卡开机自动获取IP地址：**

vi /etc/sysconfig/network-scripts/ifcfg-eth0

将 ONBOOT="no"  改为 ONBOOT="yes"

保存后： service network restart

查看IP：  ifconfig