/**
 * 发布配置信息
 */
module.exports = function() {
    return {
    	"channelId":"",
    	"dir":"../deploy",		//生成目录
		"title":"测试模板",	//页面标题
		"cdn":"//o0vslv5hc.qnssl.com/",	//CDN
		"baseDir":"templates/",	//CDN 项目目录
		"files":[
			{
				"tpl":"index.html",
				"files":["index.html", "hudong.html", "end.html", "share.html"],
			},
			{
				"tpl":"login.html",
				"files":["login.html"],
			}
		]	//需要生成的文件列表
	};
};

