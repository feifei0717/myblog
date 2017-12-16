[TOC]
# Python数据类型

##  概述

Python3 中有六个标准的数据类型：

1、字符串String

2、数字Number

3、列表List

4、元组Tuple

5、集合Sets

6、字典Dictionary

7、日期

 

## 1、字符串 String

### 1）、使用单引号(')

用单引号括起来表示字符串，例如：
str='this is string'
print (str)

 

### 2）、使用双引号(")

双引号中的字符串与单引号中的字符串用法完全相同，例如：
str="this is string"
print (str)

 

### 3）、使用三引号(''')

利用三引号，表示多行的字符串，可以在三引号中自由的使用单引号和双引号，例如：
str='''this is string 1
this is string 2
this is string 3'''
print (str)

 

### 4）、字符串可以使用 + 运算符串连接在一起，或者用 * 运算符重复

```
text = 'ice'+' cream' 
print(text) 
 
text = 'ice cream '*3 
print(text)
```

 

### 5）、如果不想让反斜杠发生转义，可以在字符串前面添加一个 r 或 R ,表示原始字符串。

如 r"this is a line with \n" 则\n会显示，并不是换行

 

### 6）、python中的字符串使用反斜杠(\)转义特殊字符

| **转义字符** | **描述**                  |
| -------- | ----------------------- |
| \(在行尾时)  | 续行符                     |
| \\       | 反斜杠符号                   |
| \'       | 单引号                     |
| \"       | 双引号                     |
| \a       | ASCII响铃(BEL)            |
| \b       | ASCII退格(BS)             |
| \e       | ASCII转义                 |
| \000     | 空                       |
| \n       | 换行                      |
| \v       | 纵向制表符                   |
| \t       | 横向制表符                   |
| \r       | 回车                      |
| \f       | 换页                      |
| \oyy     | 八进制数yy代表的字符，例如：\o12代表换行 |
| \xyy     | 十进制数yy代表的字符，例如：\x0a代表换行 |
| \other   | 其它的字符以普通格式输出            |

 

### 7）、字符串常见操作

| **函数**                           | **功能**                    |
| -------------------------------- | ------------------------- |
| **.upper()/lower()**             | 把所有字母转化为大写/小写             |
| **.capitalize()**                | 把字符串首字母答谢，其他小写            |
| **.title()**                     | 把首字母和每个空格或标点符号后的字母大写，其他小写 |
| **=, +, \***                     | 字符串的赋值，拼接，重复              |
| **==**                           | 字符串的比较                    |
| **\n, \\**                       | 转义字符                      |
| **.strip(),.rstrip(),.lstrip()** | 去除字符串两端空格，或指定字母           |
| **.()**                          | 字符串长度                     |
| **.find()**                      | 查找子串，返回第一个满足的位置索引         |
| **.replace("a", "b")**           | 字符串替代                     |

 

print(str.lower(tttt))  #hkhk

print(tttt.lower())     #hkhk

 

常见字符串常量和表达式

 

​    S = "spam’s"                              # 双引号和单引号相同

​    S = "s\np\ta\x00m"                   # 转义字符

​    S = """spam"""                     # 三重引号字符串，一般用于函数说明

​    S = r'\temp'                      # Raw字符串，不会进行转义，抑制转义

​    S = b'Spam'                       # Python3中的字节字符串

​    'a %s parrot' % 'kind'                   # 字符串格式化表达式

​    'a {0} parrot'.format('kind')                   # 字符串格式化方法

​    for x in s: print(x)                    # 字符串迭代，成员关系

   [x*2 for x in s]                      # 字符串列表解析

   ','.join(['a', 'b', 'c'])                       # 字符串输出，结果：a,b,c

## 2、数字 Number

Python3 支持数字型有 int、float、bool、complex（复数）。 int表示为长整型，没有 python2 中的 Long。

### **1、布尔类型**

布尔型bool 用符号==表示
布尔型是一种比较特殊的python数字类型，它只有True和False两种值（`必须大写第一个字母`），它主要用来比较和判断，所得结果叫做布尔值。例如：3==3 给出True，3==5给出False

### **2、整数**

int=20;
print int;

### **3、浮点数**

```
float=2.3;
print float;

a, b, c, d = 20, 5.5, True, 4+3j
print(type(a), type(b), type(c), type(d))
 
结果：
<class 'int'> <class 'float'> <class 'bool'> <class 'complex'>
```

 

### **4、数字类型转换**

int(x) 将x转换为一个整数

float(x ) 将x转换到一个浮点数

bb = float(123)

print ("bb =", bb)   #bb=123.0

complex(real [,imag]) 创建一个复数

str(x) 将对象x转换为字符串

repr(x) 将对象x转换为表达式字符串

eval(str) 用来计算在字符串中的有效Python表达式,并返回一个对象

tuple(s) 将序列s转换为一个元组

list(s) 将序列s转换为一个列表

chr(x) 将一个整数转换为一个字符

unichr(x) 将一个整数转换为Unicode字符

ord(x) 将一个字符转换为它的整数值

hex(x) 将一个整数转换为一个十六进制字符串

oct(x) 将一个整数转换为一个八进制字符串

 

### **5、数学函数**

abs(x)    返回数字的绝对值，如abs(-10) 返回 10

ceil(x)    返回数字的上入整数，如math.ceil(4.1) 返回 5

cmp(x, y) 如果 x < y 返回 -1, 如果 x == y 返回 0, 如果 x > y 返回 1

exp(x)    返回e的x次幂(ex),如math.exp(1) 返回2.718281828459045

fabs(x)    返回数字的绝对值，如math.fabs(-10) 返回10.0

floor(x) 返回数字的下舍整数，如math.floor(4.9)返回 4

log(x)    如math.log(math.e)返回1.0,math.log(100,10)返回2.0

log10(x) 返回以10为基数的x的对数，如math.log10(100)返回 2.0

max(x1, x2,...)    返回给定参数的最大值，参数可以为序列。

min(x1, x2,...)    返回给定参数的最小值，参数可以为序列。

modf(x)    返回x的整数部分与小数部分，两部分的数值符号与x相同，整数部分以浮点型表示。

pow(x, y) x**y 运算后的值。

round(x [,n]) 返回浮点数x的四舍五入值，如给出n值，则代表舍入到小数点后的位数。

sqrt(x)    返回数字x的平方根，数字可以为负数，返回类型为实数，如math.sqrt(4)返回 2+0j

 

## 3、列表 list---用[ ]符号表示

1)、初始化列表，例如：
list=['physics', 'chemistry', 1997, 2000];
nums=[1, 3, 5, 7, 8, 13, 20];

 

2)、访问列表中的值：

 

print( "nums[0]:", nums[0])  #输出列表中第一元素  nums[0]: 1

 

print( "nums[2:5]:", nums[2:5])  #从下标为2的元素切割到下标为5的元素，但不包含下标为5的元素  nums[2:5]: [5, 7, 8]

 

print ("nums[1:]:", nums[1:] )  #从下标为1切割到最后一个元素  nums[1:]: [3, 5, 7, 8, 13, 20]

 

print( "nums[:-3]:", nums[:-3])  #从最开始的元素一直切割到倒数第3个元素，但不包含倒数第三个元素  nums[:-3]: [1, 3, 5, 7]

 

print( "nums[:]:", nums[:] )  #返回所有元素  nums[:]: [1, 3, 5, 7, 8, 13, 20]

 

3)、更新列表，例如：

nums[0]="ljq";

print nums[0];

 

4)、删除列表元素

del nums[0];

print "nums[:]:", nums[:];

结果：nums[:]: [3, 5, 7, 8, 13, 20]

 

5)、列表操作符
列表对+和*的操作符与字符串相似。+号用于组合列表，*号用于重复列表，例如：

print ([1, 2, 3] + [4, 5, 6])   #[1, 2, 3, 4, 5, 6]

 

num1=[1,2,3]

num2=[4,5,6,7]

print(num1+num2)  # [1, 2, 3, 4, 5, 6, 7] 

 

print ( ['Hi!'] * 4)     #['Hi!', 'Hi!', 'Hi!', 'Hi!']

 

print (3 in [1, 2, 3])   #True

 

for x in [1, 2, 3]: print (x)   #1 2 3

 

 

a = [1, 2, 3]
a = []
a += [1]                               
print(a)
a = a + [1]                    
print(a)

 

6)、列表截取

L=['111', '222', '333','444'];

print (L[0])    #111

print (L[2])    #333

print (L[-1])   #444

print (L[1:])   # ['222', '333', '444']

print (len(L))  #4 计算列表元素的个数

 

 

\#列表切片

print(x[:3]) # 前3个[1,2,3]

print(x[1:5]) # 中间4个[2,3,4,5]

print(x[-3:] ) # 最后3个[4,5,6]

print(x[::2]) # 奇数项[1,3,5]

print(x[1::2]) # 偶数项[2,4,6]

 

 

7)、列表函数&方法

list.append(obj) 在列表末尾添加新的对象

L=['111', '222', '333','444'];

L.append('xxx')

print (L[:])      #['111', '222', '333','444'，‘xxx’]

list.count(obj) 统计某个元素在列表中出现的次数

list.extend(seq) 在列表末尾一次性追加另一个序列中的多个值(用新列表扩展原来的列表)

list.index(obj) 从列表中找出某个值第一个匹配项的索引位置，索引从0开始

list.insert(index, obj) 将对象插入列表

list.pop(obj=list[-1]) 移除列表中的一个元素(默认最后一个元素)，并且返回该元素的值

list.remove(obj) 移除列表中某个值的第一个匹配项

list.reverse() 反转列表中元素，倒转

list.sort([func]) 对原列表进行排序

 

 

## 4、元组tuple--- 用( )符号表示

元组与列表类似，不同之处在于元组的元素不能修改；元组使用小括号()；元组创建很简单，只需要在括号中添加元素，并使用逗号,隔开即可：

元组中只有一个元素时，需要在元素后面添加逗号，元组与字符串类似，下标索引从0开始，可以进行截取，组合等。

 

tup1 = ('physics', 'chemistry', 1997, 2000)

tup2 = (1, 2, 3, 4, 5 )

tup3 = "a", "b", "c", "d"

tup4 = ();  #创建空元组

tup1 = (50,);  #只有一个元素

 

1)、访问元组

tup1 = ('physics', 'chemistry', 1997, 2000)

print ("tup1[0]: ", tup1[0])     #tup1[0]: physics

print ("tup1[1:3]: ", tup1[1:3])   #tup1[1:3]: ('chemistry', 1997)

 

2)、修改元组
元组中的元素值是不允许修改的

tup1[0] = 100   #修改元组元素操作是非法的

 

可以对元组进行连接组合

tup5 = tup1 + tup2   

print (tup5)  # ('physics', 'chemistry', 1997, 2000, 1, 2, 3, 4, 5)

 

tup5 = tup2 + tup1

print (tup5)  # (1, 2, 3, 4, 5, 'physics', 'chemistry', 1997, 2000)

 

3)、删除元组

可以使用del语句来删除整个元组

tup = ('physics', 'chemistry', 1997, 2000)

print (tup)

del tup

 

4)、元组运算符
与字符串一样，元组之间可以使用+号和*号进行运算。可以对元组进行组合和复制，运算后会生成一个新的元组。

 

 

5)、元组索引&截取

L = (111, 222, 333)

print (L[2])   #333

print (L[-2])  #222

print (L[1:])  # ('222', '333')

 

6)、元组内置函数

cmp(tuple1, tuple2) 比较两个元组元素。

len(tuple) 计算元组元素个数。

max(tuple) 返回元组中元素最大值。

min(tuple) 返回元组中元素最小值。

 

## 5、集合Set 使用大括号 { }

集合是一个无序不重复元素的序列。集合可以使用大括号 { } 或者使用 set() 函数创建一个空集合。

student = {'Tom', 'Jim', 'Mary', 'Tom', 'Jack', 'Rose'}

print(student)   # 输出集合，重复的元素被自动去掉

 

set可以进行集合运算

a = set('abracadabra')

b = set('alacazam')

print(a)

print(b)

print(a - b)     # a和b的差集

print(a | b)     # a和b的并集

print(a & b)    # a和b的交集

print(a ^ b)    # a和b中不同时存在的元素

 

结果：

{'b', 'r', 'c', 'd', 'a'}

{'l', 'z', 'm', 'c', 'a'}

{'r', 'd', 'b'}

{'l', 'b', 'z', 'm', 'r', 'c', 'd', 'a'}

{'a', 'c'}

{'l', 'b', 'z', 'm', 'r', 'd'}

## 6、字典 Dictionary用{ }符号表示

类似java的map

1)、字典简介

字典是除列表之外python中最灵活的内置数据结构类型。列表是有序的对象结合，字典是无序的对象集合。两者之间的区别在于：字典当中的元素是通过键来存取的，而不是通过偏移存取。字典也被称作关联数组或哈希表。

字典是一种映射类型，字典用"{ }"标识，它是一个无序的键(key) : 值(value)对集合。键(key)必须使用不可变类型。每个键与值必须用冒号:隔开，每对用逗号分割，整体放在花括号{}中。键必须独一无二，但值则不必；值可以取任何数据类型，但必须是不可变的，如字符串，数或元组。

 

创建字典：

dict = {'Alice': '2341', 'Beth': '9102', 'Cecil': '3258'}

dict2 = { 'abc': 123, 98.6: 37 }

 

2)、访问字典里的值

dict = {'name': 'Zara', 'age': 7, 'class': 'First'}

print ("dict['name']: ", dict['name'])

print( "dict['age']: ", dict['age'])

 

3)、修改字典
向字典添加新内容的方法是增加新的键/值对，修改或删除已有键/值对如下实例:

dict = {'name': 'Zara', 'age': 7, 'class': 'First'}

dict["age"]=27          #修改已有键的值

dict["school"]="wutong"  #增加新的键/值对

print(dict)

print( "dict['age']: ", dict['age'])

print ("dict['school']: ", dict['school'])

 

4)、删除字典
del dict['name']    # 删除键是'name'的条目
dict.clear()       # 清空词典所有条目
del dict          # 删除词典

 

5)、字典内置函数&方法

cmp(dict1, dict2) 比较两个字典元素。

len(dict) 计算字典元素个数，即键的总数。

str(dict) 输出字典可打印的字符串表示。

type(variable) 返回输入的变量类型，如果变量是字典就返回字典类型。

radiansdict.clear() 删除字典内所有元素

radiansdict.copy() 返回一个字典的浅复制

radiansdict.fromkeys() 创建一个新字典，以序列seq中元素做字典的键，val为字典所有键对应的初始值

radiansdict.get(key, default=None) 返回指定键的值，如果值不在字典中返回default值

radiansdict.has_key(key) 如果键在字典dict里返回true，否则返回false

radiansdict.items() 以列表返回可遍历的(键, 值) 元组数组

radiansdict.keys() 以列表返回一个字典所有的键

radiansdict.setdefault(key, default=None) 和get()类似, 但如果键不已经存在于字典中，将会添加键并将值设为default

radiansdict.update(dict2) 把字典dict2的键/值对更新到dict里

radiansdict.values() 以列表返回字典中的所有键的值

 

## 7、日期和时间

1)、获取当前时间：

print (datetime.date.today())                    # 2017-09-06

print (time.strftime('%Y-%m-%d %H:%M:%S'))      # 2017-09-06 12:10:04 

print (datetime.datetime.now())                 # 2017-09-06 12:11:46.051232

 

2)、日期转换为字符串

首选：print (time.strftime('%Y-%m-%d %H:%M:%S'))

其次：print (datetime.datetime.strftime(datetime.datetime.now(), '%Y-%m-%d %H:%M:%S'))

最后：print (str(datetime.datetime.now())[:19])

 

3)、获取日期差

oneday = datetime.timedelta(days=2017.09.06)

print (oneday)    # 3 days, 3:23:53.609280

 

today = datetime.date.today()#昨天，2014-03-20

 

yesterday = datetime.date.today() - oneday#明天，2014-03-22

 

tomorrow = datetime.date.today() + oneday#获取今天零点的时间，2014-03-21 00:00:00

 

today_zero_time = datetime.datetime.strftime(today, '%Y-%m-%d %H:%M:%S')

 

print datetime.timedelta(milliseconds=1), #1毫秒  #0:00:00.001000

print datetime.timedelta(seconds=1), #1秒  #0:00:01

print datetime.timedelta(minutes=1), #1分钟   #0:01:00

print datetime.timedelta(hours=1), #1小时  #1:00:00

print datetime.timedelta(days=1), #1天  #1 day, 0:00:00

print datetime.timedelta(weeks=1)  #7 days, 0:00:00

 

4)、字符串日期格式化为秒数，返回浮点类型：

etime = "2013-05-21 09:50:35"

d = datetime.datetime.strptime(etime,"%Y-%m-%d %H:%M:%S")

time_sec_float = time.mktime(d.timetuple())

print (time_sec_float)

 

5)、日期格式化为秒数，返回浮点类型：

d = datetime.date.today()

time_sec_float = time.mktime(d.timetuple())

print (time_sec_float)

 

6)、秒数转字符串

time_sec = time.time()

print time.strftime("%Y-%m-%d %H:%M:%S", time.localtime(time_sec))

 

 

**可迭代对象**

只要它定义了可以返回一个迭代器的__iter__方法，或者定义了可以支持下标索引的__getitem__方法，那么它就是一个可迭代对象。可迭代对象的__iter__方法会返回一个迭代器, 迭代器的__next__方法会返回下一个迭代对象，如果迭代结束则抛出StopIteration异常。同时，迭代器自己也是一种可迭代对象，所以也需要实现可迭代对象的方法（__iter__），这样在for当中两者都可以使用。迭代器的__iter__只需要返回自己就行了。Python中内置的数据类型（列表、元组、字符串、字典等）、大部分内置函数都实现了迭代协议，可以通过 for 语句进行迭代。

**迭代器（iterator）**

任何具有__next__()方法的可迭代对象都是迭代器，迭代器是通过next()来实现的，每调用一次next()他就会返回下一个元素，当没有下一个元素的时候返回一个StopIteration异常。迭代器除了可以用 for 遍历外，还可以通过 next() 方法逐一读取下一个元素。

很多时候使用迭代器完成的工作使用列表也可以完成，但是如果有很多值列表就会占用太多的内存，而且使用迭代器也让我们的程序更加通用、优雅。要创建一个迭代器有3种方法，其中前两种分别是：

1、为容器对象添加 __iter__() 和 __next__() 方法；__iter__() 返回迭代器对象本身self，__next__() 则返回每次调用next()的元素或迭代时的元素；

2、内置函数iter() 将可迭代对象转化为迭代器



```
# iter(IterableObject)

ita = iter([1, 2, 3])

print(type(ita))

print(next(ita))

print(next(ita))

print(next(ita))

 

# Create iterator Object

class Container:

    def __init__(self, start = 0, end = 0):

        self.start = start

        self.end = end

    def __iter__(self):

        print("[LOG] I made this iterator!")

        return self

    def __next__(self):

        print("[LOG] Calling __next__ method!")

        if self.start < self.end:

            i = self.start

            self.start += 1

            return i

        else:

            raise StopIteration()

c = Container(0, 5)

for i in c:

    print(i)
```

 

 

**生成器(generator)**

 前面说到创建迭代器有3种方法，其中第三种就是生成器（generator）。生成器通过 yield 语句快速生成迭代器，然后yield会自动构建好__iter__() 和 __next__()。生成器函数和常规函数几乎是一样的。
它们都是使用def语句进行定义，差别在于生成器使用yield语句返回，而常规函数使用return语句返回一个值. 生成器函数返回的是一个对象，而不是你平常所用return语句那样得到结果值，如果想取得值那得调用next()函数。

```
def container(start, end):

    while start < end:

        yield start

        start += 1

c = container(0, 5)

print(type(c))     # <class 'generator'>

print(next(c))     #0

next(c)            #无值

for i in c:

    print(i)
```

生成器其实是一种特殊的迭代器，它不需要再像上面的类一样写__iter__()和__next__()方法了，只需要一个yiled关键字。 生成器一定是迭代器（反之不成立）。生成器的唯一注意事项就是：生成器只能遍历一次，当我们再次遍历我们的生成器的时候，将不会有任何记录。

 

 

### 生成器的类型

在Python中两种类型的生成器：**生成器函数**以及**生成器表达式**。生成器函数就是包含`yield`参数的函数。生成器表达式与列表解析式类似。
假设使用如下语法创建一个列表

```
>>> numbers = [1, 2, 3, 4, 5, 6]
>>> [x * x for x in numbers]
[1, 4, 9, 16, 25, 36]
```

还可以使用生成器表达式:

```
>>> lazy_squares = (x * x for x in numbers)
>>> lazy_squares
<generator object <genexpr> at 0x10d1f5510>
>>> next(lazy_squares)
1
>>> list(lazy_squares)
[4, 9, 16, 25, 36]
```

 

- 容器是一系列元素的集合，str、list、set、dict、file、sockets对象都可以看作是容器，容器都可以被迭代（用在for，while等语句中），因此他们被称为可迭代对象。

- 可迭代对象实现了__iter__方法，该方法返回一个迭代器对象。
- 迭代器持有一个内部状态的字段，用于记录下次迭代返回值，它实现了__next__和__iter__方法，迭代器不会一次性把所有元素加载到内存，而是需要的时候才生成返回结果。这对于大数据量处理，将会非常有用
- 生成器是一种特殊的迭代器，它的返回值不是通过return而是用yield。







http://www.cnblogs.com/tester-l/p/5722164.html