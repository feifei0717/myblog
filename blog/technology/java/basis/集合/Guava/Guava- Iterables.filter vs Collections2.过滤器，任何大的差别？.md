[TOC]



# java - Guava: Iterables.filter vs Collections2.过滤器，任何大的差别？

## 问题

我想知道在Guava [之间是否有差异的](http://docs.guava-libraries.googlecode.com/git/javadoc/com/google/common/collect/Iterables.html#filter%28java.lang.Iterable,%20com.google.common.base.Predicate%29)`Iterables.filter(Iterable, Predicate)`和`Collections2.filter(Collection, Predicate)`方法呢？

他们似乎都保持迭代顺序，并提供一个实时视图。 Javadoc说调用 `Collections2.filter().size()`将所有元素进行迭代。

假设我有一个谓词来筛选项目列表，因此我要项目数保留在列表视图( 或不重要) 。 我该怎么用？ 这似乎更容易使用 `Collections2.filter`作为 `size()`提供的方法， `Collection`s 。

但是在后台，有一个区别：

复制代码

```
ImmutableList.copyOf(
    Iterables.filter(lead.getActions(), isRealActionDoneByUserPredicate)
).size();
```

和：

复制代码

```
Collections2.filter(lead.getActions(),isRealActionDoneByUserPredicate).size();
```

------

顺便提一下，在生成。 `ImmutableList`速度要比构建一个普通的 `ArrayList`?



## 回答

复制代码

```
Collections2.filter(elements, predicate).size()
```

同时比较合适，因为它还没有复制 `filter`方法返回一个*查看*

复制代码

```
Iterables.size(Iterables.filter(elements, predicate))
```

但实质上是等价的，同样也可以找到答案，而无需任何复制。

至于建立一个相对的速度， `ArrayList`对比。 `ImmutableList`你们将因其构造方法，使用：

- `ImmutableList.copyOf(collection)`要以几乎完全相同的时间量。 ( 它必须检查是否有空值，但手机便宜) 。
- `ImmutableList.builder()....build()`需要花费更长的时间，因为它必须使用一个较小的常数因子 `ArrayList`里面 `Builder`，因为事先不知道有多少元素将被添加。
- `ImmutableList.of(...)`大概有相等的速度。

虽然这样说，但*总体*一个界面 `ImmutableList`通常要比小的性能损失，特别是如果你经常会同时将列出附近。

原作者:[Louis Wasserman](https://ask.helplib.com/user/Louis%20Wasserman)





https://stackoverflow.com/questions/10834577/guava-iterables-filter-vs-collections2-filter-any-big-difference