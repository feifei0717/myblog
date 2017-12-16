第一次发现JavaScript中replace() 方法如果直接用str.replace("-","!") 只会替换第一个匹配的字符.

而str.replace(/\-/g,"!")则可以全部替换掉匹配的字符(g为全局标志)。 
replace() 
The replace() method returns the string that results when you replace text matching its first argument 
(a regular expression) with the text of the second argument (a string). 
If the g (global) flag is not set in the regular expression declaration, this method replaces only the first 
occurrence of the pattern. For example, 
var s = "Hello. Regexps are fun." ;s = s.replace(/\./, "!" ); // replace first period with an exclamation pointalert(s); 
produces the string “Hello! Regexps are fun.” Including the g flag will cause the interpreter to 
perform a global replace, finding and replacing every matching substring. For example, 
var s = "Hello. Regexps are fun." ;s = s.replace(/\./g, "!" ); // replace all periods with exclamation pointsalert(s); 
yields this result: “Hello! Regexps are fun!” 
所以可以用以下几种方式.： 
string.replace(/reallyDo/g, replaceWith); 
string.replace(new RegExp(reallyDo, 'g'), replaceWith); 
string：字符串表达式包含要替代的子字符串。 
reallyDo：被搜索的子字符串。 
replaceWith：用于替换的子字符串。 

```

<script type="text/javascript"> 
　　String.prototype.replaceAll = function(reallyDo, replaceWith, ignoreCase) { 
　 if (!RegExp.prototype.isPrototypeOf(reallyDo)) { 
return this.replace(new RegExp(reallyDo, (ignoreCase ? "gi": "g")), replaceWith); 
} else { 
return this.replace(reallyDo, replaceWith); 
} 
} 
</script> 
```



#### 

来源： <http://www.jb51.net/article/25739.htm>