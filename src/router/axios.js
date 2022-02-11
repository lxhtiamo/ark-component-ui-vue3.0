/**
 * 全站http配置
 *
 * header参数说明
 * serialize是否开启form表单提交
 * isToken是否需要token
 */
import axios from 'axios'
import store from '@/store/';
import router from '@/router/router'
import { Message } from 'element-ui'
import website from '@/const/website';
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { baseUrl } from '@/config/env';
import {saveRouteHash} from "@/util/util";
axios.defaults.timeout = 10000;
axios.defaults.baseURL = baseUrl;
//返回其他状态吗
axios.defaults.validateStatus = function(status) {
    return status >= 200 && status <= 500; // 默认的
};
//跨域请求，允许保存cookie
axios.defaults.withCredentials = true;
// NProgress Configuration
NProgress.configure({
    showSpinner: false
});
//HTTP request拦截
axios.interceptors.request.use(config => {

    NProgress.start() // start progress bar
    return config
}, error => {
    return Promise.reject(error)
});
//HTTP response拦截
axios.interceptors.response.use(res => {
    NProgress.done();
    let status = Number(res.status) || 200;
    if (status == 200) {
        status = res.data.code;
    }
    const statusWhiteList = website.statusWhiteList || [];
    const message = res.data.msg || '未知错误';
    //如果是401则跳转到登录页面
    if (status === 401) {
        let value = window.location.href.split("#")[1];
        saveRouteHash(value);
        let vars = {};
        window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value) {
            value = value.split('#')[0];
            vars[key] = value;
        });
        let path;
        if (vars['ticket']) {
            path = '/login?ticket=' + vars['ticket'];
        } else {
            path = '/login'
        }
        store.dispatch('FedLogOut').then(() => router.push({path: path}));
        return Promise.reject(res);
    }

    //如果请求为200则放过，否者默认统一处理,或者在website中配置statusWhiteList白名单自行处理
    if (status !== 200 && !statusWhiteList.includes(status)) {
        Message({
            message: message,
            type: 'error'
        })
        return Promise.reject(new Error(message))
    }

    // 如果是白名单类型放入catch自行处理
    if (status !== 200) return Promise.reject(res);
    return res;
}, error => {
    console.log(error);
    NProgress.done();
    return Promise.reject(new Error(error));
})

export default axios;