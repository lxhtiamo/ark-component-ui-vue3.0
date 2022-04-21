// 配置编译环境和线上环境之间的切换
let baseUrl = '';
// 组件的url前缀，dubbo版本是为空，springcloud版本时为对应的system模块
let componentPrefix = '';
// 单点登录地址
let casUrl = '';
// cas登录方式，portalwork：工作门户，idaas：统一身份认证
let casLoginType = 'portalwork';
let iconfontVersion = [];
let iconfontUrl = `//at.alicdn.com/t/font_$key.css`;
// 验证码类型, text：取验证码值返回到前端，pic：取验证码图片
let codeType = 'text';
const env = process.env
if (env.NODE_ENV == 'development') {
    baseUrl = `http://localhost:9001/demo-business`; // 开发环境地址
    if (casLoginType == 'portalwork') {
        casUrl = `http://10.230.4.92:9011/hyportalwork/#/casLogin2`;
    } else {
        casUrl = `http://218.104.238.200:11898/idaas-merge/sso`;
    }
    baseUrl =`http://192.168.81.29:9001/baseinformation-business`; // 开发环境地址
    casUrl = `http://218.104.238.200:11898/portalwork/#/casLogin2`;
} else if (env.NODE_ENV == 'production') {
    baseUrl = ``; //生产环境地址，若置空时根据浏览器地址生成后端地址
    casUrl = ``;
} else if (env.NODE_ENV == 'test') {
    baseUrl = ``; //测试环境地址
    casUrl = ``;
}

// 若baseUrl为空时，根据浏览器地址生成后端地址
if (baseUrl.length == 0) {
    baseUrl = window.location.protocol + "//" + window.location.host + "/vue-business"
}
// 若casUrl为空时，根据浏览器地址生成后端地址
if (casUrl.length == 0) {
    if (casLoginType == 'portalwork') {
        casUrl = window.location.protocol + "//" + window.location.host + "/hyportalwork/#/casLogin2"
    } else {
        casUrl = window.location.protocol + "//" + window.location.host + "/sso"
    }
}

// 验证码图片地址
let codeUrl = `${baseUrl}/kaptchaPic`;
export {
    baseUrl,
    componentPrefix,
    casUrl,
    casLoginType,
    iconfontUrl,
    iconfontVersion,
    codeType,
    codeUrl,
    env
}