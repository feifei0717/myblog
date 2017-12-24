开始搭建项目框架的时候,忽略了sql执行超时时间的问题. 原本使用.net开发是,默认的超时时间是30s,这个时间一般一般sql是用不到的,但也不排除一些比较复杂或数据量较大的sql.

而[Java](http://lib.csdn.net/base/17)中,如果不指定,默认超时时间是不做限制的,默认值为0.

由于我们的项目采用Mybatis进行[数据库](http://lib.csdn.net/base/14)操作,经过查看Mybaits相关文档,配置sql超时时间有两种方法

### 1 全局配置

在mybatis配置文件的settings节点中,增加如下配置

```
<settings>  
<setting name="defaultStatementTimeout" value="25"/>  
</settings>  
```

这是以秒为单位的全局sql超时时间设置,当超出了设置的超时时间时,会抛出SQLTimeoutException

### 2 Mapper XML配置

还有一种方法是在mapper xml文件中对具体一个sql进行设置,方法为在select/update/insert节点中配置timeout属性,依然是以秒为单位表示超时时间并只作用于这一个sql.

```
<insert  
  id="insertAuthor"  
  parameterType="domain.blog.Author"  
  flushCache="true"  
  statementType="PREPARED"  
  keyProperty=""  
  keyColumn=""  
  useGeneratedKeys=""  
  timeout="20">  
```

来源： <http://blog.csdn.net/shuimuz_j/article/details/9674427>