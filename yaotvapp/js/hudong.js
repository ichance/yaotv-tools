//设置主框架
var wrapper = '互动\
        ';

$(".wrapper").empty().append($.renderTpl(wrapper, { cdn: config.cdn }));
//载入首页数据
$(".loader").show();

$(function() {
    $(".loader").hide();

    util.shareInit($.getVar("openid"));
});
