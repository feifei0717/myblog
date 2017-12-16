oracle数据导出txt及导入txt

分类: database
日期: 2014-06-11

原文地址: 

http://blog.chinaunix.net/uid-29632145-id-4299439.html

------

****[oracle数据导出txt及导入txt]() *2014-06-11 16:30:11*

分类： Oracle

oracle数据导出txt及导入txt

 

ORACLE数据导出TXT及从TXT导入：

导出到TXT文件：

 

1、用PL/SQL DEV打开CMD窗口。

2、spool d:/output.txt;

 

3、set heading off; --去掉表头

4、select * from usergroup;

5、spool off;

  www.2cto.com  

TXT导入到ORACLE：

1、用PL/SQL DEV的TOOLS工具下的“Text Importer”。

2、在“Data from Textfile”标签输入TXT文件（output.txt）。

 

3、在“Configuration”下面设置字段数、字段分隔符、行分隔符。

 

4、在“Data to Oracle”标签下选择需要导入的[数据库](http://www.2cto.com/database/)的用户、表。

 

5、在“Fields”下设置TXT字段与目标表字段的对应关系与数据类型。

6、点击下面的“Import”即可。