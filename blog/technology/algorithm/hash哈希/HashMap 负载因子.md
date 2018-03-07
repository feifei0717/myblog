# HashMap 负载因子



在HashMap的构造函数有以下三种：

 

- HashMap()：构建一个初始容量为 16，负载因子默认为 0.75 的 HashMap。
- HashMap(int initialCapacity)：构建一个初始容量为 initialCapacity，负载因子为 0.75 的 HashMap。
- HashMap(int initialCapacity, float loadFactor)：以指定初始容量、指定的负载因子创建一个 HashMap。

而其中的负载因子loadFactor的理解为：HashMap中的数据量/HashMap的总容量(initialCapacity),当loadFactor达到指定值或者0.75时候，HashMap的总容量自动扩展一倍，以此类推。





http://blog.csdn.net/morethinkmoretry/article/details/5806781