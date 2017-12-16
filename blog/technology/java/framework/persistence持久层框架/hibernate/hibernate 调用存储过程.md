# hibernate 调用存储过程

分类: java
日期: 2014-09-11

原文地址: 

http://blog.chinaunix.net/uid-29632145-id-4465755.html

------

****[hibernate 调用存储过程]() *2014-09-11 13:41:27*

分类： Java



```
//原来的示例：
/*    log.info("Now trying to call the Stored Procedure*****************");
Query exQuery = session.createSQLQuery("CALL " +
        "insertHouseHello(:timestmp,:hname,:hno,:hvalue)");
exQuery.setParameter("timestmp", 
        new java.sql.Timestamp(Calendar.getInstance().getTime().getTime()));
exQuery.setParameter("hname", 34);
exQuery.setParameter("hno", 212);
exQuery.setParameter("hvalue", 12);
int exRows = exQuery.executeUpdate();
log.info("Executed Rows from Stored Procedure****************"+exRows);*/
//实践测试
Session session = HibernateUtil.getSessionFactory().openSession();
session.beginTransaction();
Query exQuery = session.createSQLQuery("CALL " + "insert_data(:tablename)");
exQuery.setParameter("tablename", "events201409");
int exRows = exQuery.executeUpdate();
System.out.println("exRows="+exRows);
session.getTransaction().commit();
session.close();
```

