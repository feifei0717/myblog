## LR专栏之——场景运行时提示error

(2010-04-09 14:21:08)

​    在录制了flex脚本后，LoadRunner场景运行时提示error：You do not have a license for this Vuser type.Please contact HP Software to renew your license。

​    这是由于license不正确导致的，解决方法很简单，直接换一个license即可。

​    解决方法如下：

​    1、一般破解的时使用的License也就是目前网络上比较通用的两个：

​    global 100user     AEAMAUIK-YAFEKEKJJKEEA-BCJGI

​    10000 web clients  AEABEXFR-YTIEKEKJJMFKEKEKWBRAUNQJU-KBYGB

​    2、loadrunner的License管理器，只支持一个License，先后输入了上面的两个License，最后实际生效的只有最后一个 10000 web clients的。

​    3、而loadrunner不同协议要求不同的License。10000 web clients是不能用于java Vuser的。因此必须将License修改为global 100user。（一般C Vuser协议使用 global 100user注册码，Java Vuser协议使用10000 web clients注册码，而flex属于Java Vuser类的协议）

​    修改方法：将loadrunner所有程序关闭，然后运行lr_del_license.exe，删除lr的注册信息。再重新打开LR。将license设置为global 100user。然后flex协议就可以在场景里跑起来了。

​    4、此license只支持100个虚拟用户，如果需要100以上的虚拟用户，就需要再更换一个license。

​       500 VU   BGAUGLIX-AJGI-AEIEKEKJJKEAFJP-BDFHW

​       但是，此license是LR8.0的已经过期，所以需要将本机时间进行修改，改道2003-10-31之前即可

来源： <<http://blog.sina.com.cn/s/blog_6408f82c0100hyl2.html>>