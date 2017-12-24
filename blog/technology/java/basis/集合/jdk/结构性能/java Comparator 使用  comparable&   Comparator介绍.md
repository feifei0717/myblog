**comparable&   Comparator介绍**

comparable&   Comparator    都是用来实现集合中的排序的，只是Comparable是在集合内部定义的方法实现的排序，Comparator是在集合外部实现的排序，所以，如想实现排序，就需要在集合外定义Comparator接口的方法compare()或在集合内实现Comparable接口的方法compareTo()。

 

Comparable是一个对象本身就已经支持自比较所需要实现的接口（如String    Integer自己就可以完成比较大小操作）（让自身具备比较功能 一般是 implements 借口来实现）  

 

Comparator是一个专用的比较器，当这个对象不支持自比较或者自比较函数不能满足你的要求时，你可以写一个比较器来完成两个对象之间大小的比较。(用于外部实现 一般在集合外部new一个comparator对象)

**Comparator使用实例：**

```
public static void main(String[] args) {
		ArrayList<Person> list = Lists.newArrayList(new Person(2,"") ,new Person(9,""),new Person(11,""));
		Person max = Collections.max(list, new Comparator<Person>() {
			public int compare(Person o1, Person o2) {
				return o1.getAge() - o2.getAge();
			}
			public boolean equals(Object obj) {
				return false;
			}
		});
		System.out.println(max);
	}
```