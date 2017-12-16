# LINUX关闭防火墙

分类: linux
日期: 2014-11-09

 

查看防火墙状态

```
[root@CentOS-pc ~]# service iptables status
iptables: Firewall is not running.
```

所有修改防火墙后都要重启防火墙服务

```
[root@CentOS-pc ~]#  service iptables restart
iptables: Flushing firewall rules:                         [  OK  ]
iptables: Setting chains to policy ACCEPT: filter          [  OK  ]
iptables: Unloading modules:                               [  OK  ]
iptables: Applying firewall rules:                         [  OK  ]
```

## （1） 重启后永久性生效：

开启：chkconfig iptables on

关闭：chkconfig iptables off

## （2） 即时生效，重启后失效：

开启：service iptables start

关闭：service iptables stop

需要说明的是对于Linux下的其它服务都可以用以上命令执行开启和关闭操作。

在开启了防火墙时，做如下设置，开启相关端口，

修改/etc/sysconfig/iptables 文件，添加以下内容：

-A RH-Firewall-1-INPUT -m state ——state NEW -m tcp -p tcp ——dport 80 -j ACCEPT

-A RH-Firewall-1-INPUT -m state ——state NEW -m tcp -p tcp ——dport 22 -j ACCEPT

或者：

/etc/init.d/iptables status 会得到一系列信息，说明防火墙开着。

/etc/rc.d/init.d/iptables stop 关闭防火墙

最后：

在根用户下输入setup，进入一个图形界面，选择Firewall configuration，进入下一界面，选择Security Level为Disabled，保存。重启即可。

======================================================

fedora下

/etc/init.d/iptables stop

=======================================================

ubuntu下：

由于UBUNTU没有相关的直接命令

请用如下命令

iptables -P INPUT ACCEPT

iptables -P OUTPUT ACCEPT

暂时开放所有端口

Ubuntu上没有关闭iptables的命令

=======================================================

iptables 是linux下一款强大的防火墙，在不考虑效率的情况下，功能强大到足可以替代大多数硬件防火墙，但是强大的防火墙如果应用不当，可能挡住的可不光是那些潜在的攻击，还有可能是你自己哦。这个带来的危害对于普通的个人PC来说可能无关紧要，但是想象一下，如果这是一台服务器，一旦发生这样的情况，不光是影院正常的服务，还需要到现场去恢复，这会给你带来多少损失呢？

所以我想说的是，当你敲入每一个iptables 相关命令的时候都要万分小心。

1.应用每一个规则到DROP target时，都要仔细检查规则，应用之前要考虑他给你带来的影响。

2.在redhat中我们可以使用service iptables stop来关闭防火墙，但是在有些版本如ubuntu中这个命令却不起作用，大家可能在网上搜索到不少文章告诉你用iptables -F这个命令来关闭防火墙，但是使用这个命令前，千万记得用iptables -L查看一下你的系统中所有链的默认target，iptables -F这个命令只是清除所有规则，只不会真正关闭iptables.想象一下，如果你的链默认target是DROP，本来你有规则来允许一些特定的端口，但一旦应用iptables -L ，清除了所有规则以后，默认的target就会阻止任何访问，当然包括远程ssh管理服务器的你。

所以我建议的关闭防火墙命令是

iptables -P INPUT ACCEPT

iptables -P FORWARD ACCEPT

iptables -P OUTPUT ACCEPT

iptables -F

总之，当你要在你的服务器上做任何变更时，最好有一个测试环境做过充分的测试再应用到你的服务器。除此之外，要用好iptables，那就要理解iptables的运行原理，知道对于每一个数据包iptables是怎么样来处理的。这样才能准确地书写规则，避免带来不必要的麻烦。





 