# fastjson SerializerFeature详解

## 依赖

```
        <dependency>
            <groupId>com.alibaba</groupId>
            <artifactId>fastjson</artifactId>
            <version>1.2.7</version>
        </dependency>
```

## SerializerFeature属性

| 名称                             | 含义                                       | 备注    |
| ------------------------------ | ---------------------------------------- | ----- |
| QuoteFieldNames                | 输出key时是否使用双引号,默认为true                    |       |
| UseSingleQuotes                | 使用单引号而不是双引号,默认为false                     |       |
| WriteMapNullValue              | 是否输出值为null的字段,默认为false                   |       |
| WriteEnumUsingToString         | Enum输出name()或者original,默认为false          |       |
| UseISO8601DateFormat           | Date使用ISO8601格式输出，默认为false               |       |
| WriteNullListAsEmpty           | List字段如果为null,输出为[],而非null               |       |
| WriteNullStringAsEmpty         | 字符类型字段如果为null,输出为”“,而非null               |       |
| WriteNullNumberAsZero          | 数值字段如果为null,输出为0,而非null                  |       |
| WriteNullBooleanAsFalse        | Boolean字段如果为null,输出为false,而非null         |       |
| SkipTransientField             | 如果是true，类中的Get方法对应的Field是transient，序列化时将会被忽略。默认为true |       |
| SortField                      | 按字段名称排序后输出。默认为false                      |       |
| WriteTabAsSpecial              | 把\t做转义输出，默认为false                        | `不推荐` |
| PrettyFormat                   | 结果是否格式化,默认为false                         |       |
| WriteClassName                 | 序列化时写入类型信息，默认为false。反序列化是需用到             |       |
| DisableCircularReferenceDetect | 消除对同一对象循环引用的问题，默认为false                  |       |
| WriteSlashAsSpecial            | 对斜杠’/’进行转义                               |       |
| BrowserCompatible              | 将中文都会序列化为\uXXXX格式，字节数会多一些，但是能兼容IE 6，默认为false |       |
| WriteDateUseDateFormat         | 全局修改日期格式,默认为false。JSON.DEFFAULT_DATE_FORMAT = “yyyy-MM-dd”;JSON.toJSONString(obj, SerializerFeature.WriteDateUseDateFormat); |       |
| DisableCheckSpecialChar        | 一个对象的字符串属性中如果有特殊字符如双引号，将会在转成json时带有反斜杠转移符。如果不需要转义，可以使用这个属性。默认为false |       |
| NotWriteRootClassName          | 含义                                       |       |
| BeanToArray                    | 将对象转为array输出                             |       |
| WriteNonStringKeyAsString      | 含义                                       |       |
| NotWriteDefaultValue           | 含义                                       |       |
| BrowserSecure                  | 含义                                       |       |
| IgnoreNonFieldGetter           | 含义                                       |       |
| WriteEnumUsingName             | 含义                                       |       |

## 示例

### 准备

- User、Word来模拟各种数据类型。
- SerializerFeatureTest：JSON部分示例的示例方法。

### User类型：缺省get、set方法

```
public class User {

    private int id;
    private String name;
    private String add;
    private String old;
    }
12345678
```

### Word类型：缺省get、set方法

```
public class Word {

    private String d;
    private String e;
    private String f;
    private String a;
    private int b;
    private boolean c;
    private Date date;
    private Map<String , Object> map;
    private List<User> list;
    }
12345678910111213
```

#### SerializerFeatureTest:测试类

```
public class SerializerFeatureTest {

    private static Word word;

    private static void init() {
        word = new Word();
        word.setA("a");
        word.setB(2);
        word.setC(true);
        word.setD("d");
        word.setE("");
        word.setF(null);
        word.setDate(new Date());

        List<User> list = new ArrayList<User>();
        User user1 = new User();
        user1.setId(1);
        user1.setOld("11");
        user1.setName("用户1");
        user1.setAdd("北京");
        User user2 = new User();
        user2.setId(2);
        user2.setOld("22");
        user2.setName("用户2");
        user2.setAdd("上海");
        User user3 = new User();
        user3.setId(3);
        user3.setOld("33");
        user3.setName("用户3");
        user3.setAdd("广州");

        list.add(user3);
        list.add(user2);
        list.add(null);
        list.add(user1);

        word.setList(list);

        Map<String , Object> map = new HashedMap();
        map.put("mapa", "mapa");
        map.put("mapo", "mapo");
        map.put("mapz", "mapz");
        map.put("user1", user1);
        map.put("user3", user3);
        map.put("user4", null);
        map.put("list", list);
        word.setMap(map);
    }

    public static void main(String[] args) {
        init();
//        useSingleQuotes();
//        writeMapNullValue();
//        useISO8601DateFormat();
//        writeNullListAsEmpty();
//        writeNullStringAsEmpty();
//        sortField();
//        prettyFormat();
//        writeDateUseDateFormat();
//        beanToArray();
        showJsonBySelf();
    }

    /**
     * 9:自定义
     * 格式化输出
     * 显示值为null的字段
     * 将为null的字段值显示为""
     * DisableCircularReferenceDetect:消除循环引用
     */
    private static void showJsonBySelf() {
        System.out.println(JSON.toJSONString(word));
        System.out.println(JSON.toJSONString(word, SerializerFeature.PrettyFormat,
                SerializerFeature.WriteMapNullValue, SerializerFeature.WriteNullStringAsEmpty,
                SerializerFeature.DisableCircularReferenceDetect,
                SerializerFeature.WriteNullListAsEmpty));
    }

    /**
     * 8:
     * 将对象转为array输出
     */
    private static void beanToArray() {
        word.setMap(null);
        word.setList(null);
        System.out.println(JSON.toJSONString(word));
        System.out.println(JSON.toJSONString(word, SerializerFeature.BeanToArray));
    }

    /**
     * 7:
     * WriteDateUseDateFormat:全局修改日期格式,默认为false。
     */
    private static void writeDateUseDateFormat() {
        word.setMap(null);
        word.setList(null);
        System.out.println(JSON.toJSONString(word));
        JSON.DEFFAULT_DATE_FORMAT = "yyyy-MM-dd";
        System.out.println(JSON.toJSONString(word, SerializerFeature.WriteDateUseDateFormat));
    }

    /**
     * 6:
     * PrettyFormat
     */
    private static void prettyFormat() {
        word.setMap(null);
        word.setList(null);
        System.out.println(JSON.toJSONString(word));
        System.out.println(JSON.toJSONString(word, SerializerFeature.PrettyFormat));
    }

    /**
     * SortField:按字段名称排序后输出。默认为false
     * 这里使用的是fastjson：为了更好使用sort field martch优化算法提升parser的性能，fastjson序列化的时候，
     * 缺省把SerializerFeature.SortField特性打开了。
     * 反序列化的时候也缺省把SortFeidFastMatch的选项打开了。
     * 这样，如果你用fastjson序列化的文本，输出的结果是按照fieldName排序输出的，parser时也能利用这个顺序进行优化读取。
     * 这种情况下，parser能够获得非常好的性能。
     */
    private static void sortField() {
        System.out.println(JSON.toJSONString(word));
        System.out.println(JSON.toJSONString(word, SerializerFeature.SortField));
    }

    /**
     *  5:
     *  WriteNullStringAsEmpty:字符类型字段如果为null,输出为"",而非null
     *  需要配合WriteMapNullValue使用，现将null输出
     */
    private static void writeNullStringAsEmpty() {
        word.setE(null);
        System.out.println(JSONObject.toJSONString(word));
        System.out.println("设置WriteMapNullValue后：");
        System.out.println(JSONObject.toJSONString(word, SerializerFeature.WriteMapNullValue));
        System.out.println("设置WriteMapNullValue、WriteNullStringAsEmpty后：");
        System.out.println(JSONObject.toJSONString(word, SerializerFeature.WriteMapNullValue, SerializerFeature.WriteNullStringAsEmpty));
    }


    /**
     * 4:
     * WriteNullListAsEmpty:List字段如果为null,输出为[],而非null
     * 需要配合WriteMapNullValue使用，现将null输出
     */
    private static void writeNullListAsEmpty() {
        word.setList(null);
        System.out.println(JSONObject.toJSONString(word));
        System.out.println("设置WriteNullListAsEmpty后：");
        System.out.println(JSONObject.toJSONString(word, SerializerFeature.WriteMapNullValue, SerializerFeature.WriteNullListAsEmpty));
    }

    /**
     * 3:
     * UseISO8601DateFormat:Date使用ISO8601格式输出，默认为false
     */
    private static void useISO8601DateFormat() {
        System.out.println(JSONObject.toJSONString(word));
        System.out.println("设置UseISO8601DateFormat后：");
        System.out.println(JSONObject.toJSONString(word, SerializerFeature.UseISO8601DateFormat));
    }

    /**
     * 2:
     * WriteMapNullValue:是否输出值为null的字段,默认为false
     */
    private static void writeMapNullValue() {
        System.out.println(JSONObject.toJSONString(word));
        System.out.println("设置WriteMapNullValue后：");
        System.out.println(JSONObject.toJSONString(word, SerializerFeature.WriteMapNullValue));
    }

    /**
     * 1:
     * UseSingleQuotes:使用单引号而不是双引号,默认为false
     */
    private static void useSingleQuotes() {
        System.out.println(JSONObject.toJSONString(word));
        System.out.println("设置useSingleQuotes后：");
        System.out.println(JSONObject.toJSONString(word, SerializerFeature.UseSingleQuotes));
    }
}
```

### 对应输出结果如下：

- 1、useSingleQuotes： 
  ![这里写图片描述](image-201801040913/20160914162745717)
- 2、writeMapNullValue： 
  ![这里写图片描述](image-201801040913/20160914162804474)
- 3、useISO8601DateFormat： 
  ![这里写图片描述](image-201801040913/20160914162819850)
- 4、writeNullListAsEmpty： 
  ![这里写图片描述](image-201801040913/20160914162835389)
- 5、writeNullStringAsEmpty： 
  ![这里写图片描述](image-201801040913/20160914162849530)
- 6、prettyFormat： 
  ![这里写图片描述](image-201801040913/20160914162904593)
- 7、writeDateUseDateFormat： 
  ![这里写图片描述](image-201801040913/20160914162919077)
- 8、beanToArray： 
  ![这里写图片描述](image-201801040913/20160914162933874)
- 9、自定义组合：showJsonBySelf： 
  ![这里写图片描述](image-201801040913/20160914162947258)
  此时完整的输出如下：

```
{"a":"a","b":2,"c":true,"d":"d","date":1473839656840,"e":"","list":[{"add":"广州","id":3,"name":"用户3","old":"33"},{"add":"上海","id":2,"name":"用户2","old":"22"},null,{"add":"北京","id":1,"name":"用户1","old":"11"}],"map":{"list":[{"$ref":"$.list[0]"},{"$ref":"$.list[1]"},null,{"$ref":"$.list[3]"}],"user3":{"$ref":"$.list[0]"},"mapz":"mapz","mapo":"mapo","mapa":"mapa","user1":{"$ref":"$.list[3]"}}}
{
    "a":"a",
    "b":2,
    "c":true,
    "d":"d",
    "date":1473839656840,
    "e":"",
    "f":"",
    "list":[
        {
            "add":"广州",
            "id":3,
            "name":"用户3",
            "old":"33"
        },
        {
            "add":"上海",
            "id":2,
            "name":"用户2",
            "old":"22"
        },
        null,
        {
            "add":"北京",
            "id":1,
            "name":"用户1",
            "old":"11"
        }
    ],
    "map":{
        "list":[
            {
                "add":"广州",
                "id":3,
                "name":"用户3",
                "old":"33"
            },
            {
                "add":"上海",
                "id":2,
                "name":"用户2",
                "old":"22"
            },
            null,
            {
                "add":"北京",
                "id":1,
                "name":"用户1",
                "old":"11"
            }
        ],
        "user4":null,
        "user3":{
            "add":"广州",
            "id":3,
            "name":"用户3",
            "old":"33"
        },
        "mapz":"mapz",
        "mapo":"mapo",
        "mapa":"mapa",
        "user1":{
            "add":"北京",
            "id":1,
            "name":"用户1",
            "old":"11"
        }
    }
}
```

注意： 
- [fastjson把对象转化成json避免$ref](http://blog.csdn.net/u010246789/article/details/52538953)

学习地址： 
- <http://blog.csdn.net/glarystar/article/details/6654494> 
- <http://blog.csdn.net/u013163567/article/details/50736096>

项目github地址： 
- <https://github.com/gubaijin/buildmavenweb>

http://blog.csdn.net/u010246789/article/details/52539576