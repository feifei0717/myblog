# [Mybatis if test中字符串比较](http://www.cnblogs.com/andysd/p/3738197.html)

```
<if test=" name=='你好' ">

<if>
```

这样会有问题，换成

```
<if test=' name=="你好" '>

<if>
```

我是这样解决的

```
   <if test='status != null and status == "0,1"' >
            <![CDATA[
            and now() <=  start_dt  and   start_dt <= now()  and now() <= end_dt
            ]]>
        </if>
```

```
<if test=" name=='你好'.toString()">
这样也可
```

