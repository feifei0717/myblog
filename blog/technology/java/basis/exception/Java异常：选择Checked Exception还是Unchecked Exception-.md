Java包含两种异常：**checked异常**和**unchecked异常**。C#只有unchecked异常。checked和unchecked异常之间的区别是：

1. Checked异常必须被显式地捕获或者传递，如Basic try-catch-finally Exception Handling一文中所说。而unchecked异常则可以不必捕获或抛出。
2. Checked异常继承java.lang.Exception类。Unchecked异常继承自java.lang.RuntimeException类。

有许多支持或者反对二者甚至是否应该使用checked异常的争论。本文将讨论一些常见的观点。开始之前，先澄清一个问题：

Checked和unchecked异常从功能的角度来讲是等价的。可以用checked异常实现的功能必然也可以用unchecked异常实现，反之亦然。

选择checked异常还是unchecked异常是个人习惯或者组织规定问题。并不存在谁比谁强大的问题。

# 一个简单的例子

在讨论checked和unchecked异常的优缺点前先看一下代码中如下使用它们。下面是一个抛出checked异常的方法，另一个方法调用了它：

```
public void storeDataFromUrl(String url){  
    try {  
        String data = readDataFromUrl(url);  
    } catch (BadUrlException e) {  
        e.printStackTrace();  
    }  
}  
  
public String readDataFromUrl(String url)  
throws BadUrlException{  
    if(isUrlBad(url)){  
        throw new BadUrlException("Bad URL: " + url);  
    }  
  
    String data = null;  
    //read lots of data over HTTP and return  
    //it as a String instance.  
  
    return data;  
}  
```

readDataFromUrl()方法抛出了BadUrlException。BadUrlException是我自己实现的一个类。由于BadUrlException继承自java.lang.Exception，因而它是checked异常：

```
public class BadUrlException extends Exception {  
    public BadUrlException(String s) {  
        super(s);  
    }  
} 
```

如果storeDataFromUrl()方法想要调用readDataFromUrl()，它只有两种选择。要么捕获BadUrlException，要么沿着调用栈继续向上传播该异常。上面的代码中storeDataFromUrl() 捕获了异常。向上传播异常的实现方法如下：

```
public void storeDataFromUrl(String url)  
throws BadUrlException{  
    String data = readDataFromUrl(url);  
}  
```

可以看到，上述代码去掉了catch块，方法声明中加上了throws BadUrlException。下面，讨论一下unchecked异常的实现方法。首先，将BadUrlException改为继承自java.lang.RuntimeException：

```
public class BadUrlException extends RuntimeException {  
    public BadUrlException(String s) {  
        super(s);  
    }  
}  
```

然后，把方法中的异常改为unchecked BadUrlException：

```
public void storeDataFromUrl(String url){  
    String data = readDataFromUrl(url);  
}  
  
public String readDataFromUrl(String url) {  
    if(isUrlBad(url)){  
        throw new BadUrlException("Bad URL: " + url);  
    }  
  
    String data = null;  
    //read lots of data over HTTP and  
    //return it as a String instance.  
  
    return data;  
}  
```

注意，readDataFromUrl()方法不再声明抛出BadUrlException。storeDataFromUrl()方法也不必捕获BadUrlException。storeDataFromUrl()也可以捕获异常，但不再是必须的了，而且它也不必声明传播异常。

# Checked 还是Unchecked？

上一节我们已经讨论了checked异常和unchecked异常代码实现上的区别，下面深入分析二者的适用情况（支持和反对二者的观点）。

一些Java书籍（如Suns Java Tutorial）中建议在遇到可恢复的错误时采用checked异常，遇到不可恢复的异常时采用unchecked异常。事实上，大多数应用必须从几乎所有异常（包括NullPointerException，IllegalArgumentException和许多其他unchecked异常）中恢复。执行失败的action/transaction会被取消，但是应用程序必须能继续处理后续的action或transaction。关闭一个应用的唯一合法时机是应用程序启动时。例如，如果配置文件丢失而且应用程序依赖于它，那么这时关闭应用程序是合法的。

我建议的使用策略是：选择checked异常或unchecked异常中的一种使用。混合使用经常导致混乱和不一致。如果你是一个经验丰富的程序员，那么根据自己的需要使用吧。

下面是支持和反对checked/unchecked异常的一些最常见的观点。支持一种类型的exception的观点通常意味着反对另一种（支持checked = 反对unchecked，支持unchecked = 反对checked）。因此，只列出了支持checked异常或unchecked异常的列表。

1. 支持Checked异常：
   编译器强制检查，checked异常必须被捕获或者传播，这样就不会忘记处理异常。
2. 支持Checked异常：
   Unchecked异常容易忘记处理，由于编译器不强制程序员捕获或传播它（第一条的反面表述）。
3. 支持Unchecked异常：
   沿调用栈向上传播的Checked异常破坏了顶层的方法，因为这些方法必须声明抛出所有它们调用的方法抛出的异常。
4. 支持Checked异常：
   当方法不声明它们会抛出何种异常时，就难以处理它们抛出的异常。
5. 支持Unchecked异常：
   Check异常的抛出作为方法接口的一部分，这使得添加或移除早期版本中方法的异常难以实现。

上述每一个观点都有相反的观点，下面我会详细讨论这些观点。

## 观点1（支持Checked异常）：

编译器强制检查，checked异常必须被捕获或者传播，这样就不会忘记处理异常。

### 相反观点：

当被强制捕获或传播许多异常时，开发人员的效率会受到影响，也可能会只写

```

try{  
   callMethodThatThrowsException();  
catch(Exception e){  
}  
```

来忽略错误（糊弄了事）。

## 观点2（支持Checked异常）：

Unchecked异常容易忘记处理，由于编译器不强制程序员捕获或传播它（第一条的反面表述）。

### 相反观点1：

强制处理或传播checked异常导致的草率地异常处理非常糟糕。

### 相反观点2：

在近期的一个大型项目中我们决定采用unchecked异常。我在这个项目中获得的经验是：使用unchecked异常时，任何方法都可能抛出异常。因此我不论在写哪一部分代码都时刻注意异常。而不只是声明了checked异常的地方。

此外，许多没有声明任何checked异常的标准的Java API方法会抛出诸如NullPointerException或者InvalidArgumentException之类的unchecked异常。你的应用程序需要处理这些unchecked异常。你可能会说checked异常的存在让我们容易忘记处理unchecked异常，因为unchecked异常没有显式地声明。

## 观点3（支持Unchecked异常）：

沿调用栈向上传播的Checked异常破坏了顶层的方法，因为这些方法必须声明抛出所有它们调用的方法抛出的异常。即，声明的异常聚合了调用栈中所有的方法抛出的异常。例如：

```
public long readNumberFromUrl(String url)  
throws BadUrlExceptions, BadNumberException{  
    String data = readDataFromUrl(url);  
    long number = convertData(data);  
    return number;  
}  
  
private String readDataFromUrl(String url)  
throws BadUrlException {  
   //throw BadUrlException if url is bad.  
   //read data and return it.  
}  
  
private long convertData(String data)  
throws BadNumberException{  
    //convert data to long.  
    //throw BadNumberException if number isn't within valid range.  
}  
```

readNumberFromUrl()必须声明抛出BadUrlException和BadNumberException，而这两个异常是readNumberFromUrl()调用的readDataFromUrl() 和 converData()方法抛出的异常。可以想象一个有数千个类的应用程序的顶层方法需要声明多少异常。这使得checked异常传播是一件非常痛苦的事。

### 相反观点1：

异常声明传播聚合在实际应用程序中很少发生。开发人员时常使用**异常包装机制**来优化。如下：

```
public void readNumberFromUrl(String url)  
throws ApplicationException{  
    try{  
        String data = readDataFromUrl(url);  
        long number = convertData(data);  
    } catch (BadUrlException e){  
        throw new ApplicationException(e);  
    } catch (BadNumberException e){  
        throw new ApplicationException(e);  
    }  
}  
```

readNumberFromUrl()方法只需要声明抛出ApplicationException即可。BadUrlException和BadNumberException被捕获并包装进一个更通用的ApplicationException中。通过异常包装就可以避免异常声明聚合。

我的个人观点是，如果你只是包装异常但并不提供更多信息，那为什么要包装它呢？try-catch块就成了多余的代码，没有做任何有意义的事。只需将ApplicationException，BadUrlException和BadNumberException定义为unchecked异常。下面是上述代码的unchecked版本：

```
public void readNumberFromUrl(String url){  
    String data = readDataFromUrl(url);  
    long number = convertData(data);  
} 
```

也可以包装unchecked异常。下面是unchecked代码的包装版本。注意readNumberFromUrl()方法不声明抛出ApplicationException，即使它可能抛出该异常。

```
public void readNumberFromUrl(String url)  
    try{  
        String data = readDataFromUrl(url);  
        long number = convertData(data);  
    } catch (BadUrlException e){  
        throw new ApplicationException(  
            "Error reading number from URL", e);  
    } catch (BadNumberException e){  
        throw new ApplicationException(  
            "Error reading number from URL", e);  
    }  
}  
```

### 相反观点2：

另一种常用于避免异常声明聚集的技术是创建一个应用程序基础异常类。应用程序中抛出的所有异常必须是基础异常类的子类。所有抛出异常的方法只需声明抛出基础异常。比如一个抛出Exception的方法可能抛出Exception的任何子类。如下代码：

```
public long readNumberFromUrl(String url)  
throws ApplicationException {  
    String data = readDataFromUrl(url);  
    long number = convertData(data);  
    return number;  
}  
  
private String readDataFromUrl(String url)  
throws BadUrlException {  
   //throw BadUrlException if url is bad.  
   //read data and return it.  
}  
  
private long convertData(String data)  
throws BadNumberException{  
    //convert data to long.  
    //throw BadNumberException if number isn't within valid range.  
}  
  
  
public class ApplicationException extends Exception{ }  
public class BadNumberException   extends ApplicationException{}  
public class BadUrlException      extends ApplicationException{}  
```

 

注意BadNumberException和BadUrlException不再被声明抛出，也不再被捕获，也没有包装。它们是ApplicationException的子类，因此它们会沿着调用栈向上传播。

我还是支持**异常包装**：如果应用程序的所有方法都声明抛出ApplicationException（基础异常），为什么不直接将ApplicationException定义为unchecked？这样不但省去了一些try-catch块，也省去了throws语句。

## 观点4（支持Checked异常）：

当方法不声明它们会抛出何种异常时，就难以处理它们抛出的异常。如果没有声明，你就不会知道方法会抛出什么样的异常。因此你也就不会知道如何处理它们。当然，如果你能访问源代码，就不存在这个问题，因为你可以从源代码中看出来会抛出何种异常。

### 相反观点：

在多数情况下，处理异常的措施仅仅是向用户弹出一个错误提示消息，将错误消息写入日志，回滚事务等。无论发生何种异常，你可能会采用相同的处理措施。因此，应用程序通常包含一些集中的通用错误处理代码。如此一来，确切获知抛出了何种异常也就不那么重要了。

## 观点5（支持Unchecked异常）：

Check异常的抛出作为方法接口的一部分，这使得添加或移除早期版本中方法的异常难以实现。

### 相反观点：

如果方法采用了基础异常机制，就不存在这个问题。如果方法声明抛出基础异常，那么可以方便抛出新异常。唯一的需求是新异常必须是基础异常的子类。

需要再强调一遍的是，让所有可能抛出异常的方法声明抛出相同的基础异常的意义何在？这样能比抛出unchecked异常更好地处理异常吗？

## 

# 总结

我过去支持checked异常，但是最近我改变了我的观点。Rod Johnson（Spring Framework），Anders Hejlsberg（C#之父），Joshua Bloch（Effective Java，条目41：避免checked异常的不必要的使用）和其他一些朋友使我重新考虑了checked异常的真实价值。最近我们尝试在一个较大的项目中使用unchecked异常，效果还不错。错误处理被集中在了少数几个类中。会有需要本地错误处理的地方，而不是将异常传播给主错误处理代码。但是这种地方不会很多。由于代码中不会到处都是try-catch块，我们的代码变得可读性更好。换句话说，使用unchecked异常比使用checked异常减少了无用的catch-rethrow try-catch块。总之，我建议使用unchecked异常。至少在一个工程中尝试过。我总结了以下原因：

- Unchecked异常不会使代码显得杂乱，因为其避免了不必要的try-catch块。
- Unchecked异常不会因为异常声明聚集使方法声明显得杂乱。
- 关于容易忘记处理unchecked异常的观点在我的实践中没有发生。
- 关于无法获知如何处理未声明异常的观点在我的实践中没有发生。
- Unchecked异常避免了版本问题。

你的项目中使用何种异常由你自己决定。下面是相关的资料。

Anders Hejlsberg on checked vs. unchecked exceptions
http://www.artima.com/intv/handcuffs.html 

James Gosling on checked exceptions
http://www.artima.com/intv/solid.html 

Bill Venners on Exceptions
http://www.artima.com/interfacedesign/exceptions.html 

Bruce Eckel on checked exceptions
http://www.artima.com/intv/typingP.html 

Designing with Exceptions (Bill Venners - www.artima.com)
http://www.artima.com/designtechniques/desexcept.html 

Effective Java (Joshua Bloch - Addison Wesley 2001) 

Daniel Pietraru - in favor of checked exceptions
http://littletutorials.com/2008/05/06/exceptional-java-checked-exceptions-are-priceless-for-everything-else-there-is-the-the-runtimeexception/

英文原文：http://tutorials.jenkov.com/java-exception-handling/checked-or-unchecked-exceptions.html

来源： [http://blog.csdn.net/kingzone_2008/article/details/8535287](http://blog.csdn.net/kingzone_2008/article/details/8535287)