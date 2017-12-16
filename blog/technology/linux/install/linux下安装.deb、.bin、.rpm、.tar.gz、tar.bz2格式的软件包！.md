# linux下安装.deb、.bin、.rpm、.tar.gz、tar.bz2格式的软件包！

分类: linux
日期: 2014-11-08

原文地址: 

http://blog.chinaunix.net/uid-29632145-id-4607713.html

------

****[linux下安装.deb、.bin、.rpm、.tar.gz、tar.bz2格式的软件包！]() *2014-11-08 16:25:22*

分类： LINUX

今天在Ubuntu11.10中安装Google chrome浏览器是遇到了问题，下载好的“.deb”格式的安装文件google-chrome-stable.deb双击后或者右键快捷菜单选择Synaptic Package Manager 打开时均提示错误，改用命令的方式安装：

dpkg -i  google-chrome-stable.deb 

提示缺少一个依赖的软件包，按照提示安装完成后 Google Chrome浏览器顺利的安装完成。鉴于我们搞开发的人士或者一些linux爱好者需要时常在linux系统中安装一些软件，在此，对相关问题做一总结，以利己利人。
首先介绍两个简单的方式

## 第一：sudo apt-get install packagename 命令

如果我们知道我们要安装的软件的确切的名称，那么我们可以简单的通过此条命令来获取和安装软件。apt-get是一条linux命令，适用于deb包管理式的操作系统，如ubuntu，主要用于自动从互联网的软件仓库中搜索、安装、升级、卸载软件。apt-get命令一般需要root执行，所以一般跟着sudo命令。

一些常用的apt命令参数（更具体的可参见相关的帮助文档）：

​    apt-cache search package 搜索包
​    apt-cache show package 获取包的相关信息，如说明、大小、版本等
​    sudo apt-get install package 安装包
​    sudo apt-get install package - - reinstall 重新安装包
​    sudo apt-get -f install 修复安装"-f = - -fix-missing"
​    sudo apt-get remove package 删除包
​    sudo apt-get remove package - - purge 删除包，包括删除配置文件等
​    sudo apt-get update 更新源
​    sudo apt-get upgrade 更新已安装的包
​    sudo apt-get dist-upgrade 升级系统
​    sudo apt-get dselect-upgrade 使用 dselect 升级
​    apt-cache depends package 了解使用依赖
​    apt-cache rdepends package 是查看该包被哪些包依赖
​    sudo apt-get build-dep package 安装相关的编译环境
​    apt-get source package 下载该包的源代码
​    sudo apt-get clean && sudo apt-get autoclean 清理无用的包
​    sudo apt-get check 检查是否有损坏的依赖

## 第二： 通过Synaptic Package Manager

中文名称叫做新立得软件包管理器，起源于Debian，是dpkg命令的图形化前端，或者说是前端软件套件管理工具。它能够在图形界面内完成linux系统软件的搜寻、安装和删除，相当于终端里的apt命令。在ubuntu最近的长期支持版里已经预装了新立得软件包管理器。在没有安装它的系统中，可以通过apt-get install synaptic 进行安装。

要运行新立得，点击系统 > 系统管理 > 新立得软件包管理器（System > Administration > Synaptic Package Manager）不同版本的Ubuntu进入Synaptic的方式可能会有所不同，不同版本的Synaptic也会存在一点点差异，但总体来讲是大同小异，包管理器的使用方法也非常简单，完全是图形化的界面，摸索几次边一目了然，遇到不能解决的问题时可参考其帮助文档。此方法的缺点就是比较慢，尤其对于一些开发人士来讲，另外，一些比较小众化的，不叫特殊的软件也不一定在此处找的到，这是我们就学要手动去下载一些软件来自行安装了。

如果不是通过上如两种方式来安装软件的话，便是通过自己下载所需软件然后手动安装了。我们下载到的软件无是“.deb”,".bin",".rpm"".tar.gz"这些格式，我们对此进行一一的说明：

1、”“.deb” 格式是Ubuntu可安装的类型，我们可以通过直接双击该格式的文件进行安装，就行Windows系统中的“.exe”安装程序一样。当然，我们也可以通过dpkg命令来安装我们下载好的软件，例如：

 dpkg -i xxx.deb 

其中参数 “-i” 表示安装的意思。dpkg的用法如下：

dpkg   [<选项>]  [参数]  软件全名

其中，选项可省，比如上例，更具体的用法请参阅其帮助文档（dpkg -h 或者 dpkg --help）。

2、'.rpm'格式是Red Hat Package Manager的简称，此工具包最先是由Red Hat公司推出的，后来被其他Linux开发商所借用。由于它为Linux使用者省去了很多时间，所以被广泛应用于在Linux下安装、删除软件。在Ubuntu上不能双击运行“.rpm”格式的软件包，一般的方法是我们用alien把rpm转换为deb格式后再安装。Ubuntu没有默认安装alien，所以先安装alien，命令为：

sudo apt-get install alien（详细参数可参见其帮助文档）

然后用alien命令进行转换：

sudo alien xxx.rpm （详细参数可参见其帮助文档）

这一步以后会生成一个同名的xxx.deb文件， 然后就可以双击或者通过dpkg命令安装了，但是这种方式不能保证100%成功。另外我们也可以在Ubuntu系统中安装RPM包管理器，通过rpm命令来安装，删除“.rpm”格式的软件包。命令用法如下：

rpm 参数 软件包名

常用的一些rpm命令参数如下（详细参数可参见其帮助文档）：

-i 安装软件包；
-e 移除软件包
 -vh：显示安装进度；
 -U：升级软件包；
 -qpl：列出RPM软件包内的文件信息；
 -qpi：列出RPM软件包的描述信息；
 -qf：查找指定文件属于哪个RPM软件包；
 -Va：校验所有的RPM软件包，查找丢失的文件；
 -qa: 查找相应文件

**3、有时候，我们会下载到一些“.bin”格式的文件**，如最近下载安装的 jdk-6u32-linux-i586.bin。对于这种类型的文件，我们一般赋予其可执行的属性，命令为：

chmod +x 文件名（具体用法可参见其帮助文档）

然后直接在命令行中执行该文件既可，比如我的当前目录下含有具有可执行属性的jdk-6u32-linux-i586.bin，直接执行

./jdk-6u32-linux-i586.bin

命令既可。当然，不同的软件可能还会有一些后续的命令，这个要以具体情况而定，比如安装这个jdk-6u32-linux-i586.bin就需要执行一些额外的后续命令来进行相关的配置。这个依照每个软件官方给出的指示，一步步执行既是。
**4、最后要说的是“tar.gz”或者“.tar.bz2”这种格式的文件.“tar.gz”或者“.tar.bz2”一般情况下都是源代码的安装包，**对于此种类型的软件包，我们一般先要通过命令将压缩包解压，然
后才能进行编译，继而进行安装。以”.tar.gz“格式为例，我们先要执行

 tar -zxvf FileName.tar.gz

以解压软件包，然后通过执行

./configure 

来进行配置，执行

make

来进行编译，执行make install

来进行安装，这里边每条命令都有详细的参数以完成完善复杂的功能，详请参阅每个命令的帮助文档。
谈完了安装接下来谈一谈如何卸载软件把。随着时间的推移我们不可避免要卸载掉一些软件，所以，掌握这些方法也是非常有必要的。

一开始，我们讲了两种简单的安装软件包的方法，与此对应，有两种简易的移除软件包的方式：

1、apt命令

移除式卸载，移除软件包:apt-get remove xxx
清除式卸载，把与软件安装有关的配置一起卸载：apt-get --purge remove xxx

2、通过Synaptic Package Manager 

简单的图形化界面，非常容易。找到要移除的软件包，点击移除（Remove）既可

还有一些其他的移除方式，如

dpkg方式：
移除式卸载：dpkg -r xxx
清除式卸载：dpkg -P xxx

rpm方式：
rpm -e xxx
尽管已经说得非常详细了，不过相信很多同人在进行这些操作时仍然会遇到诸多问题，此时我们应当保持冷静，应当通过输出内容认真分析造成错误的原因，参阅相应的帮助文档，或者像互联网求助，问题一定能得以解决。要多加培养分析解决问题的能力!