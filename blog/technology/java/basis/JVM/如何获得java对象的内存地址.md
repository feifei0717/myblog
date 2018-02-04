# 如何获得java对象的内存地址


​        在java中内存中的对象地址是可变的，所以获得的内存地址有可能会变化。要获得内存地址也只能通过Unsafe的方法来获得，如下代码片段：

```Java
import java.lang.reflect.Field;

import sun.misc.Unsafe;

/**
 * <B>Description:</B> java对象地址工具类 <br>
 *     文章:
 * <B>Create on:</B> 2018/2/4 下午3:52 <br>
 *
 * @author xiangyu.ye
 * @version 1.0
 */
public class JavaObjectAddresserUtil {

    private static Unsafe unsafe;

    static {
        try {
            Field field = Unsafe.class.getDeclaredField("theUnsafe");
            field.setAccessible(true);
            unsafe = (Unsafe) field.get(null);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    /**
     * <B>Description:</B> 获取地址 <br>
     * <B>Create on:</B> 2018/2/4 下午3:52 <br>
     *
     * @author xiangyu.ye
     */
    public static long addressOf(Object o) throws Exception {

        Object[] array = new Object[] { o };

        long baseOffset = unsafe.arrayBaseOffset(Object[].class);
        int addressSize = unsafe.addressSize();
        long objectAddress;
        switch (addressSize) {
            case 4:
                objectAddress = unsafe.getInt(array, baseOffset);
                break;
            case 8:
                objectAddress = unsafe.getLong(array, baseOffset);
                break;
            default:
                throw new Error("unsupported address size: " + addressSize);
        }
        return (objectAddress);
    }

//    public static void main(String... args) throws Exception {
//        Object mine = "Hi there".toCharArray();
//        long address = addressOf(mine);
//        System.out.println("Addess: " + address);
//
//        // Verify address works - should see the characters in the array in the output
//        printBytes(address, 27);
//    }


    /**
     * <B>Description:</B> 验证地址是否有效 - 应该在输出中看到数组中的字符 <br>
     * <B>Create on:</B> 2018/2/4 下午4:01 <br>
     *
     * @author xiangyu.ye
     */
    public static void printBytes(long objectAddress, int num) {
        for (long i = 0; i < num; i++) {
            int cur = unsafe.getByte(objectAddress + i);
            System.out.print((char) cur);
        }
        System.out.println();
    }
}
```

运行结果：

```
Addess: 3982194354
```

 



http://bijian1013.iteye.com/blog/2300961
