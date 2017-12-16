# grep 同时满足多个关键字和满足任意关键字

① grep -E "word1|word2|word3"   file.txt

   满足任意条件（word1、word2和word3之一）将匹配。

② grep word1 file.txt | grep word2 |grep word3

   必须同时满足三个条件（word1、word2和word3）才匹配。

# grep -A ：显示匹配行和之后的几行

我经常用grep找东西，比如用户名和密码。大部分站点和用户名和密码都是在一样的，方便grep查找。有时，为了文本好看，我会放在多行。比如 wikipedia多个语言版本上有多个账号，就放在wikipedia总栏目下。这时，光 grep wikipedia 密码文件.txt 就不行了。因为实际的用户名和密码在匹配那行的下面呢。

 

这是 -A 开关就有用了。

 

grep手册中的解释：

 

Context Line Control

 

-A NUM, --after-context=NUM

Print NUM lines of trailing context after matching lines.

Places a line containing a group separator (--) between

contiguous groups of matches. With the -o or --only-matching

option, this has no effect and a warning is given.

 

-B NUM, --before-context=NUM

Print NUM lines of leading context before matching lines.

Places a line containing a group separator (--) between

contiguous groups of matches. With the -o or --only-matching

option, this has no effect and a warning is given.

 

-C NUM, -NUM, --context=NUM

Print NUM lines of output context. Places a line containing a

group separator (--) between contiguous groups of matches. With

the -o or --only-matching option, this has no effect and a

warning is given.

grep -C 5 foo file 显示file文件里匹配foo字串那行以及上下5行
grep -B 5 foo file 显示foo及前5行
grep -A 5 foo file 显示foo及后5行

 

简单翻译就是，-A -B -C 后面都跟阿拉伯数字，-A是显示匹配后和它后面的n行。-B是显示匹配行和它前面的n行。-C是匹配行和它前后各n行。总体来说，-C覆盖面最大。用它保险些。哈哈。这3个开关都是关于匹配行的上下文的（context）。

 

于是，

 

  grep -A 4 wikipedia 密码文件.txt

就是搜索密码文件，找到匹配“wikipedia”字串的行，显示该行后后面紧跟的4行。

 

这种方法比用程序打开该文件搜索关键字要快得多！

# grep -c "xx"：每个输入文件匹配的行数

例子：计算tomcat-commodity-log.log.03日志文件中包含"FnMemCacheImpl: cost"字符串的行数

grep  -A    0  "FnMemCacheImpl: cost"   tomcat-commodity-log.log.03 |  grep -c "FnMemCacheImpl"

# zgrep 下不解包查看tar包文件内容

zcat vsftpd.tar.gz|grep --binary-files=text 'footbar.js'或 zgrep --binary-files=text 'footbar.js' vsftpd.tar.gz

zcat tomcat-commoditysupport-catalina.log* |grep --binary-files=text '更新item_acom:' |grep   '201601CG120000953' 

如果不解包想直接查看压缩包里包含了那些文件呢？可以用下面的命令：

```
[root@back tmp]# tar tvf vsftpd.tar.gz-rw------- root/root 441453365 2013-06-03 16:19:56 vsftpd.log
```

# grep   -F ',\"xx\":\"1\'    查询保护特殊字符的  不使用正则表达式:

‘’里面的特殊字符保持原样查询。

grep   -F ',"itemDeliveryLabel":"1' 

```
[16:27:57 loguser@nfslog:/systemlog/2017/01/17/sh-beta1/commoditysupportapi01.beta1.fn]$ grep   -A  0   '更新缓存消费处理类，消息入参：'   tomcat-commoditysupportapi-catalina | grep      -F '"2"}],"msgId":"a0995f29454e' 2017-01-17 10:20:08.371 [SimpleAsyncTaskExecutor-8] WARN  c.f.s.c.c.m.c.s.i.MqUpdateCacheServiceImpl 110: 更新缓存消费处理类，消息入参：{"items":[{"dt":"2017-01-17 10:20:07:606","key":"PS11612200001312","type":"2"}],"msgId":"a0995f29454e4dacb0f99cf15fa8a777","sendDT":"2017-01-17 10:20:07:606"}
```

You can also use fgrep (which is just grep with the -F flag). This forces grep to interpret the pattern as a fixed string (i.e. it'll treat a / as a literal /). You'll still need to protect the backslashes from expansion by the shell.

 

grep -F '\resources\'

# **grep(grep -E 或者 egrep)：**

egrep 等同于 grep -E

使用扩展grep的主要好处是增加了额外的正则表达式元字符集。

 

## 打印所有包含NW或EA的行。如果不是使用egrep，而是grep，将不会有结果查出。

```
    # egrep 'NW|EA' testfile     
    northwest       NW      Charles Main        3.0     .98     3       34
    eastern         EA      TB Savage           4.4     .84     5       20
```

 

## 对于标准grep，如果在扩展元字符前面加\，grep会自动启用扩展选项-E。

```
#grep 'NW\|EA' testfile
northwest       NW      Charles Main        3.0     .98     3       34
eastern         EA      TB Savage           4.4     .84     5       20
```

 

## 搜索所有包含一个或多个3的行。



```
# egrep '3+' testfile
# grep -E '3+' testfile
# grep '3\+' testfile        
#这3条命令将会
northwest       NW      Charles Main          3.0     .98     3       34
western         WE      Sharon Gray           5.3     .97     5       23
northeast       NE      AM Main Jr.           5.1     .94     3       13
central         CT      Ann Stephens          5.7     .94     5       13
```

 

 

## 搜索所有包含0个或1个小数点字符的行。

​    



```
# egrep '2\.?[0-9]' testfile 
# grep -E '2\.?[0-9]' testfile
# grep '2\.\?[0-9]' testfile 
#首先含有2字符，其后紧跟着0个或1个点，后面再是0和9之间的数字。
western         WE       Sharon Gray          5.3     .97     5       23
southwest       SW      Lewis Dalsass         2.7     .8      2       18
eastern         EA       TB Savage             4.4     .84     5       20
```



 

## 搜索一个或者多个连续的no的行。

​    

```
# egrep '(no)+' testfile
# grep -E '(no)+' testfile
# grep '\(no\)\+' testfile   #3个命令返回相同结果，
northwest       NW      Charles Main        3.0     .98     3       34
northeast       NE       AM Main Jr.        5.1     .94     3       13
north           NO      Margot Weber        4.5     .89     5       9
```

## 查询四位数大于500的

```
grep -E '\]([1-9][0-9][0-9][0-9] | 0[5-9][0-9][0-9])' tomcat-commodityapi-catalina.log.20 | less
```

查询结果：

```
[8e215c37430d47b29b3171a74e42750c /rest/www/itemDetail/get_skuinfo_with_more_for_front]1072[8e215c37430d47b29b3171a74e42750c /rest/www/itemDetail/get_skuinfo_with_more_for_front]572
```

## 正则表达式操作符总结

| 正则表达式操作符 | 含义                                   |
| -------- | ------------------------------------ |
| .        | 匹配任何单个字符。                            |
| ?        | 匹配前一个字符0次或1次。                        |
| *        | 匹配前一个字符≥0次。                          |
| +        | 匹配前一个字符≥1次。                          |
| {N}      | 匹配前一个字符N次。                           |
| {N,}     | 匹配前一个字符≥m次。                          |
| {N,M}    | 匹配前一个字符 N 到 M次。                      |
| –        | 如果在列表中的某个列表或某个范围内的结束点，表示该范围。         |
| ^        | 开始标记，表示在开始位置匹配一个空字符串。也表示不在列表的范围内的字符。 |
| $        | 结束标记。匹配一个空的字符串。                      |
| \b       | 单词锁定符。在一个单词的边缘位置匹配空字符串。              |
| \B       | 在一个单词的非边缘位置匹配空字符串。                   |
| \<       | 匹配单词开始的空字符串。                         |
| \>       | 匹配单词结尾的空字符串。                         |

来源： [http://www.cnblogs.com/ggjucheng/archive/2013/01/13/2856896.html](http://www.cnblogs.com/ggjucheng/archive/2013/01/13/2856896.html)

# cat、tail、head、grep、sed查看文件任意几行的数据

grep -C 5 foo file 显示file文件里匹配foo字串那行以及上下5行
grep -B 5 foo file 显示foo及前5行
grep -A 5 foo file 显示foo及后5行-------------------------------------------------------------------------------------------------grep结果太多， 可否只取前面10行匹配的结果grep ...... | head -10-------------------------------------------------------------------------------------------------
**一、使用cat、tail、head组合**1、查看最后1000行的数据cat filename | tail -n 1000
2、查看1000到3000行的数据cat filename | head -n 3000 | tail -n +1000  1、cat -n filename 打印文件所有内容, 显示所有行号（包括空行)  2、tail -n 1000 打印文件最后1000行的数据
  3、tail -n +1000 打印文件第1000行开始以后的内容
  4、head -n 1000 打印前1000的内容**二、使用sed命令**显示1000到300行的数据sed -n '1000,3000p' filename
来源： [http://blog.csdn.net/u011487593/article/details/52287991](http://blog.csdn.net/u011487593/article/details/52287991)