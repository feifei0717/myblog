最近需要做一个随机出广告的功能，上篇博客中说到了oracle 端的随机办法。

在这对[Java](http://lib.csdn.net/base/17) List中怎么随机取数做一个分享：

其实List中没有现成随机取记录的方法，但在Collections中有个shuffle方法可以实现“洗牌”的效果，所谓“洗牌”就是把List中的元素打乱重新排序。重新排列后的List再从头取需要发记录数，就相等于完成了随机取数的效果，见代码

```
import java.util.ArrayList;  
import java.util.Collections;  
import java.util.List;  
public class TTL {  
    public static void main(String[] str) {  
        List<Integer> list = new ArrayList<Integer>();  
        for (int i = 0; i < 5; i++) {  
            list.add(i);  
        }  
        System.out.println("orginal List:");  
        for (Integer s : list) {  
            System.out.print(s);  
        }  
        System.out.println();  
          
        Collections.shuffle(list);  
        System.out.println("after shuffle List:");  
        for (Integer s : list) {  
            System.out.print(s);  
        }  
    }  
} 
```

 

输出结果：

 

orginal List:

01234

after shuffle List:

32041

 

 

shuffle的原理就是用了Collection中的swap,对List中的每一个元素实现随机换位一次，这也就意味着这种随机方式不适合对List内中很多记录的随机。

来源： <http://blog.csdn.net/muyangk/article/details/6122533>