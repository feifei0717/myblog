[TOC]



# mysql 死锁案例

## for update 导致死锁

### 准备

ddl

```sql
-- auto-generated definition
CREATE TABLE rt_qty_info
(
  id              BIGINT(18) AUTO_INCREMENT
  COMMENT 'id'
    PRIMARY KEY,
  store_id        INT DEFAULT '0'                NOT NULL
  COMMENT '门店编号',
  item_no         INT DEFAULT '0'                NOT NULL
  COMMENT '商品货号',
  qty             DECIMAL(15, 3) DEFAULT '0.000' NOT NULL
  COMMENT '库存',
  qty_type        TINYINT(2) DEFAULT '0'         NOT NULL
  COMMENT '可卖量类型 0:线下 1:线上',
  store_item_type VARCHAR(64) DEFAULT '0'        NOT NULL
  COMMENT '门店编号,商品货号,可卖量类型',
  CONSTRAINT uk_rqi_store_item_type
  UNIQUE (store_item_type)
)
  COMMENT '门店商品库存表'
  ENGINE = InnoDB;

CREATE INDEX idx_rqi_store_id
  ON rt_qty_info (store_id);

CREATE INDEX idx_rqi_item_no
  ON rt_qty_info (item_no);


```

运行窗口1:

```sql
BEGIN;
# SELECT * from rt_qty_info where store_item_type='1999,1027,1' for UPDATE; 主键或者唯一索引都一样
SELECT * from rt_qty_info where  id='6369' for UPDATE;
COMMIT;

BEGIN;

INSERT INTO   rt_qty_info (id, store_id, item_no, qty, qty_type,store_item_type)
VALUES (6369, 1999, 1027, 5102.000, 1,  '1999,1027,1');

COMMIT;
```

运行窗口2:

```sql
BEGIN;
# SELECT * from rt_qty_info where store_item_type='1999,1026,1' for UPDATE;
SELECT * from rt_qty_info where id='6368' for UPDATE;
COMMIT;

BEGIN;

INSERT INTO   rt_qty_info (id, store_id, item_no, qty, qty_type,   store_item_type)
VALUES (6368, 1999, 1026, 5102.000, 1,  '1999,1026,1');

COMMIT;

```

### 运行步骤:

1.删除表所有数据,运行窗口1执行如下.id='6369'获得锁

```
BEGIN; 
SELECT * from rt_qty_info where  id='6369' for UPDATE;
```

2.运行窗口2执行如下.id='6368'获得锁

```
BEGIN; 
SELECT * from rt_qty_info where id='6368' for UPDATE;
```

3.运行窗口1执行如下sql 获取锁等待

```
INSERT INTO   rt_qty_info (id, store_id, item_no, qty, qty_type,store_item_type)
VALUES (6369, 1999, 1027, 5102.000, 1,  '1999,1027,1');
```

4.运行窗口2执行如下sql 死锁产生

```
INSERT INTO   rt_qty_info (id, store_id, item_no, qty, qty_type,   store_item_type)
VALUES (6368, 1999, 1026, 5102.000, 1,  '1999,1026,1');
```

