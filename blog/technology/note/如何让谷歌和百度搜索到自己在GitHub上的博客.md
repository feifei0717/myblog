# 如何让谷歌和百度搜索到自己在GitHub上的博客

发表于 2016-08-07   |   分类于 [工具 ](https://maxwellyue.github.io/categories/tools/)  |     |   阅读次数 524

介绍如何将GitHub提交给谷歌和百度搜索引擎。

# 验证网站

- 查看是否被收录

  方法：打开百度或谷歌搜索，在搜索框里输入

  `site:https://maxwellyue.github.io/ ( 注意将maxwellyue替换为你自己的)`

  如果提示说：找不到和您查询的“`site:https://maxwellyue.github.io`”相符的内容或信息，说明未被收录。

  如果搜索结果中你第一眼就看到了你的博客站点，说明已被收录，不用再继续看下面的内容了。

- 百度搜索提交

  进入[百度搜索提交入口](http://zhanzhang.baidu.com/linksubmit/url)，

  登录自己的账号，在链接提交的下面说明区域点击“验证网站所有权”，

  在跳转的新页面输入自己的博客主页网址，如：`https://maxwellyue.github.io/`，

  选择“HTML标签验证”（网上更多人选择的是第一种，但是我总是验证失败）,

  将出现的整个meta标签内容添加到`Hexo/themes/next/layout/_partials`

  目录下的head.swig中（最上方原来meta标签的下面就可以），保存，

  重新`hexo deploy`，然后点击完成验证，就会出现验证成功提示。

  这里，我使用的是next主题，使用其他主题的话就去相应路径下找到head.xxx文件。

- Google搜索提交

  进入[Google搜索提交地址](https://www.google.com/webmasters/tools/home?hl=zh-CN)，

  登录自己的谷歌账号，步骤与百度类似，将meta标签内容添加到相应位置即可。

# 添加站点地图

作用：告诉搜索引擎你的网站结构等信息，让搜索引擎更智能抓取内容。

- 第一步

  打开Git Shell, 进入到Hexo目录，输入如下命令安装：

```
npm install hexo-generator-sitemap --save
npm install hexo-generator-baidu-sitemap --save
```

- 第二步

  打开Hexo目录下的_config.yml文件，在最下方添加如下字段，然后重新编译：`hexo generate`,可以在`Hexo/public`

  目录下找到sitemap.xml以及baidusitemap.xml这两个文件已经生成了。

```
# 自动生成sitemap
sitemap:
path: sitemap.xml
baidusitemap:
path: baidusitemap.xml
```

- 第三步

  进入刚才提交链接，验证网站的地址

  百度：在“网页抓取”下“链接提交”中，选择“自动提交”下的sitemap,在下方填写：

  `https://maxwellyue.github.io/baidusitemap.xml`；

  谷歌：找到抓取下的站点地图，点击“添加/测试站点地图”，输入

  `https://maxwellyue.github.io/sitemap.xml`。

# 说明

- 正常情况下到这里就结束了，但是github屏蔽了百度爬虫，所以百度依然搜不到博客，但是谷歌已经可以了。具体关于github屏蔽百度爬虫的解决办法网上也有很多，等以后想做的时候再去实现。







https://maxwellyue.github.io/2016/08/07/%E5%A6%82%E4%BD%95%E8%AE%A9%E8%B0%B7%E6%AD%8C%E5%92%8C%E7%99%BE%E5%BA%A6%E6%90%9C%E7%B4%A2%E5%88%B0%E8%87%AA%E5%B7%B1GitHub%E4%B8%8A%E7%9A%84%E5%8D%9A%E5%AE%A2/