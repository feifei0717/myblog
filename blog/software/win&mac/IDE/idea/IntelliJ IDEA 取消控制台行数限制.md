# IntelliJ IDEA 取消控制台行数限制

在idea7之后的版本中取消了 控制台行数设置 选项，只能通过更改配置文件进行更改

在%安装目录%/bin中找到idea.properties文件，更改idea.cycle.buffer.size项值为disabled，保存，重启idea即可