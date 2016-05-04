$(function() {
	var cdn = config.cdn + "js/";
    var v = new Date();
    var page = location.pathname.replace(/(.+)[＼＼/]/,"");
    page = page.substr(0, page.lastIndexOf("."));

    if(page == "") {
        page = "index";
    }

	//公共文件列表
    var commonFileList = [cdn +"util.js"];
    //扩展配置
    var extendsFile = {
    	"hudong":[cdn +"TweenMax.min.js"]
    };

    //植入对应页面的扩展文件列表
    if(typeof extendsFile[page] != "undefined") {
        commonFileList = commonFileList.concat(extendsFile[page]);
    }

    loadScript.load(commonFileList, "nocache").done(function() {
    	util.track(channelId);
		util.smg(channelId);
		util.cnzz(channelId);

		util.shareInit();
		
		$.insertJs(cdn + page + ".js?v=" + v);
	});
});