# Python 两种运行方式

Python运行方式有两种：通过python命令和直接运行python文件 

## 1、通过python命令 

编写正确的python程序，例如hello.py，保存在桌面上。打开Mac命令行，在命令行中改变路径到hello.py所在的目录，最后在命令行中输入 python hello.py,即可运行python程序。其中python为一条命令，表示运行python程序，紧跟在后面就是要运行的程序。 

## 2、直接运行python程序 

直接运行python程序，是指不通过python命令而直接运行程序。通过在python程序的首行添加`#!/usr/bin/env python` 指定python的解释器，然后通过`chmod a+x hello.py` 就可以直接运行python程序了。 
但是这种方式只能在Mac和Linux上可以，在windows是不行。其中`chmod a+x hello.py` 表示将hello.py的运行权限交给该文件的所有者，该所有者所在的群体和其他人（全部人），最后在命令行中**根据目前所在的目录输入hello.py的路径**运行python程序即可。

 



http://blog.csdn.net/LiuY_ang/article/details/74164337