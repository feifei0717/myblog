## 备份操作

1. 浏览器地址栏输入:   chrome://extensions/  选择开发模式，单击打包扩展程序，可以看到一个“扩展程序根目录” 输入框。

2. 进入 C:\Users\Administrator\AppData\Local\Google\Chrome\User Data\Default\Extensions 目录下，会看到许多以id号命名的目录，这些文件就是插件，进入id目录，会看到一个版本号目录。如下： C:\Users\Administrator\AppData\Local\Google\Chrome\User Data\Default\Extensions\apdfllckaahabafndbhieahigkjlhalf\6.3_0

3. 复制 “版本号目录全路径”到第0步操作中遇到的“扩展程序根目录” 里。

4. 单击第0步中的“打包扩展按钮”，就可以在id目录下找到对应的crx 插件了，同理，把所有的id(插件)都手动的备份一次。




## 重新载入备份的插件

1. 右击 Chrome 桌面快捷方式，选择-"属性"-"快捷方式"，然后在"目标"一栏尾部添加参数 --enable-easy-off-store-extension-install ，然后再运行浏览器就可以像以前那样正常安装 Web Store 之外的第三方扩展应用及脚本程序了。

2. 先将扩展程序下载保存到本地，然后将下载来的文件后缀名 *.crx 改成 *.rar，这样你就得到了一个压缩文件，然后右键解压这个压缩文件得到一个文件夹。然后在浏览器里打开扩展程序页面（chrome://settings/extensions），选中右上方开发人员模式复选框，然后再点击左上方的”载入正在开发的扩展程序“按钮，选中刚刚解压出来的文件夹然后点确定即可。