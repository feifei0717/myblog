[TOC]

摘要: 主要是基于maven构建

## **Dubbo 服务的运行方式**

#### 使用Servlet 容器运行（Tomcat 、Jetty 等）

​    不可取 缺点如下：

- 增加复杂性（端口、管理）
- 浪费资源（内存)

####  自建Main 方法类来运行（Spring 容器）

​    不建议 (可用于测试、但是测试最好使用Junit) 缺点如下：

-  Dobbo 本身提供的高级特性没用上

- 自已编写启动类可能会有缺陷

- Junit测试代码可以如下写

  ​

  ```
  @RunWith(SpringJUnit4ClassRunner.class)
  @ContextConfiguration(locations = "classpath:spring/spring-context.xml")
  public class DubboProvider {
  	 @Test
  	 public void testStartRrgistry(){
  		 System.out.println("-----------1");
  		 synchronized (DubboProvider.class) {
  				while (true) {
  					System.out.println("-----------2");
  					try {
  						DubboProvider.class.wait();
  					} catch (InterruptedException e) {
  						e.printStackTrace();
  					}
  				}
  			}
  	 }
  }
  ```

- main方法的测试

  ​

  ```
  public class DubboProvider {	
  	private static final Log log = LogFactory.getLog(DubboProvider.class);
  	public static void main(String[] args) {
  		try {
  			ClassPathXmlApplicationContext context = new ClassPathXmlApplicationContext("classpath:spring/spring-context.xml");
  			context.start();
  		} catch (Exception e) {
  			log.error("== DubboProvider context start error:",e);
  		}
  		synchronized (DubboProvider.class) {
  			while (true) {
  				try {
  					DubboProvider.class.wait();
  				} catch (InterruptedException e) {
  					log.error("== synchronized error:",e);
  				}
  			}
  		}
  	}
      
  }
  ```

#### 使用Dubbo 框架提供的Main 方法类来运行（Spring 容器）

​    推荐使用，优点如下:

- 框架本身提供（com.alibaba.dubbo.container.Main）

- 可实现优雅关机（ShutdownHook）

  - Dubbo是通过JDK的ShutdownHook来完成优雅停机的，所以如果用户使用"kill -9 PID"等强制关闭指令，是不会执行优雅停机的，只有通过"kill PID"时，才会执行。

  - 服务提供方停止时，先标记为不接收新请求，新请求过来时直接报错，让客户端重试其它机器。然后，检测线程池中的线程是否正在运行，如果有，等待所有线程执行完成，除非超时，则强制关闭。

  - 服务消费方停止时，不再发起新的调用请求，所有新的调用在客户端即报错。然后，检测有没有请求的响应还没有返回，等待响应返回，除非超时，则强制关闭。

  - 设置优雅停机超时时间，缺省超时时间是10秒：(超时则强制关剂机)

    ​

    ```
    <dubbo:application ...>
        <dubbo:parameter key="shutdown.timeout" value="60000" /> <!-- 单位毫秒 -->
    </dubbo:application>
    ```

  - 如果ShutdownHook不能生效，可以自行调用：

    ​

    ```
    ProtocolConfig.destroyAll();
    ```

​    spring Container 加载

​        这里只讲Spring Container，如果更多的加载可以去dubbo官网查看。自动加载META-INF/spring目录下的所有Spring配置。

- 配置：(配在java命令-D参数或者dubbo.properties中)

  - dubbo.spring.config=classpath*:META-INF/spring/*.xml ----配置spring配置加载位置

- 基于maven的实现

  - 在build的resources增加(注意：发现resource没有继承，待研究)

    ```
    <!-- 把配置复制到加载的目录   Spring Container自动加载META-INF/spring目录下的所有Spring配置 -->
    <resource>
    	<targetPath>${project.build.directory}/classes/META-INF/spring</targetPath>
    	<directory>src/main/resources/spring</directory>
    	<filtering>true</filtering>
    	<includes>
    		<include>spring-context.xml</include>
    	</includes>
    </resource>
    ```

  - 在build的plugins增加

    ```
    <!-- 打包jar文件时，配置manifest文件，加入lib包的jar依赖 -->
    <plugin>
        <groupId>org.apache.maven.plugins</groupId>
        <artifactId>maven-jar-plugin</artifactId>
        <version>3.0.2</version>
        <configuration>
            <classesDirectory>target/classes/</classesDirectory>
            <archive>
                <manifest>
                    <!-- 指定使用的主类 -->
                    <mainClass>com.alibaba.dubbo.container.Main</mainClass>
                    <!-- 打包时 MANIFEST.MF文件不记录的时间戳版本 -->
                    <useUniqueVersions>false</useUniqueVersions>
                    <!-- 是否有依赖类 -->
                    <addClasspath>true</addClasspath>
                    <!-- 依赖的类路径，表示依赖的类型所存放的路径 -->
                    <classpathPrefix>lib/</classpathPrefix>
                </manifest>
                <manifestEntries>
                    <Class-Path>.</Class-Path>
                </manifestEntries>
            </archive>
        </configuration>
    </plugin>
    <!-- 解决依赖包的插件 -->
    <plugin>
        <groupId>org.apache.maven.plugins</groupId>
        <artifactId>maven-dependency-plugin</artifactId>
        <version>2.10</version>
        <executions>
            <execution>
                <id>copy-dependencies</id>
                <phase>package</phase>
                <goals>
                    <goal>copy-dependencies</goal>
                </goals>
                <configuration>
                    <type>jar</type>
                    <includeTypes>jar</includeTypes>
                    <useUniqueVersions>false</useUniqueVersions>
                    <outputDirectory> <!-- 依赖包输出的路径 -->
                        ${project.build.directory}/lib
                    </outputDirectory>
                </configuration>
            </execution>
        </executions>
    </plugin>
    ```

  - 修改Spring的配置文件(例如：spring-context.xml)，修改其中的import路径：

    ```
    <import resource="classptah:spring/spring-mybatis.xml" />
    <import resource="classptah:spring/dubbo-provider.xml" />
    ```



​            因为maven的pom配置文件中指定了配置文件打包的存放路径
来源： [https://my.oschina.net/longload/blog/717353](https://my.oschina.net/longload/blog/717353)