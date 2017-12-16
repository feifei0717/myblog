select: 

```
夺得2008年欧洲杯冠军的国家是： 
<select name="nation" id="nation"> 
<option value="">请选择</option> 
<option value="Germany">德国</option> 
<option value="France">法国</option> 
<option value="Italy">意大利</option> 
<option value="England">英国</option> 
<option value="Spain">西班牙</option> 
<option value="Greece">希腊</option> 
</select> 
```

1、判断是否选择了国家。 

```
if($("#nation").val()=="") { 
alert("请选择国家"); 
} 
```

　　2、获取select中option项的个数。 

```
$("#nation").find("option").length;
```

　　3、获取选中的option的值value和显示的文本text。 

```
//获取选中项的值 
$("#nation").val(); 
//获取选中项显示的文本 
$("#nation").find("option:selected").text(); 
```

　　4、设置西班牙为选中项。 

```
$("#nation").find("option[value='Spain']").attr("selected",true);
```

　　5、获取被选中的国家的索引，索引从0开始。 

```
$("#nation").find("option:selected").index()
```

　6、添加一个国家选项。 

```
$("#nation").append("<option value='Ukraine'>乌克兰</option>");
```

　7、删除一个国家选项。 

```
//删除value="Italy"的选项 
$("#nation").find("option[value='Italy']").remove(); 
//删除索引为2的选项 
$("#nation").find("option[index=2]").remove(); 
```

来源： <<http://www.jb51.net/article/30577.htm>>

 