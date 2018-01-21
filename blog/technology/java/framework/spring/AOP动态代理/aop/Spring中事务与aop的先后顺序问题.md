# Spring中事务与aop的先后顺序问题

Spring中的事务是通过aop来实现的，当我们自己写aop拦截的时候，会遇到跟spring的事务aop执行的先后顺序问题，比如说动态切换数据源的问题，如果事务在前，数据源切换在后，会导致数据源切换失效，所以就用到了Order（排序）这个关键字.

​        我们可以通过在@AspectJ的方法中实现org.springframework.core.Ordered 这个接口来定义order的顺序，order 的值越大，说明越先被执行。比如代码如下：

```
/**
 * @author HuifengWang
 * aop面向切面编程
 *
 */@Component@Aspect
public class AspectJ4DataBase implements Ordered{
	
	//拦截所有的service操作@Pointcut("execution( * com.hc.shop.*.service.*.*(..))")
	public void readMethod() {
	}// 匹配所有的读取操作@Before("readMethod()")
	public void onlyReadPre(){
		DataSourceContextHolder.setDataSourceType(DataSourceType.MYSQL);
		System.out.println("数据库切换MYSQL");
	}
	@After("readMethod()")
	public void onlyReadPast(){
		DataSourceContextHolder.setDataSourceType(DataSourceType.ORACLE);
		System.out.println("数据库切换回ORACLE");
	}

	@Override
	public int getOrder() {
		// TODO Auto-generated method stub
		return 1;
	}
}
```

​    在事务配置的地方也配置order 字段，代码如下：​

```
<!-- 注解方式配置事物 -->
<tx:annotation-driven transaction-manager="transactionManager" order="2"/>
```

这样就实现了我们自己写的aop在事务介入之前就执行了！

来源： <https://my.oschina.net/HuifengWang/blog/304188>