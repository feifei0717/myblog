maven导出项目依赖的jar包

分类: code_manager
日期: 2014-11-17

原文地址: 

http://blog.chinaunix.net/uid-29632145-id-4628408.html

------

****[maven导出项目依赖的jar包]() *2014-11-17 16:46:46*

分类： Java

## 一、导出到默认目录 targed/dependency 

​    从Maven项目中导出项目依赖的jar包：进入工程pom.xml 所在的目录下，执行如下命令：
​        mvn dependency:copy-dependencies  

点击运行

​      maven项目所依赖的jar包会导出到targed/dependency目录中。

## 二、导出到自定义目录中

​    在maven项目下创建lib文件夹，输入以下命令：、
​        mvn dependency:copy-dependencies -DoutputDirectory=lib 

​    maven项目所依赖的jar包都会复制到项目目录下的lib目录下

## 三、设置依赖级别

​    同时可以设置依赖级别，通常使用compile级别
​        mvn dependency:copy-dependencies -DoutputDirectory=lib   -DincludeScope=compile 