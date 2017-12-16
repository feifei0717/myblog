# hibenate.hbm2ddl.auto属性详解



hibenate.hbm2ddl.auto属性详解 
hibernate 配置属性中,hibernate.hbm2ddl.auto可以帮助你实现正向工程,即由java代码生成数据库脚本,进而生成具体的表结构. 
&在hibernate.cfg.xml中: 

```
< property name="hibernate.hbm2ddl.auto"> 
< /property> 
```


它包含4个属性: 
​    * create : 会根据你的model类来生成表,但是每次运行都会删除上一次的表,重新生成表,哪怕2次没有任何改变 
​    * create-drop : 根据model类生成表,但是sessionFactory一关闭,表就自动删除 
​    * update : 最常用的属性，也根据model类生成表,即使表结构改变了,表中的行仍然存在,不会删除以前的行 
​    * validate : 只会和数据库中的表进行比较,不会创建新表,但是会插入新值 
在hibernate中，如果在hibernate.cfg.xml文件中，将hibernate.hbm2ddl.auto设置为update（或者cretae-drop)也可以，如下 
update 
则在运行应用程序时（第一次），会自动建立起表的结构（前提是先建立好数据库）。要注意的是， 
当部署到服务器后，表结构是不会被马上建立起来的，是要等应用第一次运行起来后才会 
如果是spring配置文件中配置则为 

```
class="org.springframework.orm.hibernate3.LocalSessionFactoryBean"> 
< property name="dataSource"> 
< ref bean="dataSource" /> 
< /property> 
< property name="hibernateProperties"> 
< props> 
< prop key="hibernate.dialect"> 
org.hibernate.dialect.Oracle9Dialect 
< /prop> 

< prop key="hibernate.connection.autocommit">true 

< prop key="hibernate.show_sql">true 
< prop key="hibernate.hbm2ddl.auto">update 
< /props> 
< /property> 
```

