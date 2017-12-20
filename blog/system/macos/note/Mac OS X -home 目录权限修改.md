最近，想把某程序安装到mac下的/home目录下面，发现没有权限，即便是使用sudo命令也无法创建程序目录，在网上查询了半天发现可以通过如下方法来提升mac下/home目录的权限。 
编译/etc/auto_master文件，注释掉或者移除以/home开头的那一行，保存。

```
sudo vim /etc/auto_master
```

注释掉 /home 哪一行，如下所示：

```
## Automounter master map#+auto_master            # Use directory service/net                    -hosts          -nobrowse,hidefromfinder,nosuid#/home                  auto_home       -nobrowse,hidefromfinder/Network/Servers        -fstab/-                      -static
```

保存，为了使其生效，需要执行如下命令

```
sudo automount -vc
```

出现如下信息，则表示修改/home目录权限成功

```
automount: /net updated
automount: /home unmounted
```

现在进入/home目录，执行:

```
sudo mkdir test 
```

test目录 即为你想要在/home下创建的目录。

如果按照上面操作还是不可以 则    reboot 重启下即可

来源： [http://ju.outofmemory.cn/entry/283070](http://ju.outofmemory.cn/entry/283070)