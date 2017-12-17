# [如何在github上下载单个文件夹？](http://blog.csdn.net/deeplies/article/details/52754980)

使用[Git](http://lib.csdn.net/base/git)拉去github上的一些开源项目，无比方便，但是有些项目比较庞大，而我们只想拉取其中指定的一部分文件夹或者文件，那就需要我们另外动些手脚了。

以下是我从知乎上看到的答案，亲测有效：

[http://www.zhihu.com/question/25369412/answer/96174755](http://www.zhihu.com/question/25369412/answer/96174755)

------

具体实现如下：

```
$mkdir project_folder
$cd project_folder
$git init
$git remote add -f origin <url>
```

上面的代码会帮助你创建一个空的本地仓库，同时将远程[git](http://lib.csdn.net/base/git) Server URL加入到Git Config文件中。

接下来，我们在Config中允许使用Sparse Checkout模式：

```
$git config core.sparsecheckout true
```

接下来你需要告诉Git哪些文件或者文件夹是你真正想Check Out的，你可以将它们作为一个列表保存在`.git/info/sparse-checkout`文件中。

例如：

```
$echo “libs” >> .git/info/sparse-checkout
$echo “apps/register.go” >> .git/info/sparse-checkout
$echo “resource/css” >> .git/info/sparse-checkout
```

最后，你只要以正常方式从你想要的分支中将你的项目拉下来就可以了： 
`$git pull origin master`

具体可参考Git的Sparse checkout文档： [http://schacon.github.io/git/git-read-tree.html#_sparse_checkout](http://schacon.github.io/git/git-read-tree.html#_sparse_checkout)

看完之后，若是每次想要拉取一个文件都这么做，未免有些太麻烦了点，所以我就根据以上做出了一个基于NodeJS的小程序，代码如下：

```
const execSync = require('child_process').execSync
const fs=require('fs');

const cmd1 = 'git init';
var cmd2 = 'git remote add -f origin ';
const cmd3 = 'git config core.sparsecheckout true';
const cmd4='git pull origin master';

var Path='';
process.stdin.setEncoding('utf8');
process.stdout.write('请输入仓库远程地址，以及想要复制的文件路径？两个输入以及多个路径都用空格分开:\n');
process.stdin.on('data',(data)=>{
    cmd2+=data.split(' ')[0];
    Path=data.slice(data.indexOf(' ')+1).split(' ').join('\n');
    process.stdin.emit('end');
});

process.stdin.on('end',()=>{
    execSync(cmd1);
    execSync(cmd2);
    execSync(cmd3);

    fs.writeFileSync('./.git/info/sparse-checkout',Path);
    execSync(cmd4)
    console.log('It\'s ok!');

});
 
```

启动程序，例如当输入

```
https://github.com/accforgit/React-project-By-TDD.git assets/css index.html
```

程序就会自动将你所指定的一个文件夹和一个html文件拉取下来。


http://blog.csdn.net/deeplies/article/details/52754980