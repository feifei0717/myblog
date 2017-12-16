# Oracle 触发器 插入，更新，删除,数据同步，两表同步

分类: database
日期: 2014-05-13

 

http://blog.chinaunix.net/uid-29632145-id-4251648.html

------

****[Oracle 触发器 插入，更新，删除,数据同步，两表同步 ]()*2014-05-13 22:13:30*

分类： Oracle

## **建表：**

```
create table User_Info (
   ID                   INTEGER                         not null,
   UserName            VARCHAR(30)                     not null,
   PassWord            VARCHAR(20)                     not null,
   CreateDate          Date                            not null,
   Status              INTEGER                         not null,
   constraint PK_User_Info primary key (ID)
);

create table User_Info_temp (
   ID                   INTEGER                         not null,
   UserName            VARCHAR(30)                     not null,
   PassWord            VARCHAR(20)                     not null,
   CreateDate          Date                            not null,
   Status              INTEGER                         not null,
   constraint PK_User_Info_temp primary key (ID)
);


```

## **触发器写法：**

```
create or replace trigger UserToTemp after insert or update or delete
on user_info for each row
declare
    integrity_error exception;
    errno            integer;
    errmsg           char(200);
    dummy            integer;
    found            boolean;
    
begin
if inserting then
    insert into User_info_temp(ID,UserName,PassWord,CreateDate,Status) values(:NEW.ID,:NEW.UserName,:NEW.PassWord,:new.CreateDate,:NEW.Status);
elsif updating then 
    update User_info_temp set ID=:NEW.ID,UserName=:NEW.UserName,PassWord=:NEW.PassWord,Status=:NEW.Status where id=:OLD.id;
elsif deleting then
    delete from User_info_temp where id=:OLD.id;
end if;
exception
    when integrity_error then
       raise_application_error(errno, errmsg);
end;


```

## **测试数据：**

```
insert into user_info(ID,UserName,PassWord,CreateDate,Status)values(1,'xier','222',to_date('2008-10-11','yyyy-mm-dd'),1)

update user_info u set u.status=3,u.username='xier' where u.id=1

delete from user_info u where u.id=1
```

