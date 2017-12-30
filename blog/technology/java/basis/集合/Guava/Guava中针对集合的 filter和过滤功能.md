# Guava中针对集合的 filter和过滤功能

## Iterables.filter

在guava库中，自带了过滤器(filter)的功能，可以用来对collection 进行过滤，先看例子： 

Java代码  

```java
@Test  
public void whenFilterWithIterables_thenFiltered() {  
    List<String> names = Lists.newArrayList("John", "Jane", "Adam", "Tom");  
    Iterable<String> result = Iterables.filter(names, Predicates.containsPattern("a"));  
   
    assertThat(result, containsInAnyOrder("Jane", "Adam"));  
}  
```

  在这个例子中，给出一个list，过滤出含有字母a的元素 

## Collections2.filter

### 根据字符串包含某值过滤

此外，可以使用Collections2.filter() 去进行过滤 

Java代码  

```java
@Test  
public void whenFilterWithCollections2_thenFiltered() {  
    List<String> names = Lists.newArrayList("John", "Jane", "Adam", "Tom");  
    Collection<String> result = Collections2.filter(names, Predicates.containsPattern("a"));  
       
    assertEquals(2, result.size());  
    assertThat(result, containsInAnyOrder("Jane", "Adam"));  
   
    result.add("anna");  
    assertEquals(5, names.size());  
} 
```

  这里注意的是，Collections2.filter中，当在上面的result中增加了元素后，会直接影响原来的names这个list的，就是names中的集合元素是5了。 



### 根据predicates判断true false过滤

  再来看下predicates判断语言， 

com.google.common.base. Predicate : 根据输入值得到 true 或者 false 

拿Collections2中有2个函数式编程的接口：filter , transform ,例如 ：在Collection<Integer>中过滤大于某数的内容： 

Java代码  

```java
Collection<Integer> filterList = Collections2.filter(collections
     , new Predicate<Integer>(){  
                  @Override  
                  public boolean apply(Integer input) {
                        if(input > 4)  
                              return false;  
                        else  
                              return true;  
                  }  
});  
```



## Lists.transform

把Lis<Integer>中的Integer类型转换为String , 并添加test作为后缀字符： 

Java代码  

```java
List<String> c2 = Lists.transform(list, new Function<Integer , String>(){   
                  @Override   
                  public String apply(Integer input) {   
                        return String.valueOf(input) + "test";   
                  }               
});  
```





## 其它例子

需要说明的是每次调用返回都是新的对象，同时操作过程不是线程安全的。 

​    再来点例子： 

Java代码  

```java
@Test  
public void whenFilterCollectionWithCustomPredicate_thenFiltered() {  
    Predicate<String> predicate = new Predicate<String>() {  
        @Override  
        public boolean apply(String input) {  
            return input.startsWith("A") || input.startsWith("J");  
        }  
    };  
   
    List<String> names = Lists.newArrayList("John", "Jane", "Adam", "Tom");  
    Collection<String> result = Collections2.filter(names, predicate);  
   
    assertEquals(3, result.size());  
    assertThat(result, containsInAnyOrder("John", "Jane", "Adam"));  
}  
```

​    将多个prdicate进行组合 

Java代码  

```
@Test  
public void whenFilterUsingMultiplePredicates_thenFiltered() {  
    List<String> names = Lists.newArrayList("John", "Jane", "Adam", "Tom");  
    Collection<String> result = Collections2.filter(names,   
      Predicates.or(Predicates.containsPattern("J"),   
      Predicates.not(Predicates.containsPattern("a"))));  
   
    assertEquals(3, result.size());  
    assertThat(result, containsInAnyOrder("John", "Jane", "Tom"));  
}  
```

   

​     上面的例子中找出包含J字母或不包含a的元素; 

   

再看下如何将集合中的空元素删除： 

  

Java代码  

```
@Test  
public void whenRemoveNullFromCollection_thenRemoved() {  
    List<String> names = Lists.newArrayList("John", null, "Jane", null, "Adam", "Tom");  
    Collection<String> result = Collections2.filter(names, Predicates.notNull());  
   
    assertEquals(4, result.size());  
    assertThat(result, containsInAnyOrder("John", "Jane", "Adam", "Tom"));  
}  
```

​    检查一个collection中的所有元素是否符合某个条件： 

  

Java代码  

```
@Test  
ublic void whenCheckingIfAllElementsMatchACondition_thenCorrect() {  
   List<String> names = Lists.newArrayList("John", "Jane", "Adam", "Tom");  
  
   boolean result = Iterables.all(names, Predicates.containsPattern("n|m"));  
   assertTrue(result);  
  
   result = Iterables.all(names, Predicates.containsPattern("a"));  
   assertFalse(result);  
```

   下面看如何把一个list进行转换， 

Java代码  

```
@Test  
public void whenTransformWithIterables_thenTransformed() {  
    Function<String, Integer> function = new Function<String, Integer>() {  
        @Override  
        public Integer apply(String input) {  
            return input.length();  
        }  
    };  
   
    List<String> names = Lists.newArrayList("John", "Jane", "Adam", "Tom");  
    Iterable<Integer> result = Iterables.transform(names, function);  
   
    assertThat(result, contains(4, 4, 4, 3));  
}  
```

​    

  再看结合transform和predicates结合使用的例子： 

  

Java代码  

```
@Test  
public void whenCreatingAFunctionFromAPredicate_thenCorrect() {  
    List<String> names = Lists.newArrayList("John", "Jane", "Adam", "Tom");  
    Collection<Boolean> result =  
      Collections2.transform(names,  
      Functions.forPredicate(Predicates.containsPattern("m")));  
   
    assertEquals(4, result.size());  
    assertThat(result, contains(false, false, true, true));  
}  
```

​    在这个例子中，将一个LIST中的每一个元素进行使用Predicates.containsPattern，判断是否包含m，返回的是boolean，然后再得到的boolean值一起转换为collection 

​    下面是两个function一起结合使用的例子： 

 

Java代码  

```
@Test  
public void whenTransformingUsingComposedFunction_thenTransformed() {  
    Function<String,Integer> f1 = new Function<String,Integer>(){  
        @Override  
        public Integer apply(String input) {  
            return input.length();  
        }  
    };  
   
    Function<Integer,Boolean> f2 = new Function<Integer,Boolean>(){  
        @Override  
        public Boolean apply(Integer input) {  
            return input % 2 == 0;  
        }  
    };  
   
    List<String> names = Lists.newArrayList("John", "Jane", "Adam", "Tom");  
    Collection<Boolean> result = Collections2.transform(names, Functions.compose(f2, f1));  
   
    assertEquals(4, result.size());  
    assertThat(result, contains(true, true, true, false));  
} 
```

   在这个例子中，首先应用函数f1，求出每个元素的长度，然后再根据f1函数，分别返回 

它们的boolean值，再转换为collection. 

   

   最后看下将filter和transform结合使用的例子： 

  

Java代码  

```
@Test  
public void whenFilteringAndTransformingCollection_thenCorrect() {  
    Predicate<String> predicate = new Predicate<String>() {  
        @Override  
        public boolean apply(String input) {  
            return input.startsWith("A") || input.startsWith("T");  
        }  
    };  
   
    Function<String, Integer> func = new Function<String,Integer>(){  
        @Override  
        public Integer apply(String input) {  
            return input.length();  
        }  
    };  
   
    List<String> names = Lists.newArrayList("John", "Jane", "Adam", "Tom");  
    Collection<Integer> result = FluentIterable.from(names)  
                                               .filter(predicate)  
                                               .transform(func)  
                                               .toList();  
   
    assertEquals(2, result.size());  
    assertThat(result, containsInAnyOrder(4, 3));  
}  
```



来源： <http://jackyrong.iteye.com/blog/2150912>