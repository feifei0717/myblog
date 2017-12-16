U盘安装linux注意点

分类: linux
日期: 2014-07-03

原文地址: 

http://blog.chinaunix.net/uid-29632145-id-4338524.html

------

****[U盘安装linux注意点]() *2014-07-03 22:23:47*

分类： LINUX

### 安装盘制作工具推荐2两款

[Universal-USB-Installer](http://www.pendrivelinux.com/universal-usb-installer-easy-as-1-2-3/) 和 [Linux Live USB Creator](http://www.linuxliveusb.com/en/download)

### Redhat Enterprise Linux Server:

[RHEL 6.2 32bit](http://rhel.ieesee.net/uingei/rhel-server-6.2-i386-dvd.iso) [RHEL 6.2 64bit](http://rhel.ieesee.net/uingei/rhel-server-6.2-x86_64-dvd.iso)

安装方法请参看：http://wiki.debian.org.hk/w/Install_CentOS#.E9.81.B8.E6.93.87.E8.BB.9F.E4.BB.B6

### 使用[Universal-USB-Installer](http://www.pendrivelinux.com/universal-usb-installer-easy-as-1-2-3/)注意点

1. U盘要格式化成FAT32的；
2. 在step1选择linux发行版本的时候，可能不存在对应的选项，这时可以选择Try Unlisted Linux ISO;
3. 启动盘制作完成后，将ISO文件拷贝至U盘**根目录，否则安装过程会出现“**缺少ISO 9660图像 安装程序试图挂载映像#1**”；**
4. 启动盘制作完成后，还需要将isolinux（有的为syslinux）目录下的vmlinuz、initrd.img拷贝至U盘**根目录。**

****

### 使用Linux Live USB Creator注意点

请参看http://w3cbk.com/system/linux-sys/redhat-enterprise-linux-server-6-2.html 

 