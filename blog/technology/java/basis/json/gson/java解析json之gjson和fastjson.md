# json的几种格式：

```
json对象————javabean格式
{"age":1,"id":"1","name":"fastjson"}
json数组————List<javabean>格式
json字符串:[{"age":1,"id":"1","name":"fastjson1"},{"age":2,"id":"2","name":"fastjson2"}]
json字符串————List<String>格式
json字符串:["fastjson1","fastjson2","fastjson3"]
另一种json数组————List<Map<String,Object>>格式
json字符串:[{"key1":"value1","key2":"value2"},{"key1":1,"key2":2}]
```



# fastjson解析json：

**将上面的四种数据对象转换成json字符串的方法都是一样的**

String jsonString = JSON.toJSONString(obj);

解析json：

1. **将json字符串转化成JavaBean对象**

   Person person = new Person("1","fastjson",1);

   //这里将javabean转化成json字符串

   String jsonString = JSON.toJSONString(person);

   //这里将json字符串转化成javabean对象,

   person =JSON.parseObject(jsonString,Person.class);

2. **将json字符串转化成List<JavaBean>对象**

   Person person1 = new Person("1","fastjson1",1);

   Person person2 = new Person("2","fastjson2",2);

   List<Person> persons = new ArrayList<Person>();

   persons.add(person1);

   persons.add(person2);

   String jsonString = JSON.toJSONString(persons);

   System.out.println("json字符串:"+jsonString);

   //解析json字符串

   List<Person> persons2 = JSON.parseArray(jsonString,Person.class);

3. **将json字符串转化成List<String>对象**

   List<String> list = new ArrayList<String>();

   list.add("fastjson1");

   list.add("fastjson2");

   list.add("fastjson3");

   String jsonString = JSON.toJSONString(list);

   System.out.println("json字符串:"+jsonString);

   //解析json字符串

   List<String> list2 = JSON.parseObject(jsonString,new TypeReference<List<String>>(){}); 

 

4.**将json字符串转化成List<Map<String,Object>>对象** 

Map<String,Object> map = new HashMap<String,Object>();

map.put("key1", "value1");

map.put("key2", "value2");

Map<String,Object> map2 = new HashMap<String,Object>();

map2.put("key1", 1);

map2.put("key2", 2);

List<Map<String,Object>> list = new ArrayList<Map<String,Object>>();

list.add(map);

list.add(map2);

String jsonString = JSON.toJSONString(list);

System.out.println("json字符串:"+jsonString);

//解析json字符串

List<Map<String,Object>> list2 = JSON.parseObject(jsonString,new TypeReference<List<Map<String,Object>>>(){});

# gson解析json：

**将上面的四种数据对象转换成json字符串的方法都是一样的**

   Gson gson = new Gson();

   String jsonString = gson.toJson(obj);

1. **将json字符串转化成JavaBean对象**

   Person person = new Person("1","gson",1);

   Gson gson = new Gson();

   //这里将javabean转化成json字符串

   String jsonString = gson.toJson(person);

   System.out.println(jsonString);

   //这里将json字符串转化成javabean对象,

   person = gson.fromJson(jsonString,Person.class);

2.  **将json字符串转化成List<JavaBean>对象**

   Person person1 = new Person("1","gson1",1);

   Person person2 = new Person("2","gson2",2);

   List<Person> persons = new ArrayList<Person>();

   persons.add(person1);

   persons.add(person2);

   Gson gson = new Gson();

   //这里将lsit<javabean>转化成json字符串

   String jsonString = gson.toJson(persons);

   //解析json字符串

   List<Person> persons2 = gson.fromJson(jsonString, new TypeToken<List<Person>>(){}.getType());

3.  **将json字符串转化成List<String>对象**

   List<String> list = new ArrayList<String>();

   list.add("gson1");

   list.add("gson2");

   list.add("gson3");

   Gson gson = new Gson();

   String jsonString = gson.toJson(list);

   System.out.println("json字符串:"+jsonString); 

   //解析json字符串

   List<String> list2 = gson.fromJson(jsonString, new TypeToken<List<String>>(){}.getType());

4.  **将json字符串转化成List<Map<String,Object>>对象**

   Map<String,Object> map = new HashMap<String,Object>();

   map.put("key1", "value1");

   map.put("key2", "value2");

   Map<String,Object> map2 = new HashMap<String,Object>();

   map2.put("key1", 1);

   map2.put("key2", 2);

   List<Map<String,Object>> list = new ArrayList<Map<String,Object>>();

   list.add(map);

   list.add(map2);

   Gson gson =  new Gson();

   String jsonString = gson.toJson(list);

   System.out.println("json字符串:"+jsonString);

   //解析json字符串

   List<Map<String,Object>> list2 = gson.fromJson(jsonString, new TypeToken<List<Map<String,Object>>>(){}.getType());

   来源： <http://www.cnblogs.com/bbglz/p/4599773.html>