# [spring boot项目打包成war并在tomcat上运行的步骤](http://blog.csdn.net/yalishadaa/article/details/70037846)




> 把[spring](http://lib.csdn.net/base/javaee)-boot项目按照平常的web项目一样发布到tomcat容器下

## 一、修改打包形式

> 在pom.xml里设置 `<packaging>war</packaging>`

## 二、移除嵌入式tomcat插件

> 在pom.xml里找到`spring-boot-starter-web`依赖节点，在其中添加如下代码，

```
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
    <!-- 移除嵌入式tomcat插件 -->
    <exclusions>
        <exclusion>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-tomcat</artifactId>
        </exclusion>
    </exclusions>
</dependency>

```

## 三、添加servlet-api的依赖

> 下面两种方式都可以，任选其一

```
<dependency>
    <groupId>javax.servlet</groupId>
    <artifactId>javax.servlet-api</artifactId>
    <version>3.1.0</version>
    <scope>provided</scope>
</dependency>

```

------

```
<dependency>
    <groupId>org.apache.tomcat</groupId>
    <artifactId>tomcat-servlet-api</artifactId>
    <version>8.0.36</version>
    <scope>provided</scope>
</dependency>

```

## 四、修改启动类，并重写初始化方法

> 我们平常用main方法启动的方式，都有一个App的启动类，代码如下：

```
@SpringBootApplication
public class Application {
    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }
}

```

> 我们需要类似于web.xml的配置方式来启动spring上下文了，在Application类的同级添加一个SpringBootStartApplication类，其代码如下:

```
/**
 * 修改启动类，继承 SpringBootServletInitializer 并重写 configure 方法，外部tomcat启动
 */
public class SpringBootStartApplication extends SpringBootServletInitializer {

    @Override
    protected SpringApplicationBuilder configure(SpringApplicationBuilder builder) {
        // 注意这里要指向原先用main方法执行的Application启动类
        return builder.sources(Application.class);
    }
}

```

## 五、打包部署

> 在项目根目录下（即包含pom.xml的目录），在命令行里输入： 
> `mvn clean package`即可， 等待打包完成，出现`[INFO] BUILD SUCCESS`即为打包成功。 
> 然后把target目录下的war包放到tomcat的webapps目录下，启动tomcat，即可自动解压部署。 
> 最后在浏览器中输入
>
> > `http://localhost:[端口号]/[打包项目名]/`
>
> 发布成功




原文地址: http://blog.csdn.net/javahighness/article/details/52515226