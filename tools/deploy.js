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
		"filetypes":[],			//支持上传七牛的文件类型
		"files":[
			{
				"tpl":"index.html",	//模板名
				"files":["index.html", "hudong.html", "end.html", "share.html"],	//模板对应的文件列表
			},
			{
				"tpl":"login.html",
				"files":["login.html"],
			}
		]	//需要生成的文件列表
	};
};

