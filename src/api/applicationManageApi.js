import request from '@/router/axios';
import {componentPrefix} from '@/config/env';

const serviceName = componentPrefix


/************资源管理********************/

/************资源管理********************/


/************角色管理********************/



//列表
export const role_findPage = (params) => request({
    url: serviceName + '/ent-app-role/findAppRoleList',
    method: 'get',
    params: params
});
//新增
export const role_addItem = (data) => request({
    url: serviceName + '/ent-app-role/add',
    method: 'post',
    data: data
});

//编辑
export const role_editItem = (data) => request({
    url: serviceName + '/ent-app-role/edit',
    method: 'post',
    data: data
});

//删除
export const role_delItem = (data) => request({
    url: serviceName + '/ent-app-role/delete',
    method: 'post',
    data: data
});

//详情
export const role_detail = (params) => request({
    url: serviceName + '/ent-app-role/findByUnid',
    method: 'get',
    params: params
});


/************角色管理********************/



//查询角色授权的机构列表
export const findMidRoleOrgList = (params) => request({
    url: serviceName + '/sys-role/findMidRoleOrgList',
    method: 'get',
    params: params
});


//查询组织机构表列表
export const findOrgList = (params) => request({
    url: serviceName + '/sys-role/findOrgList',
    method: 'get',
    params: params
});

//保存角色授权机构
export const saveRoleOrg = (data) => request({
    url: serviceName + '/sys-role/saveRoleOrg',
    method: 'post',
    data: data
});



