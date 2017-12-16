使用Guava的排序工具类， 快速实现对象的单变量排序和多变量排序，使用实例：

```
import com.google.common.base.Function;
import com.google.common.collect.Lists;
import com.google.common.collect.Ordering;
import java.util.Collections;
import java.util.List;
public class CityByPopluation   {
    public static void main(String[] args) {
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
                City@c63a8af[cityName=ShenZhen,population=100020,averageRainfall=33.8]
                City@1d0daff6[cityName=Beijing,population=100001,averageRainfall=55.0]
                City@6d9b4e60[cityName=Shanghai,population=100000,averageRainfall=45.0]
        ------------------------------------------------------------------------------*/
    }
}
```

City类：

```
public class City   {
    private String cityName;
    private Integer population;
    private Double averageRainfall;
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
        return ToStringBuilder.reflectionToString(this);
    }
}
```