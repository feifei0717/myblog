# Sort 排序

Sort 允许对特定的字段设置一种或多种排序条件。这些排序条件既可以正向排序，当然也都可以倒序排序。排序条件是针对每个字段的，而比较特殊的字段有，`_score`，这是用来告诉 elasticsearch 把结果根据相关度评分来进行排序，然后，`_doc`则是根据索引顺序来排序。

```
{
    "sort" : [
        { "post_date" : {"order" : "asc"}},
        "user",
        { "name" : "desc" },
        { "age" : "desc" },
        "_score"
    ],
    "query" : {
        "term" : { "user" : "kimchy" }
    }
}
```

> **Note**
>
> `_doc` has no real use-case besides being the most efficient sort order. So if you don’t care about the order in which documents are returned, then you should sort by `_doc`. This especially helps when [scrolling](https://www.elastic.co/guide/en/elasticsearch/reference/current/search-request-scroll.html).

## 顺序信息

顺序信息会作为查询结果的一部分被返回回来。 ~~这话好废。。。~~

## 排序方式

排序方式无非两种，递增和递减，这通过 `order` 参数来设置，该参数的可选项有：

- `asc` 递增
- `desc` 递减

当以相关度评分 `_score` 的值来排序时，`order` 默认是 `desc`，即递减的，而其他情况下默认是 `asc`，即递增的。

## 多值字段排序

即使某个字段存的是数组，或者其他形式的多个值，Elasticsearch 也支持用这类多值字段来进行排序。但是你需要指定怎么从多个值中挑选出一个代表性质的值来参与实际的排序操作，这就可以通过 `mode` 参数来设置，该参数的可选项有：

- `min` 以最小的那个值为准来进行排序操作
- `max` 以最大的那个值为准来进行排序操作
- `sum` 求和，并以算出的和为准。该选项仅适用于数值型的数组字段
- `avg` 求平均值，并以算出的平均值为准来进行排序操作。该选项仅适用于数值型的数组字段
- `median` 以所有值的 median 中间值为准来进行排序操作。该选项仅适用于数值型的数组字段

## 多字段排序示例

在本例中，假设每个文档中 price 价格字段都存储有多个值。然后下面这个示例代码意思就是，求出 price 价格的平均值，然后根据这个平均值，递增地进行排序

```
curl -XPOST 'localhost:9200/_search' -d '{
   "query" : {
    ...
   },
   "sort" : [
      {"price" : {"order" : "asc", "mode" : "avg"}}
   ]
}'

```

## 内嵌对象的排序

保存有一个或者多个内置对象的字段也可以被 Elasticsearch 用来进行排序。如果要对这样的字段进行排序则需要在已有的 sort 项的顶部加上下面这些参数：

- `nested_path` 用来说明到底以哪个对象为准来进行排序。实际用来排序的字段必须是这个内置对象的直属字段。当你要用内置对象来排序的时候，这个字段就是 mandatory (强制的)
- `nested_filter` 指明一个过滤器用来筛选 `nested_path` 下的哪些内置对象在排序的时候需要考虑进去，而哪些又不需要。通常在这样的场景下会使用这个配置项，即需要把外层的过滤操作或查询操作在内置对象中也过滤或查询一遍。默认情况下是没有配置什么 `nested_filter` 的。

## 内嵌对象的排序示例

下面这个示例中，`offer` 是一个 `nested` 型的字段。那 `nested_path` 就需要被指定，否则 elasticsearch 就不知道抓取什么级别的内嵌排序值了。

```
curl -XPOST 'localhost:9200/_search' -d '{
   "query" : {
    ...
   },
   "sort" : [
       {
          "offer.price" : {
             "mode" :  "avg",
             "order" : "asc",
             "nested_path" : "offer",
             "nested_filter" : {
                "term" : { "offer.color" : "blue" }
             }
          }
       }
    ]
}'

```

在使用脚本来排序或者对地理位置进行排序的时候，内嵌对象排序特性依旧可以适用。

## 值缺失时的处理

`missing` 参数用来配置，当某个文档不含有用来排序的那个字段时的处理规则。它的值可以是`_last`， `_first` 或者一个自定义的值（这个自定义的值就会被用来参与排序），下面是示例：

```
{
    "sort" : [
        { "price" : {"missing" : "_last"} },
    ],
    "query" : {
        "term" : { "user" : "kimchy" }
    }
}

```

> **注意**
>
> 如果一个内嵌对象不匹配 `nested_filter` 所指定的过滤器的话，这个 `missing` 就会对这个内置对象生效 ~~感觉好不合理...辣鸡~~

## 忽视未映射的字段

默认情况下，如果一个字段没有相关联的映射，那查询请求就不会成功。`unmapped_type` 选项允许你配置可以被忽略而不计入排序条件的字段。这个配置项的直接就会被用来决定该输出哪个排序值。下面举个例子：

```
{
    "sort" : [
        { "price" : {"unmapped_type" : "long"} },
    ],
    "query" : {
        "term" : { "user" : "kimchy" }
    }
}

```

如果该查询请求涉及到的索引中的 `price` 没有映射的话。Elasticsearch 就会把它当做 `long` 型来处理，并且这个索引中的所有文档都会被认为在这个字段上没有存入值。

## 地理位置上的距离排序

通过 `_geo_distance` 来进行距离排序，举例：

```
{
    "sort" : [
        {
            "_geo_distance" : {
                "pin.location" : [-70, 40],
                "order" : "asc",
                "unit" : "km",
                "mode" : "min",
                "distance_type" : "sloppy_arc"
            }
        }
    ],
    "query" : {
        "term" : { "user" : "kimchy" }
    }
}

```

`distance_type` 用来设置如何计算距离，它的可选项有 **sloppy_arc** (默认的), **arc** (相对更精确些，但速度会明显有所下降) 或者 **plane**（相对更快写，但是计算长距离的时候就不准确了，而且 close to the poles）

注意： 地址位置的排序支持 `sort_mode` 中的 `min`,`max`和`avg`

然后指定的坐标的时候也可以向下面这样来写：

### 子属性写法

```
{
    "sort" : [
        {
            "_geo_distance" : {
                "pin.location" : {
                    "lat" : 40,
                    "lon" : -70
                },
                "order" : "asc",
                "unit" : "km"
            }
        }
    ],
    "query" : {
        "term" : { "user" : "kimchy" }
    }
}

```

### 字符串写法

`lat`在前，`lon`在后，中间用英式逗号隔开

```
{
    "sort" : [
        {
            "_geo_distance" : {
                "pin.location" : "40,-70",
                "order" : "asc",
                "unit" : "km"
            }
        }
    ],
    "query" : {
        "term" : { "user" : "kimchy" }
    }
}

```

### hash值写法

```
{
    "sort" : [
        {
            "_geo_distance" : {
                "pin.location" : "drm3btev3e86",
                "order" : "asc",
                "unit" : "km"
            }
        }
    ],
    "query" : {
        "term" : { "user" : "kimchy" }
    }
}

```

### 数组写法

经度在前，维度在后，写成 [`lon`, `lat`] 这样，这个经纬度的顺序之所以是经前纬后是为了契合 [GeoJSON](http://geojson.org/) 的写法

```
{
    "sort" : [
        {
            "_geo_distance" : {
                "pin.location" : [-70, 40],
                "order" : "asc",
                "unit" : "km"
            }
        }
    ],
    "query" : {
        "term" : { "user" : "kimchy" }
    }
}

```

### 多个地理位置的写法

多个地理位置可以通过一个数组来写明。数组中的各个子地理位置的写法则与 `geo_point` 的写法保持一致，就像下这样：

```
"pin.location" : [[-70, 40], [-71, 42]]
"pin.location" : [{"lat": 40, "lon": -70}, {"lat": 42, "lon": -71}]

```

等等

最终实际用来排序的距离值则会根据 `mode` 究竟是被配置成 `min` 还是 `max` 亦或 `avg` 来计算。

## 脚本排序

用自定义的脚本来排序的话，下面有个例子，自己琢磨吧：

```
{
    "query" : {
        ....
    },
    "sort" : {
        "_script" : {
            "type" : "number",
            "script" : {
                "inline": "doc['field_name'].value * factor",
                "params" : {
                    "factor" : 1.1
                }
            },
            "order" : "asc"
        }
    }
}

```

## 追踪评分值

当根据某个字段进行排序的话，那相关度评分就不再被计算了。但如果你需要的话，你可以把`track_scores` 设置成 `true`，这样就依然会追踪并计算评分值。

```
{
    "track_scores": true,
    "sort" : [
        { "post_date" : {"order" : "desc"} },
        { "name" : "desc" },
        { "age" : "desc" }
    ],
    "query" : {
        "term" : { "user" : "kimchy" }
    }
}

```

## 关于内存

当进行排序的时候，排序相关的字段就会被加载到内存中。这也就意味着应该有足够的内存来加载每个分片。对于基于字符串的类型，被排序的字段就应该被解析或者被分词。而对于数值型的类型，如果可以的话，就把它的类型设置得更精准些（比如设置成`short`,`integer`或者`float`）

------

Allows to add one or more sort on specific fields. Each sort can be reversed as well. The sort is defined on a per field level, with special field name for `_score` to sort by score, and `_doc` to sort by index order.

```
{
    "sort" : [
        { "post_date" : {"order" : "asc"}},
        "user",
        { "name" : "desc" },
        { "age" : "desc" },
        "_score"
    ],
    "query" : {
        "term" : { "user" : "kimchy" }
    }
}

```

> **Note**
>
> `_doc` has no real use-case besides being the most efficient sort order. So if you don’t care about the order in which documents are returned, then you should sort by `_doc`. This especially helps when [scrolling](https://www.elastic.co/guide/en/elasticsearch/reference/current/search-request-scroll.html).

## Sort Values

The sort values for each document returned are also returned as part of the response.

## Sort Order

The `order` option can have the following values:

- `asc` Sort in ascending order
- `desc` Sort in descending order

The order defaults to `desc` when sorting on the `_score`, and defaults to `asc` when sorting on anything else.

## Sort mode option

Elasticsearch supports sorting by array or multi-valued fields. The `mode` option controls what array value is picked for sorting the document it belongs to. The `mode` option can have the following values:

- `min` Pick the lowest value.
- `max` Pick the highest value.
- `sum` Use the sum of all values as sort value. Only applicable for number based array fields.
- `avg` Use the average of all values as sort value. Only applicable for number based array fields.
- `median` Use the median of all values as sort value. Only applicable for number based array fields.

## Sort mode example usage

In the example below the field price has multiple prices per document. In this case the result hits will be sort by price ascending based on the average price per document.

```
curl -XPOST 'localhost:9200/_search' -d '{
   "query" : {
    ...
   },
   "sort" : [
      {"price" : {"order" : "asc", "mode" : "avg"}}
   ]
}'

```

## Sorting within nested objects.

Elasticsearch also supports sorting by fields that are inside one or more nested objects. The sorting by nested field support has the following parameters on top of the already existing sort options:

- `nested_path` Defines on which nested object to sort. The actual sort field must be a direct field inside this nested object. When sorting by nested field, this field is mandatory.
- `nested_filter` A filter that the inner objects inside the nested path should match with in order for its field values to be taken into account by sorting. Common case is to repeat the query / filter inside the nested filter or query. By default no **nested_filter** is active.

## Nested sorting example

In the below example `offer` is a field of type `nested`. The `nested_path` needs to be specified; otherwise, elasticsearch doesn’t know on what nested level sort values need to be captured.

```
curl -XPOST 'localhost:9200/_search' -d '{
   "query" : {
    ...
   },
   "sort" : [
       {
          "offer.price" : {
             "mode" :  "avg",
             "order" : "asc",
             "nested_path" : "offer",
             "nested_filter" : {
                "term" : { "offer.color" : "blue" }
             }
          }
       }
    ]
}'

```

Nested sorting is also supported when sorting by scripts and sorting by geo distance.

## Missing Values

The `missing` parameter specifies how docs which are missing the field should be treated: The `missing` value can be set to `_last`, `_first`, or a custom value (that will be used for missing docs as the sort value). For example:

```
{
    "sort" : [
        { "price" : {"missing" : "_last"} },
    ],
    "query" : {
        "term" : { "user" : "kimchy" }
    }
}

```

> **Note**
>
> If a nested inner object doesn’t match with the `nested_filter` then a missing value is used.

## Ignoring Unmapped Fields

By default, the search request will fail if there is no mapping associated with a field. The `unmapped_type` option allows to ignore fields that have no mapping and not sort by them. The value of this parameter is used to determine what sort values to emit. Here is an example of how it can be used:

```
{
    "sort" : [
        { "price" : {"unmapped_type" : "long"} },
    ],
    "query" : {
        "term" : { "user" : "kimchy" }
    }
}

```

If any of the indices that are queried doesn’t have a mapping for `price` then Elasticsearch will handle it as if there was a mapping of type `long`, with all documents in this index having no value for this field.

## Geo Distance Sorting

Allow to sort by `_geo_distance`. Here is an example:

```
{
    "sort" : [
        {
            "_geo_distance" : {
                "pin.location" : [-70, 40],
                "order" : "asc",
                "unit" : "km",
                "mode" : "min",
                "distance_type" : "sloppy_arc"
            }
        }
    ],
    "query" : {
        "term" : { "user" : "kimchy" }
    }
}

```

`distance_type` How to compute the distance. Can either be **sloppy_arc** (default), **arc** (slightly more precise but significantly slower) or **plane** (faster, but inaccurate on long distances and close to the poles). Note: the geo distance sorting supports `sort_mode` options: `min`, `max` and `avg`.

The following formats are supported in providing the coordinates:

## Lat Lon as Properties

```
{
    "sort" : [
        {
            "_geo_distance" : {
                "pin.location" : {
                    "lat" : 40,
                    "lon" : -70
                },
                "order" : "asc",
                "unit" : "km"
            }
        }
    ],
    "query" : {
        "term" : { "user" : "kimchy" }
    }
}

```

## Lat Lon as String

Format in `lat`,`lon`.

```
{
    "sort" : [
        {
            "_geo_distance" : {
                "pin.location" : "40,-70",
                "order" : "asc",
                "unit" : "km"
            }
        }
    ],
    "query" : {
        "term" : { "user" : "kimchy" }
    }
}

```

## Geohash

```
{
    "sort" : [
        {
            "_geo_distance" : {
                "pin.location" : "drm3btev3e86",
                "order" : "asc",
                "unit" : "km"
            }
        }
    ],
    "query" : {
        "term" : { "user" : "kimchy" }
    }
}

```

## Lat Lon as Array

Format in [`lon`, `lat`], note, the order of lon/lat here in order to conform with [GeoJSON](http://geojson.org/).

```
{
    "sort" : [
        {
            "_geo_distance" : {
                "pin.location" : [-70, 40],
                "order" : "asc",
                "unit" : "km"
            }
        }
    ],
    "query" : {
        "term" : { "user" : "kimchy" }
    }
}

```

## Multiple reference points

Multiple geo points can be passed as an array containing any `geo_point` format, for example

```
"pin.location" : [[-70, 40], [-71, 42]]
"pin.location" : [{"lat": 40, "lon": -70}, {"lat": 42, "lon": -71}]

```

and so forth.

The final distance for a document will then be `min`/`max`/`avg` (defined via `mode`) distance of all points contained in the document to all points given in the sort request.

## Script Based Sorting

Allow to sort based on custom scripts, here is an example:

```
{
    "query" : {
        ....
    },
    "sort" : {
        "_script" : {
            "type" : "number",
            "script" : {
                "inline": "doc['field_name'].value * factor",
                "params" : {
                    "factor" : 1.1
                }
            },
            "order" : "asc"
        }
    }
}

```

## Track Scores

When sorting on a field, scores are not computed. By setting `track_scores` to true, scores will still be computed and tracked.

```
{
    "track_scores": true,
    "sort" : [
        { "post_date" : {"order" : "desc"} },
        { "name" : "desc" },
        { "age" : "desc" }
    ],
    "query" : {
        "term" : { "user" : "kimchy" }
    }
}

```

## Memory Considerations

When sorting, the relevant sorted field values are loaded into memory. This means that per shard, there should be enough memory to contain them. For string based types, the field sorted on should not be analyzed / tokenized. For numeric types, if possible, it is recommended to explicitly set the type to narrower types (like `short`, `integer` and `float`).