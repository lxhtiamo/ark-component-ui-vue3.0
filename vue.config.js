let CompressionPlugin = require('compression-webpack-plugin');
// 基础路径 注意发布之前要先修改这里
let baseUrl = './'
let path = require("path");
let fs = require('fs');
let loaderFile = path.resolve(__dirname, "node_modules/ir-component-ui/lib/loader.js");
fs.utimes(loaderFile, new Date(), new Date(), (err) => {
    if (err)
        console.error("更新文件失败：", err);
})
let matchFiles = require('./loaderConfig').map(item => {
    if (item.template) {
        item.template = path.resolve(__dirname, item.template)
    }
    if (item.target) {
        item.target = path.resolve(__dirname, item.target)
    }
    return item;
})
module.exports = {
    publicPath: baseUrl, // 根据你的实际情况更改这里
    lintOnSave: true,
    devServer: {
        publicPath: baseUrl // 和 baseUrl 保持一致
    },
    productionSourceMap: false,
    chainWebpack: (config) => {
        //忽略的打包文件
        config.externals({
            'vue': 'Vue',
            'vue-router': 'VueRouter',
            'vuex': 'Vuex',
            'axios': 'axios',
            'element-ui': 'ELEMENT',
        })
        const entry = config.entry('app')
        entry
            .add('babel-polyfill')
            .end()
        entry
            .add('classlist-polyfill')
            .end()
    },
    //========================================
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
                            // get the name. E.g. node_modules/packageName/not/this/part.js
                            // or node_modules/packageName
                            const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1]
                            // npm package names are URL-safe, but some servers don't like @ symbols
                            return `npm.${packageName.replace('@', '')}`
                        }
                    }
                }
            }
        }
        Object.assign(config, {
            optimization
        });
        config.plugins.push(
            new CompressionPlugin({
                test:/\.(js|css)(\?.*)?$/i,//需要压缩的正则
                threshold: 10240,//文件大小大于这个值时启用压缩
                deleteOriginalAssets: false//压缩后保留原文件
            })
        );

        config.module.rules.push({
            //匹配js css vue为后缀的文件
            test:/\.(js|css|vue)$/,
            //开启前置loader
            enforce: 'pre',
            //使用自定义的loader  需要使用绝对路径
            loader: loaderFile,
            options: {
                //文件映射数组
                matchFiles: matchFiles
            }
        });

        // config.plugins.push(
        //     new BundleAnalyzerPlugin(
        //         {
        //             analyzerMode: 'server',
        //             analyzerHost: '127.0.0.1',
        //             analyzerPort: 8889,
        //             reportFilename: 'report.html',
        //             defaultSizes: 'parsed',
        //             openAnalyzer: true,
        //             generateStatsFile: false,
        //             statsFilename: 'stats.json',
        //             statsOptions: null,
        //             logLevel: 'info'
        //         }
        //     )
        // );
    },
    transpileDependencies: ['avue-plugin-transfer', 'avue-plugin-ueditor'],
    //配置转发代理
    devServer: {
        // proxy: {
        //     '/api': {
        //         target: 'http://127.0.0.1:3000',
        //         ws: true,
        //         pathRewrite: {
        //             '^/api': '/api'
        //         }
        //     },
        // }
    }
}
