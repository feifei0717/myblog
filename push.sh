#!/bin/bash
#提交git并且push到服务器
git add .
git commit -m "提交博客文章"

echo 'Push to github master'
git push github master
echo 'Push to coding master'
git push coding master