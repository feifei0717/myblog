# java properties 文件的生成及使用



```
生成properties文件
Properties pro = new Properties();// 生成实例
pro.setProperty("CleanPath", path);// 设置键值
FileOutputStream fos = new FileOutputStream(propertyPath（文件路径，要到文件名）); 
pro.store(fos, "Init properties");// 向新文件存储

向properties文件更新或者插入值（就是得先读进来，要不会把原文件清空替换）
Properties pro = new Properties();
pro.load(new FileInputStream(propertyPath（文件路径，要到文件名）);
pro.setProperty("CleanPath", path);
FileOutputStream fos = new FileOutputStream(propertyPath);
pro.store(fos, "Update properties");


properties不能永久添加注释
目前做法是将注释做到所有store函数的comment参量中。
```





http://blog.sina.com.cn/s/blog_4ca4c5da0106gjts.html