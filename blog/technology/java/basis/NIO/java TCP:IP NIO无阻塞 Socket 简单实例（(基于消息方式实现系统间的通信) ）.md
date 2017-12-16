# java分布式开发TCP/IP NIO无阻塞 Socket（(基于消息方式实现系统间的通信) ）

代码位置:/Users/jerryye/backup/studio/AvailableCode/basis/io_nio/io_nio_demo/src/main/java/com/practice/NIO/simpleTcp

在java中可以基于java.nio.channels中的Channel和Selector的相关类来实现TCP/IP+NIO方式的系统间通信。

 

用于系统间通信依靠SocketChannel和ServerSocketChannel，SocketChannel用于建立连接，监听事件及操作读写，ServerSocketChannel用于监听端口及监听连接事件，可通过Selector来获取是否有要处理的事件。

 

## 服务端java代码：

 

```
package com.java.distributed.message.tcpip;  
  
import java.io.IOException;  
import java.net.InetSocketAddress;  
import java.net.ServerSocket;  
import java.nio.ByteBuffer;  
import java.nio.channels.SelectionKey;  
import java.nio.channels.Selector;  
import java.nio.channels.ServerSocketChannel;  
import java.nio.channels.SocketChannel;  
import java.nio.charset.Charset;  
  
public class NIOServer {  
  
    /** 
     * @param args 
     * @throws IOException  
     */  
    public static void main(String[] args) throws IOException {  
        int port =7889;  
        //打开选择器  
        Selector selector=Selector.open();  
        //打开服务器套接字通道  
        ServerSocketChannel ssc=ServerSocketChannel.open();  
        //检索与此通道关联的服务器套接字  
        ServerSocket serverSocket=ssc.socket();  
        //将 ServerSocket 绑定到特定地址（IP 地址和端口号）  
        serverSocket.bind(new InetSocketAddress(port));  
        System.out.println("server listen on port:"+port);  
          
        //调整通道的阻塞模式  
        ssc.configureBlocking(false);  
        //向给定的选择器注册此通道，返回一个选择键。SelectionKey.OP_ACCEPT--用于套接字接受操作的操作集位     
        ssc.register(selector, SelectionKey.OP_ACCEPT);  
          
        while(true){  
            //timeout:为正，则在等待某个通道准备就绪时最多阻塞 timeout 毫秒；如果为零，则无限期地阻塞；必须为非负数  
            int nKeys=selector.select(1000);  
            if(nKeys>0){  
                  
                for(SelectionKey key:selector.selectedKeys()){  
                    /*测试此键的通道是否已准备好接受新的套接字连接-- 
                     * 如果此键的通道不支持套接字接受操作，则此方法始终返回 false 
                     * */  
                    if(key.isAcceptable()){  
                        ServerSocketChannel server=(ServerSocketChannel) key.channel();  
                        SocketChannel sc=server.accept();  
                          
                        if(sc==null){  
                            continue;  
                        }  
                        sc.configureBlocking(false);  
                        sc.register(selector, SelectionKey.OP_READ);  
                    }else if(key.isReadable()){  
                        //分配一个新的字节缓冲区  
                        ByteBuffer buffer=ByteBuffer.allocate(1024);  
                        SocketChannel sc=(SocketChannel) key.channel();  
                        int readBytes=0;  
                        String message=null;  
                        try{  
                            int ret;  
                            try{  
                                while((ret=sc.read(buffer))>0){  
                                    readBytes +=ret;  
                                }  
                                  
                            }catch(Exception e ){  
                                readBytes=0;  
                                //ignore  
                            }finally{  
                                //反转此缓冲区。首先对当前位置设置限制，然后将该位置设置为零  
                                buffer.flip();  
                            }  
                              
                            if(readBytes>0){  
                                message=Charset.forName("UTF-8").decode(buffer).toString();  
                                buffer=null;  
                            }  
                        }finally{  
                            if(buffer!=null)  
                                buffer.clear();  
                        }  
                          
                        if(readBytes>0){  
                            System.out.println("message from client:"+message);  
                            if("quit".equalsIgnoreCase(message.trim())){  
                                sc.close();  
                                selector.close();  
                                System.out.println("Server has been shutdown!");  
                                System.exit(0);  
                            }  
                            String outMessage="server response:"+message;  
                            sc.write(Charset.forName("UTF-8").encode(outMessage));  
                        }  
                          
                    }  
                }  
                selector.selectedKeys().clear();  
            }  
          
        }  
    }  
}  
```

 

## 客户端java代码：

 

```
package com.java.distributed.message.tcpip;  
  
import java.io.BufferedReader;  
import java.io.IOException;  
import java.io.InputStreamReader;  
import java.net.InetSocketAddress;  
import java.net.SocketAddress;  
import java.nio.ByteBuffer;  
import java.nio.channels.SelectionKey;  
import java.nio.channels.Selector;  
import java.nio.channels.SocketChannel;  
import java.nio.charset.Charset;  
  
  
public class NIOClient {  
  
    /** 
     * @param args 
     * @throws IOException  
     */  
    public static void main(String[] args) throws IOException {  
        int port =7889;  
        SocketChannel channel=SocketChannel.open();  
        channel.configureBlocking(false);  
          
        SocketAddress target=new InetSocketAddress("127.0.0.1",port);  
        channel.connect(target);  
        Selector selector=Selector.open();  
        //用于套接字连接操作的操作集位  
        channel.register(selector, SelectionKey.OP_CONNECT);  
        BufferedReader systemIn=new BufferedReader(new InputStreamReader(System.in));  
          
        while(true){  
            if(channel.isConnected()){  
                String command=systemIn.readLine();  
                channel.write(Charset.forName("UTF-8").encode(command));  
                  
                if(command==null||"quit".equalsIgnoreCase(command.trim())){  
                    systemIn.close();  
                    channel.close();  
                    selector.close();  
                    System.out.println("Client quit !");  
                    System.exit(0);  
                }  
            }  
            int nKeys=selector.select(1000);  
            if(nKeys>0){  
                for(SelectionKey key:selector.selectedKeys()){  
                    if(key.isConnectable()){  
                        SocketChannel sc=(SocketChannel) key.channel();  
                        sc.configureBlocking(false);  
                        sc.register(selector, SelectionKey.OP_READ);  
                        sc.finishConnect();  
                    }else if(key.isReadable()){  
                        ByteBuffer buffer=ByteBuffer.allocate(1024);  
                        SocketChannel sc=(SocketChannel) key.channel();  
                        int readBytes=0;  
                        try{  
                            int ret=0;  
                            try{  
                                while((ret=sc.read(buffer))>0){  
                                    readBytes+=ret;  
                                }  
                            }finally{  
                                buffer.flip();  
                            }  
                            if (readBytes > 0) {     
                                System.out.println(Charset.forName("UTF-8")     
                                        .decode(buffer).toString());     
                                buffer = null;     
                            }     
  
                        }finally {     
                            if (buffer != null) {     
                                buffer.clear();     
                            }  
                        }  
                    }  
                }  
                    selector.selectedKeys().clear();     
            }  
        }  
    }  
  
}  
```

http://mars914.iteye.com/blog/1238353