# BigDecimal 如何比较是否相等

例子：

```
BigDecimal a = new BigDecimal("2.00");
BigDecmial b = new BigDecimal(2);
System.out.println(a.equals(b));
```

输出结果是：false

原因是：BigDecimal比较时，不仅比较值，而且还比较精度？？？

解决方法：

```
BigDecimal a = new BigDecimal("2.00").setScale(2,BigDecimal.ROUND_HALF_DOWN);
BigDecmial b = new BigDecimal(2).setScale(2,BigDecimal.ROUND_HALF_DOWN);
System.out.println(a.equals(b));
```

结果就是：true

**关于BigDecimal.ROUND_HALF_UP与ROUND_HALF_DOWN**

ROUND_HALF_UP: 遇到.5的情况时往上近似,例: 1.5 ->;2
ROUND_HALF_DOWN : 遇到.5的情况时往下近似,例: 1.5 ->;1

```
BigDecimal a = new BigDecimal(1.5);
System.out.println("down="+a.setScale(0,BigDecimal.ROUND_HALF_DOWN)+"\tup="+a.setScale(0,BigDecimal.ROUND_HALF_UP));
```

结 果:

```
down=1  
up=2
```


看这个例子就明白了!

来源： http://xiaoboss.iteye.com/blog/888512

 