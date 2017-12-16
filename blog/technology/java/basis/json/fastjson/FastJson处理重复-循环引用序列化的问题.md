json序列化的坑，你遇到过吗？

题图：from Google

## 什么是重复/循环引用

简单说，重复引用就是一个集合/对象中的多个元素/属性同时引用同一对象，循环引用就是集合/对象中的多个元素/属性存在相互引用导致循环。

举例说明

1. 重复引用

   ```
   List<Object> list = new ArrayList<>();
   Object obj = new Object();
   list.add(obj);
   list.add(obj);
   ```

2. 循环引用

   ```
   // 循环引用的特殊情况，自引用
   Map<String,Object> map = new HashMap<>();
   map.put("map",map);
   //
   // map1引用了map2，而map2又引用map1，导致循环引用
   Map<String,Object> map1 = new HashMap<>();
   Map<String,Object> map2 = new HashMap<>();
   map1.put("map",map2);
   map2.put("map",map1);
   ```

## 循环引用会触发的问题

暂时不说重复引用，单说循环引用。
一般来说，存在循环引用问题的集合/对象在序列化时（比如Json化），如果不加以处理，会触发StackOverflowError异常。

分析原因：

> 当序列化引擎解析map1时，它发现这个对象持有一个map2的引用，转而去解析map2。解析map2时，发现他又持有map1的引用，又转回map1。如此产生StackOverflowError异常。

## FastJson对重复/循环引用的处理

首先，fastjson作为一款序列化引擎，不可避免的会遇到循环引用的问题，为了避免StackOverflowError异常，fastjson会对引用进行检测。

> 如果检测到存在重复/循环引用的情况，fastjson默认会以“引用标识”代替同一对象，而非继续循环解析导致StackOverflowError。

以上文两例说明,查看json化后的输出

1. 重复引用 JSON.toJSONString(list)

   ```
   [
       {},	 //obj的实体
       {
           "$ref": "$[0]"	 //对obj的重复引用的处理
       }
   ]
   ```

2. 循环引用 JSON.toJSONString(map1)

   ```
   {
   // map1的key:value对
       "map": {
       	 // map2的key:value对
           "map": {
           	 // 指向map1，对循环引用的处理
               "$ref": ".."
           }
       }
   }
   ```

引用标识说明：

> “$ref”:”..” 上一级
> “$ref”:”@” 当前对象，也就是自引用
> “$ref”:”$” 根对象
> “$ref”:”$.children.0” 基于路径的引用，相当于root.getChildren().get(0)

## 关闭FastJson的引用检测

```
JSON.toJSONString(object, SerializerFeature.DisableCircularReferenceDetect);
```

FastJson提供了SerializerFeature.DisableCircularReferenceDetect这个序列化选项，用来关闭引用检测。关闭引用检测后，重复引用对象时就不会被$ref代替，但是在循环引用时也会导致StackOverflowError异常。

## 避免重复引用序列化时显示$ref

1. **在编码时，使用新对象为集合或对象赋值，而非使用同一对象**
   不要在多处引用同一个对象，这可以说是一种java编码规范，需要时刻注意。
2. **不要关闭FastJson的引用检测来避免显示$ref**
   引用检测是FastJson提供的一种避免运行时异常的优良机制，如果为了避免在重复引用时显示$ref而关闭它，会有很大可能导致循环引用时发生StackOverflowError异常。这也是FastJson默认开启引用检测的原因。

## 避免重复/循环引用的正确姿势

1. 重复引用

   ```
   List<Object> list = new ArrayList<>();
   Object obj = new Object();
   list.add(obj);
   // 创建新的对象
   Object newObj = new Object();
   // 使用org.springframework.beans.BeansUtils复制属性值
   BeansUtils.copy(obj, newObj);
   list.add(obj);
   ```

2. 循环引用
   循环引用这种逻辑本身就不合理，需要在编码时注意避免，这是逻辑错误而非编码技巧。

   ​

   来源： <http://coderec.cn/2016/03/23/FastJson%E5%A4%84%E7%90%86%E9%87%8D%E5%A4%8D-%E5%BE%AA%E7%8E%AF%E5%BC%95%E7%94%A8%E5%BA%8F%E5%88%97%E5%8C%96%E7%9A%84%E9%97%AE%E9%A2%98/>