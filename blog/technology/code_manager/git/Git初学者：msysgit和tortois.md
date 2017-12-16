# [Git初学者：msysgit和tortoisegit]()

Git现在如日中天，要是不会一点都不好意思自称为攻城师。用过CVS、SVN后再用Git，一时半会儿还有点不太适应，就像习惯了Android界面一时适应不了iOS一样。那么，Git与SVN的区别到底是什么？
Git与大部分版本控制系统的差别是很大的，比如Subversion、CVS、Perforce、Mercurial 等等，使用的是“增量文件系统” （Delta Storage systems）, 就是说它们存储每次提交(commit)之间的差异。Git正好与之相反，它会把你的每次提交的文件的全部内容（snapshot）都会记录下来。这会是在使用Git时的一个很重要的理念。

以SVN为例，源代码管理是以服务器为中心的，每个开发者都连在服务器上，本地修改，然后commit到svn服务器上。这种做法看似完美，但是有缺陷：
1、开发者不能本地跟踪代码版本，因为所有的信息都是在服务器上。你把本地的代码改了很多，但是又不能提交。通常，本地只能缓存一个版本。对于小项目无所谓，但是项目一复杂，人员多就麻烦了。通常你本地的代码都全是红色的。自己都不知道今天修改了什么， 有哪些修改是真正应该提交给svn的。
2、因为第一点，一旦离开服务器你将无法正常工作。因为本地不能跟踪代码版本。  你的几乎任何操作都必须连上服务器。比如，show log，blame，show history等等。
3、对于大型项目，svn几乎不可用。比如linux内核项目，开发者何止几万？都直接提交给svn服务器的话还不乱套了。
4、对于个人的项目而言（或者对于小公司的项目），不用版本控制当然不行，但是为了用版本控制而专门架设svn服务器不但麻烦而且浪费。
当然，以上问题Linux内核的作者Linus Benedict Torvalds也遇到了这些问题，于是他决定再一次改变世界， 重写一个可以本地使用的svn。

Git没有服务器，装上Git软件之后，你就可以指定本地的文件夹进行版本控制了。你可拔掉网线，然后在本地修改，commit，revert（rollback）， branch， restore， show log， blame， history 等等，全部你之前在svn里面可以用的操作。
如果每个人都自顾自的开发，那么怎么协作呢？通常Git比SVN会多出两个操作，就是 pull 和 push。
开发者之间通过 pull 和 push 操作， 把别人的修改拉过来，或者把自己的修改推给别人。

[Git官方网站](http://git-scm.com/)的口号就是everything is local（一切皆本地），由此可见Git面世之初的定位便是如此。当然大部分程序员都是在Windows下工作，下载Git的windows客户端[ msysgit ](https://msysgit.github.io/)安装即可，具体安装过程省略（自动识别windows 32 或64位）。
高手习惯于用命令行，但初学者一般还是要GUI客户端的，推荐TortoiseGit，类似于TortoiseSVN，基本操作类似，容易上手。[https://code.google.com/p/tortoisegit/](https://code.google.com/p/tortoisegit/)
依次安装msysgit和TortoiseGit后，就可以像操作SVN一样创建Git版本库了。
在任意目录下右击，出现TortoiseGit的右键菜单，点击Git Clone，出现如下图界面：
[![Git Clone](http://teddysun.u.qiniudn.com/wp-content/uploads/2014/Gitclone.png)](http://teddysun.u.qiniudn.com/wp-content/uploads/2014/Gitclone.png)

URL填入在线托管的Git地址，Directory便是本地文件夹，其他选择默认即可。
下面列举几个常用的免费Git托管网站：
1、 Github.com [https://github.com/](https://github.com/) 最著名的免费Git托管网站，曾一度被我天朝大墙屏蔽，缺点是免费的不支持私有项目。
2、 京东代码库 [https://code.jd.com/](https://code.jd.com/) 京东商城的免费Git托管网站，提供一键搬迁功能，对所有公有、私有项目免费提供容量为1G的存储空间。
3、 开源中国代码托管 [https://git.oschina.net/](https://git.oschina.net/) 支持公有项目和私有项目，成员无限，项目1000个。
4、 CSDN Code [https://code.csdn.net/](https://code.csdn.net/) 支持公有项目和私有项目，提供512MB 存储空间。
5、 Bitbucket [https://bitbucket.org/](https://bitbucket.org/) 也是国外比较著名的Git托管网站，免费用户支持公有和私有项目。

将远程版本库克隆到本地后，就可以像操作SVN一样管理代码了，Diff，Revert，Add，Commit等等。与SVN不同之处是多了3个操作：Pull，Fetch，Push。
右键菜单Git Sync如下图：
[![Git Sync](http://teddysun.u.qiniudn.com/wp-content/uploads/2014/GitSync.png)](http://teddysun.u.qiniudn.com/wp-content/uploads/2014/GitSync.png)

利用TortoiseGit快速开始使用Git，可以帮助我们减少学习时间，基本上可以替代命令行实现Git的所有功能。

最后介绍一下两个概念：
**1、 Git目录。**是为你的项目存储所有历史和元信息的目录——包括所有的对象(commits,trees,blobs,tags)，这些对象指向不同的分支。每一个项目只能有一个“Git目录”(这和SVN，CVS的每个子目录中都有此类目录相反)，这个叫“.git”的目录在你项目的根目录下，默认是隐藏属性(这是默认设置,但并不是必须的)。
**2、 工作目录。**Git的“工作目录”存储着你现在签出(checkout)来用来编辑的文件。当你在项目的不同分支间切换时，工作目录里的文件经常会被替换和删除。所有历史信息都保存在“Git目录”中；工作目录只用来临时保存签出(checkout) 文件的地方，你可以编辑工作目录的文件直到下次提交(commit)为止。

**附录：**
如何去掉安装msysgit后产生的右键菜单，如Git Init Here，Git GUI，Git Bash等？
如果你和我一样，不喜欢msysgit右键菜单的快捷方式，那么完全有办法去除掉。
运行cmd，定位到msysgit的安装目录。
Windows 32位系统：

```
cd C:\Program Files\Git\git-cheetah
regsvr32 /u git_shell_ext.dll
```

Windows 64位系统：

```
cd C:\Program Files (x86)\Git\git-cheetah
regsvr32 /u git_shell_ext64.dll
```

**学习Git中文资料推荐：**
Git Community Book 中文版，下载地址：[http://gitbook.liuhui998.com/book.pdf](http://gitbook.liuhui998.com/book.pdf)

**参考链接：**
[http://www.cnblogs.com/shuidao/p/3535299.html](http://www.cnblogs.com/shuidao/p/3535299.html)

作者：[秋水逸冰](http://teddysun.com/)

原文链接：[Git初学者：msysgit和tortoisegit](http://teddysun.com/333.html)

[秋水逸冰](http://teddysun.com/)版权所有，转载请保留原文链接。