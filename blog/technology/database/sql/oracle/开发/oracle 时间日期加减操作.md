# ORACLE 日期加减操作

## 说明

无论是DATE还是timestamp都可以进行加减操作。

可以对当前日期加年、月、日、时、分、秒，操作不同的时间类型，有三种方法：

1. 使用内置函数numtodsinterval增加小时，分钟和秒
2. 加一个简单的数来增加天
3. 使用内置函数add_months来增加年和月

## 示例

### 日期加减

对当前日期增加一个小时：

```
SQL> select sysdate, sysdate+numtodsinterval(1,’hour’) from dual ;
SYSDATE             SYSDATE+NUMTODSINTE
——————- ——————-
2010-10-14 21:38:19 2010-10-14 22:38:19
```

对当前日期增加50分种

```
SQL> select sysdate, sysdate+numtodsinterval(50,’minute’) from dual ;

SYSDATE             SYSDATE+NUMTODSINTE
——————- ——————-
2010-10-14 21:39:12 2010-10-14 22:29:12
```

对当前日期增加45秒

```
SQL> select sysdate, sysdate+numtodsinterval(45,’second’) from dual ;

SYSDATE             SYSDATE+NUMTODSINTE
——————- ——————-
2010-10-14 21:40:06 2010-10-14 21:40:51
```

对当前日期增加3天

```
SQL> select sysdate, sysdate+3 from dual ;

SYSDATE             SYSDATE+3
——————- ——————-
2010-10-14 21:40:46 2010-10-17 21:40:46
```


对当前日期增加4个月

```
SQL> select sysdate, add_months(sysdate,4) from dual ;

SYSDATE             ADD_MONTHS(SYSDATE,
——————- ——————-
2010-10-14 21:41:43 2011-02-14 21:41:43
```



当前日期增加2年

```
SQL> select sysdate, add_months(sysdate,12*2) from dual ;

SYSDATE             ADD_MONTHS(SYSDATE,
——————- ——————-
2010-10-14 21:42:17 2012-10-14 21:42:17
```

### timestamp的加减

timestamp的操作方法与上面类似；
求两个日期之差：
例：求2007-5-23 21：23：34与当前时间之间的差值。

```
SQL> select sysdate-to_date(’20070523 21:23:34′,’yyyy-mm-dd hh24:mi:ss’) dt from
dual ;

DT
———-
1240.01623
```

如果两个日期直接相减，得到的结果是一个数据型，我们可能想要得到两个日期相差值表现形式为：

```
**年**月**日 **:**:**
SQL> SELECT NUMTOYMINTERVAL(MONTHS_BETWEEN(DT1, DT2), ‘month’) mon,
2         numtodsinterval(dt1-(add_months(dt2,trunc(MONTHS_BETWEEN(DT1, DT2)))
),’day’) DAY
3    FROM (SELECT SYSDATE DT1,
4                 TO_DATE(’20070523 21:23:34′, ‘yyyy-mm-dd hh24:mi:ss’) DT2
5          FROM DUAL)
6 ;

MON                  DAY
—————-     ———————-
+000000003-04        +000000021 00:40:15.999999999

即：3年 4 个月 21 天 00:40:15.99999999
```





https://www.cnblogs.com/xiao-yu/archive/2011/05/24/2055967.html