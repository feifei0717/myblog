# [shell的bash中将字符串split成数组的方法](http://liuzhiqiangruc.iteye.com/blog/1461026)

- ​

相信编程时，字符串的处理是很频繁被处理的问题，其中大家肯定不陌生各种语言的string.split('sp')将字符串按照某个字符或子串切分成一个数组。

同样，我们在用shell处理文本信息时也可以方便地实现该功能。

这里主要使用了bash中关于字符串变量的处理和array初始化的能力。

 

如下：

Shell代码  

```
#!/bin/bash  
  
str="hello,world,i,like,you,babalala"  
arr=(${str//,/ })  
  
for i in ${arr[@]}  
do  
    echo $i  
done  
```

 

 

将str按照','切分成一个数组，并遍历之。

当然，这里分隔符可以是一个子串。





http://liuzhiqiangruc.iteye.com/blog/1461026