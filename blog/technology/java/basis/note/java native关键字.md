native关键字用法

native是与C++联合开发的时候用的！[Java](http://lib.csdn.net/base/java)自己开发不用的！

------

使用native关键字说明这个方法是原生函数，也就是这个方法是用C/C++语言实现的，并且被编译成了DLL，由java去调用。 这些函数的实现体在DLL中，JDK的源代码中并不包含，你应该是看不到的。对于不同的平台它们也是不同的。这也是java的底层机制，实际上java就是在不同的平台上调用不同的native方法实现对操作系统的访问的。

------

native 是用做java 和其他语言（如c++）进行协作时用的 也就是native 后的函数的实现不是用java写的 2。既然都不是java，那就别管它的源代码了，呵呵

------

native的意思就是通知操作系统， 这个函数你必须给我实现，因为我要使用。 所以native关键字的函数都是操作系统实现的， java只能调用。

------

java是跨平台的语言，既然是跨了平台，所付出的代价就是牺牲一些对底层的控制，而java要实现对底层的控制，就需要一些其他语言的帮助，这个就是native的作用了

http://blog.csdn.net/youjianbo_han_87/article/details/2586375