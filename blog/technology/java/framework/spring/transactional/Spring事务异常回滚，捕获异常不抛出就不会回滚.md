# Spring事务异常回滚，捕获异常不抛出就不会回滚

最近遇到了事务不回滚的情况，我还考虑说JPA的事务有bug？ 我想多了.......  
  为了打印清楚日志，很多方法我都加tyr catch，在catch中打印日志。但是这边情况来了，当这个方法异常时候 日志是打印了，但是加的事务却没有回滚。

  **例：**  类似这样的方法不会回滚 （一个方法出错，另一个方法不会回滚） ：  

```
if(userSave){          
    try {         
        userDao.save(user);          
        userCapabilityQuotaDao.save(capabilityQuota);         
     } catch (Exception e) {          
        logger.info("能力开通接口，开户异常，异常信息："+e);         
     }         
 } 
```

下面的方法回滚（一个方法出错，另一个方法会回滚）：

```
if(userSave){         
     try {          
        userDao.save(user);          
        userCapabilityQuotaDao.save(capabilityQuota);         
       } catch (Exception e) {         
        logger.info("能力开通接口，开户异常，异常信息："+e);          
        throw new RuntimeException();         
     }          
} 
```

或者：

```
if(userSave){          
    try {          
        userDao.save(user);          
        userCapabilityQuotaDao.save(capabilityQuota);          
    } catch (Exception e) {          
        logger.info("能力开通接口，开户异常，异常信息："+e);          
        TransactionAspectSupport.currentTransactionStatus().setRollbackOnly();         
    }         
 }  
```

为什么不会滚呢？？是对[spring](http://lib.csdn.net/base/17)的事务机制就不明白。！！ 
   默认spring事务只在发生未被捕获的 runtimeexcetpion时才回滚。  
   spring aop  异常捕获原理：被拦截的方法需显式抛出异常，并不能经任何处理，这样aop代理才能捕获到方法的异常，才



能进行回滚，默认情况下aop只捕获runtimeexception的异常，但可以通过  
   配置来捕获特定的异常并回滚  
   换句话说在service的方法中不使用try catch 或者在catch中最后加上throw new runtimeexcetpion（），这样程序异常时才能被aop捕获进而回滚





## 解决方案： 

  方案1.例如service层处理事务，那么service中的方法中不做异常捕获，或者在catch语句中最后增加throw new RuntimeException()语句，以便让aop捕获异常再去回滚，并且在service上层（webservice客户端，view层action）要继续捕获这个异常并处理
  **方案2.在service层方法的catch语句中增加：TransactionAspectSupport.currentTransactionStatus().setRollbackOnly();语句，手动回滚，这样上层就无需去处理异常（现在项目的做法）**

例子：

```
        if (0==(responseVO.getResult())){ //0 表示扣除失败 1 表示扣除成功
            //手动回滚事务：  如果后面读数据库进行 增删改都会回滚！
            TransactionAspectSupport.currentTransactionStatus().setRollbackOnly();
            return resultVO;
        }
```

来源： [http://blog.csdn.net/yipanbo/article/details/46048413](http://blog.csdn.net/yipanbo/article/details/46048413)