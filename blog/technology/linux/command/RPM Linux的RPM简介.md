RPM 全名是『 RedHat Package Manager 』简称则为 RPM。RPM 是以一种数据库记录的方式来将你所需要的套件安装到你的 Linux 主机的一套管理程序。他最大的特点就是将您要安装的套件先编译过( 如果需要的话 )并且打包好了，透过包装好的套件里头预设的数据库记录， 记录这个套件要安装的时候必须要的相依属性模块( 就是你的 Linux 主机需要先存在的几个必须的套件 )，当安装在你的 Linux 主机时， RPM 会先依照套件里头的纪录数据查询 Linux 主机的相依属性套件是否满足， 若满足则予以安装，若不满足则不予安装。那么安装的时候就将该套件的信息整个写入 RPM 的数据库中，以便未来的查询、验证与反安装！这样一来的优点是：
\1. 由于已经编译完成并且打包完毕，所以安装上很方便( 不需要再重新编译 )；
\2. 由于套件的信息都已经记录在 Linux 主机的数据库上，很方便查询、升级与反安装；
缺点是：
\1. 安装的环境必须与打包时的环境需求一致或相当；
\2. 需要满足套件的相依属性需求；
\3. 反安装时需要特别小心，最底层的套件不可先移除，否则可能造成整个系统的问题！
SRPM 是 Source RPM 的意思，也就是这个 RPM 档案里面含有原始码( Source Code )哩！特别注意的是，这个 SRPM 所提供的套件内容『并没有经过编译』， 他提供的是原始码喔， 通常 SRPM 的附檔名是以 ***.src.rpm 这种格式来命名的。。与 RPM 档案相比， SRPM 多了一个重新编译的动作， 而且 SRPM 编译完成会产生 RPM 档案。SRPM 既然是原始码的格式，自然我们就可以透过修改 SRPM 内的参数设定档，然后重新编译产生能适合我们 Linux 环境的 RPM 档案。
使用RPM时可能会遇到软件包依赖性的问题，第一种解决方式是安装好所有的依赖包，第二种方式是使用urpmi/apt/yum来自动安装依赖包。
rpm 就会将套件的信息写入：/var/lib/rpm 这个目录中，所以， 往后您在进行查询的时候或者是预计要升级的时候，相关的信息就会由 /var/lib/rpm 这个目录的内容数据来提供。
**RPM 安装包**
[root@linux ~]# rpm -ivh rp-pppoe-3.1-5.i386.rpm
[root@linux ~]# rpm -ivh a.i386.rpm b.i386.rpm *.rpm
[root@linux ~]# rpm -ivh http://website.name/path/pkgname.rpm
可使用的参数包括--nodeps, --nomd5, --noscripts, --replacefiles, --replacepkgs, --force, --test

```
-i, --install                     install package(s)-v, --verbose                     provide more detailed output-h, --hash                        print hash marks as package installs (good with -v)-e, --erase                       erase (uninstall) package-U, --upgrade=<packagefile>+      upgrade package(s)－-replacepkge                    无论软件包是否已被安装，都强行安装软件包--test                            安装测试，并不实际安装--nodeps                          忽略软件包的依赖关系强行安装--force                           忽略软件包及文件的冲突Query options (with -q or --query):-a, --all                         query/verify all packages-p, --package                     query/verify a package file-l, --list                        list files in package-d, --docfiles                    list all documentation files-f, --file                        query/verify package(s) owning file
```

RPM 升级包

RPM 查询包

RPM 验证包

RPM 卸载包

RPMBUILD 安装包

[](http://blog.chinaunix.net/uid-23622436-id-3468244.html#)[来源： <](http://blog.chinaunix.net/uid-23622436-id-3468244.html#)[http://blog.chinaunix.net/uid-23622436-id-3468244.html](http://blog.chinaunix.net/uid-23622436-id-3468244.html)> 