Java提高：推荐使用枚举定义常量

## 一、分析 

常量的声明是每一个项目中不可或缺的，在Java1.5之前，我们只有两种方式的声明：类常量和接口常量。不过，在1.5版之后有了改进，即新增了一种常量声明方式，枚举常量。代码如下： 

```
enum Season{   
    Spring,Summer,Autumn,Winter;   
}   
```

## 二、场景 

那么枚举常量与我们的经常使用的类常量和静态常量比有什么优势呢？ 

### **1.枚举常量更简单 **

先把Season枚举翻译成接口，代码如下： 

```
interface Season{   
    int Sprint = 0;   
    int Summer = 1;   
    int Autumn = 2;   
    int Winter = 3;   
}   
```

枚举只需要定义每个枚举项，不需要定义枚举值，而接口常量（或类常量）则必须定义值，否则编译通不过；两个引用的方式相同（都是“类名.属性”，如Season.Sprint），但是枚举表示的是一个枚举项，字面含义是春天，而接口常量却是一个Int类型。 

### **2.枚举常量属于稳态型 **

使用常量接口，我们得对输入值进行检查，确定是否越界，如果常量非常庞大，校验输入就是一件非常麻烦的事情，但这是一个不可逃避的过程。 

```
public void describe(int s){   
    //s变量不能超越边界，校验条件   
    if(s >= 0 && s <4){   
        switch(s){   
            case Season.Summer:   
                System.out.println("Summer is very hot!");   
                break;   
            case Season.Winter:   
                System.out.println("Winter is very cold!");   
                break;   
        …..   
        }   
    }   
}  
```

我们再来看看枚举常量是否能够避免校验问题，代码如下： 

```
public void describe(Season s){   
    switch(s){   
        case Season.Summer:   
            System.out.println("Summer is very hot!");   
            break;   
        case Season.Winter:   
            System.out.println("Winter is very cold!");   
            break;   
        …...   
    }   
}   
```

不用校验，已经限定了是Season枚举，所以只能是Season类的四个实例。这也是我们看重枚举的地方：在编译期间限定类型，不允许发生越界的情况。 

### **3.枚举具有内置方法 **

每个枚举都是[Java](http://lib.csdn.net/base/javase).lang.Enum的子类，该基类提供了诸如获得排序值的ordinal方法、compareTo比较方法等，大大简化了常量的访问。比如，列出所有枚举值： 

```
public static void main(String[] args){   
    for(Season s:Season.values()){   
        System.out.println(s);   
    }   
}   
```

### **4.枚举可以自定义方法 **

这一点似乎不是枚举的优点，类常量也可以有自己的方法，但关键是枚举常量不仅仅可以定义静态方法，还可以定义非静态方法，而且还能够从根本上杜绝常量类被实例化。比如我们在定义获取最舒服的季节，使用枚举的代码如下： 

```
enum Season{   
    Spring,Summer,Autumn,Winter;   
    //最舒服的季节   
    public static Season getComfortableSeason(){   
        return Spring;   
    }   
}   
```

那如果是使用类常量如何实现呢？如下： 

```
class Season{   
    public final static int Spring = 0;   
    public final static int Summer = 1;   
    public final static int Autumn = 2;   
    public final static int Winter = 3;   
   
    //最舒服的季节   
    public static int getComfortableSeason(){   
        return Spring;   
    }   
}  
```

虽然枚举在很多方面都比接口常量和类常量好用，但是它有一点比不上接口常量和类常量的，就是继承，枚举类型是不能有继承的，也就是说一个枚举常量定义完毕后，除非修改重构，否则无法做扩展。 

## 三、建议 

在项目开发中，推荐使用枚举常量代替接口常量或类常量。 







查看评论

- 2楼 [曹学亮](http://blog.csdn.net/u012308971) 2016-09-30 15:31发表 [[回复\]](http://blog.csdn.net/p106786860/article/details/11516269#reply)



  学习了。


- 1楼 [kaixuan0381](http://blog.csdn.net/kaixuan0381) 2016-05-06 09:21发表 [[回复\]](http://blog.csdn.net/p106786860/article/details/11516269#reply) [[引用\]](http://blog.csdn.net/p106786860/article/details/11516269#quote) [[举报\]](http://blog.csdn.net/p106786860/article/details/11516269#report)



  http://www.codeceo.com/article/why-android-not-use-enums.htmlandroid官网强烈不建议使用

来源： <http://blog.csdn.net/p106786860/article/details/11516269>