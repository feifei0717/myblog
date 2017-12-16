oracle 远程导入 导出，详细解释

分类: database
日期: 2014-05-10

 

http://blog.chinaunix.net/uid-29632145-id-4247206.html

------

****[oracle 远程导入 导出，详细解释]() *2014-05-10 21:32:06*

分类： Oracle

exp本地导出与imp本地导入

exp命令：
1 exp [username/psw@TEST](mailto:username/psw@TEST) file=d:test.dmp full=y
2 exp [username/psw@TEST](mailto:username/psw@TEST) file=d:test.dmp owner=(ly)
3 exp [username/psw@TEST](mailto:username/psw@TEST) file= d:test.dmp tables=(grid1,grid2) 
1其中一是将Test（与某一数据库对应的oracle服务名）数据库进行整体导出
2将属于用户ly的所有表导出
3将表grid1，与grid2导出
d：test.dmp是导出的文件地址

imp命令：
1 imp [system/psw@TEST](mailto:system/psw@TEST) file=d:test.dmp
2 imp [system/psw@TEST](mailto:system/psw@TEST) full=y file=d:test.dmp ignore=y
3 imp [system/psw@TEST](mailto:system/psw@TEST) file=d:test.dmp tables=(grid1)ignore=y表示如果被导入的数据库中某个表已经存在就忽略不导入那个表
3表示只导入grid1这个表

在导入导出前要先测试下对应的数据库是否是通的：tnsping test来测试，同样test是服务名
所有命令可在cmd下执行

用exp/imp远程操作数据库

对ORACLE数据库进行远程操作，假设数据库在192.168.1.110上，具体方法如下：
一、在客户端创建和服务端对应的服务名
方法1：
修改tnsnames.ora文件
加入远程服务器的命名：

Sql代码 
TEST_ORCL =   
(DESCRIPTION =   
​    (ADDRESS_LIST =   
​      (ADDRESS = (PROTOCOL = TCP)(HOST = 192.168.1.110)(PORT = 1521))   
​    )   
​    (CONNECT_DATA =   
​      (SERVICE_NAME = orcl)   
​    )   
)

方法2：

在oracle客户端，打开net manager。

创建一个服务命名TEST_ORCL，主机IP为：192.168.1.110，服务名orcl，端口1521

二、测试远程服务器是否畅通

进入到cmd后，执行命令:tnsping TEST_ORCL。

三、远程操作数据库
导出：

Sql代码 
1：exp [username/password@TEST_ORCL](mailto:username/password@TEST_ORCL) file=bak_filepath 
2：exp [username/password@TEST_ORCL](mailto:username/password@TEST_ORCL) full=y file=bak_filepath
username 用户名，password 密码，TEST_ORCL 客服端服务名，bak_filepath 备份文件存放的路径

导入：

Sql代码 
1：imp [username/password@TEST_ORCL](mailto:username/password@TEST_ORCL) file=bak_filepath full=y 
2：imp [username/password@TEST_ORCL/database_name](mailto:username/password@TEST_ORCL/database_name) file=bak_filepath full=y 
3：imp [username/password@TEST_ORCL](mailto:username/password@TEST_ORCL) file=bak_filepath fromuser=fromadmin touser=toadmin

username 用户名，password 密码，TEST_ORCL 客服端服务名，bak_filepath 备份文件存放的路径
fromadmin 备份数据的用户名，toadmin 还原数据库的用户名。database_name 还原到那个数据库上

full=y 将数据库整体导出，包括表结构等。

文章出处：DIY部落(<http://www.diybl.com/course/7_databases/oracle/oraclejs/20091103/181048.html>)