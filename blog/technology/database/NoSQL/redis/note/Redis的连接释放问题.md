## Redis的连接释放问题

redis连接的时候有 connect 和 pconnect 两种 , 今天做项目时候用的 pconnect 手动 close 之后用 `redis-cli info | grep conn` 发现连接数并没有释放,感到奇怪,查询了很多资料后得到如下结论.

首先看看官方文档

### pconnect, popen

------

**Description**: Connects to a Redis instance or reuse a connection already established with `pconnect`/`popen`.

The connection will not be closed on `close` or end of request until the php process ends. So be patient on to many open FD’s (specially on redis server side) when using persistent connections on many servers connecting to one redis server.

Also more than one persistent connection can be made identified by either host + port + timeout or host + persistent_id or unix socket + timeout.

This feature is not available in threaded versions. `pconnect` and `popen` then working like their non persistent equivalents.

##### *Parameters*

*host*: string. can be a host, or the path to a unix domain socket
*port*: int, optional
*timeout*: float, value in seconds (optional, default is 0 meaning unlimited)
*persistent_id*: string. identity for the requested persistent connection *retry_interval*: int, value in milliseconds (optional)

##### *Return value*

*BOOL*: `TRUE` on success, `FALSE` on error.

##### *Example*

```
$redis->pconnect('127.0.0.1', 6379);
$redis->pconnect('127.0.0.1'); // port 6379 by default - same connection like before.
$redis->pconnect('127.0.0.1', 6379, 2.5); // 2.5 sec timeout and would be another connection than the two before.
$redis->pconnect('127.0.0.1', 6379, 2.5, 'x'); // x is sent as persistent_id and would be another connection the the three before.
$redis->pconnect('/tmp/redis.sock'); // unix domain socket - would be another connection than the four before.

```

这里通过描述可以得知当我们使用 pconnect 的时候执行 close 或者 php 脚本请求结束后并不会关闭连接.

需要注意其实这里有个容易误解的地方: 手动 close 之后并不是不关闭当前连接,而是连接池不释放而已.

```
<?php
$redis = new \Redis();
$redis->pconnect('127.0.0.1', 6379);

var_dump($redis->ping(), $redis);
var_dump($redis->get('k1'));

$redis->close();

echo '===== close=======';

var_dump($redis);
var_dump($redis->get('k1'));

try {
    $redis->ping();
} catch (Exception $e) {
    var_dump($e->getMessage());
}
?>
```

得到如下结果

[![img](http://starsea.github.io/images/posts/QQ20140709-1@2x.png)](http://starsea.github.io/images/posts/QQ20140709-1@2x.png)

13行去 getkey 的时候抛出一个错误 说是连接已经关闭. 没错 其实这里当前 $redis 变量本身已经释放连接池的占用 其他实列可以使用该链接了. (连接池的连接上限数目和 php-fpm 的进程数目有关系)

这里我们注释掉13行 得到如下结果

[![img](http://starsea.github.io/images/posts/QQ20140709-1.png)](http://starsea.github.io/images/posts/QQ20140709-1.png)

### 总结:

- pconnect 会在连接池里建立连接 不受close 的影响. close 只影响当前实列是否继续使用该连接 当然 php 脚本结束后 变量销毁 辣么连接肯定已经归还到了连接池.
- connect 在使用的时候会建立一个连接 脚本结束后 或者 使用 close 会销毁连接.
- close 并不会销毁 resource … = = 只是断开连接而已… unset 变量才会销毁…
- 所以并不是使用了 pconnect 就不要 close 了,如果当前脚本执行时间很长 辣么会一直占用一个连接的.详情请看[鸟哥blog](http://www.laruence.com/2012/07/25/2662.html)

 原文地址：<http://starsea.github.io/posts/redis-pconnect/>
 版权声明：自由转载-非商用-非衍生-保持署名| [Creative Commons BY-NC-ND 3.0](http://creativecommons.org/licenses/by-nc-nd/3.0/deed.zh)