## PrintWriter和ServletOutputStream的区别



1. PrintWriter是以字符为单位，对所有的信息进行处理，而ServletOutputStream仅对二进制的资料进行处理。 
2. PrintWriter在输出字符文本时内部需要将字符串转换成某种字符集编码的字节数组，使用他的好处就是不需要自己来完成从字符串到字节数组的转换。转换的字符集编码是通过设置setContentTpye或setCharacterEncoding或setLocale等方法实现的；使用ServletOutputStream对象直接从一个字节输入流中读取出来，然后再原封不动的输出到客服端。 
3. 这两个方法相互排斥，只能调用其一，如果要用，则要在换方法之前调用flush(),将缓冲区数据冲掉。 
4. PrintWriter自动清空缓冲区的功能被使能时(构造函数中autoFlush置为true)，仅当println()方法被调用时才自动清缓冲区，而不是像PrintStream一样遇到一个换行符就清缓冲。 

两种方法的取舍： 
使用PrintWriter会占用一些系统开销，因为它是为处理字符流的输出功能。因此PrintWriter应该使用在确保有字符集转换的环境中。换句话说，在你知道servlet返回的仅仅是二进制数据时候，应该使用ServletOutputStream，这样你可以消除字符转换开销，当servlet容器不用处理字符集转换的时候。 
前台页面请求图片处理显示。 

```
<td valign="top" rowspan="5" width="16%"> <img src="${ctx }/departmentAction.do?dispatch=getDeptPic&id=${deptForm.department.deptId }" height="143" width="103"> </td> 
```


后台图片显示处理 
ServletOutputStream sout = response.getOutputStream(); sout.write(dept.getDeptIcon());// 将缓冲区的输入输出到页面 sout.flush(); // 输入完毕，清除缓冲 sout.close();//关闭流 


附：写文件最佳组合 
PrintWriter out = new PrintWriter( new BufferedWriter( new FileWriter(filename))) PrintWriter 提供print系方法
BufferedWriter 提供缓冲，用以加速 
FileWriter 用于写文件