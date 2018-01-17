# org.springframework.util.StopWatch：简洁的耗时统计小工具

想知道一个代码块执行耗时多久，通常做法是执行前记录当前时间A，执行后用当前时间减去A就是耗时了。spring库中有个统计耗时的小工具：StopWatch类，它可以帮我们做这些事情，甚至做得更好，咱们直接上代码实战吧：



### 添加依赖

在pom.xml中添加spring core的依赖，另外，为了看到更丰富的对象信息，我们把fastjson也加入进来，如下：

```Xml
<properties>
        <!-- spring版本号 -->
        <spring.version>4.0.2.RELEASE</spring.version>
        <!-- fastjson版本号 -->
        <fastjson.version>1.2.39</fastjson.version>
    </properties>
    <dependencies>
        <!-- spring核心包 -->
        <dependency>
            <groupId>org.springframework</groupId>
            <artifactId>spring-core</artifactId>
            <version>${spring.version}</version>
        </dependency>
        <!-- fastjson -->
        <dependency>
            <groupId>com.alibaba</groupId>
            <artifactId>fastjson</artifactId>
            <version>${fastjson.version}</version>
        </dependency>
    </dependencies> 
```

### 模拟耗时的方法

在实际项目中，我们在调用本地方法，操作数据库，发起远程调用等场景都有可能耗时较长，所以此处做三个方法来模拟这些场景，如下，这个类的名字是StopWatchDemo：

```Java
/**
     * 延时的方法
     * @param time 延时时常，单位毫秒
     */
    private static void delay(long time){
        try{
            Thread.sleep(time);
        }catch(InterruptedException e){
            e.printStackTrace();
        }
    }

    /**
     * 假设这个方法在执行本地调用，耗时100毫秒
     */
    private void executeNative(){
        delay(100);
    }

    /**
     * 假设这个方法在执行数据库操作，耗时200毫秒
     */
    private void executeDB(){
        delay(200);
    }

    /**
     * 假设这个方法在执行远程调用，耗时300毫秒
     */
    private void executeRPC(){
        delay(300);
    } 
```

### 用StopWatch类统计耗时

执行每个方法，并且统计这些方法耗时的代码如下，不多说了，看注释就好：

```Java
StopWatchDemo demo = new StopWatchDemo();

        //起个名字，在最后面统计信息中会打印出来
        StopWatch stopWatch = new StopWatch("stopwatch test");

        //记录本地方法的耗时
        stopWatch.start("执行本地方法");
        demo.executeNative();
        stopWatch.stop();

        //记录数据库操作的耗时
        stopWatch.start("执行数据库操作");
        demo.executeDB();
        stopWatch.stop();

        //记录数远程调用耗时
        stopWatch.start("执行远程调用");
        demo.executeRPC();
        stopWatch.stop();

        //打印一份格式化好的汇总统计信息
        System.out.println(stopWatch.prettyPrint());

        System.out.println("\n");

        //打印统计名称和总的耗时
        System.out.println(stopWatch.shortSummary());

        System.out.println("\n");

        //一共执行了三段统计，stopWatch.getTaskInfo()返回的数组中就是每段的信息，这里用fastjson转成字符串便于查看
        System.out.println(JSON.toJSON(stopWatch.getTaskInfo())); 
```

### 执行结果

代码的执行结果如下，可以看到prettyPrint()返回的信息是格式化好的汇总数据，包含了每段耗时以及所占整体的百分比，让人对大致情况一目了然，shortSummary()返回的是名称和总耗时，stopWatch.getTaskInfo()返回了一个数组，里面是每一段统计的名称和耗时：

```
StopWatch 'stopwatch test': running time (millis) = 612
-----------------------------------------
ms     %     Task name
-----------------------------------------
00106  017%  执行本地方法
00204  033%  执行数据库操作
00302  049%  执行远程调用



StopWatch 'stopwatch test': running time (millis) = 612


[{"timeSeconds":0.106,"taskName":"执行本地方法","timeMillis":106},{"timeSeconds":0.204,"taskName":"执行数据库操作","timeMillis":204},{"timeSeconds":0.302,"taskName":"执行远程调用","timeMillis":302}]1234567891011121314
```

### 注意事项

在阅读StopWatch的源码时，发现有两点需要注意： 

1. 多个耗时的分段信息是存储在LinkedList集合中的，非线程安全，而且有很多成员变量，所以不能在多线程中使用； 
2. StopWatch类的作者如下图所示，Rod Johnson：Spring Framework创始人、音乐学博士~~~~~~ 

![这里写图片描述](http://img.blog.csdn.net/20171013232509890?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvYm9saW5nX2NhdmFscnk=/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)

至此，简洁易用的StopWatch就介绍完毕了，希望它能在开发调试和查找问题时祝您一臂之力。

Demo工程源码可以在我的git上获取：git@github.com:zq2599/blog_demos.git 
里面有多个工程，本次实战对应的工程如下图红框所示：

![这里写图片描述](http://img.blog.csdn.net/20171013231315160?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvYm9saW5nX2NhdmFscnk=/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)





http://blog.csdn.net/boling_cavalry/article/details/78231032