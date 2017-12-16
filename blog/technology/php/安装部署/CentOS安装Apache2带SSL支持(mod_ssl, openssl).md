# CentOS安装Apache2带SSL支持(mod_ssl, openssl)

分类: php
日期: 2015-03-13

原文地址: 

http://blog.chinaunix.net/uid-29632145-id-4889778.html

------

****[CentOS安装Apache2带SSL支持(mod_ssl, openssl)]() *2015-03-13 18:02:17*

分类： PHP

下面是介绍源码安装[Apache](https://www.centos.bz/category/web-server/apache/)并配置ssl支持的教程。

### 安装所需软件包

1. yum -y install gcc openssl openssl-devel

### 下载Apache源码

到http://httpd.apache.org/下载最新稳定版的源码，现在最新稳定版是2.2.21。

1. cd ~
2. wget http://apache.deathculture.net//httpd/httpd-2.2.21.tar.gz
3. tar xvfz httpd-2.2.21.tar.gz

### 安装Apache支持SSL/TLS

1. cd httpd-2.2.21
2. ./configure --prefix=/usr/local/apache2 --enable-so --enable-ssl=shared --enable-mods-shared=all --with-ssl=/etc/ssl
3. make
4. make install

提示：默认安装路径为 /usr/local/apache2，如果你想改变路径，在./configure命令中使用–prefix自定义。

### 配置httpd.conf运行ssl

1. vi /usr/local/apache2/conf/httpd.conf

然后取消Include conf/extra/httpd-ssl.conf的注释。
ssl配置文件在/usr/local/apache2/conf/extra/httpd-ssl.conf，默认就行，不需要更改。
httpd-ssl.conf配置文件显示，需要server.crt和server.key两个文件，下面来介绍如何生成。

### 创建server.crt和server.key

首先，使用openssl生成server.key。

1. cd ~
2. openssl genrsa -des3 -out server.key 1024

执行以上的命令会要求输入密码，请记住这个密码，后面的设置需要到。
下一步是使用上面生成的server.key文件创建server.csr证书文件。

1. openssl req -new -key server.key -out server.csr

最后，根据上面的server.key和server.csr两个文件生成私人签名的server.crt证书。

1. openssl x509 -req -days 365 -in server.csr -signkey server.key -out server.crt

### 复制server.key和server.crt文件

1. cd ~
2. cp server.key /usr/local/apache2/conf/
3. cp server.crt /usr/local/apache2/conf/

### 启动apache并验证ssl

1. /usr/local/apache2/bin/apachectl start

接着会要求输入上面设置的私人密钥的密码。

1. Apache/2.2.21 mod_ssl/2.2.21 (Pass Phrase Dialog)
2. Some of your private key files are encrypted for security reasons.
3. In order to read them you have to provide the pass phrases.
4.  
5. Server www.example.com:443 (RSA)
6. Enter pass phrase:
7.  
8. OK: Pass Phrase Dialog successful.

之后，你就可以通过https://ip访问你的网站。

转载请标明文章来源:《<https://www.centos.bz/2011/10/centos-install-apache-ssl/>》