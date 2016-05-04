/**
 * 
 * @author stuart
 * @link http://www.shizuwu.cn;
 * @create 2015-12-21
 */

//设置主框架
var indexContent = '<div class="index-box">\
                        end\
                    </div>';

$(".wrapper").empty().append($.renderTpl(indexContent, {cdn:config.cdn}));

$(".loader").show();

$(".copyright").hide();

$(function() {
    $(".loader").hide();
});
