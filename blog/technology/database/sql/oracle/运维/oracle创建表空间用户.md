**oracle创建表空间用户**

先删除要建的表空间，没建过，跳过这一步

```
drop tablespace hnsjx  INCLUDING CONTENTS  AND DATAFILES CASCADE CONSTRAINTS;
drop tablespace hnsjx_temp  INCLUDING CONTENTS  AND DATAFILES CASCADE CONSTRAINTS;


drop user hnsjx  cascade;
```

--创建临时表空间

```
create temporary tablespace hnsjx_temp 
tempfile '/home/oracle/tablespace/hnsjx_temp.dbf' 
size 32m 
autoextend on 
next 32m maxsize 2048m
extent management local;
```

--创建数据表空间 

```
create tablespace hnsjx
logging
datafile '/home/oracle/tablespace/hnsjx.dbf' 
size 32m 
autoextend on 
next 32m maxsize 2048m
extent management local;
```

--创建用户并指定表空间

```
create user hnsjx identified by 123456
default tablespace hnsjx
temporary tablespace hnsjx_temp;

```

--给用户授予权限

```
grant dba,connect,resource,create view to hnsjx;
grant connect,resource,create view to hnsjx;
```

