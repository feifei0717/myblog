# ubuntu允许root用户登录ssh 

每当安装完成一次Ubuntu系统，每次使用root帐号通过ssh都无法登录，只能先通过其他的用户登录系统，然后配置root帐号，然后登录，下边是配置步骤。



## 步骤

1. 使用普通用户登录Ubuntu系统，打开命令行窗口
2. 更改root用户密码，命令:sudo passwd root
3. 首先输入当前用户的密码
4. 然后输入root账户的密码
5. 确认root用户的密码
6. 编辑ssh的配置文件,命令：nano /etc/ssh/sshd_config
7. 在Authentication部分，注释掉“PermitRootLogin without-password”
8. 在Authentication部分，添加“PermitRootLogin yes”
9. 使用“Ctrl+o”保存数据，使用“Ctrl+X”退出编辑器
10. 重新启动ssh服务，命令：sudo service ssh restart 
11. 然后就可以使用root帐号登录ssh







http://jingyan.baidu.com/article/8ebacdf02f552b49f65cd5c9.html?allowHTTP=1