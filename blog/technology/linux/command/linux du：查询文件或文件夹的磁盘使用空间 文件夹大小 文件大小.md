# linux du：查询文件或文件夹的磁盘使用空间 文件夹大小 文件大小





## 常用命令

du：查询文件或文件夹的磁盘使用空间

du -h --max-depth=1 |grep [TG] |sort#查找上G和T的目录并排序

du -sh   #统计当前目录的大小，以直观方式展现

du -h --max-depth=1 |grep 'G' |sort#查看上G目录并排序

du -sh --max-depth=1  #查看当前目录下所有一级子目录文件夹大小

du -h --max-depth=1 |sort    #查看当前目录下所有一级子目录文件夹大小 并排序

du -h --max-depth=1 |grep [TG] |sort -nr  #倒序排

FreeBSD下是这样的

du -hd 1 | sort

du -hd 1 |grep [GT] | sort

du命令功能说明：统计目录(或文件)所占磁盘空间的大小。

语　　法：du [-abcDhHklmsSx] [-L <符号连接>][-X <文件>][--block-size][--exclude=<目录或文件>] [--max-depth=<目录层数>][--help][--version][目录或文件]

常用参数：

-a或-all  为每个指定文件显示磁盘使用情况，或者为目录中每个文件显示各自磁盘使用情况。

-b或-bytes 显示目录或文件大小时，以byte为单位。

-c或–total 除了显示目录或文件的大小外，同时也显示所有目录或文件的总和。

-D或–dereference-args 显示指定符号连接的源文件大小。

-h或–human-readable 以K，M，G为单位，提高信息的可读性。

-H或–si 与-h参数相同，但是K，M，G是以1000为换算单位,而不是以1024为换算单位。

-k或–kilobytes 以1024 bytes为单位。

-l或–count-links 重复计算硬件连接的文件。

-L<符号连接>或–dereference<符号连接> 显示选项中所指定符号连接的源文件大小。

-m或–megabytes 以1MB为单位。

-s或–summarize 仅显示总计，即当前目录的大小。

-S或–separate-dirs 显示每个目录的大小时，并不含其子目录的大小。

-x或–one-file-xystem 以一开始处理时的文件系统为准，若遇上其它不同的文件系统目录则略过。

-X<文件>或–exclude-from=<文件> 在<文件>指定目录或文件。

–exclude=<目录或文件> 略过指定的目录或文件。

–max-depth=<目录层数> 超过指定层数的目录后，予以忽略。

–help 显示帮助。

–version 显示版本信息。





## linux中的du命令使用示例

1> 要显示一个目录树及其每个子树的磁盘使用情况

du /home/linux

这在/home/linux目录及其每个子目录中显示了磁盘块数。

2> 要通过以1024字节为单位显示一个目录树及其每个子树的磁盘使用情况

du -k /home/linux

这在/home/linux目录及其每个子目录中显示了 1024 字节磁盘块数。

3> 以MB为单位显示一个目录树及其每个子树的磁盘使用情况

du -m /home/linux

这在/home/linux目录及其每个子目录中显示了 MB 磁盘块数。

4> 以GB为单位显示一个目录树及其每个子树的磁盘使用情况

du -g /home/linux

这在/home/linux目录及其每个子目录中显示了 GB 磁盘块数。

5>查看当前目录下所有目录以及子目录的大小：

du -h .

“.”代表当前目录下。也可以换成一个明确的路径

-h表示用K、M、G的人性化形式显示

6>查看当前目录下user目录的大小，并不想看其他目录以及其子目录：

du -sh user

-s表示总结的意思，即只列出一个总结的值

du -h –max-depth=0 user

–max-depth＝n表示只深入到第n层目录，此处设置为0，即表示不深入到子目录。

7>列出user目录及其子目录下所有目录和文件的大小：

du -ah user

-a表示包括目录和文件

8>列出当前目录中的目录名不包括xyz字符串的目录的大小：

du -h –exclude=’*xyz*’

9>想在一个屏幕下列出更多的关于user目录及子目录大小的信息：

du -0h user

-0（杠零）表示每列出一个目录的信息，不换行，而是直接输出下一个目录的信息。

10>只显示一个目录树的全部磁盘使用情况

```
[maple@linux ~]$
[maple@linux ~]$ du
8       ./test/links
8       ./test/dir/subdir1
8       ./test/dir/subdir2
20      ./test/dir
160     ./test
108     ./test2
1492    .
[maple@linux ~]$
[maple@linux ~]$ du -0
8       ./test/links8   ./test/dir/subdir18     ./test/dir/subdir220    ./test/dir160   ./test108       ./test21492  .[maple@linux ~]$ du -c
8       ./test/links
8       ./test/dir/subdir1
8       ./test/dir/subdir2
20      ./test/dir
160     ./test
108     ./test2
1492    .
1492    total
[maple@linux ~]$
[maple@linux ~]$ du -h
8.0K    ./test/links
8.0K    ./test/dir/subdir1
8.0K    ./test/dir/subdir2
20K     ./test/dir
160K    ./test
108K    ./test2
1.5M    .
[maple@linux ~]$
[maple@linux ~]$ du -k
8       ./test/links
8       ./test/dir/subdir1
8       ./test/dir/subdir2
20      ./test/dir
160     ./test
108     ./test2
1492    .
[maple@linux ~]$
[maple@linux ~]$ du -sh
1.5M    .
[maple@linux ~]$
[maple@linux ~]$ du -S
8       ./test/links
8       ./test/dir/subdir1
8       ./test/dir/subdir2
4       ./test/dir
132     ./test
108     ./test2
1224    .
[maple@linux ~]$
[maple@linux ~]$ du -Sh --exclude="sub*"
8.0K    ./test/links
4.0K    ./test/dir
132K    ./test
108K    ./test2
1.2M    .
[maple@linux ~]$
[maple@linux ~]$ du -h
8.0K    ./test/links
8.0K    ./test/dir/subdir1
8.0K    ./test/dir/subdir2
20K     ./test/dir
160K    ./test
108K    ./test2
1.5M    .
[maple@linux ~]$
```

**命令用途**du(disk usage)命令可以计算文件或目录所占的磁盘空间。没有指定任何选项时，它会测量当前工作目录与其所有子目录，分别显示各个目录所占的快数，最后才显示工作目录所占总快数。
**命令格式**
du [OPTION]… [FILE]…
-a, –all
包括了所有的文件，而不只是目录
–apparent-size
print apparent sizes, rather than disk usage; although the apparent size is usually smaller, it may be larger due
to holes in (’sparse’) files, internal fragmentation, indirect blocks, and the like
-B, –block-size=SIZE use SIZE-byte blocks
-b, –bytes 以字节为计算单位
-k             以千字节（KB）为计算单位
-m            以兆字节（M）为计算单位
-c, –total 最后加上一个总计（系统缺省）
-D, –dereference-args
dereference FILEs that are symbolic links
-H    跟 - -si效果一样。
-h, –human-readable   以比较阅读的方式输出文件大小信息 (例如，1K 234M 2G)。*<u>`注：该选项在很多其他命令（df, ls）中`</u>*也有效。
–si   跟-h 效果一样，只是以1000为换算单位
-l, –count-links 计算所有的文件大小，对硬链接文件，则计算多次。
-L, –dereference 显示选项中所指定符号连接的源文件大小。
-P, –no-dereference 不跟随任何的符号连接（缺省）
-S, –separate-dirs 计算目录所占空间时不包括子目录的大小。
-s, –summarize      只显示工作目录所占总空间
-x, –one-file-system 以一开始处理时的文件系统为准，若遇上其它不同的文件系统目录则略过。
-X FILE, –exclude-from=FILE 排除掉指定的FILE
–exclude=PATTERN 排除掉符合样式的文件,Pattern就是普通的Shell样式，？表示任何一个字符，*表示任意多个字符。
–max-depth=N
只列出深度小于max-depth的目录和文件的信息 –max-depth=0 的时候效果跟–s是 一样

## 常用案例

​    如果当前目录下文件和文件夹很多，使用不带参数du的命令，可以循环列出所有文件和文件夹所使用的空间。这对查看究竟是那个地方过大是不利的，所以得指定深入目录的层数，参数：--max-depth=，这是个极为有用的参数！如下，注意使用“*”，可以得到文件的使用空间大小.

​    提醒：一向命令比linux复杂的FreeBSD，它的du命令指定深入目录的层数却是比linux简化，为 -d。

### 当前目录所占用的空间大小

```
[root@localhost local]# du -sh
277M    .
```



### 查看指定文件夹下所有文件夹大小并排序

```
[root@localhost ~]# du -h  --max-depth=1 /usr/local/ | sort -rn
277M    /usr/local/
263M    /usr/local/java
92K     /usr/local/share
14M     /usr/local/tomcat_7_0_56_8080
4.0K    /usr/local/src
4.0K    /usr/local/sbin
4.0K    /usr/local/libexec
4.0K    /usr/local/lib64
4.0K    /usr/local/lib
4.0K    /usr/local/include
4.0K    /usr/local/games
4.0K    /usr/local/etc
4.0K    /usr/local/bin
```





### 找出大文件

磁盘空间被耗尽的时候，免不了要清理一下，比如说/home目录太大，就可以使用下面命令看看到底是谁：
du -s /home/* | sort -nr

```
[root@SVN svnhome]# du -h --max-depth=1 |grep [TG] |sort -nr
518G    ./sichuandian
474G    ./zgx
162G    ./20kc
98G     ./bgong
80G     ./s
73G     ./yn
44G     ./siua12
35G     ./cdtielug13
31G     ./kifa
22G     ./zhhu
22G     ./shae1
18G     ./eCaker
17G     ./1-youswu
16G     ./20kc
14G     ./sicngda
14G     ./be11
6.5G    ./service
5.4G    ./YNmeeting
5.2G    ./YNkangjia
5.0G    ./1-1hongqinshan
4.6G    ./doucaiku
4.6G    ./bunopertion
3.7G    ./naax11
2.6G    ./yneries
2.6G    ./teamals
2.4G    ./sichxue
2.4G    ./1cm
1.8G    ./Yb
1.7T    .
1.7G    ./ynedate
1.3G    ./cddshe
1.2G    ./YmD
```

来源： [http://www.lowxp.com/g/article/detail/290](http://www.lowxp.com/g/article/detail/290)