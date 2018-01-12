# Spring 3整合Quartz 2实现定时任务一：常规整合

最近工作中需要用到定时任务的功能，虽然Spring3也自带了一个轻量级的定时任务实现，但感觉不够灵活，功能也不够强大。在考虑之后，决定整合更为专业的Quartz来实现定时任务功能。

首先，当然是添加依赖的jar文件，我的项目是maven管理的，以下的我项目的依赖：

```
<dependencies>
    <dependency>
        <groupId>org.springframework</groupId>
        <artifactId>spring-core</artifactId>
        <version>${spring.version}</version>
    </dependency>
    <dependency>
        <groupId>org.springframework</groupId>
        <artifactId>spring-context</artifactId>
        <version>${spring.version}</version>
    </dependency>
    <dependency>
        <groupId>org.springframework</groupId>
        <artifactId>spring-web</artifactId>
        <version>${spring.version}</version>
    </dependency>
    <dependency>
        <groupId>org.springframework</groupId>
        <artifactId>spring-tx</artifactId>
        <version>${spring.version}</version>
    </dependency>
    <dependency>
        <groupId>org.springframework</groupId>
        <artifactId>spring-jdbc</artifactId>
        <version>${spring.version}</version>
    </dependency>
    <dependency>
        <groupId>org.mybatis</groupId>
        <artifactId>mybatis</artifactId>
        <version>${mybatis.version}</version>
    </dependency>
    <dependency>
        <groupId>org.aspectj</groupId>
        <artifactId>aspectjweaver</artifactId>
        <version>1.7.4</version>
    </dependency>
    <dependency>
        <groupId>org.mybatis</groupId>
        <artifactId>mybatis-spring</artifactId>
        <version>${mybatis.spring.version}</version>
    </dependency>
    <dependency>
        <groupId>org.slf4j</groupId>
        <artifactId>slf4j-log4j12</artifactId>
        <version>${slf4j.version}</version>
    </dependency>
    <dependency>
        <groupId>commons-lang</groupId>
        <artifactId>commons-lang</artifactId>
        <version>${commons.lang.version}</version>
    </dependency>
    <dependency>
        <groupId>commons-dbcp</groupId>
        <artifactId>commons-dbcp</artifactId>
        <version>${commons.dbcp.version}</version>
    </dependency>
    <dependency>
        <groupId>com.oracle</groupId>
        <artifactId>ojdbc14</artifactId>
        <version>${ojdbc.version}</version>
    </dependency>
    <dependency>
        <groupId>org.springframework</groupId>
        <artifactId>spring-context-support</artifactId>
        <version>${spring.version}</version>
    </dependency>
    <dependency>
        <groupId>org.quartz-scheduler</groupId>
        <artifactId>quartz</artifactId>
        <version>${quartz.version}</version>
    </dependency>
</dependencies>
```

或许你应该看出来了，我的项目是spring整合了mybatis，目前spring的最新版本已经到了4.x系列，但是最新版的mybatis-spring的整合插件所依赖推荐的依然是spring 3.1.3.RELEASE，所以这里没有用spring的最新版而是用了推荐的3.1.3.RELEASE，毕竟最新版本的功能一般情况下也用不到。

至于quartz，则是用了目前的最新版2.2.1

之所以在这里特别对版本作一下说明，是因为spring和quartz的整合对版本是有要求的。

spring3.1以下的版本必须使用quartz1.x系列，3.1以上的版本才支持quartz 2.x，不然会出错。

> 至于原因，则是spring对于quartz的支持实现，org.springframework.scheduling.quartz.CronTriggerBean继承了org.quartz.CronTrigger，在quartz1.x系列中org.quartz.CronTrigger是个类，而在quartz2.x系列中org.quartz.CronTrigger变成了接口，从而造成无法用spring的方式配置quartz的触发器（trigger）。

在Spring中使用Quartz有两种方式实现：第一种是任务类继承QuartzJobBean，第二种则是在配置文件里定义任务类和要执行的方法，类和方法可以是普通类。很显然，第二种方式远比第一种方式来的灵活。

这里采用的就是第二种方式。

spring配置文件：

```
<!-- 使用MethodInvokingJobDetailFactoryBean，任务类可以不实现Job接口，通过targetMethod指定调用方法-->
<bean id="taskJob" class="com.tyyd.dw.task.DataConversionTask"/>
<bean id="jobDetail" class="org.springframework.scheduling.quartz.MethodInvokingJobDetailFactoryBean">
    <property name="group" value="job_work"/>
    <property name="name" value="job_work_name"/>
    <!--false表示等上一个任务执行完后再开启新的任务-->
    <property name="concurrent" value="false"/>
    <property name="targetObject">
        <ref bean="taskJob"/>
    </property>
    <property name="targetMethod">
        <value>run</value>
    </property>
</bean>
<!--  调度触发器 -->
<bean id="myTrigger"
      class="org.springframework.scheduling.quartz.CronTriggerFactoryBean">
    <property name="name" value="work_default_name"/>
    <property name="group" value="work_default"/>
    <property name="jobDetail">
        <ref bean="jobDetail" />
    </property>
    <property name="cronExpression">
        <value>0/5 * * * * ?</value>
    </property>
</bean>
<!-- 调度工厂 -->
<bean id="scheduler" class="org.springframework.scheduling.quartz.SchedulerFactoryBean">
    <property name="triggers">
        <list>
            <ref bean="myTrigger"/>
        </list>
    </property>
</bean>
```

Task类则是一个普通的Java类，没有继承任何类和实现任何接口(当然可以用注解方式来声明bean)：

```
//@Component
public class DataConversionTask{
    /** 日志对象 */
    private static final Logger LOG = LoggerFactory.getLogger(DataConversionTask.class);
    public void run() {
        if (LOG.isInfoEnabled()) {
            LOG.info("数据转换任务线程开始执行");
        }
    }
}
```

至此，简单的整合大功告成，run方法将每隔5秒执行一次，因为配置了concurrent等于false，所以假如run方法的执行时间超过5秒，在执行完之前即使时间已经超过了5秒下一个定时计划执行任务仍不会被开启，如果是true，则不管是否执行完，时间到了都将开启。

 

接下去，将实现如何动态的修改定时执行的时间，以及如何停止正在执行的任务，待续，，，

```
时间大小由小到大排列，从秒开始，顺序为 秒，分，时，天，月，周几,年(可选)    *为任意 ？为无限制。 
具体如下：                       
具体时间设定可参考 

"0/10 * * * * ?" 每10秒触发 
"0 0 12 * * ?" 每天中午12点触发 
"0 15 10 ? * *" 每天上午10:15触发 
"0 15 10 * * ?" 每天上午10:15触发 
"0 15 10 * * ? *" 每天上午10:15触发 
"0 15 10 * * ? 2005" 2005年的每天上午10:15触发 
"0 * 14 * * ?" 在每天下午2点到下午2:59期间的每1分钟触发 
"0 0/5 14 * * ?" 在每天下午2点到下午2:55期间的每5分钟触发 
"0 0/5 14,18 * * ?" 在每天下午2点到2:55期间和下午6点到6:55期间的每5分钟触发 
"0 0-5 14 * * ?" 在每天下午2点到下午2:05期间的每1分钟触发 
"0 10,44 14 ? 3 WED" 每年三月的星期三的下午2:10和2:44触发
"0 0 14 ? * 5,6,7" 周五至周日的下午14:00触发
"0 15 10 ? * MON-FRI" 周一至周五的上午10:15触发 
"0 15 10 15 * ?" 每月15日上午10:15触发      
"0 15 10 L * ?" 每月最后一日的上午10:15触发 
"0 15 10 ? * 6L" 每月的最后一个星期五上午10:15触发 
"0 15 10 ? * 6L 2002-2005" 2002年至2005年的每月的最后一个星期五上午10:15触发 
"0 15 10 ? * 6#3" 每月的第三个星期五上午10:15触发 
每隔5秒执行一次：*/5 * * * * ? 
每隔1分钟执行一次：0 */1 * * * ? 
每天23点执行一次：0 0 23 * * ? 
每天凌晨1点执行一次：0 0 1 * * ? 
每月1号凌晨1点执行一次：0 0 1 1 * ? 
每月最后一天23点执行一次：0 0 23 L * ? 
每周星期天凌晨1点实行一次：0 0 1 ? * L 
在26分、29分、33分执行一次：0 26,29,33 * * * ? 
每天的0点、13点、18点、21点都执行一次：0 0 0,13,18,21 * * ? 


 
"0 0 3 * * MON"  设置每周的星期一凌晨3点启动


各个时间可用值如下：

秒 0-59 , - * /

分 0-59 , - * /

小时 0-23 , - * /

日 1-31 , - * ? / L W C

月 1-12 or JAN-DEC , - * /

周几 1-7 or SUN-SAT , - * ? / L C #

年 (可选字段) empty, 1970-2099 , - * /

可用值详细分析如下：

“*”——字符可以用于所有字段，在“分”字段中设为"*"表示"每一分钟"的含义。

“?”——字符可以用在“日”和“周几”字段. 它用来指定 '不明确的值'. 这在你需要指定这两个字段中的某一个值而不是另外一个的时候会被用到。在后面的例子中可以看到其含义。

“-”——字符被用来指定一个值的范围，比如在“小时”字段中设为"10-12"表示"10点到12点"。

“,”——字符指定数个值。比如在“周几”字段中设为"MON,WED,FRI"表示"the days Monday, Wednesday, and Friday"。

“/”——字符用来指定一个值的的增加幅度. 比如在“秒”字段中设置为"0/15"表示"第0, 15, 30, 和 45秒"。而 "5/15"则表示"第5, 20, 35, 和 50". 在'/'前加"*"字符相当于指定从0秒开始. 每个字段都有一系列可以开始或结束的数值。对于“秒”和“分”字段来说，其数值范围为0到59，对于“小时”字段来说其为0到23, 对于“日”字段来说为0到31, 而对于“月”字段来说为1到12。"/"字段仅仅只是帮助你在允许的数值范围内从开始"第n"的值。

“L”——字符可用在“日”和“周几”这两个字段。它是"last"的缩写, 但是在这两个字段中有不同的含义。例如,“日”字段中的"L"表示"一个月中的最后一天" —— 对于一月就是31号对于二月来说就是28号（非闰年）。而在“周几”字段中, 它简单的表示"7" or "SAT"，但是如果在“周几”字段中使用时跟在某个数字之后, 它表示"该月最后一个星期×" —— 比如"6L"表示"该月最后一个周五"。当使用'L'选项时,指定确定的列表或者范围非常重要，否则你会被结果搞糊涂的。

“W”——可用于“日”字段。用来指定历给定日期最近的工作日(周一到周五) 。比如你将“日”字段设为"15W"，意为: "离该月15号最近的工作日"。因此如果15号为周六，触发器会在14号即周五调用。如果15号为周日, 触发器会在16号也就是周一触发。如果15号为周二,那么当天就会触发。然而如果你将“日”字段设为"1W", 而一号又是周六, 触发器会于下周一也就是当月的3号触发,因为它不会越过当月的值的范围边界。'W'字符只能用于“日”字段的值为单独的一天而不是一系列值的时候。

“L”和“W”可以组合用于“日”字段表示为'LW'，意为"该月最后一个工作日"。

“#”—— 字符可用于“周几”字段。该字符表示“该月第几个周×”，比如"6#3"表示该月第三个周五( 6表示周五而"#3"该月第三个)。再比如: "2#1" = 表示该月第一个周一而 "4#5" = 该月第五个周三。注意如果你指定"#5"该月没有第五个“周×”，该月是不会触发的。

“C”—— 字符可用于“日”和“周几”字段，它是"calendar"的缩写。 它表示为基于相关的日历所计算出的值（如果有的话）。如果没有关联的日历, 那它等同于包含全部日历。“日”字段值为"5C"表示"日历中的第一天或者5号以后"，“周几”字段值为"1C"则表示"日历中的第一天或者周日以后"。

对于“月份”字段和“周几”字段来说合法的字符都不是大小写敏感的。

附表：
"0 0 12 * * ?" 每天中午12点触发
"0 15 10 ? * *" 每天上午10:15触发
"0 15 10 * * ?" 每天上午10:15触发
"0 15 10 * * ? *" 每天上午10:15触发
"0 15 10 * * ? 2005" 2005年的每天上午10:15触发
"0 * 14 * * ?" 在每天下午2点到下午2:59期间的每1分钟触发
"0 0/5 14 * * ?" 在每天下午2点到下午2:55期间的每5分钟触发
"0 0/5 14,18 * * ?" 在每天下午2点到2:55期间和下午6点到6:55期间的每5分钟触发
"0 0-5 14 * * ?" 在每天下午2点到下午2:05期间的每1分钟触发
"0 10,44 14 ? 3 WED" 每年三月的星期三的下午2:10和2:44触发
"0 15 10 ? * MON-FRI" 周一至周五的上午10:15触发
"0 15 10 15 * ?" 每月15日上午10:15触发
"0 15 10 L * ?" 每月最后一日的上午10:15触发
"0 15 10 ? * 6L" 每月的最后一个星期五上午10:15触发
"0 15 10 ? * 6L 2002-2005" 2002年至2005年的每月的最后一个星期五上午10:15触发
"0 15 10 ? * 6#3" 每月的第三个星期五上午10:15触发
至于每个符号 看看例子就好了.很简单了.
 

```



**Zachary **· 1年前

根据博主的代码写了个demo。 GitHub: https://github.com/zZcoming/QuartzSpring/tree/master



https://www.ktanx.com/blog/p/297