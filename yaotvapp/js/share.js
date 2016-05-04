var aopenid = $.getVar("aopenid");
var openid = $.getVar("openid");
if(aopenid) {
    if(!openid) {
        //朋友圈点击进来，使用info授权
        util.mpAuthorize(config.mp.appcode, util.getMainUrl() + "?aopenid=" + aopenid);
    }
    //授权成功进入助力页面
} else {
    util.redirect("index.html");
}

//设置主框架
var wrapper = '分享页面';

$(".wrapper").empty().append($.renderTpl(wrapper, { cdn: config.cdn, link: config.link }));
//载入首页数据
$(".loader").show();

$(function() {
    $(".loader").hide();

    util.shareInit($.getVar("openid"));
});
