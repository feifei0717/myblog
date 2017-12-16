# JAVA 文件监控 WatchService

## 概述

java1.7中 提供了WatchService来监控系统中文件的变化。该监控是基于操作系统的文件系统监控器，可以监控系统是所有文件的变化，这种监控是无需遍历、无需比较的，是一种基于信号收发的监控，因此效率一定是最高的；现在Java对其进行了包装，可以直接在Java程序中使用OS的文件系统监控器了。

## 使用场景

- **场景一：**比如系统中的配置文件，一般都是系统启动的时候只加载一次，如果想修改配置文件，还须重启系统。如果系统想热加载一般都会定时轮询对比配置文件是否修改过，如果修改过重新加载。
- **场景二：**监控磁盘中的文件变化，一般需要把磁盘中的所有文件全部加载一边，定期轮询一遍磁盘，跟上次的文件状态对比。如果文件、目录过多，每次遍历时间都很长，而且还不是实时监控。

而以上两种场景就比较适合使用 WatchService 进行文件监控。

## 示例

```Java
import java.io.IOException;
import java.nio.file.FileSystems;
import java.nio.file.Paths;
import java.nio.file.StandardWatchEventKinds;
import java.nio.file.WatchEvent;
import java.nio.file.WatchKey;
import java.nio.file.WatchService;
import java.util.List;

public class FileWatchServiceDemo {

    public static void main(String[] args) throws IOException, InterruptedException {
        WatchService watchService = FileSystems.getDefault().newWatchService();

        String filePath = "D:/aa";

        Paths.get(filePath).register(watchService, StandardWatchEventKinds.ENTRY_CREATE,
                StandardWatchEventKinds.ENTRY_MODIFY, StandardWatchEventKinds.ENTRY_DELETE);

        while(true){
            WatchKey key = watchService.take();
            List<WatchEvent<?>> watchEvents = key.pollEvents();
            for (WatchEvent<?> event : watchEvents) {
                if(StandardWatchEventKinds.ENTRY_CREATE == event.kind()){
                    System.out.println("创建：[" + filePath + "/" + event.context() + "]");
                }
                if(StandardWatchEventKinds.ENTRY_MODIFY == event.kind()){
                    System.out.println("修改：[" + filePath + "/" + event.context() + "]");
                }
                if(StandardWatchEventKinds.ENTRY_DELETE == event.kind()){
                    System.out.println("删除：[" + filePath + "/" + event.context() + "]");
                }
                
            }
            key.reset();
        }
    }
}

```

1. 使用 Path 来指定要监控的目录
2. Path.register() 方法注册要监控指定目录的那些事件（创建、修改、删除）

```Java
 StandardWatchEventKinds.ENTRY_CREATE  //创建
 StandardWatchEventKinds.ENTRY_MODIFY  //修改
 StandardWatchEventKinds.ENTRY_DELETE  //删除
```

1. 调用watchService.take(); 获取监控目录文件的变化的WatchKey。该方法是阻塞方法，如果没有文件修改，则一直阻塞。
2. 遍历所有的修改事件，并做相应处理。
3. 完成一次监控就需要重置监控器。

## 不使用 WatchService 监控的弊端

- 非常繁琐，必须自己手动开启一个后台线程每隔一段时间遍历一次目标节点并记录当前状态，然后和上一次遍历的状态对比，如果不相同就表示发生了变化，再采取相应的操作，这个过程非常长，都需要用户自己手动实现；
- 效率低：效率都消耗在了遍历、保存状态、对比状态上了！这是因为旧版本的Java无法很好的利用OS文件系统的功能，因此只能这样笨拙地监控文件变化；

http://www.jianshu.com/p/f20aba1ecae6