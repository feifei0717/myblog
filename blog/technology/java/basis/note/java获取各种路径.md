# java获取各种路径  路径不要有中文



### 获取web上传文件目录

//上传文件存放目录  tomcat webapp  WEB-INF下面的uploadFolder文件夹中

String realPath = request.getSession().getServletContext().getRealPath("/WEB-INF/uploadFolder");

//得到web-inf classes目录

String s = File.separator;

String realPath = getServletContext().getRealPath(s);

System.out.println(realPath);

file = new File(realPath + s + "WEB-INF" + s + "classes" + s + fileName);

​	

### 获取运行时tomcat路径

//普通java中获得路径 classes路径	

// D:/ToolKit/tomcat/apache-tomcat-7.0.50-eclipse/webapps/vegsocial_single/WEB-INF/classes/Server-Configuration.xml

String projectPath = this.getClass().getResource("/").getPath() + "Server-Configuration.xml";

String projectPath = this.getClass().getResource("/").getPath().replace("%20" , " ") + "Server-Configuration.xml";

web应用运行时指向的是你tomcat目录/webapps/应用/web-inf/classes/Server-Configuration.xml

望采纳！

注意，如projectPath中空格的经过base64编码转换后变成了"%20"，你还得replace("%20" , " ")。

//tomcat下webapps路径   D:/ToolKit/tomcat/apache-tomcat-7.0.50-eclipse/webapps

//静态类获取方式：String classesPath = TableCache.class.getResource("/").getPath().substring(1) ;

String classesPath = this.getClass().getResource("/").getPath();

String tomcatPath = classesPath.split("webapps")[0]+"webapps";

### 获取工程路径

// 获取文件分隔符

String separator = File.separator;

// 获取工程路径

File projectPath = new DefaultResourceLoader().getResource("").getFile();

//F:\backup\studio\AvailableCode\framework\freemarker\jeesite_hibernate\src\main\webapp\WEB-INF\classes

System.out.println(projectPath);

while (!new File(projectPath.getPath() + separator + "src" + separator + "main").exists()) {

​    projectPath = projectPath.getParentFile();

}

//Project Path: {}F:\backup\studio\AvailableCode\framework\freemarker\jeesite_hibernate

System.out.println("Project Path: {}" + projectPath);

### 如何获得当前文件路径

常用：

(1).Test.class.getResource("")

得到的是当前类FileTest.class文件的URI目录。不包括自己！

(2).Test.class.getResource("/")

得到的是当前的classpath的绝对URI路径。

(3).Thread.currentThread().getContextClassLoader().getResource("")

得到的也是当前ClassPath的绝对URI路径。

(4).Test.class.getClassLoader().getResource("")

得到的也是当前ClassPath的绝对URI路径。

(5).ClassLoader.getSystemResource("")

得到的也是当前ClassPath的绝对URI路径。

尽量不要使用相对于System.getProperty("user.dir")当前用户目录的相对路径，后面可以看出得出结果五花八门。

(6) new File("").getAbsolutePath()也可用。

### **通过CLASSPATH读取包内文件**

读取包内文件，使用的路径一定是相对的classpath路径，比如a，位于包内，此时可以创建读取a的字节流：

InputStream in = ReadFile.class.getResourceAsStream("/com/lavasoft/res/a.txt");

有了字节流，就能读取到文件内容了。

获得file

```Java
        ClassPathResource classPathResource = new ClassPathResource("/com/practice/a.txt");
        String s = FileUtils.readFileToString(classPathResource.getFile());
        System.out.println(s);

        URL resource = Main.class.getResource("/com/practice/a.txt");
        String s2 = FileUtils.readFileToString(new File(resource.getFile()));
        System.out.println(s2);
```

 

注意：

这里必须以“/”开头；

来源： [http://blog.csdn.net/dagouaofei/article/details/5588008](http://blog.csdn.net/dagouaofei/article/details/5588008)