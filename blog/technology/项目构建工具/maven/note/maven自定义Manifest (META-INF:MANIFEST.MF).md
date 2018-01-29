[TOC]



# Maven自定义Manifest (META-INF/MANIFEST.MF)

## 1,添加Class-Path信息,设置主类MainClass

 1,打包时添加一些常用信息到META-INF/MANIFEST.MF(添加Class-Path信息,设置主类MainClass)

```
<properties>  
  <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>  
  <maven.build.timestamp.format>yyyy-MM-dd_HH_mm</maven.build.timestamp.format>  
</properties>  
  
<build>  
  <plugins>  
    <plugin>  
      <groupId>org.apache.maven.plugins</groupId>  
      <artifactId>maven-jar-plugin</artifactId>  
      <configuration>  
        <archive>  
          <index>true</index>  
          <manifest>  
            <addClasspath>true</addClasspath>  
            <mainClass>fully.qualified.MainClass</mainClass>  
            <addDefaultImplementationEntries>true</addDefaultImplementationEntries>  
            <addDefaultSpecificationEntries>true</addDefaultSpecificationEntries>  
          </manifest>  
          <manifestEntries>  
            <url>${project.url}</url>  
            <build-time>${maven.build.timestamp}</build-time>  
          </manifestEntries>  
        </archive>  
      </configuration>  
    </plugin>  
  </plugins>  
</build>  
```

 结果:

```
Manifest-Version: 1.0  
Archiver-Version: Plexus Archiver  
Created-By: Apache Maven  
Built-By: jervalj  
Build-Jdk: 1.6.0_34  
Specification-Title: maven-test  
Specification-Version: 1.0-SNAPSHOT  
Implementation-Title: maven-test  
Implementation-Version: 1.0-SNAPSHOT  
Implementation-Vendor-Id: sdf  
build-time: 2014-01-03_17_12  
url: http://maven.apache.org  
Class-Path: persistence-rds-1.9-SNAPSHOT.jar persistence-common-1.5.5-  
 SNAPSHOT.jar commons-lang-2.1.jar 
```

 

## 2,修改Class-Path信息(修改Class-Path前缀,自定义Class-Path格式)

```
<plugin>  
        <groupId>org.apache.maven.plugins</groupId>  
        <artifactId>maven-jar-plugin</artifactId>  
        <version>2.4</version>  
        <configuration>  
          <archive>  
            <index>true</index>  
            <manifest>  
              <addClasspath>true</addClasspath>  
              <addDefaultImplementationEntries>true</addDefaultImplementationEntries>  
              <addDefaultSpecificationEntries>true</addDefaultSpecificationEntries>  
              <classpathPrefix>lib/</classpathPrefix>  
              <classpathLayoutType>custom</classpathLayoutType>  
              <customClasspathLayout>WEB-INF/lib/$${artifact.groupIdPath}/$${artifact.artifactId}-$${artifact.version}$${dashClassifier?}.$${artifact.extension}</customClasspathLayout>  
            </manifest>  
            <manifestEntries>  
              <url>${project.url}</url>  
              <build-time>${maven.build.timestamp}</build-time>  
            </manifestEntries>  
          </archive>  
        </configuration>  
      </plugin>  
```

 结果:

```
Manifest-Version: 1.0  
build-time: 2014-01-03_17_36  
Implementation-Title: maven-test  
Implementation-Version: 1.0-SNAPSHOT  
Class-Path: lib/WEB-INF/lib/com/xxx/persistence/persistence-rds-1.9  
 -SNAPSHOT.jar lib/WEB-INF/lib/com/<span style="font-size: 1em; line-height: 1.5;">xxx</span><span style="font-size: 1em; line-height: 1.5;">/persistence/persistence-comm</span>  
 on-1.5.5-20130402.064609-5.jar lib/WEB-INF/lib/com/<span style="font-size: 1em; line-height: 1.5;">xxx</span><span style="font-size: 1em; line-height: 1.5;">/arch/tools/</span>  
 <span style="font-size: 1em; line-height: 1.5;">xxx</span><span style="font-size: 1em; line-height: 1.5;">-arch-aop-1.1.jar lib/WEB-INF/lib/aspectwerkz/aspectwerkz-2.0.j</span>  
 ar lib/WEB-INF/lib/com/jcraft/jsch-0.1.27.jar lib/WEB-INF/lib/org/jbo  
 ss/jboss-eap/server/production/lib/servlet-api-JB_4.3.0.GA_CP06.jar l  
 ib/WEB-INF/lib/com/<span style="font-size: 1em; line-height: 1.5;">xxx</span><span style="font-size: 1em; line-height: 1.5;">/tools/</span><span style="font-size: 1em; line-height: 1.5;">xxx</span><span style="font-size: 1em; line-height: 1.5;">-report-bin-1.21.jar lib/WEB-IN</span>  
 F/lib/commons-lang/commons-lang-2.1.jar  
Built-By: jervalj  
Created-By: Apache Maven  
url: http://maven.apache.org  
Implementation-Vendor-Id: sdf  
Build-Jdk: 1.6.0_34  
Specification-Title: maven-test  
Specification-Version: 1.0-SNAPSHOT  
Archiver-Version: Plexus Archiver 
```

 

## 3,去掉Class-Path版本信息

```
<plugin>  
  <groupId>org.apache.maven.plugins</groupId>  
  <artifactId>maven-jar-plugin</artifactId>  
  <version>2.4</version>  
  <configuration>  
    <archive>  
      <index>true</index>  
      <manifest>  
        <addClasspath>true</addClasspath>  
        <addDefaultImplementationEntries>true</addDefaultImplementationEntries>  
        <addDefaultSpecificationEntries>true</addDefaultSpecificationEntries>  
        <classpathLayoutType>custom</classpathLayoutType>  
        <customClasspathLayout>$${artifact.artifactId}.$${artifact.extension}</customClasspathLayout>  
      </manifest>  
      <manifestEntries>  
        <url>${project.url}</url>  
        <build-time>${maven.build.timestamp}</build-time>  
      </manifestEntries>  
    </archive>  
  </configuration>  
</plugin>  
```

 结果:

```
Manifest-Version: 1.0  
build-time: 2014-01-03_17_44  
Implementation-Title: maven-test  
Implementation-Version: 1.0-SNAPSHOT  
Class-Path: persistence-rds.jar persistence-common.jar <span style="font-size: 1em; line-height: 1.5;">xxx</span><span style="font-size: 1em; line-height: 1.5;">-arch-aop</span>  
 .jar aspectwerkz.jar jsch.jar servlet-api.jar <span style="font-size: 1em; line-height: 1.5;">xxx</span><span style="font-size: 1em; line-height: 1.5;">-report-bin.jar c</span>  
 ommons-lang.jar  
Built-By: jervalj  
Created-By: Apache Maven  
url: http://maven.apache.org  
Implementation-Vendor-Id: sdf  
Build-Jdk: 1.6.0_34  
Specification-Title: maven-test  
Specification-Version: 1.0-SNAPSHOT  
Archiver-Version: Plexus Archiver  
```

 

## 4,使用已存在的META-INF/MANIFEST.MF文件.

```
<plugin>  
        <groupId>org.apache.maven.plugins</groupId>  
        <artifactId>maven-jar-plugin</artifactId>  
        <configuration>  
          <archive>  
            <manifestFile>src/main/resources/META-INF/MANIFEST.MF</manifestFile>  
          </archive>  
        </configuration>  
      </plugin>  
```

 



http://jerval.iteye.com/blog/1998810