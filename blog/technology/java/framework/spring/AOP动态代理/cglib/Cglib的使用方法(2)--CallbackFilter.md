cglib系列文章索引

1. [Cglib的使用方法(1)--Enhancer](http://www.cnblogs.com/icejoywoo/archive/2011/06/05/2072970.html)
2. [Cglib的使用方法(2)--CallbackFilter](http://www.cnblogs.com/icejoywoo/archive/2011/06/05/2072971.html)
3. [Cglib的使用方法(3)--Mixin](http://www.cnblogs.com/icejoywoo/archive/2011/06/05/2072973.html)
4. [Cglib的使用方法(4)--BeanCopier](http://www.cnblogs.com/icejoywoo/archive/2011/06/05/2072975.html)

CallbackFilter可以实现不同的方法使用不同的回调方法

CallbackFilter中的accept方法, 根据不同的method返回不同的值i, 这个值是在callbacks中的顺序, 就是调用了callbacks[i]

```
import java.lang.reflect.Method;
import net.sf.cglib.proxy.Callback;
import net.sf.cglib.proxy.CallbackFilter;
import net.sf.cglib.proxy.Enhancer;
import net.sf.cglib.proxy.MethodInterceptor;
import net.sf.cglib.proxy.MethodProxy;
import net.sf.cglib.proxy.NoOp;
/**
 * <B>Description:</B>  <br>
 * <B>Create on:</B> 2016/5/24 16:53 <br>
 * <p/>
 * CallbackFilter可以实现不同的方法使用不同的回调方法
 * CallbackFilter中的accept方法, 根据不同的method返回不同的值i, 这个值是在callbacks中的顺序, 就是调用了callbacks[i]
 *
 * @author xiangyu.ye
 * @version 1.0
 */
public class CallbackFilterDemo {
    public static void main(String[] args) {
        Callback[] callbacks = new Callback[]{new MethodInterceptorImpl(), NoOp.INSTANCE};
        Enhancer enhancer = new Enhancer();
        enhancer.setSuperclass(MyClass.class);
        enhancer.setCallbacks(callbacks);
        enhancer.setCallbackFilter(new CallbackFilterImpl());
        MyClass myClass = (MyClass) enhancer.create();
        myClass.method();
        myClass.method1();
    }
    private static class CallbackFilterImpl implements CallbackFilter {
        /**
         * Map a method to a callback.
         * @param method the intercepted method
         * @return the index into the array of callbacks (as specified by {@link Enhancer#setCallbacks}) to use for the method,
         */
        @Override
        public int accept(Method method) {
            if (method.getName().equals("method"))
                return 1;
            else
                return 0;
        }
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
class MyClass {
    public void method() {
        System.out.println("MyClass.method()");
    }
    public void method1() {
        System.out.println("MyClass.method()1");
    }
}
```



作者：[icejoywoo](http://www.cnblogs.com/icejoywoo/)

出处：<http://www.cnblogs.com/icejoywoo/>

本文版权归作者和博客园共有，欢迎转载，但未经作者同意必须保留此段声明，且在文章页面明显位置给出原文连接，否则保留追究法律责任的权利. 短网址: http://goo.gl/ZiZCi

来源： <http://www.cnblogs.com/icejoywoo/archive/2011/06/05/2072971.html>