Memcached还是Ehcache的区别是是否跨编程语言访问。看你有没有这需求。如果访问的系统都Java的，当然用Ehcache方便。

ehcache是纯java编写的，通信是通过RMI方式，适用于基于java技术的项目。
memcached服务器端是c编写的，客户端有多个语言的实现，如c，php(淘宝，sina等各大门户网站)，python(豆瓣网)， java(Xmemcached，spymemcached)。memcached服务器端是使用文本或者二进制通信的。

| **项目**   | **Memcache**                             | **Ehcache**                              |
| -------- | ---------------------------------------- | ---------------------------------------- |
| 分布式      | 不完全，集群默认不实现                              | 支持                                       |
| 集群       | 可通过客户端实现                                 | 支持（默认是异步同步）                              |
| 持久化      | 可通过第三方应用实现，如sina研发的memcachedb，将cache的数据保存到[url=]Berkerly DB[/url] | 支持。持久化到本地硬盘，生成一个.data和.index文件。cache初始化时会自动查找这两个文件，将数据放入cache |
| 效率       | 高                                        | 高于Memcache                               |
| 容灾       | 可通过客户端实现。                                | 支持                                       |
| 缓存数据方式   | 缓存在memcached server向系统申请的内存中             | 可以缓存在内存（JVM中），也可以缓存在硬盘。通过CacheManager管理cache。多个CacheManager可配置在一个JVM内，CacheManager可管理多个cache。 |
| 缓存过期移除策略 | LRU                                      | LRU(默认)，FIFO，LFU                         |
| 缺点       | 功能不完善，相对于Ehcache效率低                      | 只适用于java体系，只能用java编写客户端                  |
| 优点       | 简洁，灵活，所有支持socket的语言都能编写其客户端              | 效率高。功能强大。                                |

来源： <[http://zhaohe162.blog.163.com/blog/static/38216797201285104639149/](http://zhaohe162.blog.163.com/blog/static/38216797201285104639149/)> 