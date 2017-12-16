使用示例：

​    sc stop "memcached_11211"

这个资料大家先了解一下，等我看明白了再写几个实例发上来大家讨论！

描述:

​         SC 是用于与服务控制管理器通信的命令行程序。

用法:

​         sc <server> [command] [service name] <option1> <option2>...

​         选项 <server> 的格式为 "\\ServerName"

​         可以键入 "sc [command]"以获得命令的进一步帮助

​         命令:

​           query-----------查询服务的状态，

​                           或枚举服务类型的状态。

​           queryex---------查询服务的扩展状态，

​                           或枚举服务类型的状态。

​           start-----------启动服务。

​           pause-----------发送 PAUSE 控制请求到服务。

​           interrogate-----发送 INTERROGATE 控制请求到服务。

​           continue--------发送 CONTINUE 控制请求到服务。

​           stop------------发送 STOP 请求到服务。

​           config----------(永久地)更改服务的配置。

​           description-----更改服务的描述。

​           failure---------更改服务失败时所进行的操作。

​           qc--------------查询服务的配置信息。

​           qdescription----查询服务的描述。

​           qfailure--------查询失败服务所进行的操作。

​           delete----------(从注册表)删除服务。

​           create----------创建服务(将其添加到注册表)。

​           control---------发送控制到服务。

​           sdshow----------显示服务的安全描述符。

​           sdset-----------设置服务的安全描述符。

​           GetDisplayName--获取服务的 DisplayName。

​           GetKeyName------获取服务的 ServiceKeyName。

​           EnumDepend------枚举服务的依存关系。

​         下列命令不查询服务名称:
​         sc <server> <command> <option>
​           boot------------(ok | bad) 表明是否将上一次启动保存为
​                           最后所知的好的启动配置
​           Lock------------锁定服务数据库
​           QueryLock-------查询 SCManager 数据库的 LockStatus
示例:
​         sc start MyService
通过sc /?查询到sc原来还有这么多子命令，不过我们肯定用不了这么多，经常用到的只有那么几个而已，常用的几个就该就是"start stop config"所以在这里我也就不一一都列出来了，只把提到的三个命令的帮助列一下：
start-----------启动服务。
方法很简单，简单到CMD帮助里都懒得写这些了，但是我还是写写，免得有些朋友不解
用法：sc start 服务名
例如：sc start dhcp
但是这个命令只能够启动一些状态为“手动”的服务，对于已经禁用的服务是无法启动的，已禁用的服务需要用sc config来重新配置方可启动，下面就讲sc config
config----------(永久地)更改服务的配置。
sc config可以更改服务的配置，比如把禁用改为自动或手动还有一些比如工作，注释之类的，这个在cmd下有详细的帮助文档
引用内容
描述:
​         在注册表和服务数据库中修改服务项。
用法:
​         sc <server> config [service name] <option1> <option2>...
选项:
注意: 选项名称包括等号。
type= <own|share|interact|kernel|filesys|rec|adapt>
start= <boot|system|auto|demand|disabled>
error= <normal|severe|critical|ignore>
binPath= <BinaryPathName>
group= <LoadOrderGroup>
tag= <yes|no>
depend= <依存关系(以 / (斜杠) 分隔)>
obj= <AccountName|ObjectName>
DisplayName= <显示名称>
password= <密码>
stop------------发送 STOP 请求到服务。
sc stop和sc start的功能相反，也是由于太简单所以帮助里找不到信息...
方法是sc stop 服务名 它可以停止自动、手动、和已禁止但仍在运行的服务。 
本文转载自『简单男人's Blog』[http://blog.56uc.com/article.asp?id=406](http://jump.bdimg.com/safecheck/index?url=x+Z5mMbGPAvfX76U6h3ijw8KmHdZ7as7h8p6CIEizDUn6MMfYHXFCERd+Zw+1opuG93tj+GxqonrAsFJ/jjqcE3DJin6vI3VNMv8EJk0QK+3kTxPgAPtY/CeL3laM4cvp+zgUtZD27kG7WKNAdaYvHY9qHh6BM0y)
1.服务显示名和注册键的区别，显示名称主要是在外面显示的名字(如上一个Subversion Server)可以用命令msconfig和service.msc来查看
键名的查看，一个是用regedit注册表中HKEY_LOCAL_MACHINE->system->service中去查看
键名和显示名的转化：sc GetKeyName (显示名) ---->由显示名得到键名
​        sc GetDisplayName (键名)---->由键名得到显示名
2.对服务的操作都得由键名来做，显示名称不起作用
3.得到键名后就可以像linux命令service那样来操作服务
服务启动sc start (keyname:example 
服务删除sc delete(keyname:example svn)
等等
4.服务注册(类似与linux中系统启动自动加载的东西)
sc create SVN binpath= "C:Program FilesSubversionbinsvnserve.exe --service -r D:svn" displayname= "Subversion Server" depend= Tcpip start= auto 
其中sc create 是sc 注册命令
svn : 是服务注册时的键名
binpath : 是服务加载程序启动文件的路径和命令参数
displayname ：是服务显示名
depend       ：传输依赖的协议
start        ：是否自动启动
​     说明：上面的那个例子是注册一个svn的服务
5.总结
对于sc的命令，windows不常用，但是在linux下经常用service命令，其实这两个命令都是一样的，通过svn在windows下注册的例子
可以很好的学习这个东西：
通过学习这个命令还可以很好的了解windows的注册表结构，以便很好的了解windows启动时的信息加载
对于这个命令的官方文档：[http://technet.microsoft.com/en-us/library/bb490995.aspx](http://jump.bdimg.com/safecheck/index?url=x+Z5mMbGPAvk142aT8eamJAw/oaSu1FzDFfk9Qa7eLQnp0MuihgZ5MFx74XxJxmJbfslGwSGj4RADvDOOyu4gdWTLfHjtSfcTYPPBvYS5ynrAsFJ/jjqcE3DJin6vI3VNMv8EJk0QK+3kTxPgAPtY/CeL3laM4cvp+zgUtZD27kG7WKNAdaYvHY9qHh6BM0y)可以参考这个
以下补充一条SVN配置的SC命令：
sc create SVN binpath= "d:\svn152\bin\svnserve.exe --service -r D:\svn152" displayname= "Subversion Server" depend= Tcpip start= auto

来源： [http://tieba.baidu.com/p/814278397](http://tieba.baidu.com/p/814278397)