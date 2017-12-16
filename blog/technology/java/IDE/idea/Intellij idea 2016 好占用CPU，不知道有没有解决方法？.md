试了半天终于找到一个临时的解决办法，给大家分享一下，第一还是配置jvm的参数，idea(64).exe.vmoptions内容如下：



```
-Xms1024m 
-Xmx2048m 
-XX:MaxPermSize=512m 
-XX:ReservedCodeCacheSize=256m 
-ea 
-Dsun.io.useCanonCaches=false
-Dsun.awt.keepWorkingSetOnMinimize=true
-Djava.net.preferIPv4Stack=true
-Djsse.enableSNIExtension=false
-XX:+UseCodeCacheFlushing 
-XX:+UseConcMarkSweepGC 
-XX:SoftRefLRUPolicyMSPerMB=50
```

第二步就是关闭代码检查，这个可根据需要关闭一些，代码检查没必要都检查，非常耗费性能，全部关闭后效果明显；关闭方法

file->settings->editor->inspections 

有其他好的建议希望大家能交流；idea感觉比eclipse还是非常好用的特别是debug