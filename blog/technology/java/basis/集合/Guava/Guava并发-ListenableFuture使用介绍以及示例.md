# Guava并发:ListenableFuture使用介绍以及示例

测试类:/Users/jerryye/backup/studio/AvailableCode/basis/guava/guava_demo/src/main/java/com/gtt/concurrent/ListenableFutureTest.java

ListenableFuture顾名思义就是可以监听的Future，它是对java原生Future的扩展增强，本文介绍ListenableFuture的用法和扩展实现

[Guava](http://outofmemory.cn/tag/Guava) [并发](http://outofmemory.cn/tag/%E5%B9%B6%E5%8F%91) [Java](http://outofmemory.cn/tag/Java)

ListenableFuture顾名思义就是可以监听的Future，它是对java原生Future的扩展增强。我们知道Future表示一个异步计算任务，当任务完成时可以得到计算结果。如果我们希望一旦计算完成就拿到结果展示给用户或者做另外的计算，就必须使用另一个线程不断的查询计算状态。这样做，代码复杂，而且效率低下。使用ListenableFuture Guava帮我们检测Future是否完成了，如果完成就自动调用回调函数，这样可以减少并发程序的复杂度。

ListenableFuture是一个接口，它从jdk的Future接口继承，添加了`void addListener(Runnable listener, Executor executor)`方法。

我们看下如何使用ListenableFuture。首先需要定义ListenableFuture的实例。

```java
        ListeningExecutorService executorService = MoreExecutors.listeningDecorator(Executors.newCachedThreadPool());
        // 执行任务
        final ListenableFuture<Integer> listenableFuture = executorService.submit(new Callable<Integer>() {
            @Override
            public Integer call() throws Exception {
                System.out.println("call execute..");
                TimeUnit.SECONDS.sleep(1);
                return 7;
            }
        });
```

首先通过MoreExecutors类的静态方法listeningDecorator方法初始化一个ListeningExecutorService的方法，然后使用此实例的submit方法即可初始化ListenableFuture对象。

我们上文中定义的ListenableFuture要做的工作，在Callable接口的实现类中定义，这里只是休眠了1秒钟然后返回一个数字7.

有了ListenableFuture实例，有两种方法可以执行此Future并执行Future完成之后的回调函数。

方法一：通过ListenableFuture的addListener方法

```java
        //方法一：通过ListenableFuture的addListener方法
        listenableFuture.addListener(new Runnable() {
            @Override
            public void run() {
                try {
                    System.out.println("get listenable future's result " + listenableFuture.get());
                } catch (InterruptedException e) {
                    e.printStackTrace();
                } catch (ExecutionException e) {
                    e.printStackTrace();
                }
            }
        }, executorService);
```

方法二：通过Futures的静态方法addCallback给ListenableFuture添加回调函数

```java
        //方法二：通过Futures的静态方法addCallback给ListenableFuture添加回调函数
        Futures.addCallback(listenableFuture, new FutureCallback<Integer>() {
            @Override
            public void onSuccess(Integer result) {
                System.out.println("get listenable future's result with callback " + result);
            }

            @Override
            public void onFailure(Throwable t) {
                t.printStackTrace();
            }
        });
```

推荐使用第二种方法，因为第二种方法可以直接得到Future的返回值，或者处理错误情况。本质上第二种方法是通过调动第一种方法实现的，做了进一步的封装。

另外ListenableFuture还有其他几种内置实现：

1. SettableFuture：不需要实现一个方法来计算返回值，而只需要返回一个固定值来做为返回值，可以通过程序设置此Future的返回值或者异常信息
2. CheckedFuture： 这是一个继承自ListenableFuture接口，他提供了checkedGet()方法，此方法在Future执行发生异常时，可以抛出指定类型的异常。



http://outofmemory.cn/java/guava/concurrent/ListenableFuture