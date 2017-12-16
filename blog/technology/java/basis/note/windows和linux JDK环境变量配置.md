#  windows和linux JDK环境变量配置

## JDK环境变量配置的步骤如下：

- 我的电脑-->属性-->高级-->环境变量.

- 配置用户变量:

```
　　　　　　　　a.新建 JAVA_HOME

　　　　　　　　　　   D:\java\jdk1.7.0 （JDK的安装路径）

　　　　　　　　b.新建 PATH

　　　　　　　　　　　  %JAVA_HOME%\bin;%JAVA_HOME%\jre\bin

　　　　　　　　c.新建 CLASSPATH

　　　　　　　　　　　 .;%JAVA_HOME%\lib;%JAVA_HOME%\lib\tools.jar
```

- 测试环境变量配置是否成功：

```
　　　开始-->运行--〉CMD

　　　键盘敲入： JAVAC   JAVA

　　　　　　　　出现相应的命令，而不是出错信息，即表示配置成功！
```



## 环境变量配置的理解：

- PATH环境变量。作用是指定命令搜索路径，在i命令行下面执行命令如javac编译java程序时，它会到PATH变量所指定的路径中查找看是否能找到相应的命令程序。我们需要把jdk安装目录下的bin目录增加到现有的PATH变量中，bin目录中包含经常要用到的可执行文件如javac/java/javadoc等待，设置好PATH变量后，就可以在任何目录下执行javac/java等工具了。


- CLASSPATH环境变量。作用是指定类搜索路径，要使用已经编写好的类，前提当然是能够找到它们了，JVM就是通过CLASSPTH来寻找类的。我们需要把jdk安装目录下的lib子目录中的dt.jar和tools.jar设置到CLASSPATH中，当然，当前目录“.”也必须加入到该变量中。


- JAVA_HOME环境变量。它指向jdk的安装目录，Eclipse/NetBeans/Tomcat等软件就是通过搜索JAVA_HOME变量来找到并使用安装好的jdk。


```
linux:
#set java environment
JAVA_HOME=/usr/local/java/jdk1.7.0_67
PATH=$PATH:$JAVA_HOME/bin
CLASSPATH=.:$JAVA_HOME/lib/dt.jar:$JAVA_HOME/lib/tools.jar
export JAVA_HOME CLASSPATH PATH


# Set JBoss Variables
JBOSS_HOME=/usr/jboss/jboss-4.2.3.GA
PATH=$PATH:$JBOSS_HOME/bin
export JBOSS_HOME PATH
```