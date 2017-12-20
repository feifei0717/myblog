在maven的setting.xml文件中 的 profiles 节点 加入：

```
<profile>  
    <id>jdk17</id>  
     <activation>  
          <activeByDefault>true</activeByDefault>  
          <jdk>1.7</jdk>  
     </activation>  
     <properties>  
          <maven.compiler.source>1.7</maven.compiler.source>  
          <maven.compiler.target>1.7</maven.compiler.target>  
          <maven.compiler.compilerVersion>1.7</maven.compiler.compilerVersion>  
     </properties>   
</profile>  
```

如果是想要1.6的，就将里面的1.7 ==> 1.6

来源： <http://blog.csdn.net/longxia1987/article/details/42496635>