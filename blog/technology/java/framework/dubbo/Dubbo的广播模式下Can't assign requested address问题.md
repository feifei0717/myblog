# Dubbo的广播模式下Can't assign requested address问题

在MAC系统中使用dubbo的multicast模式，启动报错：

```
Exception in thread "main" java.lang.IllegalStateException: Can't assign requested address
	at com.alibaba.dubbo.registry.multicast.MulticastRegistry.<init>(MulticastRegistry.java:116)
	at com.alibaba.dubbo.registry.multicast.MulticastRegistryFactory.createRegistry(MulticastRegistryFactory.java:30)
	at com.alibaba.dubbo.registry.support.AbstractRegistryFactory.getRegistry(AbstractRegistryFactory.java:95)
	at com.alibaba.dubbo.registry.RegistryFactory$Adaptive.getRegistry(RegistryFactory$Adaptive.java)
	at com.alibaba.dubbo.registry.integration.RegistryProtocol.getRegistry(RegistryProtocol.java:215)
	at com.alibaba.dubbo.registry.integration.RegistryProtocol.export(RegistryProtocol.java:126)
	at com.alibaba.dubbo.rpc.protocol.ProtocolFilterWrapper.export(ProtocolFilterWrapper.java:91)
	at com.alibaba.dubbo.rpc.protocol.ProtocolListenerWrapper.export(ProtocolListenerWrapper.java:66)
	at com.alibaba.dubbo.rpc.Protocol$Adaptive.export(Protocol$Adaptive.java)
	at com.alibaba.dubbo.config.ServiceConfig.doExportUrlsFor1Protocol(ServiceConfig.java:505)
	at com.alibaba.dubbo.config.ServiceConfig.doExportUrls(ServiceConfig.java:357)
	at com.alibaba.dubbo.config.ServiceConfig.doExport(ServiceConfig.java:316)
	at com.alibaba.dubbo.config.ServiceConfig.export(ServiceConfig.java:215)
	at com.alibaba.dubbo.config.spring.ServiceBean.onApplicationEvent(ServiceBean.java:121)
	at com.alibaba.dubbo.config.spring.ServiceBean.onApplicationEvent(ServiceBean.java:50)
	at org.springframework.context.event.SimpleApplicationEventMulticaster.doInvokeListener(SimpleApplicationEventMulticaster.java:172)
	at org.springframework.context.event.SimpleApplicationEventMulticaster.invokeListener(SimpleApplicationEventMulticaster.java:165)
	at org.springframework.context.event.SimpleApplicationEventMulticaster.multicastEvent(SimpleApplicationEventMulticaster.java:139)
	at org.springframework.context.support.AbstractApplicationContext.publishEvent(AbstractApplicationContext.java:393)
	at org.springframework.context.support.AbstractApplicationContext.publishEvent(AbstractApplicationContext.java:347)
	at org.springframework.context.support.AbstractApplicationContext.finishRefresh(AbstractApplicationContext.java:883)
	at org.springframework.context.support.AbstractApplicationContext.refresh(AbstractApplicationContext.java:546)
	at org.springframework.context.support.ClassPathXmlApplicationContext.<init>(ClassPathXmlApplicationContext.java:139)
	at org.springframework.context.support.ClassPathXmlApplicationContext.<init>(ClassPathXmlApplicationContext.java:93)
	at com.biutefu.vertxdubbo.demo.provider.Provider.main(Provider.java:12)
Caused by: java.net.SocketException: Can't assign requested address
	at java.net.PlainDatagramSocketImpl.join(Native Method)
	at java.net.AbstractPlainDatagramSocketImpl.join(AbstractPlainDatagramSocketImpl.java:178)
	at java.net.MulticastSocket.joinGroup(MulticastSocket.java:323)
	at com.alibaba.dubbo.registry.multicast.MulticastRegistry.<init>(MulticastRegistry.java:90)
	... 24 more

```

造成这种原因的主要是系统中开启了IPV6协议，java网络编程经常会获取到IPv6的地址。解决方法：

添加vm参数 -Djava.net.preferIPv4Stack=true