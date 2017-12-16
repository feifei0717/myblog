## 一 回调模式（CallBack） yxytest

​    1 类A持有一个类B的一个引用，类A并且实现了一个接口CallBack

​    2 类B有一个方法f，接收一个参数callBack，参数类型为CallBack，在方法f中调用了callBack的方法

​    下面是一个小例子：

   

```
package com.malone.callBack;  
  
public class CallBackDemo {  
  
    public static void main(String[] args) {  
        B b = new B();  
        A a = new A(b);  
        a.test();  
    }  
}  
  
interface CallBack {  
    public void doSomething();  
}  
  
class A implements CallBack {  
      
    private B b;  
      
    A(B b) {  
        this.b = b;  
    }  
      
    public void test() {  
        b.testB(this);  
    }  
      
    public void doSomething() {  
        System.out.println("do something...");  
    }  
      
}  
  
class B {  
      
    public void testB(CallBack callBack) {  
        System.out.println("========================");  
        callBack.doSomething();  
    }  
      
      
}  
```

在写了这个demo之后，一直思考使用CallBack的好处是什么？

 

 

## 二 Spring CallBack 模式的使用

​    在Spring 中大量的使用了回调模式，很多都封装到了源码中，现在我举一个和我们写代码最相关的例子：HibernateCallback

​    HibernateCallback：经常使用spring整合hibernate的程序员们都该知道，我们的Dao实现类一般都会继承HibernateDaoSupport，由此我们可以得到HibernateTemplate，spring对hibernate的操作进行了封装，

​    HibernateTemplate提供了常规的CRUD操作，但是HibernateTemplate的封装也是程序失去了hibernate中直接使用Session操作的灵活性，所以HibernateTemplate提供了

​    execute(CallBack action)等系列方法，允许程序员实现自己的HibernateCallBack，实现具体的逻辑。

​    如下代码是HibernateTemplate如何具体使用HibernateCall（即回调的具体实现）：

   具体代码示例：/Users/jerryye/backup/studio/AvailableCode/framework/hibernate/spirng和hibernate整合HibernateTemplate方式/SpringWithHibernateTemplate

```
    public <T> T execute(HibernateCallback<T> action) throws DataAccessException {
        return doExecute(action, false, false);
    }
    protected <T> T doExecute(HibernateCallback<T> action, boolean enforceNewSession, boolean enforceNativeSession)
            throws DataAccessException {
        Assert.notNull(action, "Callback object must not be null");
        Session session = (enforceNewSession ?
                SessionFactoryUtils.getNewSession(getSessionFactory(), getEntityInterceptor()) : getSession());
        boolean existingTransaction = (!enforceNewSession &&
                (!isAllowCreate() || SessionFactoryUtils.isSessionTransactional(session, getSessionFactory())));
        if (existingTransaction) {
            logger.debug("Found thread-bound Session for HibernateTemplate");
        }
        FlushMode previousFlushMode = null;
        try {
            previousFlushMode = applyFlushMode(session, existingTransaction);
            enableFilters(session);
            Session sessionToExpose =
                    (enforceNativeSession || isExposeNativeSession() ? session : createSessionProxy(session)); //在HibernateTemplate中得到实现，然后调用回调函数实现具体的逻辑 
                    T result = action.doInHibernate(sessionToExpose);
            flushIfNecessary(session, existingTransaction);
            return result;
        }
        catch (HibernateException ex) {
            throw convertHibernateAccessException(ex);
        }
        catch (SQLException ex) {
            throw convertJdbcAccessException(ex);
        }
        catch (RuntimeException ex) {
            // Callback code threw application exception...  
            throw ex;
        }
        finally {
            if (existingTransaction) {
                logger.debug("Not closing pre-bound Hibernate Session after HibernateTemplate");
                disableFilters(session);
                if (previousFlushMode != null) {
                    session.setFlushMode(previousFlushMode);
                }
            }
            else {
                // Never use deferred close for an explicitly new Session.  
                if (isAlwaysUseNewSession()) {
                    SessionFactoryUtils.closeSession(session);
                }
                else {
                    SessionFactoryUtils.closeSessionOrRegisterDeferredClose(session, getSessionFactory());
                }
            }
        }
    }
```

由此可见，在此处使用回调模式，公共部分的操作都放在了hibernateTemplate的doExcute方法里，具体的实现让程序员来实现HibernateCallback回调接口，从而实现具体的逻辑，本人感觉这是CallBack模式的一大优点

 

来源： <http://abc08010051.iteye.com/blog/1965526>