[TOC]



# java简明YAML教程

前言：yaml是一种用来描述配置的语言，其可读性和简洁性较json更胜一筹，用yml写成的配置文件，以.yml结尾。

### YAML的基本语法规则

1. 大小写敏感
2. 使用缩进表示层级关系
3. 缩进是使用空格，不允许使用tab
4. 缩进对空格数目不敏感，相同层级需对齐
5. 用“#”表示行注释

### YAML的数据结构

YAML的数据结构比较简单，只有三种： 

1. 对象：类似map，用键值对表示 
2. 数组：与java数组同含义 
3. 纯量（scalars）：元数据，不可再分，多数情况下指基本数据类型

以上三种数据接口分别如下表示：**(注意，冒号和连词线后边有一个空格)**

- 对象：

```
name:zhangsan1
```

或者用行内元素表示

```
student:{name:zhangsan,age:13}1
```

- 数组：一组以连词线`-`构成的数据结构,

```
- A
- B
- C123
```

- 纯量 
  包括：字符串，布尔值，整数，浮点数，null，时间，日期，

```
#数值直接表示
number: 1.1
#布尔用true, false
isOnline: false
#null用波浪线表示
isNUll: ~
#时间采用iso8601
time: 2001-12-14t21:59:43.10-05:00
#日期用复合ios8601表示
date: 2017-09-01
#两个感叹号表示强转数据类型
a: !!str 123
b: !!str true
```

其中字符串是比较复杂的一种情况：

```
#字符串默认不用引号
str: 这是一个字符串
#字符串有空格或者特殊字符时，放在引号内（单双都可）
str: 'this is a string'
#字符串中间有单引号，需要用两个单引号转义
str: 'he''s name is X'123456
```

### JAVA解析yml

yml作为一种通用的配置语言，各语言均有对应的解析工具，这里以java的SnakeYAML为例：

maven仓库地址： 
`http://mavenrepository.com/artifact/pl.droidsonroids.yaml/snakeyaml`

#### maven配置：

```
<dependency>
    <groupId>pl.droidsonroids.yaml</groupId>
    <artifactId>snakeyaml</artifactId>
    <version>1.18.2</version>
</dependency> 
```

#### 新建yml文件

这里新建一个简单的yml配置文件： 
文件名：config.yml 
内容：

```
api_host: http://baidu.com
username: aaa12
```

#### Java解析

```
        Yaml yaml = new Yaml();
        File file = new File("D:\\code\\ymltest\\src\\main\\resources\\config.yml");
        FileInputStream fi= null;
        try {
            fi = new FileInputStream(file.getAbsolutePath());
            Object result = yaml.load(fi);
            System.out.println(result.getClass());
            System.out.println(result);
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        }1234567891011
```

解析结果：

```
class java.util.LinkedHashMap
{api_host=http://baidu.com, username=aaa}12
```

SnakeYAML也支持直接映射为对象：

```
age: 1
name: asd
params:
  event: what's up
  url:  http://baidu.com
favoriteBooks:
  - Gone with the wind
  - The Little Prince12345678
```

```
Yaml yaml = new Yaml();
        File file = new File("D:\\code\\ymltest\\src\\main\\resources\\config.yml");
        FileInputStream fi= null;
        try {
            fi = new FileInputStream(file.getAbsolutePath());
            Configs result = yaml.loadAs(fi, Configs.class);
            System.out.println(result.toString());
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        }12345678910
```

解析结果：

```
Configs{age=1, name='asd', params={event=what's up, url=http://baidu.com}, favoriteBooks=[Gone with the wind, The Little Prince]}1
```

至此，yml文件已经解析完毕，在最新的版本中，该解析器已经支持在移动端使用，所以在安卓中也可以考虑使用yml对工程进行配置

#### 参考：

<http://www.ruanyifeng.com/blog/2016/07/yaml.html?f=tt>





http://blog.csdn.net/zxb136475688/article/details/77853909