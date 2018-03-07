[TOC]



# 阿里连接池Druid源码中的部分配置研究

## **Druid是一个JDBC组件，它包括三部分：**

- DruidDriver 代理Driver，能够提供基于Filter－Chain模式的插件体系。
- DruidDataSource 高效可管理的数据库连接池。
- SQLParser

## **常见配置说明**

| 配置                                       | 默认值                           | 说明                                       |
| ---------------------------------------- | ----------------------------- | ---------------------------------------- |
| name                                     |                               | 配置这个属性的意义在于，如果存在多个数据源，监控的时候可以通过名字来区分开来。如果没有配置，将会生成一个名字，格式是：”DataSource-” + System.identityHashCode(this) |
| jdbcUrl                                  |                               | 连接数据库的url，不同数据库不一样。例如：mysql : jdbc:mysql://10.20.153.104:3306/druid2oracle : jdbc:oracle:thin:@10.20.149.85:1521:ocnauto |
| username                                 |                               | 连接数据库的用户名                                |
| password                                 |                               | 连接数据库的密码。如果你不希望密码直接写在配置文件中，可以使用ConfigFilter。详细看这里：https://github.com/alibaba/druid/wiki/%E4%BD%BF%E7%94%A8ConfigFilter |
| driverClassName                          | 根据url自动识别                     | 这一项可配可不配，如果不配置druid会根据url自动识别dbType，然后选择相应的driverClassName |
| initialSize                              | 0                             | 初始化时建立物理连接的个数。初始化发生在显示调用init方法，或者第一次getConnection时 |
| maxActive                                | 8                             | 连接池中最大连接数量                               |
| maxIdle                                  | 8                             | 连接池中最大连接数量，已经不再使用，配置了也没效果                |
| minIdle                                  | 0                             | 连接池中最小连接数量                               |
| maxWait                                  | -1                            | 获取连接时最大等待时间，单位毫秒。配置了maxWait之后，缺省启用公平锁，并发效率会有所下降，如果需要可以通过配置useUnfairLock属性为true使用非公平锁。 |
| poolPreparedStatements                   | false                         | 是否缓存preparedStatement，也就是PSCache。PSCache对支持游标的数据库性能提升巨大，比如说oracle。在mysql5.5以下的版本中没有PSCache功能，建议关闭掉。5.5及以上版本有PSCache，建议开启。 |
| maxOpenPreparedStatements                | -1                            | 要启用PSCache，必须配置大于0，当大于0时，poolPreparedStatements自动触发修改为true。在Druid中，不会存在Oracle下PSCache占用内存过多的问题，可以把这个数值配置大一些，比如说100 |
| maxPoolPreparedStatementsPerConnectionSize | 10                            | 为每个连接缓存的preparedStatement的最大数量           |
| validationQuery                          | null                          | 用来检测连接是否有效的sql，要求是一个查询语句。如果validationQuery为null，testOnBorrow、testOnReturn、testWhileIdle都不会起作用 |
| validationQueryTimeout                   | -1                            | 执行validationQuery的超时时间                   |
| testOnBorrow                             | false                         | 申请连接时执行validationQuery检测连接是否有效，做了这个配置会降低性能 |
| testOnReturn                             | false                         | 归还连接时执行validationQuery检测连接是否有效，做了这个配置会降低性能 |
| testWhileIdle                            | true                          | 建议配置为true，不影响性能，并且保证安全性。申请连接的时候检测，如果空闲时间大于timeBetweenEvictionRunsMillis，执行validationQuery检测连接是否有效。 |
| timeBetweenEvictionRunsMillis            | -1L（最新版本1.0.17中已改为60 * 1000L） | 有两个含义：1) Destroy线程检测连接的间隔时间，此时如果未配置，则间隔1000毫秒2) testWhileIdle的判断依据，详细看testWhileIdle属性的说明 |
| minEvictableIdleTimeMillis               | 1000L * 60L * 30L             | 空闲连接回收的最小空闲时间                            |
| numTestsPerEvictionRun                   | 3                             | 不再使用，一个DruidDataSource只支持一个EvictionRun   |
| connectionInitSqls                       |                               | 物理连接初始化的时候执行的sql                         |
| exceptionSorter                          | null，根据dbType自动识别             | 当数据库抛出一些不可恢复的异常时，抛弃连接                    |
| filters                                  |                               | 属性类型是字符串，通过别名的方式配置扩展插件，常用的插件有：监控统计用的filter:stat日志用的filter:log4j防御sql注入的filter:wall |
| proxyFilters                             |                               | 类型是List<com.alibaba.druid.filter.Filter>，如果同时配置了filters和proxyFilters，是组合关系，并非替换关系 |
| removeAbandoned                          | false                         | 是否强制关闭连接时长大于removeAbandonedTimeoutMillis的连接 |
| removeAbandonedTimeoutMillis             | 300 * 1000                    | 一个连接从被连接到被关闭之间的最大生命周期                    |
| logAbandoned                             | false                         | 强制关闭连接时是否记录日志                            |
| queryTimeout                             |                               | 执行查询的超时时间(秒)，执行Statement对象时如果超过此时间，则抛出SQLException |
| transactionQueryTimeout                  |                               | 执行一个事务的超时时间(秒)，执行Statement对象 时判断是否为事务，如果是且此项未设置，则使用queryTimeout |

## **部分配置项生效过程理解**

配置项中指定了各个参数后，在连接池内部是这么使用这些参数的。数据库连接池在初始化的时候会创建initialSize个连接，当有数据库操作时，会从池中取出一个连接。如果当前池中正在使用的连接数等于maxActive，则会等待一段时间，等待其他操作释放掉某一个连接，如果这个等待时间超过了maxWait，则会报错；如果当前正在使用的连接数没有达到maxActive，则判断当前是否有空闲连接，如果有则直接使用空闲连接，如果没有则新建立一个连接。在连接使用完毕后，不是将其物理连接关闭，而是将其放入池中等待其他操作复用。

```java
    public DruidPooledConnection getConnection(long maxWaitMillis) throws SQLException {
        init();

        if (filters.size() > 0) {
            FilterChainImpl filterChain = new FilterChainImpl(this);
            return filterChain.dataSource_connect(this, maxWaitMillis);
        } else {
            return getConnectionDirect(maxWaitMillis);
        }
    }

    public DruidPooledConnection getConnectionDirect(long maxWaitMillis) throws SQLException {
        int notFullTimeoutRetryCnt = 0;
        for (;;) {
            // handle notFullTimeoutRetry
            DruidPooledConnection poolableConnection;
            try {
                poolableConnection = getConnectionInternal(maxWaitMillis);
            } catch (GetConnectionTimeoutException ex) {
                if (notFullTimeoutRetryCnt <= this.notFullTimeoutRetryCount && !isFull()) {
                    notFullTimeoutRetryCnt++;
                    if (LOG.isWarnEnabled()) {
                        LOG.warn("not full timeout retry : " + notFullTimeoutRetryCnt);
                    }
                    continue;
                }
                throw ex;
            }

            if (isTestOnBorrow()) {
                boolean validate = testConnectionInternal(poolableConnection.getConnection());
                if (!validate) {
                    if (LOG.isDebugEnabled()) {
                        LOG.debug("skip not validate connection.");
                    }

                    Connection realConnection = poolableConnection.getConnection();
                    discardConnection(realConnection);
                    continue;
                }
            } else {
                Connection realConnection = poolableConnection.getConnection();
                if (realConnection.isClosed()) {
                    discardConnection(null); // 传入null，避免重复关闭
                    continue;
                }

                if (isTestWhileIdle()) {
                    final long currentTimeMillis = System.currentTimeMillis();
                    final long lastActiveTimeMillis = poolableConnection.getConnectionHolder().getLastActiveTimeMillis();
                    final long idleMillis = currentTimeMillis - lastActiveTimeMillis;
                    long timeBetweenEvictionRunsMillis = this.getTimeBetweenEvictionRunsMillis();
                    if (timeBetweenEvictionRunsMillis <= 0) {
                        timeBetweenEvictionRunsMillis = DEFAULT_TIME_BETWEEN_EVICTION_RUNS_MILLIS;
                    }

                    if (idleMillis >= timeBetweenEvictionRunsMillis) {
                        boolean validate = testConnectionInternal(poolableConnection.getConnection());
                        if (!validate) {
                            if (LOG.isDebugEnabled()) {
                                LOG.debug("skip not validate connection.");
                            }

                            discardConnection(realConnection);
                            continue;
                        }
                    }
                }
            }
            ……

            return poolableConnection;
        }
    }

```

同时连接池内部有机制判断，如果当前的总的连接数少于minIdle，则会建立新的空闲连接，以保证连接数达到minIdle。以上源码可以看出，当testWhileIdle参数为true时，在获取连接时将对得到的连接进行检测，如果空闲时间大于timeBetweenEvictionRunsMillis，则执行validationQuery验证连接是否有效。

```java
    public class DestroyConnectionThread extends Thread {
        public DestroyConnectionThread(String name){
            super(name);
            this.setDaemon(true);
        }

        public void run() {
            initedLatch.countDown();

            for (;;) {
                // 从前面开始删除
                try {
                    if (closed) {
                        break;
                    }

                    if (timeBetweenEvictionRunsMillis > 0) {
                        Thread.sleep(timeBetweenEvictionRunsMillis);
                    } else {
                        Thread.sleep(1000); //
                    }

                    if (Thread.interrupted()) {
                        break;
                    }

                    destroyTask.run();
                } catch (InterruptedException e) {
                    break;
                }
            }
        }

    }

    public class DestroyTask implements Runnable {
        @Override
        public void run() {
            shrink(true);

            if (isRemoveAbandoned()) {
                removeAbandoned();
            }
        }

    }

    public void shrink(boolean checkTime) {
        final List evictList = new ArrayList();
        try {
            lock.lockInterruptibly();
        } catch (InterruptedException e) {
            return;
        }

        try {
            final int checkCount = poolingCount - minIdle;
            final long currentTimeMillis = System.currentTimeMillis();
            for (int i = 0; i < checkCount; ++i) {
                DruidConnectionHolder connection = connections[i];

                long phyConnectTimeMillis = connection.getTimeMillis() - currentTimeMillis;//physical connection connected time
                if( phyConnectTimeMillis  > phyTimeoutMillis  ){
                    evictList.add(connection);//if physical connection connected greater than phyTimeoutMillis, close the connection, for mysql 8 hours timeout
                    continue;
                }

                if (checkTime) {
                    long idleMillis = currentTimeMillis - connection.getLastActiveTimeMillis();
                    if (idleMillis >= minEvictableIdleTimeMillis) {
                        evictList.add(connection);
                    } else {
                        break;
                    }
                } else {
                    evictList.add(connection);
                }
            }

            int removeCount = evictList.size();
            if (removeCount > 0) {
                System.arraycopy(connections, removeCount, connections, 0, poolingCount - removeCount);
                Arrays.fill(connections, poolingCount - removeCount, poolingCount, null);
                poolingCount -= removeCount;
            }
        } finally {
            lock.unlock();
        }

        for (DruidConnectionHolder item : evictList) {
            Connection connection = item.getConnection();
            JdbcUtils.close(connection);
            destroyCount.incrementAndGet();
        }
    }

    public int removeAbandoned() {
        int removeCount = 0;

        long currrentNanos = System.nanoTime();

        List abandonedList = new ArrayList();

        synchronized (activeConnections) {
            Iterator iter = activeConnections.keySet().iterator();

            for (; iter.hasNext();) {
                DruidPooledConnection pooledConnection = iter.next();

                if (pooledConnection.isRunning()) {
                    continue;
                }

                long timeMillis = (currrentNanos - pooledConnection.getConnectedTimeNano()) / (1000 * 1000);

                if (timeMillis >= removeAbandonedTimeoutMillis) {
                    iter.remove();
                    pooledConnection.setTraceEnable(false);
                    abandonedList.add(pooledConnection);
                }
            }
        }

        if (abandonedList.size() > 0) {
            for (DruidPooledConnection pooledConnection : abandonedList) {
                synchronized (pooledConnection) {
                    if (pooledConnection.isDisable()) {
                        continue;
                    }
                }
                
                JdbcUtils.close(pooledConnection);
                pooledConnection.abandond();
                removeAbandonedCount++;
                removeCount++;

                if (isLogAbandoned()) {
                    StringBuilder buf = new StringBuilder();
                    buf.append("abandon connection, owner thread: ");
                    buf.append(pooledConnection.getOwnerThread().getName());
                    buf.append(", connected at : ");
                    buf.append(pooledConnection.getConnectedTimeMillis());
                    buf.append(", open stackTrace\n");

                    StackTraceElement[] trace = pooledConnection.getConnectStackTrace();
                    for (int i = 0; i < trace.length; i++) {
                        buf.append("\tat ");
                        buf.append(trace[i].toString());
                        buf.append("\n");
                    }

                    buf.append("ownerThread current state is "+pooledConnection.getOwnerThread().getState() + ", current stackTrace\n");
                    trace = pooledConnection.getOwnerThread().getStackTrace();
                    for (int i = 0; i < trace.length; i++) {
                        buf.append("\tat ");
                        buf.append(trace[i].toString());
                        buf.append("\n");
                    }

                    LOG.error(buf.toString());
                }
            }
        }

        return removeCount;
    }

```

以上源码可以看出每隔timeBetweenEvictionRunsMillis进行一次shrink（连接池大小收缩）检测，如果当前连接池中的连接数量大于minIdle，则对超出minIdle的较早的连接进行空闲时间检测，如果某个连接在空闲了minEvictableIdleTimeMillis时间后仍然没有使用，则被物理性的关闭掉。除了定时检测空闲连接以外，Druid还有一个removeAbandoned机制，如果removeAbandoned为true，则在执行shrink后执行removeAbandoned()，如果某个连接从被连接到当前时间超过removeAbandonedTimeoutMillis，则无论是否被使用都被强制物理性的关闭掉，同时将该连接的abandoned设置为true。

```java
    public int getTransactionQueryTimeout() {
        if (transactionQueryTimeout <= 0) {
            return queryTimeout;
        }

        return transactionQueryTimeout;
    }

    public void setTransactionQueryTimeout(int transactionQueryTimeout) {
        this.transactionQueryTimeout = transactionQueryTimeout;
    }

    /**
     * Retrieves the number of seconds the driver will wait for a Statement object to execute. If the limit
     * is exceeded, a SQLException is thrown.
     * 
     * @return the current query timeout limit in seconds; zero means there is no limit
     * @exception SQLException if a database access error occurs or this method is called on a closed
     * Statement
     * @see #setQueryTimeout
     */
    public int getQueryTimeout() {
        return queryTimeout;
    }

    /**
     * Sets the number of seconds the driver will wait for a Statement object to execute to the given
     * number of seconds. If the limit is exceeded, an SQLException is thrown. A JDBC driver must apply
     * this limit to the execute, executeQuery and executeUpdate methods. JDBC
     * driver implementations may also apply this limit to ResultSet methods (consult your driver vendor
     * documentation for details).
     * 
     * @param seconds the new query timeout limit in seconds; zero means there is no limit
     * @exception SQLException if a database access error occurs, this method is called on a closed
     * Statement or the condition seconds >= 0 is not satisfied
     * @see #getQueryTimeout
     */
    public void setQueryTimeout(int seconds) {
        this.queryTimeout = seconds;
    }

    void initStatement(DruidPooledConnection conn, Statement stmt) throws SQLException {
        boolean transaction = !conn.getConnectionHolder().isUnderlyingAutoCommit();

        int queryTimeout = transaction ? getTransactionQueryTimeout() : getQueryTimeout();

        if (queryTimeout > 0) {
            stmt.setQueryTimeout(queryTimeout);
        }
    }

```

以上源码中可以看出在初始化Statement对象时，会设置其queryTimeout，如果conn开启了事务，则使用transactionQueryTimeout，没开启就直接用queryTimeout。使用transactionQueryTimeout的时候，如果该项没有设置，依然直接使用queryTimeout。此参数的作用是执行Statement对象时如果超过此时间，就抛出SQLException。

有些数据库连接的时候有超时限制（mysql连接在8小时后断开），或者由于网络中断等原因，连接池的连接会出现失效的情况，这时候设置一个testWhileIdle参数为true，可以保证连接池内部定时检测连接的可用性，不可用的连接会被抛弃或者重建，最大情况的保证从连接池中得到的Connection对象是可用的。当然，为了保证绝对的可用性，你也可以使用testOnBorrow为true（即在获取Connection对象时检测其可用性），不过这样会影响性能。

来源： [https://www.techzero.cn/alibaba-druid-datasource-source-study-part-of-properties.html](https://www.techzero.cn/alibaba-druid-datasource-source-study-part-of-properties.html)