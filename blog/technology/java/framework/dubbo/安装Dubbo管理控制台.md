

[TOC]

# 安装Dubbo管理控制台

## 摘要: 

dubbo 管控台可以对注册到 zookeeper 注册中心的服务或服务消费者进行管理，但管控台是否正常对 Dubbo 服务没有影响， 管控台也不需要高可用， 因此可以单节点部署。

## 部署Dubbo管理台

1.  将下载好的管理台war(如：[dubbo-admin-2.5.4.war](http://pan.baidu.com/s/1qYCe1fI)),部署到web容器中。

2.  修改dubbo.properties配置文件。修改到对应的zookeeper(注册中心地址)地址，可以修改管控台登录的密码。zookeeper集群配置参见[zookeeper集群](http://my.oschina.net/longload/blog/736333)

   ```
   dubbo.registry.address=zookeeper://127.0.0.1:2181
   dubbo.admin.root.password=root
   dubbo.admin.guest.password=guest
   ```

   lunix下部署注意容器的端口是否开放

3. 启动容器，出现如下错误

   ```
   context.ContextLoader - Context initialization failed
   ```

   dubbo-admin-2.5.4不支持jdk8，最高支持到jdk1.7.解决方案：

   - 更换jdk版本

   - 修改dubbo-admin tomcat默认jdk版本。

   - 升级使用dubbox的管理台。[https://github.com/dangdangdotcom/dubbox](https://github.com/dangdangdotcom/dubbox) 直接maven打包

     ```
     mvn clean package  -Dmaven.javadoc.skip=true -Dmaven.test.skip=true
     ```

   - 修改dubbo-admin项目依赖（dependency）从新打包可以参照<http://blog.csdn.net/blue_dd/article/details/51298438>


4. 在流量器中输入相应的地址进入。例如：http://127.0.0.1:8080/dubbo-admin-2.5.4

5. 可以在治理->服务中查看相应的应用

转：https://my.oschina.net/longload/blog/717019