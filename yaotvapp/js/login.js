$(function(){
    var openid = $.getVar("openid");
    if(openid) {
        util.tvAuthorizeBack(config.chatApp.appid[channelId - 1], config.chatApp.appcode[channelId - 1], function(data) {
            authdata = data;
            if (authdata.ret === 0) {
                //提交用户数据到接口
                $.ajaxGet("https://yaotvuser.bj116.com/yaotv/log/loguser.php", {
                    openid:openid,
                    tvopenid:authdata.user.openid,
                    projectid:config.projectid,
                    nickname:authdata.user.nickname,
                    headimgurl:authdata.user.headimgurl,
                    country:authdata.user.country,
                    city:authdata.user.city,
                    province:authdata.user.province,
                    sex:authdata.user.sex,
                    from:"ajax"
                }, function(data) {
                    console.log(data);
                });
                //判断活动和用户有效
                $.ajaxGet(config.oauthServerUrl + "smginit.php", {
                    "openid": authdata.user.openid,
                    "app": config.chatApp.appcode[channelId - 1],
                    "type":"smg"
                }, function(data) {
                    if (data.status == -1 || data.status == 2) {
                        util.redirect("hudong.html?openid=" + openid);
                    } else if(data.status === 0) {
                        util.redirect = "end.html";
                    } else {
                        util.redirect("hudong.html?ive_id=" + $.getVar("live_id") + "&openid=" + openid + "&headimgurl=" + authdata.user.headimgurl + "/64&nickname=" + authdata.user.nickname + "&key=" + authdata.user.key);
                    }
                });
            } else {
                util.redirect("hudong.html?openid=" + openid);
            }
        });
    } else {
    	util.redirect("index.html");
    }
});