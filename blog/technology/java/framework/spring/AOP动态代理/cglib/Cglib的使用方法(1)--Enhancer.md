cglib系列文章索引

1. [Cglib的使用方法(1)--Enhancer](http://www.cnblogs.com/icejoywoo/archive/2011/06/05/2072970.html)
2. [Cglib的使用方法(2)--CallbackFilter](http://www.cnblogs.com/icejoywoo/archive/2011/06/05/2072971.html)
3. [Cglib的使用方法(3)--Mixin](http://www.cnblogs.com/icejoywoo/archive/2011/06/05/2072973.html)
4. [Cglib的使用方法(4)--BeanCopier](http://www.cnblogs.com/icejoywoo/archive/2011/06/05/2072975.html)

cglib官方网站:<http://cglib.sourceforge.net/>

一篇不错的英文教程: <http://jnb.ociweb.com/jnb/jnbNov2005.html>

cglib is a powerful, high performance and quality Code Generation Library, It is used to extend JAVA classes and implements interfaces at runtime.

cglib 是一个强大的, 高效高质的代码生成库.

简单的使用方法

Enhancer中有几个常用的方法, setSuperClass和setCallback, 设置好了SuperClass后, 可以使用create制作代理对象了

```
Enhancer enhancer = new Enhancer();
enhancer.setSuperclass(EnhancerDemo.class);
enhancer.setCallback(new MethodInterceptorImpl());
 
EnhancerDemo demo = (EnhancerDemo) enhancer.create();
```

实现MethodInterceptor接口

```
private static class MethodInterceptorImpl implements MethodInterceptor {
 
        @Override
        public Object intercept(Object obj, Method method, Object[] args,
                MethodProxy proxy) throws Throwable {
            System.out.println("Before invoke " + method);
            Object result = proxy.invokeSuper(obj, args);
            System.out.println("After invoke" + method);
            return result;
        }
         
    }
```

intercept方法, Object result = proxy.invokeSuper(obj, args)调用了原来的方法, 在这个调用前后可以添加其他的逻辑, 相当于AspectJ的around

完整代码如下:

```
import java.lang.reflect.Method;
import net.sf.cglib.proxy.Enhancer;
import net.sf.cglib.proxy.MethodInterceptor;
import net.sf.cglib.proxy.MethodProxy;
public class EnhancerDemo {
    public static void main(String[] args) {
        Enhancer enhancer = new Enhancer();
        enhancer.setSuperclass(EnhancerDemo.class);
        enhancer.setCallback(new MethodInterceptorImpl());
        EnhancerDemo demo = (EnhancerDemo) enhancer.create();
        demo.test();
        System.out.println(demo);
    }
    public void test() {
        System.out.println("EnhancerDemo test()");
    }
    private static class MethodInterceptorImpl implements MethodInterceptor {
        @Override
        public Object intercept(Object obj, Method method, Object[] args,
                                MethodProxy proxy) throws Throwable {
            System.out.println("Before invoke " + method);
            Object result = proxy.invokeSuper(obj, args);
            System.out.println("After invoke" + method);
            return result;
        }
    }
}
```

运行结果如下:

```
Before invoke public void EnhancerDemo.test()
EnhancerDemo test()
After invokepublic void EnhancerDemo.test()
Before invoke public java.lang.String java.lang.Object.toString()
Before invoke public native int java.lang.Object.hashCode()
After invokepublic native int java.lang.Object.hashCode()
After invokepublic java.lang.String java.lang.Object.toString()
EnhancerDemo$$EnhancerByCGLIB$$bc9b2066@1621e42
```

我们可以看到System.out.println(demo), demo首先调用了toString()方法, 然后又调用了hashCod, 我们可以查看toString的源代码

```
public String toString() {
    return getClass().getName() + "@" + Integer.toHexString(hashCode());
    }
```

生成的对象为EnhancerDemo$$EnhancerByCGLIB$$bc9b2066的实例, 这个类是运行时由cglib产生的



作者：[icejoywoo](http://www.cnblogs.com/icejoywoo/)

出处：<http://www.cnblogs.com/icejoywoo/>

本文版权归作者和博客园共有，欢迎转载，但未经作者同意必须保留此段声明，且在文章页面明显位置给出原文连接，否则保留追究法律责任的权利. 短网址: http://goo.gl/ZiZCi

来源： <http://www.cnblogs.com/icejoywoo/archive/2011/06/05/2072970.html>