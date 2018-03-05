本文基于Mybatis3.2.0版本的代码。

## 1.org.apache.ibatis.mapping.MappedStatement

MappedStatement类在Mybatis框架中用于表示XML文件中一个sql语句节点，即一个<select />、<update />或者<insert />标签。Mybatis框架在初始化阶段会对XML配置文件进行读取，将其中的sql语句节点对象化为一个个MappedStatement对象。比如下面这个非常简单的XML mapper文件：

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE mapper
  PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN"
  "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
<mapper namespace="mybatis.UserDao">
 
    <cache type="org.mybatis.caches.ehcache.LoggingEhcache" />
 
    <resultMap id="userResultMap" type="UserBean">
        <id property="userId" column="user_id" />
        <result property="userName" column="user_name" />
        <result property="userPassword" column="user_password" />
        <result property="createDate" column="create_date" />
    </resultMap>
 
    <select id="find" parameterType="UserBean" resultMap="userResultMap">
        select * from user
        <where>
            <if test="userName!=null and userName!=''">
                and user_name = #{userName}
            </if>
            <if test="userPassword!=null and userPassword!=''">
                and user_password = #{userPassword}
            </if>
            <if test="createDate !=null">
                and create_date = #{createDate}
            </if>
        </where>
    </select>
 
    <!-- 说明mybatis中的sql语句节点和映射的接口中的方法，并不是一一对应的关系，而是独立的，可以取任意不重复的名称 -->
    <select id="find2" parameterType="UserBean" resultMap="userResultMap">
        select * from user
        <where>
            <if test="userName!=null and userName!=''">
                and user_name = #{userName}
            </if>
            <if test="userPassword!=null and userPassword!=''">
                and user_password = #{userPassword}
            </if>
            <if test="createDate !=null">
                and create_date = #{createDate}
            </if>
        </where>
    </select>
 
</mapper>
```

Mybatis对这个文件的配置读取和解析后，会注册两个MappedStatement对象，分别对应其中id为find和find2的<select />节点，通过org.apache.ibatis.session.Configuration类中的getMappedStatement(String id)方法，可以检索到一个特定的MappedStatement。为了区分不同的Mapper文件中的sql节点，其中的String id方法参数，是以Mapper文件的namespace作为前缀，再加上该节点本身的id值。比如上面生成的两个MappedStatement对象在Mybatis框架中的唯一标识分别是mybatis.UserDao.find和mybatis.UserDao.find2。

打开MappedStatement对象的源码，看一下其中的私有属性。

```java
public final class MappedStatement {
 
  private String resource;
  private Configuration configuration;
  private String id;
  private Integer fetchSize;
  private Integer timeout;
  private StatementType statementType;
  private ResultSetType resultSetType;
  private SqlSource sqlSource;
  private Cache cache;
  private ParameterMap parameterMap;
  private List<ResultMap> resultMaps;
  private boolean flushCacheRequired;
  private boolean useCache;
  private boolean resultOrdered;
  private SqlCommandType sqlCommandType;
  private KeyGenerator keyGenerator;
  private String[] keyProperties;
  private String[] keyColumns;
  private boolean hasNestedResultMaps;
  private String databaseId;
  private Log statementLog;
  private LanguageDriver lang;
 
  private MappedStatement() {
    // constructor disabled
  }
  ..........
｝
```

我们可以看到其中的属性基本上和xml元素的属性有对应关系，其中比较重要的有表示查询参数的ParameterMap对象，表示sql查询结果映射关系的ResultMap列表resultMaps，当然最重要的还是执行动态sql计算和获取的SqlSource对象。通过这些对象的通力合作，MappedStatement接受用户的查询参数对象，动态计算出要执行的sql语句，在数据库中执行sql语句后，再将取得的数据封装为JavaBean对象返回给用户。MappedStatement对象的这些功能，也体现出了Mybatis这个框架的核心价值，**“根据用户提供的查询参数对象，动态执行sql语句，并将结果封装为Java对象”。**

## 2.org.apache.ibatis.mapping.SqlSource

SqlSource是一个接口类，在MappedStatement对象中是作为一个属性出现的，它的代码如下：

```java
package org.apache.ibatis.mapping;
 
/**
 *
 * This bean represets the content of a mapped statement read from an XML file
 * or an annotation. It creates the SQL that will be passed to the database out
 * of the input parameter received from the user.
 *
 */
public interface SqlSource {
 
  BoundSql getBoundSql(Object parameterObject);
 
}
```

SqlSource接口只有一个getBoundSql(Object parameterObject)方法，返回一个BoundSql对象。一个BoundSql对象，代表了一次sql语句的实际执行，而SqlSource对象的责任，就是根据传入的参数对象，动态计算出这个BoundSql，也就是说Mapper文件中的<if />节点的计算，是由SqlSource对象完成的。SqlSource最常用的实现类是DynamicSqlSource，来看一看它的代码：

```java
package org.apache.ibatis.scripting.xmltags;
 
import java.util.Map;
 
import org.apache.ibatis.builder.SqlSourceBuilder;
import org.apache.ibatis.mapping.BoundSql;
import org.apache.ibatis.mapping.SqlSource;
import org.apache.ibatis.session.Configuration;
 
public class DynamicSqlSource implements SqlSource {
 
  private Configuration configuration;
  private SqlNode rootSqlNode;
 
  public DynamicSqlSource(Configuration configuration, SqlNode rootSqlNode) {
    this.configuration = configuration;
    this.rootSqlNode = rootSqlNode;
  }
 
  public BoundSql getBoundSql(Object parameterObject) {
    DynamicContext context = new DynamicContext(configuration, parameterObject);
    rootSqlNode.apply(context);
    SqlSourceBuilder sqlSourceParser = new SqlSourceBuilder(configuration);
    Class<?> parameterType = parameterObject == null ? Object.class : parameterObject.getClass();
    SqlSource sqlSource = sqlSourceParser.parse(context.getSql(), parameterType, context.getBindings());
    BoundSql boundSql = sqlSource.getBoundSql(parameterObject);
    for (Map.Entry<String, Object> entry : context.getBindings().entrySet()) {
      boundSql.setAdditionalParameter(entry.getKey(), entry.getValue());
    }
    return boundSql;
  }
 
}
```

其中的

```java
rootSqlNode.apply(context);
```

这句调用语句，启动了一个非常精密的递归实现的动态计算sql语句的过程，计算过程使用Ognl来根据传入的参数对象计算表达式，生成该次调用过程中实际执行的sql语句。

## 3.org.apache.ibatis.scripting.xmltags.DynamicContext

DynamicContext类中，有对传入的parameterObject对象进行“map”化处理的部分，也就是说，你传入的pojo对象，会被当作一个键值对数据来源来进行处理，读取这个pojo对象的接口，还是Map对象。从DynamicContext的源码中，能看到很明显的线索。

```java
import java.util.HashMap;
import java.util.Map;
 
import ognl.OgnlException;
import ognl.OgnlRuntime;
import ognl.PropertyAccessor;
 
import org.apache.ibatis.reflection.MetaObject;
import org.apache.ibatis.session.Configuration;
 
public class DynamicContext {
 
  public static final String PARAMETER_OBJECT_KEY = "_parameter";
  public static final String DATABASE_ID_KEY = "_databaseId";
 
  static {
    OgnlRuntime.setPropertyAccessor(ContextMap.class, new ContextAccessor());
  }
 
  private final ContextMap bindings;
  private final StringBuilder sqlBuilder = new StringBuilder();
  private int uniqueNumber = 0;
 
  public DynamicContext(Configuration configuration, Object parameterObject) {
    if (parameterObject != null && !(parameterObject instanceof Map)) {
      MetaObject metaObject = configuration.newMetaObject(parameterObject);
      bindings = new ContextMap(metaObject);
    } else {
      bindings = new ContextMap(null);
    }
    bindings.put(PARAMETER_OBJECT_KEY, parameterObject);
    bindings.put(DATABASE_ID_KEY, configuration.getDatabaseId());
  }
 
  public Map<String, Object> getBindings() {
    return bindings;
  }
 
  public void bind(String name, Object value) {
    bindings.put(name, value);
  }
 
  public void appendSql(String sql) {
    sqlBuilder.append(sql);
    sqlBuilder.append(" ");
  }
 
  public String getSql() {
    return sqlBuilder.toString().trim();
  }
 
  public int getUniqueNumber() {
    return uniqueNumber++;
  }
 
  static class ContextMap extends HashMap<String, Object> {
    private static final long serialVersionUID = 2977601501966151582L;
 
    private MetaObject parameterMetaObject;
    public ContextMap(MetaObject parameterMetaObject) {
      this.parameterMetaObject = parameterMetaObject;
    }
 
    @Override
    public Object get(Object key) {
      String strKey = (String) key;
      if (super.containsKey(strKey)) {
        return super.get(strKey);
      }
 
      if (parameterMetaObject != null) {
        Object object = parameterMetaObject.getValue(strKey);
        if (object != null) {
          super.put(strKey, object);
        }
 
        return object;
      }
 
      return null;
    }
  }
 
  static class ContextAccessor implements PropertyAccessor {
 
    public Object getProperty(Map context, Object target, Object name)
        throws OgnlException {
      Map map = (Map) target;
 
      Object result = map.get(name);
      if (result != null) {
        return result;
      }
 
      Object parameterObject = map.get(PARAMETER_OBJECT_KEY);
      if (parameterObject instanceof Map) {
          return ((Map)parameterObject).get(name);
      }
 
      return null;
    }
 
    public void setProperty(Map context, Object target, Object name, Object value)
        throws OgnlException {
      Map map = (Map) target;
      map.put(name, value);
    }
  }
}
```

在DynamicContext的构造函数中，可以看到，根据传入的参数对象是否为Map类型，有两个不同构造ContextMap的方式。而ContextMap作为一个继承了HashMap的对象，作用就是用于统一参数的访问方式：用Map接口方法来访问数据。具体来说，当传入的参数对象不是Map类型时，Mybatis会将传入的POJO对象用MetaObject对象来封装，当动态计算sql过程需要获取数据时，用Map接口的get方法包装 

MetaObject对象的取值过程。

我们都知道，Mybatis中采用了Ognl来计算动态sql语句，DynamicContext类中的这个静态初始块，很好的说明了这一点

```java
static {
  OgnlRuntime.setPropertyAccessor(ContextMap.class, new ContextAccessor());
}
```

ContextAccessor也是DynamicContext的内部类，实现了Ognl中的PropertyAccessor接口，为Ognl提供了如何使用ContextMap参数对象的说明，这个类也为整个参数对象“map”化划上了最后一笔。

现在我们能比较清晰的描述一下Mybatis中的参数传递和使用过程了：**将传入的参数对象统一封装为ContextMap对象（继承了HashMap对象），然后Ognl运行时环境在动态计算sql语句时，会按照ContextAccessor中描述的Map接口的方式来访问和读取ContextMap对象，获取计算过程中需要的参数。ContextMap对象内部可能封装了一个普通的POJO对象，也可以是直接传递的Map对象，当然从外部是看不出来的，因为都是使用Map的接口来读取数据。**

结合一个例子来理解一下：

```java
@Test
    public void testSqlSource() throws Exception {
        String resource = "mybatis/mybatis-config.xml";
        InputStream inputStream = Resources.getResourceAsStream(resource);
        SqlSessionFactory sqlSessionFactory = new SqlSessionFactoryBuilder()
                .build(inputStream);
        SqlSession session = sqlSessionFactory.openSession();
 
        try {
            Configuration configuration = session.getConfiguration();
            MappedStatement mappedStatement = configuration
                    .getMappedStatement("mybatis.UserDao.find2");
            assertNotNull(mappedStatement);
             
            UserBean param = new UserBean();
            param.setUserName("admin");
            param.setUserPassword("admin");
            BoundSql boundSql = mappedStatement.getBoundSql(param);
            String sql = boundSql.getSql();
 
            Map<String, Object> map = new HashMap<String, Object>();
            map.put("userName", "admin");
            map.put("userPassword", "admin");
            BoundSql boundSql2 = mappedStatement.getBoundSql(map);
            String sql2 = boundSql2.getSql();
 
            assertEquals(sql, sql2);
             
            UserBean bean = session.selectOne("mybatis.UserDao.find2", map);
            assertNotNull(bean);
 
        } finally {
            session.close();
        }
 
    }
```

上面这个Junit测试方法，是我写的一个测试用例中的一小段，其中的UserBean对象，就是一个有三个属性userName，userPassword，createDate的POJO对象，对应的Mapper文件是文章开头给出的配置文件。

第一次测试，我使用的是一个UserBean对象，来获取和计算sql语句，而第二次我是使用了一个HashMap对象，按照属性的名字，我分别设置了两个键值对象，我甚至还直接使用它来启动了一次session对象的查询selectOne。所有这些操作，都是测试通过（绿条）。这充分说明了，**Mybatis参数获取过程中，对Map对象和普通POJO对象的无差别化，因为在内部，两者都会被封装，然后通过Map接口来访问！**

 

来源： <<http://www.open-open.com/lib/view/open1363572227609.html>>

 