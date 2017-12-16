#  JS中使用EL表达式

分两种情况

## 1.JS代码在JSP页面中, 这可以直接使用EL表达式. 如:

```
<script type="text/javascript">  
    $(function () {  
        new BacklogOverview("${param.alert}");  
    });  
</script>  
```

## 2.JS代码是单独的.js 文件, 通过引入到 JSP中来.这时候可通过提前定义JS变量的形式的解决,如:

```
<c:set var="contextPath" value="${pageContext.request.contextPath}" scope="application"/>  
    <script>  
        <%--JS gloable varilible--%>  
        var contextPath = "${contextPath}";  
    </script>  
```

在JSP页面上定义JS变量 contextPath.

这样在之后引入的JS文件中就可以使用contextPath变量了.

```
//Image setting  
config.filebrowserImageUploadUrl = contextPath + "/ckeditor/upload.htm"; 
```



http://blog.csdn.net/monkeyking1987/article/details/17146951