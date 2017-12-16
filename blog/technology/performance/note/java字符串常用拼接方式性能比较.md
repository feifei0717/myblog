# [java字符串常用拼接方式性能比较](http://wenin819.com/java_string_contact_performance_compare)

2014-07-28

## 测试代码

```
import java.util.Date;

public class Test {

    private static String testStringFormat(int times, String str1, String str2, String str3) {
        String format = "测试字符串1：%s, 测试字符串2：%s, 测试字符串3：%s";
        String tmp = null;
        for(int i = 0; i < times; i++) {
            tmp = String.format(format, str1, str2, str3);
        }
        return tmp;
    }

    public static String testStringPlus(int times, String str1, String str2, String str3) {
        String tmp = null;
        for(int i = 0; i < times; i++) {
            tmp = "测试字符串1：" + str1 + ", 测试字符串2：" + str2 + ", 测试字符串3：" + str3;
        }
        return tmp;
    }

    public static String testStringBuilder(int times, String str1, String str2, String str3) {
        String tmp = null;
        for(int i = 0; i < times; i++) {
            StringBuilder s = new StringBuilder();
            s.append("测试字符串1：").append(str1)
                    .append(", 测试字符串2：").append(str2)
                    .append(", 测试字符串3：").append(str3);
            tmp = s.toString();
        }
        return tmp;
    }

    public static String testStringBuffer(int times, String str1, String str2, String str3) {
        String tmp = null;
        for(int i = 0; i < times; i++) {
            StringBuffer s = new StringBuffer();
            s.append("测试字符串1：").append(str1)
                    .append(", 测试字符串2：").append(str2)
                    .append(", 测试字符串3：").append(str3);
            tmp = s.toString();
        }
        return tmp;
    }

    public static void main(String[] args) {
        int times = 10000000;
        String str1 = "字符串1"; String str2 = "字符串2"; String str3 = "字符串3";

        Date[] timers = new Date[5];
        int idx = 0;
        timers[idx++] = new Date();

        System.out.println(testStringFormat(times, str1, str2, str3));
        timers[idx++] = new Date();

        System.out.println(testStringBuilder(times, str1, str2, str3));
        timers[idx++] = new Date();

        System.out.println(testStringBuffer(times, str1, str2, str3));
        timers[idx++] = new Date();

        System.out.println(testStringPlus(times, str1, str2, str3));
        timers[idx++] = new Date();

        System.out.printf("测试结果为：testStringPlus[ %s * 0.01s ],"
                        + " testStringBuffer[ %s * 0.01s ],"
                        + " testStringBuilder[ %s * 0.01s ],"
                        + " testStringFormat[ %s * 0.01s ]",
                (timers[4].getTime() - timers[3].getTime()) / 10,
                (timers[3].getTime() - timers[2].getTime()) / 10,
                (timers[2].getTime() - timers[1].getTime()) / 10,
                (timers[1].getTime() - timers[0].getTime()) / 10);
    }
}

```

## 测试结果

### 1千万次——10000000

测试字符串1：字符串1, 测试字符串2：字符串2, 测试字符串3：字符串3

测试字符串1：字符串1, 测试字符串2：字符串2, 测试字符串3：字符串3

测试字符串1：字符串1, 测试字符串2：字符串2, 测试字符串3：字符串3

测试字符串1：字符串1, 测试字符串2：字符串2, 测试字符串3：字符串3

测试结果为：testStringPlus[ 63 * 0.01s ], testStringBuffer[ 158 * 0.01s ], testStringBuilder[ 161 * 0.01s ], testStringFormat[ 2235 * 0.01s ]

### 1百万次——1000000

测试字符串1：字符串1, 测试字符串2：字符串2, 测试字符串3：字符串3

测试字符串1：字符串1, 测试字符串2：字符串2, 测试字符串3：字符串3

测试字符串1：字符串1, 测试字符串2：字符串2, 测试字符串3：字符串3

测试字符串1：字符串1, 测试字符串2：字符串2, 测试字符串3：字符串3

测试结果为：testStringPlus[ 12 * 0.01s ], testStringBuffer[ 24 * 0.01s ], testStringBuilder[ 22 * 0.01s ], testStringFormat[ 289 * 0.01s ]

## 测试结论

1. 性能排行（从高到低）：testStringPlus > testStringBuilder > testStringBuffer > testStringFormat

## 测试环境

1. jdk: 1.8.0_05

2. os: windows 8.1

   ​

   来源： <http://wenin819.com/java_string_contact_performance_compare/>