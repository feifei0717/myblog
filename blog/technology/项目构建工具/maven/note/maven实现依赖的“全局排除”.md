# maven实现依赖的“全局排除”.md

大多数java应用源码构建和依赖管理是使用maven来实现的，maven也是java构建和依赖管理的事实上的标准。我们的应用系统也都是基于maven构建的，maven虽然在依赖管理方面确实很牛叉，但是并不能很优雅地解决所有依赖的问题，比如此次谈及的“全局排除”功能。

​       之前包括现在都在经历这样的事情，想禁止一个依赖被依赖进来，如果这个依赖属于冷门的依赖，很少类库会间接依赖它，那么进行一次排除完全OK，但是如果一个依赖是热门依赖，比如常用的apache的commons系列工具库，单独排除也可以实现，只是比较啰嗦，而且以后引入新的依赖就要时刻关心是否会带来不被允许的依赖，对维护人员来说简直是灾难。

​       首先谈下为什么有些依赖是一定不能允许的。在[日志详解](http://ieye.iteye.com/blog/1924215)的博文中已经提到了依赖的一个典型特性——**互斥，就是说有的依赖之间是不能共存的**，比如提到过的slf4j-log4j和logback，guava和google-collection等等，一旦应用选择了使用logback就不能再引入slf4j-log4j依赖，原因可以看日志详解，而guava和google-collection会存在jar冲突，这样的例子还有很多。所以对于经常碰到这种冲突的开发人员来说，强烈希望改善这种局面。



## 防御方式插件maven-enforcer-plugin

​       想象下这样一个场景：你的应用不能依赖slf4j-log4j，别的开发不清楚，引入了其他类库，间接引入了这个依赖，之后应用除了问题，你负责去排查，看到了这个问题，排除了slf4j-log4j，收工。那下次出现了，你再去排除一次，那下下次，嗯哼......对了，我们需要全局声明下，这个依赖不能进来，好想法，只是......可惜......maven目前还不支持，虽然承诺未来会支持(最新的3.1.0依然未提供)。那能不能让我做了一次排除之后可以有个地方记录下确实不能有这个依赖进来，如果出现的话，构建神马的操作就报错提示。嗯，好想法，maven插件可以这个，写个吧。好在maven提供了相应的插件——[maven-enforcer-plugin](http://maven.apache.org/plugins/maven-enforcer-plugin/)，去尝试帮助开发人员解决这个问题，其中一项比较有用的功能是[bannedDependencies](http://maven.apache.org/enforcer/enforcer-rules/bannedDependencies.html)，可以设置依赖黑白名单，如果有依赖匹配了黑名单中的依赖设置，那么maven会停止(可以配置)当前操作(打包构建，甚至是mvn eclipse:eclipse)，打印错误日志提示，配置的样式如下：

```
<plugin>  
    <groupId>org.apache.maven.plugins</groupId>  
    <artifactId>maven-enforcer-plugin</artifactId>  
    <executions>  
      <execution>  
        <id>enforce-versions</id>  
        <goals>  
          <goal>enforce</goal>  
        </goals>  
        <configuration>  
          <rules>  
            <requireMavenVersion>  
              <version>2.1.0</version>  
            </requireMavenVersion>  
            <requireJavaVersion>  
              <version>1.6</version>  
            </requireJavaVersion>  
          </rules>  
        </configuration>  
      </execution>  
      <execution>  
        <id>enforce-banned-dependencies</id>  
        <goals>  
          <goal>enforce</goal>  
        </goals>  
        <configuration>  
          <rules>  
            <bannedDependencies>  
              <excludes>  
                <exclude>junit:junit</exclude>  
                <exclude>org.testng:testng</exclude>                              
                <exclude>com.google.collections:google-collections</exclude>  
                <exclude>commons-logging:commons-logging</exclude>  
              </excludes>  
              <includes>  
                <include>junit:junit:4.8.2:jar:test</include>  
                <include>cglib:cglib-nodep:jar:2.2</include>  
              </includes>  
            </bannedDependencies>  
          </rules>  
          <fail>true</fail>  
        </configuration>  
      </execution>  
    </executions>  
</plugin>
```

从这个插件配置上可以看出，还可以限制java版本以及maven版本。重点看看对依赖黑白名单的生命，黑名单中规定不能引入commons-logging，那么一旦依赖了这个，操作会提示，至于是不是会停止操作，取决于下边fail标签中的配置。比较特殊的是黑名单中排除了junit，而白名单中更加详细地描述junit，这个可以这么解读：不允许依赖junit，除了版本是4.8.2的scope为test的junit，从此可以看出，**白名单是对黑名单的补充，**这样更加灵活。当我看到这个插件的时候，它还在襁褓中(beta版)，但是强烈吸引到了我的注意，这娃必成大器。使用这个，就可以只排除一次冲突，并记录到黑白名单，下次被破坏的时候，自然会提示信息，这样算是把经验总结下来，一次辛苦，万世留名，我们系统到现在还在使用这个，利器。

 



## 全局排除不推荐，会产生“垃圾”依赖

​       到此，看起来我们解决这个全局排除的难题，真的吗？仔细想想，这个也只是一个防御的方式，正像之前说的一样，一个热门的依赖会经常被间接依赖进来，那是不是会经常就构建失败了，有木有一种方式更加彻底(让不允许被依赖的jar直接进不来)呢？当然，方法是有的。不过在讲这个之前，还是得穿插一下maven依赖仲裁的原则：maven在解析依赖的时候，有两个原则，**第一原则是路径最短有限原则**，例如A-->B-->C-1.0(A依赖B，B依赖C的1.0版本)，同时A-->D-->E-->C-2.0，那么从A来看，最终会依赖C的1.0版本进来，因为路径最短，最可信，这个例子也推翻了“高版本覆盖低版本”的错误言论。**第二原则是优先声明原则(pom中的声明顺序)，这是对第一原则的补充，就是路径长度相同(第一原则好无力)的情况下，第二原则开始决策微调**，不过这个原则是在**maven2.1.0**才加入的，之前的版本如果第一原则无力的情况下，就是不可调控的，所以码农门升级吧。原则清楚之后，我们就拿阐述第一原则的例子开始，加入A就是你的应用，C就是不允许被依赖进来的一个依赖，咋办？排除&加入黑名单。嗯，很好。那如果我根据第一原则，在A的pom中直接声明C呢？啥？你疯啦？不允许依赖，你还直接声明之？嗯，我确实不想活了，看下声明

```
<dependency>  
    <groupId>C</groupId>  
    <artifactId>C</artifactId>  
    <version>2.0</version>  
</dependency>
```

这样是不是意味着，间接依赖的C都不顶用了，但是直接依赖了C，还是违背了不能依赖C的大前提，好，继续看下，把依赖声明改下

```
<dependency>  
    <groupId>C</groupId>  
    <artifactId>C</artifactId>  
    <version>2.0</version>  
    <scope>provided</scope>  
</dependency>
```

啊哈，这样C就不会打进最终的war包啦，也就间接起到了“全局排除”的目的。但是这样会给人造成迷惑，为什么是2.0，其实这个版本号已经没有任何含义了。但是问题还是在的，虽然声明了provided，但是编译时，这个jar依然还会出现在classpath下的，那代码依然开始可以引用的。那就再进一步，弄一个C的空壳，里边啥都没有，比如可以自己新建一个空的maven工程，**C:C：empty_version，然后上传到私服(一般公司都会有自己的私服的)上，引用的地方改成把版本改成empty_version。这样对于A来说，因为是直接依赖C的empty_version版本，那么间接依赖全部自动被仲裁掉了，以后也不用担心别人引入依赖间接导致问题了**。这样的做法并不完美，毕竟需要在私服上上传一个“垃圾”依赖，应用代码还需要直接依赖这个“垃圾”依赖。



## 小结

综合黑白名单的方式和最后一种方式，总结下，如何结合使用。**对于不那么热门的依赖，建议走黑白名单**，毕竟很少出现，出现一次，手工排除下很简单。**对于热门的依赖，也分下情况**，像guava&google-collections这种情况，因为前者的代码是后者的超集，所以当依赖了guava的情况下，可以直接声明google-collections为provided，不需要上传一个空包，但是假如guava删掉了一些api，即它不再是超集的时候，就会出现问题。像logback&slf4j-log4j&slf4j-jdk14这种依赖，**没有谁是谁的子集的说法，所以建议直接上传空包排除即可**。当然这些原则还是需要开发者自己去权衡的。一定不是“一刀切”的原则，一刀切固然可以很好执行，但是往往不是最优的，两者或者多者结合，取长补短才是合理的，但是也会带来迷惑，因为有了选择。不过可以参考上边的总结，我们的应用也是两者结合的方式，选择的原则也是按照上边描述的，当然，最终的选择权还是交给你，enjoy it。

来源： <https://my.oschina.net/liuyongpo/blog/177301>