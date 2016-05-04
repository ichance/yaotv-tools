#!/usr/bin/env node
var config = require('./deploy')();
var fs = require("fs");
var spawn = require('child_process').spawn;

var cdn = "https://o0vslv5hc.qnssl.com/";
var bucket = "yaotv";

var args = process.argv.splice(2);
var file = "";

if(args.length == 0) {
    help();
    return false;
}

if (args[0] == "all") {
    console.log("功能暂未开发~");
} else if (args[0] == "-h") {
    help();
    return false;
} else {
    // if(fs.lstatSync("../" + args[0]).isDirectory()) {
    //     flushDir("../" + args[0], args[1]);
    // } else {
        flushFile(args[0]);
    // }
}

function help() {
    console.log("使用方法：\n\t默认：./flush.js filename\n\tall：./flush.js all");
}

/**
 * 刷新目录
 * @param  {[type]} dir [description]
 * @return {[type]}     [description]
 */
function flushDir(dir, recurse) {
    fs.readdirSync(dir).forEach(function(file, index) {
        var curPath = dir + "/" + file;

        if(typeof recurse != "undefined") {
            if (fs.lstatSync(curPath).isDirectory()) { // recurse
                flushDir(curPath, recurse);
            } else {
                flushFile(curPath);
            }
        } else {
            flushFile(curPath);
        }
    });
}

/**
 * 刷新文件
 * @param  {[type]} file [description]
 * @return {[type]}      [description]
 */
function flushFile(file) {
    var filename = file.replace(/(.+)[＼＼/]/,"");
    var ext = filename.substr(filename.lastIndexOf("."));
    
    var loc = "../" + file;
    var filePath = config.baseDir + file;

    //qrsctl del ${BUCKET} ${KEYPREFIX}$file
    var del = spawn('qrsctl', ['del', bucket, filePath]);
    del.on('exit', function(code, signal) {
        console.log("qrsctl del " + bucket + " " + filePath);
        console.log("删除七牛" + code + "  " + signal);
        console.log("- 删除:" + file);
        //qrsctl put ${BUCKET} ${KEYPREFIX}$file $DATADIR$file
        console.log("qrsctl put " + bucket + " " + filePath + " " + loc);
        var put = spawn('qrsctl', ['put', bucket, filePath, loc]);
        put.on('exit', function(code, signal) {
            console.log("上传七牛" + code + "  " + signal);
            console.log("+ 上传:" + file);
        });

        put.stderr.on('data', function(error) {
            console.log("error" + JSON.stringify(error));
        });
    });

    del.stderr.on('data', function(error) {
        console.log("error" + JSON.stringify(error));
        res.end({
            error: error
        });
    });
}
