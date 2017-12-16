下划线与驼峰命名转换

```
public class Tool {
    private static Pattern linePattern = Pattern.compile("_(\\w)");
    /**下划线转驼峰*/
    public static String lineToHump(String str) {
        str = str.toLowerCase();
        Matcher matcher = linePattern.matcher(str);
        StringBuffer sb = new StringBuffer();
        while (matcher.find()) {
            matcher.appendReplacement(sb, matcher.group(1).toUpperCase());
        }
        matcher.appendTail(sb);
        return sb.toString();
    }
    /**驼峰转下划线(简单写法，效率低于{@link #humpToLine2(String)})*/
    public static String humpToLine(String str) {
        return str.replaceAll("[A-Z]", "_$0").toLowerCase();
    }
    private static Pattern humpPattern = Pattern.compile("[A-Z]");
    /**驼峰转下划线,效率比上面高*/
    public static String humpToLine2(String str) {
        Matcher matcher = humpPattern.matcher(str);
        StringBuffer sb = new StringBuffer();
        while (matcher.find()) {
            matcher.appendReplacement(sb, "_" + matcher.group(0).toLowerCase());
        }
        matcher.appendTail(sb);
        //去掉第一个 _
        String str_ = sb.toString();
        int i = str_.indexOf(str_);
        if (i == 0) {
            str_ = str_.replaceFirst("_", "");
        }
        return str_;
    }
    public static void main(String[] args) {
        String lineToHump = lineToHump("f_parent_no_leader");
        System.out.println(lineToHump);//fParentNoLeader  
        System.out.println(humpToLine(lineToHump));//f_parent_no_leader  
        System.out.println(humpToLine2(lineToHump));//f_parent_no_leader  
    }
}
```

不纠结""_"+matcher.group(0).toLowerCase()"的话，humpToLine2效率会比humpToLine高一些，看String#replaceAll方法源码即可。

其他形式：

```
    /**
     * <B>Description:</B> ICON_SEQ 转成  icon_seq <br>
     * <B>Create on:</B> 2016/12/8 10:57 <br>
     *
     * @author xiangyu.ye
     */
    public static String formatField(String field) {
        String[] strs = field.split("_");
        field = "";
        int m = 0;
        for (int length = strs.length; m < length; ++m) {
            if (m > 0) {
                String tempStr = strs[m].toLowerCase();
                tempStr = tempStr.substring(0, 1).toUpperCase()
                          + tempStr.substring(1, tempStr.length());
                field = field + tempStr;
            } else {
                field = field + strs[m].toLowerCase();
            }
        }
        return field;
    }
    /**
     * <B>Description:</B> ICON_SEQ 转成 IconSeq  <br>
     * <B>Create on:</B> 2016/12/8 10:59 <br>
     *
     * @author xiangyu.ye
     */
    public static String formatFieldCapital(String field) {
        String[] strs = field.split("_");
        field = "";
        int m = 0;
        for (int length = strs.length; m < length; ++m) {
            if (m > 0) {
                String tempStr = strs[m].toLowerCase();
                tempStr = tempStr.substring(0, 1).toUpperCase()
                          + tempStr.substring(1, tempStr.length());
                field = field + tempStr;
            } else {
                field = field + strs[m].toLowerCase();
            }
        }
        field = field.substring(0, 1).toUpperCase() + field.substring(1);
        return field;
    }
```