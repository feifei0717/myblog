### Java时间处理类：

```
import java.text.ParsePosition;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.regex.Pattern;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
public class DateUtil {
	protected static Log logger = LogFactory.getLog(DateUtil.class);
	// 格式：年－月－日 小时：分钟：秒
    public static final String FORMAT_ONE = "yyyy-MM-dd HH:mm:ss";
    // 格式：年－月－日 小时：分钟
    public static final String FORMAT_TWO = "yyyy-MM-dd HH:mm";
    // 格式：年月日 小时分钟秒
    public static final String FORMAT_THREE = "yyyyMMdd-HHmmss";
    // 格式：年－月－日
    public static final String LONG_DATE_FORMAT = "yyyy-MM-dd";
    // 格式：月－日
    public static final String SHORT_DATE_FORMAT = "MM-dd";
    // 格式：小时：分钟：秒
    public static final String LONG_TIME_FORMAT = "HH:mm:ss";
    //格式：年-月
    public static final String MONTG_DATE_FORMAT = "yyyy-MM";
    // 年的加减
    public static final int SUB_YEAR = Calendar.YEAR;
    // 月加减
    public static final int SUB_MONTH = Calendar.MONTH;
    // 天的加减
    public static final int SUB_DAY = Calendar.DATE;
    // 小时的加减
    public static final int SUB_HOUR = Calendar.HOUR;
    // 分钟的加减
    public static final int SUB_MINUTE = Calendar.MINUTE;
    // 秒的加减
    public static final int SUB_SECOND = Calendar.SECOND;
    static final String dayNames[] = { "星期日" , "星期一" , "星期二" , "星期三" , "星期四" , "星期五" , "星期六" };
    @SuppressWarnings("unused")
    private static final SimpleDateFormat timeFormat = new SimpleDateFormat(
            "yyyy-MM-dd HH:mm:ss");
    public DateUtil() {
    }
    /**
     * 把符合日期格式的字符串转换为日期类型
     */
    public static Date stringtoDate(String dateStr, String format) {
        Date d = null;
        SimpleDateFormat formater = new SimpleDateFormat(format);
        try {
            formater.setLenient(false);
            d = formater.parse(dateStr);
        } catch (Exception e) {
            d = null;
        }
        return d;
    }
    /**
     * 把符合日期格式的字符串转换为日期类型
     */
    public static java.util.Date stringtoDate(String dateStr, String format,
            ParsePosition pos) {
        Date d = null;
        SimpleDateFormat formater = new SimpleDateFormat(format);
        try {
            formater.setLenient(false);
            d = formater.parse(dateStr, pos);
        } catch (Exception e) {
            d = null;
        }
        return d;
    }
    /**
     * 把日期转换为字符串
     */
    public static String dateToString(java.util.Date date, String format) {
        String result = "";
        SimpleDateFormat formater = new SimpleDateFormat(format);
        try {
            result = formater.format(date);
        } catch (Exception e) {
            // log.error(e);
        }
        return result;
    }
    /**
     * 获取当前时间的指定格式
     */
    public static String getCurrDate(String format) {
        return dateToString(new Date(), format);
    }
    public static String dateSub(int dateKind, String dateStr, int amount) {
        Date date = stringtoDate(dateStr, FORMAT_ONE);
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(date);
        calendar.add(dateKind, amount);
        return dateToString(calendar.getTime(), FORMAT_ONE);
    }
    /**
     * 两个日期相减
     * @return 相减得到的秒数
     */
    public static long timeSub(String firstTime, String secTime) {
        long first = stringtoDate(firstTime, FORMAT_ONE).getTime();
        long second = stringtoDate(secTime, FORMAT_ONE).getTime();
        return (second - first) / 1000;
    }
    /**
     * 获得某月的天数
     */
    public static int getDaysOfMonth(String year, String month) {
        int days = 0;
        if (month.equals("1") || month.equals("3") || month.equals("5")
                || month.equals("7") || month.equals("8") || month.equals("10")
                || month.equals("12")) {
            days = 31;
        } else if (month.equals("4") || month.equals("6") || month.equals("9")
                || month.equals("11")) {
            days = 30;
        } else {
            if ((Integer.parseInt(year) % 4 == 0 && Integer.parseInt(year) % 100 != 0)
                    || Integer.parseInt(year) % 400 == 0) {
                days = 29;
            } else {
                days = 28;
            }
        }
        return days;
    }
    /**
     * 获取某年某月的天数
     */
    public static int getDaysOfMonth(int year, int month) {
        Calendar calendar = Calendar.getInstance();
        calendar.set(year, month - 1, 1);
        return calendar.getActualMaximum(Calendar.DAY_OF_MONTH);
    }
    /**
     * 获得当前日期
     */
    public static int getToday() {
        Calendar calendar = Calendar.getInstance();
        return calendar.get(Calendar.DATE);
    }
    /**
     * 获得当前月份
     */
    public static int getToMonth() {
        Calendar calendar = Calendar.getInstance();
        return calendar.get(Calendar.MONTH) + 1;
    }
    /**
     * 获得当前年份
     */
    public static int getToYear() {
        Calendar calendar = Calendar.getInstance();
        return calendar.get(Calendar.YEAR);
    }
    /**
     * 返回日期的天
     */
    public static int getDay(Date date) {
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(date);
        return calendar.get(Calendar.DATE);
    }
    /**
     * 返回日期的年
     */
    public static int getYear(Date date) {
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(date);
        return calendar.get(Calendar.YEAR);
    }
    /**
     * 返回日期的月份，1-12
     */
    public static int getMonth(Date date) {
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(date);
        return calendar.get(Calendar.MONTH) + 1;
    }
    /**
     * 计算两个日期相差的天数，如果date2 > date1 返回正数，否则返回负数
     */
    public static long dayDiff(Date date1, Date date2) {
        return (date2.getTime() - date1.getTime()) / 86400000;
    }
    /**
     * 比较两个日期的年差
     */
    public static int yearDiff(String before, String after) {
        Date beforeDay = stringtoDate(before, LONG_DATE_FORMAT);
        Date afterDay = stringtoDate(after, LONG_DATE_FORMAT);
        return getYear(afterDay) - getYear(beforeDay);
    }
    /**
     * 比较指定日期与当前日期的差
     */
    public static int yearDiffCurr(String after) {
        Date beforeDay = new Date();
        Date afterDay = stringtoDate(after, LONG_DATE_FORMAT);
        return getYear(beforeDay) - getYear(afterDay);
    }
    
    /**
     * 比较指定日期与当前日期的差
     */
    public static long dayDiffCurr(String before) {
        Date currDate = DateUtil.stringtoDate(currDay(), LONG_DATE_FORMAT);
        Date beforeDate = stringtoDate(before, LONG_DATE_FORMAT);
        return (currDate.getTime() - beforeDate.getTime()) / 86400000;
    }
    /**
     * 得到当前日期
     * 
     */
    public static String currDay(){
    	return dateToString(new Date(), LONG_DATE_FORMAT);
    }
    
    /**
     * 获取每月的第一周
     */
    public static int getFirstWeekdayOfMonth(int year, int month) {
        Calendar c = Calendar.getInstance();
        c.setFirstDayOfWeek(Calendar.SATURDAY); // 星期天为第一天
        c.set(year, month - 1, 1);
        return c.get(Calendar.DAY_OF_WEEK);
    }
    /**
     * 获取每月的最后一周
     */
    public static int getLastWeekdayOfMonth(int year, int month) {
        Calendar c = Calendar.getInstance();
        c.setFirstDayOfWeek(Calendar.SATURDAY); // 星期天为第一天
        c.set(year, month - 1, getDaysOfMonth(year, month));
        return c.get(Calendar.DAY_OF_WEEK);
    }
    /**
     * 获得当前日期字符串，格式"yyyy-MM-dd HH:mm:ss"
     * 
     * @return
     */
    public static String getNow() {
        Calendar today = Calendar.getInstance();
        return dateToString(today.getTime(), FORMAT_ONE);
    }
    /**
     * 把java.util.date 类型转换成java.sql.date
     * @param date
     * @return
     */
    public static java.sql.Timestamp getDate(java.util.Date date){
//		java.sql.Date   sqlDate = new java.sql.Date();
		java.sql.Timestamp timestamp = new java.sql.Timestamp(date.getTime());
		return timestamp;
	}
    /**
     * 判断日期是否有效,包括闰年的情况
     * 
     * @param date
     *          YYYY-mm-dd
     * @return
     */
    public static boolean isDate(String date) {
        StringBuffer reg = new StringBuffer(
                "^((\\d{2}(([02468][048])|([13579][26]))-?((((0?");
        reg.append("[13578])|(1[02]))-?((0?[1-9])|([1-2][0-9])|(3[01])))");
        reg.append("|(((0?[469])|(11))-?((0?[1-9])|([1-2][0-9])|(30)))|");
        reg.append("(0?2-?((0?[1-9])|([1-2][0-9])))))|(\\d{2}(([02468][12");
        reg.append("35679])|([13579][01345789]))-?((((0?[13578])|(1[02]))");
        reg.append("-?((0?[1-9])|([1-2][0-9])|(3[01])))|(((0?[469])|(11))");
        reg.append("-?((0?[1-9])|([1-2][0-9])|(30)))|(0?2-?((0?[");
        reg.append("1-9])|(1[0-9])|(2[0-8]))))))");
        Pattern p = Pattern.compile(reg.toString());
        return p.matcher(date).matches();
    }
}
```

### java日期操作(月末、周末等的日期操作)

```
/**
 * java日期操作(月末、周末等的日期操作)
 * 
 * @author 
 * 
 */
public class DateUtil {
	
    /** */
    /**
     * 取得某天相加(减)後的那一天
     * 
     * @param date
     * @param num
     *            (可正可负)
     * @return
     */
    public static Date getAnotherDate(Date date, int num) {
        Calendar c = Calendar.getInstance();
        c.setTime(date);
        c.add(Calendar.DAY_OF_YEAR, num);
        return c.getTime();
    }
    /** */
    /**
     * 取得某月的的最后一天
     * 
     * @param year
     * @param month
     * @return
     */
    public static Date getLastDayOfMonth(int year, int month) {
        Calendar cal = Calendar.getInstance();
        cal.set(Calendar.YEAR, year);// 年
        cal.set(Calendar.MONTH, month - 1);// 月，因为Calendar里的月是从0开始，所以要减1
        cal.set(Calendar.DATE, 1);// 日，设为一号
        cal.add(Calendar.MONTH, 1);// 月份加一，得到下个月的一号
        cal.add(Calendar.DATE, -1);// 下一个月减一为本月最后一天
        return cal.getTime();// 获得月末是几号
    }
    /** */
    /**
     * 取得某天是一年中的多少周
     * 
     * @param date
     * @return
     */
    public static int getWeekOfYear(Date date) {
        Calendar c = new GregorianCalendar();
        c.setFirstDayOfWeek(Calendar.MONDAY);
        c.setMinimalDaysInFirstWeek(7);
        c.setTime(date);
        return c.get(Calendar.WEEK_OF_YEAR);
    }
    /** */
    /**
     * 取得某天所在周的第一天
     * 
     * @param date
     * @return
     */
    public static Date getFirstDayOfWeek(Date date) {
        Calendar c = new GregorianCalendar();
        c.setFirstDayOfWeek(Calendar.MONDAY);
        c.setTime(date);
        c.set(Calendar.DAY_OF_WEEK, c.getFirstDayOfWeek());
        return c.getTime();
    }
    /** */
    /**
     * 取得某天所在周的最后一天
     * 
     * @param date
     * @return
     */
    public static Date getLastDayOfWeek(Date date) {
        Calendar c = new GregorianCalendar();
        c.setFirstDayOfWeek(Calendar.MONDAY);
        c.setTime(date);
        c.set(Calendar.DAY_OF_WEEK, c.getFirstDayOfWeek() + 6);
        return c.getTime();
    }
    /** */
    /**
     * 取得某一年共有多少周
     * 
     * @param year
     * @return
     */
    public static int getMaxWeekNumOfYear(int year) {
        Calendar c = new GregorianCalendar();
        c.set(year, Calendar.DECEMBER, 31, 23, 59, 59);
        return getWeekOfYear(c.getTime());
    }
    /**
     * 
     * 获取某一年某一周的日期
     * @description 
     * @param year
     * @param week
     * @return
     */
    public static List<String> getWeekDays(int year,int week){
    	List<String> list = new ArrayList<String>();
    	
        Date date =  getFirstDayOfWeek(year,week);
        SimpleDateFormat d = new SimpleDateFormat("yyyy-MM-dd");
     
        for (int i = 0; i < 7; i++) {
			list.add(d.format(date));
			System.out.println(d.format(date));
		
			date.setDate(date.getDate()+1);
		}
    	return list;
    }
    /** */
    /**
     * 取得某年某周的第一天 对于交叉:2008-12-29到2009-01-04属于2008年的最后一周,2009-01-05为2009年第一周的第一天
     * 
     * @param year
     * @param week
     * @return
     */
    public static Date getFirstDayOfWeek(int year, int week) {
        Calendar calFirst = Calendar.getInstance();
        calFirst.set(year, 0, 7);
        Date firstDate = getFirstDayOfWeek(calFirst.getTime());
        Calendar firstDateCal = Calendar.getInstance();
        firstDateCal.setTime(firstDate);
        Calendar c = new GregorianCalendar();
        c.set(Calendar.YEAR, year);
        c.set(Calendar.MONTH, Calendar.JANUARY);
        c.set(Calendar.DATE, firstDateCal.get(Calendar.DATE));
        Calendar cal = (GregorianCalendar) c.clone();
        cal.add(Calendar.DATE, (week - 1) * 7);
        firstDate = getFirstDayOfWeek(cal.getTime());
        return firstDate;
    }
    /** */
    /**
     * 取得某年某周的最后一天 对于交叉:2008-12-29到2009-01-04属于2008年的最后一周, 2009-01-04为
     * 2008年最后一周的最后一天
     * 
     * @param year
     * @param week
     * @return
     */
    public static Date getLastDayOfWeek(int year, int week) {
        Calendar calLast = Calendar.getInstance();
        calLast.set(year, 0, 7);
        Date firstDate = getLastDayOfWeek(calLast.getTime());
        Calendar firstDateCal = Calendar.getInstance();
        firstDateCal.setTime(firstDate);
        Calendar c = new GregorianCalendar();
        c.set(Calendar.YEAR, year);
        c.set(Calendar.MONTH, Calendar.JANUARY);
        c.set(Calendar.DATE, firstDateCal.get(Calendar.DATE));
        Calendar cal = (GregorianCalendar) c.clone();
        cal.add(Calendar.DATE, (week - 1) * 7);
        Date lastDate = getLastDayOfWeek(cal.getTime());
        return lastDate;
    }
    /**
     *获取当前日期的年、月、日
     */
    public void display() {
        Calendar cal = Calendar.getInstance();
        // 年
        int year = cal.get(cal.YEAR);
        // 月
        int month = cal.get(cal.MONTH) + 1;
        // 日
        int date = cal.get(cal.DATE);
        // 星期
        int today = cal.get(cal.DAY_OF_WEEK) - 1;
    }
    
    
    public static void  main(String args[]){
        List<String> listWeekDate =  DateUtil.getWeekDays(2010,52);
        
        for(String weeks :listWeekDate){
			System.out.println("weeks:"+weeks);
		}
    }
}
```

### Js时间处理类：

```
/**
* 日期处理工具类
*/
var DateUtil = function(){
	/**
	 * 判断闰年
	 * @param date Date日期对象
	 * @return boolean true 或false
	 */
	this.isLeapYear = function(date){
		return (0==date.getYear()%4&&((date.getYear()%100!=0)||(date.getYear()%400==0))); 
	}
	
	/**
	 * 日期对象转换为指定格式的字符串
	 * @param f 日期格式,格式定义如下 yyyy-MM-dd HH:mm:ss
	 * @param date Date日期对象, 如果缺省，则为当前时间
	 *
	 * YYYY/yyyy/YY/yy 表示年份  
	 * MM/M 月份  
	 * W/w 星期  
	 * dd/DD/d/D 日期  
	 * hh/HH/h/H 时间  
	 * mm/m 分钟  
	 * ss/SS/s/S 秒  
	 * @return string 指定格式的时间字符串
	 */
	this.dateToStr = function(formatStr, date){
		formatStr = arguments[0] || "yyyy-MM-dd HH:mm:ss";
		date = arguments[1] || new Date();
	    var str = formatStr;   
	    var Week = ['日','一','二','三','四','五','六'];  
	    str=str.replace(/yyyy|YYYY/,date.getFullYear());   
	    str=str.replace(/yy|YY/,(date.getYear() % 100)>9?(date.getYear() % 100).toString():'0' + (date.getYear() % 100));   
	    str=str.replace(/MM/,date.getMonth()>9?(date.getMonth() + 1):'0' + (date.getMonth() + 1));   
	    str=str.replace(/M/g,date.getMonth());   
	    str=str.replace(/w|W/g,Week[date.getDay()]);   
	  
	    str=str.replace(/dd|DD/,date.getDate()>9?date.getDate().toString():'0' + date.getDate());   
	    str=str.replace(/d|D/g,date.getDate());   
	  
	    str=str.replace(/hh|HH/,date.getHours()>9?date.getHours().toString():'0' + date.getHours());   
	    str=str.replace(/h|H/g,date.getHours());   
	    str=str.replace(/mm/,date.getMinutes()>9?date.getMinutes().toString():'0' + date.getMinutes());   
	    str=str.replace(/m/g,date.getMinutes());   
	  
	    str=str.replace(/ss|SS/,date.getSeconds()>9?date.getSeconds().toString():'0' + date.getSeconds());   
	    str=str.replace(/s|S/g,date.getSeconds());   
	  
	    return str;   
	}
	
	/**
	* 日期计算  
	* @param strInterval string  可选值 y 年 m月 d日 w星期 ww周 h时 n分 s秒  
	* @param num int
	* @param date Date 日期对象
	* @return Date 返回日期对象
	*/
	this.dateAdd = function(strInterval, num, date){
		date =  arguments[2] || new Date();
		switch (strInterval) { 
			case 's' :return new Date(date.getTime() + (1000 * num));  
			case 'n' :return new Date(date.getTime() + (60000 * num));  
			case 'h' :return new Date(date.getTime() + (3600000 * num));  
			case 'd' :return new Date(date.getTime() + (86400000 * num));  
			case 'w' :return new Date(date.getTime() + ((86400000 * 7) * num));  
			case 'm' :return new Date(date.getFullYear(), (date.getMonth()) + num, date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds());  
			case 'y' :return new Date((date.getFullYear() + num), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds());  
		}  
	}  
	
	/**
	* 比较日期差 dtEnd 格式为日期型或者有效日期格式字符串
	* @param strInterval string  可选值 y 年 m月 d日 w星期 ww周 h时 n分 s秒  
	* @param dtStart Date  可选值 y 年 m月 d日 w星期 ww周 h时 n分 s秒
	* @param dtEnd Date  可选值 y 年 m月 d日 w星期 ww周 h时 n分 s秒 
	*/
	this.dateDiff = function(strInterval, dtStart, dtEnd) {   
		switch (strInterval) {   
			case 's' :return parseInt((dtEnd - dtStart) / 1000);  
			case 'n' :return parseInt((dtEnd - dtStart) / 60000);  
			case 'h' :return parseInt((dtEnd - dtStart) / 3600000);  
			case 'd' :return parseInt((dtEnd - dtStart) / 86400000);  
			case 'w' :return parseInt((dtEnd - dtStart) / (86400000 * 7));  
			case 'm' :return (dtEnd.getMonth()+1)+((dtEnd.getFullYear()-dtStart.getFullYear())*12) - (dtStart.getMonth()+1);  
			case 'y' :return dtEnd.getFullYear() - dtStart.getFullYear();  
		}  
	}
	/**
	* 字符串转换为日期对象
	* @param date Date 格式为yyyy-MM-dd HH:mm:ss，必须按年月日时分秒的顺序，中间分隔符不限制
	*/
	this.strToDate = function(dateStr){
		var data = dateStr;  
		var reCat = /(\d{1,4})/gm;   
		var t = data.match(reCat);
		t[1] = t[1] - 1;
		eval('var d = new Date('+t.join(',')+');');
		return d;
	}
	/**
	* 把指定格式的字符串转换为日期对象yyyy-MM-dd HH:mm:ss
	* 
	*/
	this.strFormatToDate = function(formatStr, dateStr){
		var year = 0;
		var start = -1;
		var len = dateStr.length;
		if((start = formatStr.indexOf('yyyy')) > -1 && start < len){
			year = dateStr.substr(start, 4);
		}
		var month = 0;
		if((start = formatStr.indexOf('MM')) > -1  && start < len){
			month = parseInt(dateStr.substr(start, 2)) - 1;
		}
		var day = 0;
		if((start = formatStr.indexOf('dd')) > -1 && start < len){
			day = parseInt(dateStr.substr(start, 2));
		}
		var hour = 0;
		if( ((start = formatStr.indexOf('HH')) > -1 || (start = formatStr.indexOf('hh')) > 1) && start < len){
			hour = parseInt(dateStr.substr(start, 2));
		}
		var minute = 0;
		if((start = formatStr.indexOf('mm')) > -1  && start < len){
			minute = dateStr.substr(start, 2);
		}
		var second = 0;
		if((start = formatStr.indexOf('ss')) > -1  && start < len){
			second = dateStr.substr(start, 2);
		}
		return new Date(year, month, day, hour, minute, second);
	}
	/**
	* 日期对象转换为毫秒数
	*/
	this.dateToLong = function(date){
		return date.getTime();
	}
	/**
	* 毫秒转换为日期对象
	* @param dateVal number 日期的毫秒数 
	*/
	this.longToDate = function(dateVal){
		return new Date(dateVal);
	}
	/**
	* 判断字符串是否为日期格式
	* @param str string 字符串
	* @param formatStr string 日期格式， 如下 yyyy-MM-dd
	*/
	this.isDate = function(str, formatStr){
		if (formatStr == null){
			formatStr = "yyyyMMdd";    
		}
		var yIndex = formatStr.indexOf("yyyy");     
		if(yIndex==-1){
			return false;
		}
		var year = str.substring(yIndex,yIndex+4);     
		var mIndex = formatStr.indexOf("MM");     
		if(mIndex==-1){
			return false;
		}
		var month = str.substring(mIndex,mIndex+2);     
		var dIndex = formatStr.indexOf("dd");     
		if(dIndex==-1){
			return false;
		}
		var day = str.substring(dIndex,dIndex+2);     
		if(!isNumber(year)||year>"2100" || year< "1900"){
			return false;
		}
		if(!isNumber(month)||month>"12" || month< "01"){
			return false;
		}
		if(day>getMaxDay(year,month) || day< "01"){
			return false;
		}
		return true;   
	}
	
	this.getMaxDay = function(year,month) {     
		if(month==4||month==6||month==9||month==11)     
			return "30";     
		if(month==2)     
			if(year%4==0&&year%100!=0 || year%400==0)     
				return "29";     
			else     
				return "28";     
		return "31";     
	}     
	/**
	*	变量是否为数字
	*/
	this.isNumber = function(str)
	{
		var regExp = /^\d+$/g;
		return regExp.test(str);
	}
    
	/**
	* 把日期分割成数组 [年、月、日、时、分、秒]
	*/
	this.toArray = function(myDate)  
	{   
		myDate = arguments[0] || new Date();
		var myArray = Array();  
		myArray[0] = myDate.getFullYear();  
		myArray[1] = myDate.getMonth();  
		myArray[2] = myDate.getDate();  
		myArray[3] = myDate.getHours();  
		myArray[4] = myDate.getMinutes();  
		myArray[5] = myDate.getSeconds();  
		return myArray;  
	}  
	
	/**
	* 取得日期数据信息  
	* 参数 interval 表示数据类型  
	* y 年 M月 d日 w星期 ww周 h时 n分 s秒  
	*/
	this.datePart = function(interval, myDate)  
	{   
		myDate = arguments[1] || new Date();
		var partStr='';  
		var Week = ['日','一','二','三','四','五','六'];  
		switch (interval)  
		{   
			case 'y' :partStr = myDate.getFullYear();break;  
			case 'M' :partStr = myDate.getMonth()+1;break;  
			case 'd' :partStr = myDate.getDate();break;  
			case 'w' :partStr = Week[myDate.getDay()];break;  
			case 'ww' :partStr = myDate.WeekNumOfYear();break;  
			case 'h' :partStr = myDate.getHours();break;  
			case 'm' :partStr = myDate.getMinutes();break;  
			case 's' :partStr = myDate.getSeconds();break;  
		}  
		return partStr;  
	}  
	
	/**
	* 取得当前日期所在月的最大天数  
	*/
	this.maxDayOfDate = function(date)  
	{   
		date = arguments[0] || new Date();
		date.setDate(1);
		date.setMonth(date.getMonth() + 1);
		var time = date.getTime() - 24 * 60 * 60 * 1000;
		var newDate = new Date(time);
		return newDate.getDate();
	}
	
	return this;
}();
```