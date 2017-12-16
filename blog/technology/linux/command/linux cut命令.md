# linux cut命令



cut主要是用来分割文件中的字符串，并且根据要求进行显示的一个命令。虽然他的用法基本上都可以用其他的linux命令所代替，但是用cut会更方便一点。

## **一，cut参数说明**

```
[zhangy@BlackGhost comte]$ cut --help  
用法：cut [选项]... [文件]...  
从每个文件中输出指定部分到标准输出。  
  
长选项必须使用的参数对于短选项时也是必需使用的。  
 -b, --bytes=列表        //只选中指定的这些字节  
 -c, --characters=列表       // 只选中指定的这些字符  
 -d, --delimiter=分界符   // 使用指定分界符代替制表符作为区域分界  
 -f, --fields=列表        //只选中指定的这些域；并打印所有不包含分界符的 行，除非-s 选项被指定  
 -n                (忽略)  
 --complement       //补全选中的字节、字符或域  
 -s, --only-delimited        //不打印没有包含分界符的行  
 --output-delimiter=字符串    //使用指定的字符串作为输出分界符，默认采用输入 的分界符  
 --help        //显示此帮助信息并退出  
 --version        //显示版本信息并退出  
  
仅使用f -b, -c 或-f 中的一个。每一个列表都是专门为一个类别作出的，或者您可以用逗号隔  
开要同时显示的不同类别。您的输入顺序将作为读取顺序，每个仅能输入一次。  
每种参数格式表示范围如下：  
 N    从第1 个开始数的第N 个字节、字符或域  
 N-    从第N 个开始到所在行结束的所有字符、字节或域  
 N-M    从第N 个开始到第M 个之间(包括第M 个)的所有字符、字节或域  
 -M    从第1 个开始到第M 个之间(包括第M 个)的所有字符、字节或域  
  
当没有文件参数，或者文件不存在时，从标准输入读取  
```

## **二，实例**

### **1，测试文件**

```
[zhangy@BlackGhost comte]$ cat test  
test:x:1003:1003::/home/test:/bin/bash  
张ying:x:1004:1004::/home/test:/bin/bash  
policykit:x:102:1005:PolicyKit:/:/sbin/nologin  
postfix:x:73:73::/var/spool/postfix:/bin/false 
```

上面是/etc/passwd文件中的一部分，加了点中文在里面

### **2，-b和-c的用法**

```
[zhangy@BlackGhost comte]$ cut -b 1-10 test     //取得文件中第1个字节到第10个字节的内容  
test:x:100  
张ying:x:  
policykit:  
postfix:x:  
[zhangy@BlackGhost comte]$ cut -b 1,4,5,7,10 test  //取文件中第1，4，5，7，10字节的内容  
tt::0  
�yig:    //为什么会出现乱码吗，因为汉字所占字节数大于1，分开的话，肯定会显示错误的  
pick:  
ptfx:
```

**-c的用法根-b差不多，只不过一个截取时是字节为单位，一个是以字符为单位**

### **3，-d和-f的用法**

```
[zhangy@BlackGhost comte]$ cut -f 1 test     //不分割都显示出来  
test:x:1003:1003::/home/test:/bin/bash  
张ying:x:1004:1004::/home/test:/bin/bash  
policykit:x:102:1005:PolicyKit:/:/sbin/nologin  
postfix:x:73:73::/var/spool/postfix:/bin/false  
[zhangy@BlackGhost comte]$ cut -d : -f1  test  //分割了显示分割后的第一个域  
test  
张ying  
policykit  
postfix  
```

**-d后面根的冒号是分割文件行的的分割符，-d一般情况下根-f一起使用，而不能和-b,-c一起使用**

### **4，-s的用法**

```
[zhangy@BlackGhost comte]$ cut -d : -f 1-5 -s --output-delimiter="|" test  
test|x|1003|1003|  
张ying|x|1004|1004|  
policykit|x|102|1005|PolicyKit  
postfix|x|73|73|  
```

-s起到了输出控制的作用。





http://blog.51yip.com/linux/1077.html