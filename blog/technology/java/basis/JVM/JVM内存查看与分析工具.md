# jvm 内存查看与分析工具

   业界有很多强大的java profile的工具，比如Jporfiler，yourkit，这些收费的东西我就不想说了，想说的是，其实java自己就提供了很多内存监控的小工具，下面列举的工具只是一小部分，仔细研究下jdk的工具，还是蛮有意思的呢：）



## **1：gc日志输出**

​       只有在gc回收的时候会作用,例如手动System.gc(),在jvm启动参数中加入 -XX:+PrintGC -XX:+PrintGCDetails -XX:+PrintGCTimeStamps，jvm将会按照这些参数顺序输出gc概要信息，详细信息，gc时间信息，gc造成的应用暂停时间。如果在刚才的参数后面加入参数 -Xloggc:文件路径，gc信息将会输出到指定的文件中。其他参数还有

-verbose:gc和-XX:+PrintTenuringDistribution等。

## **2：jconsole**

​      jconsole是jdk自带的一个内存分析工具，它提供了图形界面。可以查看到被监控的jvm的内存信息，线程信息，类加载信息，MBean信息。

​      jconsole位于jdk目录下的bin目录，在windows下是jconsole.exe，在unix和linux下是jconsole.sh，jconsole可以监控本地应用，也可以监控远程应用。 要监控本地应用，执行jconsole pid，pid就是运行的java进程id，如果不带上pid参数，则执行jconsole命令后，会看到一个对话框弹出，上面列出了本地的java进程，可以选择一个进行监控。如果要远程监控，则要在远程服务器的jvm参数里加入一些东西，因为jconsole的远程监控基于jmx的，关于jconsole详细用法，请见专门介绍jconsle的文章，我也会在博客里专门详细介绍jconsole。

## **3：jviusalvm**

​      在JDK6 update 7之后，jdk推出了另外一个工具:jvisualvm,java可视化虚拟机，它不但提供了jconsole类似的功能，还提供了jvm内存和cpu实时诊断，还有手动dump出jvm内存情况，手动执行gc。

​     和jconsole一样，运行jviusalvm，在jdk的bin目录下执行jviusalvm，windows下是jviusalvm.exe,linux和unix下是jviusalvm.sh。

## **4：jmap**

​    jmap是jdk自带的jvm内存分析的工具，位于jdk的bin目录。jdk1.6中jmap命令用法：

```
Usage:
    jmap [option] <pid>
        (to connect to running process)
    jmap [option] <executable <core>
        (to connect to a core file)
    jmap [option] [server_id@]<remote server IP or hostname>
        (to connect to remote debug server)

where <option> is one of:
    <none>               to print same info as Solaris pmap
    -heap                to print java heap summary
    -histo[:live]        to print histogram of java object heap; if the "live"
                         suboption is specified, only count live objects
    -clstats             to print class loader statistics
    -finalizerinfo       to print information on objects awaiting finalization
    -dump:<dump-options> to dump java heap in hprof binary format
                         dump-options:
                           live         dump only live objects; if not specified,
                                        all objects in the heap are dumped.
                           format=b     binary format
                           file=<file>  dump heap to <file>
                         Example: jmap -dump:live,format=b,file=heap.bin <pid>
    -F                   force. Use with -dump:<dump-options> <pid> or -histo
                         to force a heap dump or histogram when <pid> does not
                         respond. The "live" suboption is not supported
                         in this mode.
    -h | -help           to print this help message
    -J<flag>             to pass <flag> directly to the runtime system
    
    
Example: jmap -dump:format=b,file=heap.bin <pid>   
```


​    jmap -histo 在屏幕上显示出指定pid的jvm内存状况。以我本机为例，执行该命令，屏幕显示：

```
1:         24206        2791864  < constMethodKlass >    
2:         22371        2145216  [C   
3:         24206        1940648  < methodKlass >    
4:          1951        1364496  < constantPoolKlass >    
5:         26543        1282560  < symbolKlass >    
6:          6377        1081744  [B   
7:          1793         909688  < constantPoolCacheKlass >    
8:          1471         614624  < instanceKlassKlass >    
9:         14581         548336  [Ljava.lang.Object;   
10:          3863         513640  [I   
11:         20677         496248  java.lang.String      
12:          3621         312776  [Ljava.util.HashMap$Entry;   
13:          3335         266800  java.lang.reflect.Method   
14:          8256         264192  java.io.ObjectStreamClass$WeakClassKey   
15:          7066         226112  java.util.TreeMap$Entry   
16:          2355         173304  [S   
17:          1687         161952  java.lang.Class   
18:          2769         150112  [[I   
19:          3563         142520  java.util.HashMap   
20:          5562         133488  java.util.HashMap$Entry   
Total        239019       17140408   
```

为了方便查看，我删掉了一些行。从上面的信息很容易看出，#instance指的是对象数量，#bytes指的是这些对象占用的内存大小，class name指的是对象类型。

​     再看jmap的dump选项，这个选项是将jvm的堆中内存信息输出到一个文件中，在我本机执行

示例:

```
jmap -dump:file=/Users/jerryye/Desktop/dump2.txt 6910
```

注意6910是我本机的java进程pid，dump出来的文件比较大有10几M，而且我只是开了tomcat，跑了一个很简单的应用，且没有任何访问，可以想象，大型繁忙的服务器上，dump出来的文件该有多大。需要知道的是，dump出来的文件信息是很原始的，绝不适合人直接观看，而jmap -histo显示的内容又太简单，例如只显示某些类型的对象占用多大内存，以及这些对象的数量，但是没有更详细的信息，例如这些对象分别是由谁创建的。那这么说，dump出来的文件有什么用呢？当然有用，因为有专门分析jvm的内存dump文件的工具。

 

## **5：jhat**

​    上面说了，有很多工具都能分析jvm的内存dump文件，jhat就是sun jdk6及以上版本自带的工具，位于jdk的bin目录，执行 jhat -J-mx512m [file] ，file就是dump文件路径。jhat内置一个简单的web服务器，此命令执行后，jhat在命令行里显示分析结果的访问地址，可以用-port选项指定端口，具体用法可以执行jhat -heap查看帮助信息。访问指定地址后，就能看到页面上显示的信息，比jmap -histo命令显示的丰富得多，更为详细。



示例:

```
 jhat -J-mx512m /Users/jerryye/Desktop/dump.txt
```



## **6：eclipse内存分析器**

​    上面说了jhat，它能分析jvm的dump文件，但是全部是文字显示，eclipse memory analyzer，是一个eclipse提供用于分析jvm 堆dump的插件，网址为 [http://www.eclipse.org/mat ](http://www.eclipse.org/mat),它的分析速度比jhat快，分析结果是图形界面显示，比jhat的可读性更高。其实jvisualvm也可以分析dump文件，也是有图形界面显示的。

## **7：jstat**

​      如果说jmap倾向于分析jvm内存中对象信息的话，那么jsta就是倾向于分析jvm内存的gc情况。都是jvm内存分析工具，但显然，它们是从不同维度来分析的。jsat常用的参数有很多，如 -gc,-gcutil,-gccause，这些选项具体作用可查看jsat帮助信息，我经常用-gcutil，这个参数的作用不断的显示当前指定的jvm内存的垃圾收集的信息。

​      我在本机执行 jstat -gcutil 340 10000，这个命令是每个10秒钟输出一次jvm的gc信息，10000指的是间隔时间为10000毫秒。屏幕上显示如下信息（我只取了第一行，因为是按的一定频率显示，所以实际执行的时候，会有很多行）：

  S0     S1     E      O      P     YGC     YGCT    FGC    FGCT     GCT   
 54.62   0.00  42.87  43.52  86.24   1792    5.093    33    7.670   12.763

​        额。。。怎么说呢，要看懂这些信息代表什么意思，还必须对jvm的gc机制有一定的了解才行啊。其实如果对sun的 hot spot jvm的gc比较了解的人，应该很容易看懂这些信息，但是不清楚gc机制的人，有点莫名其妙，所以在这里我还是先讲讲sun的jvm的gc机制吧。说到gc，其实不仅仅只是java的概念，其实在java之前，就有很多语言有gc的概念了，gc嘛就是垃圾收集的意思，更多的是一种算法性的东西，而跟具体语言没太大关系，所以关于gc的历史，gc的主流算法我就不讲了，那扯得太远了，扯得太远了就是扯淡。sun现在的jvm，内存的管理模型是分代模型，所以gc当然是分代收集了。分代是什么意思呢？就是将对象按照生命周期分成三个层次，分别是：新生代，旧生代，持久代。对象刚开始分配的时候，大部分都在新生代，当新生代gc提交被触发后了，执行一次新生代范围内的gc，这叫minor gc，如果执行了几次minor gc后，还有对象存活，将这些对象转入旧生代，因为这些对象已经经过了组织的重重考验了哇。旧生代的gc频率会更低一些，如果旧生代执行了gc，那就是full gc，因为不是局部gc，而是全内存范围的gc，这会造成应用停顿，因为全内存收集，必须封锁内存，不许有新的对象分配到内存，持久代就是一些jvm期间，基本不会消失的对象，例如class的定义，jvm方法区信息，例如静态块。需要主要的是，新生代里又分了三个空间：eden，susvivor0，susvivor1，按字面上来理解，就是伊甸园区，幸存1区，幸存2区。新对象分配在eden区中，eden区满时，采用标记-复制算法，即检查出eden区存活 的对象，并将这些对象复制到是s0或s1中，然后清空eden区。jvm的gc说开来，不只是这么简单，例如还有串行收集，并行收集，并发收集，还有著名的火车算法，不过那说得太远了，现在对这个有大致了解就好。说到这里，再来看一下上面输出的信息：

   S0       S1       E        O          P       YGC     YGCT    FGC    FGCT     GCT   
 54.62   0.00  42.87  43.52  86.24   1792    5.093    33    7.670   12.763

S0:新生代的susvivor0区，空间使用率为54..62%

S1:新生代的susvivor1区，空间使用率为0.00%(因为还没有执行第二次minor收集)

E:eden区，空间使用率42.87%

O:旧生代，空间使用率43.52%

P:持久带，空间使用率86.24%

YGC:minor gc执行次数1792次

YGCT:minor gc耗费的时间5.093毫秒

FGC:full gc执行次数33

FGCT:full gc耗费的时间7.670毫秒

GCT:gc耗费的总时间12.763毫秒

## **怎样选择工具**

​     上面列举的一些工具，各有利弊，其实如果在开发环境，使用什么样的工具是无所谓的，只要能得到结果就好。但是在生产环境里，却不能乱选择，因为这些工具本身就会耗费大量的系统资源，如果在一个生产服务器压力很大的时候，贸然执行这些工具，可能会造成很意外的情况。最好不要在服务器本机监控，远程监控会比较好一些，但是如果要远程监控，服务器端的启动脚本要加入一些jvm参数，例如用jconsloe远程监控tomcat或jboss等，都需要设置jvm的jmx参数，如果仅仅只是分析服务器的内存分配和gc信息，强烈推荐，先用jmap导出服务器端的jvm的堆dump文件，然后再用jhat，或者jvisualvm，或者eclipse内存分析器来分析内存状况。





转自[http://jameswxx.iteye.com/blog/731763](http://jameswxx.iteye.com/blog/731763)     