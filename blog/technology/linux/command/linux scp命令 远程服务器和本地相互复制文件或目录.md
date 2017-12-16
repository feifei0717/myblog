# linux scp命令 远程服务器和本地相互复制文件或目录



scp是secure copy的简写，用于在Linux下进行远程拷贝文件的命令，和它类似的命令有cp，不过cp只是在本机进行拷贝不能跨服务器，而且scp传输是加密的。可能会稍微影响一下速度。当你服务器硬盘变为只读 read only system时，用scp可以帮你把文件移出来。另外，scp还非常不占资源，不会提高多少系统负荷，在这一点上，rsync就远远不及它了。虽然 rsync比scp会快一点，但当小文件众多的情况下，rsync会导致硬盘I/O非常高，而scp基本不影响系统正常使用。

## 1．命令格式：

scp [参数]\[原路径\][目标路径]

## 2．命令功能：

scp是 secure copy的缩写, scp是linux系统下基于ssh登陆进行安全的远程文件拷贝命令。linux的scp命令可以在linux服务器之间复制文件和目录。

## 3．命令参数：

-1  强制scp命令使用协议ssh1  

-2  强制scp命令使用协议ssh2  

-4  强制scp命令只使用IPv4寻址  

-6  强制scp命令只使用IPv6寻址  

-B  使用批处理模式（传输过程中不询问传输口令或短语）  

-C  允许压缩。（将-C标志传递给ssh，从而打开压缩功能）  

-p 保留原文件的修改时间，访问时间和访问权限。  

-q  不显示传输进度条。  

-r  递归复制整个目录。  

-v 详细方式显示输出。scp和ssh(1)会显示出整个过程的调试信息。这些信息用于调试连接，验证和配置问题。   

-c cipher  以cipher将数据传输进行加密，这个选项将直接传递给ssh。   

-F ssh_config  指定一个替代的ssh配置文件，此参数直接传递给ssh。  

-i identity_file  从指定文件中读取传输时使用的密钥文件，此参数直接传递给ssh。    

-l limit  限定用户所能使用的带宽，以Kbit/s为单位。     

-o ssh_option  如果习惯于使用ssh_config(5)中的参数传递方式，   

-P port  注意是大写的P, port是指定数据传输用到的端口号   

-S program  指定加密传输时所使用的程序。此程序必须能够理解ssh(1)的选项。

## 4．使用实例：

scp命令的实际应用概述：  

从本地服务器复制到远程服务器： 

 (1) 复制文件：  

命令格式：  

scp local_file remote_username@remote_ip:remote_folder  

或者  

scp local_file remote_username@remote_ip:remote_file  

或者  

scp local_file remote_ip:remote_folder  

或者  

scp local_file remote_ip:remote_file  

第1,2个指定了用户名，命令执行后需要输入用户密码，第1个仅指定了远程的目录，文件名字不变，第2个指定了文件名  

第3,4个没有指定用户名，命令执行后需要输入用户名和密码，第3个仅指定了远程的目录，文件名字不变，第4个指定了文件名   

 (2) 复制目录：  

命令格式：  

scp -r local_folder remote_username@remote_ip:remote_folder  

或者  

scp -r local_folder remote_ip:remote_folder  

第1个指定了用户名，命令执行后需要输入用户密码；  

第2个没有指定用户名，命令执行后需要输入用户名和密码；

  

**从远程服务器复制到本地服务器**： 

从远程复制到本地的scp命令与上面的命令雷同，只要将从本地复制到远程的命令后面2个参数互换顺序就行了。

### 实例1：从远处复制文件到本地目录

命令：

scp root@192.168.120.204:/opt/soft/nginx-0.5.38.tar.gz /opt/soft/

输出：

```
[root@localhost ~]# cd /opt/soft/
[root@localhost soft]# ll
总计 80072
drwxr-xr-x 12 root root     4096 09-21 18:40 fms3.5
drwxr-xr-x  3 root root     4096 09-21 17:58 fms4.5
drwxr-xr-x 10 root root     4096 10-30 17:15 jdk1.6.0_16
drwxr-xr-x 10 root root     4096 09-17 19:27 jdk1.6.0_16.bak
-rwxr-xr-x  1 root root 81871260 2009-12-21 jdk-6u16-linux-x64.bin
drwxrwxrwx  2 root root     4096 09-21 01:16 mysql
drwxr-xr-x  3 root root     4096 09-21 18:40 setup_file
drwxr-xr-x  9 root root     4096 09-17 19:23 tomcat6.0.32
drwxr-xr-x  9 root root     4096 2012-08-14 tomcat_7.0
[root@localhost soft]# scp root@192.168.120.204:/opt/soft/nginx-0.5.38.tar.gz /opt/soft/
root@192.168.120.204's password: 
nginx-0.5.38.tar.gz                                                                               100%  479KB 478.7KB/s   00:00    
[root@localhost soft]# ll
总计 80556
drwxr-xr-x 12 root root     4096 09-21 18:40 fms3.5
drwxr-xr-x  3 root root     4096 09-21 17:58 fms4.5
drwxr-xr-x 10 root root     4096 10-30 17:15 jdk1.6.0_16
drwxr-xr-x 10 root root     4096 09-17 19:27 jdk1.6.0_16.bak
-rwxr-xr-x  1 root root 81871260 2009-12-21 jdk-6u16-linux-x64.bin
drwxrwxrwx  2 root root     4096 09-21 01:16 mysql
-rw-r--r--  1 root root   490220 03-15 09:11 nginx-0.5.38.tar.gz
drwxr-xr-x  3 root root     4096 09-21 18:40 setup_file
drwxr-xr-x  9 root root     4096 09-17 19:23 tomcat6.0.32
drwxr-xr-x  9 root root     4096 2012-08-14 tomcat_7.0
[root@localhost soft]# 
```



说明：

从192.168.120.204机器上的/opt/soft/的目录中下载nginx-0.5.38.tar.gz 文件到本地/opt/soft/目录中

### 实例2：从远处复制到本地

命令：

scp -r root@192.168.120.204:/opt/soft/mongodb /opt/soft/

输出：

```
[root@localhost soft]# ll
总计 80556
drwxr-xr-x 12 root root     4096 09-21 18:40 fms3.5
drwxr-xr-x  3 root root     4096 09-21 17:58 fms4.5
drwxr-xr-x 10 root root     4096 10-30 17:15 jdk1.6.0_16
drwxr-xr-x 10 root root     4096 09-17 19:27 jdk1.6.0_16.bak
-rwxr-xr-x  1 root root 81871260 2009-12-21 jdk-6u16-linux-x64.bin
drwxrwxrwx  2 root root     4096 09-21 01:16 mysql
-rw-r--r--  1 root root   490220 03-15 09:11 nginx-0.5.38.tar.gz
drwxr-xr-x  3 root root     4096 09-21 18:40 setup_file
drwxr-xr-x  9 root root     4096 09-17 19:23 tomcat6.0.32
drwxr-xr-x  9 root root     4096 2012-08-14 tomcat_7.0
[root@localhost soft]# scp -r root@192.168.120.204:/opt/soft/mongodb /opt/soft/
root@192.168.120.204's password: 
mongodb-linux-i686-static-1.8.5.tgz                                                               100%   28MB  28.3MB/s   00:01    
README                                                                                            100%  731     0.7KB/s   00:00    
THIRD-PARTY-NOTICES                                                                               100% 7866     7.7KB/s   00:00    
mongorestore                                                                                      100% 7753KB   7.6MB/s   00:00    
mongod                                                                                            100% 7760KB   7.6MB/s   00:01    
mongoexport                                                                                       100% 7744KB   7.6MB/s   00:00    
bsondump                                                                                          100% 7737KB   7.6MB/s   00:00    
mongofiles                                                                                        100% 7748KB   7.6MB/s   00:01    
mongostat                                                                                         100% 7808KB   7.6MB/s   00:00    
mongos                                                                                            100% 5262KB   5.1MB/s   00:01    
mongo                                                                                             100% 3707KB   3.6MB/s   00:00    
mongoimport                                                                                       100% 7754KB   7.6MB/s   00:00    
mongodump                                                                                         100% 7773KB   7.6MB/s   00:00    
GNU-AGPL-3.0                                                                                      100%   34KB  33.7KB/s   00:00    
[root@localhost soft]# ll
总计 80560
drwxr-xr-x 12 root root     4096 09-21 18:40 fms3.5
drwxr-xr-x  3 root root     4096 09-21 17:58 fms4.5
drwxr-xr-x 10 root root     4096 10-30 17:15 jdk1.6.0_16
drwxr-xr-x 10 root root     4096 09-17 19:27 jdk1.6.0_16.bak
-rwxr-xr-x  1 root root 81871260 2009-12-21 jdk-6u16-linux-x64.bin
drwxr-xr-x  3 root root     4096 03-15 09:18 mongodb
drwxrwxrwx  2 root root     4096 09-21 01:16 mysql
-rw-r--r--  1 root root   490220 03-15 09:11 nginx-0.5.38.tar.gz
drwxr-xr-x  3 root root     4096 09-21 18:40 setup_file
drwxr-xr-x  9 root root     4096 09-17 19:23 tomcat6.0.32
drwxr-xr-x  9 root root     4096 2012-08-14 tomcat_7.0
[root@localhost soft]# 
```

说明：

从192.168.120.204机器上的/opt/soft/中下载mongodb 目录到本地的/opt/soft/目录来。

### 实例3：上传本地文件到远程机器指定目录

命令：

scp /opt/soft/nginx-0.5.38.tar.gz root@192.168.120.204:/opt/soft/scptest

输出：

```
上传前目标机器的目标目录：
[root@localhost soft]# cd scptest/
[root@localhost scptest]# ll
总计 0
[root@localhost scptest]# ll

本地机器上传：
[root@localhost soft]# scp /opt/soft/nginx-0.5.38.tar.gz root@192.168.120.204:/opt/soft/scptest
root@192.168.120.204's password: 
nginx-0.5.38.tar.gz                                                                               100%  479KB 478.7KB/s   00:00    
[root@localhost soft]# 

上传后目标机器的目标目录：
[root@localhost scptest]# ll
总计 484
-rw-r--r-- 1 root root 490220 03-15 09:25 nginx-0.5.38.tar.gz
[root@localhost scptest]#
```

说明：

复制本地opt/soft/目录下的文件nginx-0.5.38.tar.gz 到远程机器192.168.120.204的opt/soft/scptest目录

### 实例4：上传本地目录到远程机器指定目录

命令：

scp -r /opt/soft/mongodb root@192.168.120.204:/opt/soft/scptest

输出：

```
上传前目标机器的目标目录：
[root@localhost ~]# cd /opt/soft/scptest/
[root@localhost scptest]# ll
总计 484
-rw-r--r-- 1 root root 490220 03-15 09:25 nginx-0.5.38.tar.gz
[root@localhost scptest]# 
本地机器上传：
[root@localhost ~]# scp -r /opt/soft/mongodb root@192.168.120.204:/opt/soft/scptest
root@192.168.120.204's password: 
mongodb-linux-i686-static-1.8.5.tgz                                                               100%   28MB  28.3MB/s   00:01    
README                                                                                            100%  731     0.7KB/s   00:00    
THIRD-PARTY-NOTICES                                                                               100% 7866     7.7KB/s   00:00    
mongorestore                                                                                      100% 7753KB   7.6MB/s   00:00    
mongod                                                                                            100% 7760KB   7.6MB/s   00:01    
mongoexport                                                                                       100% 7744KB   7.6MB/s   00:00    
bsondump                                                                                          100% 7737KB   7.6MB/s   00:00    
mongofiles                                                                                        100% 7748KB   7.6MB/s   00:00    
mongostat                                                                                         100% 7808KB   7.6MB/s   00:01    
mongos                                                                                            100% 5262KB   5.1MB/s   00:00    
mongo                                                                                             100% 3707KB   3.6MB/s   00:00    
mongoimport                                                                                       100% 7754KB   7.6MB/s   00:01    
mongodump                                                                                         100% 7773KB   7.6MB/s   00:00    
GNU-AGPL-3.0                                                                                      100%   34KB  33.7KB/s   00:00    
[root@localhost ~]# 

上传后目标机器的目标目录：
[root@localhost scptest]# ll
总计 488
drwxr-xr-x 3 root root   4096 03-15 09:33 mongodb
-rw-r--r-- 1 root root 490220 03-15 09:25 nginx-0.5.38.tar.gz
[root@localhost scptest]# 
```

说明：

​	    上传本地目录 /opt/soft/mongodb到远程机器192.168.120.204上/opt/soft/scptest的目录中去

[原路径]: 