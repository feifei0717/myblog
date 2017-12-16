

# ScheduledExecutorService定时周期执行指定的任务 jdk定时器



### 一：简单说明

ScheduleExecutorService接口中有四个重要的方法，其中scheduleAtFixedRate和scheduleWithFixedDelay在实现定时程序时比较方便。

下面是该接口的原型定义

[Java](http://lib.csdn.net/base/javase).util.concurrent.ScheduleExecutorService extends ExecutorService extends Executor

![img](image-201708151708/0.7808741239466903.png)

接口scheduleAtFixedRate原型定义及参数说明

```java
public ScheduledFuture<?> scheduleAtFixedRate(Runnable command,  
            long initialDelay,  
            long period,  
            TimeUnit unit);  
```

command：执行线程
initialDelay：初始化延时
period：两次开始执行最小间隔时间
unit：计时单位

接口scheduleWithFixedDelay原型定义及参数说明

```java
public ScheduledFuture<?> scheduleWithFixedDelay(Runnable command,  
                long initialDelay,  
                long delay,  
                TimeUnit unit);  
```

command：执行线程
initialDelay：初始化延时
period：前一次执行结束到下一次执行开始的间隔时间（间隔执行延迟时间）
unit：计时单位

### **二：功能示例**

#### 1.按指定频率周期执行某个任务。

初始化延迟0ms开始执行，每隔100ms重新执行一次任务。

```java
    /**
     * 1，以固定周期频率执行任务
     */
    @Test
    public void executeFixedRate() {
        ScheduledExecutorService executor = Executors.newScheduledThreadPool(1);
        executor.scheduleAtFixedRate(new EchoServer(), 0, 100, TimeUnit.MILLISECONDS);
    }
```

间隔指的是连续两次任务开始执行的间隔。

#### 2.按指定频率间隔执行某个任务。

初始化时延时0ms开始执行，本次执行结束后延迟100ms开始下次执行。

```java
    /**
     * 2，以固定延迟时间进行执行
     * 本次任务执行完成后，需要延迟设定的延迟时间，才会执行新的任务
     */
    @Test
    public void executeFixedDelay() {
        ScheduledExecutorService executor = Executors.newScheduledThreadPool(1);
        executor.scheduleWithFixedDelay(new EchoServer(), 0, 100, TimeUnit.MILLISECONDS);
    }
```

#### 3.周期定时执行某个任务。

有时候我们希望一个任务被安排在凌晨3点（访问较少时）周期性的执行一个比较耗费资源的任务，可以使用下面方法设定每天在固定时间执行一次任务。

```java
    /**
     * 3，每天晚上8点执行一次
     * 每天定时安排任务进行执行
     */
    public void executeEightAtNightPerDay() {
        ScheduledExecutorService executor = Executors.newScheduledThreadPool(1);
        long oneDay = 24 * 60 * 60 * 1000;
        long initDelay = getTimeMillis("20:00:00") - System.currentTimeMillis();
        initDelay = initDelay > 0 ? initDelay : oneDay + initDelay;
        executor.scheduleAtFixedRate(new EchoServer(), initDelay, oneDay, TimeUnit.MILLISECONDS);
    }
```

#### 4.辅助代码

```java
    /*------------------------------------------------------------------------------------
    		 辅助代码
    ------------------------------------------------------------------------------------*/
    /**
     * 获取指定时间对应的毫秒数
     * @param time "HH:mm:ss"
     * @return
     */
    private long getTimeMillis(String time) {
        try {
            DateFormat dateFormat = new SimpleDateFormat("yy-MM-dd HH:mm:ss");
            DateFormat dayFormat = new SimpleDateFormat("yy-MM-dd");
            Date curDate = dateFormat.parse(dayFormat.format(new Date()) + " " + time);
            return curDate.getTime();
        } catch (ParseException e) {
            e.printStackTrace();
        }
        return 0;
    }
    class EchoServer implements Runnable {
        @Override
        public void run() {
            try {
                Thread.sleep(50);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
            System.out.println(
                "This is a echo server. The current time is " + System.currentTimeMillis() + ".");
        }
    }
```

### 三：一些问题

上面写的内容有不严谨的地方，比如对于scheduleAtFixedRate方法，当我们要执行的任务大于我们指定的执行间隔时会怎么样呢？

对于中文API中的注释，我们可能会被忽悠，认为无论怎么样，它都会按照我们指定的间隔进行执行，其实当执行任务的时间大于我们指定的间隔时间时，它并不会在指定间隔时开辟一个新的线程并发执行这个任务。而是等待该线程执行完毕。

源码注释如下：

```
* Creates and executes a periodic action that becomes enabled first  
* after the given initial delay, and subsequently with the given  
* period; that is executions will commence after  
* <tt>initialDelay</tt> then <tt>initialDelay+period</tt>, then  
* <tt>initialDelay + 2 * period</tt>, and so on.  
* If any execution of the task  
* encounters an exception, subsequent executions are suppressed.  
* Otherwise, the task will only terminate via cancellation or  
* termination of the executor.  If any execution of this task  
* takes longer than its period, then subsequent executions  
* may start late, but will not concurrently execute.  
```

根据注释中的内容，我们需要注意的时，我们需要捕获最上层的异常，防止出现异常中止执行，导致周期性的任务不再执行。

### **四：除了我们自己实现定时任务之外，我们可以使用spring帮我们完成这样的事情。**

Spring自动定时任务配置方法（我们要执行任务的类名为com.study.MyTimedTask）

```
<bean id="myTimedTask" class="com.study.MyTimedTask"/>  
```

```
<bean id="doMyTimedTask" class="org.springframework.scheduling.quartz.MethodInvokingJobDetailFactoryBean">  
    <property name="targetObject" ref="myTimedTask"/>  
    <property name="targetMethod" value="execute"/>  
    <property name="concurrent" value="false"/>  
</bean>  
```

```
<bean id="myTimedTaskTrigger" class="org.springframework.scheduling.quartz.CronTriggerBean">  
    <property name="jobDetail" ref="doMyTimedTask"/>  
    <property name="cronExpression" value="0 0 2 * ?"/>  
</bean>  
```

```
<bean id="doScheduler" class="org.springframework.scheduling.quartz.SchedulerFactoryBean">  
    <property name="triggers">  
        <list>  
            <ref local="myTimedTaskTrigger"/>  
        </list>  
    </property>  
</bean>  
```

```xml
<bean id="doScheduler" class="org.springframework.scheduling.quartz.SchedulerFactoryBean">  
    <property name="triggers">  
        <list>  
            <bean class="org.springframework.scheduling.quartz.CronTriggerBean">  
                <property name="jobDetail"/>  
                    <bean id="doMyTimedTask" class="org.springframework.scheduling.quartz.MethodInvokingJobDetailFactoryBean">  
                        <property name="targetObject">  
                            <bean class="com.study.MyTimedTask"/>  
                        </property>  
                        <property name="targetMethod" value="execute"/>  
                        <property name="concurrent" value="false"/>  
                    </bean>  
                </property>  
                <property name="cronExpression" value="0 0 2 * ?"/>  
            </bean>  
        </list>  
    </property>  
</bean>  
```



### 五：完整代码

代码位置：Z:\backup\studio\AvailableCode\framework\timer定时器\jdk实现之ScheduledExecutorService\ScheduledExecutorServiceDemo

MainTest.java测试类：

```java
package com.practice;
import org.junit.Test;
import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;
/**
 * <B>Description:</B>  ScheduledExecutorService定时周期执行指定的任务  测试类 <br>
 * <B>Create on:</B> 2017/3/7 9:55 <br>
 *
 * @author xiangyu.ye
 * @version 1.0
 */
public class MainTest {
    /**
     * 1，以固定周期频率执行任务
     */
    @Test
    public void executeFixedRate() {
        ScheduledExecutorService executor = Executors.newScheduledThreadPool(1);
        executor.scheduleAtFixedRate(new EchoServer(), 0, 100, TimeUnit.MILLISECONDS);
    }
    /**
     * 2，以固定延迟时间进行执行
     * 本次任务执行完成后，需要延迟设定的延迟时间，才会执行新的任务
     */
    @Test
    public void executeFixedDelay() {
        ScheduledExecutorService executor = Executors.newScheduledThreadPool(1);
        executor.scheduleWithFixedDelay(new EchoServer(), 0, 100, TimeUnit.MILLISECONDS);
    }
    /**
     * 3，每天晚上8点执行一次
     * 每天定时安排任务进行执行
     */
    public void executeEightAtNightPerDay() {
        ScheduledExecutorService executor = Executors.newScheduledThreadPool(1);
        long oneDay = 24 * 60 * 60 * 1000;
        long initDelay = getTimeMillis("20:00:00") - System.currentTimeMillis();
        initDelay = initDelay > 0 ? initDelay : oneDay + initDelay;
        executor.scheduleAtFixedRate(new EchoServer(), initDelay, oneDay, TimeUnit.MILLISECONDS);
    }
    /*------------------------------------------------------------------------------------
    		 辅助代码
    ------------------------------------------------------------------------------------*/
    /**
     * 获取指定时间对应的毫秒数
     * @param time "HH:mm:ss"
     * @return
     */
    private long getTimeMillis(String time) {
        try {
            DateFormat dateFormat = new SimpleDateFormat("yy-MM-dd HH:mm:ss");
            DateFormat dayFormat = new SimpleDateFormat("yy-MM-dd");
            Date curDate = dateFormat.parse(dayFormat.format(new Date()) + " " + time);
            return curDate.getTime();
        } catch (ParseException e) {
            e.printStackTrace();
        }
        return 0;
    }
    class EchoServer implements Runnable {
        @Override
        public void run() {
            try {
                Thread.sleep(50);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
            System.out.println(
                "This is a echo server. The current time is " + System.currentTimeMillis() + ".");
        }
    }
}
```

来源： <http://blog.csdn.net/tsyj810883979/article/details/8481621>