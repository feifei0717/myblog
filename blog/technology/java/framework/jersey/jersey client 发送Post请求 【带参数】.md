service端：

```
@Path("/hello")  
public class HelloService {  
    @GET  
    @Produces("text/plain")  
    public String helloWorld(){  
        return "hello world";  
    }  
    /* 
     * post param  test 
     */  
    @POST     
    @Path("echo")  
    @Consumes("application/x-www-form-urlencoded")    
    public String echo(@FormParam("msg") String msg){  
        return "are you say "+msg;  
    }  
    /* 
     * get param test 
     */  
    @GET  
    @Path("sex")  
    @Produces("text/plain")  
    public String getSex(@PathParam("name") String name){  
        return "male";  
    }  
      
    /* 
     * get {} request  
     * http://houfeng:8080/jerseyWebServiceTest/services/hello/age/houfeng 
     */  
    @GET  
    @Path("age/{name}")  
    @Produces("text/plain")  
    public String getAge(@PathParam("name") String name){  
        return "18";  
    }  
      
      
    /* 
     * get {} request 
     * http://houfeng:8080/jerseyWebServiceTest/services/hello/223232323 
     */  
    @GET  
    @Path ("{id}")  
    @Produces ("application/xml")  
    public StreamingOutput retrieveCustomer(@PathParam ("id") String customerId) {  
        String customerDetails = "hou,feng,232";   
        final String[] details = customerDetails.split(",");   
        return new StreamingOutput() {    
            public void write(OutputStream outputStream) {    
                PrintWriter out = new PrintWriter(outputStream);  
                out.println("<?xml version=/"1.0/" encoding=/"UTF-8/"?>");  
                out.println("<customer>");  
                out.println("<firstname>" + details[0] + "</firstname>");  
                out.println("<lastname>" + details[1] + "</lastname>");  
                out.println("<zipcode>" + details[2] + "</zipcode>");  
                out.println("</customer>");  
                out.close();  
            }   
        };   
    }  
      
      
    // get  vs  post   
      
    @GET  
    @Path("test_get")  
    @Produces("text/plain")  
    public String getTest1(@PathParam("name") String name, @Context HttpServletRequest request){  
        System.out.println("name:"+name);// null  
        String result;  
        result = request.getParameter("name");  
        System.out.println("name="+result); //houfeng  
        result+= "--------"+request.getContextPath();   
        return result;  
    }  
      
    /* 
     * get 方式 正确的获取参数方法 @QueryParam 或者 用 request； url里有参数的用PathParam 
     */  
    @GET  
    @Path("test_get2")  
    @Produces("text/plain")  
    public String getTest11(@QueryParam("name") String name, @Context HttpServletRequest request){  
        System.out.println("name:"+name);// houfeng  
        String result;  
        result = request.getParameter("name");  
        System.out.println("name="+result); //houfeng    
        result+= "--------"+request.getContextPath();   
        return result;  
    }  
   
      
    @POST  
    @Path("test_post1")  
    @Consumes("application/x-www-form-urlencoded")   
    @Produces("text/plain")  
    public String getTest2(@FormParam("name") String name){   
        System.out.println(name);//houfeng  
        String result=name;    
        return result;  
    }  
      
    @POST  
    @Path("test_post2")  
    @Consumes("application/x-www-form-urlencoded")   
    @Produces("text/plain")  
    public String getTest22(@QueryParam("name") String name){  
        System.out.println("name:"+name);//houfeng,但是有警告。提示用FormParam  
        String result = name;   
        return result;  
    }  
      
      
    @POST  
    @Path("test_post3")   
    @Produces("text/plain")  
    public String getTest2222(String entity, @Context HttpServletRequest request){  
        System.out.println("entity:"+entity);//hello 传入方式：resource.entity("hello").post(String.class);  
        String result;   
        result= "--------"+request.getContextPath();   
        return result;  
    }  
      
    @POST  
    @Path("test_post4")  
    //@Consumes("application/xml"),这样就会出错；@Consumes("application/x-www-form-urlencoded") 可以。  
    @Produces("text/plain")  
    public String getTest22222(InputStream is, @Context HttpServletRequest request) throws Exception{  
        byte[] buf = new byte[is.available()];  
        is.read(buf);  
        System.out.println("buf:"+new String(buf));  
        String result;   
        result= "--------"+request.getContextPath();   
        return result;  
    }  
```

 

客户端可以采用两种方式测试。

1，采用jersey实现的测试api：[jersey-twitter-client-1.0-SNAPSHOT-jar-with-dependencies.jar ](file:///E:/eclipse_workspace/WebService/jerseyClientTest/lib/jersey-twitter-client-1.0-SNAPSHOT-jar-with-dependencies.jar)

2，采用apache httpclient 模拟客户端的各种请求。

上面提到的参考e文中是采用的第二种方式。在这里我使用jersey测试api来实现。

```
public  void testHelloService() throws URISyntaxException {  
    Client client = Client.create();  
    URI u = new URI("http://houfeng:8080/jerseyWebServiceTest/services/hello");  
    System.out.println(u);  
    WebResource resource = client.resource(u);  
    //get  
    String result = resource.get(String.class);  
    System.out.println(result);  
      
    //get param  
    u = new URI("http://houfeng:8080/jerseyWebServiceTest/services/hello/sex");  
    System.out.println(u);  
    resource = client.resource(u);  
    MultivaluedMapImpl params = new MultivaluedMapImpl();  
    params.add("name", "houfeng");  
    result = resource.queryParams(params).get(String.class);  
    System.out.println(result);  
      
    u =new URI("http://houfeng:8080/jerseyWebServiceTest/services/hello/test_get");  
    System.out.println(u);  
    resource = client.resource(u);  
    params = new MultivaluedMapImpl();  
    params.add("name", "houfeng");  
    result = resource.queryParams(params).get(String.class);  
    System.out.println(result);  
      
    u =new URI("http://houfeng:8080/jerseyWebServiceTest/services/hello/test_get2");  
    System.out.println(u);  
    resource = client.resource(u);  
    params = new MultivaluedMapImpl();  
    params.add("name", "houfeng");  
    result = resource.queryParams(params).get(String.class);  
    System.out.println(result);  
  
      
    u =new URI("http://houfeng:8080/jerseyWebServiceTest/services/hello/test_post1");  
    System.out.println(u);  
    resource = client.resource(u);  
    params = new MultivaluedMapImpl();  
    params.add("name", "houfeng");  
    result = resource.type(MediaType.APPLICATION_FORM_URLENCODED).post(String.class,params);  
    System.out.println(result);  
      
    u =new URI("http://houfeng:8080/jerseyWebServiceTest/services/hello/test_post2");  
    System.out.println(u);  
    resource = client.resource(u);  
    params = new MultivaluedMapImpl();  
    params.add("name", "houfeng");  
    result = resource.queryParams(params).type(MediaType.APPLICATION_FORM_URLENCODED).post(String.class);  
    System.out.println(result);  
      
    u =new URI("http://houfeng:8080/jerseyWebServiceTest/services/hello/test_post3");  
    System.out.println(u);  
    resource = client.resource(u);   
    result = resource.entity("hello").post(String.class);  
    System.out.println(result);  
      
    u =new URI("http://houfeng:8080/jerseyWebServiceTest/services/hello/test_post4");  
    System.out.println(u);  
    resource = client.resource(u);   
    String buf = "inputstream content.";  
    ByteArrayInputStream bais = new ByteArrayInputStream(buf.getBytes());  
    result = resource.entity(bais).post(String.class);  
    System.out.println(result);  
}  
```

 

过程中遇到的问题就是提交流的时候，错误的参考了e文中 “@Consumes ( "application/xml" ) ”的请求类型！ 结果导致service 端 接受请求的方法参数InputStream 得不到内容。换作@Context HttpServeltRequest request 参数也无济于事。于是在网上搜索，在一个国外论坛中有人提到相似的问题“上传文件得不到流里的内容，但是jetty里可以，tomcat里不可以。？”。好像没有太大参考，但我也试了下，还是失败。。。
今天修改提交类型注解为：@Consumes("application/x-www-form-urlencoded") ，测试通过！终于才恍然大悟：application/xml是客户端接受的内容类型。哎，是应该学习下http协议的相关知识，这样的问题耽误了大半天的时间！

另外，对于jax-ws中几个注解，简单总结下：
       QueryParam--url ? 后面表示的参数  .  get post 通用.
       PathParam---url中的一部分，例如用{}表示的url中的一部分。get post 通用。
       FormParam---post提交的form表单参数。     用于 post     


来源： <http://blog.csdn.net/wwwyuanliang10000/article/details/20391607>