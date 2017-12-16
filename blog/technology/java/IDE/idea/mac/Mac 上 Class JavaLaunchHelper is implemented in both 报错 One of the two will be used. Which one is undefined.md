# [Mac 上 Class JavaLaunchHelper is implemented in both 报错](http://blog.csdn.net/lizhaowei213/article/details/68951671)



Class JavaLaunchHelper is implemented in both /Library/[Java](http://lib.csdn.net/base/java)/JavaVirtualMachines/jdk1.8.0_121.jdk/Contents/Home/bin/java (0x10d19c4c0) and /Library/Java/JavaVirtualMachines/jdk1.8.0_121.jdk/Contents/Home/jre/lib/libinstrument.dylib (0x10ea194e0). One of the two will be used. Which one is undefined.

昨晚在Mac上装了Intellij Idea，随手用IJ带的Java工程模板创建了一个[测试](http://lib.csdn.net/base/softwaretest)工程，控制台报了这样一个Error。

意思是这个JavaLaunchHelper类被实现了两次。无奈之下搜索了万能的Stack Overflow，找到了解决方案。

<http://stackoverflow.com/questions/43003012/objc3648-class-javalaunchhelper-is-implemented-in-both>

引用高票回答如下

> You can find all the details here:
>
> - [IDEA-170117](https://youtrack.jetbrains.com/issue/IDEA-170117) “objc: Class JavaLaunchHelper is implemented in both …” warning in Run consoles
>
> It’s the [old bug in Java](https://bugs.openjdk.java.net/browse/JDK-8022291) on Mac that [got triggered by the Java Agent](https://github.com/JetBrains/intellij-community/commit/4fde1be3df5f7c145f943a969eb261e32bf72ef6) being used by the IDE when starting the app. This message is harmless and is safe to ignore. [Oracle](http://lib.csdn.net/base/oracle) developer’s comment:
>
> > The message is benign, there is no negative impact from this problem since both copies of that class are identical (compiled from the exact same source). It is purely a cosmetic issue.
>
> The [problem is fixed](https://bugs.openjdk.java.net/browse/JDK-8022291) in [Java ](http://lib.csdn.net/base/java)9 and in [Java 8 update 152](https://jdk8.java.net/download.html).
>
> If it annoys you or affects your apps in any way, the workaround for IntelliJ IDEA is to disable `idea_rt` launcher agent by adding `idea.no.launcher=true` into `idea.properties` (`Help` | `Edit Custom Properties...`).

这位外国码友清楚地解释了这个Error的原因，大概意思是说这是Mac上面Java的一个老Bug了，会在那些使用了[java ](http://lib.csdn.net/base/java)Agent的IDE上运行应用时触发，但这个Error对程序是无影响的，可以无视。在Java 9和Java 1.8.152版本里已经修复了。

解决方案:

点击IJ最上面菜单的Help-Edit Custom Properties，没有这个properties文件的话，IJ会提示创建，然后在里面加上

```
idea.no.launcher=true
```