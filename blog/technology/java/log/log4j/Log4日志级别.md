### [Log4 日志级别](http://michales003.iteye.com/blog/1160605)



日志记录器(Logger)是日志处理的核心组件。log4j具有5种正常级别(Level)。: 

1.static Level DEBUG : 

DEBUG Level指出细粒度信息事件对调试应用程序是非常有帮助的。 

2.static Level INFO 

INFO level表明 消息在粗粒度级别上突出强调应用程序的运行过程。 

3.static Level WARN 

WARN level表明会出现潜在错误的情形。 

4.static Level ERROR 

ERROR level指出虽然发生错误事件，但仍然不影响系统的继续运行。

 
5.static Level FATAL 

FATAL level指出每个严重的错误事件将会导致应用程序的退出。 

另外，还有两个可用的特别的日志记录级别: 

1.static Level ALL 

ALL Level是最低等级的，用于打开所有日志记录。 
2.static Level OFF 

OFF Level是最高等级的，用于关闭所有日志记录。 
日志记录器（Logger）的行为是分等级的： 
分为OFF、FATAL、ERROR、WARN、INFO、DEBUG、ALL或者您定义的级别。Log4j建议只使用四个级别，优先级从高到低分别是 ERROR、WARN、INFO、DEBUG。通过在这里定义的 
级别，您可以控制到应用程序中相应级别的日志信息的开关。比如在这里定义了INFO级别， 则应用程序中所有DEBUG级别的日志信息将不被打印出来。



 

优先级高的将被打印出来。项目上生产环境时候一定得把debug的日志级别重新调为warn或者更高，避免产生大量日志。





trace： 是追踪，就是程序推进以下，你就可以写个trace输出，所以trace应该会特别多，不过没关系，我们可以设置最低日志级别不让他输出。

debug： 调试么，我一般就只用这个作为最低级别，trace压根不用。是在没办法就用eclipse或者idea的debug功能就好了么。

info： 输出一下你感兴趣的或者重要的信息，这个用的最多了。

warn： 有些信息不是错误信息，但是也要给程序员的一些提示，类似于eclipse中代码的验证不是有error 和warn（不算错误但是也请注意，比如以下depressed的方法）。

error： 错误信息。用的也比较多。

fatal： 级别比较高了。重大错误，这种级别你可以直接停止程序了，是不应该出现的错误么！不用那么紧张，其实就是一个程度的问题。





来源： http://michales003.iteye.com/blog/1160605

 