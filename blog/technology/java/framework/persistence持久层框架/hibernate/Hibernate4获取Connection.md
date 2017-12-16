# Hibernate4获取Connection，ResultSet对象

分类: java
日期: 2014-09-11

原文地址: 

http://blog.chinaunix.net/uid-29632145-id-4465426.html

------

****[Hibernate4获取Connection，ResultSet对象]() *2014-09-11 10:55:19*

分类： Java

 

在jdbc里面，可以有个ResultMetaData对象获取列名字。因为我用的是hibernate，这个框架已经封装了很多，一般是难以获得resultset的。

 

经过不懈的bing和google（作为一个环保的准程序员，拒绝用百度了），发现在hibernate里面，可以获得resultset对象。不过现在是hibernate4，比较新，获取的方式改变了不少。

 

在之前的hibernate里面，可以用下面的代码获取connection，还有其他对象。

 

复制代码

 　　　　java.sql.Connection c = null;

​        java.sql.PreparedStatement ps = null;

​        java.sql.ResultSet rs = null;

 

public List   method(String sql) {

​        List ret = new ArrayList();

​        try {

​        c =SessionFactoryUtils.getDataSource(getSessionFactory()).getConnection();

​            ps = c.prepareStatement(sql);

​            rs = ps.executeQuery();

​            while(rs.next()) {

​                 .....

​                }

​                ret.add(ro);

​            }

​        } catch (Exception e) {

​             e.printStackTrace();

 

​       } finally {

​           close();

​        }

​        return ret;

​    }

复制代码

这样，可以像jdbc一样，使用resultset等对象。

 

但是在hibernate4里面，方法已经改了，SessionFactoryUtils.getDataSource(getSessionFactory()).getConnection() 这一句已经不能使用，换的是新的方法。

 

如下：

 

 

 

getSession().doWork(new Work() {

​    @Override

​    public void execute(Connection connection) {

​                

​    }

});

 

 

在方法体里面，可以直接使用connection了。

 

但是这样，返回的是一个void，而我要取用的是获得resultset对象。好在IDE有智能提示，发现里面有一个能传递返回值得的方法，算是上面一种方法的扩展吧。

 

直接上我项目中的代码：

 

复制代码

 @Test

​    public void tests() throws SQLException {

​        Session session=HibernateSessionFactory.getSession();

​        ResultSet resultSet=session.doReturningWork(

​                new ReturningWork() {

​                    @Override

​                    public ResultSet execute(Connection connection) throws SQLException {

​                        String sql="select * from t_auth";

​                        PreparedStatement preparedStatement=connection.prepareStatement(sql);

​                        ResultSet resultSet=preparedStatement.executeQuery();

​                        return resultSet;

​                    }

​                }

​        );

​        while (resultSet.next()){

​            System.out.println("rs:"+resultSet.getString("authid"));

​        }

​    }

复制代码

就是这个doReturnWork方法，里面通过内部类，把resultset对象一层一层返回给这个doReturnWork，这样就可以像用jdbc一样使用hibernate了。

 

个人一点心得，希望能给大家一些帮助。