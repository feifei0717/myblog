**isEmpty ** 判断某字符串是否为空，为空的标准是  str==null或 str.length()==0 

```
    StringUtils.isEmpty(null) = true 

　　StringUtils.isEmpty("") = true 
　　StringUtils.isEmpty(" ") = false//注意在 StringUtils 中空格作非空处理  
　　StringUtils.isEmpty("   ") = false 
　　StringUtils.isEmpty("bob") = false 
　　StringUtils.isEmpty(" bob ") = false
```

**isBlank **  判断某字符串是否为空或长度为0或由空白符(whitespace) 构成 

```
   StringUtils.isBlank(null) = true 

　　StringUtils.isBlank("") = true 
　　StringUtils.isBlank(" ") = true 
　　StringUtils.isBlank("        ") = true 
　　StringUtils.isBlank("\t \n \f \r") = true   //对于制表符、换行符、换页符和回车符  
　　StringUtils.isBlank()   //均识为空白符  
　　StringUtils.isBlank("\b") = false   //"\b"为单词边界符  
　　StringUtils.isBlank("bob") = false 
　　StringUtils.isBlank(" bob ") = false 
```

源码:

```
    public static boolean isEmpty(final CharSequence cs) {
        return cs == null || cs.length() == 0;
    }  
    public static boolean isBlank(final CharSequence cs) {
        int strLen;
        if (cs == null || (strLen = cs.length()) == 0) {
            return true;
        }
        for (int i = 0; i < strLen; i++) {
            if (Character.isWhitespace(cs.charAt(i)) == false) {
                return false;
            }
        }
        return true;
    }  
```

个人理解：isBlank 是isEmpty  的基础上加了对空白符的判断，所以一般需求直接用isBlank就可以

来源： <<http://itdreamer.blog.sohu.com/257298050.html>>

 