[TOC]

# JSqlParser Examples of SQL parsing

### Simple SQL parsing

```
Statement stmt = CCJSqlParserUtil.parse("SELECT * FROM tab1");

```

Starting from **stmt** you can dive into the parsing result.

### SQL script parsing

```
Statements stmt = CCJSqlParserUtil.parseStatements("SELECT * FROM tab1; SELECT * FROM tab2");

```

Starting from **stmt** you can use the parsing result.

### Simple Expression parsing

```
Expression expr = CCJSqlParserUtil.parseExpression("a*(5+mycolumn)");

```

Starting from **expr** you can use the parsing result.

从expr开始，你可以使用解析结果。

### Extract table names from SQL

```
Statement statement = CCJSqlParserUtil.parse("SELECT * FROM MY_TABLE1");
Select selectStatement = (Select) statement;
TablesNamesFinder tablesNamesFinder = new TablesNamesFinder();
List<String> tableList = tablesNamesFinder.getTableList(selectStatement);

```

In **tableList** are all table names of the parsed SQL statement. The table names finder is an example of JSqlParser visitor pattern structure. You can use the visitor pattern to traverse the parsing result and compute on it.

### Apply aliases to all expressions

将别名应用于所有表达式

```
Select select = (Select) CCJSqlParserUtil.parse("select a,b,c from test");
final AddAliasesVisitor instance = new AddAliasesVisitor();
select.getSelectBody().accept(instance);

```

As a result you will get **SELECT a AS A1, b AS A2, c AS A3 FROM test**. At the moment the prefix can be configured.

### Add a column or expression to a select

```
Select select = (Select) CCJSqlParserUtil.parse("select a from mytable");
SelectUtils.addExpression(select, new Column("b"));

```

Now **select** contains **SELECT a, b FROM mytable**.

### Visualize parsing

Sometime you need to know, what JSqlParser is doing parsing a special SQL statement. So the easiest way to achieve this, is to generate a parser that outputs debug messages.

1. So clone the JSqlParser repository.

2. Open file JSqlParser.jj.

3. Edit the optione section in this file. Look for special options starting with DEBUG_.

   options{ ... DEBUG_PARSER=true; DEBUG_LOOKAHEAD=false ; DEBUG_TOKEN_MANAGER=false; ... }

4. Build the parser.

No you will get output like this:

```
Call:   Statement
  Call:   SingleStatement
    Call:   Select
      Call:   SelectBody
	Call:   PlainSelect
	  Consumed token: <"SELECT" at line 1 column 1>
	  Call:   SelectItemsList
	    Call:   SelectItem
	      Consumed token: <"*" at line 1 column 8>
	    Return: SelectItem
	  Return: SelectItemsList
	  Consumed token: <"FROM" at line 1 column 10>
	  Call:   FromItem
	    Call:   Table
	      Call:   RelObjectName
		Consumed token: <<S_IDENTIFIER>: "MYTABLE" at line 1 column 15>
	      Return: RelObjectName
	    Return: Table
	  Return: FromItem

```

...