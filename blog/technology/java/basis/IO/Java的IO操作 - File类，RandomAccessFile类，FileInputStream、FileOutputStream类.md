# Java的IO操作 - File类，RandomAccessFile类，FileInputStream、FileOutputStream类

在Java中，所有的输入、输出问题都会被抽象成流(Stream)对象来解决。下面介绍一下常用的输入、输出流对象的使用方法。

## 1、 File类

File类是文件的抽象代表。一个文件（包括目录）就是一个File类的实例。java.io.File类为我们提供了一个抽象的、系统独立的文件表示，我们不必纠结于因为不同的操作系统文件路径的表示方法不同而造成的差异，File会将传进去的路径自动转换为与系统无关的抽象路径表示。File必须配合其它相关的类来使用。

## 2、 RandomAccessFile类

RandomAccessFile允许我们在文件的任何位置执行读写操作，我们可以使用它的seek()方法来指定文件读写的位置，类似于C语言中的feek()设置文件指针。

例如，我们将3个学生信息（姓名，分数）写入到文件中，然后再从该文件中读取数据显示到控制台上。用户可以指定要从文件中读取第几个学生的信息：

```
package cls;  
import java.io.*;  
import java.util.Scanner;  
  
class Student // 学生类  
{  
    private String name;  
    private int score;  
      
    public Student(String name,int score)  
    {          
        StringBuilder buf = new StringBuilder(name);  
        buf.setLength(15); // 把每个name设置为15个字符长度  
          
        this.name = buf.toString();  
        this.score = score;  
    }  
    // 返回姓名  
    public String getName()  
    {  
        return name.toString();  
    }  
    // 返回分数  
    public int getScore()  
    {  
        return score;  
    }  
      
    public static void main(String[] args)  
    {  
        Student[] st = new Student[]{new Student("apple",100),new Student("dog",200),new Student("cat",300)};  
          
          
        // 写入数据  
        try  
        {  
            File file = new File(args[0]); //从命令行参数中指定文件名  
              
            RandomAccessFile raf = new RandomAccessFile(file,"rw"); //以可读可写的方式打开流  
            for(int i = 0 ; i < st.length ; ++i)  
            {  
                raf.writeChars(st[i].getName()); // 写入姓名  
                raf.writeInt(st[i].getScore()); // 写入一个整形数据，即分数  
            }  
            raf.close();  
        }  
        catch(IOException e)  
        {  
             e.printStackTrace();  
        }  
          
        // 从文件中读取数据  
        try  
        {  
            File file = new File(args[0]);  
              
            RandomAccessFile raf = new RandomAccessFile(file,"rw");//以可读可写的方式打开流  
              
            // 用户指定要读取第几个学生的信息  
            int pos;  
            Scanner sc = new Scanner(System.in);  
            pos = sc.nextInt();  
              
            // 读取第pos个学生的信息  
            char[] buf = new char[15];  
            raf.seek((pos - 1) * 34); // 设置读取位置，对于每个学生信息我们分别写入了34个字节  
             
            //读取数据  
            for(int i = 0 ; i < buf.length ; ++i)  
                buf[i] = raf.readChar(); // 一个字符一个字符地读取  
            String str = new String(buf);  
              
            // 显示数据  
            System.out.println(str.replace('\0',' ')); // 把buf中的\0全部替换成 空格  
            System.out.println(raf.readInt());  
              
            raf.close();  
        }  
        catch(IOException e)  
        {  
             e.printStackTrace();  
        }  
          
    }  
}  
```

我们可以通过执行 

```
java cls.Student temp.dat  
```

来指定要把学生数据保存到temp.dat文件中。

程序中输入序号N就能从文件中直接读取第N个学生的数据。

但是在读取的时候有一点需要注意，自己一定要清楚一个学生信息的数据块占多少个字节，否则读取数据时就会乱套了。。

## 3、抽象类InputStream和OutputStream

InputStream类是所有表示位输入流的类的父类，例如System.in就是它的一个对象。OutputStream是所有表示位输出流的类的父类，如System.out就间接继承了OutputStream类。我们可以使用System.in对象来从键盘中读入一个字符的数据，读入的数据会以int类型返回（int占4个字节，其中只有最后一个字节是有效数据）。下面的小程序演示了System.in的使用方法 ：

```
package cls;  
  
public class StreamDemo  
{  
    public static void main(String[] args) throws Exception  
    {  
        System.out.println("You just inputed : " + System.in.read());  
    }  
}  
```

## 4、FileInputStream和FileOutputStream

这两个类分别是InputStream和OutputStream的子类。因此它实现了抽象父类中的所有方法。顾名思义，它们的功能是从指定文件中执行读写操作。我们可以模仿windows命令提示符中的copy命令，自己去写一个山寨版的 copy。

我们从命令行参数中读入源文件、目标文件，然后利用read()方法，write()方法即可完成文件的拷贝。

我们定义一个大小为 5MB的 字节数据来作为缓冲区，以达到提高读写效率的目的。详见代码：

```
package cls;  
  
import java.io.*;  
  
public class FileStreamDemo  
{  
    public static void main(String[] args)  
    {  
        try  
        {  
            // 源文件  
            File fSource = new File(args[0]);  
            try  
            {  
                // 目地文件  
                File fDest = new File(args[1]);  
                  
                // 创建流  
                FileInputStream fis = new FileInputStream(fSource);  
                FileOutputStream fos = new FileOutputStream(fDest);  
                  
                try  
                {  
                    // 缓冲区  
                    byte[] buf = new byte[1024 * 1024 * 5];  
                      
                    // 拷贝数据  
                    while(true)  
                    {  
                        int res = 0;  
                        long size = fis.available(); // 获取源文件大小  
                          
                        // 从源文件中读取数据，再写入至目标文件中  
                        if(size < 1024 * 1024 * 5)  
                        {  
                            fis.read(buf);  
                            fos.write(buf,0,size);  
                            System.out.println("Buffered output!");  
                        }  
                        else  
                        {  
                            while((res = fis.read()) != -1)  
                            {  
                                fos.write(res);  
                            }  
                        }  
                        break;  
                    }  
                    // 关闭流  
                    fis.close();  
                    fos.close();  
                    System.out.println("Copy finish");       
                }  
                catch(Exception e)  
                {  
                     e.printStackTrace();  
                }  
            }  
            catch(Exception e)  
            {  
                 System.out.println("Please input the aim file!");  
                 System.exit(0);  
            }  
        }  
        catch(Exception e)  
        {  
             System.out.println("Please input the source file!");  
             System.exit(0);  
        }  
    }  
}  
```

经过测试，如果不使用缓冲数据，那么拷贝文件的操作是非常之慢的，慢到能让人砸电脑。。由此可见从硬盘等外部存储设备中读取数据要远远慢于从内存中读取（废话。。）。以上面的程序为例，如果要拷贝的文件在5M以内，那么整个拷贝过程完全可以秒过。反之，那就悲剧了。。。



http://blog.csdn.net/neosmith/article/details/8733342