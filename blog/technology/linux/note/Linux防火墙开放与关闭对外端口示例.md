- Linux防火墙开放与关闭对外端口示例

  发布时间：2014-10-18 16:09:38   编辑：AHLinux.com

本文介绍了在linux防火墙开放与关闭端口的方法，修改CentOS防火墙，必须根据自己服务器的情况来修改这个文件，感兴趣的朋友参考下。

**linux防火墙端口开放方法，linux下重启查看防火墙开放端口的例子。**

1、修改/etc/sysconfig/iptables配置，开发对外接口。
修改CentOS防火墙，注意：一定要给自己留好后路,留VNC一个管理端口和SSh的管理端口。

一个iptables的例子：

```
代码示例:
# Firewall configuration written by system-config-securitylevel
# Manual customization of this file is not recommended.
*filter
:INPUT ACCEPT [0:0]
:FORWARD ACCEPT [0:0]
:OUTPUT ACCEPT [0:0]
:RH-Firewall-1-INPUT - [0:0]
-A INPUT -j RH-Firewall-1-INPUT
-A FORWARD -j RH-Firewall-1-INPUT
-A RH-Firewall-1-INPUT -i lo -j ACCEPT
-A RH-Firewall-1-INPUT -p icmp –icmp-type any -j ACCEPT
-A RH-Firewall-1-INPUT -p 50 -j ACCEPT
-A RH-Firewall-1-INPUT -p 51 -j ACCEPT
-A RH-Firewall-1-INPUT -m state –state ESTABLISHED,RELATED -j ACCEPT
-A RH-Firewall-1-INPUT -m state –state NEW -m tcp -p tcp –dport 53 -j ACCEPT
-A RH-Firewall-1-INPUT -m state –state NEW -m udp -p udp –dport 53 -j ACCEPT
-A RH-Firewall-1-INPUT -m state –state NEW -m tcp -p tcp –dport 22 -j ACCEPT
-A RH-Firewall-1-INPUT -m state –state NEW -m tcp -p tcp –dport 25 -j ACCEPT
-A RH-Firewall-1-INPUT -m state –state NEW -m tcp -p tcp –dport 80 -j ACCEPT
-A RH-Firewall-1-INPUT -m state –state NEW -m tcp -p tcp –dport 443 -j ACCEPT
-A RH-Firewall-1-INPUT -j REJECT –reject-with icmp-host-prohibited
COMMIT
```





修改centos防火墙，必须根据自己服务器的情况来修改这个文件。

例如，如果不希望开放80端口提供[web](http://www.ahlinux.com/server/web/)服务，那么应该相应的删除这一行：

代码示例:

-A RH-Firewall-1-INPUT -m state –state NEW -m tcp -p tcp –dport 80 -j ACCEPT

全部修改完之后，重启iptables:

代码示例:

service iptables restart

验证是否规则都已生效：[iptables](http://www.ahlinux.com/mainte/9353.html) -L

- 本文来自：[爱好Linux技术网](http://www.ahlinux.com/)

- 本文链接：

  http://www.ahlinux.com/start/base/3722.html

  ​

  来源： <<http://www.ahlinux.com/start/base/3722.html>>