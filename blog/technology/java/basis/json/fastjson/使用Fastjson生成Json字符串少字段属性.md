# 使用Fastjson生成Json字符串少字段属性

[@wenshao](http://my.oschina.net/wenshao) 你好，想跟你请教个问题：

我使用Fastjson将节点对象Node生成JSON字符串时少个对象属性，麻烦你看一下是怎么回事，是bug吗？我用Gson就没出现问题！

这是节点对象文件Node.java

```
package per.eblink.pojo;
 
public class Node {
     
    private String id;
    private String pId;
    private String name;
    private boolean open;
     
    private Node() {
        super();
    }
 
    public Node(String id, String pId, String name, boolean open) {
        super();
        this.id = id;
        this.pId = pId;
        this.name = name;
        this.open = open;
    }
     
    public String getId() {
        return id;
    }
    public void setId(String id) {
        this.id = id;
    }
    public String getpId() {
        return pId;
    }
    public void setpId(String pId) {
        this.pId = pId;
    }
    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }
    public boolean isOpen() {
        return open;
    }
    public void setOpen(boolean open) {
        this.open = open;
    }
     
}
```

接下来是测试用例JsonTest.java

```
package per.eblink.test;
 
import com.alibaba.fastjson.JSON;
import com.google.gson.Gson;
import per.eblink.pojo.Node;
 
public class JsonTest {
 
    /**
     * @param args
     */
    public static void main(String[] args) {
        Node node=new Node("2", "1", "节点1",true);
//      FastJson转换方式
        String jsonStr=JSON.toJSONString(node);
//      Gson转换方式
        Gson gson=new Gson();
        String gsonStr=gson.toJson(node);
        System.out.println("FastJson生成字符串是："+jsonStr);
        System.out.println("Gson生成字符串是："+gsonStr);
    }
 
}
```

最后是控制台打印生成的结果如下：

```
FastJson生成字符串是：{"id":"2","name":"节点1","open":true}
Gson生成字符串是：{"id":"2","pId":"1","name":"节点1","open":true}
```

用FastJson就是少了个属性pId没有被转化出来，用Gson和其他的却可以，而我的Node对象只是个普通的JAVA类而已，麻烦你看一下，谢谢！





------



你的get，set方法估计多半是自动生成的，Fastjson在生成的时候去判断pId有没有对应的get方法是区分了大小写的，所以找不到对应的get方法（getPId（））。

## ***解决的办法*：**

1，多写一个get方法

```
package per.eblink.pojo;
 
public class Node {
     
    private String id;
    private String pId;
    private String name;
    private boolean open;
     
    private Node() {
        super();
    }
 
    public Node(String id, String pId, String name, boolean open) {
        super();
        this.id = id;
        this.pId = pId;
        this.name = name;
        this.open = open;
    }
     
    public String getId() {
        return id;
    }
    public void setId(String id) {
        this.id = id;
    }
    public String getpId() {
        return pId;
    } 
	public String getPId() {
        return pId;
    }
    public void setpId(String pId) {
        this.pId = pId;
    }
    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }
    public boolean isOpen() {
        return open;
    }
    public void setOpen(boolean open) {
        this.open = open;
    }
     
}
```



2、(不符合Java的命名规范不推荐)直接将bean对象中的属性改为public，属性名命名为首字母大写，比如{"Name":"nomouse","Age":12}，定义相应的bean为：熟悉为public，不需要定义get方法



public class User {

​    public String Name;

​    public int Age;

}

 



来源： <http://www.oschina.net/question/818749_131396>

