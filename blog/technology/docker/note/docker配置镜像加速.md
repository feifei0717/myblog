## 序

在使用docker下载镜像时，在国内使用官方的Docker registry下载时，有时候巨慢，崩溃中，在经过多次尝试后，遂对人生产生了巨大的失落感和无奈。想想，还是配个加速器玩玩。这里使用[阿里云的镜像加速服务](https://baichuan.taobao.com/doc2/detail.htm?treeId=39&articleId=103049&docType=1)。

## [mac配置步骤](http://tae.taobao.com/mirror/index.html#/docker/speed/stat)

```
boot2docker ssh
sudo su
echo "EXTRA_ARGS=\"--registry-mirror=http://阿里云给你生成的唯一id.mirror.aliyun.com\"" >> /var/lib/boot2docker/profile && exit
exit
boot2docker restart
```

## 其他选择

- [daocloud镜像加载](https://dashboard.daocloud.io/mirror)
  这个要docker-machine版本的才能用，亲自使用了下，速度提升不少，值得推荐，目测比阿里的加速器快很多。

## 体验下速度

```
docker search java:7
docker pull patrickvanamstel/ubuntu-14-10-java-oracle-7
```







来源： https://segmentfault.com/a/1190000004348050