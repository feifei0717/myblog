# maven依赖本地非repository中的jar包 

 
今天在使用maven编译打包一个web应用的时候，碰到一个问题： 
项目在开发是引入了依赖jar包，放在了WEB-INF/lib目录下，并通过buildpath中将web libariary导入。 
在eclipse中开发没有问题，但是使用maven编译插件开始便宜总是报找不到WEB-INF/lib这个jar包中的类。 
显然实在编译的时候WEB-INF/lib并没有配置到maven-complier-plugin插件src目录中去， 
于是将这个目录添加进去，还是不好使。无赖，先把这个jar包安装到本地库中，然后添加dependency。 
后来google了下，发现maven提供了scope为system的依赖，文档的原文如下： 
system 
This scope is similar to provided except that you have to provide the JAR which contains it explicitly. 
The artifact is always available and is not looked up in a repository. 
这样就可以添加dependency而不需要再将WEB-INF/lib目录下的jar包安装到本地库中了。 
具体配置录下: 
Xml代码 

```
<dependency> 
<groupId>org.apache</groupId> 
<artifactId>test</artifactId> 
<version>1.0</version> 
<scope>system</scope> 
<systemPath>${basedir}/src/main/webapp/WEB-INF/lib/paypal_base.jar</systemPath> 
</dependency> 
```

注意:

- provided和system是没有传递性的，也就是说，如果你依赖的某个jar包，它的某个jar的范围是provided，那么该jar不会在你的工程中依靠jar依赖传递加入到你的工程中。
- provided和system具有继承性，上面的情况，如果需要统一配置一个组织的通用的provided依赖，可以使用parent，然后在所有工程中继承。





！更好的方式是配置编译参数\<compilerArguments>，添加extdirs将jar包相对路径添加到配置中，如下：

```
<build>
        <plugins>
            <plugin>
              <artifactId>maven-compiler-plugin</artifactId>
              <configuration>
                  <source>1.6</source>
                  <target>1.6</target>
                  <encoding>UTF-8</encoding>
                  <compilerArguments>
                   <extdirs>src\main\webapp\WEB-INF\lib</extdirs>
                 </compilerArguments>
              </configuration>
            </plugin>
        </plugins>
    </build>
```

来源： <http://www.mamicode.com/info-detail-169419.html>