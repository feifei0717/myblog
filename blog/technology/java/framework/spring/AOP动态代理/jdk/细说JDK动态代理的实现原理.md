# 细说JDK动态代理的实现原理

关于JDK的动态代理，最为人熟知要可能要数[spring](http://lib.csdn.net/base/17) AOP的实现，默认情况下，Spring AOP的实现对于接口来说就是使用的JDK的动态代理来实现的，而对于类的代理使用CGLIB来实现。那么，什么是JDK的动态代理呢？

JDK的动态代理，就是在程序运行的过程中，根据被代理的接口来动态生成代理类的class文件，并加载运行的过程。JDK从1.3开始支持动态代理。那么JDK是如何生成动态代理的呢？JDK动态代理为什么不支持类的代理，只支持接口的代理？

首先来看一下如何使用JDK动态代理。JDK提供了[Java](http://lib.csdn.net/base/17).lang.reflect.Proxy类来实现动态代理的，可通过它的newProxyInstance来获得代理实现类。同时对于代理的接口的实际处理，是一个java.lang.reflect.InvocationHandler，它提供了一个invoke方法供实现者提供相应的代理逻辑的实现。可以对实际的实现进行一些特殊的处理，像Spring AOP中的各种advice。下面来看看如何使用。

被代理的接口

```
package com.mikan.proxy;  
  
/** 
 * @author Mikan 
 * @date 2015-09-15 18:00 
 */  
public interface HelloWorld {  
  
    void sayHello(String name);  
  
} 
```

接口的实现类：

```

package com.mikan.proxy;  
  
/** 
 * @author Mikan 
 * @date 2015-09-15 18:01 
 */  
public class HelloWorldImpl implements HelloWorld {  
    @Override  
    public void sayHello(String name) {  
        System.out.println("Hello " + name);  
    }  
} 
```

实现一个java.lang.reflect.InvocationHandler：

```
package com.mikan.proxy;  
  
import java.lang.reflect.InvocationHandler;  
import java.lang.reflect.Method;  
  
/** 
 * @author Mikan 
 * @date 2015-09-15 19:53 
 */  
public class CustomInvocationHandler implements InvocationHandler {  
    private Object target;  
  
    public CustomInvocationHandler(Object target) {  
        this.target = target;  
    }  
  
    @Override  
    public Object invoke(Object proxy, Method method, Object[] args) throws Throwable {  
        System.out.println("Before invocation");  
        Object retVal = method.invoke(target, args);  
        System.out.println("After invocation");  
        return retVal;  
    }  
}  
```

使用代理：

```
package com.mikan.proxy;  
  
import java.lang.reflect.Proxy;  
  
/** 
 * @author Mikan 
 * @date 2015-09-15 18:01 
 */  
public class ProxyTest {  
  
    public static void main(String[] args) throws Exception {  
        System.getProperties().put("sun.misc.ProxyGenerator.saveGeneratedFiles", "true");  
  
        CustomInvocationHandler handler = new CustomInvocationHandler(new HelloWorldImpl());  
        HelloWorld proxy = (HelloWorld) Proxy.newProxyInstance(  
                ProxyTest.class.getClassLoader(),  
                new Class[]{HelloWorld.class},  
                handler);  
        proxy.sayHello("Mikan");  
    }  
  
}  
```

运行的输出结果：

```
localhost:classes mikan$ java com/mikan/proxy/ProxyTest  
Before invocation  
Hello Mikan  
After invocation  
```

从上面可以看出，JDK的动态代理使用起来非常简单，但是只知道如何使用是不够的，知其然，还需知其所以然。所以要想搞清楚它的实现，那么得从源码入手。这里的源码是1.7.0_79。首先来看看它是如何生成代理类的：

```
public static Object newProxyInstance(ClassLoader loader,  
                                      Class<?>[] interfaces,  
                                      InvocationHandler h)  
    throws IllegalArgumentException {  
    if (h == null) {  
        throw new NullPointerException();  
    }  
  
    final Class<?>[] intfs = interfaces.clone();  
    final SecurityManager sm = System.getSecurityManager();  
    if (sm != null) {  
        checkProxyAccess(Reflection.getCallerClass(), loader, intfs);  
    }  
    // 这里是生成class的地方  
    Class<?> cl = getProxyClass0(loader, intfs);  
    // 使用我们实现的InvocationHandler作为参数调用构造方法来获得代理类的实例  
    try {  
        final Constructor<?> cons = cl.getConstructor(constructorParams);  
        final InvocationHandler ih = h;  
        if (sm != null && ProxyAccessHelper.needsNewInstanceCheck(cl)) {  
            return AccessController.doPrivileged(new PrivilegedAction<Object>() {  
                public Object run() {  
                    return newInstance(cons, ih);  
                }  
            });  
        } else {  
            return newInstance(cons, ih);  
        }  
    } catch (NoSuchMethodException e) {  
        throw new InternalError(e.toString());  
    }  
}  
```

其中newInstance只是调用Constructor.newInstance来构造相应的代理类实例，这里重点是看getProxyClass0这个方法的实现：

```
private static Class<?> getProxyClass0(ClassLoader loader,  
                                       Class<?>... interfaces) {  
    // 代理的接口数量不能超过65535（没有这种变态吧）  
    if (interfaces.length > 65535) {  
        throw new IllegalArgumentException("interface limit exceeded");  
    }  
    // JDK对代理进行了缓存，如果已经存在相应的代理类，则直接返回，否则才会通过ProxyClassFactory来创建代理  
    return proxyClassCache.get(loader, interfaces);  
}  
```

其中代理缓存是使用WeakCache实现的，如下

```

private static final WeakCache<ClassLoader, Class<?>[], Class<?>>  
    proxyClassCache = new WeakCache<>(new KeyFactory(), new ProxyClassFactory()); 
```

具体的缓存逻辑这里暂不关心，只需要关心ProxyClassFactory是如何生成代理类的，ProxyClassFactory是Proxy的一个静态内部类，实现了WeakCache的内部接口BiFunction的apply方法：

```
private static final class ProxyClassFactory  
    implements BiFunction<ClassLoader, Class<?>[], Class<?>> {  
    // 所有代理类名字的前缀  
    private static final String proxyClassNamePrefix = "$Proxy";  
  
    // 用于生成代理类名字的计数器  
    private static final AtomicLong nextUniqueNumber = new AtomicLong();  
  
    @Override  
    public Class<?> apply(ClassLoader loader, Class<?>[] interfaces) {  
        // 省略验证代理接口的代码……  
  
        String proxyPkg = null;     // 生成的代理类的包名  
        // 对于非公共接口，代理类的包名与接口的相同  
        for (Class<?> intf : interfaces) {  
            int flags = intf.getModifiers();  
            if (!Modifier.isPublic(flags)) {  
                String name = intf.getName();  
                int n = name.lastIndexOf('.');  
                String pkg = ((n == -1) ? "" : name.substring(0, n + 1));  
                if (proxyPkg == null) {  
                    proxyPkg = pkg;  
                } else if (!pkg.equals(proxyPkg)) {  
                    throw new IllegalArgumentException(  
                        "non-public interfaces from different packages");  
                }  
            }  
        }  
  
        // 对于公共接口的包名，默认为com.sun.proxy  
        if (proxyPkg == null) {  
            proxyPkg = ReflectUtil.PROXY_PACKAGE + ".";  
        }  
  
        // 获取计数  
        long num = nextUniqueNumber.getAndIncrement();  
        // 默认情况下，代理类的完全限定名为：com.sun.proxy.$Proxy0，com.sun.proxy.$Proxy1……依次递增  
        String proxyName = proxyPkg + proxyClassNamePrefix + num;  
  
        // 这里才是真正的生成代理类的字节码的地方  
        byte[] proxyClassFile = ProxyGenerator.generateProxyClass(  
            proxyName, interfaces);  
        try {  
            // 根据二进制字节码返回相应的Class实例  
            return defineClass0(loader, proxyName,  
                                proxyClassFile, 0, proxyClassFile.length);  
        } catch (ClassFormatError e) {  
            throw new IllegalArgumentException(e.toString());  
        }  
    }  
}  
```

ProxyGenerator是sun.misc包中的类，它没有开源，但是可以反编译来一探究竟：

```
public static byte[] generateProxyClass(final String var0, Class[] var1) {  
    ProxyGenerator var2 = new ProxyGenerator(var0, var1);  
    final byte[] var3 = var2.generateClassFile();  
    // 这里根据参数配置，决定是否把生成的字节码（.class文件）保存到本地磁盘，我们可以通过把相应的class文件保存到本地，再反编译来看看具体的实现，这样更直观  
    if(saveGeneratedFiles) {  
        AccessController.doPrivileged(new PrivilegedAction() {  
            public Void run() {  
                try {  
                    FileOutputStream var1 = new FileOutputStream(ProxyGenerator.dotToSlash(var0) + ".class");  
                    var1.write(var3);  
                    var1.close();  
                    return null;  
                } catch (IOException var2) {  
                    throw new InternalError("I/O exception saving generated file: " + var2);  
                }  
            }  
        });  
    }  
    return var3;  
}  
```

saveGeneratedFiles这个属性的值从哪里来呢：

```
private static final boolean saveGeneratedFiles = ((Boolean)AccessController.doPrivileged(new GetBooleanAction("sun.misc.ProxyGenerator.saveGeneratedFiles"))).booleanValue();  
```

GetBooleanAction实际上是调用Boolean.getBoolean(propName)来获得的，而Boolean.getBoolean(propName)调用了System.getProperty(name)，所以我们可以设置sun.misc.ProxyGenerator.saveGeneratedFiles这个系统属性为true来把生成的class保存到本地文件来查看。

这里要注意，当把这个属性设置为true时，生成的class文件及其所在的路径都需要提前创建，否则会抛出FileNotFoundException异常。如：

```
Exception in thread "main" java.lang.InternalError: I/O exception saving generated file: java.io.FileNotFoundException: com/sun/proxy/$Proxy0.class (No such file or directory)  
at sun.misc.ProxyGenerator$1.run(ProxyGenerator.java:336)  
at sun.misc.ProxyGenerator$1.run(ProxyGenerator.java:327)  
at java.security.AccessController.doPrivileged(Native Method)  
at sun.misc.ProxyGenerator.generateProxyClass(ProxyGenerator.java:326)  
at java.lang.reflect.Proxy$ProxyClassFactory.apply(Proxy.java:672)  
at java.lang.reflect.Proxy$ProxyClassFactory.apply(Proxy.java:592)  
at java.lang.reflect.WeakCache$Factory.get(WeakCache.java:244)  
at java.lang.reflect.WeakCache.get(WeakCache.java:141)  
at java.lang.reflect.Proxy.getProxyClass0(Proxy.java:455)  
at java.lang.reflect.Proxy.newProxyInstance(Proxy.java:738)  
at com.mikan.proxy.ProxyTest.main(ProxyTest.java:15)  
at sun.reflect.NativeMethodAccessorImpl.invoke0(Native Method)  
at sun.reflect.NativeMethodAccessorImpl.invoke(NativeMethodAccessorImpl.java:57)  
at sun.reflect.DelegatingMethodAccessorImpl.invoke(DelegatingMethodAccessorImpl.java:43)  
at java.lang.reflect.Method.invoke(Method.java:606)  
at com.intellij.rt.execution.application.AppMain.main(AppMain.java:140)  
```

即我们要在运行当前main方法的路径下创建com/sun/proxy目录，并创建一个$Proxy0.class文件，才能够正常运行并保存class文件内容。

反编译$Proxy0.class文件，如下所示：

```
package com.sun.proxy;  
  
import com.mikan.proxy.HelloWorld;  
import java.lang.reflect.InvocationHandler;  
import java.lang.reflect.Method;  
import java.lang.reflect.Proxy;  
import java.lang.reflect.UndeclaredThrowableException;  
  
public final class $Proxy0 extends Proxy implements HelloWorld {  
  private static Method m1;  
  private static Method m3;  
  private static Method m0;  
  private static Method m2;  
  
  public $Proxy0(InvocationHandler paramInvocationHandler) {  
    super(paramInvocationHandler);  
  }  
  
  public final boolean equals(Object paramObject) {  
    try {  
      return ((Boolean)this.h.invoke(this, m1, new Object[] { paramObject })).booleanValue();  
    }  
    catch (Error|RuntimeException localError) {  
      throw localError;  
    }  
    catch (Throwable localThrowable) {  
      throw new UndeclaredThrowableException(localThrowable);  
    }  
  }  
  
  public final void sayHello(String paramString) {  
    try {  
      this.h.invoke(this, m3, new Object[] { paramString });  
      return;  
    }  
    catch (Error|RuntimeException localError) {  
      throw localError;  
    }  
    catch (Throwable localThrowable) {  
      throw new UndeclaredThrowableException(localThrowable);  
    }  
  }  
  
  public final int hashCode() {  
    try {  
      return ((Integer)this.h.invoke(this, m0, null)).intValue();  
    }  
    catch (Error|RuntimeException localError) {  
      throw localError;  
    }  
    catch (Throwable localThrowable) {  
      throw new UndeclaredThrowableException(localThrowable);  
    }  
  }  
  
  public final String toString() {  
    try {  
      return (String)this.h.invoke(this, m2, null);  
    }  
    catch (Error|RuntimeException localError) {  
      throw localError;  
    }  
    catch (Throwable localThrowable) {  
      throw new UndeclaredThrowableException(localThrowable);  
    }  
  }  
  
  static {  
    try {  
      m1 = Class.forName("java.lang.Object").getMethod("equals", new Class[] { Class.forName("java.lang.Object") });  
      m3 = Class.forName("com.mikan.proxy.HelloWorld").getMethod("sayHello", new Class[] { Class.forName("java.lang.String") });  
      m0 = Class.forName("java.lang.Object").getMethod("hashCode", new Class[0]);  
      m2 = Class.forName("java.lang.Object").getMethod("toString", new Class[0]);  
      return;  
    }  
    catch (NoSuchMethodException localNoSuchMethodException) {  
      throw new NoSuchMethodError(localNoSuchMethodException.getMessage());  
    }  
    catch (ClassNotFoundException localClassNotFoundException) {  
      throw new NoClassDefFoundError(localClassNotFoundException.getMessage());  
    }  
  }  
}  
```

可以看到，动态生成的代理类有如下特性：

1. 继承了Proxy类，实现了代理的接口，由于java不能多继承，这里已经继承了Proxy类了，不能再继承其他的类，所以JDK的动态代理不支持对实现类的代理，只支持接口的代理。
2. 提供了一个使用InvocationHandler作为参数的构造方法。
3. 生成静态代码块来初始化接口中方法的Method对象，以及Object类的equals、hashCode、toString方法。
4. 重写了Object类的equals、hashCode、toString，它们都只是简单的调用了InvocationHandler的invoke方法，即可以对其进行特殊的操作，也就是说JDK的动态代理还可以代理上述三个方法。
5. 代理类实现代理接口的sayHello方法中，只是简单的调用了InvocationHandler的invoke方法，我们可以在invoke方法中进行一些特殊操作，甚至不调用实现的方法，直接返回。

至此JDK动态代理的实现原理就分析的差不多了。同时我们可以想像一下Spring AOP提供的各种拦截该如何实现，就已经很明了了，如下所示：

```
public Object invoke(Object proxy, Method method, Object[] args) throws Throwable {  
    // BeforeAdvice  
    Object retVal = null;  
    try {  
        // AroundAdvice  
        retVal = method.invoke(target, args);  
        // AroundAdvice  
        // AfterReturningAdvice  
    }  
    catch (Throwable e) {  
        // AfterThrowingAdvice  
    }  
    finally {  
        // AfterAdvice  
    }  
    return retVal;  
}  
```

上面是对于Spring AOP使用JDK动态代理实现的基本框架代码，当然具体的实现肯定比这个复杂得多，但是基本原理不外乎如是。所以理解基本原理对于理解其他的代码也是很有好处的。