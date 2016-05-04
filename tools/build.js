#!/usr/bin/env node

var config = require('./deploy')();
var fs = require("fs");

var ejs = require("ejs");

var args = process.argv.splice(2);

//生成目录
if (!fs.existsSync(config.dir)) {
	fs.mkdirSync(config.dir);
} else {
    fs.readdirSync(config.dir).forEach(function(file, index) {
        var curPath = config.dir + "/" + file;
        fs.unlinkSync(curPath);
    });
}

if (args[0] == "smg") {
    if (args[1]) {
        config.channelId = args[1];
    }
} else if (args[0] == "-h") {
    console.log("使用方法：\n\t默认：./build.js\n\tsmg：./build.js smg 1");
    return false;
}

config.cdn = config.cdn + config.baseDir;

//循环文件列表，生成正式文件
config.files.forEach(function(template) {
    ejs.renderFile(template.tpl, config, {}, function(err, str) {
        template.files.forEach(function(file) {
            fs.writeFile(config.dir + "/" + file, str, function(err) {
                if (err) {
                    console.log("错误:" + file);
                }
                console.log("生成了:" + file);
            });
        });
    });
});
