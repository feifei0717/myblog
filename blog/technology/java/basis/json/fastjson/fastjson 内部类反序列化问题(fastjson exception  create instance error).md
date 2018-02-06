[TOC]



# fastjson 内部类反序列化问题(fastjson exception  create instance error)

阅读 10

收藏 0

2017-10-09

原文链接：[blog.csdn.net](https://link.juejin.im/?target=http%3A%2F%2Fblog.csdn.net%2Fxktxoo%2Farticle%2Fdetails%2F78175997)

腾讯云域名服务年终聚惠！新注册用户域名1元起，云解析买1年送半年！立即了解详情抢购吧！ 腾讯云域名限量秒杀中！.com低至28元，.club最低1元！立即了解详情抢购吧！dnspod.cloud.tencent.com

#### 一、问题

项目开发过程中遇到了JSON反序列化问题(JSONException: create instance error)，问题如下：

```
...
com.alibaba.fastjson.JSONException: create instance error, class com.test.xiaofan.test.ClassA$ClassB
...
```

由问题可见，fastjson反序列化时尝试创建ClassA的内部内ClassB失败。测试内部类声明如下：

```
@Data
public class ClassA {

    private String filedA1;

    private String fieldA2;

    private List<ClassB> fieldA3s;

    @Data
    public class ClassB {

        private String fieldB1;

        private String filedB2;
    }
}
```

测试代码如下：

```
public class TestA {

    @Test
    public void testParseA(){
        String str = "{\"fieldA2\":\"test field A2\",\"fieldA3s\":[{\"fieldB1\":\"test field B1\",\"filedB2\":\"test "
            + "field B2\"}],\"filedA1\":\"test field A1\"}\n";

        ClassA classA = JSON.parseObject(str, ClassA.class);

        System.out.println(JSON.toJSONString(classA));
    }

    @Test
    public void testParseB() {
        String str = "{\"fieldB1\":\"test field B1\",\"filedB2\":\"test field B2\"}";

        ClassB classB = JSON.parseObject(str, ClassB.class);

        System.out.println(JSON.toJSONString(classB));
    }
```

#### 二、嵌套类与内部类

查看了fastjson官方问题解释：[点击查看](https://link.juejin.im/?target=https%3A%2F%2Fgithub.com%2Falibaba%2Ffastjson%2Fissues%2F302)，问题本质为内部类无法实例化，导致fastjson反序列化失败。

点击查看：[《Java嵌套类与内部类》](https://link.juejin.im/?target=http%3A%2F%2Fblog.csdn.net%2Fxktxoo%2Farticle%2Fdetails%2F78175909)

#### 三、解决方案

由Java嵌套类与内部类一文分析可知，非静态成员嵌套类的实例化依赖于外部类实例，而静态嵌套类的实例化不依赖于外部类，将内部类改为静态嵌套类即可。





https://juejin.im/entry/59d9ef4af265da06484483e3