# mybatis查询入参介绍



如果有注解@Param 则如下处理:

MapperMethod.convertArgsToSqlCommandParam()

```java
    public Object convertArgsToSqlCommandParam(Object[] args) {
      final int paramCount = params.size();
      if (args == null || paramCount == 0) {
        return null;
        //hasNamedParameters true代码有用 Param注解
      } else if (!hasNamedParameters && paramCount == 1) {
        //没有Param注解 处理方式直接取原来
        return args[params.keySet().iterator().next().intValue()];
      } else {
        //有注解或者多个 封装成map
        final Map<String, Object> param = new ParamMap<Object>();
        int i = 0;
        for (Map.Entry<Integer, String> entry : params.entrySet()) {
          param.put(entry.getValue(), args[entry.getKey().intValue()]);
          // issue #71, add param names as param1, param2...but ensure backward compatibility
          final String genericParamName = "param" + String.valueOf(i + 1);
          if (!param.containsKey(genericParamName)) {
            param.put(genericParamName, args[entry.getKey()]);
          }
          i++;
        }
        return param;
      }
    }
```



查询是否有注解代码:

MapperMethod.hasNamedParams

```java
   this.hasNamedParameters = hasNamedParams(method);
   private boolean hasNamedParams(Method method) {
      final Object[][] paramAnnos = method.getParameterAnnotations();
      for (Object[] paramAnno : paramAnnos) {
        for (Object aParamAnno : paramAnno) {
          if (aParamAnno instanceof Param) {
            return true;
          }
        }
      }
      return false;
    }
```



后面会在包裹一层

DefaultSqlSession.wrapCollection()

```java
//最后如果是集合或者数组 最终都会转成map  
private Object wrapCollection(final Object object) {
    if (object instanceof Collection) {
      StrictMap<Object> map = new StrictMap<Object>();
      map.put("collection", object);
      if (object instanceof List) {
        map.put("list", object);
      }
      return map;
    } else if (object != null && object.getClass().isArray()) {
      StrictMap<Object> map = new StrictMap<Object>();
      map.put("array", object);
      return map;
    }
    return object;
  }

```

如果有注解则





没有注解

