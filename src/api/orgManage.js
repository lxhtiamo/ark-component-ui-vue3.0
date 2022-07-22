import request from '@/router/axios';
import {componentPrefix} from '@/config/env';

const serviceName = componentPrefix
export const subUrl = "/sys-org/";

/*-------------------------------------------------------------------*/
// POST /sys-org/add
// 新增
export const add = (parameter) => request({
    url: serviceName + subUrl + 'add',
    method: 'post',
    data: parameter,
});

/*编辑*/
export const edit = (parameter) => request({
    url: serviceName + subUrl + 'edit',
    method: 'post',
    data: parameter,
});

// /types-comm/delete
// 批量删除
export const batchDeletion = (parameter) => request({
    url: serviceName + subUrl + 'delete',
    method: 'post',
    data: parameter,
});
export const getCommTypeByPunid = (punid, name) => request({
    url: serviceName + '/sys-org/findList',
    method: 'get',
    params: {
        punid: punid ? punid : '',
        name: name ? name : ''
    }
});

export const resetSerialNumber = (parameter) => request({
    url: serviceName + subUrl + 'resetSerialNumber',
    method: 'get',
    params: parameter,
});
