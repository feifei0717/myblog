## Swagger与SpringMVC项目整合，swaggerspringmvc

## Swagger与SpringMVC项目整合

> 为了方便的管理项目中API接口，在网上找了好多关于API接口管理的资料，感觉目前最流行的莫过于Swagger了，功能强大，UI界面漂亮，并且支持在线测试等等，所以本人仔细研究了下Swagger的使用，下面就如何将Swagger与个人的SpringMVC项目进行整合做详细说明：

最终API管理界面： 
![首页](./image-201709191125/20150210175243592)

详细步骤：

### Step1:项目中引入相关jar包：

```
    <properties>
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
        <version.spring>3.2.9.RELEASE</version.spring>
        <version.jackson>2.4.4</version.jackson>
    </properties>

    <dependencies>
        ....
        <dependency>
            <groupId>com.mangofactory</groupId>
            <artifactId>swagger-springmvc</artifactId>
            <version>0.9.5</version>
        </dependency>

        <dependency>
            <groupId>com.fasterxml.jackson.core</groupId>
            <artifactId>jackson-annotations</artifactId>
            <version>${version.jackson}</version>
        </dependency>
        <dependency>
            <groupId>com.fasterxml.jackson.core</groupId>
            <artifactId>jackson-databind</artifactId>
            <version>${version.jackson}</version>
        </dependency>
        <dependency>
            <groupId>com.fasterxml.jackson.core</groupId>
            <artifactId>jackson-core</artifactId>
            <version>${version.jackson}</version>
        </dependency>
    </dependencies>
```

### Step2:添加自定义config文件

```
package com.spg.apidoc.common.configer;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.mangofactory.swagger.configuration.SpringSwaggerConfig;
import com.mangofactory.swagger.models.dto.ApiInfo;
import com.mangofactory.swagger.plugin.EnableSwagger;
import com.mangofactory.swagger.plugin.SwaggerSpringMvcPlugin;

/**
 * 项目名称：apidoc
 *
 * @description:
 * @author Wind-spg
 * @create_time：2015年2月10日 上午10:27:51
 * @version V1.0.0
 *
 */
@Configuration
@EnableSwagger
// Loads the spring beans required by the framework
public class MySwaggerConfig
{

    private SpringSwaggerConfig springSwaggerConfig;

    /**
     * Required to autowire SpringSwaggerConfig
     */
    @Autowired
    public void setSpringSwaggerConfig(SpringSwaggerConfig springSwaggerConfig)
    {
        this.springSwaggerConfig = springSwaggerConfig;
    }

    /**
     * Every SwaggerSpringMvcPlugin bean is picked up by the swagger-mvc
     * framework - allowing for multiple swagger groups i.e. same code base
     * multiple swagger resource listings.
     */
    @Bean
    public SwaggerSpringMvcPlugin customImplementation()
    {
        return new SwaggerSpringMvcPlugin(this.springSwaggerConfig).apiInfo(apiInfo()).includePatterns(
                ".*?");
    }

    private ApiInfo apiInfo()
    {
        ApiInfo apiInfo = new ApiInfo(
                "My Apps API Title", 
                "My Apps API Description",
                "My Apps API terms of service", 
                "My Apps API Contact Email", 
                "My Apps API Licence Type",
                "My Apps API License URL");
        return apiInfo;
    }
}
```

### Step3:将此配置加入到Spring容器中，如下：

```
<bean class="com.spg.apidoc.common.configer.MySwaggerConfig" />
```

### Step4:在代码中添加相关APIAnnotation，如下：

```
    @ResponseBody
    @RequestMapping(
            value = "addUser", method = RequestMethod.POST, produces = "application/json; charset=utf-8")
    @ApiOperation(value = "添加用户", httpMethod = "POST", response = BaseResultVo.class, notes = "add user")
    public String addUser(@ApiParam(required = true, name = "postData", value = "用户信息json数据") @RequestParam(
            value = "postData") String postData, HttpServletRequest request)
    {
        LOGGER.debug(String.format("at function, %s", postData));
        if (null == postData || postData.isEmpty())
        {
            return super.buildFailedResultInfo(-1, "post data is empty!");
        }

        UserInfo user = JSON.parseObject(postData, UserInfo.class);
        int result = userService.addUser(user);
        return buildSuccessResultInfo(result);
    }
```

> 说明： 
> 其中@ApiOperation和@ApiParam为添加的API相关注解，个参数说明如下： 
> @ApiOperation(value = “接口说明”, httpMethod = “接口请求方式”, response = “接口返回参数类型”, notes = “接口发布说明”；其他参数可参考源码； 
> @ApiParam(required = “是否必须参数”, name = “参数名称”, value = “参数具体描述”

### Step5：添加Swagger UI配置

在GitHub上下载SwaggerUI项目，将dist下所有内容拷贝到本地项目webapp下面，结果目录如下图所示： 
![webapp目录结构](./image-201709191125/20150210174702095)

### Step6：修改index.html

将index.html中http://petstore.swagger.wordnik.com/v2/swagger.json修改为http://localhost:8080/{projectname}/api-docs

到此为止，所有配置完成，启动你的项目，访问http://localhost:8080/{projectName}/index.html即可看到如下所示页面： 
![首页](./image-201709191125/20150210175243592)
![接口详细说明](./image-201709191125/20150210175346148)

项目最终demo可见个人GitHub 
https://github.com/itboyspg/spg-code/tree/master/apidoc 
参考： 
https://github.com/martypitt/swagger-springmvc 
https://github.com/swagger-api/swagger-ui





http://www.bkjia.com/Androidjc/956800.html