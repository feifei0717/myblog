# [关于hashCode,你一定听说过会重复，那么你见过2个不同的字符串hashCode值却是相同的吗](http://blog.csdn.net/hl_java/article/details/71511815)



## 相同的例子

[Java](http://lib.csdn.net/base/java)中String.hashCode()方法的[算法](http://lib.csdn.net/base/datastructure)如下：str.charAt(0) * 31n-1 + str.charAt(1) * 31n-2 + ... + str.charAt(n-1)

据说算法中31这个数字是对英文字符进行优化后产生的一个最佳数字，但是碰上字母大小写或是一些特殊字符，再或者是中文字符，它就不灵了，很容易重复，举个例子：

Stringa="Aa";

Stringb="BB";

**int**aa=a.hashCode();

**int**bb=b.hashCode();

字符串a与b的hashCode取值是相同的，都是2112

2017-08-01更新

大家关注度比较高，再来几个中文例子，比如下面几组的hashCode均相等

"柳柴"与"柴柕"  hashCode=851553

"志捘"与"崇몈"  hashCode=786017





## 4个知识点：

1.java中所有的对象都有一个父类Object,而Object类都有hashCode方法，也就是说java中所有的类均会有hashCode方法；
2.Object类的hashCode方法是native的，即是通用[C语言](http://lib.csdn.net/base/c)来写的，本文举例使用的是String类，自己重写了hashCode方法，算法即如下：
String.hashCode()=str.charAt(0) * 31n-1 + str.charAt(1) * 31n-2 + ... + str.charAt(n-1)
3.String类的hashCode算法是固定的，根据算法就可以看到是可能会存在相同hashCode的
4.再强调一点，两个String的hashCode相同并不代表着equals比较时会相等，他们两者之间是没有必然关系，这一点可以看看equals方法的实现

```
    /**
     * Compares this string to the specified object.  The result is {@code
     * true} if and only if the argument is not {@code null} and is a {@code
     * String} object that represents the same sequence of characters as this
     * object.
     *
     * @param  anObject
     *         The object to compare this {@code String} against
     *
     * @return  {@code true} if the given object represents a {@code String}
     *          equivalent to this string, {@code false} otherwise
     *
     * @see  #compareTo(String)
     * @see  #equalsIgnoreCase(String)
     */
    public boolean equals(Object anObject) {
        if (this == anObject) {
            return true;
        }
        if (anObject instanceof String) {
            String anotherString = (String) anObject;
            int n = value.length;
            if (n == anotherString.value.length) {
                char v1[] = value;
                char v2[] = anotherString.value;
                int i = 0;
                while (n-- != 0) {
                    if (v1[i] != v2[i])
                            return false;
                    i++;
                }
                return true;
            }
        }
        return false;
    }
```