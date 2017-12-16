这篇文章并没有给出如何使用ResultSet的具体例子，只是从ResultSet的功能性上进行了详细的讲述。希望这篇文章对大家理解ResultSet能够有所帮助。下面就是这篇文章的具体内容。 
​         结果集(ResultSet)是数据中查询结果返回的一种对象，可以说结果集是一个存储查询结果的对象，但是结果集并不仅仅具有存储的功能，他同时还具有操纵数据的功能，可能完成对数据的更新等。

 

​        结果集读取数据的方法主要是getXXX()，他的参数可以使整型表示第几列（是从1开始的），还可以是列名。返回的是对应的XXX类型的值。如果对应那列时空值，XXX是对象的话返回XXX型的空值，如果XXX是数字类型，如Float等则返回0，boolean返回false。使用getString()可以返回所有的列的值，不过返回的都是字符串类型的。XXX可以代表的类型有：基本的数据类型如整型(int)，布尔型(Boolean)，浮点型(Float,Double)等，比特型（byte），还包括一些特殊的类型，如：日期类型（java.sql.Date），时间类型(java.sql.Time)，时间戳类型(java.sql.Timestamp)，大数型(BigDecimal和BigInteger等)等。还可以使用getArray(int colindex/String columnname)，通过这个方法获得当前行中，colindex所在列的元素组成的对象的数组。使用getAsciiStream(
int colindex/String colname)可以获得该列对应的当前行的ascii流。也就是说所有的getXXX方法都是对当前行进行操作。

 

​    结果集从其使用的特点上可以分为四类，这四类的结果集的所具备的特点都是和Statement语句的创建有关，因为结果集是通过Statement语句执行后产生的，所以可以说，结果集具备何种特点，完全决定于Statement，当然我是说下面要将的四个特点，在Statement创建时包括三种类型。首先是无参数类型的，他对应的就是下面要介绍的基本的ResultSet对应的Statement。下面的代码中用到的Connection并没有对其初始化，变量conn代表的就是Connection对应的对象。SqlStr代表的是响应的SQL语句。

 

1、    最基本的ResultSet。
之所以说是最基本的ResultSet是因为，这个ResultSet他起到的作用就是完成了查询结果的存储功能，而且只能读去一次，不能够来回的滚动读取。这种结果集的创建方式如下：

 

Statement st = conn.CreateStatement()
ResultSet rs = Statement.excuteQuery(sqlStr);

 

由于这种结果集不支持，滚动的读去功能所以，如果获得这样一个结果集，只能使用它里面的next()方法，逐个的读去数据。

 

2、    可滚动的ResultSet类型。
这个类型支持前后滚动取得纪录next()、previous()，回到第一行first()，同时还支持要去的ResultSet中的第几行absolute（int n），以及移动到相对当前行的第几行relative(int n)，要实现这样的ResultSet在创建Statement时用如下的方法。

 

Statement st = conn.createStatement(int resultSetType, int resultSetConcurrency)
ResultSet rs = st.executeQuery(sqlStr)

 

其中两个参数的意义是：
resultSetType是设置ResultSet对象的类型可滚动，或者是不可滚动。取值如下：
​       ResultSet.TYPE_FORWARD_ONLY只能向前滚动
​       ResultSet.TYPE_SCROLL_INSENSITIVE和Result.TYPE_SCROLL_SENSITIVE这两个方法都能够实现任意的前后滚动，使用各种移动的ResultSet指针的方法。二者的区别在于前者对于修改不敏感，而后者对于修改敏感。
resultSetConcurency是设置ResultSet对象能够修改的，取值如下：
​       ResultSet.CONCUR_READ_ONLY 设置为只读类型的参数。
​       ResultSet.CONCUR_UPDATABLE 设置为可修改类型的参数。
所以如果只是想要可以滚动的类型的Result只要把Statement如下赋值就行了。

 

Statement st = conn.createStatement(Result.TYPE_SCROLL_INSENITIVE,
​                          ResultSet.CONCUR_READ_ONLY);
ResultSet rs = st.excuteQuery(sqlStr)；

 

用这个Statement执行的查询语句得到的就是可滚动的ResultSet。

 

3、    可更新的ResultSet
这样的ResultSet对象可以完成对数据库中表的修改，但是我知道ResultSet只是相当于数据库中表的视图，所以并不时所有的ResultSet只要设置了可更新就能够完成更新的，能够完成更新的ResultSet的SQL语句必须要具备如下的属性：
​    a、只引用了单个表。
​    b、不含有join或者group by子句。
​    c、那些列中要包含主关键字。
​    具有上述条件的，可更新的ResultSet可以完成对数据的修改，可更新的结果集的创建方法是：

 

Statement st = createstatement(Result.TYPE_SCROLL_INSENSITIVE,Result.CONCUR_UPDATABLE)

 

这样的Statement的执行结果得到的就是可更新的结果集。更新的方法是，把ResultSet的游标移动到你要更新的行，然后调用updateXXX()，这个方法XXX的含义和getXXX()是相同的。updateXXX（）方法，有两个参数，第一个是要更新的列，可以是列名或者序号。第二个是要更新的数据，这个数据类型要和XXX相同。每完成对一行的update要调用updateRow()完成对数据库的写入，而且是在ResultSet的游标没有离开该修改行之前，否则修改将不会被提交。
​    使用updateXXX方法还可以完成插入操作。但是首先要介绍两个方法：
​    moveToInsertRow()是把ResultSet移动到插入行，这个插入行是表中特殊的一行，不需要指定具体那一行，只要调用这个方法系统会自动移动到那一行的。
​    moveToCurrentRow()这是把ResultSet移动到记忆中的某个行，通常当前行。如果没有使用insert操作，这个方法没有什么效果，如果使用了insert操作，这个方法用于返回到insert操作之前的那一行，离开插入行，当然也可以通过next(),previous()等方法离开插入行。
​    要完成对数据库的插入，首先调用moveToInsertRow()移动到插入行，然后调用updateXXX的方法完成对，各列数据的更新，完成更新后和更新操作一样，要写到数据库，不过这里使用的是insertRow()，也要保证在该方法执行之前ResultSet没有离开插入列，否则插入不被执行，并且对插入行的更新将丢失。

 

4、    可保持的ResultSet
正常情况下如果使用Statement执行完一个查询，又去执行另一个查询时这时候第一个查询的结果集就会被关闭，也就是说，所有的Statement的查询对应的结果集是一个，如果调用Connection的commit()方法也会关闭结果集。可保持性就是指当ResultSet的结果被提交时，是被关闭还是不被关闭。JDBC2.0和1.0提供的都是提交后ResultSet就会被关闭。不过在JDBC3.0中，我们可以设置ResultSet是否关闭。要完成这样的ResultSet的对象的创建，要使用的Statement的创建要具有三个参数，这个Statement的创建方式也就是，我所说的Statement的第三种创建方式。如下：

 

Statement st=createStatement(int resultsetscrollable,int resultsetupdateable,int resultsetSetHoldability)
ResultSet rs = st.excuteQuery(sqlStr);

 

前两个参数和两个参数的createStatement方法中的参数是完全相同的，这里只介绍第三个参数：
​       resultSetHoldability表示在结果集提交后结果集是否打开，取值有两个：
​       ResultSet.HOLD_CURSORS_OVER_COMMIT:表示修改提交时，不关闭数据库。
​     ResultSet.CLOSE_CURSORS_AT_COMMIT：表示修改提交时ResultSet关闭。

 

不过这种功能只是在JDBC3.0的驱动下才能成立。

[**ResultSet **]()**接口******

ResultSet 接口提供对数据表的访问。ResultSet 对象通常是通过执行“语句”来生成的。

ResultSet 始终有一个游标指向其当前数据行。最初，游标定位在第一行的前面。next() 方法将游标移至下一行。

getXXX 方法会检索当前行的列值。可使用列的索引号或列的名称来检索这些值。通常，使用列索引将更为有效。列是从 1 开始编号的。

java.sql 包

公共接口 **ResultSet**

[表 102](http://www-306.ibm.com/software/data/db2/everyplace/doc/infocenters/chs/dbeapr1106.htm#TBLFIELDS_RSET) 列示 ResultSet 接口中 DB2 Everyplace 支持的字段。

[**表 102. ResultSet 接口字段**]()

| **字段类型**   | **字段**                                   |
| ---------- | ---------------------------------------- |
| static int | **CONCUR_READ_ONLY** 该常量指示不能更新的 ResultSet 对象的并行性方式。 **注意**：DB2 Everyplace 不支持 CONCUR_UPDATABLE。如果在创建“语句”对象时对ResultSet 对象的并行性方式指定 CONCUR_UPDATABLE，则 DB2 Everyplace JDBC驱动程序将对产生“语句”对象的“连接”对象发出 SQLWarning 并使用CONCUR_READ_ONLY 代替。 |
| static int | **TYPE_FORWARD_ONLY** 该常量指示其游标只能向前移动的 ResultSet 对象的类型。 |
| static int | **TYPE_SCROLL_INSENSITIVE** 该常量指示可滚动但通常对他人所作的更改不敏感的 ResultSet 对象的类型。**注意**：不要经常使用此类型的 ResultSet 对象，原因是它可能会影响性能。此类型使用 SQL_INSENSITIVE 作为 CLI 语句属性SQL_ATTR_CURSOR_SENSITIVITY 的值。有关详细信息，参阅 CLI 函数SQLSetStmtAttr 的文档。 |
| static int | **TYPE_SCROLL_SENSITIVE** 该常量指示可滚动且通常对他人所作的更改敏感的ResultSet 对象的类型。**注意**：此类型使用 SQL_UNSPECIFIED 作为 CLI 语句属性SQL_ATTR_CURSOR_SENSITIVITY 的值。有关详细信息，参阅 CLI 函数SQLSetStmtAttr 的文档。 |

[表 103](http://www-306.ibm.com/software/data/db2/everyplace/doc/infocenters/chs/dbeapr1106.htm#TBLMETHODS_RSET) 列示 ResultSet 接口中 DB2 Everyplace 支持的方法。

[**表 103. ResultSet 接口方法**]()

| **方法返回值类型** | **方法**                                   |
| ----------- | ---------------------------------------- |
| boolean     | **absolute**(int row) JDBC 2.0。将游标移至结果集中的给定行号。 |
| void        | **afterLast**() JDBC 2.0。将游标移至结果集的末尾，正好在最后一行的后面。 |
| void        | **beforeFirst**() JDBC 2.0。将游标移至结果集的前方，正好在第一行的前面。 |
| void        | **clearWarnings**() 清除此 ResultSet 对象上报告的所有警告。 |
| void        | **close**() 立即释放此 ResultSet 对象的数据库和 JDBC 资源，而不是等待对象自动关闭时才释放它们。 |
| int         | **findColumn**(String columnName) 将给定 ResultSet 列名映射至其ResultSet 列索引。 |
| boolean     | **first**() JDBC 2.0。将游标移至结果集中的第一行。      |
| BigDecimal  | **getBigDecimal**(int columnIndex) JDBC 2.0。以具有全部精度的java.math.BigDecimal 对象形式获取当前行中某个列的值。Palm OS 的 DB2 Everyplace JDBC 驱动程序不支持此方法。 |
| BigDecimal  | **getBigDecimal**(int columnIndex, int scale) 以 Java 编程语言中的java.math.BigDecim |

| BigDecimal        | **getBigDecimal**(int columnIndex, int scale) 以 Java 编程语言中的java.math.BigDecimal 对象形式获取此 ResultSet 对象当前行中指定列的值。Palm OS 的 DB2 Everyplace JDBC 驱动程序不支持此方法。**不受支持。** |
| ----------------- | ---------------------------------------- |
| BigDecimal        | **getBigDecimal**(String columnName) JDBC 2.0。以具有全部精度的java.math.BigDecimal 对象形式获取当前行中某个列的值。Palm OS 的 DB2 Everyplace JDBC 驱动程序不支持此方法。 |
| BigDecimal        | **getBigDecimal**(String columnName, int scale) 以 Java 编程语言中的java.math.BigDecimal 对象形式获取此 ResultSet 对象当前行中指定列的值。Palm OS 的 DB2 Everyplace JDBC 驱动程序不支持此方法。**不受支持。** |
| Blob              | **getBlob**(int columnIndex) JDBC 2.0。获取此 ResultSet 对象的当前行中的BLOB 值。 |
| Blob              | **getBlob**(String columnName) JDBC 2.0。获取此 ResultSet 对象的当前行中的 BLOB 值。 |
| boolean           | **getBoolean**(int columnIndex) 以 Java 布尔值形式获取当前行中某列的值。 |
| boolean           | **getBoolean**(String columnName) 以 Java 布尔值形式获取当前行中某列的值。 |
| byte              | **getByte**(int columnIndex) 以 Java 编程语言中的字节形式获取此ResultSet 对象当前行中指定列的值。 |
| byte              | **getByte**(String columnName) 以 Java 编程语言中的字节形式获取此ResultSet 对象当前行中指定列的值。 |
| byte[]            | **getBytes**(int columnIndex) 以 Java 编程语言中的字节数组形式获取此ResultSet 对象当前行中指定列的值。 |
| byte[]            | **getBytes**(String columnName) 以 Java 编程语言中的字节数组形式获取此ResultSet 对象当前行中指定列的值。 |
| int               | **getConcurrency**() JDBC 2.0。返回结果集的并行性方式。 |
| Date              | **getDate**(int columnIndex) 以 Java 编程语言中的 java.sql.Date 对象形式获取此 ResultSet 对象当前行中指定列的值。 |
| Date              | **getDate**(int columnIndex, Calendar cal) 以 Java 编程语言中的java.sql.Date 对象形式返回此 ResultSet 对象的当前行中指定列的值。 |
| Date              | **getDate**(String columnName) 以 Java 编程语言中的 java.sql.Date 对象形式获取此 ResultSet 对象的当前行中指定列的值。 |
| double            | **getDouble**(int columnIndex) 以 Java 双精度形式获取当前行中某列的值。 |
| double            | **getDouble**(String columnName) 以 Java 双精度形式获取当前行中某列的值。 |
| float             | **getFloat**(int columnIndex) 以 Java 浮点形式获取当前行中某列的值。 |
| float             | **getFloat**(String columnName) 以 Java 浮点形式获取当前行中某列的值。 |
| int               | **getInt**(int columnIndex) 以 Java 编程语言中的整数形式获取此 ResultSet对象当前行中指定列的值。 |
| int               | **getInt**(String columnName) 以 Java 编程语言中的整数形式获取此ResultSet 对象的当前行中指定列的值。 |
| long              | **getLong**(int columnIndex) 以 Java 长整型形式获取当前行中某列的值。 |
| long              | **getLong**(String columnName) 以 Java 长整型形式获取当前行中某列的值。 |
| ResultSetMetaData | **getMetaData**() 检索此 ResultSet 对象的列的数目、类型和属性。 |
| Object            | **getObject**(int columnIndex) 以 Java 对象形式获取当前行中某列的值。 |
| Object            | **getObject**(String columnName) 以 Java 对象形式获取当前行中某列的值。 |
| int               | **getRow**() JDBC 2.0。检索当前行号。            |
| short             | **getShort**                             |

| short      | **getShort**(String columnName) 以 Java 编程语言中的 short 形式获取此ResultSet 对象当前行中指定列的值。 |
| ---------- | ---------------------------------------- |
| Statement  | **getStatement**() JDBC 2.0。返回产生此 ResultSet 对象的“语句”。 |
| String     | **getString**(int columnIndex) 以 Java 编程语言中的 String 形式获取此ResultSet 对象当前行中指定列的值。 |
| String     | **getString**(String columnName) 以 Java 编程语言中的 String 形式获取此ResultSet 对象当前行中指定列的值。 |
| Time       | **getTime**(int columnIndex) 以 Java 编程语言中的 java.sql.Time 对象形式获取此 ResultSet 对象的当前行中指定列的值。 |
| Time       | **getTime**(String columnName) 以 Java 编程语言中的 java.sql.Date 对象形式获取此 ResultSet 对象的当前行中指定列的值。 |
| Timestamp  | **getTimestamp**(String columnName) 以 Java 编程语言中的java.sql.Timestamp 对象形式获取此 ResultSet 对象的当前行中指定列的值。 |
| Timestamp  | **getTimestamp**(int columnIndex) 以 Java 编程语言中的java.sql.Timestamp 对象形式获取此 ResultSet 对象的当前行中指定列的值。 |
| int        | **getType**() JDBC 2.0。返回此结果集的类型。        |
| SQLWarning | **getWarnings**() 返回此 ResultSet 上的调用报告的首次警告。 |
| boolean    | **isAfterLast**() JDBC 2.0。指示游标是否在结果集中的最后一行后面。 |
| boolean    | **isBeforeFirst**() JDBC 2.0。指示游标是否在结果集中的第一行前面。 |
| boolean    | **isFirst**() JDBC 2.0。指示游标是否在结果集中的第一行上。 |
| boolean    | **isLast**() JDBC 2.0。指示游标是否在结果集中的最后一行上。对于具有类型TYPE_FORWARD_ONLY 的结果集，不支持此方法。 |
| boolean    | **last**() JDBC 2.0。将游标移至结果集中的最后一行。      |
| boolean    | **next**() 将游标从当前位置向下移动一行。               |
| boolean    | **previous**() JDBC 2.0。将游标移至结果集中的前一行。   |
| boolean    | **relative**(int rows) JDBC 2.0。将游标移动相对行数，正数或负数。 |
| boolean    | **wasNull**() 报告读取的最后一列是否具有值 SQL NULL。   |

 

 

JDBC API 2.0/3.0中ResultSet记录集的

JDBC API 2.0/3.0

中

ResultSet

记录集的简便实用的新特性

1 

新定义了若干个常数

这些常数用于指定

ResultSet 

的类型游标移动的方向等性质，如下所示：

public static final int FETCH_FORWARD; 

该常数的作用是指定处理记录集中行的顺序，是由前到后即从第一行开始处理一直到最后一行；

public static final int FETCH_REVERSE; 

该常数的作用是指定处理记录集中行的顺序，是由后到前即从最后一行开始处理一直到第一行；

public static final int FETCH_UNKNOWN; 

该常数的作用是不指定处理记录集中行的顺序，由

JDBC 

驱动程序和数据库系统决定；

public static final int TYPE_FORWARD_ONLY; 

该常数的作用是指定数据库游标的移动方向是向前，不允许向后移动即只能使用

ResultSet 

接口的

next()

方法而不能使用

previous()

方法否则会产生错误；

public static final int TYPE_SCROLL_INSENSITIVE; 

该常数的作用是指定数据库游标可以在记录集中前后移动，并且当前数据库用户获取的记录集对其他用户的操作不敏感；就是说，当前用户正在浏览记录集中的数据，与此同时，其他用户更新了数据库中的数据，但是当前用户所获取的记录集中的数据不会受到任何影响。

public static final int TYPE_SCROLL_SENSITIVE; 

该常数的作用是指定数据库游标可以在记录集中前后移动，并且当前数据库用户获取的记录集对其他用户的操作敏感，就是说，当前用户正在浏览记录集，但是其它用户的操作使数据库中的数据发生了变化，当前用户所获取的记录集中的数据也会同步发生变化，这样有可能会导致非常严重的错误产生建议慎重使用该常数。

public static final int CONCUR_READ_ONLY; 

该常数的作用是指定当前记录集的协作方式

(concurrencymode)

，为只读；一旦使用了这个常数，那么用户就不可以更新记录集中的数据。

public static final int CONCUR_UPDATABLE; 

该常数的作用是指定当前记录集的协作方式

(concurrencymode)

，为可以更新；一旦使用了这个常数，那么用户就可以使用

updateXXX()

等方法更新记。

2 ResultSet 

接口提供了一整套的定位方法

这些可以在记录集中定位到任意一行：

public boolean absolute(int row); 

该方法的作用是将记录集中的某一行设定为当前行，亦即将数据库游标移动到指定的行，参数

row 

指定了目标行的行号，这是绝对的行号，由记录集的第一行开始计算不是相对的行号。

public boolean relative(int rows); 

该方法的作用也是将记录集中的某一行设定为当前行，但是它的参数

rows 

表示目标行相对于当前行的行号。

public boolean first(); 

该方法的作用是将当前行定位到数据库记录集的第一行。

public boolean last(); 

该方法的作用刚好和

first()

方法相反。

public boolean isFirst(); 
public boolean isFirst(); 该方法的作用是检查当前行是否记录集的第一行，如果是返回true， 否则返回false。 
public boolean isLast(); 该方法的作用是检查当前行是否记录集的最后一行，如果是返回true ，否则返回false。 
public void afterLast(); 该方法的作用是将数据库游标移到记录集的最后，位于记录集最后一行的后面，如果该记录集不包含任何的行该方法不产生作用。 
public void beforeFirst(); 该方法的作用是将数据库游标移到记录集的最前面，位于记录集第一行的前面，如果记录集不包含任何的行该方法不产生作用。 
public boolean isAfterLast(); 该方法检查数据库游标是否处于记录集的最后面，如果是返回true ，否则返回false。 
public boolean isBeforeFirst(); 该方法检查数据库游标是否处于记录集的最前面，如果是返回true ，否则返回false。 
public boolean next(); 该方法的作用是将数据库游标向前移动一位，使得下一行成为当前行，当刚刚打开记录集对象时，数据库游标的位置在记录集的最前面，第一次使用next()方法将会使数据库游标定位到记录集的第一行，第二次使用next()方法将会使数据库游标定位到记录集的第二行，以此类推。 
public boolean previous(); 该方法的作用是将数据库游标向后移动一位，使得上一行成为当前行。 
3 ResultSet 接口添加了对行操作的支持（最令人心动之处） 
修改了的记录集接口(ResultSet 接口)的方法，使它支持可以滚动的记录集，即数据库游标可以在返回的记录集对象中自由地向前或向后滚动，或者定位到某个特殊的行。利用ResultSet 接口中定义的新方法，JSP/Servlet 程序员可以用Java 语言来更新记录集，比如插入记录，更新某行的数据，而不是靠执行SQL 语句，这样就大大方便了程序员的开发工作，享受Java 编程的乐趣了。 
ResultSet 接口中新添加的部分方法如下所示： 
public boolean rowDeleted(); 如果当前记录集的某行被删除了，那么记录集中将会留出一个空位；调用rowDeleted()方法，如果探测到空位的存在，那么就返回true； 如果没有探测到空位的存在，就返回false 值。 
public boolean rowInserted(); 如果当前记录集中插入了一个新行，该方法将返回true ，否则返回false。 
public boolean rowUpdated(); 如果当前记录集的当前行的数据被更新，该方法返回true ，否则返回false。 
public void insertRow(); 该方法将执行插入一个新行到当前记录集的操作。 
public void updateRow(); 该方法将更新当前记录集当前行的数据。 
public void deleteRow(); 该方法将删除当前记录集的当前行。 
public void updateString(int columnIndex String x); 该方法更新当前记录集当前行某列的值，该列的数据类型是String(指Java 数据类型是String ，与之对应的JDBC 数据类型是VARCHAR 或NVARCHAR 等数据类型) 。该方法的参数columnIndex 指定所要更新的列的列索引，第一列的列索引是1 ，以此类推，第二个参数x 代表新的值，这个方法并不执行数据库操作，需要执行insertRow()方法或者updateRow()方法以后，记录集和数据库中的数据才能够真正更新。 
public void updateString(String columnName String x); 该方法和上面介绍的同名方法差不多，不过该方法的第一个参数是columnName ，代表需要更新的列的列名，而不是columnIndex。 
往数据库当前记录集插入新行的操作流程如下： 
1 调用moveToInsertRow()方法； 
2 调用updateXXX()方法指定插入行各列的值； 
3 调用insertRow()方法往数据库中插入新的行。 
更新数据库中某个记录的值(某行的值)的方法是： 
1 定位到需要修改的行(使用absolute() relative()等方法定位)； 
2 使用相应updateXXX()方法设定某行某列的新值；XXX 所代表的Java 数据类型，必须可以映射为某列的JDBC 数据类型，如果希望rollback 该项操作，请在调用updateRow()方法以前，使用cancelRowUpdates()方法，这个方法可以将某行某列的值复原； 
3 使用updateRow()方法完成UPDATE 的操作。 
删除记录集中某行(亦即删除某个记录)的方法： 
1 定位到需要修改的行(使用absolute() relative()等方法定位)； 
2 使用deleteRow()
删除记录集中某行(亦即删除某个记录)的方法： 
1 定位到需要修改的行(使用absolute() relative()等方法定位)； 
2 使用deleteRow()方法。 
JDBC API 3.0 中还在ResultSet 接口中添加了updateArray() updateBlob() updateClob() updateRef()等方法 1、java数据库操作基本流程
　　2、几个常用的重要技巧：
　　可滚动、更新的记录集
　　批量更新
　　事务处理 
　　java数据库操作基本流程：取得数据库连接 - 执行sql语句 - 处理执行结果 - 释放数据库连接
　　1、取得数据库连接
　　1）用DriverManager取数据库连接
　　例子：String className,url,uid,pwd;
className = "oracle.jdbc.driver.OracleDriver";
url = "jdbc:oracle:thin:@127.0.0.1:1521:orasvr;
uid = "system";
pwd = "[manager](http://www.yesky.com/key/1986/166986.html)";
Class.forName(className);
Connection cn = DriverManager.getConnection(url,uid,pwd);
　　2）用jndi(java的命名和目录服务)方式
　　例子String jndi = "jdbc/db";
Context ctx = (Context) [new](http://www.yesky.com/key/1252/161252.html) InitialContext().lookup("java:comp/env");
DataSource ds = (DataSource) ctx.lookup(jndi);
Connection cn = ds.getConnection();
　　多用于jsp中
　　2、执行sql语句
　　1）用Statement来执行sql语句String sql;
Statement [sm](http://www.yesky.com/key/2711/167711.html) = cn.createStatement();
sm.executeQuery(sql); // 执行数据查询语句（select）
sm.executeUpdate(sql); // 执行数据更新语句（delete、update、insert、drop等）statement.close();
　　2）用PreparedStatement来执行sql语句String sql;
sql = "insert into user ([id](http://www.yesky.com/key/3982/163982.html),name) values (?,?)";
PreparedStatement ps = cn.prepareStatement(sql);
ps.setInt(1,xxx);
ps.setString(2,xxx);
...
ResultSet rs = ps.executeQuery(); // 查询
int c = ps.executeUpdate(); // 更新
　　3、处理执行结果
　　查询语句，返回记录集ResultSet。
　　更新语句，返回数字，表示该更新影响的记录数。
　　ResultSet的方法：
　　1、next()，将游标往后移动一行，如果成功返回true；否则返回false。
　　2、getInt("id")或getSting("name")，返回当前游标下某个字段的值。
　　3、释放连接。cn.close();
　　一般，先关闭ResultSet，然后关闭Statement（或者PreparedStatement）；最后关闭Connection
　　可滚动、更新的记录集
　　1、创建可滚动、更新的StatementStatement sm = cn.createStatement(ResultSet.[TYPE](http://www.yesky.com/key/2529/162529.html)_SCROLL_ENSITIVE,ResultSet.CONCUR_READ_ONLY);
　　该Statement取得的ResultSet就是可滚动的
　　2、创建PreparedStatement时指定参数PreparedStatemet ps = cn.prepareStatement(sql,ResultSet.TYPE_SCROLL_INSENSITIVE,ResultSet.CONCUR_READ_ONLY);
ResultSet.absolute(9000);
　　批量更新
　　1、StatementStatement sm = cn.createStatement();
sm.addBatch(sql1);
sm.addBatch(sql2);
...
sm.executeBatch()
　　一个Statement对象，可以执行多个sql语句以后，批量更新。这多个语句可以是delete、update、insert等或兼有
　　2、PreparedStatementPreparedStatement ps = cn.preparedStatement(sql);
{
　ps.setXXX(1,xxx);
　...
　ps.addBatch();
}
ps.executeBatch();
　　一个PreparedStatement，可以把一个sql语句，变换参数多次执行，一次更新。
　　事务的处理
　　1、关闭Connection的自动提交cn.setAutoCommit(false);
　　2、执行一系列sql语句
　　要点：执行每一个新的sql语句前，上一次执行sql语句的Statement（或者PreparedStatemet）必须先closeStatement sm ;
sm = cn.createStatement(insert into user...);
sm.executeUpdate();
sm.close();
sm = cn.createStatement("insert into corp...);
sm.executeUpdate();
sm.close();
　　3、提交cn.commit();
　　4、如果发生异常，那么回滚cn.rollback();

来源： <http://jmhmlu.blog.163.com/blog/static/1616122982011589535473/>