缓存的使用有多种方式，可以使用开源的缓存框架，如ehcache，JCS，cache4j等。Guava也帮我们实现了一个小巧而实用的缓存框架。
如果不使用缓存框架，自己实现缓存，很多人首先想到的就是声明一个static的map对象。
Guava的缓存框架其实就是这么做的，所有理解起来非常容易。

### **1.    使用CacheLoader构造LoadingCache**

CacheLoader有个抽象方法load，表示怎样得到一个key对应的value，使用cacheloader就可以构造LoadingCache对象。

构造的loadingCache对象此时并没有缓存任何对象，当调用loadingCache.get(K k)或者loadingCache. getAll(Iterable<? extends K> keys)时，如果key在缓存中还没有被load，则会调用load的实现来把数据加载到缓存中并返回，下次再调用get时就直接从缓存获取数据。

LoadingCache<Key, Graph> graphs = CacheBuilder.newBuilder()

​       .maximumSize(1000)

​       .build(

​           new CacheLoader<Key, Graph>() {

​             public Graph load(Key key) throws AnyException {

​               return createExpensiveGraph(key);

​             }

​           });

...

try {

  return graphs.get(key);

} catch (ExecutionException e) {

  throw new OtherException(e.getCause());

}

LoadingCache中还有几个方法可以介绍下：

getUnchecked(K key)：跟get一样，只是get方法如果有未捕获的受检异常，则会抛出ExecutionException，而getUnchecked所有受检异常都会转换为UncheckedExecutionException。

refresh (K key)：重新加载key的数据，一般建议异步调用该方法。在新数据获取之前，老的数据依然可用。

ConcurrentMap<K, V> asMap()：将所有已缓存的数据已map的方式返回。要主动修改缓存的数据，可以调用父类Cache的put方法。

### **2.    使用Callable**

也可以在构造cache的时候不指定数据获取的方法，而是在cache的get方法中指定。这样做的好处是数据获取的方式可以随时指定。

Cache<Key, Value> cache = CacheBuilder.newBuilder()

​    .maximumSize(1000)

​    .build(); // look Ma, no CacheLoader

...

try {

  // If the key wasn't in the "easy to compute" group, we need to

  // do things the hard way.

  cache.get(key, new Callable<Value>() {

​    @Override

​    public Value call() throws AnyException {

​      return doThingsTheHardWay(key);

​    }

  });

} catch (ExecutionException e) {

  throw new OtherException(e.getCause());

}

### **3. 缓存失效策略：**

1.    基于大小的策略：

CacheBuilder.newBuilder().maximumSize(long)可以直接指定缓存最大容纳的大小。

如果缓存存储的对象各不相同，或者想自定义尺寸的计算方法，可以使用weigher方法指定计算大小的方法，maximumWeight指定缓存最多可以存放多大的对象。

如果要规定缓存项的数目不超过固定值，只需使用CacheBuilder.maximumSize(long)。缓存将尝试回收最近没有使用或总体上很少使用的缓存项。——警告：在缓存项的数目达到限定值之前，缓存就可能进行回收操作——通常来说，这种情况发生在缓存项的数目逼近限定值时。

 

另外，不同的缓存项有不同的“权重”（weights）——例如，如果你的缓存值，占据完全不同的内存空间，你可以使用CacheBuilder.weigher(Weigher)指定一个权重函数，并且用CacheBuilder.maximumWeight(long)指定最大总重。在权重限定场景中，除了要注意回收也是在重量逼近限定值时就进行了，还要知道重量是在缓存创建时计算的，因此要考虑重量计算的复杂度。

 

```
LoadingCache<Key, Graph> graphs = CacheBuilder.newBuilder()        .maximumWeight(100000)        .weigher(new Weigher<Key, Graph>() {            public int weigh(Key k, Graph g) {                return g.vertices().size();            }        })        .build(            new CacheLoader<Key, Graph>() {                public Graph load(Key key) { // no checked exception                    return createExpensiveGraph(key);                }            });
```

2.    基于时间的策略：
expireAfterAccess(long, TimeUnit) 最后一次访问（读或者写）超过一定时间后失效。
expireAfterWrite(long, TimeUnit) 最后一次写（或者对象生成）超过一定时间后失效。
时间程序的一大难题是测试难，guava很贴心的提供了一个方法public CacheBuilder<K,V> ticker(Ticker ticker)，可以设置记录创建的时间，而不是使用系统时间，这样测试起来更方便了。
3.    基于引用的策略：
CacheBuilder.weakKeys() 和CacheBuilder.weakValues() ，使用弱引用来存储key或者value，这样，当没有其他对象强引用及软引用该对象时，会被gc掉。
CacheBuilder.softValues()，使用软引用来存储value，当jvm内存不够时且没有其他的直接引用时，会被gc掉。这个功能其实用 maximum cache size更可控一些。
注意：使用引用的失效策略后，key或者value的比较需要用==，而不是equals方法。

### **4.手动让数据过期：**

Cache.invalidate(key)

Cache.invalidateAll(keys)

Cache.invalidateAll()

 

### **5.添加数据移除事件监听**

还可以使用方法CacheBuilder.removalListener(RemovalListener)监听数据移除事件， RemovalListener接收参数RemovalNotification，包含了移除的key，value及原因RemovalCause。监听到事件后，可以做些资源回收的事情，如关闭文件，关闭数据库连接等。

回收原因分为：

(1)    EXPLICIT 手动回收

(2)    REPLACED被替换，如put，refresh

(3)    COLLECTED 被gc（软引用，弱引用）

(4)    EXPIRED 过期

(5)    SIZE 超过大小

需要注意，removalListener默认是同步执行的，如果希望异步执行回调，可以传入Excutor来异步执行RemovalListeners.asynchronous(RemovalListener, Executor) 

### **6.关于数据清除：**

Guava提供的cache从来不会主动清理数据，哪怕里面的对象已经过期，这样做主要有2点考虑：

（1）    数据清理会和正常的数据读写发生资源竞争

（2）    数据清理肯定需要一个异步线程定时执行，有些环境是不允许建立新的线程，这样会导致cachebuilder都无法使用了。

所以，如果需要做数据清理（其实肯定是必须的），我们可以使用ScheduledExecutorService.定时调用Cache.cleanUp()方法来完成。

### **7.定时自动Refresh缓存数据：**

CacheLoader还有个接口，用于定义自动refresh缓存的值。Builer可以设置refreshAfterWrite，这样写操作过后，会自动调用CacheLoader里面的实现来更新数据，如果更新数据很耗时，建议采用异步的方式完成。但是要注意，实际的更新操作一定要等到读取数据的时候才会发生。

// Some keys don't need refreshing, and we want refreshes to be done asynchronously.

LoadingCache<Key, Graph> graphs = CacheBuilder.newBuilder()

​       .maximumSize(1000)

​       .refreshAfterWrite(1, TimeUnit.MINUTES)

​       .build(

​           new CacheLoader<Key, Graph>() {

​             public Graph load(Key key) { // no checked exception

​               return getGraphFromDatabase(key);

​             }

​             public ListenableFuture<Graph> reload(final Key key, Graph prevGraph) {

​               if (neverNeedsRefresh(key)) {

​                 return Futures.immediateFuture(prevGraph);

​               } else {

​                 // asynchronous!

​                 ListenableFutureTask<Graph> task = ListenableFutureTask.create(new Callable<Graph>() {

​                   public Graph call() {

​                     return getGraphFromDatabase(key);

​                   }

​                 });

​                 executor.execute(task);

​                 return task;

​               }

​             }

​           });

### **8.缓存效果分析：**

如果需要统计缓存的命中率等，可以使用 CacheBuilder.recordStats()打开统计开关。这样 Cache.stats() 返回的 CacheStats就可以统计到：

hitRate() 命中率

averageLoadPenalty() 平均数据加载时间

evictionCount() 失效数量

### **9.关于asMap：**

asMap().get(key) 和cache.getIfPresent(key)一样可以得到缓存对象的值，但是与cache.getIfPresent(key)不同，asMap().get(key) 不会触发数据load。

asMap().get(Object) and asMap().put(K, V) 都会导致数据访问时间被更新。但是asMap().containsKey和cache.entrySet()都不会。

来源： <http://leadtoit.iteye.com/blog/1961739>