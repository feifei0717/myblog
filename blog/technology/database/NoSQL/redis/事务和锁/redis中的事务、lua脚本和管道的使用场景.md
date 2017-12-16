# [redis中的事务、lua脚本和管道的使用场景](http://blog.csdn.net/fangjian1204/article/details/50585080)



## 事务

[Redis](http://lib.csdn.net/base/redis)中的事务并不像[MySQL](http://lib.csdn.net/base/mysql)中那么完美，只是简单的保证了原子性。[redis](http://lib.csdn.net/base/redis)中提供了四个命令来实现事务，MULTI：类似于[mysql](http://lib.csdn.net/base/mysql)中的BEGIN;EXEC：类似于COMMIT;DISCARD类似于ROLLBACK;WATCH则是用于来实现mysql中类似锁的功能。具体的使用方法非常简单，例如：

```
127.0.0.1:6379> multi
OK
127.0.0.1:6379> incr count
QUEUED
127.0.0.1:6379> incr count
QUEUED
127.0.0.1:6379> exec
1) (integer) 1
2) (integer) 2

```

redis事务的实现原理是把事务中的命令先放入队列中，当client提交了exec命令后，redis会把队列中的每一条命令按序执行一遍。如果在执行exec之前事务中断了，那么所有的命令都不会执行；如果执行了exec命令之后，那么所有的命令都会按序执行。但如果在事务执行期间redis被强制关闭，那么则需要使用redis-check-aof 工具对redis进行修复，删除那些部分执行的命令。下面分几种情况讨论下redis事务中需要注意的地方：

1）入队命令语法错误，此时还没有执行exec命令

虽然redis在碰到exec命令之前不会执行事务中的命令，但是，它会对每个命令进行适当的检查，当发现有某些明显的语法错误时，如参数个数不正确，则会在入队时，返回错误信息，并当看到exec命令调用discard命令进行回滚。例如：

```
127.0.0.1:6379> get name
"Jeff"
127.0.0.1:6379> multi
OK
127.0.0.1:6379> set name Kate
QUEUED
127.0.0.1:6379> set name
(error) ERR wrong number of arguments for 'set' command
127.0.0.1:6379> exec
(error) EXECABORT Transaction discarded because of previous errors.
127.0.0.1:6379> get name
"Jeff"

```

2) 当exec执行完毕后，执行其它命令时发生错误

当redis在执行命令时，如果出现了错误，那么redis不会终止其它命令的执行。即只要是正确的命令，无论在错误命令之前还是之后，都会顺利执行。例如：

```
127.0.0.1:6379> lpush visited "name1"
(integer) 1
127.0.0.1:6379> get name
"Kate"
127.0.0.1:6379> get count
"5"
127.0.0.1:6379> multi
OK
127.0.0.1:6379> set name Jeff
QUEUED
127.0.0.1:6379> get visited
QUEUED
127.0.0.1:6379> set count 10
QUEUED
127.0.0.1:6379> exec
1) OK
2) (error) WRONGTYPE Operation against a key holding the wrong kind of value
3) OK
127.0.0.1:6379> get name
"Jeff"
127.0.0.1:6379> get count
"10"

```

redis没有实现真正的回滚是因为redis只是一个key-value缓存[数据库](http://lib.csdn.net/base/mysql)，如果加上日志回滚，将会影响其效率。

3）事务间的相互影响

事务中最长出现的影响就是同时修改一条记录，而redis中的事务默认没有对此进行处理，如果两个事务同时修改一条记录，首先执行exec的事务的结果将会被覆盖。这里我们可以使用watch命令，该命令用于监控某些具体的key，如果这些key被其它事务修改了，那么本事务再修改时就不会成功，然后返回失败的提示。

```
T1：
    watch name
    multi
    set name Jeff
    exec
T2：
    watch name
    multi
    set name Kate
    exec

```

如果T2先提交exec，那么T1提交时则更新失败，此时name依旧是Kate，然后在应用层决定是否需要重新执行该事务。

由于redis事务中的命令在遇到exec命令之前并没有真正的执行，所以我们无法在事务中的命令中使用前面命令的查询结果。我们唯一可以做的就是通过watch保证在我们进行修改时，如果其它事务刚好进行了修改，则我们的修改停止，然后应用层做相应的处理。比如：如果get key 返回的值是true，那么我们set otherkey value，否则什么也不做。这种情况下，虽然可以用事务+watch实现原子操作，但是不免有点太僵硬，很明显这是一个if……else语句。正是因为这个局限，使得lua脚本派上了大的用场。

参考文献：<http://redis.io/topics/transactions>

## lua脚本(2.6.0及以后版本)

原先没有注意lua脚本的用法，上次还是请教了同事才知道redis中lua脚本的强大之处，然后果断在项目中用了一下，感觉非常完美。其使用方法非常简单，例如：

```
eval "return {KEYS[1],KEYS[2],ARGV[1],ARGV[2]}" 2 key1 key2 first second

```

其中eval是lua脚本的解释器；eval的第一个参数是脚本的内容，第二个参数是脚本里面KEYS数组的长度(不包括ARGV参数的个数)，这里是两个；紧接着就会有两个参数，用于传递个KEYS数组；后面剩下的参数全部传递给ARGV数组，相当于命令行参数。

如果我们想在lua脚本中调用redis的命令该如何操作？可以在脚本中使用redis.call()或redis.pcall()直接调用，两者用法类似，只是在遇到错误时，返回错误的提示方式不同。例如：

```
eval "return redis.call('set',KEYS[1],'bar')" 1 foo

```

redis确保正一条script脚本执行期间，其它任何脚本或者命令都无法执行。正是由于这种原子性，script才可以替代MULTI/EXEC作为事务使用。当然，官方文档也说了，正是由于script执行的原子性，所以我们不要在script中执行过长开销的程序，否则会验证影响其它请求的执行。

另外，redis为了减少每次客户端发送来的数据带宽(如果script太长，则发送来的内容可能非常多)，会把每次新出现的脚本的sha1摘要保存下来，这样后续如果script不变的话，只需要调用evalsha命令+script摘要即可，而不需要重复传递过长的脚本内容。例如：

```
127.0.0.1:6379> set foo bar
OK
127.0.0.1:6379> eval "return redis.call('get','foo')" 0
"bar"
localhost:6379> SCRIPT LOAD "return redis.call('get','foo')"
"6b1bf486c81ceb7edf3c093f4c48582e38c0e791"
127.0.0.1:6379> evalsha 6b1bf486c81ceb7edf3c093f4c48582e38c0e791 0
"bar"
```

从这里可以看出把key和arg以参数的形式传递而不是直接写在script中的好处，因为这样可以把变量提取出来，使得script的sha1摘要保持不变，提高命中率。在应用程序中，可以先使用evalsha进行调用，如果失败，再使用eval进行操作，这样可以在一定程度上提高效率。

有了上面的知识，我们就可以使用lua脚本来灵活的使用redis的事务，这里举几个简单的例子。

场景1：我们要判断一个IP是不是第一次访问，如果是第一次访问，那么返回状态1，否则插入该ip，并返回状态0.

```
127.0.0.1:6379> eval "if redis.call('get',KEYS[1]) then return 1 else redis.call('set', KEYS[1], 'test') return 0 end" 1 test_127.0.0.1
(integer) 0
127.0.0.1:6379> eval "if redis.call('get',KEYS[1]) then return 1 else redis.call('set', KEYS[1], 'test') return 0 end" 1 test_127.0.0.1
(integer) 1
```

场景2：使用redis限制30分钟内一个IP只允许访问5次

思路：每次想把当前的时间插入到redis的list中，然后判断list长度是否达到5次，如果大于5次，那么取出队首的元素，和当前时间进行判断，如果在30分钟之内，则返回-1，其它情况返回1.

```
eval "redis.call('rpush', KEYS[1],ARGV[1]);if (redis.call('llen',KEYS[1]) >tonumber(ARGV[2])) then if tonumber(ARGV[1])-redis.call('lpop', KEYS[1])<tonumber(ARGV[3]) then return -1 else return 1 end else return 1 end" 1 'test_127.0.0.1' 1451460590 5 1800
```

通过上面两个场景可以看到，我们仅仅使用了lua的if语句，就可以实现这么方便的操作，如果使用其它的lua语法，肯定更加方便。

官网文档上有这样一段话：

A Redis script is transactional by definition, so everything you can do with a Redis transaction, you can also do with a script, and usually the script will be both simpler and faster.

由此可以看出，官方还是支持大家尽量使用lua script来代替transaction的。

参考文献：<http://redis.io/commands/eval>

## 管道

大家都知道redis是基于TCP连接进行通信的，每一个request/response都需要经历一个RTT往返时间，如果需要执行很多短小的命令，这些往返时间的开销是很大的，在此情形下，redis提出了管道来提高执行效率。管道的思想是：如果client执行一些相互之间无关的命令或者不需要获取命令的返回值，那么redis允许你连续发送多条命令，而不需要等待前面命令执行完毕。比如我们执行3条INCR命令，如果使用管道，理论上只需要一个RTT+3条命令的执行时间即可，如果不适用管道，那么可能需要额外的两个RTT时间。因此，管道相当于批处理脚本，相当于是命令集，例如：

```
with r.pipeline(transaction=False) as pipe:
    pipe.set('key1', 'value1')
    pipe.set('key2', 'value2')
    pipe.set('key3', 'value3')
    pipe.execute()
```

Pipeline在某些场景下非常有用，比如有多个command需要被“及时的”提交，而且他们对相应结果没有互相依赖，而且对结果响应也无需立即获得，那么pipeline就可以充当这种“批处理”的工具；而且在一定程度上，可以较大的提升性能,性能提升的原因主要是TCP链接中较少了“交互往返”的时间。例如：因为业务需要，我们需要把用户的操作过程记录在日志中以方便以后的统计，每隔3个小时生成一个新的日志文件，那么后台处理线程，将会扫描日志文件并将每条日志输出为“operation”:1,即表示操作次数为1;如果每个operation都发送一个command，事实上性能是很差的，而且是没有必要的；那么我们就可以使用pipeline批量提交即可。

管道和事务是不同的，pipeline只是表达“交互”中操作的传递的方向性，pipeline也可以在事务中运行，也可以不在。无论如何，pipeline中发送的每个command都会被server立即执行，如果执行失败，将会在此后的相应中得到信息；也就是pipeline并不是表达“所有command都一起成功”的语义，管道中前面命令失败，后面命令不会有影响，继续执行。简单来说就是管道中的命令是没有关系的，它们只是像管道一样流水发给server，而不是串行执行，仅此而已；但是如果pipeline的操作被封装在事务中，那么将有事务来确保操作的成功与失败。

使用管道可能在效率上比使用script要好，但是有的情况下只能使用script。因为在执行后面的命令时，无法得到前面命令的结果，就像事务一样，所以如果需要在后面命令中使用前面命令的value等结果，则只能使用script或者事务+watch。

参考文献：<http://redis.io/topics/pipelining>