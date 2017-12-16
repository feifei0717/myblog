# MAC在Finder栏怎么显示文件夹路径



Find栏工具是我们在使用Mac系统中最常用的一种，这是一个能够快速查文件夹和文件的实用工具！在Find栏中只会显示文件夹的默认名称，你知道怎么来找到当前文件夹的路径么？想要知道**MAC在Finder栏怎么显示文件夹路径**吗？下面这篇文章你一定不要错过！



### MAC在Finder栏怎么显示文件夹路径

打开“终端”（应用程序-》实用工具），输入以下两条命令：

defaults write com.apple.finder _FXShowPosixPathInTitle -bool TRUE;killall Finder

你看完整的路径地址出来了吧。

如何恢复默认状态呢？

![MAC在Finder栏文件夹路径怎么显示](http://img.smzy.com/imges/2017/0517/20170517024956198.png)

打开“终端”（应用程序-》实用工具），输入以下两条命令：

defaults delete com.apple.finder _FXShowPosixPathInTitle;killall Finder

这就是如何在Finder栏上显示当前浏览文件的访问路径的方法！

通过上面的方法，你是不是学会了要怎么M在Finder栏显示文件夹路径了呢！





http://www.smzy.com/smzy/tech28848.html