## 安装 Node.js

由于 GitBook 是基于 [node.js](http://lib.csdn.net/base/nodejs) 开发的，所以依赖 Node.[js](http://lib.csdn.net/base/javascript) 环境。如果您的系统中还未安装 Node.js，请点击下面的链接，根据你所使用的系统下载对应的版本。如果已安装则略过本步骤。

Node.js 下载页面：<https://nodejs.org/en/download/>

Windows 版和 Mac 版的 Node.js 都是常规的安装包，连续下一步安装即可。Lunix 版可以参照[官方文档](https://nodejs.org/en/download/package-manager/)通过 yum、apt-get 之类的工具安装，也可以通过源码包安装，如下所示：

```
$ wget https://nodejs.org/dist/v5.4.1/node-v5.4.1.tar.gz
$ tar zxvf node-v5.4.1.tar.gz
$ cd node-v5.4.1
$ ./configure
$ make
$ make install
```





安装好查看版本号：

```
jerrydeMacBookPro:gitbook jerryye$ node -v
v6.11.2
```

