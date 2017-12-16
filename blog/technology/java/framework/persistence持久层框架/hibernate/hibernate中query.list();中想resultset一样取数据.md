hibernate中query.list();中想resultset一样取数据


```
			Session session = HibernateUtil.getSessionFactory().openSession();
			session.beginTransaction();
			 SQLQuery query = session.createSQLQuery("CALL " + "u_select()");
			 List list =  query.list();
			 Iterator it = list.iterator();
			 while(it.hasNext()){
				 Object value = it.next();
				 String col1 = Array.get(value, 0).toString();//取第一个  第二个也一样
				 System.out.println("col1="+col1);
			 }
			session.getTransaction().commit();
			session.close();
```