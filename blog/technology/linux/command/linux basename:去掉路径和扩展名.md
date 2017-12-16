# linux basename:去掉路径和扩展名

basename命令用于去掉路径信息，返回纯粹的文件名，如果指定的文件的扩展名，则将扩展名也一并去掉。



## 语法

basename的语法是：basename[选项][参数]

其中：

选项：为有路径信息的文件名，如/home/test/test.txt

参数：指文件扩展名

返回路径名的文件名或目录部分

如果在编程过程中，想取得纯粹的文件名，则该命令将非常有用。下面举几个例子：

## 需要把某个路径下的文件名赋值给变量file_name：

假设文件的路径是/home/test/test.txt，把test赋值给file_name:

```
[c.plm@localhost ~]$ file_name=`basename /home/test/test.txt `
[c.plm@localhost ~]$ echo $file_name
test.txt
```



## 需要把某个路径下的文件名赋值给变量file_name，并去掉扩展名：

同样假设文件的路径是/home/test/test.txt，把test赋值给file_name:

```
[c.plm@localhost ~]$ file_name=`basename /home/test/test.txt  .txt`
[c.plm@localhost ~]$ echo $file_name
test
```



## 获得文件夹路径的最后文件夹的名称

```
jerrydeMacBookPro:~ jerryye$ basename /home/webdata/commoditysupport
commoditysupport
```







http://jingyan.baidu.com/article/adc81513591080f722bf7375.html