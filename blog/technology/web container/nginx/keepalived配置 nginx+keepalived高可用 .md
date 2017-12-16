# keepalived配置 nginx+keepalived高可用 

## 说明：

keepalived 监控两个nginx 一个主，一个备，平时都使用虚拟ip 实际都访问主 的nginx，当主nginx服务器挂了，keepalived可以切换到备库继续服务。 





前提条件已经安装好两个nginx 的两台机器

## 1,安装和配置keepalived

### 安装

yum -y install keepalived

### 设置虚拟主机

为两台已经安装的nginx的机器设置相同虚拟ip

ifconfig eth0:1 192.168.184.190

### 设置主从配置

两台nginx服务器，分别安装keepalived，配置**/etc/keepalived/keepalived.conf**

**主从配置：**

#### 主nginx

修改主nginx下/etc/keepalived/keepalived.conf文件

```
! Configuration File for keepalived

#全局配置
global_defs {
   notification_email {  #指定keepalived在发生切换时需要发送email到的对象，一行一个
     XXX@XXX.com
   }
   notification_email_from XXX@XXX.com  #指定发件人
   #smtp_server XXX.smtp.com                             #指定smtp服务器地址
   #smtp_connect_timeout 30                               #指定smtp连接超时时间
   router_id LVS_DEVEL                                    #运行keepalived机器的一个标识
}

vrrp_instance VI_1 { 
    state MASTER           #标示状态为MASTER 备份机为BACKUP
    interface eth0         #设置实例绑定的网卡
    virtual_router_id 51   #同一实例下virtual_router_id必须相同
    priority 100           #MASTER权重要高于BACKUP 比如BACKUP为99  
    advert_int 1           #MASTER与BACKUP负载均衡器之间同步检查的时间间隔，单位是秒
    authentication {       #设置认证
        auth_type PASS     #主从服务器验证方式
        auth_pass 8888
    }
    virtual_ipaddress {    #设置vip
        192.168.184.190       #可以多个虚拟IP，换行即可
    }
}

```

####  备nginx

修改备nginx下/etc/keepalived/keepalived.conf文件配置备nginx时需要注意：需要修改state为BACKUP , priority比MASTER低，virtual_router_id和master的值一致 

```
! Configuration File for keepalived

#全局配置
global_defs {
   notification_email {  #指定keepalived在发生切换时需要发送email到的对象，一行一个
    XXX@XXX.com
   }
   notification_email_from XXX@XXX.com  				#指定发件人
   #smtp_server XXX.smtp.com                             	#指定smtp服务器地址
   #smtp_connect_timeout 30                               #指定smtp连接超时时间
   router_id LVS_DEVEL                                    #运行keepalived机器的一个标识
}

vrrp_instance VI_1 { 
    state BACKUP           #标示状态为MASTER 备份机为BACKUP
    interface eth0         #设置实例绑定的网卡
    virtual_router_id 51   #同一实例下virtual_router_id必须相同
    priority 99            #MASTER权重要高于BACKUP 比如BACKUP为99  
    advert_int 1           #MASTER与BACKUP负载均衡器之间同步检查的时间间隔，单位是秒
    authentication {       #设置认证
        auth_type PASS     #主从服务器验证方式
        auth_pass 8888
    }
    virtual_ipaddress {    #设置vip
        192.168.184.190       #可以多个虚拟IP，换行即可
    }
}
```

此时如果主机宕机则备机会顶替主机获得虚拟ip







## 2.基于nginx进程死掉的主从切换配置

keepalived是通过检测keepalived进程是否存在判断服务器是否宕机，如果keepalived进程在但是nginx进程不在了那么keepalived是不会做主备切换，所以我们需要写个脚本来监控nginx进程是否存在，如果nginx不存在就将keepalived进程杀掉。

###  检查nginx是否启动脚本

在主nginx上需要编写nginx进程检测脚本（check_nginx.sh），判断nginx进程是否存在，如果nginx不存在就将keepalived进程杀掉，check_nginx.sh内容如下：

```
#!/bin/bash
# 如果进程中没有nginx则将keepalived进程kill掉
A=`ps -C nginx --no-header |wc -l`      ## 查看是否有 nginx进程 把值赋给变量A 
if [ $A -eq 0 ];then                    ## 如果没有进程值得为 零
       service keepalived stop          ## 则结束 keepalived 进程
fi
 
```

将check_nginx.sh拷贝至/etc/keepalived下，

注意修改/etc/keepalived/check_nginx.sh的可执行权限

修改主nginx的keepalived.conf，添加脚本定义检测：

### keepalived配置调用检查脚本

注意下边 （添加检查nginx线程）备注的2个地方：

```
#全局配置
global_defs {
   notification_email {  #指定keepalived在发生切换时需要发送email到的对象，一行一个
     XXX@XXX.com
   }
   notification_email_from miaoruntu@itcast.cn  #指定发件人
   #smtp_server XXX.smtp.com                             #指定smtp服务器地址
   #smtp_connect_timeout 30                               #指定smtp连接超时时间
   router_id LVS_DEVEL                                    #运行keepalived机器的一个标识
}

#添加检查nginx线程
vrrp_script check_nginx {
    script "/etc/keepalived/check_nginx.sh"         ##监控脚本
    interval 2                                      ##时间间隔，2秒
    weight 2                                        ##权重
}
vrrp_instance VI_1 {
    state MASTER           #标示状态为MASTER 备份机为BACKUP
    interface eth0         #设置实例绑定的网卡
    virtual_router_id 51   #同一实例下virtual_router_id必须相同
    priority 100           #MASTER权重要高于BACKUP 比如BACKUP为99
    advert_int 1           #MASTER与BACKUP负载均衡器之间同步检查的时间间隔，单位是秒
    authentication {       #设置认证
        auth_type PASS     #主从服务器验证方式
        auth_pass 8888
    }
    
   #添加检查nginx线程
   track_script {
        check_nginx        #监控脚本
   }
    virtual_ipaddress {    #设置vip
        192.168.184.190       #可以多个虚拟IP，换行即可
    }

}
```

 

### 测试

修改后重启keepalived

 service  keepalived  restart

浏览器访问http://192.168.184.190/

关闭主库nginx 在访问试试

service  nginx stop

