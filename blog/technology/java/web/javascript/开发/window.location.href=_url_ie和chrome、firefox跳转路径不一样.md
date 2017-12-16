window.location.href=_url_ie和chrome、firefox跳转路径不一样问题

分类: javascript
日期: 2014-09-15

原文地址: 

http://blog.chinaunix.net/uid-29632145-id-4473217.html

------

****[window.location.href="url"ie和chrome、firefox跳转路径不一样问题]() *2014-09-15 17:47:03*

分类： JavaScript

```

var browser = navigator.userAgent ;
//alert(browser);
if(browser.indexOf("Chrome")!=-1 || browser.indexOf("Firefox") != -1 ) {
    alert("是firefox  和 chrome");
    window.location.href="moder/excelOut_GoldOutput?tableColumn="+tableColumn+"&starttime="+starttime+"&endtime="+endtime+"&pageNo="+pageNo+"&pageSize="+pageSize;
}else{
 alert("是ie");
 window.location.href="excelOut_GoldOutput?tableColumn="+tableColumn+"&starttime="+starttime+"&endtime="+endtime+"&pageNo="+pageNo+"&pageSize="+pageSize;
}
```

