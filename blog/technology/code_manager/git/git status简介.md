[TOC]



# git status简介

原创 2015年04月16日 20:51:45 

git status命令可以列出当前目录所有还没有被git管理的文件和被git管理且被修改但还未提交(git commit)的文件.。

比如;

## git status 全部内容示例

```
git status
# On branch master
# Changes to be committed:
#   (use "git reset HEAD <file>..." to unstage)
#
#       modified:   2.txt
#
# Changes not staged for commit:
#   (use "git add <file>..." to update what will be committed)
#   (use "git checkout -- <file>..." to discard changes in working directory)
#
#       modified:   1.txt
#
# Untracked files:
#   (use "git add <file>..." to include in what will be committed)
#
#       1.log
```

命令中”Changes to be committed“中所列的内容是在Index中的内容，commit之后进入Git Directory。

命令中“Changed but not updated”中所列的内容是在Working Directory中的内容，add之后将进入Index。

命令中“Untracked files”中所列的内容是尚未被Git跟踪的内容，add之后进入Index



## git status -uno

通过git status -uno可以只列出所有已经被git管理的且被修改但没提交的文件。

比如：

```
$ touch 3.txt
$ git add 3.txt
$ git status -uno
# On branch master
# Changes to be committed:
#   (use "git reset HEAD <file>..." to unstage)
#
#       modified:   1.txt
#       new file:   3.txt
#
# Changes not staged for commit:
#   (use "git add <file>..." to update what will be committed)
#   (use "git checkout -- <file>..." to discard changes in working directory)
#
#       modified:   2.txt
#
# Untracked files not listed (use -u option to show untracked files)
```

这里1.txt,2.txt两个文件都是曾经被提交过的文件。

1.txt被修改且被执行了git add。

2.txt被修改但还没被执行了git add。

3.txt是新建的文件，已经被执行了git add。

另外注意，我们可以通过git add -i 命令查看\<path>中被所有修改过或已删除文件但没有提交的文件，它有类似git status的功能，关于git add命令的更多内容请参考《[git add详解](http://blog.csdn.net/hudashi/article/details/7664374)》



## git status 显示中文

在中文情况下 git status是 “\344\272\247\345\223\201\351\234\200\346\261\202” 差不多这样的。

解决这个问题方法是：

```
git config --global core.quotepath false
```





http://blog.csdn.net/hudashi/article/details/45080721