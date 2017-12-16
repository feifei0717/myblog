CentOS查看CPU、内存、网络流量和磁盘 I_O【详细】

分类: linux
日期: 2015-06-15

原文地址: 

http://blog.chinaunix.net/uid-29632145-id-5084018.html

------

****[CentOS查看CPU、内存、网络流量和磁盘 I/O【详细】 ]()*2015-06-15 23:57:50*

分类： LINUX

安装 yum install -y sysstat

**sar -d 1 1**

rrqm/s: 每秒进行 merge 的读操作数目。即 delta(rmerge)/s
wrqm/s: 每秒进行 merge 的写操作数目。即 delta(wmerge)/s
r/s: 每秒完成的读 I/O 设备次数。即 delta(rio)/s
w/s: 每秒完成的写 I/O 设备次数。即 delta(wio)/s
rsec/s: 每秒读扇区数。即 delta(rsect)/s
wsec/s: 每秒写扇区数。即 delta(wsect)/s
rkB/s: 每秒读K字节数。是 rsect/s 的一半，因为每扇区大小为512字节。(需要计算)
wkB/s: 每秒写K字节数。是 wsect/s 的一半。(需要计算)
avgrq-sz: 平均每次设备I/O操作的数据大小 (扇区)。delta(rsect+wsect)/delta(rio+wio)
avgqu-sz: 平均I/O队列长度。即 delta(aveq)/s/1000 (因为aveq的单位为毫秒)。
await: 平均每次设备I/O操作的等待时间 (毫秒)。即 delta(ruse+wuse)/delta(rio+wio)
svctm: 平均每次设备I/O操作的服务时间 (毫秒)。即 delta(use)/delta(rio+wio)
%util: 一秒中有百分之多少的时间用于 I/O 操作，或者说一秒中有多少时间 I/O 队列是非空的。即 delta(use)/s/1000 (因为use的单位为毫秒)

如果 %util 接近 100%，说明产生的I/O请求太多，I/O系统已经满负荷，该磁盘
可能存在瓶颈。
idle小于70% IO压力就较大了,一般读取速度有较多的wait.
同时可以结合vmstat 查看查看b参数(等待资源的进程数)和wa参数(IO等待所占用的CPU时间的百分比,高过30%时IO压力高)

另外还可以参考
svctm 一般要小于 await (因为同时等待的请求的等待时间被重复计算了)，svctm 的大小一般和磁盘性能有关，CPU/内存的负荷也会对其有影响，请求过多也会间接导致 svctm 的增加。await 的大小一般取决于服务时间(svctm) 以及 I/O 队列的长度和 I/O 请求的发出模式。如果 svctm 比较接近 await，说明 I/O 几乎没有等待时间；如果 await 远大于 svctm，说明 I/O 队列太长，应用得到的响应时间变慢，如果响应时间超过了用户可以容许的范围，这时可以考虑更换更快的磁盘，调整内核 elevator 算法，优化应用，或者升级 CPU。
队列长度(avgqu-sz)也可作为衡量系统 I/O 负荷的指标，但由于 avgqu-sz 是按照单位时间的平均值，所以不能反映瞬间的 I/O 洪水。

在命令行方式下，如何查看CPU、内存的使用情况，网络流量和磁盘I/O？

Q: 在命令行方式下，如何查看CPU、内存的使用情况，网络流量和磁盘I/O？

A: 在命令行方式下，

**1. 查看CPU使用情况的命令**

$ vmstat 5

每5秒刷新一次，最右侧有CPU的占用率的数据

$ top

top 然后按Shift+P，按照进程处理器占用率排序

**2. 查看内存使用情况的命令**

$ free

top 然后按Shift+M, 按照进程内存占用率排序

$ top

free命令可以显示Linux系统中空闲的、已用的物理内存及swap内存,及被内核使用的buffer。在Linux系统监控的工具中，free命令是最经常使用的命令之一。

1．命令格式：

free [参数]

2．命令功能：

free 命令显示系统使用和空闲的内存情况，包括物理内存、交互区内存(swap)和内核缓冲区内存。共享内存将被忽略

3．命令参数：

-b 　以Byte为单位显示内存使用情况。

-k 　以KB为单位显示内存使用情况。

-m 　以MB为单位显示内存使用情况。

-g   以GB为单位显示内存使用情况。

-o 　不显示缓冲区调节列。

-s<间隔秒数> 　持续观察内存使用状况。

-t 　显示内存总和列。

-V 　显示版本信息。

4．使用实例：

实例1：显示内存使用情况

命令：

free

free -g

free -m

**3. 查看网络流量**

可以用工具iptraf工具

$ iptraf -g

“”针对某个Interface的网络流量可以通过比较两个时间网络接口的RX和TX数据来获得

$ date; ifconfig eth1

$ date; ifconfig eth1

**4. 查看磁盘i/o**

$ iostat -d -x /dev/sdc3 2

用iostat查看磁盘/dev/sdc3的磁盘i/o情况，每两秒刷新一次

$ vmstat 2

用vmstat查看io部分的信息

procs:
r–>;在运行队列中等待的进程数
b–>;在等待io的进程数
w–>;可以进入运行队列但被替换的进程

memoy
swap–>;现时可用的交换内存（k表示）
free–>;空闲的内存（k表示）

pages
re－－》回收的页面
mf－－》非严重错误的页面
pi－－》进入页面数（k表示）
po－－》出页面数（k表示）
fr－－》空余的页面数（k表示）
de－－》提前读入的页面中的未命中数
sr－－》通过时钟算法扫描的页面

disk 显示每秒的磁盘操作。 s表示scsi盘，0表示盘号

fault 显示每秒的中断数
in－－》设备中断
sy－－》系统中断
cy－－》cpu交换

cpu 表示cpu的使用状态
cs－－》用户进程使用的时间
sy－－》系统进程使用的时间
id－－》cpu空闲的时间

其中:
如果 r经常大于 4 ，且id经常少于40，表示cpu的负荷很重。
如果pi，po 长期不等于0，表示内存不足。
如果disk 经常不等于0， 且在 b中的队列 大于3， 表示 io性能不好。