 

# 设计模式之建造者模式(Builder Pattern)

【工匠若水 <http://blog.csdn.net/yanbober>】 阅读前一篇《设计模式(创建型)之单例模式(Singleton Pattern)》 <http://blog.csdn.net/yanbober/article/details/45312675>

## **概述**

建造者模式将客户端与包含多个组成部分的复杂对象的创建过程分离，客户端压根不用知道复杂对象的内部组成部分与装配方式，只需要知道所需建造者的类型即可。它关注如何一步一步创建一个的复杂对象，不同的具体建造者定义了不同的创建过程，且具体建造者相互独立，增加新的建造者非常方便，无须修改已有代码，系统具有较好的扩展性。

问题来了。。。

你可能会有疑惑，建造者模式和抽象工厂模式有啥区别呢？

其实，在建造者模式里有个指导者，由指导者来管理建造者，用户是与指导者联系的，指导者联系建造者最后得到产品。即建造模式可以强制实行一种分步骤进行的建造过程。而抽象工厂模式不具备最终的这个直接创建功能。建造者模式与工厂模式是极为相似的，总体上，建造者模式仅仅只比工厂模式多了一个“导演类”的角色。假如把这个导演类看做是最终调用的客户端，那么剩余的部分就可以看作是一个简单的工厂模式了。

与工厂模式相比，建造者模式一般用来创建更为复杂的对象，因为对象的创建过程更为复杂，因此将对象的创建过程独立出来组成一个新的导演类。

也就是说，工厂模式是将对象的全部创建过程封装在工厂类中，由工厂类向客户端提供最终的产品；而建造者模式中，建造者类一般只提供产品类中各个组件的建造，而将具体建造过程交付给导演类。由导演类负责将各个组件按照特定的规则组建为产品，然后将组建好的产品交付给客户端。

## **核心**

**概念：** 将一个复杂对象的构建与它的表示分离，使得同样的构建过程可以创建不同的表示。建造者模式是一种对象创建型模式。

**重点：** 建造者模式结构重要核心模块：

Builder（抽象建造者）

它为创建一个产品对象的各个部件指定抽象接口，在该接口中一般声明两类方法，一类方法是buildXXX()，它们用于创建复杂对象的各个部件；另一类方法是getXXX()，它们用于返回复杂对象。Builder既可以是抽象类，也可以是接口。

ConcreteBuilder（具体建造者）

它实现了Builder接口，实现各个部件的具体构造和装配方法，定义并明确它所创建的复杂对象，也可以提供一个方法返回创建好的复杂产品对象。

Product（产品角色）

它是被构建的复杂对象，包含多个组成部件，具体建造者ConcreteBuilder创建该产品的内部表示并定义它的装配过程。

Director（指挥者）

指挥者又称为导演类，它负责安排复杂对象的建造次序，指挥者与抽象建造者之间存在关联关系，可以在其construct()建造方法中调用建造者对象的部件构造与装配方法，完成复杂对象的建造。客户端一般只需要与指挥者进行交互，在客户端确定具体建造者的类型，并实例化具体建造者对象，然后通过指挥者类的构造函数或者Setter方法将该对象传入指挥者类中。

**什么是复杂对象：**是指那些包含多个成员属性的对象，这些成员属性也称为部件或零件，如程序猿要会识字、会数学、会编程语言，会设计模式等等。

## **使用场景**

需要生成的产品对象有复杂的内部结构，每一个内部成分本身可以是对象，也可以仅仅是一个对象的一个组成部分。

需要生成的产品对象的属性相互依赖。建造模式可以强制实行一种分步骤进行的建造过程，因此，如果产品对象的一个属性必须在另一个属性被赋值之后才可以被赋值，使用建造模式是一个很好的设计思想。

在对象创建过程中会使用到系统中的其他一些对象，这些对象在产品对象的创建过程中不易得到。

## **程序猿实例**

如下实例就是一个建造者模式的简单实现，具体ProgramMonkey就是产品角色，Builder就是抽象建造者，ConcreteProgramMonkey就是具体建造者，Director就是导演指挥者，负责创造两个程序猿（我们要造人了），一个Low逼，一个大牛High。

```java
package yanbober.github.io;
//Product（产品角色）
class ProgramMonkey {
    private boolean mIsLiterated;
    private boolean mKnowMath;
    private String mLanguage;
    private boolean mKnowDesign;

    public boolean ismIsLiterated() {
        return mIsLiterated;
    }

    public void setmIsLiterated(boolean mIsLiterated) {
        this.mIsLiterated = mIsLiterated;
    }

    public boolean ismKnowMath() {
        return mKnowMath;
    }

    public void setmKnowMath(boolean mKnowMath) {
        this.mKnowMath = mKnowMath;
    }

    public String getmLanguage() {
        return mLanguage;
    }

    public void setmLanguage(String mLanguage) {
        this.mLanguage = mLanguage;
    }

    public boolean ismKnowDesign() {
        return mKnowDesign;
    }

    public void setmKnowDesign(boolean mKnowDesign) {
        this.mKnowDesign = mKnowDesign;
    }

    public void show() {
        System.out.println("\rIsLiterated="+mIsLiterated+"\n"
                            +"KnowMath="+mKnowMath+"\n"
                            +"Language="+mLanguage+"\n"
                            +"KnowDesign="+mKnowDesign+"\n");
    }
}
//Builder（抽象建造者）
abstract class Builder {
    public abstract void buildIsLiterated(boolean arg);
    public abstract void buildKnowMath(boolean arg);
    public abstract void buildLanguage(String arg);
    public abstract void buildKnowDesign(boolean arg);

    public abstract ProgramMonkey getMonkey();
}
//ConcreteBuilder（具体建造者）
class ConcreteProgramMonkey extends Builder {
    private  ProgramMonkey mMonkey = new ProgramMonkey();

    @Override
    public void buildIsLiterated(boolean arg) {
        mMonkey.setmIsLiterated(arg);
    }

    @Override
    public void buildKnowMath(boolean arg) {
        mMonkey.setmKnowMath(arg);
    }

    @Override
    public void buildLanguage(String arg) {
        mMonkey.setmLanguage(arg);
    }

    @Override
    public void buildKnowDesign(boolean arg) {
        mMonkey.setmKnowDesign(arg);
    }

    @Override
    public ProgramMonkey getMonkey() {
        return mMonkey;
    }
}
//Director（指挥者）
class Director {
    private Builder builder = new ConcreteProgramMonkey();

    public ProgramMonkey getMonkeyLow() {
        builder.buildIsLiterated(true);
        builder.buildKnowMath(true);
        builder.buildLanguage("Android");
        builder.buildKnowDesign(false);

        return builder.getMonkey();
    }

    public ProgramMonkey getMonkeyHigh() {
        builder.buildIsLiterated(true);
        builder.buildKnowMath(true);
        builder.buildLanguage("Android/Java/Designer");
        builder.buildKnowDesign(true);

        return builder.getMonkey();
    }
}

public class Main {
    public static void main(String[] args) {
        Director director = new Director();
        ProgramMonkey monkey = director.getMonkeyLow();
        monkey.show();
        monkey = director.getMonkeyHigh();
        monkey.show();
    }
} 
```

**技巧Tips：**依旧可以使用配置与反射实现自动适应。

## **总结一把**

建造者模式优点：

- 建造者模式中，客户端不必知道产品内部组成的细节，将产品本身与产品的创建过程解耦，使得相同的创建过程可以创建不同的产品对象。
- 每一个具体建造者都相对独立，而与其他的具体建造者无关，因此可以很方便地替换具体建造者或增加新的具体建造者，用户使用不同的具体建造者即可得到不同的产品对象。由于指挥者类针对抽象建造者编程，增加新的具体建造者无须修改原有类库的代码，系统扩展方便，符合“开闭原则”。
- 可以更加精细地控制产品的创建过程。将复杂产品的创建步骤分解在不同的方法中，使得创建过程更加清晰。

建造者模式缺点：

- 建造者模式所创建的产品具有较多的共同点，其组成部分相似，如果产品之间的差异性很大，不适合使用建造者模式，因此其使用范围受到一定的限制。
- 如果产品的内部变化复杂，可能会导致需要定义很多具体建造者类来实现这种变化，导致系统变得很庞大，增加系统的理解难度和运行成本。

【工匠若水 <http://blog.csdn.net/yanbober>】 继续阅读《设计模式(创建型)之原型模式(Prototype Pattern)》 <http://blog.csdn.net/yanbober/article/details/45363525>





http://blog.csdn.net/yanbober/article/details/45338041