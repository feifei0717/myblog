$().ready()
{
    $("#tank_footer").append("<div style=\"background-color: #ffffa3; border-style: solid; border-width: 2pt; border-color: ffff00;\"><p>如果您看了本篇博客,觉得对您有所收获，请点击右下角的 <b>[推荐]</b></p><p>如果您想转载本博客，<b>请注明出处</b></p><p>如果您对本文有意见或者建议，欢迎留言</p><p>感谢您的阅读，请关注我的后续博客</p></div>");

    $("#tank_hidden").append("<div style=\"background-color: #ffffa3; border-style: solid; border-width: 2pt; border-color: ffff00;\">本文版权归<a href=\"http://www.cnblogs.com/tankxiao\" target=\"_blank\">【小坦克】</a>和【博客园】共有，欢迎转载，但须保留此段声明，并给出原文链接&nbsp;<a href=\"http://www.cnblogs.com/tankxiao\" target=\"_blank\">http://www.cnblogs.com/tankxiao</a>，谢谢合作</div>");

    $("#tank_ads").append("<div style=\"background-color: #ffffa3; border-style: solid; border-width: 2pt; border-color: ffff00;\"><p>个人广告</p><p>本人从事以下兼职:  请联系QQ:2464602531</p><p>1. 软件测试，自动化测试培训</p><p>2. 抓包程序开发， APP, HTTP, HTTPS， 网站抓包分析</p><p>3. Fiddler 工具培训</p></div>");

   

    //$("h1[id=tank_h1]").prev("p a").remove();
    //var h1_text = $("h1[id=tank_h1]").text();
    //$("h1[id=tank_h1]").before("<p><a name=\"" + h1_text + "\"></a></p>");




    $("#tank_fiddler_all").append("<p id=\"tank_ref_title\">附： Fiddler 系列教程, (连载中, 敬请期待）</p>" +
    "<p><a href=\"http://www.cnblogs.com/TankXiao/archive/2012/02/06/2337728.html\" target=\"_blank\">Fiddler (一) 教程</a></p>" +
    "<p><a href=\"http://www.cnblogs.com/TankXiao/archive/2012/04/25/2349049.html\" target=\"_blank\">Fiddler (二) Script用法</a></p>" +
    "<p><a href=\"http://www.cnblogs.com/TankXiao/archive/2012/12/25/2829709.html\" target=\"_blank\">Fiddler (三) Composer创建和发送HTTP Request</a></p>" +
    "<p><a href=\"http://www.cnblogs.com/TankXiao/p/3063871.html\" target=\"_blank\">Fiddler (四) 实现手机的抓包</a></p>" +
	"<p><a href=\"http://www.cnblogs.com/TankXiao/archive/2013/04/18/3027971.html\" target=\"_blank\">Fiddler (五) Mac下使用Fiddler</a></p>" +
    "<p><a href=\"http://www.cnblogs.com/TankXiao/archive/2013/06/12/3132405.html\" target=\"_blank\">Fiddler (六) 最常用的快捷键</a></p>"+
	"<p><a href=\"http://www.cnblogs.com/TankXiao/p/4863717.html\" target=\"_blank\">Fiddler (七) AutoResponder前端工程师快速调试</a></p>");

    $("#tank_http_all").append("<p id=\"tank_ref_title\">附： HTTP协议 系列教程， (连载中, 敬请期待）</p>" +
    "<p><a href=\"http://www.cnblogs.com/TankXiao/archive/2012/02/13/2342672.html\" target=\"_blank\">HTTP协议 (一) HTTP协议详解</a></p>" +
    "<p><a href=\"http://www.cnblogs.com/TankXiao/archive/2012/09/26/2695955.html\" target=\"_blank\">HTTP协议 (二) 基本认证</a></p>" +
    "<p><a href=\"http://www.cnblogs.com/TankXiao/archive/2012/11/13/2749055.html\" target=\"_blank\">HTTP协议 (三) 压缩</a></p>" +
    "<p><a href=\"http://www.cnblogs.com/TankXiao/archive/2012/11/28/2793365.html\" target=\"_blank\">HTTP协议 (四) 缓存</a></p>" +
    "<p><a href=\"http://www.cnblogs.com/TankXiao/archive/2012/12/12/2794160.html\" target=\"_blank\">HTTP协议 (五) 代理</a></p>" +
    "<p><a href=\"http://www.cnblogs.com/TankXiao/archive/2013/01/08/2818542.html\" target=\"_blank\">HTTP协议 (六) 状态码详解</a></p>" +
    "<p><a href=\"http://www.cnblogs.com/TankXiao/archive/2013/04/15/2848906.html\" target=\"_blank\">HTTP协议 (七) Cookie</a></p>");


    $("#tank_mac_all").append("<p id=\"tank_ref_title\">附： Mac技巧 系列教程， (连载中, 敬请期待）</p>" +
    "<p><a href=\"http://www.cnblogs.com/TankXiao/archive/2013/01/05/2845413.html\" target=\"_blank\">Mac入门 (一) 基本用法</a></p>" +
	"<p><a href=\"http://www.cnblogs.com/TankXiao/p/3267796.html\" target=\"_blank\">Mac入门 (二) 使用VMware Fusion虚拟机</a></p>" +
	"<p><a href=\"http://www.cnblogs.com/TankXiao/p/3247113.html\" target=\"_blank\">Mac入门（三）使用brew安装软件</a></p>");

    $("#tank_python_all").append("<p id=\"tank_ref_title\">附： Python 系列教程， (连载中, 敬请期待）</p>" +
    "<p><a href=\"http://www.cnblogs.com/TankXiao/archive/2013/04/21/3033640.html\" target=\"_blank\">Python自动化测试 (一) Eclipse+Pydev 搭建开发环境</a></p>" +
    "<p><a href=\"http://www.cnblogs.com/TankXiao/archive/2013/04/23/3038350.html\" target=\"_blank\">Python自动化测试 (二) ConfigParser模块读写配置文件</a></p>");

    $("#tank_automation_all").append("<p id=\"tank_ref_title\">附： 自动化测试 系列教程， (连载中, 敬请期待）</p>" +
    "<p><a href=\"http://www.cnblogs.com/TankXiao/archive/2012/02/20/2350421.html\" target=\"_blank\">自动化测试 (一) 12306火车票网站自动登录工具</a></p>" +
    "<p><a href=\"http://www.cnblogs.com/TankXiao/archive/2012/05/22/2496954.html\" target=\"_blank\">自动化测试 (二) 连连看外挂</a></p>" +
    "<p><a href=\"http://www.cnblogs.com/TankXiao/archive/2012/03/29/2418219.html\" target=\"_blank\">自动化测试 (三) Web自动化测试原理</a></p>" +
    "<p><a href=\"http://www.cnblogs.com/TankXiao/archive/2012/10/18/2727072.html\" target=\"_blank\">自动化测试 (四) 自动卸载软件</a></p>" +
    "<p><a href=\"http://www.cnblogs.com/TankXiao/archive/2012/11/03/2747910.html\" target=\"_blank\">自动化测试 (五) 读写64位操作系统的注册表</a></p>");

    $("#tank_test_all").append("<p id=\"tank_ref_title\">附： 软件测试 系列教程， (连载中, 敬请期待）</p>" +
    "<p><a href=\"http://www.cnblogs.com/TankXiao/archive/2012/02/20/2347016.html\" target=\"_blank\">软件测试 (一) 软件测试方法大汇总</a></p>" +
    "<p><a href=\"http://www.cnblogs.com/TankXiao/archive/2012/08/27/2576962.html\" target=\"_blank\">软件测试 (二) 六年软件测试感悟</a></p>" +
    "<p><a href=\"http://www.cnblogs.com/TankXiao/p/3410043.html\" target=\"_blank\">软件测试 (三) 界面测试</a></p>");

    $("#tank_test_interview").append("<p id=\"tank_ref_title\">附： 软件面试系列教程， (连载中, 敬请期待）</p>" +
    "<p><a href=\"http://www.cnblogs.com/TankXiao/p/2381284.html\" target=\"_blank\">软件测试面试 (一) 如何测试一个杯子</a></p>" +
    "<p><a href=\"http://www.cnblogs.com/TankXiao/p/3154017.html\" target=\"_blank\">软件测试面试 (二) 如何测试网页的登录页面</a></p>");

    $("#tank_vsusage").append("<p id=\"tank_ref_title\">附： Visual Studio使用技巧 (连载中, 敬请期待）</p>" +
    "<p><a href=\"http://www.cnblogs.com/TankXiao/p/3164995.html\" target=\"_blank\">Visual Studio 常用快捷键</a></p>" +
    "<p><a href=\"http://www.cnblogs.com/TankXiao/p/3468831.html\" target=\"_blank\">Visual Studio 常用快捷键 (二)</a></p>");

    $("#tank_csharp").append("<p id=\"tank_ref_title\">附： C# 使用技巧 (连载中, 敬请期待）</p>" +
    "<p><a href=\"http://www.cnblogs.com/TankXiao/archive/2013/06/10/3130820.html\" target=\"_blank\"> C# 技巧(1) C# 转换时间戳</a></p>" +
    "<p><a href=\"http://www.cnblogs.com/TankXiao/p/3637495.html\" target=\"_blank\"> C# 技巧(2) C# 操作 JSON</a></p>");


    $("#tank_jmeter").append("<p id=\"tank_ref_title\">附： Jmeter教程 (连载中, 敬请期待）</p>" +
    "<p><a href=\"http://www.cnblogs.com/TankXiao/p/4045439.html\" target=\"_blank\"> Jmeter教程 入门教程</a></p>" +
    "<p><a href=\"http://www.cnblogs.com/TankXiao/p/4064289.html\" target=\"_blank\"> Jmeter教程 录制脚本</a></p>" +
	"<p><a href=\"http://www.cnblogs.com/TankXiao/p/4059378.html\" target=\"_blank\"> Jmeter教程 简单的压力测试</a></p>");



    $("#tank_selenium").append("<p id=\"tank_ref_title\">附： selenium java教程 (连载中, 敬请期待）</p>" +
    "<p><a href=\"http://www.cnblogs.com/TankXiao/p/5252754.html\" target=\"_blank\"> java selenium (一) selenium 介绍</a></p>" +
    "<p><a href=\"http://www.cnblogs.com/TankXiao/p/4110494.html\" target=\"_blank\"> java selenium (二) 环境搭建方法一</a></p>" +
    "<p><a href=\"http://www.cnblogs.com/TankXiao/p/4142070.html\" target=\"_blank\"> java selenium (三) 环境搭建 基于Maven</a></p>" +
    "<p><a href=\"http://www.cnblogs.com/TankXiao/p/5211759.html\" target=\"_blank\"> java selenium (四) 使用浏览器调试工具</a></p>" +
    "<p><a href=\"http://www.cnblogs.com/TankXiao/p/5222238.html\" target=\"_blank\"> java selenium (五) 元素定位大全</a></p>" +
    "<p><a href=\"http://www.cnblogs.com/TankXiao/p/5253072.html\" target=\"_blank\"> java selenium (六) xpath 定位</a></p>" +
    "<p><a href=\"http://www.cnblogs.com/TankXiao/p/5260683.html\" target=\"_blank\"> java selenium (七) CSS 定位</a></p>" +
    "<p><a href=\"http://www.cnblogs.com/TankXiao/p/4140543.html\" target=\"_blank\"> java selenium (八) Selenium IDE 用法</a></p>" +
    "<p><a href=\"http://www.cnblogs.com/TankXiao/p/5258104.html\" target=\"_blank\"> java selenium (九) 常见web UI 元素操作 及API使用</a></p>" +
    "<p><a href=\"http://www.cnblogs.com/TankXiao/p/5260557.html\" target=\"_blank\"> java selenium (十) 操作浏览器</a></p>" +
    "<p><a href=\"http://www.cnblogs.com/TankXiao/p/5260445.html\" target=\"_blank\"> java selenium (十一) 操作弹出对话框</a></p>" +
    "<p><a href=\"http://www.cnblogs.com/TankXiao/p/5260707.html\" target=\"_blank\"> java selenium (十二) 操作弹出窗口</a></p>" +
    "<p><a href=\"http://www.cnblogs.com/TankXiao/p/5246557.html\" target=\"_blank\"> java selenium (十三) 智能等待页面加载完成</a></p>" +
    "<p><a href=\"http://www.cnblogs.com/TankXiao/p/5237189.html\" target=\"_blank\"> java selenium (十四) 处理Iframe 中的元素</a></p>" +

    "<p><a href=\"http://www.cnblogs.com/TankXiao/p/4142070.html\" target=\"_blank\"> 未完待续</a></p>");


    $("#tank_hupai").append("<p id=\"tank_ref_title\">沪牌攻略</p>" +
    "<p><a href=\"http://www.cnblogs.com/TankXiao/p/6659604.html\" target=\"_blank\"> 小坦克 沪牌代拍 包中 不中赔1000</a></p>" +
    "<p><a href=\"http://www.cnblogs.com/TankXiao/p/6664277.html\" target=\"_blank\"> 2017 上海车牌（沪牌）标书购买攻略</a></p>" +
    "<p><a href=\"http://www.cnblogs.com/TankXiao/p/6664303.html\" target=\"_blank\"> 2017 沪牌中标后流程</a></p>" +
    "<p><a href=\"http://www.cnblogs.com/TankXiao/p/6388654.html\" target=\"_blank\"> 2017年 外牌转沪牌 攻略 (沪南路车管所)</a></p>");


    // this is for site
    //$.get("http://521test.com", function () {


   // });

    // this is for menu
    // get h1 tag
    var $allH1 = $("h1[id=tank_h1]");
    var allH1Len = $allH1.length;
    // get href name
    var $allH1A = $("a[name]");
    var allH1ALen = $allH1A.length;

    var menuHtml = "";

    for (var i = 0; i < allH1Len; i++) {
        var Oneh1 = $allH1[i].innerHTML;
        var name = $allH1A[i + 1].attributes["name"].value;

        var oneLine = "<li><a href=\"#"+name+"\">" + Oneh1 + "</a></li>";
        menuHtml = menuHtml + oneLine;
    }

    $("#tank_menu").append("<ol>"+ menuHtml+ "</ol>");



};


/*
//$(document).ready(function() {
		
// 禁止右键
//$(document).bind("contextmenu", function(){return  false;});
// 禁止选择
// $(document).bind("selectstart", function(){return  false;});
// 禁止Ctrl+C 和Ctrl+A
//$(document).keydown(function(event) {
                        
//  if ((event.ctrlKey&&event.which==67) || (event.ctrlKey&&event.which==86))
//{
//alert("对不起,版权所有,禁止复制");
//  return false;
//}
                
//});
//});
*/