# 一个IP可以绑定多个域名，那么服务端是怎么实现的?



首先，一个IP绑定多个域名是很常见的事情，租用的虚拟主机大多数都是多个主机共享同一个IP，区分具体访问的是哪个主机要从两个方面实现：

## **1、客户端如何区别不同网站**

```
GET / HTTP/1.1
Host: www.google.com

```

整个请求会被发送到服务器上，其中有Host字段标识你要请求的网站域名是什么，即使访问的是同一个IP地址，由于Host字段不同，所以服务器软件有办法区分具体访问的是哪个网站。

关于Host字段的具体定义，可以阅读RFC-2616的第14.23节：[http://www.rfc-editor.org/rfc/rfc2616.txt**](https://link.zhihu.com/?target=http%3A//www.rfc-editor.org/rfc/rfc2616.txt)

以下是节选（注意加粗的部分）：

> 14.23 Host
>    The Host request-header field specifies the Internet host and port
>    number of the resource being requested, as obtained from the original
>    URI given by the user or referring resource (generally an HTTP URL,
>    as described in section 3.2.2). The Host field value MUST represent
>    the naming authority of the origin server or gateway given by the
>    original URL. This allows the origin server or gateway to
>    differentiate between internally-ambiguous URLs, such as the root "/"
>    URL of a server for **multiple host names on a single IP address**.

另外，RFC-2616并非HTTP协议的最新规范，具体的规范请参考RFC-2616的描述链接：[Information on RFC 2616**](https://link.zhihu.com/?target=http%3A//www.rfc-editor.org/info/rfc2616)

## **2、服务器端如何配置**

示例主要采用nginx配置虚拟主机

### 修改nginx.conf

```
#user  nobody;
worker_processes  1;

#error_log  logs/error.log;
#error_log  logs/error.log  notice;
#error_log  logs/error.log  info;

#pid        logs/nginx.pid;


events {
    worker_connections  1024;
}

# load modules compiled as Dynamic Shared Object (DSO)
#
#dso {
#    load ngx_http_fastcgi_module.so;
#    load ngx_http_rewrite_module.so;
#}

http {
    include       mime.types;
    default_type  application/octet-stream;

    #log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
    #                  '$status $body_bytes_sent "$http_referer" '
    #                  '"$http_user_agent" "$http_x_forwarded_for"';

    #access_log  logs/access.log  main;

    sendfile        on;
    #tcp_nopush     on;

    #keepalive_timeout  0;
    keepalive_timeout  65;

    #gzip  on;

    server {
        listen       80;
        server_name  www.nginx1.com;

        #charset koi8-r;

        #access_log  logs/host.access.log  main;

        location / {
            root   html;
            index  index.html index.htm;
        }

        #error_page  404              /404.html;

        # redirect server error pages to the static page /50x.html
        #
        error_page   500 502 503 504  /50x.html;
        location = /50x.html {
            root   html;
        }

    }

    server {
        listen       80;
        server_name  www.nginx2.com;

        #charset koi8-r;

        #access_log  logs/host.access.log  main;

        location / {
            root   /opt/html;
            index  index.html index.htm;
        }

        #error_page  404              /404.html;

        # redirect server error pages to the static page /50x.html
        #
        error_page   500 502 503 504  /50x.html;
        location = /50x.html {
            root   html;
        }

    }



}
```

### 配置本机host

```
192.168.184.159 www.nginx1.com
192.168.184.159 www.nginx2.com
```







https://www.zhihu.com/question/29390934