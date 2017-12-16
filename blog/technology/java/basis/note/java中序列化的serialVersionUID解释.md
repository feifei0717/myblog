# java中序列化的serialVersionUID解释

serialVersionUID: 字面意思上是序列化的版本号，这个在刚刚接触java编程时，学序列化大家一般都不会注意到，在你一个类序列化后除非你强制去掉了myeclipse中warning的功能，在你实现序列化的类上会有这个警告，点击会出现增加这个版本号。

说说这个版本号得作用：

**就是确保了不同版本之间的兼容性，不仅能够向前兼容，还能够向后兼容，即在版本升级时反序列化仍保持对象的唯一性。**

它有两种生成方式：       

1. **一个是默认的1L，比如：private static final long serialVersionUID = 1L;**
2. **一个是根据类名、接口名、成员方法及属性等来生成一个64位的哈希字段，比如：  private static final long serialVersionUID = xxxxL;**

从两个例子上来说明这个序列化号的作用：

​      这是一个类实现了序列化，但是并没有显式的声明序列号，在这里说明一下，如果没有显式声明序列号，那么在程序编译时会自己生成这个版本序列号，

​      程序1

```
public class Persons implements Serializable {

    private int              age;  // will persist
    private String           name; // will persist
    // transient 为Java保留字，告诉JVM以transient宣告的基本型态(primitive type)或物
    // 件(object)变量不要序列化，例如敏感性数据像是密码等。
    private transient String pwd;  // will not persist

    public Persons() {
    }

    public Persons(int age, String name, String pwd) {
        super();
        this.age = age;
        this.name = name;
        this.pwd = pwd;
    }

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

    public String getPwd() {
        return pwd;
    }

    public void setPwd(String pwd) {
        this.pwd = pwd;
    }

}
```

​     

​     通过这个程序来将上面的一个实体存起来：程序2

```
public class TestSerializable {

    //串行化
    public static void serialization() {
        File f = new File("D://t.m");
        try {
            if (f.exists())
                f.delete();
            f.createNewFile();

        } catch (IOException e1) {
            // TODO Auto-generated catch block
            e1.printStackTrace();
        }
        Persons p = new Persons(10, "xplq", "123456");
        try {
            ObjectOutputStream out = new ObjectOutputStream(new FileOutputStream(f));
            out.writeObject(p);
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    //测试
    public static void main(String[] args) {
        TestSerializable.serialization();
    }

}
```

​     通过这个程序读取出刚才存储的类：程序3    

```
public class TestSerializable {
 //反串行化
 public static void deserialization() {
  ObjectInputStream input = null;
  try {
    input = new ObjectInputStream(
     new FileInputStream("D://t.m"));
   try {
    Persons p = (Persons) input.readObject();
    System.out.println(p.getName());
    System.out.println(p.getAge());
    System.out.println(p.getPwd());
   } catch (ClassNotFoundException e) {
    // TODO Auto-generated catch block
    e.printStackTrace();
   }
  } catch (FileNotFoundException e) {
   // TODO Auto-generated catch block
   e.printStackTrace();
  } catch (IOException e) {
   // TODO Auto-generated catch block
   e.printStackTrace();
  }finally{
   try {
    input.close();
   } catch (IOException e) {
    // TODO Auto-generated catch block
    e.printStackTrace();
   }
  }
 }
 //测试
 public static void main(String[] args) {
//  TestSerializable.serialization();
  TestSerializable.deserialization();
 }

}


```

​     这种编译是成功的，但是当你在程序1中的类增加一个成员变量的时候执行程序2进行串行化，在运行程序3 反串行化，就会报错：

```
      Exception in thread "main" java.io.InvalidClassException: koal.Animal;……
    at java.io.ObjectStreamClass.initNonProxy(ObjectStreamClass.java:562)
    at java.io.ObjectInputStream.readNonProxyDesc(ObjectInputStream.java:1583)
    at java.io.ObjectInputStream.readClassDesc(ObjectInputStream.java:1496)
    at java.io.ObjectInputStream.readOrdinaryObject(ObjectInputStream.java:1732)
    at java.io.ObjectInputStream.readObject0(ObjectInputStream.java:1329)
    at java.io.ObjectInputStream.readObject(ObjectInputStream.java:351)
    at koal.SerialVersion.main(SerialVersion.java:22)
```

​    这是为什么呢？

​    因为在你没有显式的声明序列号时，在程序编译时候会自动生成一个序列号，存储在文件中，但是在你更改了实体类的时候又会重新生成一个序列号，在程序运行的时候，Java的序列化机制是通过在运行时判断类的serialVersionUID来验证版本一致性的。在进行反序列化时，JVM会把传来的字节流中的serialVersionUID与本地相应实体（类）的serialVersionUID进行比较，如果相同就认为是一致的，可以进行反序列化，否则就会出现序列化版本不一致的异常。也就是说，在你读取这个object的时候，他会比较你的现在这个类的序列号和你存储的那个序列号是否相等，如果相等，则说明这是同一个版本，如果不相等则是不同版本，不同版本之间的成员变量是不相同的，所以就会报错，但是当你显式的声明了这个序列号时，不论你如何修改类中的成员变量还是方法，都不会引起版本之间不兼容得问题，这个就加强了你的程序的健壮性。

​    在很多地方我们都会用到这个序列化，例如在游戏中，游戏升级之后，还要能够让程序成功读取以前的数据，让升级之后的程序还能认识以前的数据文件，即使数据格式不一致，也不会丢失数据。

   像一些持久化的配置文件，中途要升级，增加属性，都要使用这个版本序列号，在这里我们是希望程序中只要是实现序列化的类都最好是显式的声明这个序列版本号。