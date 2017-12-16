# 如何在Linux命令行模式安装VMware Tools

选择菜单栏“虚拟机”——“安装VMware tools” ，等待系统自动更换ISO光盘
mount /dev/cdrom /mnt
cd /mnt
tar zxvf VMwareTools-9.6.0-1294478.tar.gz -C /root/（安装到的目录）
cd /root/
cd vmware-tools-distrib/
./vmware-install.pl
一路回车，完成后重启系统。

## 错误解决：

### 错误1：bash: ./vmware-install.pl: /usr/bin/perl: bad interpreter: 没有那个文件或目录

----------------安装VMwere Tools------------------------

bash: ./vmware-install.pl: /usr/bin/perl: bad interpreter: 没有那个文件或目录

解决方法

yum install perl gcc kernel-devel

yum upgrade kernel kernel-devel

如果出现

‍Searching for a valid kernel header path…

The path “” is not valid.

这是因为 kernel-devel版本和相应的kernel版本不一致，可以用uname-r看一下内核版本，再用rpm -q kernel-devel看一下kernel-devel的版本，有可能会出现kernel-devel未找到的错误，这里需要自己安装一下，可以执行 sudo yum install kernel-devel，这个时候会安装最新的kernel-devel版本，重启一下，如果再出现问题，那么可以执行sudo yum upgrade kernel kernel-devel，把内核和kernel-devel更新到同一个版本，这样应该就不会有问题了。而GCC和PERL的问题提示比较简单。

建议在安装之前还是执行一下安装GCC和PERL，执行发下命令：yum install perl gcc kernel-devel。

来源： <http://blog.csdn.net/fanaticism1/article/details/8096494>

来源： <http://zhidao.baidu.com/question/264582902795496205.html>