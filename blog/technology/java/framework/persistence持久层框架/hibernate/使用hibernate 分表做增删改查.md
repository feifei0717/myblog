# 使用hibernate 分表做增删改查

分类: java
日期: 2015-03-18

 

http://blog.chinaunix.net/uid-29632145-id-4901918.html

------

****[使用hibernate 分表做增删改查]() *2015-03-18 15:41:29*

分类： Java

公司项目有一张表的数据量特别大、而且时间越长累积的数据量就越大、（update不可以用这个方法）

后来DBA决定分表来解决性能问题、

分表是指   一个母体表  一群子表（结构和字段与母体表完全一样） 我们程序对母表操作其实就是对子表操作、让其无法感知有分表这个动作、

而使用hibernate如何分表呢？

难道我要写N个子表类Domain吗？那累屎我算了、

呵呵、我们这里需要hibernate一个拦截器类  org.hibernate.EmptyInterceptor

这个拦截器做了什么呢？

hibernate最终会将我们写的HQL语句转换成SQL语句、而当转换SQL且没放如数据库执行的时候、被拦截器就拦住啦、我们就可以偷偷的"使坏"啦、

我们需要一个自己的类来继承org.hibernate.EmptyInterceptor

```
package cn.test;  
  
import org.hibernate.EmptyInterceptor;  
  
public class MyInterceptor extends EmptyInterceptor {  
  
    private String targetTableName;// 目标母表名  
    private String tempTableName;// 操作子表名  
  
    public MyInterceptor() {}//为其在spring好好利用 我们生成公用无参构造方法  
  
    public java.lang.String onPrepareStatement(java.lang.String sql) {  
        sql = sql.replaceAll(targetTableName, tempTableName);  
        return sql;  
  
    }  
  
    public String getTargetTableName() {  
        return targetTableName;  
    }  
  
    public void setTargetTableName(String targetTableName) {  
        this.targetTableName = targetTableName;  
    }  
  
    public String getTempTableName() {  
        return tempTableName;  
    }  
  
    public void setTempTableName(String tempTableName) {  
        this.tempTableName = tempTableName;  
    }  
  
}  
```

hibernate的session会获取吧？本文就不多做介绍了、

比如我们有个Test 实体类  对应的数据库的母表名称 为 test   而我们要保存到子表的 test_01要怎么做呢？

```
public void saveTest(Test test){  
  
    SessionFactory sf = super.getHibernateTemplate().getSessionFactory();//获取session工厂  
      
    MyInterceptor interceptor = new MyInterceptor();//我们的拦截器  
      
    interceptor.setTargetTableName("test");//要拦截的目标表名  
      
    interceptor.setTempTableName("test_01");  //要替换的子表名  
      
    Session session = sf.openSession(interceptor);//当前的session使用这个拦截器  

    //Session session = sf.withOptions().interceptor(interceptor).openSession();hibernate 4用法
         
       try{  
          
        Transaction tx =  session.beginTransaction();//获取事务  
        tx.begin();//开启事务  
        session.saveOrUpdate(test);//保存和更新  
        tx.commit();//提交  
          
       }catch(Exception e){  
        e.printStackTrace();  
       }finally{  
        session.close();  
       }  
      
   }  

```

这样就能把信息存到子表test_01里啦、而且根本没人察觉我们的"使坏"、hibernate还老老实实的本份的做自己的工作呢、

CURD动作就这样被我们"使坏"着、

那我们总是new 出来 我们的拦截器 多么费劲啊、如果我还需要其他的地方还需要分表的地方、难道我还要再次new出来给多个地方用？

这样我们就在spring里多加一个bean 指向我们的class类



然后拦截器从spring拿就可以了、在setter进去目标表名和替换表名、

 我们项目是web.xml加载了一个实现ApplicationContextAware类的一个类 

static 的 ApplicationContext applicationContext  从里面getBean 就能拿到了

这样就ok啦、