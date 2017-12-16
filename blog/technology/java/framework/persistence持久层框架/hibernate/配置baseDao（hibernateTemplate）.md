# 配置baseDao（hibernateTemplate）



当用 （struts2+hibernate+spring）开发的时候，想写个baseDao,同时继承该类的Dao类能使用hibernateTemplate，

## 1）在baseDao中注入hibernateTemplate属性。

手动注入hibernateTemplate属性。

baseDao.java代码如下：

```
import org.hibernate.SessionFactory;
import org.springframework.orm.hibernate3.support.HibernateDaoSupport;
import org.springframework.stereotype.Repository;

// class created by wwei 2011-11-28 下午10:12:01

@Repository("baseHibernateDao")
public abstract class BaseHibernateDaoImpl implements BaseHibernateDao{

    private HibernateTemplate hibernateTemplate;
    
    public HibernateTemplate getHibernateTemplate() {
        return hibernateTemplate;
    }
    @Resource(name = "hibernateTemplate")
    public void setHibernateTemplate(HibernateTemplate hibernateTemplate) {
        this.hibernateTemplate = hibernateTemplate;
    }

    @SuppressWarnings("unchecked")
    public List findUser(String hql) throws Exception{
        try{
            return (List)this.getHibernateTemplate().find(hql);
        }catch(Exception e){
            logger.info(e);
            throw new Exception();
        }
    }
}



```

## 2) 继承HibernateDaoSupport类。

同时，还需要注入sessionFactory或者hibernateTemplate。

此处自定义增加了setSessionFactoryOverride方法。增加了findUser方法，实现自BaseHibernateDao接口。

```
import java.io.Serializable;
import java.util.List;

import javax.annotation.Resource;

import org.hibernate.SessionFactory;
import org.springframework.orm.hibernate3.support.HibernateDaoSupport;
import org.springframework.stereotype.Repository;

// class created by wwei 2011-11-28 下午10:12:01

@Repository("baseHibernateDao")
public abstract class BaseHibernateDaoImpl extends HibernateDaoSupport implements BaseHibernateDao{

    @Resource(name = "sessionFactory")
    public void setSessionFactoryOverride(SessionFactory sessionFactory) {
        super.setSessionFactory(sessionFactory);
    }

    @SuppressWarnings("unchecked")
    public List findUser(String hql) throws Exception{
        try{
            return (List)this.getHibernateTemplate().find(hql);
        }catch(Exception e){
            logger.info(e);
            throw new Exception();
        }
    }
    
    
}
```

 spring.xml代码如下：显示代码：

```
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:aop="http://www.springframework.org/schema/aop"
    xmlns:tx="http://www.springframework.org/schema/tx" xmlns:context="http://www.springframework.org/schema/context"
    xsi:schemaLocation="
http://www.springframework.org/schema/beans 
http://www.springframework.org/schema/beans/spring-beans-2.5.xsd
http://www.springframework.org/schema/tx
http://www.springframework.org/schema/tx/spring-tx-2.5.xsd
http://www.springframework.org/schema/aop 
http://www.springframework.org/schema/aop/spring-aop-2.5.xsd
  http://www.springframework.org/schema/context   
   http://www.springframework.org/schema/context/spring-context-2.5.xsd
">
            class="org.springframework.beans.factory.config.PropertyPlaceholderConfigurer">
        
            classpath:jdbc.properties
     
            class="org.apache.commons.dbcp.BasicDataSource">
          class="org.springframework.orm.hibernate3.annotation.AnnotationSessionFactoryBean">
                com.wykd.bean
                    org.hibernate.dialect.MySQLDialect
                true
                true
```

