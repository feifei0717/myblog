[TOC]

# snakeyaml 读取Yaml文件 教程

/Users/jerryye/backup/studio/AvailableCode/yaml/yaml_demo

## snakeyaml 

SnakeYAML是针对java语言的YAML解析器。java 通过snakeyaml 读取Yaml文件 。

snakeyaml maven 依赖

```
       <dependency>
         <groupId>org.yaml</groupId>
         <artifactId>snakeyaml</artifactId>
         <version>1.17</version>
        </dependency>
```

## snakeyaml 读取Yaml文件 教程

首先创建工具类：

```
public class OnePeaple {
    
    private int age;
    
    private String name;
    
    private HashMap<String, String> params;
    
    private String[] favoriteBooks;

    public int getAge() {
        return age;
    }

    public void setAge(int age) {
        this.age = age;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public HashMap<String, String> getParams() {
        return params;
    }

    public void setParams(HashMap<String, String> params) {
        this.params = params;
    }

    public String[] getFavoriteBooks() {
        return favoriteBooks;
    }

    public void setFavoriteBooks(String[] favoriteBooks) {
        this.favoriteBooks = favoriteBooks;
    }
}
```

Yaml 文件：

```
age: 18  
name: mayou18
params:   
  event: what's up
  url:  http://www.mayou18.com
favoriteBooks:      
  - helloMaYou18
  - java 8
```

java读取yaml文件：

```
public class YamlUtil {
    
    public final static Yaml yaml=new Yaml();
    
    
    public static <T> T toYamlObject(String path,Class<T> clazz){
        
        T obj=null;
        
        try {
            //将yaml文件的内容转换成为想对应结构的对象
            obj = yaml.loadAs(new FileInputStream(ResourceUtils.getFile(path)), clazz);
        
        } catch (FileNotFoundException e) {
            // TODO Auto-generated catch block
            System.out.println(e);
        }
        
        return obj ;
        
    }
}
```

测试类：

```
public static void main(String[] args) {
        
       String path="classpath:topology.yml";
        
       OnePeaple me=    YamlUtil.toYamlObject(path, OnePeaple.class);
       
       System.out.println(JSON.toJSON(me));
    }
```





http://www.mayou18.com/detail/PJv0eSl2.html