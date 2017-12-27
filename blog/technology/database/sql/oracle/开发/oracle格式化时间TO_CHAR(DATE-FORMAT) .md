TO_CHAR(DATE,FORMAT)

分类: database
日期: 2014-05-02

原文地址: 

http://blog.chinaunix.net/uid-29632145-id-4234079.html

------

****[TO_CHAR(DATE,FORMAT)]()*2014-05-02 00:20:16*

分类： Oracle

| SYSDATE                                  | 2009-6-16 15:25:10    |        |
| ---------------------------------------- | --------------------- | ------ |
| TRUNC(SYSDATE)                           | 2009-6-16             |        |
| TO_CHAR(SYSDATE,'YYYYMMDD')              | 20090616              | 到日     |
| TO_CHAR(SYSDATE,'YYYYMMDD HH24:MI:SS')   | 20090616 15:25:10     | 到秒     |
| TO_CHAR(SYSTIMESTAMP,'YYYYMMDD HH24:MI:SS.FF3') | 20090616 15:25:10.848 | 到毫秒    |
| TO_CHAR(SYSDATE,'AD')                    | 公元                    |        |
| TO_CHAR(SYSDATE,'AM')                    | 下午                    |        |
| TO_CHAR(SYSDATE,'BC')                    | 公元                    |        |
| TO_CHAR(SYSDATE,'CC')                    | 21                    |        |
| TO_CHAR(SYSDATE,'D')                     | 3                     | 老外的星期几 |
| TO_CHAR(SYSDATE,'DAY')                   | 星期二                   | 星期几    |
| TO_CHAR(SYSDATE,'DD')                    | 16                    |        |
| TO_CHAR(SYSDATE,'DDD')                   | 167                   |        |
| TO_CHAR(SYSDATE,'DL')                    | 2009年6月16日 星期二        |        |
| TO_CHAR(SYSDATE,'DS')                    | 2009-06-16            |        |
| TO_CHAR(SYSDATE,'DY')                    | 星期二                   |        |
| TO_CHAR(SYSTIMESTAMP,'SS.FF3')           | 10.848                | 毫秒     |
| TO_CHAR(SYSDATE,'FM')                    |                       |        |
| TO_CHAR(SYSDATE,'FX')                    |                       |        |
| TO_CHAR(SYSDATE,'HH')                    | 03                    |        |
| TO_CHAR(SYSDATE,'HH24')                  | 15                    |        |
| TO_CHAR(SYSDATE,'IW')                    | 25                    | 第几周    |
| TO_CHAR(SYSDATE,'IYY')                   | 009                   |        |
| TO_CHAR(SYSDATE,'IY')                    | 09                    |        |
| TO_CHAR(SYSDATE,'J')                     | 2454999               |        |
| TO_CHAR(SYSDATE,'MI')                    | 25                    |        |
| TO_CHAR(SYSDATE,'MM')                    | 06                    |        |
| TO_CHAR(SYSDATE,'MON')                   | 6月                    |        |
| TO_CHAR(SYSDATE,'MONTH')                 | 6月                    |        |
| TO_CHAR(SYSTIMESTAMP,'PM')               | 下午                    |        |
| TO_CHAR(SYSDATE,'Q')                     | 2                     | 第几季度   |
| TO_CHAR(SYSDATE,'RM')                    | VI                    |        |
| TO_CHAR(SYSDATE,'RR')                    | 09                    |        |
| TO_CHAR(SYSDATE,'RRRR')                  | 2009                  |        |
| TO_CHAR(SYSDATE,'SS')                    | 10                    |        |
| TO_CHAR(SYSDATE,'SSSSS')                 | 55510                 |        |
| TO_CHAR(SYSDATE,'TS')                    | 下午 3:25:10            |        |
| TO_CHAR(SYSDATE,'WW')                    | 24                    |        |
| TO_CHAR(SYSTIMESTAMP,'W')                | 3                     |        |
| TO_CHAR(SYSDATE,'YEAR')                  | TWO THOUSAND NINE     |        |
| TO_CHAR(SYSDATE,'YYYY')                  | 2009                  |        |
| TO_CHAR(SYSTIMESTAMP,'YYY')              | 009                   |        |
| TO_CHAR(SYSTIMESTAMP,'YY')               | 09                    |        |