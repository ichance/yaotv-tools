/**
 * 
 * @author stuart
 * @link http://www.shizuwu.cn;
 * @create 2015-12-21
 */

//设置主框架
var indexContent = '<div class="index-box">\
                        首页\
                        <div class="onclk-liwu tk-liwu"></div>\
                    </div>';

$(".wrapper").empty().append($.renderTpl(indexContent, {cdn:config.cdn}));

$(".loader").show();

$(".copyright").hide();

$(function() {
    $(".loader").hide();
    $("#div_subscribe_area").show();
    shaketv.subscribe({
        appid: "wxb3bbf1b1758679b6",
        selector: "#div_subscribe_area",
        type: 1
    }, function (returnData) {
    });

    $(".wrapper").delegate(".tk-liwu","click",function(){
        util.mpShadowAuthorize(config.mp.appcode, util.getMainUrl().replace(/index/, "login"));
    });
});
