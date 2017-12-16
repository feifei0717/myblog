# mybatis 找不到映射器xml文件

**原因：(参考：http://www.linuxidc.com/Linux/2015-06/118877.htm)**

IDEA的maven项目中，默认源代码目录下的xml等资源文件并不会在编译的时候一块打包进classes文件夹，而是直接舍弃掉。

如果使用的是Eclipse，Eclipse的src目录下的xml等资源文件在编译的时候会自动打包进输出到classes文件夹。Hibernate和Spring有时会将配置文件放置在src目录下，编译后要一块打包进classes文件夹，所以存在着需要将xml等资源文件放置在源代码目录下的需求。 

楼主 终于解决这问题了  困扰我好久了

原因是： idea不会编译src的java目录的xml文件

所以解决思路就是：将IDEA maven项目中src源代码下的xml等资源文件编译进classes文件夹

具体操作方法就是：配置maven的pom文件配置，在<build>节点下添加<resources>代码：

```
<build>
    <!--配置Maven 对resource文件 过滤 -->
    <resources>
        <resource>
            <directory>src/main/java</directory>
            <includes>
                <include>**/*.xml</include>
            </includes>
        </resource>
    </resources>
</build>
```

来源： <http://www.zgxue.com/200/2002270.html>