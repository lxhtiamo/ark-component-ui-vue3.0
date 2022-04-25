/**
 * 全站权限配置
 *
 */
import router from './router/index'
import store from './store'
import {validatenull} from '@/util/validate'
import {getToken, removeToken} from '@/util/auth'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import {getRedirectUri, saveRouteHash} from "@/util/util";
import {casUrl} from '@/config/env';
import {getStore, removeStore, setStore} from '@/util/store.js';

NProgress.configure({showSpinner: false});
const lockPage = store.getters.website.lockPage; //锁屏页
router.beforeEach((to, from, next) => {
    //缓冲设置
    if (to.meta.keepAlive === true && store.state.tags.tagList.some(ele => {
        return ele.value === to.fullPath;
    })) {
        to.meta.$keepAlive = true;
    } else {
        NProgress.start()
        if (to.meta.keepAlive === true && validatenull(to.meta.$keepAlive)) {
            to.meta.$keepAlive = true;
        } else {
            to.meta.$keepAlive = false;
        }
    }
    const meta = to.meta || {};
    /*next()
    return;*/
    // 解决登录多次跳转的问题
    if (meta.isAuth === false) {
        next()
        return;
    }

    if (getToken()) {
        if (store.getters.isLock && to.path != lockPage) { //如果系统激活锁屏，全部跳转到锁屏页
            next({path: lockPage})
        } else if (to.path === '/login') { //如果登录成功访问登录页跳转到主页
            next({path: '/'})
        } else {
            //如果用户信息为空则获取用户信息，获取用户信息失败，跳转到登录页
            if (store.getters.roles.length === 0) {
                store.dispatch('GetUserInfo').then(() => {
                    next({
                        path: to.path,
                        query: to.query,
                        params: to.params,
                        matched: to.matched,
                        fullPath: to.fullPath,
                        hash: to.hash,
                        meta: to.meta,
                        replace: true
                    })
                }).catch((err) => {
                    setStore({name: "failTo", content: to, type: 'session'});
                    removeToken()
                    if (err.status === 403) {
                        alert("您没有权限访问该系统");
                        store.dispatch("LogOut").then(() => {
                            let redirect_uri = getRedirectUri(window.location);
                            let url = casUrl + '/logout?service=' + redirect_uri;
                            location.replace(url);
                        });
                    }
                })
            } else {
                let value = to.query.src || to.fullPath;
                if (value.startsWith("http") && to.hash) {
                    value += to.hash;
                }
                const label = to.query.name || to.name;
                if (meta.isTab !== false && !validatenull(value) && !validatenull(label)) {
                    store.commit('ADD_TAG', {
                        label: label,
                        value: value,
                        params: to.params,
                        query: to.query,
                        group: router.$avueRouter.group || []
                    });
                    let failTo = getStore({name: 'failTo'});
                    if (failTo) {
                        removeStore({name: 'failTo'});
                        next(failTo.path)
                    } else {
                        next()
                    }
                } else {
                    saveRouteHash(value);
                    next({path: '/'})
                }
            }
        }
    } else {
        //判断是否需要认证，没有登录访问去登录页
        if (meta.isAuth === false) {
            next()
        } else {
            let value = to.fullPath;
            if (value.startsWith("http") && to.hash) {
                value += to.hash;
            }
            saveRouteHash(value);
            let vars = {};
            window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value) {
                value = value.split('#')[0];
                vars[key] = value;
            });
            if (vars['ticket'] && Object.keys(to.query).length > 0) {
                next('/login?ticket=' + vars['ticket']);
            } else {
                next('/login');
            }
        }
    }
})

router.afterEach((to, from) => {
    NProgress.done();
    const title = store.getters.tag.label;
    //根据当前的标签也获取label的值动态设置浏览器标题
    router.$avueRouter.setTitle(title);
    //console.log(to + from)
});