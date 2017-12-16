# eclipse 下调整jdk和tomcat的jvm参数

分类: java
日期: 2014-11-12

原文地址: 

http://blog.chinaunix.net/uid-29632145-id-4616105.html

------

****[eclipse 下调整jdk和tomcat的jvm参数]() *2014-11-12 14:33:01*

分类： Java

eclipse 下调试和运行,往往会出现调整java.lang.OutOfMemoryError: Java heap space 
产生的原因我猜测是使用了maven,subversion,mylar,wtp等插件，还有就是大文件,对象的操作导致,具体原因还不确定。 
在网上找了找相关资料，找到了解决办法：方法(1)操作后没有起作用,不过可以参考其中查看内存的技巧 .具体解决看方法(2),(3)
一 、在eclipse根目录，找到eclipse.ini，在其中指定初始heap 
size和最大heap size: 
-xms 64M 
-xmx 
256M 
其中， -xms是初始heap size, -xmx 是最大heap 
size。 
在实际使用过程中，我发现我一启动eclipse时，heap 
size使用大概是40m，多时可以达到128m，所以我的设置是 
-xms 
64m 
-xmx 128m 
对于permgen space: 
在eclipse.ini中指定参数： 
-permsize 
256m 
-maxpermsize 
784m  

二 、修改jdk 使用内存(此方法可行)

找到eclispe 中window->preferences->Java->Installed JRE ，点击右侧的Edit 
按钮，在编辑界面中的 “Default VM Arguments ”选项中，填入如下值即可。

-Xms64m -Xmx128m

三、    修改Run Configurations (此方法可行)

在代码上右键，依次点击“Run As ”-> “Run Configurations ”，在Arguments 参数中的“VM arguments: 
”中填入如下值即可。

-Xms64m -Xmx128m

四、    查询当前JVM 内存代码

下面是查询当前JVM 内存大小的代码，可以测试以上设置后JVM 的内存是否会变化。增加JVM 内存的配置项后，无需重新启动eclipse 
。具体的代码如下：

public class TestMemory {
​    public static void main(String[] args) {

​       System. out .println( " 内存信息 :" + toMemoryInfo ());

​    }

​    public static String toMemoryInfo() {

​       Runtime currRuntime = Runtime.getRuntime ();

​       int nFreeMemory = ( int ) (currRuntime.freeMemory() / 1024 / 
1024);

​       int nTotalMemory = ( int ) (currRuntime.totalMemory() / 1024 / 
1024);

​       return nFreeMemory + "M/" + nTotalMemory + "M(free/total)" ;
}
}

也可以把工程发布成war包部署到存在管理控制台host-manager的tomcat下.进入控制台选择status查看内存的使用情况.

设置好了,实际运行的结果可以通过Eclipse中“Help”-“About Eclipse SDK”窗口里面的“Configuration Details”按钮进行查看。还有一个办法可以在eclipse中看到当前heap size的分配和使用情况，还可以强制执行垃圾回收。 
在eclipse的快捷方式上点击右键，在目标栏添加参数: 
-debug 
options -vm 
javaw.exe 
然后，在eclipse根目录下，新建一个名为options的文件，不要后缀名。在该文件中加入内容： 
org.eclipse.ui/perf/showHeapStatus=true 
重启eclipse，就可以在eclipse的左下角看到当前heap 
size的使用情况和分配情况了，还可以手工执行垃圾回收，看heap size不够时就来一次。