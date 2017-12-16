# Jdom2之轻松解析XML  DOM,SAX,JDom,Dom4j说明

关于XML的解析，是编程中不可或缺的一部分，也是很重要的一部分，那么目前对XML的解析工具类，也有很多，现在广泛使用主要有4中解析方式，DOM,SAX,JDom,Dom4j， 首先，从本质上说一下，其实只有2中解析方式 ，就是DOM和SAX解析，至于另外的JDom和Dom4j，则是面向JAVA的对DOM的更高一层的封装，当然通过这层封装，改变不仅仅是代码变动，更大的是性能的提升下面通过一张表格对比分析下

## 4中解析方式的异同

| DOM       | DOM 是用与平台和语言无关的方式表示 XML 文档的官方 W3C 标准。DOM 是以层次结构组织的节点或信息片断的集合。这个层次结构允许开发人员在树中寻找特定信息。分析该结构通常需要加载整个文档和构造层次结构，然后才能做任何工作。由于它是基于信息层次的，因而 DOM 被认为是基于树或基于对象的。DOM 以及广义的基于树的处理具有几个优点。首先，由于树在内存中是持久的，因此可以修改它以便应用程序能对数据和结构作出更改。它还可以在任何时候在树中上下导航，而不是像 SAX 那样是一次性的处理。DOM 使用起来也要简单得多。另一方面，对于特别大的文档，解析和加载整个文档可能很慢且很耗资源，因此使用其他手段来处理这样的数据会更好。这些基于事件的模型，比如 SAX。 |
| --------- | ---------------------------------------- |
| **SAX**   | **SAX处理的优点非常类似于流媒体的优点。分析能够立即开始，而不是等待所有的数据被处理。而且，由于应用程序只是在读取数据时检查数据，因此不需要将数据存储在内存中。这对于大型文档来说是个巨大的优点。事实上，应用程序甚至不必解析整个文档；它可以在某个条件得到满足时停止解析。一般来说，SAX 还比它的替代者 DOM 快许多。** |
| **JDOM**  | **JDOM的目的是成为 Java 特定文档模型，它简化与 XML 的交互并且比使用 DOM 实现更快。由于是第一个 Java 特定模型，JDOM 一直得到大力推广和促进。正在考虑通过“Java 规范请求 JSR-102”将它最终用作“Java 标准扩展”。从 2000 年初就已经开始了 JDOM 开发。JDOM 与 DOM 主要有两方面不同。首先，JDOM 仅使用具体类而不使用接口。这在某些方面简化了 API，但是也限制了灵活性。第二，API 大量使用了 Collections 类，简化了那些已经熟悉这些类的 Java 开发者的使用。JDOM 文档声明其目的是“使用 20%（或更少）的精力解决 80%（或更多）Java/XML 问题”（根据学习曲线假定为 20%）。JDOM 对于大多数 Java/XML 应用程序来说当然是有用的，并且大多数开发者发现 API 比 DOM 容易理解得多。JDOM 还包括对程序行为的相当广泛检查以防止用户做任何在 XML 中无意义的事。然而，它仍需要您充分理解 XML 以便做一些超出基本的工作（或者甚至理解某些情况下的错误）。这也许是比学习 DOM 或 JDOM 接口都更有意义的工作。JDOM 自身不包含解析器。它通常使用 SAX2 解析器来解析和验证输入 XML 文档（尽管它还可以将以前构造的 DOM 表示作为输入）。它包含一些转换器以将 JDOM 表示输出成 SAX2 事件流、DOM 模型或 XML 文本文档。JDOM 是在 Apache 许可证变体下发布的开放源码。** |
| **DOM4J** | **DOM4J 它是 JDOM 的一种智能分支。它合并了许多超出基本 XML 文档表示的功能，包括集成的 XPath 支持、XML Schema 支持以及用于大文档或流化文档的基于事件的处理。它还提供了构建文档表示的选项，它通过 DOM4J API 和标准 DOM 接口具有并行访问功能。从 2000 下半年开始，它就一直处于开发之中。为支持所有这些功能，DOM4J 使用接口和抽象基本类方法。DOM4J 大量使用了 API 中的 Collections 类，但是在许多情况下，它还提供一些替代方法以允许更好的性能或更直接的编码方法。直接好处是，虽然 DOM4J 付出了更复杂的 API 的代价，但是它提供了比 JDOM 大得多的灵活性。在添加灵活性、XPath 集成和对大文档处理的目标时，DOM4J 的目标与 JDOM 是一样的：针对 Java 开发者的易用性和直观操作。它还致力于成为比 JDOM 更完整的解决方案，实现在本质上处理所有 Java/XML 问题的目标。在完成该目标时，它比 JDOM 更少强调防止不正确的应用程序行为。DOM4J 是一个非常非常优秀的Java XML API，具有性能优异、功能强大和极端易用使用的特点，同时它也是一个开放源代码的软件。如今你可以看到越来越多的 Java 软件都在使用 DOM4J 来读写 XML，特别值得一提的是连 Sun 的 JAXM 也在用 DOM4J。** |

## **DOM与SAX在项目中如何抉择？**

* DOM 采用建立树形结构的方式访问 XML 文档，而 SAX 采用的事件模型。 DOM 解析器把 XML 文档转化为一个包含其内容的树，并可以对树进行遍历。用 DOM 解析模型的优点是编程容易，开发人员只需要调用建树的指令，然后利用navigation APIs访问所需的树节点来完成任务。可以很容易的添加和修改树中的元素。然而由于使用 DOM 解析器的时候需要处理整个 XML 文档，所以对性能和内存的要求比较高，尤其是遇到很大的 XML 文件的时候。由于它的遍历能力，DOM 解析器常用于 XML 文档需要频繁的改变的服务中。 
* SAX 解析器采用了基于事件的模型，它在解析 XML 文档的时候可以触发一系列的事件，当发现给定的tag的时候，它可以激活一个回调方法，告诉该方法制定的标签已经找到。SAX 对内存的要求通常会比较低，因为它让开发人员自己来决定所要处理的tag。特别是当开发人员只需要处理文档中所包含的部分数据时，SAX 这种扩展能力得到了更好的体现。但用 SAX 解析器的时候编码工作会比较困难，而且很难同时访问同一个文档中的多处不同数据。 个人感觉大数据XML解析适合用SAX解析，而相对较小一点的XML，对处理节点比较灵活多变比较适合用DOM，或着是其的高级版本JDOM，DOM4J，这一点就像JDBC,与Hibernate和MyBatics关系似的，可以根据自身的业务需求选择适合自己的解析器。下面给出JDOM之解析XML的代码，在这之前，笔者觉得有必要先了解一下，几个常用的读取节点方法



## 代码演示

```
Jdom的Element 对象常用的方法：
方 法 说 明
getChild("childname") 返回指定名字的子节点,如果同一级有多个同名子节点，则只返回第一个；如果没有返回null值。
getChildren("childname") 返回指定名字的子节点List集合。这样你就可以遍历所有的同一级同名子节点。
getAttributeValue("name") 返回指定属性名字的值。如果没有该属性则返回null,有该属性但是值为空，则返回空字符串。
getChildText("childname") 返回指定子节点的内容文本值。
getText() 返回该元素的内容文本值。
```

```
public Map<String, String> XmlElements(String xmlDoc){





Map<String, String> map=new HashMap<String, String>();


//创建一个新的字符串


StringReader read=new StringReader(xmlDoc);


//创建新的输入源SAX，解析器使用InputSource 对象来确定如何读取xml输入


InputSource source=new InputSource(read);


//创建一个SAXBUilder


SAXBuilder sb=new SAXBuilder();


try{



//通过输入源构建一个Document



Document doc=sb.build(source);



//取得根元素



Element root=doc.getRootElement();



//打印根元素的名字



System.out.println("根元素的名字:"+root.getName());



//得到根元素的所有子元素的集合



//List<Element> datas=root.getChildren();



 String did=root.getChildText("paper_id");



// System.out.println("文档ID:"+did);



 map.put("did", did);//把文档ID放入map集合



 String title=root.getChildText("title");



// System.out.println("标题:"+title);



 map.put("title", title);//把文档标题放入map集合



 List<Element> keywords=root.getChildren("keyword");



 StringBuffer sbs=new StringBuffer();//拼接关键词
 for(Element keyword:keywords){

 // System.out.println("关键词:"+keyword.getText());

sbs.append(keyword.getText()).append(";");
}
 map.put("keywords", sbs.toString());
 String abstracts=root.getChildText("abstract");
 map.put("abstracts", abstracts);
 // System.out.println("摘要:"+abstracts);










}catch(Exception e){



e.printStackTrace();


}





return map;




}
```

**XML解析实例**

```
<paper>
<paper_id>19379355</paper_id>
 <title>A new species of Chaptalia (Compositae, Mutisieae) from Minas Gerais, Brazil</title>
<alternative/>
 <abstract>A new species of Chaptalia, C. cipoensis, from the Serra do Cipo, Minas Gerais, Brazil, is described and illustrated. Comparisons are made between similar Brazilian species: C. chapadensis D. J. N. Hind, C, denliculala (Baker) Zardini and C. marlii (Baker) Zardini in Chaptalia sect. Archichaptalia.</abstract>
<abstract_alternative/>
 <keyword>Compositae: Mulisieae</keyword>
<keyword>Chaplalia</keyword>
<keyword>Brazil</keyword>
<keyword>taxonomy</keyword>
<keyword_alternative/>
<subject_heading/>
<classification>Q94</classification>
<language>eng</language>
<other_language>other</other_language>
<start_page>133</start_page>
<end_page>135</end_page>
<total_page_number>3</total_page_number>
</paper>
```

在解析的时候，就是将这个XML字符串，传给XmlElements方法，然后提取有用信息，通过JDOM，基本上就可以操作任何节点，代码也很简洁，下面会附上jdom2的jar包，用得到的道友们，可以下载下来使用







http://www.thinksaas.cn/topics/0/101/101817.html