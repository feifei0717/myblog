[TOC]



# 如何查看jar包的版本信息,获取jar版本

 

## 缘由：

需要知道一种通用的方法以获取jar包的版本信息，因此有了此文。

## 搜索关键字：

### how to check spring version

- <http://stackoverflow.com/questions/947586/need-spring-version-only-have-spring-jar-file>

### JAR 文件 规范

- <http://docs.oracle.com/javase/6/docs/technotes/guides/jar/jar.html>
- <http://docs.oracle.com/javase/7/docs/technotes/guides/jar/jar.html>
- <https://zh.wikipedia.org/wiki/Manifest%E8%B5%84%E6%BA%90%E9%85%8D%E7%BD%AE%E6%96%87%E4%BB%B6>

### 获取jar包版本信息

- <http://blog.csdn.net/xiaxiaorui2003/article/details/4582778>
- <http://blog.csdn.net/heng_ji/article/details/7058396>
- <http://docs.oracle.com/javase/7/docs/technotes/guides/jar/jar.html#The_META-INF_directory>
- <http://joshuasabrina.iteye.com/blog/1821406>
- <http://www.cnblogs.com/wych/p/4072913.html>
- <http://blog.csdn.net/isea533/article/details/49151139>
- [http://ifeve.com/maven-2/](http://ju.outofmemory.cn/entry/80438)

## 参考解答：

**JAR文件本质上是一个zip文件，包含一个可选的META-INF目录。 **多数情况下，JAR文件并不是类文件和/或资源文件的简单聚合档案。他们经常用作应用程序和扩展的构建基础。如果存在的话，META-INF目录用来存储包和扩展的配置数据，包括安全、版本、扩展和服务。

将jar包解压后读取文件： 
./META-INF/MANIFEST.MF 
即可找到对应的版本信息。

```
$ unzip -p catalina.jar "META-INF/MANIFEST.MF"
...
Manifest-Version: Defines the manifest file version. The value is a legitimate version number, as described in the above spec.
...
Signature-Version: Defines the signature version of the jar file. The value should be a valid version-number string.
...
Implementation-Version: The value is a string that defines the version of the extension implementation.
...
Specification-Version: The value is a string that defines the version of the extension specification.
...
```

==

```
// 下面这个是获取Spring版本信息的代码(http://stackoverflow.com/a/947679)
import org.springframework.core.SpringVersion;
public class VersionChecker
{
    public static void main(String [] args)
    {
        System.out.println("version: " + SpringVersion.getVersion());
    }
}
```

==

针对Maven管理的Jar包 
在 pom.properties 中包含了jar包的版本号信息。

==

针对ANT管理的Jar包 
在 build.xml 里建立一个存放版本号的属性，并 **在打Jar包时，将版本号压入MANIFEST文件 **。程序在执行的时候，读取Jar包的MANIFEST来获取版本号。

====

```
#查看jar包中都有哪些文件：
$ unzip -l catalina.jar
$ jar -tvf catalina.jar

#从 catalina.jar 中解压出文件 ServerInfo.properties (需要知道文件的路径信息)：
$ jar xf catalina.jar org/apache/catalina/util/ServerInfo.properties

#将修改后的文件重新打包至 catalina.jar 中：
$ jar uf catalina.jar org/apache/catalina/util/ServerInfo.properties

#示例 1: 将两个类文件归档到一个名为 classes.jar 的归档文件中:
$ jar cvf classes.jar Foo.class Bar.class

#示例 2: 使用现有的清单文件 'mymanifest' 并将 foo/ 目录中的所有文件归档到 'classes.jar' 中:
$ jar cvfm classes.jar mymanifest -C foo/ .
```

## 获取jar版本推荐方式:

随便找一个jar的类 ,ComposablePointcut是spring-aop-3.2.4.RELEASE.jar里面的类

```
String implementationVersion = ComposablePointcut.class.getPackage().getImplementationVersion();
```

 



http://ju.outofmemory.cn/entry/226175