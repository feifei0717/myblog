oracle中的number类型用法及举例

**一、Number与int,float等数据类型的区别 **

oracle本没有int类型，为了与别的数据库兼容，新增了int类型作为Number类型的子集。 

1、int类型只能存储整数; 

2、Number可以存储浮点数，也可以存储整数； 

**二、Number类型的用法 **

Number表示说明：Number(p, s) ——声明一个定点数    　　 

​                               其中p(precision)为精度，精度最大值为38 

​                               s(scale)表示小数点右边的数字个数，scale的取值范围为-84到127 

因此，Number(p) 即是声明一个整数，相当于Number(p, 0)，即等同于int型 

例子： 

Number(8,1)   存储小数位为1位，总长度为8的浮点数，如果小数位数不足，则用0补全； 

Number(8)      存储总长度为8的整数 

定点数的精度(p)和刻度(s)遵循以下规则： 

当一个数的整数部分的长度 > p-s 时，Oracle就会报错 

例：12345.12345   NUMBER(6,2)   Error 

当一个数的小数部分的长度 > s 时，Oracle就会舍入 

例：12345.58        NUMBER(*, 1)   12345.6 

当s(scale)为负数时，Oracle就对小数点左边的s个数字进行舍入 

例：12345.345   NUMBER(5,-2)     12300 