Java中用2种方法处理异常：

1.在发生异常的地方直接处理；

2.将异常抛给调用者,让调用者处理。

Java异常可分为3种：

　　(1)编译时异常:Java.lang.Exception

　　(2)运行期异常:Java.lang.RuntimeException

　　(3)错误:Java.lang.Error

Java.lang.Exception和Java.lang.Error继承自Java.lang.Throwable;

Java.lang.RuntimeException继承自Java.lang.Exception.

编译时异常： 程序正确，但因为外在的环境条件不满足引发。例如：用户错误及I/O问题----程序试图打开一个并不存在的远程Socket端口。这不是程序本身的逻辑错误，而很可能是远程机器名字错误(用户拼写错误)。对商用软件系统，程序开发者必须考虑并处理这个问题。Java编译器强制要求处理这类异常，如果不捕获这类异常，程序将不能被编译。

运行期异常： 这意味着程序存在bug，如数组越界，0被除，入参不满足规范.....这类异常需要更改程序来避免，Java编译器强制要求处理这类异常。

错误： 一般很少见，也很难通过程序解决。它可能源于程序的bug，但一般更可能源于环境问题，如内存耗尽。错误在程序中无须处理，而有运行环境处理。

来源： <[http://www.linuxidc.com/Linux/2009-11/23008.htm](http://www.linuxidc.com/Linux/2009-11/23008.htm)>

 