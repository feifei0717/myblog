[notepad++](http://www.cnblogs.com/haven/archive/2012/12/21/2828098.html)  真是强大，几乎你能想到的处理文本方法都可以用它来实现，因为他有强大的插件团！

例如1：去除重复行

先安装TextFx插件

在菜单TextFX-->TextFX Tools下面进行操作

1 确定“sort outputs only unique” 该选项 已经选择

2 选择要去除重复行的文本

3 选择sort lines  case sensitive"  或者  "sort lines case insensitive "按钮

重复行就消失了！！

 

**以下转载 关于更多此文件的使用方法：**

安装：打开 notepad++  插件 -> Plugin Manager -> Show Plugin Manager -> available ->选中 TextFX ->install》 
（注：如果没有插件的话--首先updates插件） 
Notepad++插件TextFX Characters是一款默认安装的插件，由于功能强大，被编程爱好者认为是最好的Notepad++插件，第二名是Light Explorer。但由于TextFX插件命令过多，而且没有汉化版，不容易理解，闪电博客特别介绍下几个常用命令功能： 
\1. 删除程序空行  
选择相应的文本  
点击TextFX —> TextFX Edit —> Delete Blank Lines  
点击TextFX —> TextFX Edit —> Delete Surplus Blank Lines 
\2. 为代码增加行号  
选择要增加行号的文本(选择时会提示“No text selected”)  
点击TextFX —> TextFX Tools —> Insert Line Numbers  
\3. 删除程序行号或者首字  
选择相应的文本  
点击TextFX —> TextFX Tools —> Delete Line Numbers or First word  
\4. 整理xml文本格式。  
这个功能不错，可以很快将一行文本整理成规范的xml文件。(这个功能用来处理blogger的xml文档很不错，我自己的文档经过无数次的编辑已经乱得不成样子，经过这样一整理，可读性大大提高。)  
选中所有文本  
点击TextFX—>HTML Tidy—>Tidy: Reindent XML  
同样在处理HTML文件，也有类似功能。 
\5. 改变字符大小写  
选择相应的文本  
点击TextFX —> TextFX Characters, 可以选择如下几种形式：  
UPPER CASE 全部大写  
lower case 全部小写  
Proper Case 首字大写  
Sentense case 句子模式  
iNVERT cASE 首字小写，其他大写 
\6. 去掉文本中的HTML元素  
选择HTML元素  
点击TextFX —> TextFX Convert —> Strip HTML tags table tabs  
\7. 转换为HTML实体  
即把“<”转换成“&lt;”、把“>”转换成 “&gt;”。（可以用来轻松为blogger的文章插入代码。）  
选择相应的文本  
点击TextFX —> TextFX Convert —> Encode HTML (&<>") 
//========================================================= 华丽的分割线
Notepad++ 是一款免费的开源的跨平台的代码编辑器。它支持包括中文在内的多国语言，功能强大，除了可以用来制作一般的纯文字说明文件，也十分适合当作撰写电脑程序的编辑器。Notepad++不仅可以实现语法高亮显示，也有语法折叠功能，并且支持宏以及扩充基本功能的外挂模组。 
自从使用notepad++来代替dreamweaver编辑网页文件后，notepad++强大的代码高亮和标签选中后自动寻找闭合标签功能让敲代码变得更加方便。以前用dreamweaver的时候，代码一多的话，要想找到一个闭合的标签（比如“div”，在未加任何注释的情况下）的起始标签要花很长一段时间。但是在notepad++上面，只需点击闭合标签，notepad++就自动找到起始标签并且高亮它，非常方便了像我这样的懒人。 
今天在使用notepad++的时候，遇到一个从外来文档中复制内容到notepad++中有多余空行的问题，现把解决方案提供给大家，希望对遇到这种问题的童鞋有帮助。 
我在记事本或者在chrome的审查元素中复制代码到notepad++的时候，notepad++会很“有爱”的给每行代码加上一行空行。代码少的话，就手工删除空行。但是今天从记事本中复制了近100行的base64代码，要是还像以前手工删除空格的话，需要的时间可想而知。于是到Google上一阵狂搜，终于找到解决方法——使用notepad++自带的插件TextFX。如上图。 
首先，选中需要删除空行的代码，然后依次点击TextFX→TextEdit→Delete Blank Lines，那些恼人的空行就消失了。 
其实notepad++自带的TextFX插件功能非常强大，只不过我一直把它给忽略了。现在给大家简单介绍一下这个插件部分常用功能： 
TextFX Characters -> UPPER CASE, lower case, Proper Case, Sentence case, iNVERT cASE: 批量改变选中文字的大小写。  
TextFX Edit -> Delete Blank Lines: 这个就是我刚才说的删除空格。  
TextFX Edit -> Delete Surplus Blank Lines: 将选中文字的多个连续空格转换成一个空格。  
TextFX Convert -> Encode URI Component: 转换选中文字中的标点符号成16进制，让其对URL友好。  
TextFX Convert -> Encode HTML (&<>”): 将HTML文件中的尖角符号转换成16进制。  
TextFX HTML Tidy -> Tidy Reindent XML: 将未格式化的xml文件按照规格缩进。（很实用的说）  
TextFX Tools -> Sort lines case sensitive, Sort lines case insensitive: 排序。  
TextFX Tools -> Insert Line Numbers: 为选中的文字加上行号，基于此文件的第一行排序。  
TextFX Tools -> Word Count: 对选中的文字记数，包括详细的文字总数，行数等等。 
//==============================================

 

来源： <http://blog.csdn.net/ccc7560673/article/details/16880875>