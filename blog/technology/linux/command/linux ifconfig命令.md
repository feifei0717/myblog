# linux ifconfig命令

许多windows非常熟悉ipconfig命令行工具，它被用来获取网络接口配置信息并对此进行修改。Linux系统拥有一个类似的工具，也就是ifconfig(interfaces config)。通常需要以root身份登录或使用sudo以便在Linux机器上使用ifconfig工具。依赖于ifconfig命令中使用一些选项属性，ifconfig工具不仅可以被用来简单地获取网络接口配置信息，还可以修改这些配置。

## 1．命令格式：

ifconfig \[网络设备\]\[参数\]

## 2．命令功能：

ifconfig 命令用来查看和配置网络设备。当网络环境发生改变时可通过此命令对网络进行相应的配置。

## 3．命令参数：

up 启动指定网络设备/网卡。

down 关闭指定网络设备/网卡。该参数可以有效地阻止通过指定接口的IP信息流，如果想永久地关闭一个接口，我们还需要从核心路由表中将该接口的路由信息全部删除。

arp 设置指定网卡是否支持ARP协议。

-promisc 设置是否支持网卡的promiscuous模式，如果选择此参数，网卡将接收网络中发给它所有的数据包

-allmulti 设置是否支持多播模式，如果选择此参数，网卡将接收网络中所有的多播数据包

-a 显示全部接口信息

-s 显示摘要信息（类似于 netstat -i）

add 给指定网卡配置IPv6地址

del 删除指定网卡的IPv6地址

<硬件地址> 配置网卡最大的传输单元

mtu<字节数> 设置网卡的最大传输单元 (bytes)

netmask<子网掩码> 设置网卡的子网掩码。掩码可以是有前缀0x的32位十六进制数，也可以是用点分开的4个十进制数。如果不打算将网络分成子网，可以不管这一选项；如果要使用子网，那么请记住，网络中每一个系统必须有相同子网掩码。

tunel 建立隧道

dstaddr 设定一个远端地址，建立点对点通信

-broadcast<地址> 为指定网卡设置广播协议

-pointtopoint<地址> 为网卡设置点对点通讯协议

multicast 为网卡设置组播标志

address 为网卡设置IPv4地址

txqueuelen<长度> 为网卡设置传输列队的长度

## 4．使用实例：

### 实例1：显示网络设备信息（激活状态的）

命令：

ifconfig

输出：



```
[root@localhost ~]# ifconfig
eth0      Link encap:Ethernet  HWaddr 00:50:56:BF:26:20  
          inet addr:192.168.120.204  Bcast:192.168.120.255  Mask:255.255.255.0
          UP BROADCAST RUNNING MULTICAST  MTU:1500  Metric:1
          RX packets:8700857 errors:0 dropped:0 overruns:0 frame:0
          TX packets:31533 errors:0 dropped:0 overruns:0 carrier:0
          collisions:0 txqueuelen:1000 
          RX bytes:596390239 (568.7 MiB)  TX bytes:2886956 (2.7 MiB)

lo        Link encap:Local Loopback  
          inet addr:127.0.0.1  Mask:255.0.0.0
          UP LOOPBACK RUNNING  MTU:16436  Metric:1
          RX packets:68 errors:0 dropped:0 overruns:0 frame:0
          TX packets:68 errors:0 dropped:0 overruns:0 carrier:0
          collisions:0 txqueuelen:0 
          RX bytes:2856 (2.7 KiB)  TX bytes:2856 (2.7 KiB)
```



 

说明：

eth0 表示第一块网卡， 其中 HWaddr 表示网卡的物理地址，可以看到目前这个网卡的物理地址(MAC地址）是 00:50:56:BF:26:20

inet addr 用来表示网卡的IP地址，此网卡的 IP地址是 192.168.120.204，广播地址， Bcast:192.168.120.255，掩码地址Mask:255.255.255.0 

lo 是表示主机的回坏地址，这个一般是用来测试一个网络程序，但又不想让局域网或外网的用户能够查看，只能在此台主机上运行和查看所用的网络接口。比如把 HTTPD服务器的指定到回坏地址，在浏览器输入 127.0.0.1 就能看到你所架WEB网站了。但只是您能看得到，局域网的其它主机或用户无从知道。

第一行：连接类型：Ethernet（以太网）HWaddr（硬件mac地址）

第二行：网卡的IP地址、子网、掩码

第三行：UP（代表网卡开启状态）RUNNING（代表网卡的网线被接上）MULTICAST（支持组播）MTU:1500（最大传输单元）：1500字节

第四、五行：接收、发送数据包情况统计

第七行：接收、发送数据字节数统计信息。

### 实例2：启动关闭指定网卡

命令：

ifconfig eth0 up

ifconfig eth0 down

输出：

说明：

ifconfig eth0 up 为启动网卡eth0 ；ifconfig eth0 down 为关闭网卡eth0。ssh登陆linux服务器操作要小心，关闭了就不能开启了，除非你有多网卡。

### 实例3：为网卡配置和删除IPv6地址

命令：

ifconfig eth0 add 33ffe:3240:800:1005::2/64

ifconfig eth0 del 33ffe:3240:800:1005::2/64

输出：

说明：

ifconfig eth0 add 33ffe:3240:800:1005::2/64 为网卡eth0配置IPv6地址；

ifconfig eth0 add 33ffe:3240:800:1005::2/64 为网卡eth0删除IPv6地址；

练习的时候，ssh登陆linux服务器操作要小心，关闭了就不能开启了，除非你有多网卡。

### 实例4：用ifconfig修改MAC地址

命令：

ifconfig eth0 hw ether 00:AA:BB:CC:DD:EE

输出：

```
[root@localhost ~]# ifconfig eth0 down //关闭网卡
[root@localhost ~]# ifconfig eth0 hw ether 00:AA:BB:CC:DD:EE //修改MAC地址
[root@localhost ~]# ifconfig eth0 up //启动网卡
[root@localhost ~]# ifconfig
eth0      Link encap:Ethernet  HWaddr 00:AA:BB:CC:DD:EE  
          inet addr:192.168.120.204  Bcast:192.168.120.255  Mask:255.255.255.0
          UP BROADCAST RUNNING MULTICAST  MTU:1500  Metric:1
          RX packets:8700857 errors:0 dropped:0 overruns:0 frame:0
          TX packets:31533 errors:0 dropped:0 overruns:0 carrier:0
          collisions:0 txqueuelen:1000 
          RX bytes:596390239 (568.7 MiB)  TX bytes:2886956 (2.7 MiB)

lo        Link encap:Local Loopback  
          inet addr:127.0.0.1  Mask:255.0.0.0
          UP LOOPBACK RUNNING  MTU:16436  Metric:1
          RX packets:68 errors:0 dropped:0 overruns:0 frame:0
          TX packets:68 errors:0 dropped:0 overruns:0 carrier:0
          collisions:0 txqueuelen:0 
          RX bytes:2856 (2.7 KiB)  TX bytes:2856 (2.7 KiB)
[root@localhost ~]# ifconfig eth0 hw ether 00:50:56:BF:26:20 //关闭网卡并修改MAC地址 
[root@localhost ~]# ifconfig eth0 up //启动网卡
[root@localhost ~]# ifconfig
eth0      Link encap:Ethernet  HWaddr 00:50:56:BF:26:20  
          inet addr:192.168.120.204  Bcast:192.168.120.255  Mask:255.255.255.0
          UP BROADCAST RUNNING MULTICAST  MTU:1500  Metric:1
          RX packets:8700857 errors:0 dropped:0 overruns:0 frame:0
          TX packets:31533 errors:0 dropped:0 overruns:0 carrier:0
          collisions:0 txqueuelen:1000 
          RX bytes:596390239 (568.7 MiB)  TX bytes:2886956 (2.7 MiB)

lo        Link encap:Local Loopback  
          inet addr:127.0.0.1  Mask:255.0.0.0
          UP LOOPBACK RUNNING  MTU:16436  Metric:1
          RX packets:68 errors:0 dropped:0 overruns:0 frame:0
          TX packets:68 errors:0 dropped:0 overruns:0 carrier:0
          collisions:0 txqueuelen:0 
          RX bytes:2856 (2.7 KiB)  TX bytes:2856 (2.7 KiB) 
```

 



说明：

 

### 实例5：配置IP地址

命令：

输出：

```
[root@localhost ~]# ifconfig eth0 192.168.120.56 
[root@localhost ~]# ifconfig eth0 192.168.120.56 netmask 255.255.255.0 
[root@localhost ~]# ifconfig eth0 192.168.120.56 netmask 255.255.255.0 broadcast 192.168.120.255
```

 

说明：

ifconfig eth0 192.168.120.56 

给eth0网卡配置IP地：192.168.120.56

 ifconfig eth0 192.168.120.56 netmask 255.255.255.0 

给eth0网卡配置IP地址：192.168.120.56 ，并加上子掩码：255.255.255.0

ifconfig eth0 192.168.120.56 netmask 255.255.255.0 broadcast 192.168.120.255

/给eth0网卡配置IP地址：192.168.120.56，加上子掩码：255.255.255.0，加上个广播地址： 192.168.120.255

 

### 实例6：启用和关闭ARP协议

命令：

ifconfig eth0 arp

ifconfig eth0 -arp

输出：

```
[root@localhost ~]# ifconfig eth0 arp 
[root@localhost ~]# ifconfig eth0 -arp
```

 

说明：

ifconfig eth0 arp 开启网卡eth0 的arp协议；

ifconfig eth0 -arp 关闭网卡eth0 的arp协议；

 

### 实例7：设置最大传输单元

命令：

ifconfig eth0 mtu 1500

输出：

```
[root@localhost ~]# ifconfig eth0 mtu 1480
[root@localhost ~]# ifconfig
eth0      Link encap:Ethernet  HWaddr 00:50:56:BF:26:1F  
          inet addr:192.168.120.203  Bcast:192.168.120.255  Mask:255.255.255.0
          UP BROADCAST RUNNING MULTICAST  MTU:1480  Metric:1
          RX packets:8712395 errors:0 dropped:0 overruns:0 frame:0
          TX packets:36631 errors:0 dropped:0 overruns:0 carrier:0
          collisions:0 txqueuelen:1000 
          RX bytes:597062089 (569.4 MiB)  TX bytes:2643973 (2.5 MiB)

lo        Link encap:Local Loopback  
          inet addr:127.0.0.1  Mask:255.0.0.0
          UP LOOPBACK RUNNING  MTU:16436  Metric:1
          RX packets:9973 errors:0 dropped:0 overruns:0 frame:0
          TX packets:9973 errors:0 dropped:0 overruns:0 carrier:0
          collisions:0 txqueuelen:0 
          RX bytes:518096 (505.9 KiB)  TX bytes:518096 (505.9 KiB)

[root@localhost ~]# ifconfig eth0 mtu 1500
[root@localhost ~]# ifconfig
eth0      Link encap:Ethernet  HWaddr 00:50:56:BF:26:1F  
          inet addr:192.168.120.203  Bcast:192.168.120.255  Mask:255.255.255.0
          UP BROADCAST RUNNING MULTICAST  MTU:1500  Metric:1
          RX packets:8712548 errors:0 dropped:0 overruns:0 frame:0
          TX packets:36685 errors:0 dropped:0 overruns:0 carrier:0
          collisions:0 txqueuelen:1000 
          RX bytes:597072333 (569.4 MiB)  TX bytes:2650581 (2.5 MiB)

lo        Link encap:Local Loopback  
          inet addr:127.0.0.1  Mask:255.0.0.0
          UP LOOPBACK RUNNING  MTU:16436  Metric:1
          RX packets:9973 errors:0 dropped:0 overruns:0 frame:0
          TX packets:9973 errors:0 dropped:0 overruns:0 carrier:0
          collisions:0 txqueuelen:0 
          RX bytes:518096 (505.9 KiB)  TX bytes:518096 (505.9 KiB)

[root@localhost ~]# 
```



 

说明：

设置能通过的最大数据包大小为 1500 bytes



### 实例8：一个网卡配置多个ip

```
[root@localhost vmware01]# ifconfig eth0:1 192.168.184.160
[root@localhost vmware01]# ifconfig
eth0      Link encap:Ethernet  HWaddr 00:0C:29:35:22:48  
          inet addr:192.168.184.159  Bcast:192.168.184.255  Mask:255.255.255.0
          inet6 addr: fe80::20c:29ff:fe35:2248/64 Scope:Link
          UP BROADCAST RUNNING MULTICAST  MTU:1500  Metric:1
          RX packets:517 errors:0 dropped:0 overruns:0 frame:0
          TX packets:236 errors:0 dropped:0 overruns:0 carrier:0
          collisions:0 txqueuelen:1000 
          RX bytes:61613 (60.1 KiB)  TX bytes:40282 (39.3 KiB)

eth0:1    Link encap:Ethernet  HWaddr 00:0C:29:35:22:48  
          inet addr:192.168.184.160  Bcast:192.168.184.255  Mask:255.255.255.0
          UP BROADCAST RUNNING MULTICAST  MTU:1500  Metric:1

lo        Link encap:Local Loopback  
          inet addr:127.0.0.1  Mask:255.0.0.0
          inet6 addr: ::1/128 Scope:Host
          UP LOOPBACK RUNNING  MTU:65536  Metric:1
          RX packets:0 errors:0 dropped:0 overruns:0 frame:0
          TX packets:0 errors:0 dropped:0 overruns:0 carrier:0
          collisions:0 txqueuelen:0 
          RX bytes:0 (0.0 b)  TX bytes:0 (0.0 b)

[root@localhost vmware01]# 
```

 

## 备注：

用ifconfig命令配置的网卡信息，在网卡重启后机器重启后，配置就不存在。要想将上述的配置信息永远的存的电脑里，那就要修改网卡的配置文件了。





http://www.cnblogs.com/peida/archive/2013/02/27/2934525.html