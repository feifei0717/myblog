[TOC]



# 什么是JSqlParser?

JSqlParser is a SQL statement parser. It translates SQLs in a traversable hierarchy of Java classes. JSqlParser is not limited to one database but provides support for a lot of specials of Oracle, SqlServer, MySQL, PostgreSQL ... To name some, it has support for Oracles join syntax using (+), PostgreSQLs cast syntax using ::, relational operators like != and so on. Then the result can be accessed in a structured way. The generated Java class hierarchy can be navigated using the [Visitor Pattern](http://en.wikipedia.org/wiki/Visitor_pattern).

JSqlParser是一个SQL语句分析器。 它将SQL翻译为Java类的遍历层次结构。 JSqlParser并不局限于一个数据库，而是为Oracle，SqlServer，MySQL，PostgreSQL等许多特性提供支持。举个例子，它支持Oracles使用（+）连接语法，PostgreSQL使用::关系转换语法 运营商喜欢！=等等。 然后可以以结构化的方式访问结果。 生成的Java类层次结构可以使用访问者模式进行导航。

# Contributions

To help JSqlParsers development you are encouraged to provide

- feedback
- bugreports
- pull requests for new features
- improvement requests

Also I would like to know about needed examples or documentation stuff.

\#Donations

If you want to contribute or help this way, here is the possibility: [![PayPal donate button](https://camo.githubusercontent.com/464a9061e9a499959a6ce1028293e7a4ae9aebfb/687474703a2f2f696d672e736869656c64732e696f2f70617970616c2f646f6e6174652e706e673f636f6c6f723d79656c6c6f77)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=64CCN9JJANZXA)

\#Modifications JSqlParser is continuously improved. All modifications could be followed at the [Release Notes](https://github.com/JSQLParser/JSqlParser/releases). Additional News can be found [here](https://github.com/JSQLParser/JSqlParser/wiki/News).

Modifications before GitHubs release tagging are listed in the [Older Releases](Older Releases) page.

# How it works?

The parser is built using **JavaCC**. The core JavaCC grammar for SQL has been taken from Guido Draheim's site and has been changed in order to produce a hierarchy of Java classes. The classes called **deparsers** are used to build again the SQL text of the class hierarchy.

Over the time the grammar was extended and now is a combination of specialities of grammars of various database systems. It is grown by need. So some (not all) Oracle, MySql, SQLServer, PostgreSQL specific aspects can be parsed.

解析器是使用JavaCC构建的。 SQL的核心JavaCC语法取自Guido Draheim的网站，为了生成Java类的层次结构而进行了更改。 称为解析器的类用于重新构建类层次结构的SQL文本。

随着时间的推移，语法被延伸，现在是各种数据库系统的语法特点的组合。 它是根据需要而生长的。 所以有些（不是全部）Oracle，MySql，SQLServer，PostgreSQL的具体方面都可以被解析。

# Maven

To use **JSqlParser** in a maven project you have to include the following dependency:

```
<dependency>
    <groupId>com.github.jsqlparser</groupId>
    <artifactId>jsqlparser</artifactId>
    <version>0.9</version>
</dependency>

```

Be sure you added the latest release.

# Examples

Find some examples of JSqlParsers usage.

- Parsing [here](https://github.com/JSQLParser/JSqlParser/wiki/Examples-of-SQL-parsing).
- Building [here](https://github.com/JSQLParser/JSqlParser/wiki/Examples-of-SQL-building).
- Simple expression evaluation [here](https://github.com/JSQLParser/JSqlParser/wiki/Example-of-expression-evaluation)

Feel free to provide more examples.

查找一些JSqlParsers用法的例子。

- 在这里解析。
- 在这里建设。
- 这里简单的表达评价

随意提供更多的例子。

## Original project

This is a fork of the jsqlparser originally developed by ultimoamore.

Original project websites:

- [http://jsqlparser.sourceforge.net](http://jsqlparser.sourceforge.net/)
- <http://sourceforge.net/projects/jsqlparser/>

