 

# Spring 4 MVC 单元测试例子



首先，要有一个Spring MVC项目，不会的话，[点这里看教程](http://blog.csdn.net/ruangong1203/article/details/50479810)。

加入 maven 依赖：

```
    <dependency>
        <groupId>junit</groupId>
        <artifactId>junit</artifactId>
        <version>4.11</version>
    </dependency>

<!-- spring test -->
    <!-- 提供测试支持--> 
    <dependency>
        <groupId>org.springframework</groupId>
        <artifactId>spring-test</artifactId>
        <version>4.2.4.RELEASE</version>
    </dependency> 
```

被测试的类：SayHelloController。这个类不用改动，只是贴出来表明，通过 `/SayHello/getAnswer` 就可以访问到 `helloWorld()`方法

```
@Controller
@RequestMapping("/SayHello")
public class SayHelloController {   

    @RequestMapping( path = "/getAnswer" , method = RequestMethod.GET)
    public String helloWorld() {
        return "redirect:/answer.jsp";
    }

} 
```

测试类：SayHelloControllerTest。按 ctrl+o 导入依赖。

```
@RunWith(SpringJUnit4ClassRunner.class)
@WebAppConfiguration
@ContextConfiguration(locations={"classpath:applicationContext.xml","classpath:spring-servlet.xml"})
public class SayHelloControllerTest {

    @Autowired
    private WebApplicationContext wac;

    private MockMvc mockMvc;

    @Before
    public void setup()  {
        this.mockMvc = MockMvcBuilders.webAppContextSetup(this.wac).build();
    }

    @Test
    public void testHelloWorld() throws Exception {
        mockMvc.perform(get("/SayHello/getAnswer"))
        .andDo(print())
        .andExpect(status().is3xxRedirection())
        .andExpect(redirectedUrl("/answer.jsp"));
    }

} 
```

> **注意：** 如果你的spring 和spring mvc 配置文件放在 /WEB-INF/ 目录下，那么选中 /WEB-INF/ 目录，“右键”–“build path”– “use as source folder” ，将两个配置文件加入到 classes目录下，因为 `classpath:`要求配置文件在classes目录下。 
> 上面代码中的get方法需要静态引入，添加引入语句如下： 
> import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;

完了，要做的只有这么多：增加依赖项，然后写一个测试类。可以通过 run as junit test 来看下效果。

上面的代码，可以看成一个模板+一个测试方法，模板如下：

```
@RunWith(SpringJUnit4ClassRunner.class)
@WebAppConfiguration
@ContextConfiguration(locations={"classpath:applicationContext.xml","classpath:spring-servlet.xml"})
public class SayHelloControllerTest {

    @Autowired
    private WebApplicationContext wac;

    private MockMvc mockMvc;

    @Before
    public void setup()  {
        this.mockMvc = MockMvcBuilders.webAppContextSetup(this.wac).build();
    }


    // 下面写测试方法


} 
```

这个模板，只要改变配置文件的位置，其它不用动。模板代码的作用就是创建模拟的测试环境。

测试方法如下：

```
@Test
    public void testHelloWorld() throws Exception {
        mockMvc.perform(get("/SayHello/getAnswer"))
        .andDo(print())
        .andExpect(status().is3xxRedirection())
        .andExpect(redirectedUrl("/answer.jsp"));
    } 
```

上面这段代码，用 `perform(get("/SayHello/getAnswer"))` 发送一个请求，这个请求和真正的请求一样，会经过`DispatcherServlet`，然后调用被测试类`SayHelloController` 的`helloWorld()`方法。

`.andDo(print())`是当请求执行完后，执行打印所有相关信息动作。`print()`是一个静态方法，来自`MockMvcResultHandlers` 。

`.andExpect(status().is3xxRedirection())`。.andExpect( 预期）判断实际响应与预期是否相等。比如这里，我断言发送`/SayHello/getAnswer`请求后，会返回一个响应，响应状态为3XX重定向。如果测试中，实际返回的是3XX重定向，这个方法不会出现问题，但如果返回的不是3XX，那么这个方法就会抛出异常，我们就知道被测试的类可能某个地方出现问题了。

------

[项目代码](http://pan.baidu.com/s/1pJRRm3p)



http://blog.csdn.net/ruangong1203/article/details/50499635