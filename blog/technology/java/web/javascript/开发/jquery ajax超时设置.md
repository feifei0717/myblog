# [jquery ajax超时设置](http://transcoder.tradaquan.com/tc?srd=1&dict=32&h5ad=1&bdenc=1&lid=12152175865958421721&title=jqueryajax%E8%B6%85%E6%97%B6%E8%AE%BE%E7%BD%AE-charling-%E5%8D%9A%E5%AE%A2%E5%9B%AD&nsrc=IlPT2AEptyoA_yixCFOxXnANedT62v3IEQGG_ytK1DK6mlrte4viZQRAYTfuQnOPHU_wdoSOxBt8w8Oe_WQn8wwTaP1s)

```
var ajaxTimeoutTest = $.ajax({
　　url:'',  //请求的URL
　　timeout : 1000 , //超时时间设置，单位毫秒
　　type : 'get',  //请求方式，get或post
　　data :{},  //请求所传参数，json格式
　　dataType:'json',//返回的数据格式
　　success:function(data){ //请求成功的回调函数
　　　　alert("成功");
　　},
　　complete : function(XMLHttpRequest,status){ //请求完成后最终执行参数
　　　　if(status=='timeout'){//超时,status还有success,error等值的情况 
 　　　　　 //ajaxTimeoutTest.abort(); 
　　　　　  alert("超时"); 
　　　　} 
　　}
});
```

设置timeout的时间，通过检测complete时status的值判断请求是否超时，如果超时执行响应的操作。