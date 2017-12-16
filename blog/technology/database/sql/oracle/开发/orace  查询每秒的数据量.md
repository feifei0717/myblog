执行语句：

```sql
SELECT T.DT 时间, COUNT(1) 每秒的数据量 FROM (

SELECT TO_CHAR(DI.INS_DT, 'YYYYMMDD HH24:MI:SS') DT, DI.* 
FROM UCORD.DEDUCT_INVENTORY DI 
WHERE DI.INS_DT >= TO_DATE('16-08-2016 00:33:00', 'dd-mm-yyyy hh24:mi:ss') 
AND DI.INS_DT <= TO_DATE('16-08-2016 23:40:00', 'dd-mm-yyyy hh24:mi:ss')

) T GROUP BY T.DT ORDER BY T.DT

```

表结构：

 

```sql
-- Create table
create table UCORD.DEDUCT_INVENTORY
(
  di_seq             VARCHAR2(20) not null,
  fid                VARCHAR2(20) not null,
  fid_type           VARCHAR2(2),
  ins_dt             DATE,
  ins_usr            VARCHAR2(100),
  mod_dt             DATE,
  mod_usr            VARCHAR2(20),
  status             VARCHAR2(2) default '0',
  invalidate_dt      DATE,
  return_dt          DATE,
  return_usr         VARCHAR2(20),
  description        VARCHAR2(255),
  order_no           VARCHAR2(32),
  deduct_detail      VARCHAR2(4000),
  status_log         VARCHAR2(2) default '0',
  deduct_detail_clob CLOB,
  status_detail_log  VARCHAR2(2) default '0'
)
tablespace CTB_TBS
  pctfree 10
  initrans 1
  maxtrans 255
  storage
  (
    initial 64K
    next 8K
    minextents 1
    maxextents unlimited
  );
-- Add comments to the table 
comment on table UCORD.DEDUCT_INVENTORY
  is '库存扣除记录表';
-- Add comments to the columns 
comment on column UCORD.DEDUCT_INVENTORY.di_seq
  is '库存扣除记录流水号, 自增主键';
comment on column UCORD.DEDUCT_INVENTORY.fid
  is '关联外键标识,如订单编号,预购单编号等';
comment on column UCORD.DEDUCT_INVENTORY.fid_type
  is 'FID类型,1：普通订单 2：RT电子屏订单';
comment on column UCORD.DEDUCT_INVENTORY.ins_dt
  is '创建日期';
comment on column UCORD.DEDUCT_INVENTORY.ins_usr
  is '创建用户';
comment on column UCORD.DEDUCT_INVENTORY.mod_dt
  is '修改日期';
comment on column UCORD.DEDUCT_INVENTORY.mod_usr
  is '修改用户';
comment on column UCORD.DEDUCT_INVENTORY.status
  is '状态：0 待处理 1 已处理,无需归还 2 已处理,已经归还 3 部分处理';
comment on column UCORD.DEDUCT_INVENTORY.invalidate_dt
  is '失效日期。超过该日期，回退库存';
comment on column UCORD.DEDUCT_INVENTORY.return_dt
  is '归还库存日期,记录最近一次';
comment on column UCORD.DEDUCT_INVENTORY.return_usr
  is '归还人,记录最近一次';
comment on column UCORD.DEDUCT_INVENTORY.description
  is '描述信息';
comment on column UCORD.DEDUCT_INVENTORY.order_no
  is '订单号';
comment on column UCORD.DEDUCT_INVENTORY.deduct_detail
  is 'json订单详细';
comment on column UCORD.DEDUCT_INVENTORY.status_log
  is '扣库存日志记录状态：0 待处理.日志还未记录 1 已处理,已经记录完日志  3 处理中.日志正在记录';
comment on column UCORD.DEDUCT_INVENTORY.deduct_detail_clob
  is 'json订单详细（长度超过4000的记录在这个字段）';
comment on column UCORD.DEDUCT_INVENTORY.status_detail_log
  is '确认库存和归还库存日志记录状态：0 待处理.日志还未记录 1 已处理,已经记录完日志  3 处理中.日志正在记录';
-- Create/Recreate primary, unique and foreign key constraints 
alter table UCORD.DEDUCT_INVENTORY
  add constraint PK_DI_SEQ primary key (DI_SEQ);
```