# Guava Ordering排序工具

/Users/jerryye/backup/studio/AvailableCode/basis/guava/guava_demo/src/main/java/com/gtt/basicutilities/OrderingTest.java

使用Guava的排序工具类， 快速实现对象的单变量排序和多变量排序，使用实例：

```java
    /**
     * <B>Description:</B> 通用排序方式 <br>
     * <B>Create on:</B> 2017/12/30 上午10:03 <br>
     *
     * @author xiangyu.ye
     */
    @Test
    public void testonResultOf() {
        // City 类字段String cityName,Integer population,  Double averageRainfall
        City city1 = new City("Beijing", 100001, 55.0);
        City city2 = new City("Shanghai", 100000, 45.0);
        City city3 = new City("ShenZhen", 100020, 33.8);
        List<City> cities = Lists.newArrayList(city1, city2, city3);
        //构建 根据 population列排序的比较器
        Ordering<City> ordering = Ordering.natural().nullsLast().onResultOf(new Function<City, Integer>() {
            public Integer apply(City foo) {
                return -foo.getPopulation();  //降序  默认是升序
            }
        });
        //排序打印结果
        Collections.sort(cities, ordering);
        for (City city : cities) {
            System.out.println(city);
        }

        /*------------------------------------------------------------------------------
        	结果：
                City{cityName='ShenZhen', population=100020, averageRainfall=33.8}
                City{cityName='Beijing', population=100001, averageRainfall=55.0}
                City{cityName='Shanghai', population=100000, averageRainfall=45.0}
        ------------------------------------------------------------------------------*/
    }
```

City类：

```
package com.gtt.basicutilities.model;

public class City {
    private String  cityName;
    private Integer population;
    private Double  averageRainfall;

    public City(String cityName, Integer population, Double averageRainfall) {
        this.cityName = cityName;
        this.population = population;
        this.averageRainfall = averageRainfall;
    }

    public String getCityName() {
        return cityName;
    }

    public void setCityName(String cityName) {
        this.cityName = cityName;
    }

    public Integer getPopulation() {
        return population;
    }

    public void setPopulation(Integer population) {
        this.population = population;
    }

    public Double getAverageRainfall() {
        return averageRainfall;
    }

    public void setAverageRainfall(Double averageRainfall) {
        this.averageRainfall = averageRainfall;
    }

    @Override
    public String toString() {
        return "City{" + "cityName='" + cityName + '\'' + ", population=" + population
               + ", averageRainfall=" + averageRainfall + '}';
    }
}
```