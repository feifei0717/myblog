# Mysql分表策略及实现

分类: database
日期: 2015-06-28

原文地址: 

http://blog.chinaunix.net/uid-29632145-id-5099941.html

------

****[Mysql分表策略及实现 ]()*2015-06-28 12:59:04*

分类： Mysql/postgreSQL

Mysql分表策略及实现

分表策略:

1. 取模分表，
2. 根据时间维度进行分表
3. 自定义的Hash

分表实现原理：利用sqlparser解析sql参数，根据参数修改相关的表名为实际表名。

分表后的数据复制，一般采用insert + select语句将原有表的数据导入新的分表，或者直接copy原表的数据到分表中。比如根据id取模分四张表，分表后把原有数据复制示例如下。

**insert** **into** user0(id,name, extDO, hobbys, votes) **select** * **from** **user** **where** id**mod** 4 = 0

**insert** **into** user1(id,name, extDO, hobbys, votes) **select** * **from** **user** **where** id**mod** 4 = 1

**insert** **into** user2(id,name, extDO, hobbys, votes) **select** * **from** **user** **where** id**mod** 4 = 2

**insert** **into** user3(id,name, extDO, hobbys, votes) **select** * **from** **user** **where** id**mod** 4 = 3

ORM这方面大部分公司都是在现有框架的基础上，进行自定义，实现分表等高级功能，很少有开源。淘宝最近开源了TDDL，但分库分表相关的功能还未开源。Java分表现有的开源框架，找了半天发现一个很简单（不是很完善）shardbatis框架：<https://code.google.com/p/shardbatis/> 

​       这个不错的项目，好久都没更新了。非常希望能参与进去，将这个框架持续完善推进；与作者联系半天也木有回应，估计作者忙于其它事情了。研究该框架时发现生成的部分分表语句有问题，如下面分页优化的sql语句：

```
select u.id, u.name, u.extDO, u.hobbys, u.votes

    from (

        select id from user where id = ?  and 3 > 1 limit 5

    ) as a, user as u where a.id = u.id
```

它会解析成： 

```
select u.id, u.name, u.extDO, u.hobbys, u.votes

    from (select id from user1 where id = ? limit 5) , user1 as u where a.id = u.id
```

研究发现AbstractSqlConverter类的protected String doDeParse(Statement statement)方法有问题，将其修改为：

```
protected String doDeParse(Statement statement) {

        StatementToSql sql = new StatementToSql();

        statement.accept(sql);

        return sql.toString();

}
```

StatementToSql代码如下：

```
public class StatementToSql implements StatementVisitor{

    private StringBuffer buf;

    public StatementToSql(){

        buf = new StringBuffer();

    }

    @Override

    public void visit(Select select) {

        buf.append(select.toString());

    }

    @Override

    public void visit(Delete delete) {

        buf.append(delete.toString());

    }

    @Override

    public void visit(Update update) {

        buf.append(update.toString());

    }

    @Override

    public void visit(Insert insert) {

        buf.append(insert.toString());

    }

    @Override

    public void visit(Replace replace) {

        buf.append(replace.toString());

    }

    @Override

    public void visit(Drop drop) {

        buf.append(drop.toString());

    }

    @Override

    public void visit(Truncate truncate) {

        buf.append(truncate.toString());

    }

    @Override

    public void visit(CreateTable createTable) {

        buf.append(createTable.toString());

    }

    public String toString(){

        return buf.toString();

    }

}
```

生成正常分表的SQL语句：

```
select u.id, u.name, u.extDO, u.hobbys, u.votes

    from (

        select id from user1 where id = ?  and 3 > 1 limit 5

    ) as a, user1 as u where a.id = u.id
```

这个问题应该框架依赖的sqlparser库本身StatementDeParser自身反向生成SQL时bug导致的。

利用shardbatis实现取模及按日期分表通用实现策略，代码如下：

取模分表：

```
/**根据属性值的模进行取模， 支持int long short类型*/
public abstract class ModShardStrategy implements ShardStrategy {

    public String getTargetTableName(String tableName, Object params, String mappedId) {

        Class<?> type = params.getClass();

        Boolean isPrimitive = type.isPrimitive();

        /** 原始类型 */

        if(isPrimitive){

            long identify = Long.parseLong(params.toString());

            return ShardUtils.mod(tableName, identify, this.getShardNum());

        }

        /** 引用类型 */

        if(type == Long.class || type == Integer.class || type == Short.class){

            return ShardUtils.mod(tableName, Long.parseLong(params.toString()),this.getShardNum());

        }

        /**

         * 正常类型

         * */

        try {

            String value = BeanUtils.getProperty(params, this.getShardPropertyName());

            return ShardUtils.mod(tableName, Long.parseLong(value), this.getShardNum());

        } catch (Exception e) {

            throw new IllegalArgumentException(e);

        }

    }

    //分表总数

    public abstract int getShardNum();

    //属性列名

    public abstract String getShardPropertyName();

}
```

按日期分表

```
/**

* 根据日期进行分表， bean中属性的类型必须为date

* */

public abstract class DateShardStrategy implements ShardStrategy{

    public String getTargetTableName(String baseTableName, Object params,

            String mapperId) {

        Class<?> type = params.getClass();

        if(type == Date.class){

            SimpleDateFormat format = new SimpleDateFormat(this.getShardPattern());

            String suffix = format.format(params);

            return ShardUtils.tableName(baseTableName, suffix);

        }    

        try {

            Date value = (Date) ReflectionUtils.getFieldValue(params,this.getShardPropertyName());

            SimpleDateFormat format = new SimpleDateFormat(this.getShardPattern());

            String suffix = format.format(value);

            return ShardUtils.tableName(baseTableName, suffix);

        } catch (Exception e) {

            throw new IllegalArgumentException(e);

        }

    }

    /**

     * 数据拆分日期的pattern

     * */

    public abstract String getShardPattern();

    /**

     * 属性名字

     * */

    public abstract String getShardPropertyName();

}
```

 