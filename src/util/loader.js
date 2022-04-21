let fs = require('fs');
let loaderUtils = require('loader-utils');
module.exports = function (source) {
    let callback = this.async()
    //取得options中的文件匹配列表
    let matchFiles = loaderUtils.getOptions(this).matchFiles
    if (!matchFiles || matchFiles.length == 0) {
        callback(null, source)
        return
    }
    let doCallback = false
    matchFiles.forEach(item => {
        //判断当前资源路径是否和配置路径一致
        if (this.resourcePath == item.target) {
            //一致则替换该资源内容
            if (!doCallback) {
                doCallback = true
                fs.readFile(item.template, 'utf-8', (err, data) => {
                    callback(err, data)
                })
            }
        } else if (this.resourcePath == item.template) {
            // 触发编译产品的资源文件
            if (item.target) {
                fs.utimes(item.target, new Date(), new Date(), (err) => {
                    if (err)
                        console.error(err)
                })
            }
            if (!doCallback) {
                doCallback = true
                callback(null, '')
            }
        }
    })
    if (!doCallback) {
        callback(null, source)
    }
}