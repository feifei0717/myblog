# Spring线程池与JDK线程池配置

  在web开发项目中，处理任务的线程池或多或少会用到。如果项目中使用到了spring，使用线程池时就可以直接使用spring自带的线程池了。下面是Spring线程池与JDK线程池的使用实例，做个参考吧。

```
package com.practice;
import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;
import java.util.concurrent.Callable;
import java.util.concurrent.CompletionService;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.ExecutorCompletionService;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;
import java.util.concurrent.FutureTask;
/**
 * Created by xiangyu.ye on 2016/6/7.
 */
public class Test {
    //直接在代码中使用
    public static void main(String[] args) throws InterruptedException, ExecutionException {
        /*------------------------------------------------------------------------------------
                 JDK线程池示例
        ------------------------------------------------------------------------------------*/
        /*ExecutorService threadPool = Executors.newFixedThreadPool(5);
        CompletionService<String> executor = new ExecutorCompletionService<String>(threadPool);
        Future<String> future = executor.submit(new TaskHandle());
        System.out.println(future.get());
        threadPool.shutdown();*/
        /*------------------------------------------------------------------------------------
                 Spring线程池示例
        ------------------------------------------------------------------------------------*/
        //==== 非容器管理方式
       /* FutureTask<String> ft = new FutureTask<String>(new TaskHandle());
        ThreadPoolTaskExecutor poolTaskExecutor = new ThreadPoolTaskExecutor();
        poolTaskExecutor.setQueueCapacity(10);
        poolTaskExecutor.setCorePoolSize(5);
        poolTaskExecutor.setMaxPoolSize(10);
        poolTaskExecutor.setKeepAliveSeconds(5);
        poolTaskExecutor.initialize();
        poolTaskExecutor.submit(ft);
        System.out.println(ft.get());
        poolTaskExecutor.shutdown();*/
        //==== 容器管理方式
        /*  把以下配置加到spring的配置文件中：
         <!-- 配置线程池 -->
         <bean id ="taskExecutor"  class ="org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor" >
         <!-- 线程池维护线程的最少数量 -->
         <property name ="corePoolSize" value ="5" />
         <!-- 线程池维护线程所允许的空闲时间 -->
         <property name ="keepAliveSeconds" value ="5" />
         <!-- 线程池维护线程的最大数量 -->
         <property name ="maxPoolSize" value ="10" />
         <!-- 线程池所使用的缓冲队列 -->
         <property name ="queueCapacity" value ="10" />
         </bean>*/
        //在程序中这样调用方法
        ApplicationContext ctx = new ClassPathXmlApplicationContext("applicationContext.xml");
        ThreadPoolTaskExecutor contextPoolTaskExecutor = ctx
                .getBean(ThreadPoolTaskExecutor.class);
        FutureTask<String> ft = new FutureTask<String>(new TaskHandle());
        contextPoolTaskExecutor.submit(ft);
        System.out.println(ft.get());
        contextPoolTaskExecutor.shutdown();
        //如果启用了spring的注入功能，则可以在被spring管理的bean方法上添加“@Async”即可。
    }
    /**
     * 处理任务的类,为了方便大家观看，我把这个类写到当前类中了。
     *
     * @author mengfeiyang
     */
    private static class TaskHandle implements Callable<String> {
        public String call() throws Exception {
            return Thread.currentThread().getName();
        }
    }
}
```

实际项目中见到的配置：

```
	<!-- 线程池 -->
	<bean id="threadPoolTaskExecutor"
		class="org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor">
		<property name="corePoolSize" value="2" />
		<property name="maxPoolSize" value="30" />
		<property name="queueCapacity" value="100" />
	</bean>
```