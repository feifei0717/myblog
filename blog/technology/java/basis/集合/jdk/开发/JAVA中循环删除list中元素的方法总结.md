# [JAVA中循环删除list中元素的方法总结](http://www.cnblogs.com/pcheng/p/5336903.html)

　　印象中循环删除list中的元素使用for循环的方式是有问题的，但是可以使用增强的for循环，然后今天在使用时发现报错了，然后去科普了一下，再然后发现这是一个误区。下面就来讲一讲。。伸手党可直接跳至文末。看总结。。

　　JAVA中循环遍历list有三种方式for循环、增强for循环（也就是常说的foreach循环）、iterator遍历。

 

1、for循环遍历list

```
for(int i=0;i<list.size();i++){
    if(list.get(i).equals("del"))
        list.remove(i);
}
```

 　　这种方式的问题在于，删除某个元素后，list的大小发生了变化，而你的索引也在变化，所以会导致你在遍历的时候漏掉某些元素。比如当你删除第1个元素后，继续根据索引访问第2个元素时，因为删除的关系后面的元素都往前移动了一位，所以实际访问的是第3个元素。因此，这种方式可以用在删除特定的一个元素时使用，但不适合循环删除多个元素时使用。

 

2、增强for循环

```
for(String x:list){
    if(x.equals("del"))
        list.remove(x);
}
```

 　　这种方式的问题在于，删除元素后继续循环会报错误信息ConcurrentModificationException，因为元素在使用的时候发生了并发的修改，导致异常抛出。但是删除完毕马上使用break跳出，则不会触发报错。

 

3、iterator遍历



```
Iterator<String> it = list.iterator();
while(it.hasNext()){
    String x = it.next();
    if(x.equals("del")){
        it.remove();
    }
}
```



　　这种方式可以正常的循环及删除。但要注意的是，使用iterator的remove方法，如果用list的remove方法同样会报上面提到的ConcurrentModificationException错误。

 

　　总结：

　　（1）循环删除list中特定一个元素的，可以使用三种方式中的任意一种，但在使用中要注意上面分析的各个问题。

　　（2）循环删除list中多个元素的，应该使用迭代器iterator方式。

来源： <http://www.cnblogs.com/pcheng/p/5336903.html>