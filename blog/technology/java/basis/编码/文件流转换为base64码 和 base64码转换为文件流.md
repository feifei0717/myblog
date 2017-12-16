# 文件流转换为base64码 和 base64码转换为文件流

例子说明一切
先写单元测试吧：单元测试的代码如下：

## 测试类：

```java
package com.practice.base64;

import java.io.IOException;

/**
 * <B>Description:</B>  <br>
 * <B>Create on:</B> 2017/11/27 下午2:44 <br>
 *
 * @author xiangyu.ye
 * @version 1.0
 */
public class TestBase64Convert {
    public static void main(String[] args) throws IOException {
        Base64AndFileConvertUtils baseCov = new Base64AndFileConvertUtils();
        //将 io 转换为 base64编码
        String strBase64 = baseCov.fileToBase64("/Users/jerryye/Desktop/2017-11-26_20-48-55.png");

        System.out.println(strBase64);

        //将 base64编码转换为 io 文件流，生成一幅新图片
        baseCov.base64ToFile(strBase64, "/Users/jerryye/Desktop/new.png");

    }
}
```

## Base64AndFileConvertUtils 类：

```java
package com.practice.base64;

import sun.misc.BASE64Decoder;
import sun.misc.BASE64Encoder;

import java.io.*;

/**
 * <B>Description:</B> base64和文件相互转换工具类 <br>
 * <B>Create on:</B> 2017/11/27 下午2:26 <br>
 *
 * @author xiangyu.ye
 * @version 1.0
 */
public class Base64AndFileConvertUtils {
    BASE64Decoder decoder = new BASE64Decoder();

    /**
     * <B>Description:</B> 文件 转换成 base64 <br>
     * <B>Create on:</B> 2017/11/27 下午2:19 <br>
     *
     * @param fileName 例如:d:/gril.png
     * @author xiangyu.ye
     */
    public String fileToBase64(String fileName) throws IOException {
        //源文件
//        String fileName = "d:/gril.png";
        String strBase64 = null;
        InputStream in = null;
        try {
            in = new FileInputStream(fileName);
            // in.available()返回文件的字节长度
            byte[] bytes = new byte[in.available()];
            // 将文件中的内容读入到数组中
            in.read(bytes);
            //将字节流数组转换为字符串
            strBase64 = new BASE64Encoder().encode(bytes);
        } catch (FileNotFoundException fe) {
            fe.printStackTrace();
        } catch (IOException ioe) {
            ioe.printStackTrace();
        } finally {
            if (in != null) {
                in.close();
            }
        }
        return strBase64;
    }

    /**
     * <B>Description:</B> base64 转换成 文件 <br>
     * <B>Create on:</B> 2017/11/27 下午2:19 <br>
     *
     * @param toSavefileName 例如:d:/gril2.png
     * @param strBase64  base64字符串
     * @author xiangyu.ye
     */
    public void base64ToFile(String strBase64,String toSavefileName) throws IOException {
        String string = strBase64;

        //解决base64加密使用urlencode，再解码时出现乱码.
        //1.替换空格为+
        string = string.replaceAll(" ", "+");
        //2.去掉\n
        string = string.replaceAll("\n", "").replaceAll("\r", "");

        //生成的新文件
//        String toSavefileName = "d:/gril2.png";
        FileOutputStream out = null;
        try {
            //解码，然后将字节转换为文件

            //将字符串转换为byte数组
            byte[] bytes = new BASE64Decoder().decodeBuffer(string);
            ByteArrayInputStream in = new ByteArrayInputStream(bytes);
            //每次读取2K的字节到内存中
            byte[] buffer = new byte[2048];
            out = new FileOutputStream(toSavefileName);
            //总大小  单位Byte   1024B（Byte)=1KB
            int bytesum = 0;
            int byteread = 0;
            while ((byteread = in.read(buffer)) != -1) {
                bytesum += byteread;
                //文件写操作
                out.write(buffer, 0, byteread);
            }
        } catch (IOException ioe) {
            ioe.printStackTrace();
        } finally {
            if (out != null) {
                out.close();
            }
        }
    }
}
```



执行截图：gril2.gif就是根据**base64**编码转换过来的，看到谷歌的这个美女总裁，就说明你的程序成功了