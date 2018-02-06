# 为什么Java内部类要设计成静态和非静态两种？

如题，示例代码如下：

```
static class Outer {
	class Inner {}
	static class StaticInner {}
}

Outer outer = new Outer();
Outer.Inner inner = outer.new Inner();
Outer.StaticInner inner0 = new Outer.StaticInner();
```





## 解答

根据Oracle官方的说法：
Nested classes are divided into two categories: static and non-static. Nested classes that are declared static are called **static nested classes**. Non-static nested classes are called **inner classes**.
从字面上看，一个被称为静态嵌套类，一个被称为内部类。
从字面的角度解释是这样的：
什么是嵌套？嵌套就是我跟你没关系，自己可以完全独立存在，但是我就想借你的壳用一下，来隐藏一下我自己（真TM猥琐）。
什么是内部？内部就是我是你的一部分，我了解你，我知道你的全部，没有你就没有我。（所以内部类对象是以外部类对象存在为前提的）

http://docs.oracle.com/javase/tutorial/java/javaOO/nested.html





简单理解就是：如果把类比喻成鸡蛋，内部类为蛋黄,外部类是蛋壳。那么静态类相当于熟鸡蛋，就算蛋壳破碎（外部类没有实例化），蛋黄依然完好（内部类可以实例化）；而非静态类相当于生鸡蛋，蛋壳破碎（无实例化），蛋黄也会跟着xx（不能实例化）。





https://www.zhihu.com/question/28197253

