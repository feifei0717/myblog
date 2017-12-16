# sqlplus登录\连接命令、sqlplus命令的使用大全

我们通常所说的DML、DDL、DCL语句都是sql*plus语句，它们执行完后，都可以保存在一个被称为sql buffer的内存区域中，并且只能保存一条最近执行的sql语句，我们可以对保存在sql buffer中的sql 语句进行修改，然后再次执行，sqlplus一般都与数据库打交道。

常用：

sqlplus username/password  如：普通用户登录  sqlplus scott/tiger

sqlplus username/password@net_service_name 如: sqlplus scott/tiger@orcl
sqlplus  username/password as sysdba 如：sqlplus sys/admin as sysdba

sqlplus username/password@//host:port/sid

注意：sys和system需要以sysdba登录

在进入sql*plus之后，可以使用conn连接到其他用户，如：conn sys/admin as sysdba

在DOS环境下，输入“sqlplus /?”，如下：

```
C:\Documents and Settings\HH>sqlplus /?
SQL*Plus: Release 11.2.0.1.0 Production on 星期六 8月 13 16:56:46 2011
Copyright (c) 1982, 2010, Oracle.  All rights reserved.
SQL*Plus: Release 11.2.0.1.0 Production
Copyright (c) 1982, 2010, Oracle.  All rights reserved.
```


使用 SQL*Plus 执行 SQL, PL/SQL 和 SQL*Plus 语句。
用法 1: 

```
sqlplus -H | -V
    -H             显示 SQL*Plus 版本和用法帮助。
    -V             显示 SQL*Plus 版本。
```

用法 2: 

```
sqlplus [ [<option>] [{logon | /nolog}] [<start>] ]
  <option> 为: [-C <version>] [-L] [-M "<options>"] [-R <level>] [-S]
    -C <version>   将受影响的命令的兼容性设置为<version> 指定的版本。该版本具有"x.y[.z]" 格式。例如, -C 10.2.0
    -L             只尝试登录一次, 而不是 在出错时再次提示。
    -M "<options>" 设置输出的自动 HTML 标记。选项的格式为:
                   HTML [ON|OFF] [HEAD text] [BODY text] [TABLE text][ENTMAP {ON|OFF}] [SPOOL {ON|OFF}] [PRE[FORMAT] {ON|OFF}]
    -R <level>     设置受限模式, 以禁用与文件系统交互的SQL*Plus 命令。级别可以是 1, 2 或 3。最高限制级别为 -R 3, 该级别禁用与文件系统交互的所有用户命令。
    -S             设置无提示模式, 该模式隐藏命令的 SQL*Plus 标帜, 提示和回显 的显示。
 <logon> 为: {<username>[/<password>][@<connect_identifier>] | / }[AS {SYSDBA | SYSOPER | SYSASM}] [EDITION=value]
```


   指定数据库帐户用户名, 口令和数据库连接的连接标识符。如果没有连接标识符, SQL*Plus 将连接到默认数据库。
   AS SYSDBA, AS SYSOPER 和 AS SYSASM 选项是数据库管理权限。
   <connect_identifier> 的形式可以是 Net 服务名或轻松连接。
​     @[<net_service_name> | [//]Host[:Port]/<service_name>]
​       <net_service_name> 是服务的简单名称, 它解析为连接描述符。
​       示例: 使用 Net 服务名连接到数据库, 且数据库 Net 服务名为 ORCL。
​          sqlplus myusername/mypassword@ORCL

​       Host 指定数据库服务器计算机的主机名或 IP地址。
​       Port 指定数据库服务器上的监听端口。
​       <service_name> 指定要访问的数据库的服务名。
​       示例: 使用轻松连接连接到数据库, 且服务名为 ORCL。
​          sqlplus myusername/mypassword@Host/ORCL
   /NOLOG 选项可启动 SQL*Plus 而不连接到数据库。
   EDITION 指定会话版本的值。
 <start> 为: @<URL>|<filename>[.<ext>] [<parameter> ...]
   使用将分配给脚本中的替代变量的指定参数从 Web 服务器 (URL) 或本地文件系统 (filename.ext)运行指定的 SQL*Plus 脚本。
在启动 SQL*Plus 并且执行 CONNECT 命令后, 将运行站点概要文件 (例如, $ORACLE_HOME/sqlplus/admin/glogin.sql) 和用户概要文件例如, 工作目录中的 login.sql)。这些文件包含 SQL*Plus 命令。

除了sqlplus语句，在sql*plus中执行的其它语句我们称之为sql*plus命令。它们执行完后，不保存在sql buffer的内存区域中，它们一般用来对输出的结果进行格式化显示，以便于制作报表。

**下面就介绍一下一些常用的sql\*plus命令：**

\1. 执行一个SQL脚本文件
SQL>start file_name
SQL>@ file_name
我们可以将多条sql语句保存在一个文本文件中，这样当要执行这个文件中的所有的sql语句时，用上面的任一命令即可，这类似于dos中的批处理。
\2. 对当前的输入进行编辑
SQL>edit
\3. 重新运行上一次运行的sql语句
SQL>/
\4. 将显示的内容输出到指定文件
SQL> SPOOL file_name
在屏幕上的所有内容都包含在该文件中，包括你输入的sql语句。
\5. 关闭spool输出
SQL> SPOOL OFF
只有关闭spool输出，才会在输出文件中看到输出的内容。
6.显示一个表的结构
SQL> desc table_name
\7. COL命令：
主要格式化列的显示形式。
该命令有许多选项，具体如下：
COL[UMN] [{ column|expr} [ option ...]]
Option选项可以是如下的子句：
ALI[AS] alias
CLE[AR]
FOLD_A[FTER]
FOLD_B[EFORE]
FOR[MAT] format
HEA[DING] text
JUS[TIFY] {L[EFT]|C[ENTER]|C[ENTRE]|R[IGHT]}
LIKE { expr|alias}
NEWL[INE]
NEW_V[ALUE] variable
NOPRI[NT]|PRI[NT]
NUL[L] text
OLD_V[ALUE] variable
ON|OFF
WRA[PPED]|WOR[D_WRAPPED]|TRU[NCATED]
1). 改变缺省的列标题
COLUMN column_name HEADING column_heading
For example：
Sql>select * from dept；
DEPTNO DNAME LOC
---------- ---------------------------- ---------
10 ACCOUNTING NEW YORK
sql>col LOC heading location
sql>select * from dept；
DEPTNO DNAME location
--------- ---------------------------- -----------
10 ACCOUNTING NEW YORK
2). 将列名ENAME改为新列名EMPLOYEE NAME并将新列名放在两行上：
Sql>select * from emp
Department name Salary
---------- ---------- ----------
10 aaa 11
SQL> COLUMN ENAME HEADING 'Employee|Name'
Sql>select * from emp
Employee
Department name Salary
---------- ---------- ----------
10 aaa 11
note： the col heading turn into two lines from one line.
3). 改变列的显示长度：
FOR[MAT] format
Sql>select empno，ename，job from emp；
EMPNO ENAME JOB
---------- ---------- ---------
7369 SMITH CLERK
7499 ALLEN SALESMAN
7521 WARD SALESMAN
Sql> col ename format a40
EMPNO ENAME JOB
---------- ---------------------------------------- ---------
7369 SMITH CLERK
7499 ALLEN SALESMAN
7521 WARD SALESMAN
4). 设置列标题的对齐方式
JUS[TIFY] {L[EFT]|C[ENTER]|C[ENTRE]|R[IGHT]}
SQL> col ename justify center
SQL> /
EMPNO ENAME JOB
---------- ---------------------------------------- ---------
7369 SMITH CLERK
7499 ALLEN SALESMAN
7521 WARD SALESMAN
对于NUMBER型的列，列标题缺省在右边，其它类型的列标题缺省在左边
5). 不让一个列显示在屏幕上
NOPRI[NT]|PRI[NT]
SQL> col job noprint
SQL> /
EMPNO ENAME
---------- ----------------------------------------
7369 SMITH
7499 ALLEN
7521 WARD
6). 格式化NUMBER类型列的显示：
SQL> COLUMN SAL FORMAT $99，990
SQL> /
Employee
Department Name Salary Commission
---------- ---------- --------- ----------
30 ALLEN $1，600 300
7). 显示列值时，如果列值为NULL值，用text值代替NULL值
COMM NUL[L] text
SQL>COL COMM NUL[L] text
. 设置一个列的回绕方式
WRA[PPED]|WOR[D_WRAPPED]|TRU[NCATED]
COL1
\--------------------
HOW ARE YOU？
SQL>COL COL1 FORMAT A5
SQL>COL COL1 WRAPPED
COL1
\-----
HOW A
RE YO
U？
SQL> COL COL1 WORD_WRAPPED
COL1
\-----
HOW
ARE
YOU？
SQL> COL COL1 WORD_WRAPPED
COL1
\-----
HOW A
9). 显示列的当前的显示属性值
SQL> COLUMN column_name
10). 将所有列的显示属性设为缺省值
SQL> CLEAR COLUMNS
\8. 屏蔽掉一个列中显示的相同的值
BREAK ON break_column
SQL> BREAK ON DEPTNO
SQL> SELECT DEPTNO， ENAME， SAL
FROM EMP
WHERE SAL < 2500
ORDER BY DEPTNO；
DEPTNO ENAME SAL
---------- ----------- ---------
10 CLARK 2450
MILLER 1300
20 SMITH 800
ADAMS 1100
\9. 在上面屏蔽掉一个列中显示的相同的值的显示中，每当列值变化时在值变化之前插入n个空行。
BREAK ON break_column SKIP n
SQL> BREAK ON DEPTNO SKIP 1
SQL> /
DEPTNO ENAME SAL
---------- ----------- ---------
10 CLARK 2450
MILLER 1300
20 SMITH 800
ADAMS 1100
\10. 显示对BREAK的设置
SQL> BREAK
\11. 删除6、7的设置
SQL> CLEAR BREAKS
\12. Set 命令：
该命令包含许多子命令：
SET system_variable value
system_variable value 可以是如下的子句之一：
APPI[NFO]{ON|OFF|text}
ARRAY[SIZE] {15|n}
AUTO[COMMIT]{ON|OFF|IMM[EDIATE]|n}
AUTOP[RINT] {ON|OFF}
AUTORECOVERY [ON|OFF]
AUTOT[RACE] {ON|OFF|TRACE[ONLY]} [EXP[LAIN]] [STAT[ISTICS]]
BLO[CKTERMINATOR] {.|c}
CMDS[EP] {；|c|ON|OFF}
COLSEP {_|text}
COM[PATIBILITY]{V7|V8|NATIVE}
CON[CAT] {.|c|ON|OFF}
COPYC[OMMIT] {0|n}
COPYTYPECHECK {ON|OFF}
DEF[INE] {&|c|ON|OFF}
DESCRIBE [DEPTH {1|n|ALL}][LINENUM {ON|OFF}][INDENT {ON|OFF}]
ECHO {ON|OFF}
EDITF[ILE] file_name[.ext]
EMB[EDDED] {ON|OFF}
ESC[APE] {|c|ON|OFF}
FEED[BACK] {6|n|ON|OFF}
FLAGGER {OFF|ENTRY |INTERMED[IATE]|FULL}
FLU[SH] {ON|OFF}
HEA[DING] {ON|OFF}
HEADS[EP] {||c|ON|OFF}
INSTANCE [instance_path|LOCAL]
LIN[ESIZE] {80|n}
LOBOF[FSET] {n|1}
LOGSOURCE [pathname]
LONG {80|n}
LONGC[HUNKSIZE] {80|n}
MARK[UP] HTML [ON|OFF] [HEAD text] [BODY text] [ENTMAP {ON|OFF}] [SPOOL
{ON|OFF}] [PRE[FORMAT] {ON|OFF}]
NEWP[AGE] {1|n|NONE}
NULL text
NUMF[ORMAT] format
NUM[WIDTH] {10|n}
PAGES[IZE] {24|n}
PAU[SE] {ON|OFF|text}
RECSEP {WR[APPED]|EA[CH]|OFF}
RECSEPCHAR {_|c}
SERVEROUT[PUT] {ON|OFF} [SIZE n] [FOR[MAT] {WRA[PPED]|WOR[D_
WRAPPED]|TRU[NCATED]}]
SHIFT[INOUT] {VIS[IBLE]|INV[ISIBLE]}
SHOW[MODE] {ON|OFF}
SQLBL[ANKLINES] {ON|OFF}
SQLC[ASE] {MIX[ED]|LO[WER]|UP[PER]}
SQLCO[NTINUE] {> |text}
SQLN[UMBER] {ON|OFF}
SQLPRE[FIX] {#|c}
SQLP[ROMPT] {SQL>|text}
SQLT[ERMINATOR] {；|c|ON|OFF}
SUF[FIX] {SQL|text}
TAB {ON|OFF}
TERM[OUT] {ON|OFF}
TI[ME] {ON|OFF}
TIMI[NG] {ON|OFF}
TRIM[OUT] {ON|OFF}
TRIMS[POOL] {ON|OFF}
UND[ERLINE] {-|c|ON|OFF}
VER[IFY] {ON|OFF}
WRA[P] {ON|OFF}
1). 设置当前session是否对修改的数据进行自动提交
SQL>SET AUTO[COMMIT] {ON|OFF|IMM[EDIATE]| n}
2).在用start命令执行一个sql脚本时，是否显示脚本中正在执行的SQL语句
SQL> SET ECHO {ON|OFF}
3).是否显示当前sql语句查询或修改的行数
SQL> SET FEED[BACK] {6|n|ON|OFF}
默认只有结果大于6行时才显示结果的行数。如果set feedback 1 ，则不管查询到多少行都返回。当为off 时，一律不显示查询的行数
4).是否显示列标题
SQL> SET HEA[DING] {ON|OFF}
当set heading off 时，在每页的上面不显示列标题，而是以空白行代替
5).设置一行可以容纳的字符数
SQL> SET LIN[ESIZE] {80|n}
如果一行的输出内容大于设置的一行可容纳的字符数，则折行显示。
6).设置页与页之间的分隔
SQL> SET NEWP[AGE] {1|n|NONE}
当set newpage 0 时，会在每页的开头有一个小的黑方框。
当set newpage n 时，会在页和页之间隔着n个空行。
当set newpage none 时，会在页和页之间没有任何间隔。
7).显示时，用text值代替NULL值
SQL> SET NULL text
.设置一页有多少行数
SQL> SET PAGES[IZE] {24|n}
如果设为0，则所有的输出内容为一页并且不显示列标题
9).是否显示用DBMS_OUTPUT.PUT_LINE包进行输出的信息。
SQL> SET SERVEROUT[PUT] {ON|OFF}
在编写存储过程时，我们有时会用dbms_output.put_line将必要的信息输出，以便对存储过程进行调试，只有将serveroutput变量设为on后，信息才能显示在屏幕上。 dbms_output.put_line会"吃掉"最前面的空格？在set serveroutput on后加上format wrapped参数！
10).当SQL语句的长度大于LINESIZE时，是否在显示时截取SQL语句。
SQL> SET WRA[P] {ON|OFF}
当输出的行的长度大于设置的行的长度时(用set linesize n命令设置)，当set wrap on时，输出行的多于的字符会另起一行显示，否则，会将输出行的多于字符切除，不予显示。
11).是否在屏幕上显示输出的内容，主要用与SPOOL结合使用。
SQL> SET TERM[OUT] {ON|OFF}
在用spool命令将一个大表中的内容输出到一个文件中时，将内容输出在屏幕上会耗费大量的时间，设置set termspool off后，则输出的内容只会保存在输出文件中，不会显示在屏幕上，极大的提高了spool的速度。
12).将SPOOL输出中每行后面多余的空格去掉
SQL> SET TRIMS[OUT] {ON|OFF}
13)显示每个sql语句花费的执行时间
set TIMING {ON|OFF}
14.修改sql buffer中的当前行中，第一个出现的字符串
C[HANGE] /old_value/new_value
SQL> l
1* select * from dept
SQL> c/dept/emp
1* select * from emp
15.编辑sql buffer中的sql语句
EDI[T]
16.显示sql buffer中的sql语句，list n显示sql buffer中的第n行，并使第n行成为当前行
L[IST] [n]
17.在sql buffer的当前行下面加一行或多行
I[NPUT]
18.将指定的文本加到sql buffer的当前行后面
A[PPEND]
SQL> select deptno，
2 dname
3 from dept；
DEPTNO DNAME
---------- --------------
10 ACCOUNTING
20 RESEARCH
30 SALES
40 OPERATIONS
SQL> L 2
2* dname
SQL> a ，loc
2* dname，loc
SQL> L
1 select deptno，
2 dname，loc
3* from dept
SQL> /
DEPTNO DNAME LOC
---------- -------------- -------------
10 ACCOUNTING NEW YORK
20 RESEARCH DALLAS
30 SALES CHICAGO
40 OPERATIONS BOSTON
19.将sql buffer中的sql语句保存到一个文件中
SAVE file_name
20.将一个文件中的sql语句导入到sql buffer中
GET file_name
21.再次执行刚才已经执行的sql语句
RUN
or
/
22.执行一个存储过程
EXECUTE procedure_name
23.在sql*plus中连接到指定的数据库
CONNECT user_name/passwd@db_alias
24.设置每个报表的顶部标题
TTITLE
25.设置每个报表的尾部标题
BTITLE
26.写一个注释
REMARK [text]
27.将指定的信息或一个空行输出到屏幕上
PROMPT [text]
28.将执行的过程暂停，等待用户响应后继续执行
PAUSE [text]
Sql>PAUSE Adjust paper and press RETURN to continue.
29.将一个数据库中的一些数据拷贝到另外一个数据库(如将一个表的数据拷贝到另一个数据库)
COPY {FROM database | TO database | FROM database TO database}
{APPEND|CREATE|INSERT|REPLACE} destination_table
[(column， column， column， ...)] USING query
sql>COPY FROM SCOTT/TIGER@HQ TO JOHN/CHROME@WEST
create emp_temp
USING SELECT * FROM EMP
30.不退出sql*plus，在sql*plus中执行一个操作系统命令：
HOST
Sql> host hostname
该命令在windows下可能被支持。
31.在sql*plus中，切换到操作系统命令提示符下，运行操作系统命令后，可以再次切换回sql*plus：
！
sql>！
$hostname
$exit
sql>
该命令在windows下不被支持。
32.显示sql*plus命令的帮助
HELP
如何安装帮助文件：
Sql>@ ？sqlplusadminhelphlpbld.sql ？sqlplusadminhelphelpus.sql
Sql>help index
33.显示sql*plus系统变量的值或sql*plus环境变量的值
Syntax
SHO[W] option
where option represents one of the following terms or clauses：
system_variable
ALL
BTI[TLE]
ERR[ORS] [{FUNCTION|PROCEDURE|PACKAGE|PACKAGE BODY|
TRIGGER|VIEW|TYPE|TYPE BODY} [schema.]name]
LNO
PARAMETERS [parameter_name]
PNO
REL[EASE]
REPF[OOTER]
REPH[EADER]
SGA
SPOO[L]
SQLCODE
TTI[TLE]
USER
1) . 显示当前环境变量的值：
Show all
2) . 显示当前在创建函数、存储过程、触发器、包等对象的错误信息
Show error
当创建一个函数、存储过程等出错时，变可以用该命令查看在那个地方出错及相应的出错信息，进行修改后再次进行编译。
3) . 显示初始化参数的值：
show PARAMETERS [parameter_name]
4) . 显示数据库的版本：
show REL[EASE]
5) . 显示SGA的大小
show SGA
6). 显示当前的用户名
show user
_________________
xsb注：
@2.sql与@@2.sql的区别：
比如在e：下sqlplus @e：temp1.sql
1.sql里的@2.sql调用的脚本位于e：目下
@@2.sql调用的脚本位于e：temp目录下。





http://www.jb51.net/article/40280.htm