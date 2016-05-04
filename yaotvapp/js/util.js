/**
 * 公共函数
 * @author:stuart
 * @link:http://www.shizuwu.cn
 * @time:2015
 */
var _hmt = _hmt || [];
var _smghmt = _smghmt || [];
var _czc = _czc || [];
var util = {
    now: function(time) {
        var date = new Date();

        var currentdate = date.getFullYear() + "-" + this.fixTime(date.getMonth() + 1) + "-" + this.fixTime(date.getDate());

        if (typeof time != "undefined") {
            currentdate += " " + this.fixTime(date.getHours()) + ":" + this.fixTime(date.getMinutes()) + ":" + this.fixTime(date.getSeconds());
        }
        return currentdate;
    },
    timestamp: function(date) {
        return Date.parse(date.replace(/-/g, "/"));
    },
    checkTime: function(time) {
        var wholeTime = this.now() + " " + time + ":00";
        return this.timestamp(wholeTime) > this.timestamp(this.now(1));
    },
    fixTime: function(i) {
        if (i < 10) {
            i = "0" + i;
        }
        return i;
    },
    print: function(msg) {
        console.log(msg);
    },
    /**
     * 封装统计方法
     * @param  {[type]} category [description]
     * @param  {[type]} action   [description]
     * @param  {[type]} label    [description]
     * @param  {[type]} attr     [description]
     * @return {[type]}          [description]
     */
    tj: function(category, action, label, attr) {
        if (typeof attr == "undefined") {
            attr = "default";
        }
        if (typeof _hmt != "undefined") {
            _hmt.push(['_trackEvent', category, action, label, attr, '1']);
        }
    },
    track: function(channelId, id) {
        var hm = document.createElement("script");
        hm.src = "//hm.baidu.com/hm.js?" + config.tjid[channelId - 1];
        if (typeof id != "undefined") {
            hm.id = id;
        } else {
            hm.id = 'bdtj';
        }
        if (!document.getElementById(hm.id)) {
            var s = document.getElementsByTagName("script")[0];
            s.parentNode.insertBefore(hm, s);
        }
    },
    smg:function(channelId, id) {
        var hm = document.createElement("script");
        hm.src = "//hm.baidu.com/hm.js?" + config.smg_tjid[channelId - 1];

        if(typeof id != "undefined") {
            hm.id = id;
        } else {
            hm.id = 'smg';
        }
        if(!document.getElementById(hm.id)) {
            var s = document.getElementsByTagName("script")[0];
            s.parentNode.insertBefore(hm, s);
        }
    },
    cnzz: function(channelId, id) {
        var cnzz = document.createElement("script");
        cnzz.src = "//s95.cnzz.com/z_stat.php?id=" + config.cnzztj[channelId - 1].zd + "&web_id=" + config.cnzztj[channelId - 1].id;
        if (typeof id != "undefined") {
            cnzz.id = id;
        } else {
            cnzz.id = 'cnzz';
        }

        var tpl = '<script type="text/javascript">var cnzz_protocol = (("https:" == document.location.protocol) ? " https://" : " http://");</script>';
        var cnzzicon = '<span style="display:none;" id="cnzz_stat_icon_' + config.cnzztj[channelId - 1].id + '"></span>';
        $("body").append(tpl);
        $("body").append(cnzzicon);

        if (!document.getElementById(cnzz.id)) {
            var s = document.getElementsByTagName("script")[0];
            s.parentNode.insertBefore(cnzz, s);
        }
    },
    redirect:function(url) {
        location.href = url;
    },
    parseUrl: function() {
        return location.search;
    },
    getMainUrl: function() {
        return window.location.href.split('?')[0];
    },
    getApi: function(url, sucHandler, errHandler) {
        $.ajax({
            url: url,
            cache: true,
            async: false,
            dataType: 'jsonp',
            jsonp: 'callback',
            jsonpCallback: 'callback',
            crossDomain: true,
            success: function(data) {
                sucHandler(data);
            },
            error: function(jqXHR, textStatus, errorThrown) {
                errHandler();
            }
        });
    },
    getData: function(url, sucHandler) {
        this.getApi(config.apiServer + url, sucHandler);
    },
    //公众号授权
    mpAuthorize: function(appcode, url) {
        window.location.href = config.oauthServerUrl + 'mpOauth.php?appcode=' + appcode + '&redirect_url=' + url;
    },
    //公众号隐授权
    mpShadowAuthorize: function(appcode, url) {
        window.location.href = config.oauthServerUrl + 'mpOauth.php?shadow=1&appcode=' + appcode + '&redirect_url=' + url;
    },
    //电视台授权
    tvAuthorize: function(appcode, url) {
        url = $.wyUtils.fillGz(url);
        window.location.href = config.oauthServerUrl + 'tvOauth.php?appcode=' + appcode + '&redirect_url=' + url;
    },
    //摇电视授权
    tvAuthorizeBack: function(appid, appcode, callback) {
        var returnObj = {};

        shaketv.authorize(appid, "userinfo", function(d) {
            if (d.errorCode !== 0) {
                //用户取消
                if (d.errorCode == -1001) {
                    returnObj.ret = 1;
                    returnObj.errorMsg = "用户取消";

                    callback(returnObj);
                } else if (d.errorCode == -1002) {
                    returnObj.ret = 2;
                    returnObj.errorMsg = "授权窗口打开超时";
                    callback(returnObj);
                } else {
                    returnObj.ret = 3;
                    returnObj.errorMsg = d.errorCode + ":" + d.errorMsg + " code:" + d.code;
                    callback(returnObj);
                }
            } else {
                $.ajaxGet(config.oauthServerUrl + "smg.php", {
                    code: d.code,
                    app: appcode
                }, function(data) {
                    if (data.status <= 0) {
                        returnObj.ret = 4;
                        returnObj.errorMsg = data.error;
                    } else {
                        returnObj.ret = 0;
                        returnObj.errorMsg = "";
                        returnObj.user = data.info;
                    }
                    callback(returnObj); //服务器回调
                });
            }
        });
    },
    shareInit:function (openid) {
        config.shareData.url = "https://yao.qq.com/tv/entry?redirect_uri=" + this.getMainUrl();

        if(typeof openid != "") {
            config.shareData.url = "https://yao.qq.com/tv/entry?redirect_uri=" + this.getMainUrl().replace(/index|jiangpin|yali|share/, "share") + "?aopenid=" + openid;
        }
        shaketv.wxShare(config.shareData.img,config.shareData.title,config.shareData.desc,config.shareData.url);
    }
};
