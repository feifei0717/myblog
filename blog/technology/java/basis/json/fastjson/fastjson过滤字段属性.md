# fastjson过滤字段属性

## 第一种方法:

```
PropertyFilter filter = new PropertyFilter() {
	//过滤不需要的字段  
	public boolean apply(Object source, String name, Object value) {
		if ("code".equals(name) || "shengid".equals(name)) {
			return false;
		}
		return true;
	}
};
SerializeWriter sw = new SerializeWriter();
JSONSerializer serializer = new JSONSerializer(sw);
serializer.getPropertyFilters().add(filter);
serializer.write(cityList);
response.getWriter().write(sw.toString());
```

## 第二种方法: 

直接在里面写上需要的字段属性. 

```
SimplePropertyPreFilter filter = new SimplePropertyPreFilter(TTown.class, "id", "townname");
response.getWriter().write(JSONObject.toJSONString(townList, filter));
```

## 第三种方法:

知道实体的情况下：

 **@JSONField(serialize=false) //过滤字段**

  private String name;

```
package com.soco.fastjsontest.entity;
import java.util.Date;
import com.alibaba.fastjson.annotation.JSONField;
public class Student {
	
	@JSONField(name="ID", ordinal = 3)  //别名命名
	private String id;
	
	@JSONField(serialize=false) //过滤字段
	private String name;
	
	
	@JSONField(ordinal = 1)
	private int age;
	
	@JSONField(ordinal = 2, format="yyyy-MM-dd")
	private Date birthDay;
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public int getAge() {
		return age;
	}
	public void setAge(int age) {
		this.age = age;
	}
	public Date getBirthDay() {
		return birthDay;
	}
	public void setBirthDay(Date birthDay) {
		this.birthDay = birthDay;
	}
	public Student(String id, String name, int age, Date birthDay) {
		super();
		this.id = id;
		this.name = name;
		this.age = age;
		this.birthDay = birthDay;
	}
}
```