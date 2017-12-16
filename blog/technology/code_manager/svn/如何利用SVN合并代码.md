利用SVN合并

Subversion的版本库是一种[文件服务器](https://www.baidu.com/s?wd=%E6%96%87%E4%BB%B6%E6%9C%8D%E5%8A%A1%E5%99%A8&tn=44039180_cpr&fenlei=mv6quAkxTZn0IZRqIHckPjm4nH00T1Y1myf4nWD4PjwWnWRknjcs0ZwV5Hcvrjm3rH6sPfKWUMw85HfYnjn4nH6sgvPsT6KdThsqpZwYTjCEQLGCpyw9Uz4Bmy-bIi4WUvYETgN-TLwGUv3EnHm1rHDvn1Dknj0drjDLrjn3n0)，但不是“一般”的[文件服务器](https://www.baidu.com/s?wd=%E6%96%87%E4%BB%B6%E6%9C%8D%E5%8A%A1%E5%99%A8&tn=44039180_cpr&fenlei=mv6quAkxTZn0IZRqIHckPjm4nH00T1Y1myf4nWD4PjwWnWRknjcs0ZwV5Hcvrjm3rH6sPfKWUMw85HfYnjn4nH6sgvPsT6KdThsqpZwYTjCEQLGCpyw9Uz4Bmy-bIi4WUvYETgN-TLwGUv3EnHm1rHDvn1Dknj0drjDLrjn3n0)。Subversion版本库的特别之处在于，它会记录每一次改变：每个文件的改变，甚至是目录树本身的改变，例如文件和目录的添加、删除和重新组织；可见SVN可自动识别出开发者具体修改什么代码，在合并时，只要知道SVN版本号，它会自动找出修改过的代码，然后合并到最终目标文件中。因此使用SVN来合并代码具有合并质量高以及高效的特点。 SVN的合并有三种类型，如下图：

[![img](http://e.hiphotos.baidu.com/zhidao/wh=600,800/sign=56785add718b4710ce7af5caf3feefc5/b8389b504fc2d56269ec7211e41190ef77c66c62.jpg)](http://e.hiphotos.baidu.com/zhidao/pic/item/b8389b504fc2d56269ec7211e41190ef77c66c62.jpg)

第一种类型：合并一个版本范围
该类型是根据SVN指定的版本号来合并，也是最灵活的一种合并方式，可以是主干合并到分支，或分支合并到主干；主要应用场景是把分支或主干里面的一部分修改同步到主干或分支中去；甚至支持不同库的两个分支，当然这两个分支要求是相同的[目录结构](https://www.baidu.com/s?wd=%E7%9B%AE%E5%BD%95%E7%BB%93%E6%9E%84&tn=44039180_cpr&fenlei=mv6quAkxTZn0IZRqIHckPjm4nH00T1Y1myf4nWD4PjwWnWRknjcs0ZwV5Hcvrjm3rH6sPfKWUMw85HfYnjn4nH6sgvPsT6KdThsqpZwYTjCEQLGCpyw9Uz4Bmy-bIi4WUvYETgN-TLwGUv3EnHm1rHDvn1Dknj0drjDLrjn3n0)。

第二中类型：复兴分支
把分支合并到主干上，这里会把所有分支的修改，都合并到主干中，如果只想合并一部分，不合适使用该类型；而且这种类型合并受限的条件比较多，如分支和主干必须是在同一个库，本地工作目录不能够包含有被修改过的文件等。

第三种类型：合并两个不同的树
把两个分支的差异合并到本地的工作目录；其实它也可以把分支的代码同步到主干中，只需要把合并的from指定为主干URL，to指定为分支URL, 而本地工作目录是主干。

利用SVN合并具体步骤

在上面的三中类型中，最常用最灵活的是第一中类型：“合并一个版本范围”，也是我用得最多的一种合并类型。下面以这个类型为例，来介绍合并的整个过程，假设是从分支合并到主干。对于另外的两种类型合并都差不多；这里就不一一介绍了。

1．把主干check out 到本地，并确保文件更新到最新状态

2．按照下图示打开合并对话框：

[![img](http://a.hiphotos.baidu.com/zhidao/wh=600,800/sign=0904be5b5aee3d6d22938fcd7326411a/5bafa40f4bfbfbedf35d9b837bf0f736aec31fc1.jpg)](http://a.hiphotos.baidu.com/zhidao/pic/item/5bafa40f4bfbfbedf35d9b837bf0f736aec31fc1.jpg)

3．选择合并类型：

[![img](http://a.hiphotos.baidu.com/zhidao/wh=600,800/sign=bc5fd337f8edab64742745c6c70683fb/838ba61ea8d3fd1f59640fc6334e251f94ca5fd8.jpg)](http://a.hiphotos.baidu.com/zhidao/pic/item/838ba61ea8d3fd1f59640fc6334e251f94ca5fd8.jpg)

根据合并类型进行选择，这里的例子中是选择第一个类型，然后再点“Next”按钮。

4．填写SVN URL和版本号信息：

[![img](http://d.hiphotos.baidu.com/zhidao/wh=600,800/sign=321035f85a82b2b7a7ca31c2019de7d7/622762d0f703918f33b89036523d269758eec4e5.jpg)](http://d.hiphotos.baidu.com/zhidao/pic/item/622762d0f703918f33b89036523d269758eec4e5.jpg)

“URL to merge from”下拉框选择需要合并分支或主干，在例子中，选择的是分支v1.0；在“revision range to merge”文本框选择具体需要合并的SVN版本号，可通过“show log”按钮查看有哪些版本号。可选择具体的版本号，也可以选择一个区间的版本号，如4-7，表示从SVN版本号4-7的全部合并。如选择区间版本号，需按住[shift键](https://www.baidu.com/s?wd=shift%E9%94%AE&tn=44039180_cpr&fenlei=mv6quAkxTZn0IZRqIHckPjm4nH00T1Y1myf4nWD4PjwWnWRknjcs0ZwV5Hcvrjm3rH6sPfKWUMw85HfYnjn4nH6sgvPsT6KdThsqpZwYTjCEQLGCpyw9Uz4Bmy-bIi4WUvYETgN-TLwGUv3EnHm1rHDvn1Dknj0drjDLrjn3n0)。输入各项信息后，再点“next”。

5．合并选项的选择

[![img](http://b.hiphotos.baidu.com/zhidao/wh=600,800/sign=7f86c1223e6d55fbc5937e205d126372/a50f4bfbfbedab645a5ee03cf436afc379311e19.jpg)](http://b.hiphotos.baidu.com/zhidao/pic/item/a50f4bfbfbedab645a5ee03cf436afc379311e19.jpg)

6．测试合并

在上面步骤中，直接点“test merge”按钮来测试合并结果。如果有冲突，则会有提示有冲突：

[![img](http://a.hiphotos.baidu.com/zhidao/wh=600,800/sign=bfa8e3070946f21fc9615655c6144758/cefc1e178a82b90122f26ecf708da9773812efeb.jpg)](http://a.hiphotos.baidu.com/zhidao/pic/item/cefc1e178a82b90122f26ecf708da9773812efeb.jpg)

7．开始合并

在步骤6中，直接点击“merge”按钮将会开始合并， 如没有冲突时，合并后的对话框将是下面的截图：

[![img](http://g.hiphotos.baidu.com/zhidao/wh=600,800/sign=84d8ba39e3fe9925cb596156049872e7/023b5bb5c9ea15ce882242f5b5003af33b87b27a.jpg)](http://g.hiphotos.baidu.com/zhidao/pic/item/023b5bb5c9ea15ce882242f5b5003af33b87b27a.jpg)

8．处理冲突

合并后有冲突时，弹出的对话框如下图，注意此时“resolved”按钮是灰色

点“edit conflict”按钮，将打开SVN的合并对话框，让开发者进行手工合并

通过手工合并后，合并后的代码将在下面窗口中显示，确认合并完毕，点工具栏上的第二个保存图标进行保存，并关闭当前合并的对话框；回到处理冲突的对话框中，会发现之前“resolved”按钮是灰色，现在变成可点按钮：

[![img](http://e.hiphotos.baidu.com/zhidao/wh=600,800/sign=6d02079e9b22720e7b9beafc4bfb267e/b219ebc4b74543a9e6d358301d178a82b8011405.jpg)](http://e.hiphotos.baidu.com/zhidao/pic/item/b219ebc4b74543a9e6d358301d178a82b8011405.jpg)

点“resolved”按钮，至此，当前的冲突已解决；SVN会继续合并后面的版本。

9．提交代码

合并完代码后，最后别忘记提交代码，同时要输入注释，方便日后追溯。注释参考格式如下：从[分支或主干]合并代码到[主干或分支]，版本号是从[开始的版本号]到[结束的版本号]；

来源： [http://zhidao.baidu.com/link?url=l6ABtb2BpHbkFELene0RsFAJpix2Ii-V-X727-lbVh1pPvw70IYdVp0hqFYqqXe2pmwK2d-VTJk4Rdcb_wveKWn5f34kCTMiaZ2-GwkqMPe](http://zhidao.baidu.com/link?url=l6ABtb2BpHbkFELene0RsFAJpix2Ii-V-X727-lbVh1pPvw70IYdVp0hqFYqqXe2pmwK2d-VTJk4Rdcb_wveKWn5f34kCTMiaZ2-GwkqMPe)