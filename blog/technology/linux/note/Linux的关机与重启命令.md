# [Linux的关机与重启命令](https://www.ezloo.com/2009/05/linux_poweroff_and_reboot.html)

[May 10, 2009 6:18 PM](https://www.ezloo.com/2009/05/linux_poweroff_and_reboot.html) Aillo [系统](https://www.ezloo.com/archives/system.html) [1 Comment](https://www.ezloo.com/2009/05/linux_poweroff_and_reboot.html#comments)

重启命令：
1、reboot
2、shutdown -r now 立刻重启(root用户使用)
3、shutdown -r 10 过10分钟自动重启(root用户使用) 
4、shutdown -r 20:35 在时间为20:35时候重启(root用户使用)
如果是通过shutdown命令设置重启的话，可以用shutdown -c命令取消重启

关机命令：
1、halt   立刻关机
2、poweroff  立刻关机
3、shutdown -h now 立刻关机(root用户使用)
4、shutdown -h 10 10分钟后自动关机
如果是通过shutdown命令设置关机的话，可以用shutdown -c命令取消重启

来源： <https://www.ezloo.com/2009/05/linux_poweroff_and_reboot.html>