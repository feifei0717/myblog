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

来源： http://michales003.iteye.com/blog/1160605

 