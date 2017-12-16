示例一：

maven resources插件使用：

第一个resource表示：在src/main/resources目录下将xml、properties结尾的文件复制到${project.build.directory}/classes目录下

```
        <resources>
            <resource>
                <targetPath>${project.build.directory}/classes</targetPath>
                <directory>src/main/resources</directory>
                <filtering>true</filtering>
                <includes>
                    <include>**/*.xml</include>
                    <include>**/*.properties</include>
                </includes>
            </resource>
            <!-- Spring Container自动加载META-INF/spring目录下的所有Spring配置 把配置复制到加载的目录-->
            <resource>
                <targetPath>${project.build.directory}/classes/META-INF/spring</targetPath>
                <directory>src/main/resources/spring</directory>
                <filtering>true</filtering>
                <includes>
                    <include>spring-context.xml</include>
                </includes>
            </resource>
        </resources>
```

示例二：

```
<resources>  
    <!-- Filter jdbc.properties & mail.properties. NOTE: We don't filter applicationContext-infrastructure.xml,   
        let it go with spring's resource process mechanism. -->  
    <resource>  
        <directory>src/main/resources</directory>  
        <filtering>true</filtering>  
        <includes>  
            <include>jdbc.properties</include>  
            <include>mail.properties</include>  
        </includes>  
    </resource>  
    <!-- Include other files as resources files. -->  
    <resource>  
        <directory>src/main/resources</directory>  
        <filtering>false</filtering>  
        <excludes>  
            <exclude>jdbc.properties</exclude>  
            <exclude>mail.properties</exclude>  
        </excludes>  
    </resource>  
</resources>  
```

说明：其中第一段<resource>配置声明：在src/main/resources目录下，仅jdbc.properties和mail.properties两个文件是资源文件，然后，这两个文件需要被过滤。而第二段<resource>配置声明：同样在src/main/resources目录下，除jdbc.properties和mail.properties两个文件外的其他文件也是资源文件，但是它们不会被过滤。