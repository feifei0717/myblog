Throwable类是所有异常的始祖，它有两个直接子类Error / Exception： 
  Error仅在Java虚拟机中发生动态连接失败或其它的定位失败的时候抛出一个Error对象。一般程序不用捕捉或抛出Error对象。 

Unchecked Exception: 
a. 指的是程序的瑕疵或逻辑错误，并且在运行时无法恢复。 
b. 包括Error与RuntimeException及其子类，如：OutOfMemoryError, UndeclaredThrowableException, IllegalArgumentException, IllegalMonitorStateException, NullPointerException, IllegalStateException, IndexOutOfBoundsException等。 
c. 语法上不需要声明抛出异常。 

Checked Exception: 
a. 代表程序不能直接控制的无效外界情况（如用户输入，数据库问题，网络异常，文件丢失等） 
b. 除了Error和RuntimeException及其子类之外，如：ClassNotFoundException, NamingException, ServletException, SQLException, IOException等。 
c. 需要try catch处理或throws声明抛出异常。 

有点困惑的是：RuntimeException (Unchecked)是Exception (Checked)的子类。 

示例： 

```
public class GenericException extends Exception {  
    public GenericException() {  
    }  
  
    public GenericException(String message) {  
        super(message);  
    }  
}  
```

Java代码

```
public class TestException {  
    public void first() throws GenericException {  
        throw new GenericException("Generic exception"); // Checked Exception需要显式声明抛出异常或者try catch处理  
    }  
      
    public void second(String msg) {  
        if (msg == null)  
            throw new NullPointerException("Msg is null"); // Unchecked Exception语法上不需要处理  
    }  
      
    public void third() throws GenericException {  
        first(); // 调用有Checked Exception抛出的方法也需要try catch或声明抛出异常  
    }  
  
    public static void main(String[] args) {  
        TestException test = new TestException();  
        try {  
            test.first();  
        } catch (GenericException e) {  
            e.printStackTrace();  
        }  
          
        test.second(null);  
    }  
}  
```

来源： [http://czj4451.iteye.com/blog/1851825](http://czj4451.iteye.com/blog/1851825)