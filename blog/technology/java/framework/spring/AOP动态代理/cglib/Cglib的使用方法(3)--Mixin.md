cglib系列文章索引

1. [Cglib的使用方法(1)--Enhancer](http://www.cnblogs.com/icejoywoo/archive/2011/06/05/2072970.html)
2. [Cglib的使用方法(2)--CallbackFilter](http://www.cnblogs.com/icejoywoo/archive/2011/06/05/2072971.html)
3. [Cglib的使用方法(3)--Mixin](http://www.cnblogs.com/icejoywoo/archive/2011/06/05/2072973.html)
4. [Cglib的使用方法(4)--BeanCopier](http://www.cnblogs.com/icejoywoo/archive/2011/06/05/2072975.html)

这是一种将多个接口混合在一起的方式, 实现了多个接口

这种方式是一种多继承的替代方案, 很大程度上解决了多继承的很多问题, 实现和理解起来都比较容易

```
import net.sf.cglib.proxy.Mixin;
 
 
public class MixinDemo {
    public static void main(String[] args) {
        Class<?>[] interfaces = new Class[] {MyInterfaceA.class, MyInterfaceB.class};
        Object[] delegates = new Object[] {new MyInterfaceAImpl(), new MyInterfaceBImpl()};
         
        Object o = Mixin.create(interfaces, delegates);
         
        MyInterfaceA a = (MyInterfaceA)o;
        a.methodA();
         
        MyInterfaceB b = (MyInterfaceB)o;
        b.methodB();
    }
}
 
interface MyInterfaceA {
 
    public void methodA();
}
 
interface  MyInterfaceB {
    public void methodB();
}
 
class MyInterfaceAImpl implements MyInterfaceA {
 
    public void methodA() {
        System.out.println("MyInterfaceAImpl.methodA()");
    }
}
 
class MyInterfaceBImpl implements MyInterfaceB {
 
    public void methodB() {
        System.out.println("MyInterfaceBImpl.methodB()");
    }
}
```

输出结果:

```
MyInterfaceAImpl.methodA()
MyInterfaceBImpl.methodB()
```

来源： <http://www.cnblogs.com/icejoywoo/archive/2011/06/05/2072973.html>