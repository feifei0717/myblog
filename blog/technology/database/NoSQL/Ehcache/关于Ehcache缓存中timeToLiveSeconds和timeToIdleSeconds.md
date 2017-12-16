  闲来无事测试了下Ehcache与MemCache比较，在此发现了Ehcache中一个小细节问题，以前未用心去注意过，在此特记录一下，同时也望能给需要的道友留下些益处：

其中主要记录的是timeToLiveSeconds和timeToIdleSeconds；因为此俩容易搞混淆：

timeToLiveSeconds=x：缓存自创建日期起至失效时的间隔时间x；

timeToIdleSeconds=y：缓存创建以后，最后一次访问缓存的日期至失效之时的时间间隔y；

如果仅有 timeToLiveSeconds 那么 自创建时间开始 间隔x后缓存失效；

如果没有timeToLiveSeconds 那么自最后一次访问缓存 间隔y后 缓存失效；

如果既有timeToLiveSeconds 也有 timeToIdleSeconds 那么取最小数算作间隔时间；min(x,y);； 经过测试其计算原则是：若自创建缓存后一直都没有访问缓存，那么间隔x后失效，若自创建缓存后有N次访问缓存，那么计算（最后一次访问缓存时间+y ） 即：按照timeToIdleSeconds计算，但总存活时间不超过 y;举个例子：

timeToIdleSeconds=120；

timeToLiveSeconds=180；

上面的表示此缓存最多可以存活3分钟，如果期间超过2分钟未访问 那么此缓存失效！

来源： <[http://blog.csdn.net/vtopqx/article/details/8522333](http://blog.csdn.net/vtopqx/article/details/8522333)>

 