# shell脚本中cd命令无效的解决方案(./ 和source . ./原理区别)

在学习的时候，经常要切换到固定的文件夹，于是写了个shell脚本用cd命令切换却发现目录切换不了。

代码如下：

```
#! /bin/bash
# c.sh
cd /mnt/hgfs/vmshare
pwd1234
```

> **解释：**执行的时候是./c.sh来执行的，这样执行的话终端会产生一个子shell（类似于C语言调用函数），子shell去执行我的脚本，在子shell中已经切换了目录了，但是子shell一旦执行完，马上退出，子shell中的变量和操作全部都收回。**回到终端根本就看不到这个过程的变化。**

**验证解释：**

```
#！ /bin/bash
# c.sh
history
cd /mnt/hgfs/vmshare
sleep1  #延迟1s
pwd123456
```

> 首先按照 ./c.sh执行，这时候终端没有切换目录，history执行的结果是空的，说明子shell里面没有历史命令（证明前面的解释是正确的）。
>
> > 解决方法：`source c.sh`或者`. ./c.sh`，这时候就是直接在终端的shell执行脚本了，没有生成子shell，执行的结果就是输出历史命令，并且切换了目录。
> >
> > > **注意上面**`. ./c.sh` .和.中间有个空格！





http://blog.csdn.net/czg13548930186/article/details/72861086