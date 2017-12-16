# HotSpot是什么？ 

## 1.HotSpot历史 

​    SUN的JDK版本从1.3.1开始运用HotSpot虚拟机， 2006年底开源，主要使用C++实现，JNI接口部分用C实现。 
​    HotSpot是较新的Java虚拟机，用来代替JIT(Just in Time)，可以大大提高Java运行的性能。 
​    Java原先是把源代码编译为字节码在虚拟机执行，这样执行速度较慢。而HotSpot将常用的部分代码编译为本地(原生，native)代码，这样显着提高了性能。  
​    HotSpot JVM 参数可以分为规则参数(standard options)和非规则参数(non-standard options)。 
​    规则参数相对稳定，在JDK未来的版本里不会有太大的改动。     非规则参数则有因升级JDK而改动的可能。 
​    规则和非规则参数这里不做介绍了，网上资料很多。   

## 2.HotSpot基础知识 

​    HotSpot包括一个解释器和两个编译器（client 和 server，二选一的），解释与编译混合执行模式，默认启动解释执行。 
​    编译器：java源代码被编译器编译成class文件（字节码），java字节码在运行时可以被动态编译（JIT）成本地代码(前提是解释与编译混合执行模式且虚拟机不是刚启动时)。     解释器： 解释器用来解释class文件（字节码），java是解释语言（书上这么说的）。     server启动慢，占用内存多，执行效率高，适用于服务器端应用； 
​    client启动快，占用内存小，执行效率没有server快，默认情况下不进行动态编译，适用于桌面应用程序。 
​    由-XX:+RewriteFrequentPairs参数控制  client模式默认关闭，server模式默认开启     在jre安装目录下的lib/i386/jvm.cfg 文件下。     
   java -version 
  Java HotSpot(TM) Client VM (build 14.3-b01, mixed mode, sharing)    mixed mode 解释与编译 混合的执行模式 默认使用这种模式   
   java -Xint -version 
   Java HotSpot(TM) Client VM (build 14.3-b01, interpreted mode, sharing)    interpreted  纯解释模式 禁用JIT编译   
   java -Xcomp -version 
   Java HotSpot(TM) Client VM (build 14.3-b01, compiled mode, sharing) 
   compiled  纯编译模式（如果方法无法编译，则回退到解释模式执行无法编译的方法）     

## 3.动态编译 

​      动态编译(compile during run-time)，英文称Dynamic compilation；Just In Time也是这个意思。 
​      HotSpot对bytecode的编译不是在程序运行前编译的，而是在程序运行过程中编译的。       HotSpot里运行着一个监视器（Profile Monitor），用来监视程序的运行状况。 
​      **java字节码（class文件）是以解释的方式被加载到虚拟机中(默认启动时解释执行)。 程序运行过程中，那一部分运用频率大，那些对程序的性能影响重要。对程序运行效率影响**

```
  wk_ad_begin({pid : 21});wk_ad_after(21, function(){$('.ad-hidden').hide();}, function(){$('.ad-hidden').show();});    
```

**大的代码，称为热点（hotspot），HotSpot会把这些热点动态地编译成机器码（native code），同时对机器码进行优化，从而提高运行效率。对那些较少运行的代码，HotSpot就不会把他们编译。** 
​ 

HotSpot对字节码有三层处理：

​	1. 不编译(字节码加载到虚拟机中时的状态。也就是当虚拟机执行的时候再编译)，

​	2. 编译(把字节码编译成本地代码。虚拟机执行的时候已经编译好了，不要再编译了)，

​	3. 编译并优化（不但把字节码编译成本地代码，而且还进行了优化）。 
至于那些程序那些不编译，那些编译，那些优化，则是由监视器（Profile Monitor）决定。   

4.为什么不静态编译那？ 
​    为什么字节码在装载到虚拟机之前就编译成本地代码那？      动态编译器也在许多方面比静态编译器优越。静态编译器通常很难准确预知程序运行过程中究竟什么部分最需要优化。 
​    函数调用都是很浪费系统时间的，因为有许多进栈出栈操作。因此有一种优化办法，就是把原来的函数调用，通过编译器的编译，改成非函数调用，把函数代码直接嵌到调用出，变成顺序执行。 
​    面向对象的语言支持多态，静态编译无效确定程序调用哪个方法，因为多态是在程序运行中确定调用哪个方法。





**Java 也没必要编译成本地指令后再运行的，JVM 对于一些数据做了很多的优化，像 int 在 HotSpot 上就做了高度的优化，Java 中对于 int 的操作比 C 语言的还要快。**





 

http://blog.chinaunix.net/uid-29632145-id-4612668.html