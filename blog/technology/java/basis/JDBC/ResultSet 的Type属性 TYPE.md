ResultSet 的Type属性 TYPE_FORWARD_ONLY, TYPE_SCROLL_I

分类: java
日期: 2014-11-15

原文地址: 

http://blog.chinaunix.net/uid-29632145-id-4624999.html

------

****[ResultSet 的Type属性 TYPE_FORWARD_ONLY, TYPE_SCROLL_I]() *2014-11-15 21:00:25*

分类： Java

说明：Statement stmt = con.createStatement(ResultSet.TYPE_SCROLL_INSENSITIVE,ResultSet.CONCUR_READ_ONLY); 
通用格式为：Statement stmt=con.createStatement(int type，int concurrency);我们在访问数据库的时候，在读取返回结果的时候，可能要前后移动指针，比如我们先计算有多少条信息，这是我们就需要把指针移到最后来计算，然后再把指针移到最前面，逐条读取，有时我们只需要逐条读取就可以了。还有就是有只我们只需要读取数据，为了不破坏数据，我们可采用只读模式，有时我们需要望数据库里添加记录，这是我们就要采用可更新数据库的模式。下面我们就对其参数进行说明： 
参数 int type 
ResultSet.TYPE_FORWORD_ONLY 结果集的游标只能向下滚动。 
ResultSet.TYPE_SCROLL_INSENSITIVE 结果集的游标可以上下移动，当数据库变化时，当前结果集不变。 
ResultSet.TYPE_SCROLL_SENSITIVE 返回可滚动的结果集，当数据库变化时，当前结果集同步改变。 
参数 int concurrency 
ResultSet.CONCUR_READ_ONLY 不能用结果集更新数据库中的表。 
ResultSet.CONCUR_UPDATETABLE 能用结果集更新数据库中的表。 
查询语句 
ResultSet re=stmt.executeUpdate(SQL语句）；用来更新数据库信息或插入数据 
ResultSet re=stmt.executeQuery(SQL语句）；用来查询数据库信息 
当我们使用ResultSet re=stmt.executeQuery(SQL语句）查询后，我们可以使用下列方法获得信息： 
public boolean previous() 将游标向上移动，该方法返回boolean型数据，当移到结果集第一行之前时，返回false。 
public void beforeFirst 将游标移动到结果集的初始位置，即在第一行之前。 
public void afterLast() 将游标移到结果集最后一行之后。 
public void first() 将游标移到结果集的第一行。 
public void last() 将游标移到结果集的最后一行。 
public boolean isAfterLast() 判断游标是否在最后一行之后。 
public boolean isBeforeFirst() 判断游标是否在第一行之前。 
public boolean ifFirst() 判断游标是否指向结果集的第一行。 
public boolean isLast() 判断游标是否指向结果集的最后一行。 
public int getRow() 得到当前游标所指向行的行号，行号从1开始，如果结果集没有行，返回0。 
public boolean absolute(int row) 将游标移到参数row指定的行号。如果row取负值，就是倒数的行数，absolute(-1)表示移到最后一行，absolute(-2)表示移到倒数第2行。当移动到第一行前面或最后一行的后面时，该方法返回false 
说明：Statement stmt = con.createStatement(ResultSet.TYPE_SCROLL_INSENSITIVE,ResultSet.CONCUR_READ_ONLY); 
通用格式为：Statement stmt=con.createStatement(int type，int concurrency);我们在访问数据库的时候，在读取返回结果的时候，可能要前后移动指针，比如我们先计算有多少条信息，这是我们就需要把指针移到最后来计算，然后再把指针移到最前面，逐条读取，有时我们只需要逐条读取就可以了。还有就是有只我们只需要读取数据，为了不破坏数据，我们可采用只读模式，有时我们需要望数据库里添加记录，这是我们就要采用可更新数据库的模式。下面我们就对其参数进行说明： 
参数 int type 
ResultSet.TYPE_FORWORD_ONLY 结果集的游标只能向下滚动。 
ResultSet.TYPE_SCROLL_INSENSITIVE 结果集的游标可以上下移动，当数据库变化时，当前结果集不变。 
ResultSet.TYPE_SCROLL_SENSITIVE 返回可滚动的结果集，当数据库变化时，当前结果集同步改变。 
参数 int concurrency 
ResultSet.CONCUR_READ_ONLY 不能用结果集更新数据库中的表。 
ResultSet.CONCUR_UPDATETABLE 能用结果集更新数据库中的表。 
查询语句 
ResultSet re=stmt.executeUpdate(SQL语句）；用来更新数据库信息或插入数据 
ResultSet re=stmt.executeQuery(SQL语句）；用来查询数据库信息 
当我们使用ResultSet re=stmt.executeQuery(SQL语句）查询后，我们可以使用下列方法获得信息： 
public boolean previous() 将游标向上移动，该方法返回boolean型数据，当移到结果集第一行之前时，返回false。 
public void beforeFirst 将游标移动到结果集的初始位置，即在第一行之前。 
public void afterLast() 将游标移到结果集最后一行之后。 
public void first() 将游标移到结果集的第一行。 
public void last() 将游标移到结果集的最后一行。 
public boolean isAfterLast() 判断游标是否在最后一行之后。 
public boolean isBeforeFirst() 判断游标是否在第一行之前。 
public boolean ifFirst() 判断游标是否指向结果集的第一行。 
public boolean isLast() 判断游标是否指向结果集的最后一行。 
public int getRow() 得到当前游标所指向行的行号，行号从1开始，如果结果集没有行，返回0。 
public boolean absolute(int row) 将游标移到参数row指定的行号。如果row取负值，就是倒数的行数，absolute(-1)表示移到最后一行，absolute(-2)表示移到倒数第2行。当移动到第一行前面或最后一行的后面时，该方法返回false 