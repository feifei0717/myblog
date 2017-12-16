hibernate执行sql查询，sql insert update语句

分类: java
日期: 2014-09-11

原文地址: 

http://blog.chinaunix.net/uid-29632145-id-4465226.html

------

****[hibernate执行sql查询，sql insert update语句]() *2014-09-11 10:00:23*

分类： Java

执行sql查询语句：

```
List list2 =this.getSession().createSQLQuery("select t.userID from " + tableName + " t where date>='"+ start + "' and date<='" + end + "' and t.paidItemNameID=2").list();
```

执行sql insert update语句：

```
Session session = HibernateUtil.getSessionFactory().openSession();
session.beginTransaction();
session.createSQLQuery("INSERT INTO `events201409` VALUES (null, '2014-09-11 09:38:03', 'hello sdfsffdffffffffffffdddd');").executeUpdate();
session.getTransaction().commit();
session.close();
```

