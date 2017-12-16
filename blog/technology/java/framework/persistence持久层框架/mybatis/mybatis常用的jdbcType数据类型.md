## mybatis常用的jdbcType数据类型

### MyBatis 通过包含的jdbcType类型

```
BIT         FLOAT      CHAR           TIMESTAMP       OTHER       UNDEFINED
TINYINT     REAL       VARCHAR        BINARY          BLOB        NVARCHAR
SMALLINT    DOUBLE     LONGVARCHAR    VARBINARY       CLOB        NCHAR
INTEGER     NUMERIC    DATE           LONGVARBINARY   BOOLEAN     NCLOB
BIGINT      DECIMAL    TIME           NULL            CURSOR
```

### Mybatis中javaType和jdbcType对应和CRUD例子

```
<resultMap type="java.util.Map" id="resultjcm">
  <result property="FLD_NUMBER" column="FLD_NUMBER"  javaType="double" jdbcType="NUMERIC"/>
  <result property="FLD_VARCHAR" column="FLD_VARCHAR" javaType="string" jdbcType="VARCHAR"/>
  <result property="FLD_DATE" column="FLD_DATE" javaType="java.sql.Date" jdbcType="DATE"/>
  <result property="FLD_INTEGER" column="FLD_INTEGER"  javaType="int" jdbcType="INTEGER"/>
  <result property="FLD_DOUBLE" column="FLD_DOUBLE"  javaType="double" jdbcType="DOUBLE"/>
  <result property="FLD_LONG" column="FLD_LONG"  javaType="long" jdbcType="INTEGER"/>
  <result property="FLD_CHAR" column="FLD_CHAR"  javaType="string" jdbcType="CHAR"/>
  <result property="FLD_BLOB" column="FLD_BLOB"  javaType="[B" jdbcType="BLOB" />
  <result property="FLD_CLOB" column="FLD_CLOB"  javaType="string" jdbcType="CLOB"/>
  <result property="FLD_FLOAT" column="FLD_FLOAT"  javaType="float" jdbcType="FLOAT"/>
  <result property="FLD_TIMESTAMP" column="FLD_TIMESTAMP"  javaType="java.sql.Timestamp" jdbcType="TIMESTAMP"/>
 </resultMap>
```

### Mybatis中javaType和jdbcType对应关系

```
JDBC Type			Java Type
CHAR				String
VARCHAR				String
LONGVARCHAR			String
NUMERIC				java.math.BigDecimal
DECIMAL				java.math.BigDecimal
BIT				    boolean
BOOLEAN				boolean
TINYINT				byte
SMALLINT			short
INTEGER				int
BIGINT				long
REAL				float
FLOAT				double
DOUBLE				double
BINARY				byte[]
VARBINARY			byte[]
LONGVARBINARY		byte[]
DATE				java.sql.Date
TIME				java.sql.Time
TIMESTAMP			java.sql.Timestamp
CLOB				Clob
BLOB				Blob
ARRAY				Array
DISTINCT			mapping of underlying type
STRUCT				Struct
REF	                        Ref
DATALINK			java.net.URL[color=red][/color]
```