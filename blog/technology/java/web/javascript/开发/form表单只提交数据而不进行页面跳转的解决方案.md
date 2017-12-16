# form表单只提交数据而不进行页面跳转的解决方案



将数据提交到saveReport（form的action指向）页面，但是页面又不进行跳转，即保持当前页面不变呢？利用jquery的ajaxSubmit函数以及form的onsubmit函数完成



一般的form提交操作写法为 

```
<form action="saveReport.htm" method="post"> 
…… 
<input type="submit" value="保存报告"/> 
</form> 
```

 点击submit按钮或直接回车可以将数据提交到saveReport页面，但是提交后也会跳转到saveReport页面 

如何做到 
将数据提交到saveReport（form的action指向）页面，但是页面又不进行跳转，即保持当前页面不变呢？？ 
这种需要在load一个页面的时候尤其迫切。 

利用jquery的ajaxSubmit函数以及form的onsubmit函数完成，如下： 

```
<form id="saveReportForm" action="saveReport.htm" method="post" onsubmit="return saveReport();"> 
<input type="submit" value="保存报告"/> 
</form> 
```

form增加一个id用于在jquery中调用，增加一个onsubmit函数用于submit前自己提交表单 

saveReport对应函数为  

```
function saveReport() { 
// jquery 表单提交 
$("#showDataForm").ajaxSubmit(function(message) { 
// 对于表单提交成功后处理，message为提交页面saveReport.htm的返回内容 
}); 

return false; // 必须返回false，否则表单会自己再做一次提交操作，并且页面跳转 
} 
```







http://www.jb51.net/article/41490.htm