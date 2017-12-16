本文章来为各位介绍一篇关于Linux是cat、tail、head查看文件任意几行的数据的例子，非常的简单希望对有需要的朋友有帮助。

**一、使用cat、tail、head组合**

1、查看最后1000行的数据

cat filename | tail -n 1000
2、查看1000到3000行的数据

cat filename | head -n 3000 | tail -n +1000

  1、cat filename 打印文件所有内容
  2、tail -n 1000 打印文件最后1000行的数据
  3、tail -n +1000 打印文件第1000行开始以后的内容
  4、head -n 1000 打印前1000的内容

**二、使用sed命令**

显示1000到300行的数据

sed -n '1000,3000p' filename

好了以上就是小编为各位整理的一篇关于cat、tail、head查看文件任意几行的数据的使用方法了。

来源： [http://www.111cn.net/sys/linux/102906.htm](http://www.111cn.net/sys/linux/102906.htm)