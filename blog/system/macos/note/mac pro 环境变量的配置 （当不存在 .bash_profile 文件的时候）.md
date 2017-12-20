# mac pro 环境变量的配置 （当不存在 .bash_profile 文件的时候）

顺便说下：  mac 下[Java ](http://lib.csdn.net/base/java)SDK 的路径。（比如在使用jertbrains 开发[Android](http://lib.csdn.net/base/android) 程序的时候，开始就要配置JSDK路径）

http://hi.baidu.com/liouyan9/blog/item/78fdc009b97bdac63ac76377.html

Mac下jdk的安装路径

2009-08-11 15:39

苹果系统已经包含完整的J2SE，其中就有JDK和JVM（苹果叫VM）。 
如果要在MAC系统下开发CODE。可以先装个IDE（NETBEANS/Eclipse等），而后不需要装JDK和JVM了，MAC下已经帮你下载好，安装完成，配置好路径。当然如果要升级JDK，那当然要自己下载安装了。 
在MAC系统中，jdk的安装路径与windows不同，默认目录是：/System/Libray/Frameworks/JavaVM.Framwork/。 
在这个目录下有个Versions目录，里面有不同版本的jdk。

http://blog.csdn[.NET](http://lib.csdn.net/base/dotnet)/hsyj_0001/article/details/5403939#

结果还是在英文网站上找到解决方法。

 

1. 启动终端Terminal


2. 进入当前用户的home目录

​    输入cd ~

3. 创建.bash_profile

​    输入touch .bash_profile

4. 编辑.bash_profile文件

​    输入open -e .bash_profile

​    因为是为了搭建[android](http://lib.csdn.net/base/android)开发环境，输入Android SDK下的tools目录：export PATH=${PATH}:/eclipse/android_sdk/tools

5. 保存文件，关闭.bash_profile
6. 更新刚配置的环境变量

​    输入source .bash_profile

7. 验证配置是否成功

​    输入android启动Android SDK and AVD Manager

8:操作截图如下：

   ![img](http://my.csdn.net/uploads/201205/07/1336384652_5817.png)

备注：  随着android 的升级  android  和 adb 命令 被放在了 不同的目录。。。  这个时候就需要配置多个路径了如下： 

​     修改 .project_profile 文件内容为

export PATH=${PATH}:/wf/programfiles/android/tools $
export PATH=${PATH}:/wf/programfiles/android/platform-tools