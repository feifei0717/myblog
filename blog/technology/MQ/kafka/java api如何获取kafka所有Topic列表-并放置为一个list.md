kafka内部所有的实现都是通过TopicCommand的main方法,通过java代码调用API，TopicCommand.main(options)的方式只能打印到控制台，不能转换到一个list。

下面讲解下如何转换为list：

1、查看主题（Topic）

【命令方式】：bin/kafka-topics.sh --list --zookeeper 192.168.2.212:2181/kafka

【JAVA API方式】：

```
 public static void main(String[] args) {
        ByteArrayOutputStream byteStream = new ByteArrayOutputStream(1024*3);
        // cache stream
        PrintStream cacheStream = new PrintStream(byteStream);
        // old stream
        PrintStream oldStream = System.out;
        System.setOut(cacheStream);
        List commandList = new ArrayList();
        String strList = "--list --zookeeper localhost:2181";
        commandList = Arrays.asList(strList.split(" "));
        TopicCommand.main((String[]) commandList.toArray(new String[commandList.size()]));
        String message = byteStream.toString();
        List<String> ls = new ArrayList<String>();
        String[]ss = message.split("\n");
        ls = Arrays.asList(ss);
        // Restore old stream
        System.setOut(oldStream);
        for(int i=0;i<ss.length;i++){//循环遍历转换后的list中的topic
             System.out.println(ls.get(i));
        }
    }
```

来源： <http://www.cnblogs.com/tanglc/p/5251545.html>