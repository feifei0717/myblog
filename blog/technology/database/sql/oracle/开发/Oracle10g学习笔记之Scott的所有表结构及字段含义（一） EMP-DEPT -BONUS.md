Oracle10g学习笔记之Scott的所有表结构及字段含义（一） EMP-DEPT-BONUS

```
雇员表：记录了一个雇员的基本信息
EMP（雇员表）
NO              字段             类型                            描述
1              	EMPNO           NUMBER(4)              			雇员编号
2              	ENAME           VARCHAR2(10)     				表示雇员姓名
3             	JOB             VARCHAR2(9)        				表示工作职位
4            	MGR             NUMBER(4)            			表示一个雇员的领导编号
5              	HIREDATE       	DATE                      		表示雇佣日期
6             	SAL             NUMBER(7,2)         			表示月薪，工资
7             	COMM            NUMBER(7,2)         			表示奖金或佣金
8              	DEPTNO          NUMBER(2)           			表示部门编号
部门表：表示一个部门的具体信息
DEPT（部门表）
NO               字段             类型                             描述
1                DEPTNO         NUMBER(2)                		部门编号
2                DNAME          VARCHAR2(14)          			部门名称
3                LOC            VARCHAR2(13)           			部门位置
奖金表：表示一个雇员的工资及奖金。
BONUS（奖金表）
NO               字段              类型                             描述
1                ENAME           VARCHAR2(10)                	雇员姓名
2                JOB             VARCHAR2(9)                   	雇员工作
3                SAL             NUMBER                         雇员工资
4                COMM            NUMBER                         雇员奖金
一个公司是有等级制度，用此表表示一个工资的等级
SALGRADE（工资等级表）
NO           	字段                类型                            描述
1            	GRADE             NUMBER                        等级名称
2             	LOSAL             NUMBER                     	此等级的最低工资
3           	HISAL             NUMBER                     	此等级的最高工资

```

