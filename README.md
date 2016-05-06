# yaotv-tools
摇电视项目工具

## 环境

需预先安装[ejs](http://ejs.co/)

```bash
npm install ejs
```

然后复制项目代码到本地:

```bash
mkdir yaotvapp
cd yaotvapp
git clone https://github.com/jShi-git/yaotv-tools
```

## 工具命令
```bash
cd tools
./build.js    //生成默认页面
./flush.js ../js/index.js    //同步到七牛
./flush.js -r ../js    //同步目录到七牛
```

## 效果预览
![buid.png](http://ww4.sinaimg.cn/large/68574fffgw1f3j4fahh0wj20dx03gdgg.jpg)

![flush.png](http://ww1.sinaimg.cn/large/68574fffgw1f3j4fsjwkxj20e603ywff.jpg)


## TODO LIST
- [x] 批量同步七牛