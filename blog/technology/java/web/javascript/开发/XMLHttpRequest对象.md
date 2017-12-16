XMLHttpRequest对象

分类: javascript
日期: 2014-07-16

原文地址: 

http://blog.chinaunix.net/uid-29632145-id-4357661.html

------

****[XMLHttpRequest对象]() *2014-07-16 11:33:19*

分类： JavaScript

写在前面的话:

> 浏览器大战使得浏览器之间的标准无法统一,直接导致了我们在做Web应用系统时,不得不考虑多种兼容方案,创建XMLHttpRequest对象即是如此.

创建XMLHttpRequest对象

> 1.创建新的XMLHttpRequest对象

> ```
> <script type="text/javascript">
>     var xmlHttp = new XMLHttpRequest(); script>
> ```

> 我们在IE6,IE7,IE8,Firefox3.6中分别运行这段代码,会发现IE5.5和IE6是无法识别XMLHttpRequest对象的.尽管微软已经开始在抛弃IE6,但仍有无数IE6的fans在使用IE6,那么我们不得不为这些用户考虑.
>
> 2.创建可在IE6下也可以运行XMLHttpRequest对象
>
> ```
> <script type="text/javascript">
>     var xmlHttp; //确保IE7,IE8,Firefox下可以运行 if (window.XMLHttpRequest) {
>         xmlHttp = new XMLHttpRequest();
>     } else { //确保IE6可以运行,这里可以无视更古老的IE浏览器了 if (window.ActiveXObject) {
>             xmlHttp = new ActiveXObject("Microsoft.XMLHttp");
>         }
>     } //如果均无法创建XMLHttpRequest对象,很遗憾,就放弃Ajax应用吧 if (xmlHttp = null) { return;
>     } script>
> ```

> 3.更简易的创建对象代码
>
> ```
> <script type="text/javascript">
>     var xmlHttp= window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHttp"); script>
> ```

XMLHttpRequest对象常用的属性和方法

> 下面我们来看Ajax的调用流程,主要是围绕XMLHttpRequest对象运行的.

> 复制《完整的Ajax实例》中的代码:
>
> ```
> //创建XMLHttpRequest对象 var xmlHttp = new XMLHttpRequest(); //获取值 var username = document.getElementById("txt_username").value; var age = document.getElementById("txt_age").value; //配置XMLHttpRequest对象 xmlHttp.open("get", "Get.aspx?username=" + escape(username)
>     + "&age=" + escape(age) + "&random=" + Math.random()); //设置回调函数 xmlHttp.onreadystatechange = function () { if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
>         document.getElementById("result").innerHTML = xmlHttp.responseText;
>     }
> } //发送请求 xmlHttp.send(null);
>
> ```
>
> 围绕上述代码,我们发现XMLHttpRequest的使用流程:
>
> 1.创建XMLHttpRequest对象
>
> 此步骤上面已经介绍过.
>
> 2.使用open方法配置请求
>
> open方法有五个参数,分别是:

- request-type

> 发送请求的类型,主要为Get和Post.该参数必须.

- url

> 要连接的url.该参数必须.

- asynch

> 如果希望使用异步连接,则为true,否则为false.此参数可选,默认为true.一般为更容易理解,一般写为true.

- username

> 如果需要身份验证,则可以指定用户名.此参数可选.

- password

> 如果需要身份验证,则可以指定密码.此参数可选.
>
> open使用方法:open(request-type,url,asynch)

> 3.设置回调函数
>
> 回调函数必须在发送请求前设定.我们设定了回调函数后,在随后发送请求后,在得到服务器的正常回应之后,就会调用设定的回调函数.
>
> 此处需要注意的是,一般正确的服务器响应会出现在xmlHttp.readyState=4且xmlHttp.status=200时.
>
> 对于服务器响应的数据,我们可以根据需要通过xmlHttp.responseText或xmlHttp.responseXML来获取.
>
> 4.发送请求
>
> 发送请求使用send方法,若为request-type为get时,可为send(null);若为post,则为send(data).

小结:

> 今天我们介绍了XMLHttpRequest对象是如何创建的,后面的文章我们来介绍open方法是如何使用的,我们将分两篇文章来介绍request-type分别为get或post时的情形.

附1:

> HTTP就绪状态readyState的属性值及含义:
>
> | 属性值  | 备注                           |
> | ---- | ---------------------------- |
> | 0    | 请求没有发出.在open之前               |
> | 1    | 请求已经建立,但还没有发出,在open之后,send之前 |
> | 2    | 请求已经发出,send已经被调用             |
> | 3    | 请求已经处理,部分数据可用,服务器尚未完全反应      |
> | 4    | 响应完成,可以访问服务器响应数据             |
>
> HTTP状态码status的常用属性值及含义:
>
> 2XX 成功
>
> 4XX 请求错误
>
> | 属性值  | 备注             |
> | ---- | -------------- |
> | 200  | 请求成功           |
> | 201  | 请求已实现          |
> | 202  | 服务器已接受请求,但尚未处理 |
> | 400  | 错误请求           |
> | 401  | 请求授权失败         |
> | 403  | 请求不允许          |
> | 404  | 没有发现文件,查询或URI  |
> | 500  | 服务器内部产生错误      |

 附2:

> HTTP状态码status的全部属性值及含义:
>
> 1xx：请求收到，继续处理
> 2xx：操作成功收到，分析、接受
> 3xx：完成此请求必须进一步处理
> 4xx：请求包含一个错误语法或不 能完成
> 5xx：服务器执行一个完全有效请求失败
>
> 100——客户必须继续发出请求
> 101——客户要求服务器根据请求转换HTTP协议版本
>
> 200——交易成功
> 201——提示知道新文件的URL
> 202——接受和处理、但处理未完成
> 203——返回信息不确定或不完整
> 204——请求收到，但返回信息为空
> 205——服务器完成了请求，用户代理必须复位当前已经浏览过的文件
> 206——服务器已经完成了部分用户的GET请求
>
> 300——请求的资源可在多处得到
> 301——删除请求数据
> 302——在其他地址发现了请求数据
> 303——建议客户访问其他URL或访问方式
> 304——客户端已经执行了GET，但文件未变化
> 305——请求的资源必须从服务器指定的地址得到
> 306——前一版本HTTP中使用的代码，现行版本中不再使用
> 307——申明请求的资源临时性删除
>
> 400——错误请求，如语法错误
> 401——请求授权失败
> 402——保留有效ChargeTo头响应
> 403——请求不允许
> 404——没有发现文件、查询或URl
> 405——用户在Request-Line字段定义的方法不允许
> 406——根据用户发送的Accept拖，请求资源不可访问
> 407——类似401，用户必须首先在代理服务器上得到授权
> 408——客户端没有在用户指定的饿时间内完成请求
> 409——对当前资源状态，请求不能完成
> 410——服务器上不再有此资源且无进一步的参考地址
> 411——服务器拒绝用户定义的Content-Length属性请求
> 412——一个或多个请求头字段在当前请求中错误
> 413——请求的资源大于服务器允许的大小
> 414——请求的资源URL长于服务器允许的长度
> 415——请求资源不支持请求项目格式
> 416——请求中包含Range请求头字段，在当前请求资源范围内没有range指示值，请求
> 也不包含If-Range请求头字段
> 417——服务器不满足请求Expect头字段指定的期望值，如果是代理服务器，可能是下
> 一级服务器不能满足请求
>
> 500——服务器产生内部错误
> 501——服务器不支持请求的函数
> 502——服务器暂时不可用，有时是为了防止发生系统过载
> 503——服务器过载或暂停维修
> 504——关口过载，服务器使用另一个关口或服务来响应用户，等待时间设定值较长
> 505——服务器不支持或拒绝支请求头中指定的HTTP版本
>
> －－－
>
> 英文版：
>
> 100：Continue
> 101：Switching Protocols
> 102：Processing
>
> 200：OK
> 201：Created
> 202：Accepted
> 203：Non-Authoriative Information
> 204：No Content
> 205：Reset Content
> 206：Partial Content
> 207：Multi-Status
>
> 300：Multiple Choices
> 301：Moved Permanently
> 302：Found
> 303：See Other
> 304：Not Modified
> 305：Use Proxy
> 306：(Unused)
> 307：Temporary Redirect
>
> 400：Bad Request
> 401：Unauthorized
> 402：Payment Granted
> 403：Forbidden
> 404：File Not Found
> 405：Method Not Allowed
> 406：Not Acceptable
> 407：Proxy Authentication Required
> 408：Request Time-out
> 409：Conflict
> 410：Gone
> 411：Length Required
> 412：Precondition Failed
> 413：Request Entity Too Large
> 414：Request-URI Too Large
> 415：Unsupported Media Type
> 416：Requested range not satisfiable
> 417：Expectation Failed
> 422：Unprocessable Entity
> 423：Locked
> 424：Failed Dependency
>
> 500：Internal Server Error
> 501：Not Implemented
> 502：Bad Gateway
> 503：Service Unavailable
> 504：Gateway Timeout
> 505：HTTP Version Not Supported
> 507：Insufficient Storage