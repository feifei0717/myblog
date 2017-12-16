# ssh远程连接docker中的container

由于工作需要，要远程连接container，本地机器是windows，以下为解决步骤：

## **1. 环境**

   本地：Windows

​              ↓

   docker版本1.12

​              ↓

   远程：docker中的Container（Ubuntu）

## **2. Container安装ssh服务**

首先进入Container，进行以下步骤：

① 安装ssh

```
sudo apt-get install openssh-server #安装ssh服务器  
service ssh status # 查看ssh服务启动情况  
service ssh start # 启动ssh服务  
```

② 配置ssh，允许root登陆

```
vi /eifcontc/ssh/sshd_config  
将PermitRootLogin的值从withoutPassword改为yes 
```

③ 重启ssh服务

```
service ssh restart # 重启动ssh服务
```

 

## 3. 保存Container镜像

另外开启Docker Quickstart Terminal，保存镜像

```
docker ps #查看正在运行的container  
**找到所要保存的container的container id，假设为xxxxxx**  
docker commit xxxxxxxx tomjerry/foobar  
（注：tomjerry/foobar为要保存的新镜像的名字，可任意写）  
```

  

## **4. 重新运行Container**

```
docker run -it -p 50001:22 tomjerry/foobar /bin/bash  
service ssh start  
```

注意-p 50001:22这句，意思是将docker的50001端口和container的22端口绑定，这样访问docker的50001等价于访问container的22端口

## **5. ssh连接container**

你可以用xshell或putty等ssh客户端工具连接container

首先假设各方的ip如下：

```
本地windows ip： 192.168.99.1  
docker ip：192.168.99.100  
container ip：172.17.0.3  
```

那么，你要远程container，则要访问以下地址：

```
ssh 192.168.99.100:50001  
```

这样通过访问docker的50001端口，就神奇的间接连通到container的22端口了，从而达到ssh连接container的目的，至此。







http://blog.csdn.net/vincent2610/article/details/52490397