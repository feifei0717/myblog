# [Linux系统下安装rz/sz命令及使用说明](http://blog.csdn.net/kobejayandy/article/details/13291655)

对于经常使用Linux系统的人员来说，少不了将本地的文件上传到服务器或者从服务器上下载文件到本地，rz / sz命令很方便的帮我们实现了这个功能，但是很多Linux系统初始并没有这两个命令。今天，我们就简单的讲解一下如何安装和使用rz、sz命令。

### 1.软件安装

root 账号登陆后，依次执行以下命令：

```
cd /tmp
wget http://www.ohse.de/uwe/releases/lrzsz-0.12.20.tar.gz
tar zxvf lrzsz-0.12.20.tar.gz && cd lrzsz-0.12.20
./configure && make && make install

```

​      上面安装过程默认把lsz和lrz安装到了/usr/local/bin/目录下，现在我们并不能直接使用，下面创建软链接，并命名为rz/sz：

```
cd /usr/bin
ln -s /usr/local/bin/lrz rz
ln -s /usr/local/bin/lsz sz

```

### 2.使用说明

​      sz命令发送文件到本地：

```
 # sz filename
```

​      rz命令本地上传文件到服务器：

```
# rz
```

​      执行该命令后，在弹出框中选择要上传的文件即可。
​      说明：打开SecureCRT软件 -> Options -> session options -> X/Y/Zmodem 下可以设置上传和下载的目录。

来源： [http://blog.csdn.net/kobejayandy/article/details/13291655](http://blog.csdn.net/kobejayandy/article/details/13291655)