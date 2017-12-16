# java终端获取输入

 

## 1,BufferedReader

JDK 1.4 及以下的版本中要想从控制台中输入数据只有一种办法，即使用System.in获得系统的输入流，再桥接至字符流从字符流中读入数据。

```
public class BufferedReaderDemo {
    public static void main(String[] args) {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        try {
            System.out.println("What you name?");
            String str = br.readLine();
            System.out.println("Hello " + str + ".");
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}　　
```

从上面的代码段来看，这种控制台输入的方法非常地麻烦，为了能读取整行的数据，采用了BufferedReader类来进行处理，而且在读取的过程中还需要捕获IOException。
不过这是 JDK 1.4 及以下版本中从控制台读取数据唯一的办法。

 

JOptionPane

还有一种非控制台读入数据的办法，就是采用 Swing 中的JOptionPane，会弹出一个输入对话框让使用者输入数据，但这是一种比较另类的做法，不推荐使用。

```
public class JOptionPaneDemo {
    public static void main(String[] args) {
        String str = JOptionPane.showInputDialog("What you name?");
        System.out.println("Hello " + str + ".");
    }
}　　
```

上面的两种方法都有个共同的缺点——只能读取字符串，若需要读取其他类型的数据需要手工进行转换。

 

## **2,Scanner**

从 JDK 5.0 开始，基本类库中增加了java.util.Scanner类。这个类是采用正则表达式进行基本类型和字符串分析的文本扫描器。
使用它的Scanner(InputStream source)构造方法，可以传入系统的输入流System.in而从控制台中读取数据。

```
public class ScannerDemo {
    public static void main(String[] args) {
        Scanner in = new Scanner(System.in);
        System.out.println("What's your name?");
        String name = in.nextLine();//读取换行符为间隔的
        System.out.println("Hello "+name+".");
        System.out.println("What's your name?");
        System.out.println("Hello "+in.next()+in.next()+".");   //读取空格为间隔的
        System.out.println("How old are you?");
        int age = in.nextInt(); //读取数字
        System.out.println("Are you  "+age+"?");
    }
}
```

　　

Scanner内部的实现中已经将IOException处理了，而且采用InputStreamReader来一个字符一个字符进行扫描读取的，只是Scanner做了更高层次的封装。

Scanner不仅可以从控制台中读取字符串，还可以读取除char之外的其他七种基本类型和两个大数字类型，并不需要显式地进行手工转换。Scanner不单单只能扫描控制台中输入的字符，它还可以让读入的字符串匹配一定的正则表达式模式，如果不匹配时将抛出InputMismatchException异常。

![img](http://images2015.cnblogs.com/blog/921536/201611/921536-20161117202057545-1530218233.png)

 

使用System.in作为它的构造参数时，它只扫描了系统输入流中的字符。它还有其他的构造，分别可以从文件或者是字符串中扫描分析字符串的。（以后补充）

 

 

## **3,Console**

从 JDK 6.0 开始，基本类库中增加了java.io.Console类，用于获得与当前 Java 虚拟机关联的基于字符的控制台设备。在纯字符的控制台界面下，可以更加方便地读取数据。public class ConsoleDemo {

```
public class ConsoleDemo {
    public static void main(String[] args) {
        Console console = System.console();
        String username = console.readLine("username:");
        char[] password = console.readPassword("password:");
        System.out.println(username+" "+String.valueOf(password));
    }
}　　
```

注意：
根据ConsoleAPI 文档的说明：虚拟机是否具有控制台取决于底层平台，还取决于调用虚拟机的方式。如果虚拟机从一个交互式命令行开始启动，且没有重定向标准输入和输出流，那么其控制台将存在，并且通常连接到键盘并从虚拟机启动的地方显示。如果虚拟机是自动启动的（例如，由后台作业调度程序启动），那么它通常没有控制台。
通过上面的文档说明可以看出，在使用 IDE 的情况下，是无法获取到Console实例的，原因在于在 IDE 的环境下，重新定向了标准输入和输出流，也是就是将系统控制台上的输入输出重定向到了 IDE 的控制台中。因此，**在 IDE 中不能使用这个程序**，而上面的两种方法没有这个限制。

![img](http://images2015.cnblogs.com/blog/921536/201611/921536-20161117202108951-1169671078.png)

如果需要在控制台中输入密码等敏感信息的话，像在浏览器或者是应用程序中那样显示替代字符，在 JDK 6.0 以前的做法是相当麻烦的（具体的做法可以参考《Java 编程语言中的口令屏蔽》一文），而使用Console类的readPassword()方法可以在控制台上不回显地输入密码，并将密码结果保存在char数组中，根据 API 文档的建议，在使用后应立即将数组清空，以减少其在内存中占用的时间，以便增强安全性。



## **总结**

以上囊括了 Java 中各种版本从控制台中读入数据的方法，将对它们的优缺点进行了分析。下面给出了一些使用建议，可供参考：
JRE 1.4 或以下版本，没得选择只能采用BufferedReader 或者是非控制台JOptionPane读入方法。
JRE 5.0以上版本 ，建议使用基于Scanner的方法，更方便地进行数据读取。
JRE 6.0以上版本，并且只在字符界面的控制台下运行时，采用console的方法，如果需要读入像密码之类的敏感数据，为了安全性考虑也必须使用console或者是自行实现。如果需要读入除字符串类型之外的其他数据类型，建议使用基于Scanner的控制台输入。





https://www.cnblogs.com/iwinson/p/6075303.html