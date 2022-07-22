import request from '@/router/axios';
import {componentPrefix} from '@/config/env';

const serviceName = componentPrefix
export const remoteLogin = (page) => request({
    url: serviceName + '/remoteLogin',
    method: 'get',
    params: page
})

export const getTGTInfo = (data) => request({
    url: serviceName + '/getTGTInfo',
    method: 'post',
    data: data
})


export const captcha = () => request({
    url: serviceName + '/captcha',
    method: 'get'
})

export const captchaCheak = (page) => request({
    url: serviceName + '/captchaCheak',
    method: 'get',
    params: page
})


export const login = (data) => request({
    url: serviceName + '/login',
    method: 'post',
    data: data
})

export const judge = () => request({
    url: serviceName + '/login-judge',
    method: 'get'
})


export const logoutByCas = (page) => request({
    url: serviceName + 'logoutByCas',
    method: 'post',
    params: page
})

export const loginMaterial = (page) => request({
    url: serviceName + '/login-material',
    method: 'get',
    params: page
})
//登录页系统公告
export const loginNotice = (page) => request({
    url: serviceName + '/login-notice',
    method: 'get',
    params: page
})
export const getRandomCode = (page) => request({
    url: serviceName + '/getRandomCode',
    method: 'get',
    params: page
})

export const getUserMsg = (current, size) => request({
    url: serviceName + '/user/getNotice',
    method: 'get',
    params: {
        current: current || '',
        size: size || '',

    }
})
