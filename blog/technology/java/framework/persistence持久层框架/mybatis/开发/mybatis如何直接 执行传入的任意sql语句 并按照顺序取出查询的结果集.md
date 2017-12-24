# mybatis如何直接 执行传入的任意sql语句 并按照顺序取出查询的结果集

## 说明

需求:

1.直接执行前端传来的任何sql语句，parameterType="String"，

2.对于任何sql语句，其返回值类型无法用resultMap在xml文件里配置或者返回具体的bean类型，因此设置resultType="java.util.Map"，但是Map并不保证存入取出顺序一致，

因此设置resultType="java.util.LinkedHashMap"，为保证查询的字段值有序（存入与取出顺序一致）所以采用LinkedHashMap。

3.当返回值为LinkedHashMap时，表中存储的null值并不会存入Map中，因此还要在mybatis配置文件中增加如下配置：

```
<settings>
<setting name="callSettersOnNulls" value="true"/>
</settings>
```

 mapper的接口方法：

```
 List<LinkedHashMap<String, Object>> superManagerSelect(String sql);
```

相匹配的xml文件：

```
<select id="superManagerSelect" parameterType="String" resultType="java.util.LinkedHashMap"> 
${sql} 
</select>
```

这样配置时，会出现：there no getter sql in java.lang.String 的异常，因此sql改成value，便不会报错。

```
<select id="superSelect" parameterType="String" resultType="java.util.LinkedHashMap"> 
${value} 
</select>
```

 



## 使用实例

dao层:

```java
package com.feiniu.soa.commodity.commodityapi.dao.core;


import java.util.LinkedHashMap;
import java.util.List;

import org.apache.ibatis.annotations.Param;

/**
 * <B>Description:</B> 超级查询通用dao <br>
 * <B>Create on:</B> 2017/10/23 上午9:41 <br>
 *
 * @author xiangyu.ye
 * @version 1.0
 */
public interface ISuperCommonDao {
    
    /**
     * <B>Description:</B> 执行传入的任意sql语句，并按照顺序取出查询的结果集 <br>
     * <B>Create on:</B> 2017/10/23 上午9:42 <br>
     *
     * @author xiangyu.ye
     */
    List<LinkedHashMap> superSelect(@Param("sql") String sql);
}

```

mapper.xml层:

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE mapper PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN" "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
<mapper namespace="com.feiniu.soa.commodity.commodityapi.dao.core.ISuperCommonDao">

    <select id="superSelect" parameterType="string" resultType="java.util.LinkedHashMap">
        ${sql}
    </select>


</mapper>
```









来源： http://www.cnblogs.com/wuyun-blog/p/5769096.html