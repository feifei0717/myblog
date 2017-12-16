# [thymeleaf 学习笔记](http://www.blogjava.net/bjwulin/archive/2013/02/07/395234.html)

thymeleaf，我个人认为是个比较好的模板，性能也比一般的，比如freemaker的要高，而且把将美工和程序员能够结合起来，美工能够在浏览器中查看静态效果，程序员可以在应用服务器查看带数据的效果。
thymeleaf是一个支持html原型的自然引擎，它在html标签增加额外的属性来达到模板+数据的展示方式，由于浏览器解释html时，忽略未定义的标签属性，因此thymeleaf的模板可以静态运行。
由于thymeleaf在内存缓存解析后的模板，解析后的模板是基于tree的dom节点树，如果你在一个模板执行中生成大小几十兆字节的XML文件，你可能不应该使用Thymeleaf。

thymeleaf 的context，即提供数据的地方，基于web的context，即WebContext相对context增加 param,session,application变量，并且自动将request atttributes添加到context variable map，可以在模板直接访问。

在模板处理前，thymeleaf还会增加一个变量execInfo，比如${execInfo.templateName},${execInfo.now}等。

数据访问模式：

${...}，变量引用模式，比如${myBean.property}，如果用springDialect，则使用的是spring EL，如果不用spring，则用的ognl。

*{...}，选择表达式，一般是th:object之后，直接取object中的属性。当没有选取对象时，其功能等同${...},*{firstName}也等同于${#object.firstName},#object代表当前选择的对象。

@{...}链接url的表达式。th:href="@{/xxx/aa.do(id=${o.id})"，会自动进行url-encoding的处理。@{...}内部可以是需要计算的表达式，比如：

th:href=”@{'/details/'+${user.login}(orderId=${o.id})}"

\#{...}，i18n，国际化。

需要注意的：

\#{${welcomeMsgKey}(${session.user.name})}：i18n message支持占位。各个表达式支持嵌套。

表达式基本对象：

\#ctx：context object

\#root或者#vars

\#locale

\#httpServletRequest

\#httpSession

表达式功能对象：

\#dates：java.util.Date的功能方法类。

\#calendars:类似#dates，面向java.util.Calendar

\#numbers:格式化数字的功能方法类。

\#strings：字符串对象的功能类，contains,startWiths,prepending/appending等等。

\#objects:对objects的功能类操作。

\#bools:对布尔值求值的功能方法。

\#arrays：对数组的功能类方法。

\#lists:对lists功能类方法

\#sets

\#maps

\#aggregates:对数组或者集合创建聚合的功能方法，

th:text="${#aggregates.sum(o.orderLines.{purchasePrice * amount})}"

\#messages:在变量表达式中获取外部信息的功能类方法。

\#ids：处理可能重复的id属性的功能类方法。

条件操作：

(if)?(then):满足条件，执行then。

(if)?(then):(else)

(value)?:(defalutValue)

一些标签：

th:text="${data}",将data的值替换该属性所在标签的body。字符常量要用引号，比如th:text="'hello world'",th:text="2011+3",th:text="'my name is '+${user.name}"

th:utext，和th:text的区别是"unescaped text"。

th:with,定义变量，th:with="isEven=${prodStat.count}%2==0"，定义多个变量可以用逗号分隔。

th:attr，设置标签属性，多个属性可以用逗号分隔，比如th:attr="src=@{/image/aa.jpg},title=#{logo}"，此标签不太优雅，一般用的比较少。

th:[tagAttr],设置标签的各个属性，比如th:value,th:action等。

可以一次设置两个属性，比如：th:alt-title="#{logo}"

对属性增加前缀和后缀，用th:attrappend，th:attrprepend,比如：th:attrappend="class=${' '+cssStyle}"

对于属性是有些特定值的，比如checked属性，thymeleaf都采用bool值，比如th:checked=${user.isActive}

th:each, 循环，<tr th:each="user,userStat:${users}">,userStat是状态变量，有 index,count,size,current,even,odd,first,last等属性，如果没有显示设置状态变量，thymeleaf会默 认给个“变量名+Stat"的状态变量。

th:if or th:unless，条件判断，支持布尔值，数字（非零为true)，字符，字符串等。

th:switch，th:case，选择语句。 th:case="*"表示default case。

th:fragment，th:include,th:substituteby:fragment为片段标记，指定一个模板内一部分代码为一个片段，然后在其它的页面中用th:include或th:substituteby进行包含。

包含的格式为，格式内可以为表达式，比如th:include="footer::$(user.logined)?'logined':'notLogin'"：

"templatename::fragname"，指定模板内的指定片段。

"templateName::[domselector]"，指定模板的dom selector，被包含的模板内不需要th:fragment.

”templatename"，包含整个模板。

th:include和th:substituteby的区别在于前者包含片段的内容到当前标签内，后者是用整个片段（内容和上一层）替换当前标签（不仅仅是标签内容）。

th:remove="all|body|tag|all-but-first"，一般用于将mock数据在真实环境中移除，all表示移除标签以及标签内容，body只移除内容，tag只移除所属标签，不移除内容，all-but-first，除第一条外其它不移除。

由 于一个标签内可以包含多个th:x属性，其先后顺序为：include,each,if/unless/switch/case,with,attr /attrprepend/attrappend,value/href,src ,etc,text/utext,fragment,remove。

内联文本：[[...]]内联文本的表示方式，使用时，必须先用th:inline="text/javascript/none"激活，th:inline可以在父级标签内使用，甚至作为body的标签。内联文本尽管比th:text的代码少，但是不利于原型显示。

内联js:

<scriptth:inline="javascript">

/*<![CDATA[*/

...

var username = /*[[${sesion.user.name}]]*/ 'Sebastian';

...

/*]]>*/

</script>

js附加代码：

/*[+

var msg = 'This is a working application';

+]*/

js移除代码：

/*[- */
var msg = 'This is a non-working template';
/* -]*/

模板缓存：

1、指定特定的缓存：

templateResolver.setCacheable(false);
templateResolver.getCacheablePatternSpec().addPattern("/users/*");

2、清除缓存：

templateEngine.clearTemplateCache();
templateEngine.clearTemplateCacheFor("/users/userList");





补充点url知识：

1、绝对路径：http://news.sina.com.cn

2、相对路径：

​    2.1：页面相对路径，一般指相对当前请求的url，比如 aa.do

​    2.2:上下文相对，比如/xxx/aa.do

​    2.3:服务器相对路径，比如~/other/xxx/aa.do,允许切换到相同服务器不同上下文的路径。

不做浮躁的人

来源： <http://www.blogjava.net/bjwulin/archive/2013/02/07/395234.html>