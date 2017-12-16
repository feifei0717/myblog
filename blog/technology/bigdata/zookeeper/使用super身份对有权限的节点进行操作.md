# 使用super身份对有权限的节点进行操作.md

转载请用注明：[@ni掌柜](http://weibo.com/nileader) nileader@gmail.com

​      如果客户端设置了权限，那么其它人如果没有授权，就无法对这个节点进行操作。但是对于管理员来说，有没有一种方法，可以对任意节点进行操作呢，答案是有的~

方法简单描述如下：

**1. **确认是否开启zookeeper的superDigest模式。方法如下：

​     首先配置如下启动参数，然后重启server

```
 "-Dzookeeper.DigestAuthenticationProvider.superDigest=super:/7ahZf2EjED/untmtb2NRkHhVlA=" 	
```

**2. **在java代码中进行digest模式的授权，方法如下：

```
zkClient.addAuthInfo( "digest", "super:yinshi.nc-1988".getBytes() ); 
```

**3. **具体样例参见下面：

```
import java.util.ArrayList; 
import java.util.List; 
 
import org.apache.zookeeper.WatchedEvent; 
import org.apache.zookeeper.Watcher; 
import org.apache.zookeeper.ZooDefs.Ids; 
import org.apache.zookeeper.data.ACL; 
import org.apache.zookeeper.server.auth.DigestAuthenticationProvider; 
 
/** 
 * Description: ZooKeeper-Authentication Test 
 * @author   nileader / nileader@gmail.com 
 * @Date     Jul 12, 2012 
 */ 
public class DemoAuth2 implements Watcher { 
 
    final static String SERVER_LIST = "127.0.0.1:2181"; 
     
    final static String PATH = "/yinshi_auth_test"; 
    final static String PATH_DEL = "/yinshi_auth_test/will_be_del"; 
 
    final static String authentication_type = "digest"; 
 
    final static String correctAuthentication = "taokeeper:true"; 
    final static String badAuthentication = "taokeeper:errorCode"; 
    final static String superAuthentication = "super:yinshi.nc-1988"; 
 
    static ZkClient zkClient = null; 
 
    public static void main( String[] args ) throws Exception { 
 
        System.out.println( DigestAuthenticationProvider.generateDigest( "super:yinshi.nc-1988" ) ); 
         
        List< ACL > acls = new ArrayList< ACL >( 1 ); 
        for ( ACL ids_acl : Ids.CREATOR_ALL_ACL ) { 
            acls.add( ids_acl ); 
        } 
 
        try { 
            zkClient = new ZkClient( SERVER_LIST, 50000); 
            zkClient.addAuthInfo( authentication_type, correctAuthentication.getBytes() ); 
        } catch ( Exception e ) { 
            // TODO Auto-generated catch block 
            e.printStackTrace(); 
        } 
 
        try { 
            zkClient.createPersistent( PATH, acls, "init content" ); 
            System.out.println( "使用授权key：" + correctAuthentication + "创建节点：" + PATH + ", 初始内容是: init content" ); 
        } catch ( Exception e ) { 
            e.printStackTrace(); 
        } 
        try { 
            zkClient.createPersistent( PATH_DEL, acls, "待删节点" ); 
            System.out.println( "使用授权key：" + correctAuthentication + "创建节点：" + PATH_DEL + ", 初始内容是: init content" ); 
        } catch ( Exception e ) { 
            // TODO Auto-generated catch block 
            e.printStackTrace(); 
        } 
 
        // 获取数据 
        getDataByNoAuthentication(); 
        getDataByBadAuthentication(); 
        getDataByCorrectAuthentication(); 
        getDataByBadAuthentication(); 
        getDataBySuperAuthentication(); 
// 
//      // 更新数据 
//      updateDataByNoAuthentication(); 
//      updateDataByBadAuthentication(); 
//      updateDataByCorrectAuthentication(); 
// 
//      // 获取数据 
//      getDataByNoAuthentication(); 
//      getDataByBadAuthentication(); 
//      getDataByCorrectAuthentication(); 
// 
//      //删除数据 
//      deleteNodeByBadAuthentication(); 
//      deleteNodeByNoAuthentication(); 
//      deleteNodeByCorrectAuthentication(); 
// 
//      deleteParent(); 
         
        zkClient.close(); 
    } 
 
    /** 获取数据：采用错误的密码 */ 
    static void getDataByBadAuthentication() { 
        String prefix = "[使用错误的授权信息]"; 
        try { 
            System.out.println( prefix + "获取数据：" + PATH ); 
            zkClient = new ZkClient( SERVER_LIST, 50000); 
            zkClient.addAuthInfo( authentication_type, badAuthentication.getBytes() ); 
            System.out.println( prefix + "成功获取数据：" + zkClient.readData( PATH ) ); 
        } catch ( Exception e ) { 
            System.err.println( prefix + "获取数据失败，原因：" + e.getMessage() ); 
        } 
    } 
 
    /** 获取数据：不采用密码 */ 
    static void getDataByNoAuthentication() { 
        String prefix = "[不使用任何授权信息]"; 
        try { 
            System.out.println( prefix + "获取数据：" + PATH ); 
            zkClient = new ZkClient( SERVER_LIST, 50000); 
            System.out.println( prefix + "成功获取数据：" + zkClient.readData( PATH ) ); 
        } catch ( Exception e ) { 
            System.err.println( prefix + "获取数据失败，原因：" + e.getMessage() ); 
        } 
    } 
 
    /** 采用正确的密码 */ 
    static void getDataByCorrectAuthentication() { 
        String prefix = "[使用正确的授权信息]"; 
        try { 
            System.out.println( prefix + "获取数据：" + PATH ); 
            zkClient = new ZkClient( SERVER_LIST, 50000); 
            zkClient.addAuthInfo( authentication_type, correctAuthentication.getBytes() ); 
            System.out.println( prefix + "成功获取数据：" + zkClient.readData( PATH ) ); 
        } catch ( Exception e ) { 
            System.out.println( prefix + "获取数据失败，原因：" + e.getMessage() ); 
        } 
    } 
     
    /** 采用超级用户的密码 */ 
    static void getDataBySuperAuthentication() { 
        String prefix = "[使用超级用户的授权信息]"; 
        try { 
            System.out.println( prefix + "获取数据：" + PATH ); 
            zkClient = new ZkClient( SERVER_LIST, 50000); 
            zkClient.addAuthInfo( authentication_type, superAuthentication.getBytes() ); 
            System.out.println( prefix + "成功获取数据：" + zkClient.readData( PATH ) ); 
        } catch ( Exception e ) { 
            System.out.println( prefix + "获取数据失败，原因：" + e.getMessage() ); 
        } 
    } 
 
    /** 
     * 更新数据：不采用密码 
     */ 
    static void updateDataByNoAuthentication() { 
         
        String prefix = "[不使用任何授权信息]"; 
         
        System.out.println( prefix + "更新数据： " + PATH ); 
        try { 
            zkClient = new ZkClient( SERVER_LIST, 50000); 
            if( zkClient.exists( PATH ) ){ 
                zkClient.writeData( PATH, prefix ); 
                System.out.println( prefix + "更新成功" ); 
            } 
        } catch ( Exception e ) { 
            System.err.println( prefix + "更新失败，原因是：" + e.getMessage() ); 
        } 
    } 
 
    /** 
     * 更新数据：采用错误的密码 
     */ 
    static void updateDataByBadAuthentication() { 
         
        String prefix = "[使用错误的授权信息]"; 
         
        System.out.println( prefix + "更新数据：" + PATH ); 
        try { 
            zkClient = new ZkClient( SERVER_LIST, 50000); 
            zkClient.addAuthInfo( authentication_type, badAuthentication.getBytes() ); 
            if( zkClient.exists( PATH ) ){ 
                zkClient.writeData( PATH, prefix ); 
                System.out.println( prefix + "更新成功" ); 
            } 
        } catch ( Exception e ) { 
            System.err.println( prefix + "更新失败，原因是：" + e.getMessage() ); 
        } 
    } 
 
    /** 
     * 更新数据：采用正确的密码 
     */ 
    static void updateDataByCorrectAuthentication() { 
         
        String prefix = "[使用正确的授权信息]"; 
         
        System.out.println( prefix + "更新数据：" + PATH ); 
        try { 
            zkClient = new ZkClient( SERVER_LIST, 50000); 
            zkClient.addAuthInfo( authentication_type, correctAuthentication.getBytes() ); 
            if( zkClient.exists( PATH ) ){ 
                zkClient.writeData( PATH, prefix ); 
                System.out.println( prefix + "更新成功" ); 
            } 
        } catch ( Exception e ) { 
            System.err.println( prefix + "更新失败，原因是：" + e.getMessage() ); 
        } 
    } 
 
     
    /** 
     * 不使用密码 删除节点 
     */ 
    static void deleteNodeByNoAuthentication() throws Exception { 
         
        String prefix = "[不使用任何授权信息]"; 
         
        try { 
            System.out.println( prefix + "删除节点：" + PATH_DEL ); 
            zkClient = new ZkClient( SERVER_LIST, 50000); 
            if( zkClient.exists( PATH_DEL ) ){ 
                zkClient.delete( PATH_DEL ); 
                System.out.println( prefix + "删除成功" ); 
            } 
        } catch ( Exception e ) { 
            System.err.println( prefix + "删除失败，原因是：" + e.getMessage() ); 
        } 
    } 
     
     
     
    /** 
     * 采用错误的密码删除节点 
     */ 
    static void deleteNodeByBadAuthentication() throws Exception { 
         
        String prefix = "[使用错误的授权信息]"; 
         
        try { 
            System.out.println( prefix + "删除节点：" + PATH_DEL ); 
            zkClient = new ZkClient( SERVER_LIST, 50000); 
            zkClient.addAuthInfo( authentication_type, badAuthentication.getBytes() ); 
            if( zkClient.exists( PATH_DEL ) ){ 
                zkClient.delete( PATH_DEL ); 
                System.out.println( prefix + "删除成功" ); 
            } 
        } catch ( Exception e ) { 
            System.err.println( prefix + "删除失败，原因是：" + e.getMessage() ); 
        } 
    } 
 
 
 
    /** 
     * 使用正确的密码删除节点 
     */ 
    static void deleteNodeByCorrectAuthentication() throws Exception { 
         
        String prefix = "[使用正确的授权信息]"; 
         
        try { 
            System.out.println( prefix + "删除节点：" + PATH_DEL ); 
            zkClient = new ZkClient( SERVER_LIST, 50000); 
            zkClient.addAuthInfo( authentication_type, correctAuthentication.getBytes() ); 
            if( zkClient.exists( PATH_DEL ) ){ 
                zkClient.delete( PATH_DEL ); 
                System.out.println( prefix + "删除成功" ); 
            } 
        } catch ( Exception e ) { 
            System.out.println( prefix + "删除失败，原因是：" + e.getMessage() ); 
        } 
    } 
     
     
     
    /** 
     * 使用正确的密码删除节点 
     */ 
    static void deleteParent() throws Exception { 
        try { 
            zkClient = new ZkClient( SERVER_LIST, 50000); 
            zkClient.addAuthInfo( authentication_type, correctAuthentication.getBytes() ); 
            if( zkClient.exists( PATH ) ){ 
                zkClient.delete( PATH ); 
            } 
        } catch ( Exception e ) { 
            e.printStackTrace(); 
        } 
    } 
 
    @Override 
    public void process( WatchedEvent event ) { 
        // TODO Auto-generated method stub 
         
    } 
 
} 
```

 

来源： <[http://nileader.blog.51cto.com/1381108/930635](http://nileader.blog.51cto.com/1381108/930635)>

 