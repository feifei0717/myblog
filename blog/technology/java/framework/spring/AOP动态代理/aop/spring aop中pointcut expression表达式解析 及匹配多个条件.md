## Spring AOP中pointcut expression表达式解析 及匹配多个条件

Spring中事务控制相关配置：

```Xml
　　<bean id="txManager" class="org.springframework.jdbc.datasource.DataSourceTransactionManager">
　　　　<property name="dataSource" ref="dataSource"/>
　　</bean> 

　　<tx:advice id="txAdvice" transaction-manager="txManager">
　　　　<tx:attributes>
　　　　　　<tx:method name="insert*" rollback-for="Exception"/>
　　　　　　<tx:method name="update*" rollback-for="Exception"/>
　　　　　　<tx:method name="delete*" rollback-for="Exception"/>
　　　　</tx:attributes>
　　</tx:advice>

　　<aop:config>
　　　　<aop:pointcut id="dbServiceOperation" expression="execution(* com.htt..*Service.*(..))"/>
　　　　<aop:advisor advice-ref="txAdvice" pointcut-ref="dbServiceOperation"/>
　　</aop:config>
```

　　其中的“aop:pointcut”标签中"expression"的写法规则如下：

​     execution(modifiers-pattern? ret-type-pattern declaring-type-pattern? name-pattern(param-pattern)  throws-pattern?)
　　　　ret-type-pattern,name-pattern(param-pattern)是必须的.
　　　　ret-type-pattern:标识方法的返回值，需要使用全路径的类名如java.lang.String,也可以为*表示任何返回值；
　　　　name-pattern:指定方法名,*代表所有,例如set*,代表以set开头的所有方法.
　　　　param-pattern:指定方法参数(声明的类型),(..)代表所有参数,(*)代表一个参数,(*,String)代表第一个参数为任何值,第二个为String类型.

​    表达式例子如下：

　　任意公共方法的执行：
　　　　execution(public * *(..))
　　任何一个以“set”开始的方法的执行：
　　　　execution(* set*(..))
　　AccountService 接口的任意方法的执行：
　　　　execution(* com.xyz.service.AccountService.*(..))
　　定义在service包里的任意方法的执行：
　　　　execution(* com.xyz.service.*.*(..))
　　定义在service包和所有子包里的任意类的任意方法的执行：
　　　　execution(* com.xyz.service..*.*(..))
　　定义在pointcutexp包和所有子包里的JoinPointObjP2类的任意方法的执行：
　　　　execution(* com.test.spring.aop.pointcutexp..JoinPointObjP2.*(..))")

　　在多个表达式之间使用 ||,or表示 或，使用 &&,and表示 与，！表示 非.例如：

```Xml
     <aop:config>
  　　　　<aop:pointcut id="pointcut" expression="(execution(* com.ccboy.dao..*.find*(..))) or (execution(* com.ccboy.dao..*.query*(..)))"/>
  　　　　<aop:advisor advice-ref="jdbcInterceptor" pointcut-ref="pointcut" />
　　</aop:config>
```





http://www.cnblogs.com/qinyubin/p/4075466.html