import request from '@/router/axios';
import {componentPrefix} from '@/config/env';

const serviceName = componentPrefix
export const loginByUsername = (username, password, code, randomStr) => request({
    url: serviceName + '/login',
    method: 'post',
    data: {
        username,
        password,
        code,
        randomStr
    }
})

export const getUserInfo = () => request({
    url: serviceName + '/getUserInfo',
    method: 'get',
    params: {}
});

export const getMenu = () => request({
    url: serviceName + '/getMenu',
    method: 'get',
    params: {}
});

export const logout = () => request({
    url: serviceName + '/logout',
    method: 'get'
});

export const getIdaasAppCode = () => request({
    url: serviceName + '/getIdaasAppCode',
    method: 'get',
    params: {}
});

export const loginByCas = (url) => request({
    url: serviceName + url,
    method: 'get'
});

export const getSystemOperate = () => request({
    url: serviceName + '/getSystemOperate',
    method: 'get',
    params: {}
});

export const getUserOperate = () => request({
    url: serviceName + '/getUserOperate',
    method: 'get',
    params: {}
});

export const getAppInfoByAppCode = () => request({
    url: serviceName + '/getAppInfoByAppCode',
    method: 'get',
    params: {}
});

export const getLicenseInfo = () => request({
    url: serviceName + '/getLicenseInfo',
    method: 'get',
    params: {}
});