**什么是CAS协议** 

Memcached于1.2.4版本新增CAS(Check and Set)协议类同于Java并发的CAS(Compare and Swap)原子操作，处理同一item被多个线程更改过程的并发问题。 

在Memcached中，每个key关联有一个64-bit长度的long型惟一数值，表示该key对应value的版本号。这个数值由Memcached server产生，从1开始，且同一Memcached server不会重复。在两种情况下这个版本数值会加1：1、新增一个key-value对；2、对某已有key对应的value值更新成功。删除item版本值不会减小。 

例如 
Java代码  

```
MemcachedClient client = new MemcachedClient();  
   client.set("fKey", "fValue");   
  //第一次set, 在Memcached server中会维护fKey对应的value的版本号，假设是548;  
  
   client.set("fKey", "sValue");   
  //再次set，则这个fKey对应的value的版本号变为549;  
  
   CASValue casValue = client.gets("fKey");  
  //这样就可以得到对应key的cas版本号和实际value(各个Memcached client都有类似的对象表示，名字可能不一样，但效果类同)，如 casValue.getValue = "sValue"，casValue.getCas=549;  
```

**CAS协议解决的问题** 

模拟多个Memcached client并发set同一个key的场景。如clientA想把当前key的value set为"x"，且操作成功；clientB却把当前key的value值由"x"覆盖set为"y"，这时clientA再根据key去取value时得到"y"而不是期望的"x"，它使用这个值，但不知道这个值已经被其它线程修改过，就可能会出现问题。 

CAS协议解决这种并发修改问题。有线程试图修改当前key-value对的value时，先由gets方法得到item的版本号，操作完成提交数据时，使用cas方法谨慎变更，如果在本地对item操作过程中这个key-value对在Memcached server端被其它线程更改过，就放弃此次修改(乐观锁概念)。 

Java代码  

```
CASValue casValue = client.gets(key);  
//*****  
//本地的各种处理  
//*****  
CASResponse response = client.cas(key, newValue, casValue);  
//在我取数据时item的版本号是casValue.getCas()，所以提交时我期望item的版本号是没有改变过的。如果被修改过，不是我取数据时的版本号，那么Memcached server对这次提交什么也不做，返回true或false由用户自己来提出解决方案(什么也不做或是重新获取版本号，再次重试提交等) 
```

 

**并发环境下的正确性验证** 

用多个Memcached client并发更改同一个key值，将value递增，如果  操作次数-CAS失败次数 = value增加的值，表示并发环境下CAS处理没有问题。 

Java代码  

```
import java.io.IOException;  
import java.net.InetSocketAddress;  
  
import net.spy.memcached.CASResponse;  
import net.spy.memcached.CASValue;  
import net.spy.memcached.MemcachedClient;  
  
  
public class CASTest {  
      
    private static MemcachedClient client = null;  
      
    static {  
        try {  
            client = new MemcachedClient(  
                                new InetSocketAddress("localhost", 11211));  
        } catch (IOException o) {  
            o.printStackTrace();  
        }  
    }  
  
    public static void main(String[] args) throws Exception {  
        //Firstly, the key should exist.  
        //key is "number", value is Integer 1, 7845 is expire time  
        client.set("number", 7845, 1);  
          
          
        CASTest testObj = new CASTest();  
        //start the multithread environment  
        for (int i = 0; i < 10; i++) {  
            testObj.new ThreadTest("Thread-" + (i + 1)).start();  
        }  
    }  
      
    /** 
     * Each thread runs many times 
     */  
    private class ThreadTest extends Thread {  
          
        private  MemcachedClient client = null;  
        ThreadTest(String name) throws IOException {  
            super(name);  
            client = new MemcachedClient(  
                                  new InetSocketAddress("localhost", 11211));  
        }  
          
        public void run() {  
            int i = 0;  
            int success = 0;  
            while (i < 10) {  
                i++;  
                CASValue<Object> uniqueValue =client.gets("number");  
                CASResponse response = client.cas("number",     
                 uniqueValue.getCas(), (Integer)uniqueValue.getValue() + 1);  
  
                if (response.toString().equals("OK")) {  
                    success++;  
                }  
                System.out.println(Thread.currentThread().getName() + " " +  i   
                  + " time " + " update oldValue : " + uniqueValue   
                  +  " , result : " + response);  
            }  
              
            if (success < 10) {  
                System.out.println(Thread.currentThread().getName()  
                      + " unsuccessful times : " + (10 - success ));  
            }  
        }  
    }  
}
```

每次执行的结果都会不一样，如其中某次的执行结果为: 总共操作100次，冲突47次，且最后value由1涨到53，那么表示验证成功。 

不足之处，诚请提出！
来源： [http://langyu.iteye.com/blog/680052](http://langyu.iteye.com/blog/680052)