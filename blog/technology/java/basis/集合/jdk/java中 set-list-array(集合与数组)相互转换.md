# [java中 set,list,array(集合与数组)相互转换](http://www.cnblogs.com/sophie_wang/archive/2010/05/25/1743612.html)

```
    public static Object[] List2Array(List<Object> oList) {   
        Object[] oArray = oList.toArray(new Object[] {});   
        // TODO 需要在用到的时候另外写方法，不支持泛型的Array.   
        return oArray;   
    }   
  
    public static Object[] Set2Array(Set<Object> oSet) {   
        Object[] oArray = oSet.toArray(new Object[] {});   
        // TODO 需要在用到的时候另外写方法，不支持泛型的Array.   
        return oArray;   
    }   
  
    public static <T extends Object> List<T> Set2List(Set<T> oSet) {   
        List<T> tList = new ArrayList<T>(oSet);   
        // TODO 需要在用到的时候另外写构造，根据需要生成List的对应子类。   
        return tList;   
    }   
  
    public static <T extends Object> List<T> Array2List(T[] tArray) {   
        List<T> tList = Arrays.asList(tArray);   
        // TODO 单纯的asList()返回的tList无法add(),remove(),clear()等一些影响集合个数的操作，   
        // 因为Arrays$ArrayList和java.util.ArrayList一样，都是继承AbstractList，   
        // 但是Arrays$ArrayList没有override这些方法，而java.util.ArrayList实现了。   
        // TODO 建议使用List的子类做返回，而不是Arrays$ArrayList。根据需要吧。如下行注释:   
        // List<T> tList = new ArrayList<T>(Arrays.asList(tArray));   
        return tList;   
    }   
  
    public static <T extends Object> Set<T> List2Set(List<T> tList) {   
        Set<T> tSet = new HashSet<T>(tList);   
        //TODO 具体实现看需求转换成不同的Set的子类。   
        return tSet;   
    }   
  
    public static <T extends Object> Set<T> Array2Set(T[] tArray) {   
        Set<T> tSet = new HashSet<T>(Arrays.asList(tArray));   
        // TODO 没有一步到位的方法，根据具体的作用，选择合适的Set的子类来转换。   
        return tSet;   
    }
```