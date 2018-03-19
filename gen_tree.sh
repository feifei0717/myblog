#!/bin/bash
#生成目录树,只有目录
#tree  -d  -N -I "image*|file*"  -o temp.txt
#生成目录树, 有目录和文件名
tree   -N -I "image*|file*"  -o temp.txt