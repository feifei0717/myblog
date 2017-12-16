# maven工程下 读取resource下配置文件

在maven工程中，我们会将配置文件放到，src/main/resources   下面，例如

![img](http://img.blog.csdn.net/20160905160443399?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQv/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/Center)

我们需要确认resource 下的文件 编译之后存放的位置

![img](http://img.blog.csdn.net/20160905161025339?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQv/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/Center)

![img](http://img.blog.csdn.net/20160905161012929?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQv/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/Center)

它编译的路径直接位于classes下面，这个路径其实就是classPath的路径，所以，在resources 根目录下的配置文件其实就是 classPath的路径

```
public static void main(String[] args) throws ParserConfigurationException, Exception{  
        ClassLoader classLoader = TestDom.class.getClassLoader();  
        URL resource = classLoader.getResource("test.xml");  
        String path = resource.getPath();  
        System.out.println(path);  
        InputStream resourceAsStream = classLoader.getResourceAsStream("test.xml");  
```

这样我们就可以直接拿到路径，调用 getResourceAsStream 方法 可以直接拿到目标文件的输入流



http://blog.csdn.net/xu511739113/article/details/52440982