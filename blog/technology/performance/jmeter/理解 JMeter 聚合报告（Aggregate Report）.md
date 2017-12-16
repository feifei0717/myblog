**版权声明**：本文可以被转载，但是在未经本人许可前，不得用于任何商业用途或其他以盈利为目的的用途。本人保留对本文的一切权利。如需转载，请在转载是保留此版权声明，并保证本文的完整性。也请转贴者理解创作的辛劳，尊重作者的劳动成果。

作者：陈雷 (Jackei)

邮箱：[jackeichan@gmail.com](mailto:jackeichan@gmail.com)

Blog：[http://jackei.cnblogs.com](http://jackei.cnblogs.com/)

  

Aggregate Report 是 [JMeter](http://jakarta.apache.org/jmeter/) 常用的一个 Listener，中文被翻译为“聚合报告”。今天再次有同行问到这个报告中的各项数据表示什么意思，顺便在这里公布一下，以备大家查阅。

如果大家都是做Web应用的性能测试，例如只有一个登录的请求，那么在Aggregate Report中，会显示一行数据，共有10个字段，含义分别如下。

Label：每个 JMeter 的 element（例如 HTTP Request）都有一个 Name 属性，这里显示的就是 Name 属性的值

\#Samples：表示你这次测试中一共发出了多少个请求，如果模拟10个用户，每个用户迭代10次，那么这里显示100

Average：平均响应时间——默认情况下是单个 Request 的平均响应时间，当使用了 Transaction Controller 时，也可以以Transaction 为单位显示平均响应时间

Median：中位数，也就是 50％ 用户的响应时间

90% Line：90％ 用户的响应时间

Note：关于 50％ 和 90％ 并发用户数的含义，请参考下文

http://www.cnblogs.com/jackei/archive/2006/11/11/557972.html

Min：最小响应时间

Max：最大响应时间

Error%：本次测试中出现错误的请求的数量/请求的总数

Throughput：吞吐量——默认情况下表示每秒完成的请求数（Request per Second），当使用了 Transaction Controller 时，也可以表示类似 LoadRunner 的 Transaction per Second 数(单个接口直接统计，不需要加事务，单个加和不加一样的。单个接口测试的时候 吞吐量就是tps。)

KB/Sec：每秒从服务器端接收到的数据量，相当于LoadRunner中的Throughput/Sec

 

另外，如果大家在使用 JMeter 的过程中遇到问题，建议先参考下面这篇文章

<http://www.cnblogs.com/jackei/archive/2006/11/06/551921.html>

其他有关 JMeter 和 性能测试的文章请参见下面的链接

<http://www.cnblogs.com/jackei/archive/2006/11/13/558720.html>

来源： <http://www.cnblogs.com/jackei/archive/2007/01/17/623166.html>