java 启动线程三种方式

------

****[java 启动线程三种方式 ]()*2014-10-03 23:33:13*

分类： Java

## 1.继承Thread

```
public class java_thread extends Thread {
    public static void main(String[] args) {
        (new java_thread()).run();
        System.out.println("main thread run ");
    }
    public synchronized void run() {
        System.out.println("sub thread run ");
    }
}
```


## 2.实现Runnable接口

```
public class java_thread implements Runnable {
    public static void main(String[] args) {
        (new Thread(new java_thread())).start();
        System.out.println("main thread run ");
    }
    public void run() {
        System.out.println("sub thread run ");
    }
}
```


## 3.直接在函数体使用

```
void java_thread() {
	Thread t = new Thread(new Runnable() {
			public void run() {
				mSoundPoolMap.put(index, mSoundPool.load(filePath, index));
				getThis().LoadMediaComplete();
			}
		});
	t.start();
}
```


## 4.比较：

**实现Runnable接口优势：**

**1）适合多个相同的程序代码的线程去处理同一个资源**

**2）可以避免java中的单继承的限制**

**3）增加程序的健壮性，代码可以被多个线程共享，代码和数据独立。**

**继承Thread类优势：**

**1）可以将线程类抽象出来，当需要使用抽象工厂模式设计时。**

**2）多线程同步**

**在函数体使用优势**

**1）无需继承thread或者实现Runnable，缩小作用域。**