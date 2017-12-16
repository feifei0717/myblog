# java创建临时文件

**createTempFile **(String prefix, String suffix)
在默认临时文件目录中创建一个空文件，使用给定前缀和后缀生成其名称。

**createTempFile **(String prefix, String suffix, File directory)
在指定目录中创建一个新的空文件，使用给定的前缀和后缀字符串生成其名称。

public void **deleteOnExit** ();

在虚拟机终止时，请求删除此抽象路径名表示的文件或目录。 文件（或目录）将以与注册相反的顺序删除。调用此方法删除已注册为删除的文件或目录无效。根据 Java 语言规范中的定义，只有在虚拟机正常终止时，才会尝试执行删除操作。

一旦请求了删除操作，就无法取消该请求。所以应小心使用此方法。

例：

```
package com.test;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
public class Test {
/**
* @param args
*/
public static void main(String[] args) {
// TODO Auto-generated method stub
int b, c;
byte[] buffer = new byte[100];
File f = new File("c:\\test");
File fTemp = null;
try {
fTemp = File.createTempFile("letter", ".txt", f);
System.out.println("输入一行文本:");
b = System.in.read(buffer);
FileOutputStream writeFile = new FileOutputStream(fTemp);
writeFile.write(buffer, 0, b);
FileInputStream In = new FileInputStream(fTemp);
FileOutputStream Out = new FileOutputStream("c:\\testline.txt");
while ((c = In.read()) != -1) {
Out.write(c);
}
System.out.println("输入完毕!!");
writeFile.close();
In.close();
Out.close();
} catch (IOException e1) {
e1.printStackTrace();
} finally {
fTemp.deleteOnExit();
}
}
}
```





原文地址: <http://blog.chinaunix.net/uid-29632145-id-4718351.html>