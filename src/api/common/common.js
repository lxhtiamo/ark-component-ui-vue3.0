import request from '@/router/axios';
import {componentPrefix} from '@/config/env';

const serviceName = componentPrefix

//根据字典属性获取列表
export const dict_findDictList = (dictType) => request({
    url: serviceName+'/common-dictionary/findDictList',
    method: 'get',
    params: {dictType: dictType}
});
export const modifyPwd = (password) => request({
    url: serviceName+'/public/modifyPwd',
    method: 'post',
    data: password
});