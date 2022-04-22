import { setToken, removeToken } from '@/util/auth'
import { setStore, getStore } from '@/util/store'
import { isURL } from '@/util/validate'
import { deepClone } from '@/util/util'
import webiste from '@/const/website'
import { loginByCas, getUserInfo, getMenu, logout, getMenuAll, getUserList, getKaptcha, getSystemOperate, getUserOperate } from '@/api/user'


function addPath(ele, first) {
    const propsConfig = webiste.menu.props;
    const propsDefault = {
        label: propsConfig.label || 'label',
        path: propsConfig.path || 'path',
        icon: propsConfig.icon || 'icon',
        children: propsConfig.children || 'children'
    }
    const isChild = ele[propsDefault.children] && ele[propsDefault.children].length !== 0;
    if (!isChild && first) {
        if (!isURL(ele[propsDefault.path])){
            ele[propsDefault.path] = ele[propsDefault.path] + '/index'
        }
        return
    }
    ele[propsDefault.children].forEach(child => {
        if (!isURL(child[propsDefault.path])) {
            child[propsDefault.path] = `${ele[propsDefault.path]}/${child[propsDefault.path]?child[propsDefault.path]:'index'}`
            child[propsDefault.path] = child[propsDefault.path].replace(/\/\//g,'/')
        }
        addPath(child);
    })
}
const user = {
    state: {
        userInfo: {},
        permission: {},
        roles: [],
        menu: getStore({ name: 'menu' }) || [],
        menuAll: [],
        token: getStore({ name: 'token' }) || '',
        systemOperate: [],
        userOperate: [],
        extras: getStore({ name: 'extras' }) || {},
    },
    actions: {
        // CAS登录
        LoginByCAS({ commit }, url) {
            return new Promise((resolve, reject) => {
                loginByCas(url).then(res => {
                    const data = res.data.data;
                    commit('SET_TOKEN', data);
                    commit('DEL_ALL_TAG');
                    commit('CLEAR_LOCK');
                    setToken(data);
                    resolve();
                }).catch(err => {
                    reject(err);
                })
            })
        },
        GetUserInfo({ commit }) {
            return new Promise((resolve, reject) => {
                getUserInfo().then((res) => {
                    const data = res.data.data;
                    commit('SET_USERIFNO', data.userInfo);
                    commit('SET_ROLES', data.roles);
                    commit('SET_PERMISSION', data.permission);
                    commit('SET_EXTRAS', {appId: data.appId, accessToken: data.accessToken})
                    resolve(data);
                }).catch(err => {
                    console.error(err);
                    reject(err);
                })
            })
        },
        //刷新token
        RefreshToken({ commit }) {
            return new Promise((resolve, reject) => {
                resolve(true);
            })
        },
        // 登出
        LogOut({ commit }) {
            return new Promise((resolve, reject) => {
                logout().then(() => {
                    commit('SET_TOKEN', '')
                    commit('SET_MENU', [])
                    commit('SET_ROLES', [])
                    commit('DEL_ALL_TAG');
                    commit('CLEAR_LOCK');
                    removeToken()
                    resolve()
                }).catch(error => {
                    reject(error)
                })
            })
        },
        //注销session
        FedLogOut({ commit }) {
            return new Promise(resolve => {
                commit('SET_TOKEN', '')
                commit('SET_MENU', [])
                commit('SET_ROLES', [])
                commit('DEL_ALL_TAG');
                commit('CLEAR_LOCK');
                removeToken()
                resolve()
            })
        },
        //获取系统菜单
        async GetMenu({ dispatch }) {
            await dispatch("GetSystemOperate");
            await dispatch("GetUserOperate");
            return await dispatch("GetUserMenu");
        },
        GetUserMenu({ commit }, parentId) {
            return new Promise(resolve => {
                getMenu(parentId).then((res) => {
                    const data = res.data.data
                    let menu = deepClone(data);
                    menu.forEach(ele => {
                        debugger
                        addPath(ele, true);
                    })
                    commit('SET_MENU', menu)
                    resolve(menu)
                })
            })
        },
        async GetSystemOperate({commit }) {
            return new Promise(resolve => {
                getSystemOperate().then((res) => {
                    const data = res.data.data;
                    commit('SET_SYSTEM_OPERATE', data)
                    resolve()
                })
            })
        },
        async GetUserOperate({commit}) {
            return new Promise(resolve => {
                getUserOperate().then((res) => {
                    const data = res.data.data;
                    commit('SET_USER_OPERATE', data)
                    resolve()
                })
            })
        },
    },
    mutations: {
        SET_TOKEN: (state, token) => {
            state.token = token;
            setStore({ name: 'token', content: state.token, type: 'session' })
        },
        SET_USERIFNO: (state, userInfo) => {
            state.userInfo = userInfo;
        },
        SET_MENU: (state, menu) => {
            state.menu = menu
            setStore({ name: 'menu', content: state.menu, type: 'session' })
        },
        SET_MENU_ALL: (state, menuAll) => {
            state.menuAll = menuAll;
        },
        SET_ROLES: (state, roles) => {
            state.roles = roles;
        },
        SET_PERMISSION: (state, permission) => {
            state.permission = {};
            permission.forEach(ele => {
                state.permission[ele] = true;
            });
        },
        SET_SYSTEM_OPERATE: (state, systemOperate) => {
            state.systemOperate = systemOperate
            setStore({ name: 'systemOperate', content: state.systemOperate, type: 'session' })
        },
        SET_USER_OPERATE: (state, userOperate) => {
            state.userOperate = userOperate
            setStore({ name: 'userOperate', content: state.userOperate, type: 'session' })
        },
        SET_EXTRAS: (state, extras) => {
            state.extras = extras
            setStore({ name: 'extras', content: state.extras, type: 'session' })
        }
    }

}
export default user