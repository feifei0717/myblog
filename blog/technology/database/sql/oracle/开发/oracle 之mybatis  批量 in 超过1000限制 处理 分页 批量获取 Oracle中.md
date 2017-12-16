### Oracle中的in参数的个数限制方案

in后括号中的参数个数有限制，Oracle 9i 中个数不能超过256,Oracle 10g个数不能超过1000.

当in的个数大于1000时，解决办法有：

（1）对参数进行处理，分成多个in，其中每个in列表中参数都小于1000，如 params in(1,2,3.........1000) or  params in(1001,1002...2000).

不过这种方法性能和维护性方面不好

（2）是将in后面的字符串改成了子查询，将in里面的数据保存到临时表中，params in（select ....from dual ）

### 以下是oracle在mybatis中比较合理解决办法

mapper.xml：

```xml
    <!--根据itno批量查找实时数据列-->
    <select id="findQtyByItnoBatch" resultMap="itemQtyEntity" fetchSize="100">
        <include refid="selectRealtimeItemEntity"/>
        where islifeexpired='0' and 
        <!--   ITNO in的
        <foreach collection="list" item="item" open="(" separator="," close=")">#{item}</foreach>
        -->
       (<foreach collection="@com.feiniu.soa.commodity.base.util.PagerTool@pageList(list,1000)" item="innerItem"  open="" separator="OR" close="">
				(ITNO in
					<foreach item="item" index="index" collection="innerItem" open="(" separator="," close=")">
						#{item}
					</foreach>
				)
		</foreach>
		)	
    </select>

```

dao：

```
List<ItemQtyEntity> findQtyByItnoBatch(List<String> itnos);
```

PagerTool类：

```Java
package com.feiniu.soa.commodity.base.util;
import java.util.List;
import java.util.Vector;
/**
 * <B>Description:</B> <br>
 * <B>Create on:</B> 2015/9/2<br>
 *
 * @author ke.tu
 * @version 1.0
 */
public class PagerTool {
    /**
     * 计算页码
     * @param list
     * @param recordPerPage
     * @return
     */
    private static int calcPageCount(List list, int recordPerPage) {
        if (recordPerPage <= 0)
            return 1;
        if (list == null || list.isEmpty())
            return 1;
        int size = list.size();
        return size % recordPerPage == 0 ? size / recordPerPage : (size / recordPerPage) + 1;
    }
    /**
     * 
     * <B>Description:</B>返回分页结果 <br>
     * <B>Create on:</B> 2015年9月17日 上午9:45:00<br>
     *
     * @param list
     * @param recordPerPage
     * @return 
     * @author ke.tu
     */
    public static List<List> pageList(List list, int recordPerPage) {
        List<List> result = new Vector<>();
        if (list == null) {
            return result;
        }
        if (recordPerPage <= 0) {
            result.add(list);
        } else {
            int pageCount = calcPageCount(list, recordPerPage);
            for (int i = 0; i < pageCount; i++) {
                int startIndex = i * recordPerPage;
                int endIndex = Math.min(list.size(), startIndex + recordPerPage);
                result.add(list.subList(startIndex, endIndex));
            }
        }
        return result;
    }
    /*public static void main(String[] args) {
        List list = new Vector();
        for (int i = 0; i < 299; i++) {
            list.add("id_" + i);
        }
        List<List> result = pageList(list, 100);
        for (List item : result) {
            System.out.println(item);
        }
    }*/
}

```