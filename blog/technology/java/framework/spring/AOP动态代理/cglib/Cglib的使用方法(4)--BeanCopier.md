cglib系列文章索引

1. [Cglib的使用方法(1)--Enhancer](http://www.cnblogs.com/icejoywoo/archive/2011/06/05/2072970.html)
2. [Cglib的使用方法(2)--CallbackFilter](http://www.cnblogs.com/icejoywoo/archive/2011/06/05/2072971.html)
3. [Cglib的使用方法(3)--Mixin](http://www.cnblogs.com/icejoywoo/archive/2011/06/05/2072973.html)
4. [Cglib的使用方法(4)--BeanCopier](http://www.cnblogs.com/icejoywoo/archive/2011/06/05/2072975.html)

用来对象之间拷贝属性

```
import net.sf.cglib.beans.BeanCopier;
 
 
public class PropertyCopyDemo {
    public static void main(String[] args) {
        Other other = new Other("test", "1234");
        Myth myth = new Myth();
         
        System.out.println(other);
        System.out.println(myth);
         
        BeanCopier copier = BeanCopier.create(Other.class, Myth.class, false);
        copier.copy(other, myth, null);
         
        System.out.println(other);
        System.out.println(myth);
    }
}
 
class Other {
    private String username;
    private String password;
    private int age;
     
    public String getUsername() {
        return username;
    }
 
    public void setUsername(String username) {
        this.username = username;
    }
 
    public String getPassword() {
        return password;
    }
 
    public void setPassword(String password) {
        this.password = password;
    }
 
    public Other(String username, String password) {
        super();
        this.username = username;
        this.password = password;
    }
     
    @Override
    public String toString() {
        return "Other: " + username + ", " + password + ", " + age;
    }
 
    public int getAge() {
        return age;
    }
 
    public void setAge(int age) {
        this.age = age;
    }
}
 
class Myth {
    private String username;
    private String password;
    private String remark;
     
    public String getUsername() {
        return username;
    }
 
    public void setUsername(String username) {
        this.username = username;
    }
 
    public String getPassword() {
        return password;
    }
 
    public void setPassword(String password) {
        this.password = password;
    }
 
    @Override
    public String toString() {
        return "Myth: " + username + ", " + password + ", " + remark;
    }
 
    public void setRemark(String remark) {
        this.remark = remark;
    }
 
    public String getRemark() {
        return remark;
    }
}
```

运行结果如下:

```
Other: test, 1234, 0
Myth: null, null, null
Other: test, 1234, 0
Myth: test, 1234, null
```

作者：[icejoywoo](http://www.cnblogs.com/icejoywoo/)

出处：<http://www.cnblogs.com/icejoywoo/>

本文版权归作者和博客园共有，欢迎转载，但未经作者同意必须保留此段声明，且在文章页面明显位置给出原文连接，否则保留追究法律责任的权利. 短网址: http://goo.gl/ZiZCi

来源： <http://www.cnblogs.com/icejoywoo/archive/2011/06/05/2072975.html>