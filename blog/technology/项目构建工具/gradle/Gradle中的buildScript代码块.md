在编写Gradle脚本的时候，在build.gradle文件中经常看到这样的代码：

```
buildScript {
     repositories {
         mavenCentral()
     }
}
repositories {
     mavenCentral()
}
```

这样子很容易让人奇怪，为什么repositories要声明两次哪？buildscript代码块中的声明与下半部分声明有什么不同？

其实答案非常简单。buildscript中的声明是gradle脚本自身需要使用的资源。可以声明的资源包括依赖项、第三方插件、maven仓库地址等。而在build.gradle文件中直接声明的依赖项、仓库地址等信息是项目自身需要的资源。

gradle是由groovy语言编写的，支持groovy语法，可以灵活的使用已有的各种ant插件、基于jvm的类库，这也是它比maven、ant等构建脚本强大的原因。虽然gradle支持开箱即用，但是如果你想在脚本中使用一些第三方的插件、类库等，就需要自己手动添加对这些插件、类库的引用。而这些插件、类库又不是直接服务于项目的，而是支持其它build脚本的运行。所以你应当将这部分的引用放置在buildscript代码块中。gradle在执行脚本时，会优先执行buildscript代码块中的内容，然后才会执行剩余的build脚本。

举个例子，假设我们要编写一个task，用于解析csv文件并输出其内容。虽然我们可以使用gradle编写解析csv文件的代码，但其实apache有个库已经实现了一个解析csv文件的库供我们直接使用。我们如果想要使用这个库，需要在gradle.build文件中加入对该库的引用。

```
buildscript {
    repositories {
        mavenLocal()
        mavenCentral()
    }
    dependencies {
        classpath 'org.apache.commons:commons-csv:1.0'
    }
}
import org.apache.commons.csv.*
task printCSV() {
    doLast {
        def records = CSVFormat.EXCEL.parse(new FileReader('config/sample.csv'))
        for (item in records) {
            print item.get(0) + ' '
            println item.get(1)
        }
    }
}
```

buildscript代码块中的repositories和dependencies的使用方式与直接在build.gradle文件中的使用方式几乎完全一样。唯一不同之处是在buildscript代码块中你可以对dependencies使用classpath声明。该classpath声明说明了在执行其余的build脚本时，class loader可以使用这些你提供的依赖项。这也正是我们使用buildscript代码块的目的。

而如果你的项目中需要使用该类库的话，就需要定义在buildscript代码块之外的dependencies代码块中。所以有可能会看到在build.gradle中出现以下代码：

```
repositories {
    mavenLocal()
    mavenCentral()
}
dependencies {
    compile 'org.springframework.ws:spring-ws-core:2.2.0.RELEASE',
            'org.apache.commons:commons-csv:1.0'
}
buildscript {
    repositories {
        mavenLocal()
        mavenCentral()
    }
    dependencies {
        classpath 'org.apache.commons:commons-csv:1.0'
    }
}
import org.apache.commons.csv.*
task printCSV() {
    doLast {
        def records = CSVFormat.EXCEL.parse(new FileReader('config/sample.csv'))
        for (item in records) {
            print item.get(0) + ' '
            println item.get(1)
        }
    }
}

```

官方具体解释请参见：<http://chimera.labs.oreilly.com/books/1234000001741/ch04.html#_buildscript_dependencies>

作者：[黄博文](http://www.cnblogs.com/huang0925)[@无敌北瓜](http://www.weibo.com/hbw0925) 
出处：<http://www.cnblogs.com/huang0925>
[黄博文的地盘](http://www.huangbowen.net/)

来源： <http://www.cnblogs.com/huang0925/p/3940528.html?utm_source=tuicool&utm_medium=referral>