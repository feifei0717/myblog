nslookup命令用于查询DNS的记录，查看域名解析是否正常，在网络故障的时候用来诊断网络问题。nslookup的用法相对来说还是蛮简单的，主要是下面的几个用法。

## 1、直接查询

这个可能大家用到最多，查询一个域名的A记录。

> nslookup domain [dns-server]

如果没指定dns-server，用系统默认的dns服务器。下面是一个例子：

C:\Users\jackie>nslookup www.ezloo.com 8.8.8.8 
Server:  google-public-dns-a.google.com 
Address:  8.8.8.8

Non-authoritative answer: 
Name:    www.ezloo.com 
Address:  70.32.68.136

也可以直接用ip查询

![img](windows dos nslookup命令用法_files/24a413ba-964e-4f83-bacd-2824afe58f24.jpg)

 

## 2、查询其他记录

直接查询返回的是A记录，我们可以指定参数，查询其他记录，比如AAAA、MX等。

> nslookup -qt=type domain [dns-server]

其中，type可以是以下这些类型：

A 地址记录 
AAAA 地址记录 
AFSDB Andrew文件系统数据库服务器记录 
ATMA ATM地址记录 
CNAME 别名记录 
HINFO 硬件配置记录，包括CPU、操作系统信息 
ISDN 域名对应的ISDN号码 
MB 存放指定邮箱的服务器 
MG 邮件组记录 
MINFO 邮件组和邮箱的信息记录 
MR 改名的邮箱记录 
MX 邮件服务器记录 
NS 名字服务器记录 
PTR 反向记录 
RP 负责人记录 
RT 路由穿透记录 
SRV TCP服务器信息记录 
TXT 域名对应的文本信息 
X25 域名对应的X.25地址记录

例如：

C:\Users\jackie>nslookup -qt=mx ezloo.com 8.8.8.8 
Server:  google-public-dns-a.google.com 
Address:  8.8.8.8

Non-authoritative answer: 
ezloo.com       MX preference = 10, mail exchanger = aspmx.l.google.com 
ezloo.com       MX preference = 20, mail exchanger = alt1.aspmx.l.google.com 
ezloo.com       MX preference = 30, mail exchanger = alt2.aspmx.l.google.com 
ezloo.com       MX preference = 40, mail exchanger = aspmx2.googlemail.com 
ezloo.com       MX preference = 50, mail exchanger = aspmx3.googlemail.com

## 3、查询更具体的信息

查询语法：

> nslookup –d [其他参数] domain [dns-server]

只要在查询的时候，加上-d参数，即可查询域名的缓存。

C:\Users\jackie>nslookup -d www.ezloo.com 
\------------ 
Got answer: 
​    HEADER: 
​        opcode = QUERY, id = 1, rcode = NOERROR 
​        header flags:  response, want recursion, recursion avail. 
​        questions = 1,  answers = 1,  authority records = 2,  additional = 2

​    QUESTIONS: 
​        196.134.191.60.in-addr.arpa, type = PTR, class = IN 
​    ANSWERS: 
​    ->  196.134.191.60.in-addr.arpa 
​        name = tzdns1.tzptt.zj.cn 
​        ttl = 11568 (3 hours 12 mins 48 secs) 
​    AUTHORITY RECORDS: 
​    ->  191.60.in-addr.arpa 
​        nameserver = dns-noc.zjhzptt.net.cn 
​        ttl = 11537 (3 hours 12 mins 17 secs) 
​    ->  191.60.in-addr.arpa 
​        nameserver = ns.zjnbptt.net.cn 
​        ttl = 11537 (3 hours 12 mins 17 secs) 
​    ADDITIONAL RECORDS: 
​    ->  dns-noc.zjhzptt.net.cn 
​        internet address = 202.96.103.36 
​        ttl = 11522 (3 hours 12 mins 2 secs) 
​    ->  ns.zjnbptt.net.cn 
​        internet address = 202.96.104.18 
​        ttl = 11522 (3 hours 12 mins 2 secs)

\------------ 
Server:  tzdns1.tzptt.zj.cn 
Address:  60.191.134.196

\------------ 
Got answer: 
​    HEADER: 
​        opcode = QUERY, id = 2, rcode = NOERROR 
​        header flags:  response, want recursion, recursion avail. 
​        questions = 1,  answers = 1,  authority records = 2,  additional = 0

​    QUESTIONS: 
​        www.ezloo.com, type = A, class = IN 
​    ANSWERS: 
​    ->  www.ezloo.com 
​        internet address = 70.32.68.136 
​        ttl = 2732 (45 mins 32 secs) 
​    AUTHORITY RECORDS: 
​    ->  ezloo.com 
​        nameserver = ns61.domaincontrol.com 
​        ttl = 2365 (39 mins 25 secs) 
​    ->  ezloo.com 
​        nameserver = ns62.domaincontrol.com 
​        ttl = 2365 (39 mins 25 secs)

\------------ 
Non-authoritative answer: 
\------------ 
Got answer: 
​    HEADER: 
​        opcode = QUERY, id = 3, rcode = NOERROR 
​        header flags:  response, want recursion, recursion avail. 
​        questions = 1,  answers = 0,  authority records = 1,  additional = 0

​    QUESTIONS: 
​        www.ezloo.com, type = AAAA, class = IN 
​    AUTHORITY RECORDS: 
​    ->  ezloo.com 
​        ttl = 10800 (3 hours) 
​        primary name server = ns61.domaincontrol.com 
​        responsible mail addr = dns.jomax.net 
​        serial  = 2011032900 
​        refresh = 28800 (8 hours) 
​        retry   = 7200 (2 hours) 
​        expire  = 604800 (7 days) 
​        default TTL = 86400 (1 day)

\------------ 
Name:    www.ezloo.com 
Address:  70.32.68.136

本篇日志主要介绍了nslookup的常用的简单的参数，在日后使用中，有新发现，会及时更新本日志。

来源： [https://www.ezloo.com/2011/04/nslookup.html](https://www.ezloo.com/2011/04/nslookup.html)