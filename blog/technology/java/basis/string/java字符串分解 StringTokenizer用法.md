[TOC]

/Users/jerryye/backup/studio/AvailableCode/basis/java_utils/StringUtils字符串相关/string_demo/src/test/java/com/practice/StringTokenizerTest.java

# java字符串分解 StringTokenizer用法

## **StringTokenizer有两个常用的方法**：

1.hasMoreElements()。这个方法和hasMoreElements()方法的用法是一样的，只是StringTokenizer为了实现Enumeration接口而实现的方法，从StringTokenizer的声明可以看到：class StringTokenizer implements Enumeration。

2.nextElement()。这个方法和nextToken()方法的用法是一样的，返回此 StringTokenizer 的下一个标记。

## **StringTokenizer的三个构造方法：**

### **1.StringTokenizer(String str)。**

默认以” \t\n\r\f”（前有一个空格，引号不是）为分割符。

```
StringTokenizer st1 = new StringTokenizer("www ooobj com");
        while (st1.hasMoreElements()) {
            System.out.println("Token1:" + st1.nextToken());
        }1234
```

Token1:www 
Token1:ooobj 
Token1:com

### **2.StringTokenizer(String str, String delim)。**

指定delim为分割符。

```
StringTokenizer st = new StringTokenizer("www.ooobj.com", ".b");
        while (st.hasMoreElements()) {
            System.out.println("Token:" + st.nextToken());
        }1234
```

Token:www 
Token:ooo 
Token:j 
Token:com

### **3.StringTokenizer(String str, String delim, boolean returnDelims)。**

returnDelims为true的话则delim分割符也被视为标记。

```
StringTokenizer st2 = new StringTokenizer("www.ooobj.com", ".", true);
        while (st2.hasMoreElements()) {
            System.out.println("Token2:" + st2.nextToken());
        }1234
```

Token2:www 
Token2:. 
Token2:ooobj 
Token2:. 
Token2:com





http://blog.csdn.net/bug_moving/article/details/52549118