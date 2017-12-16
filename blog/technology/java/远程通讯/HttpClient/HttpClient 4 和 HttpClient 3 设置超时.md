# [HttpClient 4 和 HttpClient 3 设置超时](http://www.cnblogs.com/hemingwang0902/archive/2012/05/28/2522185.html)

### HttpClient 4：

**连接超时：**

```
httpclient.getParams().setParameter(CoreConnectionPNames.CONNECTION_TIMEOUT,60000);
// 或者
HttpConnectionParams.setConnectionTimeout(params, 6000);
```

**读取超时：**

```
httpclient.getParams().setParameter(CoreConnectionPNames.SO_TIMEOUT,60000);
// 或者
HttpConnectionParams.setSoTimeout(params, 60000);
```



### HttpClient 3：

**连接超时：**

```
httpClient.getHttpConnectionManager().getParams().setConnectionTimeout(60000);
```

**读取超时：**

```
httpClient.getHttpConnectionManager().getParams().setSoTimeout(60000);
```





### 注意:

在Apache Http客户端的版本4.3中，重构了配置（再次）。 新方式如下代码：

```
RequestConfig requestConfig =RequestConfig.custom()
.setConnectTimeout(connectTimeout)
.setConnectionRequestTimeout(connectionRequestTimeout)
.setSocketTimeout(socketTimeout).build();
```

ConnectTimeout:是建立与服务器的连接之前的超时。

ConnectionRequestTimeout :在从连接管理器请求连接时使用。

SocketTimeout:读取超时数据超时。

来源： <http://www.cnblogs.com/hemingwang0902/archive/2012/05/28/2522185.html>