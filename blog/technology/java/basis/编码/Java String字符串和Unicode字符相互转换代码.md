java环境安装后jdk的bin目录有个native2ascii.exe可以实现类似的功能，但是通过java代码也可以实现同样的功能。
字符串转换unicode java方法代码片段：

```
/**
 * 字符串转换unicode
 */
public static String string2Unicode(String string) {
 
    StringBuffer unicode = new StringBuffer();
 
    for (int i = 0; i < string.length(); i++) {
 
        // 取出每一个字符
        char c = string.charAt(i);
 
        // 转换为unicode
        unicode.append("\\u" + Integer.toHexString(c));
    }
 
    return unicode.toString();
}
```

unicode转换字符串java方法代码片段：

```
/**
 * unicode 转字符串
 */
public static String unicode2String(String unicode) {
 
    StringBuffer string = new StringBuffer();
 
    String[] hex = unicode.split("\\\\u");
 
    for (int i = 1; i < hex.length; i++) {
 
        // 转换出每一个代码点
        int data = Integer.parseInt(hex[i], 16);
 
        // 追加成string
        string.append((char) data);
    }
 
    return string.toString();
}
```

测试java代码片段：

```
public static void main(String[] args) {
    String test = "最代码网站地址:www.zuidaima.com";
 
    String unicode = string2Unicode(test);
     
    String string = unicode2String(unicode) ;
     
    System.out.println(unicode);
     
    System.out.println(string);
 
}
```

输出结果：
\u6700\u4ee3\u7801\u7f51\u7ad9\u5730\u5740\u3a\u77\u77\u77\u2e\u7a\u75\u69\u64\u61\u69\u6d\u61\u2e\u63\u6f\u6d

来源： http://www.jb51.net/article/56096.htm