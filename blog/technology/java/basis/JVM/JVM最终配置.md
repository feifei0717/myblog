# jvm最终配置

-Xmn2g:整个堆大小=年轻代大小+年老代大小+持久代大小。持久代一般固定大小为64m,所以增大年轻代后,将会减小年老代大小。此值对系统性能影响较大,Sun官方推荐配置为整个堆的3/8。 
使用-XX:NewSize和-XX:MaxNewsize设置新域的初始值和最大值。 
在tomcat   bin目录下catalina.bat 头部添加如下：

```
set JAVA_OPTS=-Xms900m -Xmx900m -XX:PermSize=128M -XX:=256m -XX:MaMaxNewSizexPermSize=256m
```


linux下修改JVM内存大小:

要添加在tomcat 的bin 下catalina.sh 里，位置cygwin=false前 。注意引号要带上,红色的为新添加的.

```
# OS specific support. $var must be set to either true or false.

JAVA_OPTS="-Xms256m -Xmx512m  -XX:PermSize=128m -XX:MaxPermSize=256m"

```











解释： 

JAVA_OPTS='-Xms【初始化内存大小】-Xmx【可以使用的最大内存】'

JVM初始分配的内存由-Xms指定，默认是物理内存的1/64；JVM最大分配的内存由-Xmx指 定，默认是物理内存的1/4。默认空余堆内存小于40%时，JVM就会增大堆直到-Xmx的最大限制；空余堆内存大于70%时，JVM会减少堆直到 -Xms的最小限制。因此服务器一般设置-Xms、-Xmx相等以避免在每次GC 后调整堆的大小。对象的堆内存由称为垃圾回收器的自动内存管理系统回收。

 

JVM使用-XX:PermSize设置非堆内存初始值，默认是物理内存的1/64；由XX:MaxPermSize设置最大非堆内存的大小，默认是物理内存的1/4。

  

可以用tomact监控，也可以用工具（jconsole ， jvisualvm 详细看http://blog.chinaunix.net/uid-29632145-id-4615921.html）   







-Xms2g -Xmx2g -XX:ParallelGCThreads=8 -XX:PermSize=256m -XX:MaxPermSize=512m -Xss256k -XX:+UseCompressedOops -XX:+UseConcMarkSweepGC -XX:+CMSParallelRemarkEnabled  

-Xss（或-ss） 这个其实也是可以默认的，如果你真的觉得有设置的必要，你就改下吧，1.5以后是1M的默认大小（指一个线程的native空间），如果代码不多，可以设置小点来让系统可以接受更大的内存。注意，还有一个参数是-XX:ThreadStackSize，这两个参数在设置的过程中如果都设置是有冲突的，一般按照JVM常理来说，谁设置在后面，就以谁为主，但是最后发现如果是在1.6以上的版本，-Xss设置在后面的确都是以-Xss为主，但是要是-XX:ThreadStackSize设置在后面，主线程还是为-Xss为主，而其它线程以-XX:ThreadStackSize为主，主线程做了一个特殊判定处理；单独设置都是以本身为主，-Xss不设置也不会采用其默认值，除非两个都不设置会采用-Xss的默认值。另外这个参数针对于hotspot的vm，在IBM的jvm中，还有一个参数为-Xoss，主要原因是IBM在对栈的处理上有操作数栈和方法栈等各种不同的栈种类，而hotspot不管是什么栈都放在一个私有的线程内部的，不区分是什么栈，所以只需要设置一个参数，而IBM的J9不是这样的；有关栈上的细节，后续我们有机会专门写文章来说明。 

-XX:+DisableExplicitGC 默认是没有禁用掉，写成+就是禁用掉的了，但是有些时候在使用allocateDirect的时候，很多时候还真需要System.gc来强制回收这块资源。 

-XX:+UseCompressedOops   请注意：这个参数默认在64bit的环境下默认启动，但是如果JVM的内存达到32G后，这个参数就会默认为不启动，因为32G内存后，压缩就没有多大必要了，要管理那么大的内存指针也需要很大的宽度了。 

-XX:+UseConcMarkSweepGC 启动CMS为全局GC方法(注意这个参数也不能上面的并行GC进行混淆，Yong默认是并行的，上面已经说过 

 -XX:+CMSParallelRemarkEnabled 是否启动并行CMS GC（默认也是开启的） 