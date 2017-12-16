[Oracle](http://www.linuxidc.com/topicnews.aspx?tid=12)提供了scott用户的重建脚本，11G利用脚本创建scott简单操作如下：

SQL> select * from dba_users where username='SCOTT'; ------之前已手动删除scott

no rows selected
SQL> exit
Disconnected from Oracle Database 11g Enterprise Edition Release 11.2.0.3.0 - 64bit Production
With the Partitioning, OLAP, Data Mining and Real Application Testing options
@pekdc1-vcm-03: [/usr/app/oracle/110203/v04/rdbms/admin] 
$cd $ORACLE_HOME/rdbms/admin ------脚本位置
@pekdc1-vcm-03: [/usr/app/oracle/110203/v04/rdbms/admin] 
$ls -lhrt utlsampl.sql 
-rw-r--r-- 1 oracle oinstall 3.6K May 28 2013 utlsampl.sql
@pekdc1-vcm-03: [/usr/app/oracle/110203/v04/rdbms/admin] 
$sqlplus / as sysdba
SQL*Plus: Release 11.2.0.3.0 Production on Mon Mar 24 10:15:29 2014
Copyright (c) 1982, 2011, Oracle. All rights reserved.
Connected to:
Oracle Database 11g Enterprise Edition Release 11.2.0.3.0 - 64bit Production
With the Partitioning, OLAP, Data Mining and Real Application Testing options
SQL> @utlsampl.sql ------运行脚本，完成后会自动退出sqlplus
Disconnected from Oracle Database 11g Enterprise Edition Release 11.2.0.3.0 - 64bit Production
With the Partitioning, OLAP, Data Mining and Real Application Testing options
@pekdc1-vcm-03: [/usr/app/oracle/110203/v04/rdbms/admin] 
$sqlplus scott/tiger
SQL*Plus: Release 11.2.0.3.0 Production on Mon Mar 24 10:15:47 2014
Copyright (c) 1982, 2011, Oracle. All rights reserved.
Connected to:
Oracle Database 11g Enterprise Edition Release 11.2.0.3.0 - 64bit Production
With the Partitioning, OLAP, Data Mining and Real Application Testing options
SQL> show user
USER is "SCOTT"
SQL> select table_name from user_tables;
TABLE_NAME
\------------------------------
DEPT
EMP
BONUS
SALGRADE
SQL> select * from emp;
EMPNO ENAME JOB MGR HIREDATE SAL COMM
---------- ---------- --------- ---------- --------- ---------- ----------
DEPTNO
\----------
7369 SMITH CLERK 7902 17-DEC-80 800
20
7499 ALLEN SALESMAN 7698 20-FEB-81 1600 300
30
7521 WARD SALESMAN 7698 22-FEB-81 1250 500
30
EMPNO ENAME JOB MGR HIREDATE SAL COMM
---------- ---------- --------- ---------- --------- ---------- ----------
DEPTNO
\----------
7566 JONES MANAGER 7839 02-APR-81 2975
20
7654 MARTIN SALESMAN 7698 28-SEP-81 1250 1400
30
7698 BLAKE MANAGER 7839 01-MAY-81 2850
30
EMPNO ENAME JOB MGR HIREDATE SAL COMM
---------- ---------- --------- ---------- --------- ---------- ----------
DEPTNO
\----------
7782 CLARK MANAGER 7839 09-JUN-81 2450
10
7788 SCOTT ANALYST 7566 19-APR-87 3000
20
7839 KING PRESIDENT 17-NOV-81 5000
10
EMPNO ENAME JOB MGR HIREDATE SAL COMM
---------- ---------- --------- ---------- --------- ---------- ----------
DEPTNO
\----------
7844 TURNER SALESMAN 7698 08-SEP-81 1500 0
30
7876 ADAMS CLERK 7788 23-MAY-87 1100
20
7900 JAMES CLERK 7698 03-DEC-81 950
30
EMPNO ENAME JOB MGR HIREDATE SAL COMM
---------- ---------- --------- ---------- --------- ---------- ----------
DEPTNO
\----------
7902 FORD ANALYST 7566 03-DEC-81 3000
20
7934 MILLER CLERK 7782 23-JAN-82 1300
10
14 rows selected.
SQL> exit
Disconnected from Oracle Database 11g Enterprise Edition Release 11.2.0.3.0 - 64bit Production
With the Partitioning, OLAP, Data Mining and Real Application Testing options
@pekdc1-vcm-03: [/usr/app/oracle/110203/v04/rdbms/admin] 
$more utlsampl.sql ------脚本内容
Rem Copyright (c) 1990, 2006, Oracle. All rights reserved. 
Rem NAME
REM UTLSAMPL.SQL
Rem FUNCTION
Rem NOTES
Rem MODIFIED
Rem lburgess 04/02/06 - lowercase passwords 
Rem menash 02/21/01 - remove unnecessary users for security reasons
Rem gwood 03/23/99 - make all dates Y2K compliant
Rem jbellemo 02/27/97 - dont connect as system
Rem akolk 08/06/96 - bug 368261: Adding date formats
Rem glumpkin 10/21/92 - Renamed from SQLBLD.SQL 
Rem blinden 07/27/92 - Added primary and foreign keys to EMP and DEPT
Rem rlim 04/29/91 - change char to varchar2 
Rem mmoore 04/08/91 - use unlimited tablespace priv 
Rem pritto 04/04/91 - change SYSDATE to 13-JUL-87 
Rem Mendels 12/07/90 - bug 30123;add to_date calls so language independent
Rem
rem 
rem $Header: utlsampl.sql 02-apr-2006.21:13:01 lburgess Exp $ sqlbld.sql 
rem 
SET TERMOUT OFF
SET ECHO OFF
rem CONGDON Invoked in RDBMS at build time. 29-DEC-1988
rem OATES: Created: 16-Feb-83
DROP USER SCOTT CASCADE;
DROP USER ADAMS CASCADE;
DROP USER JONES CASCADE;
DROP USER CLARK CASCADE;
DROP USER BLAKE CASCADE;
GRANT CONNECT,RESOURCE,UNLIMITED TABLESPACE TO SCOTT IDENTIFIED BY tiger;
DROP PUBLIC SYNONYM PARTS;
CONNECT SCOTT/tiger
CREATE TABLE DEPT
(DEPTNO NUMBER(2) CONSTRAINT PK_DEPT PRIMARY KEY,
DNAME VARCHAR2(14) ,
LOC VARCHAR2(13) ) ;
CREATE TABLE EMP
(EMPNO NUMBER(4) CONSTRAINT PK_EMP PRIMARY KEY,
ENAME VARCHAR2(10),
JOB VARCHAR2(9),
MGR NUMBER(4),
HIREDATE DATE,
SAL NUMBER(7,2),
COMM NUMBER(7,2),
DEPTNO NUMBER(2) CONSTRAINT FK_DEPTNO REFERENCES DEPT);
INSERT INTO DEPT VALUES
(10,'ACCOUNTING','NEW YORK');
INSERT INTO DEPT VALUES (20,'RESEARCH','DALLAS');
INSERT INTO DEPT VALUES
(30,'SALES','CHICAGO');
INSERT INTO DEPT VALUES
(40,'OPERATIONS','BOSTON');
INSERT INTO EMP VALUES
(7369,'SMITH','CLERK',7902,to_date('17-12-1980','dd-mm-yyyy'),800,NULL,20);
INSERT INTO EMP VALUES
(7499,'ALLEN','SALESMAN',7698,to_date('20-2-1981','dd-mm-yyyy'),1600,300,30);
INSERT INTO EMP VALUES
(7521,'WARD','SALESMAN',7698,to_date('22-2-1981','dd-mm-yyyy'),1250,500,30);
INSERT INTO EMP VALUES
(7566,'JONES','MANAGER',7839,to_date('2-4-1981','dd-mm-yyyy'),2975,NULL,20);
INSERT INTO EMP VALUES
(7654,'MARTIN','SALESMAN',7698,to_date('28-9-1981','dd-mm-yyyy'),1250,1400,30);
INSERT INTO EMP VALUES
(7698,'BLAKE','MANAGER',7839,to_date('1-5-1981','dd-mm-yyyy'),2850,NULL,30);
INSERT INTO EMP VALUES
(7782,'CLARK','MANAGER',7839,to_date('9-6-1981','dd-mm-yyyy'),2450,NULL,10);
INSERT INTO EMP VALUES
(7788,'SCOTT','ANALYST',7566,to_date('13-JUL-87','dd-mm-rr')-85,3000,NULL,20);
INSERT INTO EMP VALUES
(7839,'KING','PRESIDENT',NULL,to_date('17-11-1981','dd-mm-yyyy'),5000,NULL,10);
INSERT INTO EMP VALUES
(7844,'TURNER','SALESMAN',7698,to_date('8-9-1981','dd-mm-yyyy'),1500,0,30);
INSERT INTO EMP VALUES
(7876,'ADAMS','CLERK',7788,to_date('13-JUL-87', 'dd-mm-rr')-51,1100,NULL,20);
INSERT INTO EMP VALUES
(7900,'JAMES','CLERK',7698,to_date('3-12-1981','dd-mm-yyyy'),950,NULL,30);
INSERT INTO EMP VALUES
(7902,'FORD','ANALYST',7566,to_date('3-12-1981','dd-mm-yyyy'),3000,NULL,20);
INSERT INTO EMP VALUES
(7934,'MILLER','CLERK',7782,to_date('23-1-1982','dd-mm-yyyy'),1300,NULL,10);
CREATE TABLE BONUS
(
ENAME VARCHAR2(10) ,
JOB VARCHAR2(9) ,
SAL NUMBER,
COMM NUMBER
) ;
CREATE TABLE SALGRADE
( GRADE NUMBER,
LOSAL NUMBER,
HISAL NUMBER );
INSERT INTO SALGRADE VALUES (1,700,1200);
INSERT INTO SALGRADE VALUES (2,1201,1400);
INSERT INTO SALGRADE VALUES (3,1401,2000);
INSERT INTO SALGRADE VALUES (4,2001,3000);
INSERT INTO SALGRADE VALUES (5,3001,9999);
COMMIT;
EXIT
@pekdc1-vcm-03: [/usr/app/oracle/110203/v04/rdbms/admin]

更多Oracle相关信息见[Oracle](http://www.linuxidc.com/topicnews.aspx?tid=12) 专题页面 <http://www.linuxidc.com/topicnews.aspx?tid=12>

来源： <<http://www.linuxidc.com/Linux/2014-03/98741.htm>>

 