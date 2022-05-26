//let CompressionPlugin = require('compression-webpack-plugin');
// 基础路径 注意发布之前要先修改这里
let baseUrl = '/'
let path = require("path");
let fs = require('fs');
let loaderFile = path.resolve(__dirname, "./src/util/loader.js");
fs.utimes(loaderFile, new Date(), new Date(), (err) => {
    if (err)
        console.error("更新文件失败：", err);
})
module.exports = {
    publicPath: baseUrl,// 基本路径
    outputDir: 'dist', // 输出文件目录
    assetsDir: 'assets',
    //lintOnSave: false,
    lintOnSave: true,//eslint-loader 是否在保存的时候检查
    devServer: {
        publicPath: baseUrl // 和 baseUrl 保持一致
    },
    productionSourceMap: false,
    chainWebpack: (config) => {
        config.resolve.symlinks(true) //热更新

        const entry = config.entry('app')
        entry
            .add('babel-polyfill')
            .end()
        entry
            .add('classlist-polyfill')
            .end()
    },
    configureWebpack: config => {
        let optimization = {//将依赖包拆分
            runtimeChunk: 'single',
            splitChunks: {
                chunks: 'all',
                maxInitialRequests: Infinity,
                minSize: 1638400, // 依赖包超过20000bit(2kb)将被单独打包 1638400bit(200k)
                cacheGroups: {
                    vendor: {
                        test: /[\\/]node_modules[\\/]/,
                        name(module) {
                            const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1]
                            return `npm.${packageName.replace('@', '')}`
                        }
                    }
                }
            }
        }
        Object.assign(config, {
            optimization
        });
        /*config.plugins.push(
            new CompressionPlugin({
                test:/\.(js|css)(\?.*)?$/i,//需要压缩的正则
                threshold: 10240,//文件大小大于这个值时启用压缩
                deleteOriginalAssets: false//压缩后保留原文件
            })
        );*/

        config.module.rules.push({
            //匹配js css vue为后缀的文件
            test:/\.(js|css|vue)$/,
            //开启前置loader
            enforce: 'pre',
            //使用自定义的loader  需要使用绝对路径
            loader: loaderFile,
            options: {
                //文件映射数组
               // matchFiles: matchFiles
            }
        });
    },
}
