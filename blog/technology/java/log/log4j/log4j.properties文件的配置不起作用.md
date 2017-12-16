今天的项目中遇到了log4j.properties日志配置文件不起作用的问题，反反复复看了log4j.properties文件是没有语法问题，但是设置log级别就是不管用。

最后查到是配置文件，被第三方jar包中的log4j.properties配置文件覆盖了。 查看是否被覆盖可以通过工具来查看第三方包中是否包含log4j.properties文件或者xml配置文件。

如果存在就很有可能是被覆盖了，如果是被覆盖了，可以通过下面的方式在程序启动时重置logger的配置。

如下代码：

```
      org.apache.log4j.LogManager.resetConfiguration();
      org.apache.log4j.PropertyConfigurator.configure("c:/yourlog4j.properties");
```

或者重置xml配置：

```
      org.apache.log4j.xml.DOMConfigurator.configure("c:/yourlog4j.xml"); 
```

如果你不确定是否是被第三方包重置了配置，可以通过在java命令中添加`-Dlog4j.debug`虚拟机参数来显示log4j加载配置文件的位置。

来源： <http://outofmemory.cn/code-snippet/7269/java-log4j.properties-not-working-solution>