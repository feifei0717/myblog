# Java程序计算各种对象所占内存的大小的方法

### 查看已用内存

```Java
System.out.println("--- Memory Usage:"); /*打印一行字符串---Memory Usage*/      
Runtime rt=Runtime.getRuntime( ); //获得系统的Runtime对象rt    
//打印总内存大小 //打印空闲内存大小 //打印已用内存大小 单位(字节)  
System.out.println("Total Memory= " + rt.totalMemory()+         
               
" Free Memory = "+rt.freeMemory()+" Used　Memory="+(rt.totalMemory()-rt.freeMemory()));  
```



### **1、根据jsvm堆内存计算对象大小 推荐用这个** 

基类：

```Java
public abstract class SizeOf {        
       
    private final Runtime s_runtime = Runtime.getRuntime();        
       
    /**     
     *     
     * 子类负责覆盖该方法以提供被测试类的实例     
     *     
     * @return 被测试类的实例     
     */       
    protected abstract Object newInstance();        
       
    /**     
     *     
     * 计算实例的大小（字节数）     
     *     
     * @return 实例所占内存的字节数     
     * @throws Exception     
     */       
    public int size() throws Exception {        
       
        // 垃圾回收        
        runGC();        
       
        // 提供尽可能多（10万）的实例以使计算结果更精确        
        final int count = 100000;        
        Object[] objects = new Object[count];        
       
        // 实例化前堆已使用大小        
        long heap1 = usedMemory();        
        // 多实例化一个对象        
        for (int i = -1; i < count; ++i) {        
            Object object = null;        
       
            // 实例化对象        
            object = newInstance();        
       
            if (i >= 0) {        
                objects[i] = object;        
            } else {        
                // 释放第一个对象        
                object = null;        
                // 垃圾收集        
                runGC();        
                // 实例化之前堆已使用大小        
                heap1 = usedMemory();        
            }        
        }        
       
        runGC();        
        // 实例化之后堆已使用大小        
        long heap2 = usedMemory();        
        final int size = Math.round(((float) (heap2 - heap1)) / count);        
       
        // 释放内存        
        for (int i = 0; i < count; ++i) {        
            objects[i] = null;        
        }        
        objects = null;        
        return size;        
    }        
       
    private void runGC() throws Exception {        
        // 执行多次以使内存收集更有效        
        for (int r = 0; r < 4; ++r) {        
            _runGC();        
        }        
    }        
       
    private void _runGC() throws Exception {        
        long usedMem1 = usedMemory();        
        long usedMem2 = Long.MAX_VALUE;        
        for (int i = 0; (usedMem1 < usedMem2) && (i < 500); ++i) {        
            s_runtime.runFinalization();        
            s_runtime.gc();        
            Thread.currentThread().yield();        
            usedMem2 = usedMem1;        
            usedMem1 = usedMemory();        
        }        
    }        
       
    /**     
     *     
     * 堆中已使用内存     
     *     
     * @return 堆中已使用内存     
     */       
    private long usedMemory() {        
        return s_runtime.totalMemory() - s_runtime.freeMemory();        
    }        
}      
```



子类：

```
public class SizeOfObject extends SizeOf {        
       
    @Override       
    protected Object newInstance() {        
        return new Object();        
    }        
       
    public static void main(String[] args) throws Exception {        
        SizeOf sizeOf = new SizeOfObject();        
        System.out.println("所占内存：" + sizeOf.size() + "字节");        
    }        
}  
```

输出为：所占内存：8字节 



### **2、利用序列化(Serializable)计算对象的大小** 

注意：序列化只是大概的大小，不是很准确。因为每个序列化程序会有自己的优化压缩或者增大。

下面代码可以计算session的大小: 

将session中的所有对象输出到文件中,文件的大小就是对象的大小.

```Java
try {        
    FileOutputStream f = new FileOutputStream("c:/sessionFiles");        
    ObjectOutputStream s = new ObjectOutputStream(f);        
    s.writeObject("session:");        
    HttpSession session = request.getSession(false);        
    Enumeration names = session.getAttributeNames();        
    while(names.hasMoreElements()){        
        s.writeObject(session.getAttribute((String) names.nextElement()));        
    }        
    s.flush();        
    s.close();        
    f.close();        
} catch (Exception e) {        
    e.printStackTrace();        
}     
```



也可以看看这个 

### 3、java对象占内存详解

原：http://329937021.iteye.com/blog/547779

#### 说明

32位空对象占8个字节
( 

**备注：**
**sun的32位虚拟机，空对象是8字节**
**sun的64为虚拟机，空对象是16字节**
**jrockit的32位和64为虚拟机，空对象都是8字节**
)
有数据成员的话，你把数据成员按基本数据类型和对象引用分开统计。 
基本数据类型按byte/boolean=1,char/short=2,int/float=4,long/double=8，累加，然后对齐到8的倍数。 
对象引用按每个4字节，累加，然后对齐到8个字节的倍数。 

------

#### 32位：

对象占用字节数=基本的8字节＋基本数据类型所占的＋对象引用所占的 

比如 
class A{ 
int a; 
char b; 
} 
占 8(基本)+8(int 4+char 2=6,对齐到8）= 16个字节 
再比如： 
class B{ 
Integer a; 
long b; 
byte c; 
} 
占 8(基本)+8(long8+byte1=9，对齐到8）+8(对象引用4,对齐到8)=24个字节 

#### 64位：

对象占用字节数=基本的16字节＋基本数据类型所占的＋对象引用所占的 

比如 
class A{ 
int a; 
char b; 
} 
占 16(基本)+8(int 4+char 2=6,对齐到8）= 24个字节 
再比如： 
class B{ 
Integer a; 
long b; 
byte c; 
} 


大小为：空对象大小(16byte)+long大小(8byte)+byte大小(1byte)+空Integer引用的大小(4byte)=21byte 
由于要是 8byte 的倍数，所以是 32byte 



------



如果你是从别的类继承的，父类的也要算上。 

这与C++不同，C++中，空对象占一个字节，有数据成员则按数据成员对齐后，得到的大小 

```Java
#include <iostream.h> 
class A 
{ 
private: 
int i; 
    char b; 
}; 

void main() 
{ 
A a; 
cout<<sizeof(a)<<endl; 
} 

```

得到的是8







来源： [http://happyqing.iteye.com/blog/2013639](http://happyqing.iteye.com/blog/2013639)