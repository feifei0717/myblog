# [SynchronousQueue、LinkedBlockingQueue、ArrayBlockingQueue性能测试(转)](http://www.cnblogs.com/softidea/p/5174151.html)

我这边自己测试下来，结果差别不大。





听说JDK6对SynchronousQueue做了性能优化，避免对竞争资源加锁，所以想试试到底平时是选择SynchronousQueue还是其他BlockingQueue。

 

对于容器类在并发环境下的比较，一是是否线程安全，二是并发性能如何。BlockingQueue的实现都是线程安全的，所以只能比比它们的并发性能了。在不同的应用场景中，对容器的使用情况不同，有的读取操作多修改写入操作少，有的修改写入操作多，这对容器的性能会造成不同的影响。但对于Queue的使用，个人认为是比较一致的，简单点就是put和get，不会修改某个元素的内容再被读取，也很少只读取的操作，那是不是有最佳实践了?

 

代码比较长，我还是放在后面，先说结论。没有想到的是LinkedBlockingQueue性能表现远超ArrayBlcokingQueue，不管线程多少，不管Queue长短，LinkedBlockingQueue都胜过ArrayBlockingQueue。SynchronousQueue表现很稳定，而且在20个线程之内不管Queue长短，SynchronousQueue性能表现是最好的，（其实SynchronousQueue跟Queue长短没有关系），如果Queue的capability只能是1，那么毫无疑问选择SynchronousQueue，这也是设计SynchronousQueue的目的吧。但大家也可以看到当超过1000个线程时，SynchronousQueue性能就直线下降了，只有最高峰的一半左右，而且当Queue大于30时，LinkedBlockingQueue性能就超过SynchronousQueue。

 

**结论：**

- 线程多（>20），Queue长度长（>30），使用LinkedBlockingQueue
- 线程少 (<20) ，Queue长度短 (<30) , 使用SynchronousQueue

**当然，使用SynchronousQueue的时候不要忘记应用的扩展，如果将来需要进行扩展还是选择LinkedBlockingQueue好，尽量把SynchronousQueue限制在特殊场景中使用。**

- 少用ArrayBlcokingQueue，似乎没找到它的好处，高手给给建议吧！

最后看看测试代码和结果：（Win7 64bit + JDK7 + CPU4 + 4GB)

```
import java.util.concurrent.ArrayBlockingQueue;
import java.util.concurrent.BlockingQueue;
import java.util.concurrent.Callable;
import java.util.concurrent.CompletionService;
import java.util.concurrent.ExecutorCompletionService;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.LinkedBlockingQueue;
import java.util.concurrent.SynchronousQueue;
public class TestSynchronousQueue {
    private static int THREAD_NUM;
    private static int N = 1000000;
    private static ExecutorService executor;
    public static void main(String[] args) throws Exception {                    
        System.out.println("Producer\tConsumer\tcapacity \t LinkedBlockingQueue \t ArrayBlockingQueue \t SynchronousQueue");
                            
        for(int j = 0; j<10; j++){
            THREAD_NUM = (int) Math.pow(2, j);
            executor = Executors.newFixedThreadPool(THREAD_NUM * 2);
                                
            for (int i = 0; i < 10; i++) {
                int length = (i == 0) ? 1 : i * 10;
                System.out.print(THREAD_NUM + "\t\t");
                System.out.print(THREAD_NUM + "\t\t");
                System.out.print(length + "\t\t");
                System.out.print(doTest2(new LinkedBlockingQueue<Integer>(length), N) + "/s\t\t\t");
                System.out.print(doTest2(new ArrayBlockingQueue<Integer>(length), N) + "/s\t\t\t");
                System.out.print(doTest2(new SynchronousQueue<Integer>(), N) + "/s");
                System.out.println();
            }
                                
            executor.shutdown();
        }
    }
                        
    private static class Producer implements Runnable{
        int n;
        BlockingQueue<Integer> q;
                            
        public Producer(int initN, BlockingQueue<Integer> initQ){
            n = initN;
            q = initQ;
        }
                            
        public void run() {
            for (int i = 0; i < n; i++)
                try {
                    q.put(i);
                } catch (InterruptedException ex) {
                }
        }
    }
                        
    private static class Consumer implements Callable<Long>{
        int n;
        BlockingQueue<Integer> q;
                            
        public Consumer(int initN, BlockingQueue<Integer> initQ){
            n = initN;
            q = initQ;
        }
                            
        public Long call() {
            long sum = 0;
            for (int i = 0; i < n; i++)
                try {
                    sum += q.take();
                } catch (InterruptedException ex) {
                }
            return sum;
        }
    }
                        
    private static long doTest2(final BlockingQueue<Integer> q, final int n)
            throws Exception {
        CompletionService<Long> completionServ = new ExecutorCompletionService<Long>(executor);
                            
        long t = System.nanoTime();
        for(int i=0; i<THREAD_NUM; i++){
            executor.submit(new Producer(n/THREAD_NUM, q));
        }    
        for(int i=0; i<THREAD_NUM; i++){
            completionServ.submit(new Consumer(n/THREAD_NUM, q));
        }
                            
        for(int i=0; i<THREAD_NUM; i++){
            completionServ.take().get();
        }    
                            
        t = System.nanoTime() - t;
        return (long) (1000000000.0 * N / t); // Throughput, items/sec
    }
}
```

  

程序运行结果：



```
Producer    Consumer    capacity     LinkedBlockingQueue     ArrayBlockingQueue      SynchronousQueue
1       1       1       154567/s            154100/s            3655071/s
1       1       10      1833165/s           1967491/s           3622405/s
1       1       20      3011779/s           2558451/s           3744037/s
1       1       30      3145926/s           2632099/s           3354525/s
1       1       40      3289673/s           2879696/s           3581858/s
1       1       50      3201828/s           3008838/s           3600100/s
1       1       60      3171374/s           2541672/s           3922617/s
1       1       70      3159786/s           2844493/s           3423066/s
1       1       80      3042835/s           2536290/s           3443517/s
1       1       90      3025808/s           3026241/s           3307096/s
2       2       1       141555/s            135653/s            2897927/s
2       2       10      1627066/s           785082/s            2908671/s
2       2       20      2199668/s           1604847/s           2937085/s
2       2       30      2309495/s           2115986/s           2922671/s
2       2       40      2335737/s           2424491/s           2942621/s
2       2       50      2394045/s           2405210/s           2918222/s
2       2       60      2499445/s           2471052/s           2881591/s
2       2       70      2368143/s           2454153/s           2914038/s
2       2       80      2381024/s           2457910/s           2937337/s
2       2       90      2509167/s           2461035/s           2789278/s
4       4       1       138177/s            138101/s            2736238/s
4       4       10      1654165/s           478171/s            2693045/s
4       4       20      2443373/s           779452/s            2728493/s
4       4       30      2646300/s           1169313/s           2787315/s
4       4       40      2755774/s           1487883/s           2874789/s
4       4       50      2774736/s           1579152/s           2804046/s
4       4       60      2804725/s           1998602/s           2803680/s
4       4       70      2797524/s           2388276/s           2936613/s
4       4       80      2887786/s           2557358/s           2899823/s
4       4       90      2878895/s           2539458/s           2839990/s
8       8       1       140745/s            135621/s            2711703/s
8       8       10      1650143/s           526018/s            2730710/s
8       8       20      2477902/s           798799/s            2696374/s
8       8       30      2658511/s           983456/s            2783054/s
8       8       40      2694167/s           1185732/s           2677500/s
8       8       50      2758267/s           1110716/s           2766695/s
8       8       60      2831922/s           1003692/s           2762232/s
8       8       70      2763751/s           1409142/s           2791901/s
8       8       80      2771897/s           1654843/s           2838479/s
8       8       90      2740467/s           1718642/s           2806164/s
16      16      1       131843/s            137943/s            2694036/s
16      16      10      1637213/s           491171/s            2725893/s
16      16      20      2523193/s           660559/s            2709892/s
16      16      30      2601176/s           899163/s            2689270/s
16      16      40      2794088/s           1054763/s           2759321/s
16      16      50      2777807/s           1111479/s           2663346/s
16      16      60      2893566/s           931713/s            2778294/s
16      16      70      2822779/s           1286067/s           2704785/s
16      16      80      2828238/s           1430581/s           2724927/s
16      16      90      2860943/s           1249650/s           2791520/s
32      32      1       132098/s            130805/s            2676121/s
32      32      10      1586372/s           402270/s            2674953/s
32      32      20      2467754/s           886059/s            2580989/s
32      32      30      2569709/s           772173/s            2599466/s
32      32      40      2659883/s           963633/s            2677042/s
32      32      50      2721213/s           910607/s            2677578/s
32      32      60      2779272/s           861786/s            2676874/s
32      32      70      2757921/s           1111937/s           2696416/s
32      32      80      2915294/s           1323776/s           2655641/s
32      32      90      2798313/s           1193225/s           2630231/s
64      64      1       126035/s            123764/s            2526632/s
64      64      10      1539034/s           394597/s            2582590/s
64      64      20      2449850/s           703790/s            2598631/s
64      64      30      2672792/s           758256/s            2529693/s
64      64      40      2797081/s           661028/s            2573380/s
64      64      50      2789848/s           1162143/s           2659469/s
64      64      60      2726806/s           1145495/s           2567020/s
64      64      70      2731554/s           1359939/s           2607615/s
64      64      80      2871116/s           1305428/s           2494839/s
64      64      90      2774416/s           1339611/s           2560153/s
128     128     1       223305/s            112828/s            2390234/s
128     128     10      1419592/s           404611/s            2401086/s
128     128     20      2365301/s           793815/s            2516045/s
128     128     30      2647136/s           915702/s            2463175/s
128     128     40      2721664/s           1081728/s           2400299/s
128     128     50      2688304/s           1149251/s           2489667/s
128     128     60      2774212/s           1145298/s           2453444/s
128     128     70      2782905/s           1165408/s           2403510/s
128     128     80      2818388/s           1392486/s           2389275/s
128     128     90      2738468/s           1546247/s           2425994/s
256     256     1       160146/s            80530/s         2369297/s
256     256     10      1214041/s           364460/s            2142039/s
256     256     20      1915432/s           901668/s            2156774/s
256     256     30      2371862/s           1124997/s           2237464/s
256     256     40      2630812/s           1123016/s           2216475/s
256     256     50      2666827/s           1239640/s           2267322/s
256     256     60      2635269/s           1276851/s           2318122/s
256     256     70      2663477/s           1333002/s           2188256/s
256     256     80      2672080/s           1659850/s           2315438/s
256     256     90      2804828/s           1497635/s           2194905/s
512     512     1       123294/s            68426/s         1892168/s
512     512     10      1028250/s           296454/s            1728199/s
512     512     20      1545215/s           604512/s            1963526/s
512     512     30      1968728/s           762240/s            2000386/s
512     512     40      2273678/s           854483/s            1948188/s
512     512     50      2295335/s           939350/s            1858429/s
512     512     60      2419257/s           1056918/s           1884224/s
512     512     70      2346088/s           980795/s            1852387/s
512     512     80      2341964/s           928496/s            1867498/s
512     512     90      2375789/s           1290064/s           1923461/s
```

[![复制代码](http://common.cnblogs.com/images/copycode.gif)](javascript:void(0);)

http://stevex.blog.51cto.com/4300375/1287085/