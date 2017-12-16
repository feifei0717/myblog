# 计模式(行为型)之观察者模式(Observer Pattern)



## **概述**

观察者模式用于建立一种对象与对象之间的依赖关系，一个对象发生改变时将自动通知其他对象，其他对象将相应作出反应。在观察者模式中，发生改变的对象称为观察目标，而被通知的对象称为观察者，一个观察目标可以对应多个观察者，而且这些观察者之间可以没有任何相互联系，可以根据需要增加和删除观察者，使得系统更易于扩展。一个软件系统常常要求在某一个对象的状态发生变化的时候，某些其他的对象做出相应的改变。做到这一点的设计方案有很多，但是为了使系统能够易于复用，应该选择低耦合度的设计方案。减少对象之间的耦合有利于系统的复用，但是同时设计师需要使这些低耦合度的对象之间能够维持行动的协调一致，保证高度的协作。观察者模式是满足这一要求的各种设计方案中最重要的一种。

## **核心**

**概念：** 定义对象之间的一种一对多依赖关系，使得每当一个对象状态发生改变时，其相关依赖对象皆得到通知并被自动更新。观察者模式的别名包括发布-订阅（Publish/Subscribe）模式、模型-视图（Model/View）模式、源-监听器（Source/Listener）模式或从属者（Dependents）模式。观察者模式是一种对象行为型模式。

**观察者模式结构重要核心模块：**

抽象主题(Subject)

抽象主题角色把所有对观察者对象的引用保存在一个聚集（比如ArrayList对象）里，每个主题都可以有任何数量的观察者。抽象主题提供一个接口，可以增加和删除观察者对象，抽象主题角色又叫做抽象被观察者(Observable)角色。

具体主题(ConcreteSubject)

将有关状态存入具体观察者对象；在具体主题的内部状态改变时，给所有登记过的观察者发出通知。具体主题角色又叫做具体被观察者(Concrete Observable)角色。

抽象观察者(Observer)

为所有的具体观察者定义一个接口，在得到主题的通知时更新自己，这个接口叫做更新接口。

具体观察者(ConcreteObserver)

存储与主题的状态自恰的状态。具体观察者角色实现抽象观察者角色所要求的更新接口，以便使本身的状态与主题的状态 像协调。如果需要，具体观察者角色可以保持一个指向具体主题对象的引用。

## **使用场景**

一个抽象模型有两个方面，其中一个方面依赖于另一个方面，将这两个方面封装在独立的对象中使它们可以各自独立地改变和复用。

一个对象的改变将导致一个或多个其他对象也发生改变，而并不知道具体有多少对象将发生改变，也不知道这些对象是谁。

需要在系统中创建一个触发链，A对象的行为将影响B对象，B对象的行为将影响C对象……，可以使用观察者模式创建一种链式触发机制。

## **程序猿实例**

### **简单的实例：**

如下是一个简单的观察者模式。具体不再过多解释：

```
package yanbober.github.io;

import java.util.ArrayList;
import java.util.List;

//抽象观察者角色类
interface Observer {
    void update(String state);
}
//具体观察者角色类
class ProgramMonkeyObserver implements Observer {
    @Override
    public void update(String state) {
        System.out.println("Programer look the SDK download process is: "+state);
    }
}
//抽象主题角色类
abstract class Subject {
    private List<Observer> list = new ArrayList<>();

    public void attach(Observer observer) {
        list.add(observer);
    }

    public void detach(Observer observer) {
        list.remove(observer);
    }

    public void motifyObservers(String newState) {
        for (Observer observer : list) {
            observer.update(newState);
        }
    }
}
//具体主题角色类
class SDKDownloadSubject extends Subject {
    public void netProcessChange(String data) {
        this.motifyObservers(data);
    }
}
//客户端
public class Main {
    public static void main(String[] args) {
        SDKDownloadSubject sdkDownloadSubject = new SDKDownloadSubject();
        Observer observer = new ProgramMonkeyObserver();
        sdkDownloadSubject.attach(observer);
        sdkDownloadSubject.netProcessChange("1%");
        sdkDownloadSubject.netProcessChange("51%");
        sdkDownloadSubject.netProcessChange("100%");
    }
}
```

### **升级装备：**观察者模式的推拉方式。

**推方式的观察察者模式实例：**

主题对象向观察者推送主题的详细信息，不管观察者是否需要，推送的信息通常是主题对象的全部或部分数据。

如上的简单示例其实就是一个观察者模式的推方式例子，此处不多说明了。

**拉方式的观察察者模式实例：**

主题对象在通知观察者的时候，只传递少量信息。如果观察者需要更具体的信息，由观察者主动到主题对象中获取，相当于是观察者从主题对象中拉数据。一般这种模型的实现中，会把主题对象自身通过update()方法传递给观察者，这样在观察者需要获取数据的时候，就可以通过这个引用来获取了。

如下代码是对推方式（简单示例）例子的修改升级为拉方式的例子，此处不做过多解释：

```
package yanbober.github.io;

import java.util.ArrayList;
import java.util.List;

//抽象观察者角色类
interface Observer {
    void update(Subject subject);
}
//具体观察者角色类
class ProgramMonkeyObserver implements Observer {
    @Override
    public void update(Subject subject) {
        String state = ((SDKDownloadSubject)subject).getState();
        System.out.println("Programer look the SDK download process is: "+state);
    }
}
//抽象主题角色类
abstract class Subject {
    private List<Observer> list = new ArrayList<>();

    public void attach(Observer observer) {
        list.add(observer);
    }

    public void detach(Observer observer) {
        list.remove(observer);
    }

    public void motifyObservers() {
        for (Observer obs : list) {
            obs.update(this);
        }
    }
}
//具体主题角色类
class SDKDownloadSubject extends Subject {
    private String mState;

    public String getState() {
        return mState;
    }

    public void netProcessChange(String data) {
        mState = data;
        this.motifyObservers();
    }
}
//客户端
public class Main {
    public static void main(String[] args) {
        SDKDownloadSubject sdkDownloadSubject = new SDKDownloadSubject();
        Observer observer = new ProgramMonkeyObserver();
        sdkDownloadSubject.attach(observer);
        sdkDownloadSubject.netProcessChange("1%");
        sdkDownloadSubject.netProcessChange("51%");
        sdkDownloadSubject.netProcessChange("100%");
    }
}
```

### **继续升级牛逼的Java标准支持的观察者模式：**

在Java语言的java.util库里面，提供了一个Observable类以及一个Observer接口，构成了Java语言对观察者模式的支持。

Observer接口只定义了一个update()方法，当被观察者对象的状态发生变化时，被观察者对象的notifyObservers()方法就会调用这一方法。

Observable类是被观察者类的基类。java.util.Observable提供公开的方法支持观察者对象，这些方法中有两个对Observable的子类非常重要：一个是setChanged()，另一个是notifyObservers()。第一方法setChanged()被调用之后会设置一个内部标记变量，代表被观察者对象的状态发生了变化。第二个是notifyObservers()，这个方法被调用时，会调用所有登记过的观察者对象的update()方法，使这些观察者对象可以更新自己。

如下例子就是对Java库支持的观察者模式的使用，具体细节不作解释：

```
package yanbober.github.io;

import java.util.Observable;
import java.util.Observer;

//观察者
class ProgramMonkeyObserver implements Observer {

    public ProgramMonkeyObserver(Observable obs) {
        obs.addObserver(this);
    }

    @Override
    public void update(Observable o, Object arg) {
        System.out.println("Programer look the SDK download process is: "+((SDKDownloadObservable)o).getState());
    }
}
//被观察者
class SDKDownloadObservable extends Observable {
    private String mState;

    public String getState() {
        return mState;
    }

    public void netProcessChange(String data) {
        mState = data;
        this.setChanged();
        this.notifyObservers();
    }
}
//客户端
public class Main {
    public static void main(String[] args) {
        SDKDownloadObservable sdkDownloadObservable = new SDKDownloadObservable();
        new ProgramMonkeyObserver(sdkDownloadObservable);
        sdkDownloadObservable.netProcessChange("1%");
        sdkDownloadObservable.netProcessChange("51%");
        sdkDownloadObservable.netProcessChange("100%");
    }
}
```

**继续升级–对象间的交互（事件处理）：**

有了上面的三个循序渐进的观察者模式例子之后还需要继续牛逼的探索升级。。。go，go，go…

回过神是否还记得前边的基础示例，有木有发现其实Android开发中类似Fragment与Activity及Fragment与Fragment交互等操作时使用的接口方式就是观察者模式，只不过和这里写法有一点不同而已。哈哈，这就是接下来要扯淡的内容了。

在DEM模型中，目标角色（如界面组件）负责发布事件，而观察者角色（事件处理者）可以向目标订阅它所感兴趣的事件。当一个具体目标产生一个事件时，它将通知所有订阅者。事件的发布者称为事件源(Event Source)，而订阅者称为事件监听器(Event Listener)，在这个过程中还可以通过事件对象(Event Object)来传递与事件相关的信息，可以在事件监听者的实现类中实现事件处理，因此事件监听对象又可以称为事件处理对象。事件源对象、事件监听对象（事件处理对象）和事件对象构成了Java事件处理模型的三要素。

我勒个去，强大的Google Android源码的控件xxxListener不都是类似的模式么！！！哈哈，就是这么duang！！！这不就是说在事件处理中，通常使用的是一对一的观察者模式，而不是一对多的观察者模式的区别么！

实例程序就略去了，Android中无论源码还是自己写代码到处都是事件模型。

**革命尚未成功，同志还需努力。继续打怪升级观察者模式喽（MVC软件框架模型）：**

在享誉软件界的MVC(Model-View-Controller)架构中也应用了观察者模式，MVC是一种架构模式，它包含三个角色：模型(Model)，视图(View)和控制器(Controller)。其中模型可对应于观察者模式中的观察目标，而视图对应于观察者，控制器可充当两者之间的中介者。当模型层的数据发生改变时，视图层将自动改变其显示内容。

## **总结一把**

观察者模式优点：

- 观察者模式在被观察者和观察者之间建立一个抽象的耦合。被观察者角色所知道的只是一个具体观察者列表，每一个具体观察者都符合一个抽象观察者的接口。被观察者并不认识任何一个具体观察者，它只知道它们都有一个共同的接口。由于被观察者和观察者没有紧密地耦合在一起，因此它们可以属于不同的抽象化层次。如果被观察者和观察者都被扔到一起，那么这个对象必然跨越抽象化和具体化层次。

观察者模式缺点：

- 如果一个被观察者对象有很多的直接和间接的观察者的话，将所有的观察者都通知到会花费很多时间。
- 如果在被观察者之间有循环依赖的话，被观察者会触发它们之间进行循环调用，导致系统崩溃。在使用观察者模式是要特别注意这一点。
- 如果对观察者的通知是通过另外的线程进行异步投递的话，系统必须保证投递是以自恰的方式进行的。
- 虽然观察者模式可以随时使观察者知道所观察的对象发生了变化，但是观察者模式没有相应的机制使观察者知道所观察的对象是怎么发生变化的。

【工匠若水 <http://blog.csdn.net/yanbober>】 继续阅读《设计模式(行为型)之迭代器模式(Iterator Pattern)》 <http://blog.csdn.net/yanbober/article/details/45497881>