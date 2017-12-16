# 如何在Docker容器内外互相拷贝数据？

 

## 从容器内拷贝文件到主机上

```
docker cp <containerId>:/file/path/within/container /host/path/target  
```

示例：

```
docker cp a2e8b12735e7:/u01/app/oracle /mnt/hgfs/docker/software/oracle/data
```

 

## 从主机上拷贝文件到容器内

参考自：

<http://stackoverflow.com/questions/22907231/copying-files-from-host-to-docker-container>

### 1.用-v挂载主机数据卷到容器内

```
docker run -v /path/to/hostdir:/mnt $container  
在容器内拷贝  
cp /mnt/sourcefile /path/to/destfile 
```

 

### 2.直接在主机上拷贝到容器物理存储系统

 

A. 获取容器名称或者id :

```
$ docker ps
```

 

B. 获取整个容器的id

```
$ docker inspect -f   '{{.Id}}'  步骤A获取的名称或者id 
```

 

C. 在主机上拷贝文件:

```
$ sudo cp path-file-host /var/lib/docker/aufs/mnt/FULL_CONTAINER_ID/PATH-NEW-FILE   
或者  
$ sudo cp path-file-host /var/lib/docker/devicemapper/mnt/123abc<<id>>/rootfs/root  
```

**例子：**

```
$ docker ps  
  
CONTAINER ID      IMAGE    COMMAND       CREATED      STATUS       PORTS        NAMES  
  
d8e703d7e303   solidleon/ssh:latest      /usr/sbin/sshd -D                      cranky_pare  
  
$ docker inspect -f   '{{.Id}}' cranky_pare  
  
or   
$ docker inspect -f   '{{.Id}}' d8e703d7e303  
  
d8e703d7e3039a6df6d01bd7fb58d1882e592a85059eb16c4b83cf91847f88e5  
  
$ sudo cp file.txt /var/lib/docker/aufs/mnt/**d8e703d7e3039a6df6d01bd7fb58d1882e592a85059eb16c4b83cf91847f88e5  
```



### 3.用输入输出符

```
docker run -i ubuntu /bin/bash -c 'cat > /path/to/container/file' < /path/to/host/file/  
```

或者

```
docker exec -it <container_id> bash -c 'cat > /path/to/container/file' < /path/to/host/file/  
```

来源： <http://blog.csdn.net/yangzhenping/article/details/43667785>