## 工具/原料

- redhat6.4 x64

## 方法/步骤

1. ​

   在终端中输入：vi /etc/sysconfig/network-scripts/ifcfg-eth0

   [![如何在linux系统中设置静态ip地址](image-201708311438/11c260f1-787d-49cf-8a5f-1f661c873afe.jpg)](http://jingyan.baidu.com/album/455a99508be7cda167277865.html?picindex=1)

2. ​

   开始编辑，填写ip地址、子网掩码、网关、DNS等。其中“红框内的信息”是必须得有的。

   [![如何在linux系统中设置静态ip地址](image-201708311438/56c1763a-bd27-42b1-8a80-704bee0dbcc9.jpg)](http://jingyan.baidu.com/album/455a99508be7cda167277865.html?picindex=2)

3. ​

   编辑完后，保存退出。

   [![如何在linux系统中设置静态ip地址](image-201708311438/5634d85b-e596-4656-b245-4ee8515a677a.jpg)](http://jingyan.baidu.com/album/455a99508be7cda167277865.html?picindex=3)[](http://jingyan.baidu.com/album/455a99508be7cda167277865.html?picindex=3)[](http://jingyan.baidu.com/album/455a99508be7cda167277865.html?picindex=3)[](http://jingyan.baidu.com/album/455a99508be7cda167277865.html?picindex=3)[](http://jingyan.baidu.com/album/455a99508be7cda167277865.html?picindex=3)

4. ​

   重启网络服务。service network restart或/etc/init.d/network restart

   [![如何在linux系统中设置静态ip地址](image-201708311438/af9415de-15e5-4307-b98a-0b51585f652f.jpg)](http://jingyan.baidu.com/album/455a99508be7cda167277865.html?picindex=4)

5. ​

   ping网关，ping外网进行测试。都能ping通表示网络正常。

   [![如何在linux系统中设置静态ip地址](image-201708311438/4ad754de-1fb2-464c-8151-caecfaa71a1e.jpg)](http://jingyan.baidu.com/album/455a99508be7cda167277865.html?picindex=5)

   [![如何在linux系统中设置静态ip地址](image-201708311438/a3e6ebe0-88ad-41b7-95cd-a3567723030e.jpg)](http://jingyan.baidu.com/album/455a99508be7cda167277865.html?picindex=6)

6. ​

   摘要：

   ---修改ip地址---

   即时生效:

   \# ifconfig eth0 192.168.1.155 netmask 255.255.255.0

   重启生效:

   修改/etc/sysconfig/network-scripts/ifcfg-eth0

   ​

   ---修改default gateway---

   即时生效:

   \# route add default gw 192.168.1.1

   重启生效:

   修改/etc/sysconfig/network-scripts/ifcfg-eth0

   ​

   ---修改dns---

   修改/etc/resolv.conf

   修改后即时生效，重启同样有效

   ​

   ---修改host name---

   即时生效:

   \# hostname test1

   重启生效:

   修改/etc/sysconfig/network

   END

来源： <<http://jingyan.baidu.com/article/455a99508be7cda167277865.html>>

 