#!/usr/bin/env node

var config = require('./deploy')();
var fs = require("fs");
var spawn = require('child_process').spawn;

var cdn = "https://o0vslv5hc.qnssl.com/";
var bucket = "yaotv";

var args = process.argv.splice(2);
var file = "";

if (args.length == 0) {
    help();
    return false;
}

if (args[0] == "all") {
    console.log("功能暂未开发~");
} else if (args[0] == "-h") {
    help();
    return false;
} else if (args[0] == "-r") {
    if (fs.lstatSync(args[1]).isDirectory()) {
        flushDir(args[1]);
    } else {
        help();
        return false;
    }
} else {
    flushFile(args[0]);
}

/**
 * 帮助提示
 * @return {[type]} [description]
 */
function help() {
    console.log("使用方法：\n\t当个文件：./flush.js filename\n\t指定目录：./flush.js -r dirname");
}

/**
 * 数组去重
 * @param  {[type]} arr [description]
 * @return {[type]}     [description]
 */
function uniq(arr) {
    var n = {},
        r = []; //n为hash表，r为临时数组
    for (var i = 0; i < arr.length; i++) //遍历当前数组
    {
        if (!n[arr[i]]) //如果hash表中没有当前项
        {
            n[arr[i]] = true; //存入hash表
            r.push(arr[i]); //把当前数组的当前项push到临时数组里面
        }
    }
    return r;
}

/**
 * 判断元素是否在数组中
 * @param  {[type]} needle [description]
 * @param  {[type]} array  [description]
 * @param  {[type]} bool   [description]
 * @return {[type]}        [description]
 */
function in_array(needle, array, bool) {
    if (typeof needle == "string" || typeof needle == "number") {
        var len = array.length;
        for (var i = 0; i < len; i++) {
            if (needle === array[i]) {
                if (typeof bool != "undefined") {
                    return i;
                }
                return true;
            }
        }
        return false;
    }
}

/**
 * 刷新目录
 * @param  {[type]} dir [description]
 * @return {[type]}     [description]
 */
function flushDir(dir) {
    fs.readdirSync(dir).forEach(function(file, index) {
        var curPath = dir + "/" + file;
        console.log(curPath);
        if (fs.lstatSync(curPath).isDirectory()) { // recurse
            flushDir(curPath);
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
    var filename = file.replace(/(.+)[＼＼/]/, "");
    var ext = filename.substr(filename.lastIndexOf(".")).toLowerCase();

    var filetypes = ['.js', '.css', '.woff', '.png', '.jpg', '.gif'];

    if (typeof config.filetypes != "undefined") {
        filetypes = uniq(filetypes.concat(config.filetypes));
    }

    if (in_array(ext, filetypes)) {
        var loc = file;
        var filePath = config.baseDir + file.replace("../", "");

        //qrsctl del ${BUCKET} ${KEYPREFIX}$file
        var del = spawn('qrsctl', ['del', bucket, filePath]);
        del.on('exit', function(code, signal) {
            console.log("qrsctl del " + bucket + " " + filePath);
            console.log("删除七牛" + code + "  " + signal);
            // console.log("- 删除:" + file);
            //qrsctl put ${BUCKET} ${KEYPREFIX}$file $DATADIR$file
            console.log("qrsctl put " + bucket + " " + filePath + " " + loc);
            var put = spawn('qrsctl', ['put', bucket, filePath, loc]);
            put.on('exit', function(code, signal) {
                console.log("上传七牛" + code + "  " + signal);
                // console.log("+ 上传:" + file);
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
    } else {
        console.log("此文件类型不需要上传吧，如果需要请手动传(" + file + ")");
    }
}
