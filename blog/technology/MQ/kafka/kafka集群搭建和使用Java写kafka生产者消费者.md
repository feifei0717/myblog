**1 kafka java调用：**

 

1.1 java端生产数据， kafka集群消费数据：

```
1 创建maven工程，pom.xml中增加如下：  
 <dependency>  
        <groupId>org.apache.kafka</groupId>  
        <artifactId>kafka_2.9.2</artifactId>  
        <version>0.8.1.1</version>  
 </dependency>  
  
  
2 java代码：  向主题test内写入数据  
  
import java.util.Properties;  
import java.util.concurrent.TimeUnit;  
  
import kafka.javaapi.producer.Producer;  
import kafka.producer.KeyedMessage;  
import kafka.producer.ProducerConfig;  
import kafka.serializer.StringEncoder;  
  
  
  
  
public class kafkaProducer extends Thread{  
  
    private String topic;  
      
    public kafkaProducer(String topic){  
        super();  
        this.topic = topic;  
    }  
      
      
    @Override  
    public void run() {  
        Producer producer = createProducer();  
        int i=0;  
        while(true){  
            producer.send(new KeyedMessage<Integer, String>(topic, "message: " + i++));  
            try {  
                TimeUnit.SECONDS.sleep(1);  
            } catch (InterruptedException e) {  
                e.printStackTrace();  
            }  
        }  
    }  
  
    private Producer createProducer() {  
        Properties properties = new Properties();  
        properties.put("zookeeper.connect", "192.168.1.110:2181,192.168.1.111:2181,192.168.1.112:2181");//声明zk  
        properties.put("serializer.class", StringEncoder.class.getName());  
        properties.put("metadata.broker.list", "192.168.1.110:9092,192.168.1.111:9093,192.168.1.112:9094");// 声明kafka broker  
        return new Producer<Integer, String>(new ProducerConfig(properties));  
     }  
      
      
    public static void main(String[] args) {  
        new kafkaProducer("test").start();// 使用kafka集群中创建好的主题 test   
          
    }  
       
}  
  
  
  
  
3  kafka集群中消费主题test的数据：  
[root@h2master kafka]# bin/kafka-console-consumer.sh --zookeeper localhost:2181 --topic test --from-beginnin  
  
4   启动java代码，然后在看集群消费的数据如下：  
  
message: 0  
message: 1  
message: 2  
message: 3  
message: 4  
message: 5  
message: 6  
message: 7  
message: 8  
message: 9  
message: 10  
message: 11  
message: 12  
message: 13  
message: 14  
message: 15  
message: 16  
message: 17  
message: 18  
message: 19  
message: 20  
message: 21  
```

 2 kafka 使用Java写消费者，这样 先运行kafkaProducer ，在运行kafkaConsumer，即可得到生产者的数据：

 

```
import java.util.HashMap;  
import java.util.List;  
import java.util.Map;  
import java.util.Properties;  
  
import kafka.consumer.Consumer;  
import kafka.consumer.ConsumerConfig;  
import kafka.consumer.ConsumerIterator;  
import kafka.consumer.KafkaStream;  
import kafka.javaapi.consumer.ConsumerConnector;  
  
  
  
  
/** 
 * 接收数据 
 * 接收到: message: 10 
接收到: message: 11 
接收到: message: 12 
接收到: message: 13 
接收到: message: 14 
 * @author zm 
 * 
 */  
public class kafkaConsumer extends Thread{  
  
    private String topic;  
      
    public kafkaConsumer(String topic){  
        super();  
        this.topic = topic;  
    }  
      
      
    @Override  
    public void run() {  
        ConsumerConnector consumer = createConsumer();  
        Map<String, Integer> topicCountMap = new HashMap<String, Integer>();  
        topicCountMap.put(topic, 1); // 一次从主题中获取一个数据  
         Map<String, List<KafkaStream<byte[], byte[]>>>  messageStreams = consumer.createMessageStreams(topicCountMap);  
         KafkaStream<byte[], byte[]> stream = messageStreams.get(topic).get(0);// 获取每次接收到的这个数据  
         ConsumerIterator<byte[], byte[]> iterator =  stream.iterator();  
         while(iterator.hasNext()){  
             String message = new String(iterator.next().message());  
             System.out.println("接收到: " + message);  
         }  
    }  
  
    private ConsumerConnector createConsumer() {  
        Properties properties = new Properties();  
        properties.put("zookeeper.connect", "192.168.1.110:2181,192.168.1.111:2181,192.168.1.112:2181");//声明zk  
        properties.put("group.id", "group1");// 必须要使用别的组名称， 如果生产者和消费者都在同一组，则不能访问同一组内的topic数据  
        return Consumer.createJavaConsumerConnector(new ConsumerConfig(properties));  
     }  
      
      
    public static void main(String[] args) {  
        new kafkaConsumer("test").start();// 使用kafka集群中创建好的主题 test   
          
    }  
       
}  
```

http://chengjianxiaoxue.iteye.com/blog/2190488