工作中进行http相关接口测试时经常会收到返回的json数据，因为没有格式化输入到控制台后看起来很不直观。

早上写了一个小工具类，对这JSON串进行格式化输出，代替System.out.print

```
package MyTest;
/**
 * <B>Description:</B> 格式化输入工具类  <br>
 * <B>Create on:</B> 2016/5/11 12:36 <br>
 *
 * @author xiangyu.ye
 * @version 1.0
 */
public final class FormatUtil {
    /**
     * <B>Description:</B> 打印输入到控制台 <br>
     * <B>Create on:</B> 2016/5/11 12:36 <br>
     *
     * @author xiangyu.ye
     */
    public static void printJson(String jsonStr) {
        System.out.println(formatJson(jsonStr));
    }
    /**
     * <B>Description:</B> 格式化 JSON <br>
     * <B>Create on:</B> 2016/5/11 12:36 <br>
     *
     * @author xiangyu.ye
     */
    public static String formatJson(String jsonStr) {
        if (null == jsonStr || "".equals(jsonStr))
            return "";
        StringBuilder sb = new StringBuilder();
        char last = '\0';
        char current = '\0';
        int indent = 0;
        for (int i = 0; i < jsonStr.length(); i++) {
            last = current;
            current = jsonStr.charAt(i);
            switch (current) {
                case '{':
                case '[':
                    sb.append(current);
                    sb.append('\n');
                    indent++;
                    addIndentBlank(sb, indent);
                    break;
                case '}':
                case ']':
                    sb.append('\n');
                    indent--;
                    addIndentBlank(sb, indent);
                    sb.append(current);
                    break;
                case ',':
                    sb.append(current);
                    if (last != '\\') {
                        sb.append('\n');
                        addIndentBlank(sb, indent);
                    }
                    break;
                default:
                    sb.append(current);
            }
        }
        return sb.toString();
    }
   /**
    * <B>Description:</B> 添加space  <br>
    * <B>Create on:</B> 2016/5/11 12:36 <br>
    *
    * @author xiangyu.ye
    */
    private static void addIndentBlank(StringBuilder sb, int indent) {
        for (int i = 0; i < indent; i++) {
            sb.append('\t');
        }
    }
}
```

输出：

```
{
  "content": "this is the msg content.",
  "tousers": "user1|user2",
  "msgtype": "texturl",
  "appkey": "test",
  "domain": "test",
  "system": {
    "wechat": {
      "safe": "1"
    }
  },
  "texturl": {
    "urltype": "0",
    "user1": {
      "spStatus": "user01",
      "workid": "work01"
    },
    "user2": {
      "spStatus": "user02",
      "workid": "work02"
    }
  }
}
```