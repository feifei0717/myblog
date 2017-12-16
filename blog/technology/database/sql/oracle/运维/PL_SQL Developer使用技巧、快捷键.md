PL_SQL Developer使用技巧、快捷键

分类: database
日期: 2014-05-10

 

http://blog.chinaunix.net/uid-29632145-id-4247232.html

------

****[PL/SQL Developer使用技巧、快捷键]() *2014-05-10 22:00:45*

分类： Oracle

1、类SQL PLUS窗口:File->New->Command Window，这个类似于oracle的客户端工具sql plus，但比它好用多了。

2、设置关键字自动大写:Tools->Preferences->Editor，将Keyword case选择Uppercase。这样在窗口中输入sql语句时，关键字会自动大写，而其它都是小写。这样阅读代码比较容易，且保持良好得编码风格，同理，在Tools->Preferences->Code Assistant(助手)里可以设置代码提示延迟时间、输入几个字符时提示、数据库对象的大写、小写，首字母大写等；

3、查看执行计划:选中需要分析的SQL语句，然后点击工具栏的Explain plan按钮(即执行计划)，或者直接按F5；这个主要用于分析SQL语句执行效率，分析表的结构，便于为sql调优提供直观依据；

4、自动替换:快捷输入SQL语句，例如输入s，按下空格，自动替换成SELECT；再例如，输入sf，按下空格，自动替换成SELECT * FROM，非常方便，节省了大量的时间去编写重复的SQL语句。

设置方法：菜单Tools–>Preferences–>Editor–>AutoReplace(自动替换)–>Edit

1)、建立一个文本文件shortcuts.txt，并写入如下内容：
s=SELECT
复制代码另存到PL/SQL Developer的安装路径下的~/PlugIns目录下
2)、Tools–>Preferences–>User Interface–>Editor–>AutoReplace，选中Enable复选框，然后浏览文件选中之前创建的shortcuts.txt，点击Apply。
3)、重启PL/SQL Developer，在sql窗口中输入s+空格，sc+空格做测试。
注意：shortcuts.txt不可删除掉，否则快捷键无法用

下面定义了一些规则作为参考
i=INSERT
u=UPDATE
s=SELECT
f=FROM
w=WHERE
o=ORDER BY
d=DELETE
df=DELETE FROM
sf=SELECT * FROM
sc=SELECT COUNT(*) FROM
sfu=SELECT * FROM FOR UPDATE
cor=CREATE OR REPLACE
p=PROCEDURE
fn=FUNCTION
t=TIGGER
v=VIEW
sso=SET serveroutput ON;

设置快捷键(设置方法：菜单Tools–>Preferences–>用户界面–>键配置)
新建sql窗口：ctrl+shift+s
新建命令窗口：ctrl+shift+c
新建测试窗口：ctrl+shift+t
PL/SQL Developer美化器：ctrl+shift+f
重做：ctrl+shift+z
撤销：ctrl+z
清除：ctrl+d(慎用，不可恢复，俺是禁用哦O(∩_∩)O~)
选中所有：ctrl+a
缩进：tab
取消缩进：shift+tab
大写：ctrl+shift+x
小写：ctrl+shift+y
注释：ctrl+h
取消注释：ctrl+m
查找：ctrl+f
显示表结构：ctrl+鼠标悬停在表名上
模板列表：shift+alt+r
窗口列表：ctrl+w

5、执行单条SQL语句:按F8键

6、TNS Names：菜单Help->Support Info(支持信息)->TNS Names，可以查看Oracle的tnsnames.ora;

7、调试存储过程
在使用PL/SQL Developer操作Oracle时，有时候调用某些存储过程，或者调试存储过程；
调用存储过程的方法：
1)、首先，在PL/SQL Developer左边的Browser中选择Procedures，查找需要调用的存储过程；
2)、然后，选中调试的存储过程，点击右键，选择Test，在弹出来的Test scrīpt窗口中，对于定义为in类型的参数，需要给该参数的Value输入值；最后点击上面的条数按钮：Start debugger或者按F9；
3)、最后点击：RUN 或者Ctrl+R 。

调试快捷键
切换断点：ctrl+b
开始：f9
运行：ctrl+r
单步进入：ctrl+n
单步跳过：ctrl+o
单步退出：ctrl+t
运行到异常：ctrl+y

8、模板快捷键

9、登录后默认自动选中My Objects  

默认情况下，PLSQL Developer登录后，Brower里会选择All objects，如果你登录的用户是dba，要展开tables目录，正常情况都需要Wait几秒钟，而选择My Objects后响应速率则是以毫秒计算的。

设置方法：
Tools菜单–>Brower Filters，会打开Brower Folders的定单窗口，把“My Objects”设为默认即可。
Tools菜单–>Brower Folders中把你经常点的几个目录（比如：Tables Views Seq Functions Procedures）移得靠上一点，并加上颜色区分，这样你的平均寻表时间会大大缩短，试试看。

优先级，从左往右
Tables–>Tablespaces–>Procedures–>Users–>Roles