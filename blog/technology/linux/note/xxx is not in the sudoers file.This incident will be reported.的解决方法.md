# [xxx is not in the sudoers file.This incident will be reported.的解决方法](http://www.cnblogs.com/xiaochaoyxc/p/6206481.html)

1.切换到root用户下,怎么切换就不用说了吧,不会的自己百度去.

2.添加sudo文件的写权限,命令是:

chmod u+w /etc/sudoers

3.编辑sudoers文件

vi /etc/sudoers

找到这行 root ALL=(ALL) ALL,在他下面添加xxx ALL=(ALL) ALL (这里的xxx是你的用户名)


ps:这里说下你可以sudoers添加下面四行中任意一条

```
youuser            ALL=(ALL)                ALL
%youuser           ALL=(ALL)                ALL
youuser            ALL=(ALL)                NOPASSWD: ALL
%youuser           ALL=(ALL)                NOPASSWD: ALL
```

第一行:允许用户youuser执行sudo命令(需要输入密码).<br>
第二行:允许用户组youuser里面的用户执行sudo命令(需要输入密码).<br>
第三行:允许用户youuser执行sudo命令,并且在执行的时候不输入密码.<br>
第四行:允许用户组youuser里面的用户执行sudo命令,并且在执行的时候不输入密码.<br>
4.撤销sudoers文件写权限,命令:<br>
chmod u-w /etc/sudoers<br>
这样普通用户就可以使用sudo了<br>