# [Linux改变默认语言设置的命令](http://www.cnblogs.com/shipfi/archive/2008/04/10/1146434.html)

有两种方式可以改变语言设置的命令

## bash_profile方式设置

  Linux中语言的设置和本地化设置真是一个很繁琐的事情，时不时的会出现乱码的情况，在这篇文章中讨论的是shell中出现乱码的一些解决方法.
​    一般来说，linux中显示什么语言是通过环境变量来确认的. 这些环境变量包括：

```
       $LANG / $LANGUAGE / $LC_CTYPE ....
```

​    可以通过locale命令查看这些变量的值.
​    要设置这些变量，可以通过export命令来进行.如：

           # export LANG=uc_EN
           # export LC_CTYPE=c

​    可以把以这些命令加入到~/.bash_profile文件中，这样，就成了默认配置.
​    



## /etc/sysconfig/i18n方式设置

​    另外，文件/etc/sysconfig/i18n  也是可以配置语言选项的.

下面是修改的方法，可以将默认语言改为English：

vi /etc/sysconfig/i18n修改以下三行：

```
LANG="en_US.UTF-8"
SUPPORTED="en_US.UTF-8:en_US:en"
SYSFONT="latarcyrheb-sun16"
```

