获取NamedParameterJdbcTemplate的三种方式：

```
    public static NamedParameterJdbcTemplate getJdbcTemplate() {
        ClassPathXmlApplicationContext applicationContext = new ClassPathXmlApplicationContext(
            "beans.xml");
        /*------------------------------------------------------------------------------
                 三种方式获取：
        ------------------------------------------------------------------------------*/
        //1，可以直接把jdbctemplate封装
        //        NamedParameterJdbcTemplate namedParameterJdbcTemplate =  new NamedParameterJdbcTemplate(jdbcTemplate);
        //2，需要在beans.xml配置文件中配置
        NamedParameterJdbcTemplate namedParameterJdbcTemplate = applicationContext
            .getBean(NamedParameterJdbcTemplate.class);
        //3，不需要在beans.xml配置文件中配置
        //		NamedParameterJdbcTemplate namedParameterJdbcTemplate = new NamedParameterJdbcTemplate(applicationContext.getBean(com.alibaba.druid.pool.DruidDataSource.class));
        return namedParameterJdbcTemplate;
    }
```

spring中配置JdbcTemplate和NamedParameterJdbcTemplate

```
	<bean id="jdbcTemplate" class="org.springframework.jdbc.core.JdbcTemplate">
		<property name="dataSource">
			<ref bean="dataSource" />
		</property>
	</bean>
	<bean id="namedParameterJdbcTemplate" class="org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate">
		<constructor-arg type="javax.sql.DataSource" ref="dataSource"/>
	</bean>
```