*目录[-]*

[从一个已有项目生成一个archetype](http://my.oschina.net/u/1451028/blog/495699#OSC_h2_1)

什么是Maven Archetype? 简单的说就是一个Maven项目的基础模板，利用这个模板我们就可快速的建立一个新的该类型项目，同时也可以建立自己的项目骨架。
Maven所提供的archetype功能都是由插件Maven Archetype Plugin完成的
官网地址：<http://maven.apache.org/archetype/maven-archetype-plugin/>

主要命令：

- archetype:generate   从项目骨架创建一个maven项目，老版本里使用的是archetype:create 
- archetype:create-from-project  根据一个项目创建项目骨架

**使用archetype:generate创建项目**

 mvn archetype:generate命令参数解释
项目相关参数:

| 参数         | 含义                                       |
| ---------- | ---------------------------------------- |
| groupId    | 当前应用程序隶属的Group的ID                        |
| artifactId | 当前应用程序的ID                                |
| package    | 代码生成时使用的根包的名字，如果没有给出，默认使用archetypeGroupId |

原型有关参数表

| 参数                  | 含义                                       |
| ------------------- | ---------------------------------------- |
| archetypeGroupId    | 原型（archetype）的Group ID                   |
| archetypeArtifactId | 原型（archetype）ID                          |
| archetypeVersion    | 原型（archetype）版本                          |
| archetypeRepository | 包含原型（archetype）的资源库                      |
| archetypeCatalog    | archetype分类，这里按位置分类有:‘local’  本地，通常是本地仓库的archetype-catalog.xml文件‘remote’  远程，是maven的中央仓库file://...' 直接指定本地文件位置archetype-catalog.xmlhttp://...' or 'https://...'  网络上的文件位置 archetype-catalog.xml'internal'**默认值是remote，local** |
| filter              | 查找时过滤artifactId or groupId:artifactId    |
| package             | 代码生成时使用的根包的名字，如果没有给出，默认使用archetypeGroupId |

命令示例：
新建一个简单web项目
mvn archetype:generate -DgroupId=com.charles 
​                       -DartifactId=webappdemo
​                       -Dpackage=com.charles.webappdemo
​                       -DarchetypeArtifactId=maven-archetype-webapp 
​                       -Dversion=1.0 -DinteractiveMode=No

新建一个struts2 web项目
mvn archetype:generate -B -DgroupId=com.mycompany.mysystem
​                            -DartifactId=myWebApp
​                            -DarchetypeGroupId=org.apache.struts
​                            -DarchetypeArtifactId=struts2-archetype-convention
​                            -DarchetypeVersion=<CURRENT_STRUTS_VERSION>
​                            -DremoteRepositories=http://struts.apache.org
maven默认提供的archetype类型可以参考<http://maven.apache.org/guides/introduction/introduction-to-archetypes.html>

## 从一个已有项目生成一个archetype

mvn clean archetype:create-from-project -Darchetype.properties=./archetype.properties -Darchetype.filteredExtentions=java,xml,jsp,properties,sql

这里首先定义了一个archetype.properties文件在命令行被执行的目录，里面的内容是
tablePrefix是QucikStart项目里用到的，想在新项目中替换掉的内容。
-DfilteredExtentions，因为maven默认不会扫描sql文件，而这里是希望修改tablePrefix的.
properties参考<http://maven.apache.org/archetype/maven-archetype-plugin/create-from-project-mojo.html>

来源： <http://my.oschina.net/u/1451028/blog/495699>