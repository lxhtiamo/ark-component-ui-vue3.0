import request from '@/router/axios';
import {componentPrefix} from '@/config/env';

const serviceName = componentPrefix

//获取列表
export const findList = (params) => request({
    url: serviceName + '/sys-org/findList',
    method: 'get',
    params: params
});


//查询组织机构表列表 --公用
export const findOrgList = (params) => request({
    url: serviceName + '/public/findOrgList',
    method: 'get',
    params: params
});