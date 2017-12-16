# 利用FileChannel完成文件的读、写、复制

代码位置:/Users/jerryye/backup/studio/AvailableCode/basis/io_nio/io_nio_demo/src/main/java/com/practice/NIO/NioFileCopy.java

```
package com.practice.NIO;

import java.io.IOException;
import java.io.RandomAccessFile;
import java.nio.ByteBuffer;
import java.nio.channels.FileChannel;

/**
 * <B>Description:</B> 利用FileChannel完成文件的读、写、复制 <br>
 * <B>Create on:</B> 2017/11/3 上午11:16 <br>
 *
 * @author xiangyu.ye
 * @version 1.0
 */
public class NioFileCopy {
    private String           filePath  = "/Users/jerryye/backup/studio/AvailableCode/basis/io_nio/io_nio_demo/src/main/java/com/practice/NIO/data/";
    private RandomAccessFile aFile     = null;
    private FileChannel      inChannel = null;
    private final ByteBuffer buf       = ByteBuffer.allocate(1024);

    public void doWrite() throws IOException {
        aFile = new RandomAccessFile(filePath + "nio-data.txt", "rw");
        inChannel = aFile.getChannel();
        String newData = "New String to wirte to file... " + System.currentTimeMillis();
        buf.clear();
        buf.put(newData.getBytes());

        buf.flip();

        while (buf.hasRemaining())
            inChannel.write(buf);

        inChannel.close();
        System.out.println("Write Over");
    }

    public void doRead() throws IOException {
        aFile = new RandomAccessFile(filePath + "nio-data.txt", "rw");
        inChannel = aFile.getChannel();

        int bytesRead = inChannel.read(buf);
        while (bytesRead != -1) {
            System.out.println("Read " + bytesRead);
            buf.flip();
            while (buf.hasRemaining())
                System.out.print((char) buf.get());

            buf.clear();
            bytesRead = inChannel.read(buf);
        }

        aFile.close();
    }

    public void doCopy() throws IOException {
        aFile = new RandomAccessFile(filePath + "fromFile.txt", "rw");
        inChannel = aFile.getChannel();
        RandomAccessFile bFile = new RandomAccessFile(filePath + "toFile.txt", "rw");
        FileChannel outChannel = bFile.getChannel();
        inChannel.transferTo(0, inChannel.size(), outChannel);
        System.out.println("Copy over");
    }

    public static void main(String[] args) throws IOException {
        NioFileCopy tool = new NioFileCopy();
        //tool.doWrite();
        //tool.doRead();
        tool.doCopy();
    }
}
```

http://blog.csdn.net/u011345136/article/details/45501559