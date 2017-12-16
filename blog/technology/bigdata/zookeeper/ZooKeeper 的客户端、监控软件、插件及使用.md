# ZooKeeper 的客户端、监控软件、插件及使用

问题导读：

1.Zookeeper浏览工具

2.安装ZookeeperEclipse插件







有不少公司都会使用ZooKeeper进行集群管理,而且像我们一样经常需要查询ZooKeeper里面的信息来进行精确定位问题。

网上会找到有基于node.js开发的node-zk-browser监控软件（<https://github.com/killme2008/node-zk-browser>），但是对于很多对node.js开发不熟悉的同学来说，部署是个大问题。

## 一、Zookeeper浏览工具

分享一个zk浏览器工具，该工具除了能展示树形结构外，也能展示每个path的属性和数据,而且如果数据是文本的也可以进行编辑。

1.**下载** [https://issues.apache.org/jira/s ... 20/ZooInspector.zip](https://issues.apache.org/jira/secure/attachment/12436620/ZooInspector.zip) (ZooKeeper的贡献模块)

2.**运行** 解压缩后运行命令行 java -jar ZooInspector/build/zookeeper-dev-ZooInspector.jar后会出现以下界面:

3.**连接ZK** 点击左上角的绿色按钮,输入ZK Server的地址和端口，界面如下:

连接成功后就能看到ZK的节点数据信息。

应为本人不使用eclipse，ZK 的eclipse 插件使用方法还没有验证过。

## 二、安装ZookeeperEclipse插件

安装ZooKeeperEclipse插件步骤如下：

Step 1. 在 Eclipse 菜单打开Help -> Install New Software…
Step 2. 添加 url <http://www.massedynamic.org/eclipse/updates/>。
Step 3. 选择插件并安装运行
Step 4. 在 Eclipse 菜单打开Window->Show View->Other…->ZooKeeper 3.2.2。
Step 5. 连接ZK 输入正在运行的ZK server 地址和端口

连接成功后就就可以在Eclipse里查看ZK Server里的节点信息。
另外淘宝有一个开源监控软件貌似不错，[TaoKeeper](http://jm.taobao.org/2012/01/12/zookeeper%E7%9B%91%E6%8E%A7/)正在学习中，学习完了再和大家分享。

摘自：<http://www.wxdl.cn/cloud/zookeeper-look.html>

来源： <http://www.aboutyun.com/thread-7951-1-2.html>