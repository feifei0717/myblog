 

nlssort函数的用法以及参数

NLSSORT，可以用来进行语言排序，且不影响当前会话．

用法示例:

拼音
SELECT * FROM TEAM ORDER BY NLSSORT(排序字段,'NLS_SORT = SCHINESE_PINYIN_M')
笔划
SELECT * FROM TEAM ORDER BY NLSSORT(排序字段,'NLS_SORT = SCHINESE_STROKE_M')
部首
SELECT * FROM TEAM ORDER BY NLSSORT(排序字段,'NLS_SORT = SCHINESE_RADICAL_M')

来源： <<http://blog.itpub.net/7380741/viewspace-50867/>>

 