# [修改MySql 数据默认存储路径](http://www.cnblogs.com/SZxiaochun/p/6025740.html)

1.

cmd进入控制台

net stop mysql

2.复制原来数据库目录到新目录

　　复制C:\ProgramData\MySQL\MySQL Server 5.5\中的data目录到
　　D:\Program Files\MySQL\MySQL Server 5.5\目录下（自建的目录）

3.修改MySQL配置文件
　　1、用记事本打开C:\ProgramData\MySQL\MySQL Server 5.5\data\目录下的my.ini
　　找到datadir="C:\ProgramData\MySQL\MySQL Server 5.5\data"
　　在前面加#注释掉
　　在下面添加一行
　　datadir="D:\Program Files\MySQL\MySQL Server 5.5\data"
　　修改完成后，保存退出。

4.修改MySQL配置文件

 复制 C:\ProgramData\MySQL\MySQL Server 5.5\data    文件夹到 D:\Program Files\MySQL\MySQL Server 5.5\data

5.重新启动MySQL
　　开始-cmd
　　net start mysql

6.

　　进入MySQL控制台

　　show variables like ’%datadir%’; #查询MySQL数据库存放目录
　　如查询显示为D:\Program Files\MySQL\MySQL Server 5.5\data\即表示修改成功！

来源： <http://www.cnblogs.com/SZxiaochun/p/6025740.html>