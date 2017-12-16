安全杀死TOMCAT进程的Linux Shell脚本

分类: linux
日期: 2015-05-05

 

http://blog.chinaunix.net/uid-29632145-id-5008711.html

------

****[安全杀死TOMCAT进程的Linux Shell脚本]() *2015-05-05 16:41:34*

分类： LINUX

安全杀死TOMCAT进程的Linux Shell脚本，由于此脚本里面用到了很多不错的脚本编程技巧，在此分享给大家；

```
#!/bin/bash
#
# Firstly find the process of the tomcat....
TOMCAT_PROCESS_STR=`ps aux | grep 'java.*tomcat' | grep -v grep`
PROCESS_ARRAY=(${TOMCAT_PROCESS_STR// / })
TOMCAT_PROCESS_ID=${PROCESS_ARRAY[1]}
echo $TOMCAT_PROCESS_ID
#
# Secondly send stop tomcat to see if we can kill it
stoptomcat

sleep 12
#
# Last we'll use kill tomcat process in a looking up loop
for ((a=1;a<=100;a++))
do
  CHECK_STR_LENGTH=0
  TOMCAT_PROCESS_CHECK_STR=`ps aux | grep 'java.*tomcat' | grep -v grep`
  CHECK_STR_LENGTH=${#TOMCAT_PROCESS_CHECK_STR}
  if [ $CHECK_STR_LENGTH != 0 ]
  then
    kill $TOMCAT_PROCESS_ID
    sleep 5
    echo Try to kill tomcat once more...
  else
    echo Tomcat is already killed
    break
  fi
done
```

特别值得一提的是：

```
TOMCAT_PROCESS_STR=`ps aux | grep 'java.*tomcat' | grep -v grep` 
```

使用两次grep来去除grep自身进程对于查找结果的干扰是非常有技巧的。