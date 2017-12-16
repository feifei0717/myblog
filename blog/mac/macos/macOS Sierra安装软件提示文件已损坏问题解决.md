# macOS Sierra安装软件提示文件已损坏问题解决



很多朋友下载本站提供的Mac软件资源，安装提示“xxx软件已损坏，打不开，您应该将它移到废纸篓”的提示，其实并不是软件本身有问题，而是Mac系统的一个安全机制问题，按照如下方法操作，即可打开并安装本站的Mac软件资源。

安装时的截图

##### 1、首先需要点击左上角苹果标志打开系统偏好设置，选择安全性与隐私：

![img](http://upload-images.jianshu.io/upload_images/667152-a1d6be3844b25c3b.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

##### 2、然后点击左下角锁形按钮，这时会提示需要输入苹果系统用户密码，输入你的账号密码点击确定：

![img](http://upload-images.jianshu.io/upload_images/667152-27ed8ac345246d8f.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

##### 3、选择“任何来源”，然后点击允许来自任何来源，这样就不会出现“软件已损坏”或“不是Mac Appstore下载的”的提示了：

![img](http://upload-images.jianshu.io/upload_images/667152-279ad9ee90ce6701.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

但是升级到macOS Sierra系统之后很多同学发现任何来源按钮消失了，原因是苹果为了系统的安全禁用了任何来源的按钮。打开的方法如下：

##### macOS Sierra设置说明

若已安装了最新系统 macOS Sierra 则有可能出现某些安装包已损坏、显示未激活、打开崩溃等的提示！！原因是因为新系统屏蔽了任何来源的设置，需要大家打开“允许任何来源”方可安装
步骤1：Spotlight搜索(快捷键：command+空格或右上角搜索的符号)：搜索“终端”
步骤2：直接输入 sudo spctl --master-disable 回车
步骤3：输入你的开机密码
步骤4：回到系统偏好设置的“安全与隐私”，勾选“允许任何来源”

![img](http://upload-images.jianshu.io/upload_images/667152-22563d879b743ea7.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

![img](http://upload-images.jianshu.io/upload_images/667152-500f98ce870d79ee.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

需要说明的是，如果在系统偏好设置的“安全与隐私”中重新选中允许App Store 和被认可的开发者App，即重新打开Gatekeeper后，允许“任何来源”App的选项会再次消失，可运行上述命令再次关闭Gatekeeper。

相关说明链接:
[OS X：关于 Gatekeeper](https://support.apple.com/zh-cn/HT202491)

本人从网上还看到了另一种方法：
实际上你根本就没有必要用终端让“任何来源”的选项出现，你只需要在需要的时候右键选择打开或者按住 control 键选择打开即可，这是苹果提供给用户在没有“任何来源”选项下的可选方案。既能得到有效提示，又能给用户一个选择。

![img](http://upload-images.jianshu.io/upload_images/667152-ea53fe73735b0a61.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

###### 以后都是在网上搜集的一些资料，自己整理出来的，希望能帮到有需要的同学，大家加油！！！！！

http://www.jianshu.com/p/d94353033f06