# Spring线程池ThreadPoolTaskExecutor的配置解释

 Spring 线程池 

   从例子开始讲：

Xml代码  

```
<bean id="taskExecutor"  
        class="org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor">  
        <property name="corePoolSize" value="2" />  
        <property name="maxPoolSize" value="5" />  
        <property name="queueCapacity" value="6" />  
        <property name="keepAliveSeconds" value="2000" />  
        <property name="rejectedExecutionHandler">  
            <bean class="java.util.concurrent.ThreadPoolExecutor$AbortPolicy" />  
        </property>  
    </bean>  
```

   corePoolSize：线程池至少有2个线程是启动的，即使是空闲的也不会关闭。

   maxPoolSize：最大的线程数目，当corePoolSize繁忙时，会创建线程，启动的总的线程数不能大于maxPoolSize     

   queueCapacity：queueCapacity： 队列大小，当corePoolSize没有空闲线程的时候，允许queueCapacity个线程任务等待,queueCapacity队列满时!才会在corePoolSize的基础上,maxPoolSize之内进行新的线程的创建! 

   keepAliveSeconds： 单位毫秒，超过这个时间后会将大于corePoolSize的线程关闭

   rejectedExecutionHandler： 拒绝执行任务的具体操作，AbortPolicy表示抛出RejectedExecutionException异常。还有其他的几种选择。CallerRunsPolicy：主线程执行该任务，执行完之后尝试添加下一个任务到线程池中，可以有效降低向线程池内添加任务的速度。

   看具体的代码：

Java代码  

```
public class Test {  
    private static Log            logger = LogFactory.getLog(Test .class);  
  
    //线程池  
    @Autowired  
    @Qualifier("taskExecutor")  
    private TaskExecutor          taskExecutor;  
  
    public void setTaskExecutor(TaskExecutor taskExecutor) {  
        this.taskExecutor = taskExecutor;  
    }  
  
    public void test() {  
  
       try {  
            taskExecutor.execute(new TaskThread());  
        } catch (RejectedExecutionException e) {  
           //do something  
        }  
    }  
  
    private class TaskThread implements Runnable {  
          
      @Override  
        public void run() {  
         //do something  
         }  
  
        }  
  
    }  
}  
```

  上述配置表明：线程池可以同时并发5个任务，队列中允许6个任务等待。超过11个任务的时候，会直接抛出RejectedExecutionException 异常。线程空闲时间超过2秒会关闭，直到达到线程数为2.

来源： <http://lbxc.iteye.com/blog/1675906>