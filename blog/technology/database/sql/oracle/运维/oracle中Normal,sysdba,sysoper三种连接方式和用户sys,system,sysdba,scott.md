Sys具有最大的权限。
Oracle数据库服务器启动后，一般至少有以下几个用户：Internal，它不是一个真实的用户名，
而是具有SYSDBA优先级的Sys用户的别名，它由DBA用户使用来完成数据库的管理任务，包括启动和关闭数据库；
Sys，它是一个 DBA用户名，具有最大的数据库操作权限；System，它也是一个 DBA用户名，权限仅次于 Sys用户。
Oracle里，sys用户和system是一样的么?
 悬赏分：0 - 提问时间2010-10-5 09:57
Oracle里，sys用户和system是一样的么?为什么从dos环境下的sqlpuls和浏览器的EM登录用户名是不一样的呢？
DOS下用system才能登录，EM用sys【SYSDBA】才能登录。在dos下执行select * from V$PWFILE_USERS
（可查询到具有sysdba权限的用户）结果为：  
USERNAME SYSDBA SYSOPER  
SYS TRUE TRUE
SQL>show user 查看当前数据库连接用户  是 system
System不具有sysdba权限？ 
SYS和SYSTEM账号都在系统安装时自动建立，都具有DBA权限。SYS帐号是数据字典表和视图的拥有者，
采用SYSDBA登录数据库的默认SCHEMA都是SYS。

除了基本功能的表和视图，其它功能的表和视图一般都采用SYSTEM账号建立。 
1.sys用户和system不是一样的，sys有最高权限
2.sys登陆要以sysdba身份，Eg: sqlplus sys/mypassword@dbname as sysdba
3.system有sysdba权限

```
 SELECT * FROM DBA_ROLE_PRIVS WHERE GRANTED_ROLE='DBA' ;

GRANTEE  GRANTED_ ADMIN_OP DEFAULT_
-------- -------- -------- --------
SYS      DBA      YES      YES
SYSTEM   DBA      YES      YES 
```

 两个用户权限差不多，群组不一样而已，功能不同。 
oracle和SQL SERVER都是用SQL语句可以编写数据库，但语法有区别，我楼上说的SQL SERVER说不稳定，
也不一定吧～这里我说的都是正版，不过ORACLE确实是现在企业用的多～不过ORACLE可不只是能用JAVA写，
要弄清楚ORACLE和SQL SERVER都是数据库，每个软件都有针数据库编程的语法。
真正编数据库可以用ORACLE中SQL语句来写。而且真正完全用SQL SERVER的功能也不一定是容易。
现在微软的SQL 2000 有一个比较好的特点就是能处理100用户内的并发问题～最新SQL SERVER2005
情况还真没过～它们在国际上价格差不多。 
sys和system用户的区别
【system】用户只能用normal身份登陆em。
【sys】用户具有“SYSDBA”或者“SYSOPER”权限，登陆em也只能用这两个身份，不能用normal。
“SYSOPER”权限，即数据库操作员权限，权限包括：
  打开数据库<nobr>服务器</nobr>   关闭数据库服务器
  备份数据库       恢复数据库
  日志归档         会话限制
“SYSDBA”权限，即数据库管理员权限，权限包括：
  打开数据库服务器   关闭数据库服务器
  备份数据库       恢复数据库
  日志归档       会话限制
  管理功能       创建数据库

normal 、sysdba、 sysoper有什么区别
normal 是普通用户 
另外两个，你考察他们所具有的权限就知道了
sysdba拥有最高的系统权限
sysoper主要用来启动、关闭数据库，sysoper 登陆后用户是 public
sysdba登陆后是 sys
SQL> conn / as sysdba
已连接。
SQL> grant sysoper to test;
授权成功。
SQL> conn test/test as sysoper;
已连接。
SQL> show user
USER 为"PUBLIC"
SQL> conn test/test as sysdba
已连接。
SQL> show user
USER 为"SYS"
SQL>


dba和sysdba的区别
dba、sysdba这两个系统角色有什么区别呢 
在说明这一点之前我需要说一下oracle服务的创建过程
·创建实例
·启动实例
·创建数据库(system表空间是必须的)
启动过程
·实例启动
·装载数据库
·打开数据库
sysdba，是管理oracle实例的，它的存在不依赖于整个数据库完全启动，
只要实例启动了，他就已经存在，以sysdba身份登陆，装载数据库、打开数据库
只有数据库打开了，或者说整个数据库完全启动后，dba角色才有了存在的基础！
