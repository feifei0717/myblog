[toc]
# **Docker命令详解**

具体最详细还是查看官网文档： https://docs.docker.com/engine/reference/commandline/commit/#commit-a-container

最近学习Docker，将docker所有命令实验了一番，特整理如下：

## 概述

```shell
# docker --help
Usage: docker [OPTIONS] COMMAND [arg...]
       docker daemon [ --help | ... ]
       docker [ -h | --help | -v | --version ]
A self-sufficient runtime for containers.
Options:
  --config=~/.docker              Location of client config files
  -D, --debug=false               Enable debug mode
  -H, --host=[]                   Daemon socket(s) to connect to
  -h, --help=false                Print usage
  -l, --log-level=info            Set the logging level
  --tls=false                     Use TLS; implied by --tlsverify
  --tlscacert=~/.docker/ca.pem    Trust certs signed only by this CA
  --tlscert=~/.docker/cert.pem    Path to TLS certificate file
  --tlskey=~/.docker/key.pem      Path to TLS key file
  --tlsverify=false               Use TLS and verify the remote
  -v, --version=false             Print version information and quit
Commands:
```

## docker生命周期相关命令：

### info

```
info   Display system-wide information                           
              --查看docker的系统信息
              [root@localhost ~]# docker info
              Containers: 3    --当前有3个容器
              Images: 298      
              Storage Driver: devicemapper
               Pool Name: docker-253:0-34402623-pool
               Pool Blocksize: 65.54 kB
               Backing Filesystem: xfs
               Data file: /dev/loop0
               Metadata file: /dev/loop1
               Data Space Used: 8.677 GB     --对应的是下面Data loop file大小
               Data Space Total: 107.4 GB
               Data Space Available: 5.737 GB
               Metadata Space Used: 13.4 MB  --对应的是下面Metadata loop file大小
               Metadata Space Total: 2.147 GB
               Metadata Space Available: 2.134 GB
               Udev Sync Supported: true
               Deferred Removal Enabled: false
               Data loop file: /var/lib/docker/devicemapper/devicemapper/data
               Metadata loop file: /var/lib/docker/devicemapper/devicemapper/metadata
               Library Version: 1.02.93-RHEL7 (2015-01-28)
              Execution Driver: native-0.2
              Logging Driver: json-file
              Kernel Version: 3.10.0-229.el7.x86_64
              Operating System: CentOS Linux 7 (Core)
              CPUs: 2
              Total Memory: 979.7 MiB
              Name: localhost.localdomain
              ID: TFVB:BXGQ:VVOC:K2DJ:LECE:2HNK:23B2:LEVF:P3IQ:L7D5:NG2V:UKNL
              WARNING: bridge-nf-call-iptables is disabled
              WARNING: bridge-nf-call-ip6tables is disabled
```

### login

```
    login     Register or log in to a Docker registry
              --登录到自己的Docker register，需有Docker Hub的注册账号
              [root@localhost ~]# docker login
              Username: ivictor
              Password: 
              Email: xxxx@foxmail.com
              WARNING: login credentials saved in /root/.docker/config.json
              Login Succeeded
```

### logout

```
    logout    Log out from a Docker registry
              --退出登录
              [root@localhost ~]# docker logout
              Remove login credentials for https://index.docker.io/v1/
```

### version

```
    version   Show the Docker version information 
              --查看docker的版本
```

## 容器管理命令：

### attach

```
   attach    Attach to a running container  
              --将终端依附到容器上
              1> 运行一个交互型容器
                 [root@localhost ~]# docker run -i -t centos /bin/bash
                 [root@f0a02b473067 /]# 
              2> 在另一个窗口上查看该容器的状态
                 [root@localhost ~]# docker ps -a
                 CONTAINER ID        IMAGE               COMMAND             CREATED             STATUS      PORTS       NAMES
                 d4a75f165ce6        centos              "/bin/bash"         5 seconds ago       Up 5 seconds            cranky_mahavira
              3> 退出第一步中运行的容器
                 [root@d4a75f165ce6 /]# exit
                  exit
              4> 查看该容器的状态
                 [root@localhost ~]# docker ps -a
                 CONTAINER ID        IMAGE           COMMAND           CREATED             STATUS                  PORTS    NAMES
                 d4a75f165ce6        centos          "/bin/bash"       2 minutes ago       Exited (0) 23 seconds ago        cranky_mahavira
                 可见此时容器的状态是Exited，那么，如何再次运行这个容器呢？可以使用docker start命令
              5> 再次运行该容器
                 [root@localhost ~]# docker start cranky_mahavira
                 cranky_mahavira
              6> 再次查看该容器的状态
                 [root@localhost ~]# docker ps -a
                 CONTAINER ID        IMAGE          COMMAND             CREATED             STATUS              PORTS      NAMES
                 d4a75f165ce6        centos         "/bin/bash"         6 minutes ago       Up 29 seconds                  cranky_mahavira
                 因为该容器是交互型的，但此刻我们发现没有具体的终端可以与之交互，这时可使用attach命令。
              7> 通过attach命令进行交互
                 [root@localhost ~]# docker attach cranky_mahavira
                 [root@d4a75f165ce6 /]# 
```

### events

```
events    Get real time events from the server
              --实时输出Docker服务器端的事件，包括容器的创建，启动，关闭等。
              譬如：
              [root@localhost ~]# docker events
              2015-09-08T17:40:13.000000000+08:00 d2a2ef5ddb90b505acaf6b59ab43eecf7eddbd3e71f36572436c34dc0763db79: (from wordpress) create
              2015-09-08T17:40:14.000000000+08:00 d2a2ef5ddb90b505acaf6b59ab43eecf7eddbd3e71f36572436c34dc0763db79: (from wordpress) die
              2015-09-08T17:42:10.000000000+08:00 839866a338db6dd626fa8eabeef53a839e4d2e2eb16ebd89679aa722c4caa5f7: (from mysql) start
```

### exec

```
  exec      Run a command in a running container
              --用于容器启动之后，执行其它的任务
              通过exec命令可以创建两种任务：后台型任务和交互型任务
              后台型任务：docker exec -d cc touch 123  其中cc是容器名
              交互型任务：
              [root@localhost ~]# docker exec -i -t cc /bin/bash
              root@1e5bb46d801b:/# ls
              123  bin  boot  dev  etc  home  lib  lib64  media  mnt  opt  proc  root  run  sbin  srv  sys  tmp  usr  var
              OPTIONS说明：
-d :分离模式: 在后台运行
          -i :即使没有附加也保持STDIN 打开
-t :分配一个伪终端
```

### export

```
  export    Export a container's filesystem as a tar archive
              --将容器的文件系统打包成tar文件
              有两种方式：
              docker export -o mysqldb1.tar mysqldb
              docker export mysqldb > mysqldb.tar
```

### inspect

```
   inspect   Return low-level information on a container or image
              --用于查看容器的配置信息，包含容器名、环境变量、运行命令、主机配置、网络配置和数据卷配置等。
```

### kill

```
kill      Kill a running container 
              --强制终止容器
              关于stop和kill的区别，docker stop命令给容器中的进程发送SIGTERM信号，默认行为是会导致容器退出，当然，
              容器内程序可以捕获该信号并自行处理，例如可以选择忽略。而docker kill则是给容器的进程发送SIGKILL信号，该信号将会使容器必然退出。
```

### start

```
start     Start one or more stopped containers              --启动容器
```

Description
Start one or more stopped containers

Usage
docker start [OPTIONS] CONTAINER [CONTAINER...]
Options

| Name, shorthand     | Default | Description                              |
| ------------------- | ------- | ---------------------------------------- |
| `--attach, -a`      | `false` | Attach STDOUT/STDERR and forward signals |
| `--checkpoint`      |         | Restore from this checkpoint             |
| `--checkpoint-dir`  |         | Use a custom checkpoint storage directory |
| `--detach-keys`     |         | Override the key sequence for detaching a container |
| `--interactive, -i` | `false` | Attach container’s STDIN                 |



### stop

```
    stop      Stop a running container               --停止一个运行的容器
```

### stats

```
stats     Display a live stream of container(s) resource usage statistics              --动态显示容器的资源消耗情况，包括：CPU、内存、网络I/O
```

### rename

```
    rename    Rename a container              --更改容器的名字
```

### restart

```
    restart   Restart a running container               --重启容器
```

### rm

```
    rm        Remove one or more containers 
              --删除容器，注意，不可以删除一个运行中的容器，必须先用docker stop或docker kill使其停止。
              当然可以强制删除，必须加-f参数
              如果要一次性删除所有容器，可使用 docker rm -f `docker ps -a -q`，其中，-q指的是只列出容器的ID
```

### top

```
    top       Display the running processes of a container
              --查看容器中正在运行的进程
```

### unpause

```
    unpause   Unpause all processes within a container              --恢复容器内暂停的进程，与pause参数相对应
```

### wait

```
 wait      Block until a container stops, then print its exit code
              --捕捉容器停止时的退出码
              执行此命令后，该命令会“hang”在当前终端，直到容器停止，此时，会打印出容器的退出码。
```

### logs

```
    logs      Fetch the logs of a container
              --用于查看容器的日志，它将输出到标准输出的数据作为日志输出到docker logs命令的终端上。常用于后台型容器
```

### pause

```
    pause     Pause all processes within a container
              --暂停容器内的所有进程，
              此时，通过docker stats可以观察到此时的资源使用情况是固定不变的，
              通过docker logs -f也观察不到日志的进一步输出。
```

### port

```
    port      List port mappings or a specific mapping for the CONTAINER
              --输出容器端口与宿主机端口的映射情况
              譬如：
              [root@localhost ~]# docker port blog
              80/tcp -> 0.0.0.0:80
              容器blog的内部端口80映射到宿主机的80端口，这样可通过宿主机的80端口查看容器blog提供的服务
```

### ps

```
    ps        List containers  
              --列出所有容器，其中docker ps用于查看正在运行的容器，ps -a则用于查看所有容器。
```

### run

```
    run       Run a command in a new container   
              --让创建的容器立刻进入运行状态，该命令等同于docker create创建容器后再使用docker start启动容器
              例如运行mysql为例：docker run --name=mysqlserver -d -i -p 3306:3306 -e MYSQL_ROOT_PASSWORD=123456 mysql 
              命令参数说明
                               --name 给容器起一个别名，可选，如果不指定，则Docker会自动生成不规则的字符串表示
                               -i 指定容器可以交互，有了此选项后，可以使用docker attach等与容器进行交互
                               -p 映射宿主机与容器中服务端口
                               -e 设置容器运行所需要的环境变量
                               -d 在后台运行容器并打印容器ID
                               -v 一个宿主机上的目录挂载到镜像里,具体查看文章：docker run -v 挂载本地目录
```

## 镜像管理命令：

### build

```
 build     Build an image from a Dockerfile
              --通过Dockerfile创建镜像
```

### commit

```
    commit    Create a new image from a container's changes
              --通过容器创建本地镜像
              注意：如果是要push到docker hub中，注意生成镜像的命名
               [root@localhost ~]# docker commit centos_v1 centos:v1
               68ad49c999496cff25fdda58f0521530a143d3884e61bce7ada09bdc22337638
               [root@localhost ~]# docker push centos:v1
               You cannot push a "root" repository. Please rename your repository to <user>/<repo> (ex: <user>/centos)
               用centos:v1就不行，因为它push到docker hub中时，是推送到相应用户下，必须指定用户名。譬如我的用户名是ivictor，则新生成的本地镜像命名为：
               docker push victor/centos:v1，其中v1是tag，可不写，默认是latest 
```

### history

```
    history   Show the history of an image              --显示镜像制作的过程，相当于dockfile
```

### images

```
    images    List images                 --列出本机的所有镜像
```

### import

```
import    Import the contents from a tarball to create a filesystem image
              --根据tar文件的内容新建一个镜像，与之前的export命令相对应
             [root@localhost ~]# docker import mysqldb.tar mysql:v1
             eb81de183cd94fd6f0231de4ff29969db822afd3a25841d2dc9cf3562d135a10
             [root@localhost ~]# docker images
             REPOSITORY                 TAG                 IMAGE ID            CREATED              VIRTUAL SIZE
             mysql                      v1                  eb81de183cd9        21 seconds ago       281.9 MB
```

### load

```
    load      Load an image from a tar archive or STDIN              --与下面的save命令相对应，将下面sava命令打包的镜像通过load命令导入
```

### pull

```
    pull      Pull an image or a repository from a registry              --从docker hub中下载镜像
```

### push

```
    push      Push an image or a repository to a registry
              --将本地的镜像上传到docker hub中
              前提是你要先用docker login登录上，不然会报以下错误
              [root@localhost ~]# docker push ivictor/centos:v1
              The push refers to a repository [docker.io/ivictor/centos] (len: 1)
              unauthorized: access to the requested resource is not authorized
```

### rmi

```
docker rmi [options "o">] <image>  "o">[image...]
docker rmi nginx:latest postgres:latest python:latest
从本地移除一个或多个指定的镜像。
-f 强行移除该镜像，即使其正被使用；
--no-prune 不移除该镜像的过程镜像，默认移除。
```

### save

```
    save      Save an image(s) to a tar archive
              --将镜像打包，与上面的load命令相对应
              譬如：
              docker save -o nginx.tar nginx
```

### search

```
    search    Search the Docker Hub for images                 --从Docker Hub中搜索镜像
```

### tag

```
docker tag : 标记本地镜像，将其归入某一仓库。
语法
docker tag [OPTIONS] IMAGE[:TAG] [REGISTRYHOST/][USERNAME/]NAME[:TAG]
实例
将镜像ubuntu:15.10标记为 runoob/ubuntu:v3 镜像。
root@runoob:~# docker tag ubuntu:15.10 runoob/ubuntu:v3
root@runoob:~# docker images   runoob/ubuntu:v3
REPOSITORY          TAG                 IMAGE ID            CREATED             SIZE
runoob/ubuntu       v3                  4e3b13c8a266        3 months ago        136.3 MB
```

Run 'docker COMMAND –help' for more information on a command. 
来源： <http://www.cnblogs.com/ivictor/p/4791274.html>