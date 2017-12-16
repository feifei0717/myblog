# Python多线程编程

## 介绍

同时运行多个线程类似于同时运行多个不同的程序，但具有以下好处 -

- 进程内的多个线程与主线程共享相同的数据空间，因此可以比单独的进程更容易地共享信息或彼此进行通信。
- 线程有时也被称为轻量级进程，它们不需要太多的内存开销; 它们比进程便宜。

线程有一个开始，执行顺序和终止。 它有一个指令指针，可以跟踪其上下文中当前运行的位置。

- 它可以被抢占(中断)。
- 当其他线程正在运行时，它可以临时保留(也称为睡眠) - 这称为让步。

有两种不同的线程 -

- 内核线程
- 用户线程

内核线程是操作系统的一部分，而用户空间线程未在内核中实现。

有两个模块用于支持在*Python 3*中使用线程 -

- *_thread*
- *threading*

**`thread`模块已被“不推荐”了很长一段时间**。 鼓励用户使用`threading`模块。 因此，在*Python 3*中，`thread`模块不再可用。 但是，`thread`模块已被重命名为“`_thread`”，用于*Python 3*中的向后兼容性。

## 1.thread模块启动新线程(python3 废弃)

要产生/启动一个线程，需要调用`thread`模块中的以下方法 -

```
_thread.start_new_thread ( function, args[, kwargs] )


Python
```

这种方法调用可以快速有效地在Linux和Windows中创建新的线程。

方法调用立即返回，子线程启动并使用传递的`args`列表调用函数。当函数返回时，线程终止。

在这里，`args`是一个元组的参数; 使用空的元组来调用函数表示不传递任何参数。 `kwargs`是关键字参数的可选字典。

**示例**

```
#!/usr/bin/python3

import _thread
import time

# Define a function for the thread
def print_time( threadName, delay):
   count = 0
   while count < 5:
      time.sleep(delay)
      count += 1
      print ("%s: %s" % ( threadName, time.ctime(time.time()) ))

# Create two threads as follows
try:
   _thread.start_new_thread( print_time, ("Thread-1", 2, ) )
   _thread.start_new_thread( print_time, ("Thread-2", 4, ) )
except:
   print ("Error: unable to start thread")

while 1:
   pass


Python
```

当执行上述代码时，会产生以下结果 -

```
F:\worksp\python>python thread_start.py
Thread-1: Tue Jun 27 03:06:09 2018
Thread-2: Tue Jun 27 03:06:11 2018
Thread-1: Tue Jun 27 03:06:11 2018
Thread-1: Tue Jun 27 03:06:13 2018
Thread-2: Tue Jun 27 03:06:15 2018
Thread-1: Tue Jun 27 03:06:15 2018


Python
```

程序进入无限循环，可通过按ctrl-c停止或退出。虽然它对于低级线程非常有效，但与较新的线程模块相比，`thread`模块非常有限。

## 2. threading模块(推荐)

Python 2.4中包含的较新的线程模块为线程提供了比上面讨论的线程模块更强大的高级支持。
线程模块公开了线程模块的所有方法，并提供了一些其他方法 -

- `threading.activeCount()` - 返回活动的线程对象的数量。
- `threading.currentThread()` - 返回调用者线程控件中线程对象的数量。
- `threading.enumerate()` - 返回当前处于活动状态的所有线程对象的列表。

除了这些方法之外，`threading`模块还有实现线程的`Thread`类。 `Thread`类提供的方法如下：

- `run()` - `run()`方法是线程的入口点。
- `start()` - `start()`方法通过调用`run()`方法启动一个线程。
- `join([time])` - `join()`等待线程终止。
- `isAlive()` - `isAlive()`方法检查线程是否仍在执行。
- `getName()` - `getName()`方法返回一个线程的名称。
- `setName()` - `setName()`方法设置线程的名称。

## 3.使用threading模块创建线程

要使用`threading`模块实现新线程，必须执行以下操作：

- 定义`Thread`类的新子类。
- 覆盖`__init __(self [，args])`方法添加其他参数。
- 然后，重写`run(self [，args])`方法来实现线程在启动时应该执行的操作。

当创建了新的`Thread`的子类之后，就可以创建一个实例，然后调用`start()`方法来调用`run()`方法来启动一个新的线程。

**示例**

```python
#!/usr/bin/python3

import threading
import time

exitFlag = 0

class MyThread (threading.Thread):
   def __init__(self, threadID, name, counter):
      threading.Thread.__init__(self)
      self.threadID = threadID
      self.name = name
      self.counter = counter
   def run(self):
      print ("Starting " + self.name)
      print_time(self.name, self.counter, 5)
      print ("Exiting " + self.name)

def print_time(threadName, delay, counter):
   while counter:
      if exitFlag:
         threadName.exit()
      time.sleep(delay)
      print ("%s: %s" % (threadName, time.ctime(time.time())))
      counter -= 1

# Create new threads
thread1 = MyThread(1, "Thread-1", 1)
thread2 = MyThread(2, "Thread-2", 2)

# Start new Threads
thread1.start()
thread2.start()
thread1.join()
thread2.join()
print ("Exiting Main Thread")


Python
```

当运行上述程序时，它会产生以下结果 -

```
Starting Thread-1
Starting Thread-2
Thread-1: Tue Jun 27 03:19:43 2017
Thread-2: Tue Jun 27 03:19:44 2017
Thread-1: Tue Jun 27 03:19:44 2017
Thread-1: Tue Jun 27 03:19:45 2017
Thread-2: Tue Jun 27 03:19:46 2017
Thread-1: Tue Jun 27 03:19:46 2017
Thread-1: Tue Jun 27 03:19:47 2017
Exiting Thread-1
Thread-2: Tue Jun 27 03:19:48 2017
Thread-2: Tue Jun 27 03:19:50 2017
Thread-2: Tue Jun 27 03:19:52 2017
Exiting Thread-2
Exiting Main Thread


Shell
```

## 4.同步线程

Python提供的`threading`模块包括一个简单易用的锁定机制，允许同步线程。 通过调用`lock()`方法创建一个新的锁，该方法返回新的锁。

新锁对象的`acquire(blocking)`方法用于强制线程同步运行。可选的`blocking`参数能够控制线程是否要等待获取锁定。

如果`blocking`设置为`0`，则如果无法获取锁定，则线程将立即返回`0`值，如果锁定已获取，则线程返回`1`。 如果`blocking`设置为`1`，则线程将`blocking`并等待锁定被释放。

新的锁定对象的`release()`方法用于在不再需要锁定时释放锁。

**示例**

```python
#!/usr/bin/python3
# save file : MyThread2.py
import threading
import time

class MyThread2 (threading.Thread):
   def __init__(self, threadID, name, counter):
      threading.Thread.__init__(self)
      self.threadID = threadID
      self.name = name
      self.counter = counter
   def run(self):
      print ("Starting " + self.name)
      # Get lock to synchronize threads
      threadLock.acquire()
      print_time(self.name, self.counter, 3)
      # Free lock to release next thread
      threadLock.release()

def print_time(threadName, delay, counter):
   while counter:
      time.sleep(delay)
      print ("%s: %s" % (threadName, time.ctime(time.time())))
      counter -= 1

threadLock = threading.Lock()
threads = []

# Create new threads
thread1 = MyThread2(1, "Thread-1", 1)
thread2 = MyThread2(2, "Thread-2", 2)

# Start new Threads
thread1.start()
thread2.start()

# Add threads to thread list
threads.append(thread1)
threads.append(thread2)

# Wait for all threads to complete
for t in threads:
   t.join()
print ("Exiting Main Thread")


Python
```

当执行上述代码时，会产生以下结果 -

```
Starting Thread-1
Starting Thread-2
Thread-1: Tue Jun 27 03:51:45 2017
Thread-1: Tue Jun 27 03:51:46 2017
Thread-1: Tue Jun 27 03:51:47 2017
Thread-2: Tue Jun 27 03:51:49 2017
Thread-2: Tue Jun 27 03:51:51 2017
Thread-2: Tue Jun 27 03:51:53 2017
Exiting Main Thread


Shell
```

## 5.多线程优先级队列

`queue`模块允许创建一个新的队列对象，可以容纳特定数量的项目。 有以下方法来控制队列 -

- `get()` - `get()`从队列中删除并返回一个项目。
- `put()` - `put()`将项添加到队列中。
- `qsize()` - `qsize()`返回当前队列中的项目数。
- `empty()` - 如果队列为空，则`empty()`方法返回`True`; 否则返回`False`。
- `full()` - 如果队列已满，则`full()`方法返回`True`; 否则返回`False`。

**示例**

```python
#!/usr/bin/env python
# -*- coding: utf-8 -*-

'''
queue学习demo
'''

import Queue
import threading
import time

exitFlag = 0


class MyQueue(threading.Thread):
    def __init__(self, threadID, name, q):
        threading.Thread.__init__(self)
        self.threadID = threadID
        self.name = name
        self.q = q

    def run(self):
        print ("Starting " + self.name)
        process_data(self.name, self.q)
        print ("Exiting " + self.name)


def process_data(threadName, q):
    while not exitFlag:
        queueLock.acquire()
        if not workQueue.empty():
            data = q.get()
            queueLock.release()
            print ("%s processing %s" % (threadName, data))
        else:
            queueLock.release()
            time.sleep(1)


threadList = ["Thread-1", "Thread-2", "Thread-3"]
nameList = ["One", "Two", "Three", "Four", "Five"]
queueLock = threading.Lock()
workQueue = Queue.Queue(10)
threads = []
threadID = 1

# Create new threads
for tName in threadList:
    thread = MyQueue(threadID, tName, workQueue)
    thread.start()
    threads.append(thread)
    threadID += 1

# Fill the queue
queueLock.acquire()
for word in nameList:
    workQueue.put(word)
queueLock.release()

# Wait for queue to empty
while not workQueue.empty():
    pass

# Notify threads it's time to exit
exitFlag = 1

# Wait for all threads to complete
for t in threads:
    t.join()
print ("Exiting Main Thread")

```

当执行上述代码时，会产生以下结果 -

```
Starting Thread-1
Starting Thread-2
Starting Thread-3
Thread-3 processing One
Thread-3 processing Two
Thread-3 processing Three
Thread-3 processing Four
Thread-3 processing Five
Exiting Thread-1
Exiting Thread-2
Exiting Thread-3
Exiting Main Thread
```





http://www.yiibai.com/python/python_multithreading.html