



## elasticsearch mapping解释

### 分析

插入几条数据，让es自动为我们建立一个索引

PUT /website/article/1
{
  "post_date": "2017-01-01",
  "title": "my first article",
  "content": "this is my first article in this website",
  "author_id": 11400
}

PUT /website/article/2
{
  "post_date": "2017-01-02",
  "title": "my second article",
  "content": "this is my second article in this website",
  "author_id": 11400
}

PUT /website/article/3
{
  "post_date": "2017-01-03",
  "title": "my third article",
  "content": "this is my third article in this website",
  "author_id": 11400
}

尝试各种搜索

GET /website/article/_search?q=2017			3条结果       

解答：

```
搜索的是_all field，document所有的field都会拼接成一个大串，进行分词

2017-01-02 my second article this is my second article in this website 11400

		    doc1		doc2		doc3
2017		*		    *		    *
01		  	* 		
02			        	*
03						          	*

_all，2017，自然会搜索到3个docuemnt
```

​      
GET /website/article/_search?q=2017-01-01        	3条结果

解答：

```
_all，2017-01-01，query string会用跟建立倒排索引一样的分词器去进行分词 ，搜索的时候回拆分成以下三个进行搜索

		doc1		doc2		doc3
2017	*		    *		    *
01		*
01		*

```



GET /website/article/_search?q=post_date:2017-01-01   	1条结果

解答：

```
post_date，会作为exact value去建立索引

		        doc1		doc2		doc3
2017-01-01		*		
2017-01-02			    	* 		
2017-01-03					        	*

post_date:2017-01-01，2017-01-01，doc1一条document
```

GET /website/article/_search?q=post_date:2017         	1条结果

解答：

```
这个在这里不讲解，因为是es 5.2以后做的一个优化
```

查看es自动建立的mapping，带出什么是mapping的知识点

自动或手动为index中的type建立的一种数据结构和相关配置，简称为mapping
dynamic mapping，自动为我们建立index，创建type，以及type对应的mapping，mapping中包含了每个field对应的数据类型，以及如何分词等设置
我们当然，后面会讲解，也可以手动在创建数据之前，先创建index和type，以及type对应的mapping

```
GET /website/_mapping/article

{
  "website": {
    "mappings": {
      "article": {
        "properties": {
          "author_id": {
            "type": "long"
          },
          "content": {
            "type": "text",
            "fields": {
              "keyword": {
                "type": "keyword",
                "ignore_above": 256
              }
            }
          },
          "post_date": {
            "type": "date"
          },
          "title": {
            "type": "text",
            "fields": {
              "keyword": {
                "type": "keyword",
                "ignore_above": 256
              }
            }
          }
        }
      }
    }
  }
}
```

搜索结果为什么不一致，因为es自动建立mapping的时候，设置了不同的field不同的data type。不同的data type的分词、搜索等行为是不一样的。所以出现了_all field和post_date field的搜索表现完全不一样。



### 解释

（1）往es里面直接插入数据，es会自动建立索引，同时建立type以及对应的mapping
（2）mapping中就自动定义了每个field的数据类型
（3）不同的数据类型（比如说text和date），可能有的是exact value，有的是full text
（4）exact value，在建立倒排索引的时候，分词的时候，是将整个值一起作为一个关键词建立到倒排索引中的；full text，会经历各种各样的处理，分词，normaliztion（时态转换，同义词转换，大小写转换），才会建立到倒排索引中
（5）同时呢，exact value和full text类型的field就决定了，在一个搜索过来的时候，对exact value field或者是full text field进行搜索的行为也是不一样的，会跟建立倒排索引的行为保持一致；比如说exact value搜索的时候，就是直接按照整个值进行匹配，full text query string，也会进行分词和normalization再去倒排索引中去搜索
（6）可以用es的dynamic mapping，让其自动建立mapping，包括自动设置数据类型；也可以提前手动创建index和type的mapping，自己对各个field进行设置，包括数据类型，包括索引行为，包括分词器，等等

mapping，就是index的type的元数据，每个type都有一个自己的mapping，决定了数据类型，建立倒排索引的行为，还有进行搜索的行为



### mapping的核心数据类型以及dynamic mapping

1、核心的数据类型

string
byte，short，integer，long
float，double
boolean
date

2、dynamic mapping

true or false	-->	boolean
123		-->	long
123.45		-->	double
2017-01-01	-->	date
"hello world"	-->	string/text

3、查看mapping

GET /index/_mapping/type



### 手动建立和修改mapping以及定制string类型数据是否分词



 

1、如何建立索引

analyzed
not_analyzed
no

2、修改mapping

只能创建index时手动建立mapping，或者新增field mapping，但是不能update field mapping

```
PUT /website
{
  "mappings": {
    "article": {
      "properties": {
        "author_id": {
          "type": "long"
        },
        "title": {
          "type": "text",
          "analyzer": "english"
        },
        "content": {
          "type": "text"
        },
        "post_date": {
          "type": "date"
        },
        "publisher_id": {
          "type": "text",
          "index": "not_analyzed"
        }
      }
    }
  }
}
修改
PUT /website
{
  "mappings": {
    "article": {
      "properties": {
        "author_id": {
          "type": "text"
        }
      }
    }
  }
}
就会报错
{
  "error": {
    "root_cause": [
      {
        "type": "index_already_exists_exception",
        "reason": "index [website/co1dgJ-uTYGBEEOOL8GsQQ] already exists",
        "index_uuid": "co1dgJ-uTYGBEEOOL8GsQQ",
        "index": "website"
      }
    ],
    "type": "index_already_exists_exception",
    "reason": "index [website/co1dgJ-uTYGBEEOOL8GsQQ] already exists",
    "index_uuid": "co1dgJ-uTYGBEEOOL8GsQQ",
    "index": "website"
  },
  "status": 400
}
只能新增
PUT /website/_mapping/article
{
  "properties" : {
    "new_field" : {
      "type" :    "string",
      "index":    "not_analyzed"
    }
  }
}
```



### mapping复杂数据类型以及object类型数据底层结构大揭秘

 

1、multivalue field

{ "tags": [ "tag1", "tag2" ]}

建立索引时与string是一样的，数据类型不能混

2、empty field

null，[]，[null]

3、object field

```
存放复制objec数据
PUT /company/employee/1
{
  "address": {
    "country": "china",
    "province": "guangdong",
    "city": "guangzhou"
  },
  "name": "jack",
  "age": 27,
  "join_date": "2017-01-01"
}


获取mapping
GET /company/_mapping/employee
address：object类型

{
  "company": {
    "mappings": {
      "employee": {
        "properties": {
          "address": {
            "properties": {
              "city": {
                "type": "text",
                "fields": {
                  "keyword": {
                    "type": "keyword",
                    "ignore_above": 256
                  }
                }
              },
              "country": {
                "type": "text",
                "fields": {
                  "keyword": {
                    "type": "keyword",
                    "ignore_above": 256
                  }
                }
              },
              "province": {
                "type": "text",
                "fields": {
                  "keyword": {
                    "type": "keyword",
                    "ignore_above": 256
                  }
                }
              }
            }
          },
          "age": {
            "type": "long"
          },
          "join_date": {
            "type": "date"
          },
          "name": {
            "type": "text",
            "fields": {
              "keyword": {
                "type": "keyword",
                "ignore_above": 256
              }
            }
          }
        }
      }
    }
  }
}

数据
{
  "address": {
    "country": "china",
    "province": "guangdong",
    "city": "guangzhou"
  },
  "name": "jack",
  "age": 27,
  "join_date": "2017-01-01"
}
底层存储结构
{
    "name":            [jack],
    "age":          [27],
    "join_date":      [2017-01-01],
    "address.country":         [china],
    "address.province":   [guangdong],
    "address.city":  [guangzhou]
}
这个数据
{
    "authors": [
        { "age": 26, "name": "Jack White"},
        { "age": 55, "name": "Tom Jones"},
        { "age": 39, "name": "Kitty Smith"}
    ]
}
底层存储结构
{
    "authors.age":    [26, 55, 39],
    "authors.name":   [jack, white, tom, jones, kitty, smith]
}
```

