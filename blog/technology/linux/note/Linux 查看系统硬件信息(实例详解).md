Linux 查看系统硬件信息(实例详解)

分类: linux
日期: 2015-06-03

原文地址: 

http://blog.chinaunix.net/uid-29632145-id-5066343.html

------

****[Linux 查看系统硬件信息(实例详解) ]()*2015-06-03 15:14:20*

分类： LINUX

转载自<http://www.cnblogs.com/ggjucheng/archive/2013/01/14/2859613.html> 
Linux 查看系统硬件信息(实例详解) 
linux查看系统的硬件信息，并不像windows那么直观，这里我罗列了查看系统信息的实用命令，并做了分类，实例解说。

**lscpu命令，查看的是cpu的统计信息.**

blue@blue-pc:~$ lscpu 
Architecture: i686 #cpu架构 
CPU op-mode(s): -bit, -bit 
Byte Order: Little Endian #小尾序 
CPU(s): #总共有4核 
On-line CPU(s) list: - 
Thread(s) per core: #每个cpu核，只能支持一个线程，即不支持超线程 
Core(s) per socket: #每个cpu，有4个核 
Socket(s): #总共有1一个cpu 
Vendor ID: GenuineIntel #cpu产商 intel 
CPU family: 
Model: 
Stepping: 
CPU MHz: 1600.000 
BogoMIPS: 5986.12 
Virtualization: VT-x #支持cpu虚拟化技术 
L1d cache: 32K 
L1i cache: 32K 
L2 cache: 256K 
L3 cache: 6144K 
查看/proc/cpuinfo,可以知道每个cpu信息，如每个CPU的型号，主频等。

# cat /proc/cpuinfo

processor : 
vendor_id : GenuineIntel 
cpu family : 
model : 
model name : Intel(R) Core(TM) i5- CPU @ .00GHz 
….. 
上面输出的是第一个cpu部分信息，还有3个cpu信息省略了。

概要查看内存情况

-m 
total used shared buffers cached 
Mem: 
-/+ buffers/cache: 
Swap: 
这里的单位是MB，总共的内存是3926MB。

查看内存详细使用

# cat /proc/meminfo

MemTotal: 4020868 kB 
MemFree: 230884 kB 
Buffers: kB 
Cached: 454772 kB 
SwapCached: kB 
….. 
查看内存硬件信息

dmidecode -t memory

# dmidecode

SMBIOS present.

Handle 0x0008, DMI type , bytes 
Physical Memory Array 
Location: System Board Or Motherboard 
…. 
Maximum Capacity: GB 
….

Handle 0x000A, DMI type , bytes 
…. 
Memory Device 
Array Handle: 0x0008 
Error Information Handle: Not Provided 
Total Width: bits 
Data Width: bits 
Size: MB 
….. 
我的主板有4个槽位，只用了一个槽位，上面插了一条4096MB的内存。

查看硬盘和分区分布

# lsblk

NAME MAJ:MIN RM SIZE RO TYPE MOUNTPOINT 
sda : .8G disk 
├─sda1 : 1G part /boot 
├─sda2 : .3G part [SWAP] 
├─sda3 : .5G part / 
├─sda4 : 1K part 
├─sda5 : .8G part /home 
└─sda6 : .2G part 
显示很直观

如果要看硬盘和分区的详细信息

# fdisk -l

Disk /dev/sda: 500.1 GB, 500107862016 bytes 
heads, sectors/track, 60801 cylinders, total 976773168 sectors 
Units = sectors of * = bytes 
Sector size (logical/physical): bytes / bytes 
I/O size (minimum/optimal): bytes / bytes 
Disk identifier: 0x00023728

Device Boot Start End Blocks Id System 
/dev/sda1 * 2148351 1073152 Linux 
/dev/sda2 2148352 21680127 9765888 Linux swap / Solaris 
/dev/sda3 21680128 177930239 78125056 Linux 
/dev/sda4 177932286 976771071 399419393 Extended/dev/sda5 177932288 412305407 117186560 Linux 
/dev/sda6 412307456 976771071 282231808 Linux 
查看网卡硬件信息

Ethernet controller: Realtek Semiconductor Co., Ltd. RTL8111/8168B PCI Express Gigabit Ethernet controller (rev ) 
查看系统的所有网络接口

# ifconfig -a

eth0 Link encap:以太网 硬件地址 b8::5a::b3:8f 
…..

# ethtool eth0

Settings eth0: 
Supported ports: [ TP MII ] 
Supported link modes: 10baseT/Half 10baseT/Full 
100baseT/Half 100baseT/Full 
1000baseT/Half 1000baseT/Full #支持千兆半双工，全双工模式 
Supported pause frame use: No 
Supports auto-negotiation: Yes #支持自适应模式，一般都支持 
Advertised link modes: 10baseT/Half 10baseT/Full 
100baseT/Half 100baseT/Full 
1000baseT/Half 1000baseT/Full 
Advertised pause frame use: Symmetric Receive-only 
Advertised auto-negotiation: Yes #默认使用自适应模式 
Link partner advertised link modes: 10baseT/Half 10baseT/Full 
100baseT/Half 100baseT/ ….. 
Speed: 100Mb/s #现在网卡的速度是100Mb,网卡使用自适应模式，所以推测路由是100Mb，导致网卡从支持千兆，变成要支持百兆 
Duplex: Full #全双工 
….. 
Link detected: yes #表示有网线连接，和路由是通的 
查看pci信息，即主板所有硬件槽信息。

如果要看设备树:lspci -t

查看bios信息

# dmidecode -t bios

…… 
BIOS Information 
Vendor: American Megatrends Inc. 
Version: . 
Release Date: // 
……. 
BIOS Revision: 
…… 
dmidecode以一种可读的方式dump出机器的DMI(Desktop Management Interface)信息。这些信息包括了硬件以及BIOS，既可以得到当前的配置，也可以得到系统支持的最大配置，比如说支持的最大内存数等

如果要查看所有有用信息

dmidecode -q 
里面包含了很多硬件信息。 
MeasureMeasure 
Get a free Evernote account to save this article and view it later on any device. 
Create account