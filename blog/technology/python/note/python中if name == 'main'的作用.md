# python中if __name__ == '__main__'的作用

当你打开一个.py文件时,经常会在代码的最下面看到if __name__ == '__main__':,现在就来介 绍一下它的作用.

​        模块是对象，并且所有的模块都有一个内置属性 __name__。一个模块的 __name__ 的值取决于您如何应用模块。如果 import 一个模块，那么模块__name__ 的值通常为模块文件名，不带路径或者文件扩展名。但是您也可以像一个标准的程序样直接运行模块，在这 种情况下, __name__ 的值将是一个特别缺省"__main__"。

///////////////////////////////////////////////////////////////////////////////////////////////////

在cmd 中直接运行.py文件,则__name__的值是'__main__';

而在import 一个.py文件后,__name__的值就不是'__main__'了;

**从而用if name == 'main'来判断是否是在直接运行该.py文件**

如:

\#Test.py

class Test:

​    def __init(self):pass

​    def f(self):print 'Hello, World!'

if __name__ == '__main__':

​    Test().f()

\#End

 

你在cmd中输入:

C:>python Test.py

Hello, World!

说明:"__name__ == '__main__'"是成立的

 

你再在cmd中输入:

C:>python

\>>>import Test

\>>>Test.__name__                #Test模块的__name__

'Test'

\>>>__name__                       #当前程序的__name__

'__main__'

无论怎样,Test.py中的"__name__ == '__main__'"都不会成立的!

所以,下一行代码永远不会运行到!

//////////////////////////////////////////////////////////////////////////////////



http://www.cnblogs.com/xuxm2007/archive/2010/08/04/1792463.html