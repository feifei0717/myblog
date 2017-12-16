# [最详细的Linux YUM命令使用教程](http://www.cnblogs.com/sopost/p/3245477.html) 

YUM(Yellow dog Updater, Modified)为多个Linux发行版的前端软件包管理器，例如 Redhat RHEL, CentOS & Fedora.  YUM通过调用RPM的软件包信息让用户更方便地进行软件安装，升级，卸载等软件包管理操作。

这篇教程适用所有使用YUM管理软件包的Linux发行版，包括CentOS, RHEL or Fedora.

### 怎么使用YUM命令升级所有RPM软件包？

`yum update`

### 怎么使用YUM命令升级单个RPM软件包

`yum update 软件名称`

### 使用YUM安装RPM软件包

`yum install 软件名称`

### 使用YUM升级全部软件时怎么排除个别软件

假如你想升级所有软件包，但不想升级内核，就可以用下面的命令： `yum --exclude=package kernel* update`

### 怎么使用YUM来确定某个软件需要升级

下面的命令会检测 Fedora/CentOS/RHEL上的所有软件是否需要升级

`check-update`

### 使用YUM卸载软件

`yum remove 软件名称` 或者 `yum erase 软件名称`

### 使用YUM查看软件包相关信息

yum list可以让你获取软件包相关信息，后面不指定软件包名的话，它会列出所有软件包的信息。 `yum list 软件名称`

### 使用yum了解软件的主要功能

比如你想知道httpd这个软件是干吗的，可以输入下面的的命令： `yum provides httpd`

[root@ zhetenger ~]# yum provides nginx
Loaded plugins: priorities
nginx-.0.5-3.el6.i686 : A high performance web server and reverse proxy server
Repo        : epel

### 使用YUM查找软件包

如果你不知道某个软件包的全称，这个命令就非常有用了，它会根据你提供的关键词在RPM的软件包数据库里搜索相适配的软件包。比方说我想找 samba这个软件的全称，我只需要输入下面的命令即可： `yum search samba`

然后会显示下面的信息：

Loaded plugins: priorities
============================== N/S Matched: samba ==============================
ncid-samba.noarch : NCID samba module sends caller ID information to windows
​                  : machines
php-pear-Auth-samba.noarch : Samba support for php-pear-Auth
samba-client.i686 : Samba client programs
samba-common.i686 : Files used by both Samba servers and clients
samba-doc.i686 : Documentation for the Samba suite
samba-swat.i686 : The Samba SMB server Web configuration program
samba-winbind.i686 : Samba winbind
samba-winbind-clients.i686 : Samba winbind clients
samba-winbind-krb5-locator.i686 : Samba winbind krb5 locator
samba4.i686 : The Samba4 CIFS and AD client and server suite
samba4-devel.i686 : Developer tools for Samba libraries
samba4-libs.i686 : Samba libraries
sblim-cmpi-samba.i686 : SBLIM WBEM-SMT Samba
sblim-cmpi-samba-devel.i686 : SBLIM WBEM-SMT Samba - Header Development Files
sblim-cmpi-samba-test.i686 : SBLIM WBEM-SMT Samba - Testcase Files
ctdb.i686 : A Clustered Database based on Samba's Trivial Database (TDB)
php-pear-File-SMBPasswd.noarch : Class for managing SAMBA style password files
samba.i686 : Server and Client software to interoperate with Windows machines
samba-domainjoin-gui.i686 : Domainjoin GUI

使用YUM查看软件包的基本信息

\>[[root@zhetenger](mailto:root@zhetenger) ~]#  yum info samba
Loaded plugins: priorities
Installed Packages
Name        : samba
Arch        : i686
Version     : 3.5.0
Release     : 25.el6
Size        : 7 M
Repo        : installed
From repo   : base
Summary     : Server and Client software to interoperate with Windows machines
URL         : [http://www.samba.org/](http://www.samba.org/)
License     : GPLv3+ and LGPLv3+
Description :
​            : Samba is the suite of programs by which a lot of PC-related
​            : machines share files, printers, and other information (such as
​            : lists of available files and printers). The Windows NT, OS/2, and
​            : Linux operating systems support this natively, and add-on packages
​            : can enable the same thing for DOS, Windows, VMS, UNIX of all
​            : kinds, MVS, and more. This package provides an SMB/CIFS server
​            : that can be used to provide network services to SMB/CIFS clients.
​            : Samba uses NetBIOS over TCP/IP (NetBT) protocols and does NOT
​            : need the NetBEUI (Microsoft Raw NetBIOS frame) protocol.

### 怎么清除YUM缓存和下载包文件

每安装一个软件包，YUM都是先下载一个RPM软件包然后再安装，安装完后并不会自动删除。时间长了，这些文件占很多空间的。所以，需要定时清理： `yum clean all`

### 怎么使用YUM安装本地RPM包

如果你想要自己创建一个RPM软件包，你你可以用YUM来确定存在哪些依赖关系： `yum localinstall 软件名称.rpm`

### 使用YUM升级本地RPM软件包

如果你想升级一个本地RPM软件包，可以用下面的命令： `yum localupdate update-package.rpm`

### 确定RPM包依赖哪些组件

如果你想自己源码安装软件，了解安装的软件包依赖哪些软件非常有必要的。deplist可以让你知道软件包依赖哪些组件，这些组件的全称是什么。 `yum deplist 软件名称`

### 查看YUM的版本信息

`yum -v`

### 使用YUM安装软件包到chroot环境（chroot)

你可以使用下面的命令把软件安装到chroot： `yum --installroot=/path/to/chroot/`

### 使用YUM启用已存在的软件源

如果你安装了第三方的软件源，你需要先启用该软件源才能从其安装软件，输入下面的命令启用EPEL软件源： `yum --enablerepo=epel install rsnapshot`

### 使用YUM禁用软件源

如果你安装了第三方软件源但不想从其安装软件，可以用下面的命令禁用： `yum --disablerepo=epel install 软件名称`

## YUM软件集合

YUM软件集合是指多个共同协作的软件统称，比如“Development Tools”（开发工具）。 下面介绍下怎么用yum groupinstall命令来查看/安装/卸载yum软件集合

### 安装yum软件集合

`yum groupinstall 'Development Tools'`

### 卸载yum软件集合

`yum groupremove 'Development Tools'`

### 升级yum软件集合

`yum groupupdate 'Development Tools'`

### 查看yum软件集合信息

`yum groupinfo 'Development Tools'`

### 查看有哪些软件集合

`yum grouplist | more`

### 使用YUM输出已安装软件包列表

该命令适用所有使用YUM为软件管理器的linux版本，如CentOS, Fedora, RHEL： `yum list installed`

GeoIP.i686                        .4.8-.el6                          @epel
MAKEDEV.i686                      3.24-6.el6                           installed
apr.i686                          .3.9-5.el6_2                        @updates
apr-util.i686                     .3.9-3.el6_0.                      installed
apr-util-ldap.i686                .3.9-3.el6_0.                      installed
aspell.i686                       2:0.60.6-2.el6                     installed
audit-libs.i686                   2.2-2.el6                            @base
authconfig.i686                   6..2-0.el6                        @base
avahi-libs.i686                   0.6.25-.el6                        @base
basesystem.noarch                 0.0-4.el6                           installed
bash.i686                         4..2-9.el6_2                        @base
bind.i686                         32:9.8.2-0.0.rc.el6_3.6            @updates
bind-libs.i686                    32:9.8.2-0.0.rc.el6_3.6            @updates
binutils.i686                     2.20.5.0.2-5.34.el6                 @base
bzip2.i686                        .0.5-7.el6_0                        installed
bzip2-libs.i686                   .0.5-7.el6_0                        installed
ca-certificates.noarch            200.63-3.el6_.5                    @base
centos-indexhtml.noarch           6-.el6.centos                       installed
centos-release.i686               6-3.el6.centos.9                     @base
chkconfig.i686                    .3.49.3-2.el6                       @base
compat-mysql5.i686               5..54-.el6.remi                    @remi

#### 转自[http://www.zhetenger.com/](http://www.zhetenger.com/)

Getting Started

1. Download and Install Oracle Linux

2. Download and copy the appropriate yum configuration file in place, by running the following commands as root:

   ​

   #### Oracle Linux 4, Update 6 or Newer

   ```
   # cd /etc/yum.repos.d # mv Oracle-Base.repo Oracle-Base.repo.disabled # wget http://public-yum.oracle.com/public-yum-el4.repo 
   ```

   #### Oracle Linux 5

   ```
   # cd /etc/yum.repos.d # wget http://public-yum.oracle.com/public-yum-el5.repo 
   ```

   #### Oracle Linux 6

   ```
   # cd /etc/yum.repos.d # wget http://public-yum.oracle.com/public-yum-ol6.repo 
   ```

   #### Oracle VM 2

   ```
   # cd /etc/yum.repos.d # wget http://public-yum.oracle.com/public-yum-ovm2.repo 
   ```

3. Enable the appropriate repository by editing the yum configuration file

   - Open the yum configuration file in a text editor
   - Locate the section in the file for the repository you plan to [update](http://www.ha97.com/tag/update) from, e.g. [el4_u6_base]
   - Change enabled=0 to enabled=1

4. Begin using yum, for example:yum listyum install [firefox](http://www.ha97.com/tag/firefox)

You may be prompted to confirm the import of the Oracle OSS [Group](http://www.ha97.com/tag/group) GPG key.

by http://public-yum.oracle.com/

**Oracle Linux有两种内核：兼容Red Hat Enterprise Linux的内核（使用RHEL源代码编译）和Oracle自己的Unbreakable Enterprise内核。Oracle声明Unbreakable Enterprise内核兼容RHEL，Oracle中间件和经过RHEL认证的第三方应用程序可以不经过修改的在Unbreakable Enterprise内核上运行。**





http://www.cnblogs.com/sopost/archive/2013/08/08/3245477.html