[TOC]

# Git push到多个远程库

## 需求

我的Hutool项目现在在Github和Git@OSC上都有，每次都是开两个项目，手动同步文件，然后分别提交。非常不方便。

## 建立多个远程仓库

以我的Hutool项目为例，在Github的地址是git@github.com:looly/hutool.git，在Git@OSC的地址是git@git.oschina.net:loolly/hutool.git。 
按照原先的思路，我们在建立远程库的时候都是运行

```
git remote add origin git@github.com:looly/hutool.git
git add .
git commit -m 'First commit'
git push -u origin master
```

Git@OSC类似，以前只是知道origin表示远程仓库的名字，不懂具体含义，后来才知道origin只是git@github.com:looly/hutool.git的别名，于是这个名字便不再重要。这么解释的话，我们可以通过命令添加多个远程仓库，保证这个“别名”不重复既可。

```
git remote add origin git@github.com:looly/hutool.git
git remote add osc git@git.oschina.net:loolly/hutool.git
git add .
git commit -m 'First commit'
git push -u origin master
git push -u osc master
```

运行几条命令，我们便可以把同一次提交提交到多个远程库，为了方便，我创建了一个push.sh的脚本，内容是：

```
#!/bin/bash
echo 'Push to origin master'
git push origin master
echo 'Push to osc master'
git push osc master
```

这样每次提交，我就可以只运行这个脚本就可以，十分方便。

注：git push -u中的-u参数为第一次提交使用，作用是把本地的master分支和远程的master分支关联起来，简化命令，之后提交不需要这个参数。



http://www.it610.com/article/5236345.htm