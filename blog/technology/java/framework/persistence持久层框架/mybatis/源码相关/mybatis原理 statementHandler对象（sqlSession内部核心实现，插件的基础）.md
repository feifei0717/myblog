[TOC]



# MyBatis原理第四篇——statementHandler对象（sqlSession内部核心实现，插件的基础）

## 前言

首先约定文中将的四大对象是指：**executor, statementHandler,parameterHandler，resultHandler对象。（为了方便下面的文章说道四大对象就专指它们）**

讲到statementHandler，毫无疑问它是我们四大对象最重要的一个，它的任务就是和数据库对话。在它这里会使用parameterHandler和ResultHandler对象为我们绑定SQL参数和组装最后的结果返回。

## **一、statementHandler对象的定义：**

首先我们先来看看statementHandler接口的定义：

```
public interface StatementHandler {  
  
  Statement prepare(Connection connection)  
      throws SQLException;  
  
  void parameterize(Statement statement)  
      throws SQLException;  
  
  void batch(Statement statement)  
      throws SQLException;  
  
  int update(Statement statement)  
      throws SQLException;  
  
  <E> List<E> query(Statement statement, ResultHandler resultHandler)  
      throws SQLException;  
  
  BoundSql getBoundSql();  
  
  ParameterHandler getParameterHandler();  
  
}  
```

这里有几个重要的方法，prepare,parameterize和query，update，他们的作用是不一样的。

在MyBatis实现了statementHandler的有四个类：

RoutingStatementHandler，这是一个封装类，它不提供具体的实现，只是根据Executor的类型，创建不同的类型StatementHandler。

SimpleStatementHandler，这个类对应于JDBC的Statement对象，用于没有预编译参数的SQL的运行。

PreparedStatementHandler 这个用于预编译参数SQL的运行。

CallableStatementHandler 它将实存储过程的调度。



在MyBatis中，Configuration对象会采用new RoutingStatementHandler()来生成StatementHandler对象，换句话说我们真正使用的是RoutingStatementHandler对象，然后它会根据Executor的类型去创建对应具体的statementHandler对象（SimpleStatementHandler，PreparedStatementHandler和CallableStatementHandler）。

**然后利用具体statementHandler的方法完成所需要的功能。那么这个具体的statementHandler是保存在RoutingStatementHandler对象的delegate属性的，所以当我们拦截statementHandler的时候就要常常访问它了。它们的关系如下图所示。**

![img](http://img.my.csdn.net/uploads/201705/27/1495821095_1883.jpg)

## **二、prepare方法**

首先prepare方法是用来编译SQL的，让我们看看它的源码实现。这里我们看到了BaseStatementHandler对prepare方法的实现，

```java
@Override  
 public Statement prepare(Connection connection) throws SQLException {  
   ErrorContext.instance().sql(boundSql.getSql());  
   Statement statement = null;  
   try {  
     statement = instantiateStatement(connection);  
     setStatementTimeout(statement);  
     setFetchSize(statement);  
     return statement;  
   } catch (SQLException e) {  
     closeStatement(statement);  
     throw e;  
   } catch (Exception e) {  
     closeStatement(statement);  
     throw new ExecutorException("Error preparing statement.  Cause: " + e, e);  
   }  
 }  
  
 protected abstract Statement instantiateStatement(Connection connection) throws SQLException;  
```

显然我们通过源码更加关注抽象方法instantiateStatement是做了什么事情。它依旧是一个抽象方法，那么它就有其实现类。那就是之前说的那几个具体的StatementHandler对象，让我们看看PreparedStatementHandler:

```java
@Override  
  protected Statement instantiateStatement(Connection connection) throws SQLException {  
    String sql = boundSql.getSql();  
    if (mappedStatement.getKeyGenerator() instanceof Jdbc3KeyGenerator) {  
      String[] keyColumnNames = mappedStatement.getKeyColumns();  
      if (keyColumnNames == null) {  
        return connection.prepareStatement(sql, PreparedStatement.RETURN_GENERATED_KEYS);  
      } else {  
        return connection.prepareStatement(sql, keyColumnNames);  
      }  
    } else if (mappedStatement.getResultSetType() != null) {  
      return connection.prepareStatement(sql, mappedStatement.getResultSetType().getValue(), ResultSet.CONCUR_READ_ONLY);  
    } else {  
      return connection.prepareStatement(sql);  
    }  
  }  
```

好这个方法非常简单，我们可以看到它主要是根据上下文来预编译SQL，这是我们还没有设置参数。设置参数的任务是交由，statement接口的parameterize方法来实现的。

**3、parameterize方法：**

上面我们在prepare方法里面预编译了SQL。那么我们这个时候希望设置参数。在Statement中我们是使用parameterize方法进行设置参数的。

让我们看看PreparedStatementHandler中的parameterize方法：

```
@Override  
  public void parameterize(Statement statement) throws SQLException {  
    parameterHandler.setParameters((PreparedStatement) statement);  
  }  
```

很显然这里很简单是通过parameterHandler来实现的，我们这篇文章只是停留在statementhandler的程度，等我们讲解parameterHandler的时候再来看它如何实现吧，期待一下吧。

**4、query/update方法**

我们用了prepare方法预编译了SQL，用了parameterize方法设置参数，那么我们接下来肯定是想执行SQL，而SQL无非是两种：

一种是进行查询——query，另外就是更新——update。

这些方法都很简单，让我们看看PreparedStatementHandler的实现：

```
@Override  
  public int update(Statement statement) throws SQLException {  
    PreparedStatement ps = (PreparedStatement) statement;  
    ps.execute();  
    int rows = ps.getUpdateCount();  
    Object parameterObject = boundSql.getParameterObject();  
    KeyGenerator keyGenerator = mappedStatement.getKeyGenerator();  
    keyGenerator.processAfter(executor, mappedStatement, ps, parameterObject);  
    return rows;  
  }  
  
......  
@Override  
  public <E> List<E> query(Statement statement, ResultHandler resultHandler) throws SQLException {  
    PreparedStatement ps = (PreparedStatement) statement;  
    ps.execute();  
    return resultSetHandler.<E> handleResultSets(ps);  
  }  
```

我们可以看到如果是进行update的，它将会执行生成主键的操作（插入数据要自动生成主键的时候），然后就返回影响行数。

如果是进行query的就更加简单了，它就是执行SQL语句，然后讲结果使用resultHandler的handleResultSets去完成我们的结果组装。至于resultHandler的内部实现还是很复杂的，值得期待哦。这里我们暂且不讲等待下一章吧。

**5、总结**

StatementHandler是MyBatis四大对象里面最重要的对象，它的方法是十分重要的，也是我们插件的基础。



**当我们需要改变sql的时候，显然我们要在预编译SQL(prepare方法前加入修改的逻辑)。**

**当我们需要修改参数的时候我们可以在调用parameterize方法前修改逻辑。或者使用ParameterHandler来改造设置参数。**

**我们需要控制组装结果集的时候，也可以在query方法前后加入逻辑，或者使用ResultHandler来改造组装结果。**

**懂的这些方法，才能理解我需要拦截什么对象，如何处理插件，这是MyBatis的核心内容。**





http://blog.csdn.net/ykzhen2015/article/details/50601304