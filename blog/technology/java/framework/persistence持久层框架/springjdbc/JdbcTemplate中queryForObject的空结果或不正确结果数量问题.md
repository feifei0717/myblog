 在使用Spring提供的JdbcTemplate中名为queryForObject API进行数据库查询时有时会抛出如下异常提示息，org.springframework.dao.EmptyResultDataAccessException: Incorrect result size: expected 1, actual 0 或者 org.springframework.dao.IncorrectResultSizeDataAccessException: Incorrect result size: expected 1, actual 2 

在解决这些异常之前，我们首先来看看queryForObject API的源代码，假设我们调用的是queryForObjec(String sql, Class requiredType)。 



JdbcTemplate.class 

```
public <T> T queryForObject(String sql, Class<T> requiredType)   
        throws DataAccessException   
{return queryForObject(sql, getSingleColumnRowMapper(requiredType));}  
  
public <T> T queryForObject(String sql, RowMapper<T> rowMapper)   
        throws DataAccessException {  
    List<T> results = query(sql, rowMapper);  
    return DataAccessUtils.requiredSingleResult(results);  
}  
  
public <T> List<T> query(String sql, RowMapper<T> rowMapper)   
        throws DataAccessException {  
    return query(sql, new RowMapperResultSetExtractor<T>(rowMapper));  
}  
  
public <T> T query(final String sql, final ResultSetExtractor<T> rse)   
        throws DataAccessException {  
    Assert.notNull(sql, "SQL must not be null");  
    Assert.notNull(rse, "ResultSetExtractor must not be null");  
    if (logger.isDebugEnabled()) {  
        logger.debug("Executing SQL query [" + sql + "]");  
    }  
    class QueryStatementCallback implements StatementCallback<T>, SqlProvider {  
        public T doInStatement(Statement stmt) throws SQLException {  
            ResultSet rs = null;  
            try {  
                rs = stmt.executeQuery(sql);  
                ResultSet rsToUse = rs;  
                if (nativeJdbcExtractor != null) {  
                    rsToUse = nativeJdbcExtractor.getNativeResultSet(rs);  
                }  
                return rse.extractData(rsToUse);  
            }  
            finally {  
                JdbcUtils.closeResultSet(rs);  
            }  
        }  
        public String getSql() {  
            return sql;  
        }  
    }  
    return execute(new QueryStatementCallback());  
}  
```

DataAccessUtils.class  

```
public static <T> T requiredSingleResult(Collection<T> results)   
        throws IncorrectResultSizeDataAccessException {  
    int size = (results != null ? results.size() : 0);  
    if (size == 0) {  
        throw new EmptyResultDataAccessException(1);  
    }  
    if (results.size() > 1) {  
        throw new IncorrectResultSizeDataAccessException(1, size);  
    }  
    return results.iterator().next();  
}  
```

通过阅读源代码，可以很清楚看到在DataAccessUtils.class中requiredSingleResult方法中，当结果集合的size为0或者大于1时，就会抛出以上两个异常。 

为了避免出现以上的异常，最好还是使用queryForList API，即使返回的结果集合的size为0，即Zero Row，也不会抛出异常。如果size不为0，即可以使用get(0)取得第一个查询对象。 

来源： <http://edisonlv2010.iteye.com/blog/1893362>