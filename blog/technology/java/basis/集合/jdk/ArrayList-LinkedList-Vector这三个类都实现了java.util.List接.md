# ArrayList,LinkedList,Vector这三个类都实现了java.util.List接口，但它们有各自不同的特性，主要如下： 

## 一、同步性 

ArrayList,LinkedList是不同步的，而Vector是同步的。所以如果不要求线程安全的话，可以使用ArrayList或LinkedList，可以节省为同步而耗费的开销。但在多线程的情况下，有时候就不得不使用Vector了。当然，也可以通过一些办法包装ArrayList,LinkedList，使他们也达到同步，但效率可能会有所降低。 

## 二、数据增长 

从内部实现机制来讲ArrayList和Vector都是使用Objec的数组形式来存储的。当你向这两种类型中增加元素的时候，如果元素的数目超出了内部数组目前的长度它们都需要扩展内部数组的长度，Vector缺省情况下自动增长原来一倍的数组长度，ArrayList是原来的50%,所以最后你获得的这个集合所占的空间总是比你实际需要的要大。所以如果你要在集合中保存大量的数据那么使用Vector有一些优势，因为你可以通过设置集合的初始化大小来避免不必要的资源开销。 

## 三、检索、插入、删除对象的效率 R

ArrayList和Vector中，从指定的位置（用index）检索一个对象，或在集合的末尾插入、删除一个对象的时间是一样的，可表示为O(1)。但是，如果在集合的其他位置增加或移除元素那么花费的时间会呈线形增长：O(n-i)，其中n代表集合中元素的个数，i代表元素增加或移除元素的索引位置。为什么会这样呢？以为在进行上述操作的时候集合中第i和第i个元素之后的所有元素都要执行(n-i)个对象的位移操作。 

LinkedList中，在插入、删除集合中任何位置的元素所花费的时间都是一样的—O(1)，但它在索引一个元素的时候比较慢，为O(i),其中i是索引的位置。 

———————————————————————————————————————— 

一般大家都知道ArrayList和LinkedList的大致区别： 

​     1.ArrayList是实现了基于动态数组的数据结构，LinkedList基于链表的数据结构。 

​     2.对于随机访问get和set，ArrayList觉得优于LinkedList，因为LinkedList要移动指针。 

​     3.对于新增和删除操作add和remove，LinedList比较占优势，因为ArrayList要移动数据。 

ArrayList和LinkedList是两个集合 类，用于存储一系列的对象引用(references)。例如我们可以用ArrayList来存储一系列的String或者Integer。那么 ArrayList和LinkedList在性能上有什么差别呢？什么时候应该用ArrayList什么时候又该用LinkedList呢？ 

##### 三．总结 

ArrayList和LinkedList在性能上各 有优缺点，都有各自所适用的地方，总的说来可以描述如下： 

1．对ArrayList和LinkedList而言，在列表末尾增加一个元素所花的开销都是固定的。对 ArrayList而言，主要是在内部数组中增加一项，指向所添加的元素，偶尔可能会导致对数组重新进行分配；而对LinkedList而言，这个开销是 统一的，分配一个内部Entry对象。 

2．在ArrayList的 中间插入或删除一个元素意味着这个列表中剩余的元素都会被移动；而在LinkedList的中间插入或删除一个元素的开销是固定的。 

3．LinkedList不 支持高效的随机元素访问。 

4．ArrayList的空 间浪费主要体现在在list列表的结尾预留一定的容量空间，而LinkedList的空间花费则体现在它的每一个元素都需要消耗相当的空间 

可以这样说：当操作是在一列 数据的后面添加数据而不是在前面或中间,并且需要随机地访问其中的元素时,使用ArrayList会提供比较好的性能；当你的操作是在一列数据的前面或中 间添加或删除数据,并且按照顺序访问其中的元素时,就应该使用LinkedList了。 

所以，如果只是查找特定位置的元素或只在集合的末端增加、移除元素，那么使用Vector或ArrayList都可以。如果是对其它指定位置的插入、删除操作，最好选择LinkedList