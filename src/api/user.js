import request from '@/router/axios';

export const loginByUsername = (username, password, code, randomStr) => request({
    url: '/login',
    method: 'post',
    data: {
        username,
        password,
        code,
        randomStr
    }
})

export const getSystemDic = () => request({
    url: '/dic',
    method: 'get',
    params: {}
})

export const getUserInfo = () => request({
    url: '/getUserInfo',
    method: 'get',
    params: {}
});

export const getUserList = () => request({
    url: '/test/user/list',
    method: 'get',
    params: {}
});

export const getKaptcha = () => request({
    url: '/kaptcha',
    method: 'get',
    params: {}
});

export const getMenu = () => request({
    url: '/getMenu',
    method: 'get',
    params: {}
});

export const getMenuAll = () => request({
    url: '/getMenu',
    method: 'get',
    params: {
        type: 0
    }
});

export const getTableData = (page) => request({
    url: '/user/list',
    method: 'get',
    params: page
});

export const logout = () => request({
    url: '/logout',
    method: 'get'
});

export const getIdaasAppCode = () => request({
    url: '/getIdaasAppCode',
    method: 'get',
    params: {}
});

export const loginByCas = (url) => request({
    url: url,
    method: 'get'
});

export const getSystemOperate = () => request({
    url: '/getSystemOperate',
    method: 'get',
    params: {}
});

export const getUserOperate = () => request({
    url: '/getUserOperate',
    method: 'get',
    params: {}
});

export const getAppInfoByAppCode = () => request({
    url: '/getAppInfoByAppCode',
    method: 'get',
    params: {}
});

export const getLicenseInfo = () => request({
    url: '/getLicenseInfo',
    method: 'get',
    params: {}
});