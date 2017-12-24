# JAVA 如何给ArrayList 倒序排列

for(String temp:list){

​    System.out.println(temp);

}

这种方式有倒序吗？

for(int i=list.size();i>=0;i--)只知道这种可以

ArrayList 没有，可以先调用 Collections.reverse(List<?>) 颠倒顺序

例如：

```
public class test {    
public static void main(String[] args) {   
        test  test = new test();   
        ArrayList<Integer> a = new ArrayList<Integer>();
        for(int i = 0 ; i <= 10 ; i++)    
               a.add(i);   
       Collections.reverse(a);   
       for(Integer cell : a)    
              System.out.print(cell + " ");  
     } 
}
```

 LinkedList 有 descendingIterator() 方法可以用：

for(String str: linkedlist.descendingIterator()){

}