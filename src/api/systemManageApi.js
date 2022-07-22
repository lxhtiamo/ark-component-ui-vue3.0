import request from '@/router/axios';
import {componentPrefix} from '@/config/env';

const serviceName = componentPrefix

/************用户列表接口********************/
//列表
export const user_findPage = (params) => request({
    url: serviceName + '/sys-user/findPage',
    method: 'get',
    params: params
});
//新增
export const user_addItem = (data) => request({
    url: serviceName + '/sys-user/add',
    method: 'post',
    data: data
});

//编辑
export const user_editItem = (data) => request({
    url: serviceName + '/sys-user/edit',
    method: 'post',
    data: data
});

//删除
export const user_delItem = (data) => request({
    url: serviceName + '/sys-user/delete',
    method: 'post',
    data: data
});

//详情
export const user_detail = (params) => request({
    url: serviceName + '/sys-user/findByUnid',
    method: 'get',
    params: params
});

//查询企业分组表列表
export const findEntGroupPage = (params) => request({
    url: serviceName + '/sys-user/findEntGroupPage',
    method: 'get',
    params: params
});


/************用户列表接口********************/


/************角色管理********************/
//列表
export const role_findPage = (params) => request({
    url: serviceName + '/sys-role/findPage',
    method: 'get',
    params: params
});
export const findRolePage = (params) => request({
    url: serviceName + '/sys-user/findRolePage',
    method: 'get',
    params: params
});

//新增
export const role_addItem = (data) => request({
    url: serviceName + '/sys-role/add',
    method: 'post',
    data: data
});

//编辑
export const role_editItem = (data) => request({
    url: serviceName + '/sys-role/edit',
    method: 'post',
    data: data
});


//删除
export const role_delItem = (data) => request({
    url: serviceName + '/sys-role/delete',
    method: 'post',
    data: data
});

//详情
export const role_detail = (params) => request({
    url: serviceName + '/sys-role/findByUnid',
    method: 'get',
    params: params
});

//查询系统菜单表列表
export const role_menu_findPage = (params) => request({
    url: serviceName + '/sys-role/findMenuPage',
    method: 'get',
    params: params
});

//查询角色授权的资源unid列表
export const role_menuList_findPage = (params) => request({
    url: serviceName + '/sys-role/findMidRoleMenuUnidList',
    method: 'get',
    params: params
});


//保存角色授权资源
export const role_saveRoleMenu = (data) => request({
    url: serviceName + '/sys-role/saveRoleMenu',
    method: 'post',
    data: data
});

/************角色管理********************/


/************菜单管理********************/
//列表
export const menu_findPage = (params) => request({
    url: serviceName + '/sys-menu/findPage',
    method: 'get',
    params: params
});

//新增
export const menu_addItem = (data) => request({
    url: serviceName + '/sys-menu/add',
    method: 'post',
    data: data
});

//编辑
export const menu_editItem = (data) => request({
    url: serviceName + '/sys-menu/edit',
    method: 'post',
    data: data
});

//删除
export const menu_delItem = (data) => request({
    url: serviceName + '/sys-menu/delete',
    method: 'post',
    data: data
});

//详情
export const menu_detail = (params) => request({
    url: serviceName + '/sys-menu/findByUnid',
    method: 'get',
    params: params
});

/************菜单管理********************/


/************分组管理********************/
//列表
export const group_findPage = (params) => request({
    url: serviceName + '/ent-group/findPage',
    method: 'get',
    params: params
});

//新增
export const group_addItem = (data) => request({
    url: serviceName + '/ent-group/add',
    method: 'post',
    data: data
});

//编辑
export const group_editItem = (data) => request({
    url: serviceName + '/ent-group/edit',
    method: 'post',
    data: data
});

//删除
export const group_delItem = (data) => request({
    url: serviceName + '/ent-group/delete',
    method: 'post',
    data: data
});

//详情
export const group_detail = (params) => request({
    url: serviceName + '/ent-group/findByUnid',
    method: 'get',
    params: params
});

//查询企业列表
export const group_ent_findPage = (params) => request({
    url: serviceName + '/ent-group/findEntPage',
    method: 'get',
    params: params
});

/************菜单管理********************/


/************安全配置********************/

//保存安全配置表信息
export const saveConfig = (data) => request({
    url: serviceName + '/sys-security-config/saveConfig',
    method: 'post',
    data: data
});

//查看安全配置
export const findConfig = (params) => request({
    url: serviceName + '/sys-security-config/findConfig',
    method: 'get',
    params: params
});
/************安全配置********************/


/***************解锁**********************/

//查询被锁定系统用户列表
export const unLock_findPage = (params) => request({
    url: serviceName + '/sys-login-error/findPage',
    method: 'get',
    params: params
});

//解锁系统账户
export const sys_unlock = (data) => request({
    url: serviceName + '/sys-login-error/unlock',
    method: 'post',
    data: data
});


//查询被锁定企业用户列表
export const unLock_ent_findPage = (params) => request({
    url: serviceName + '/ent-login-error/findPage',
    method: 'get',
    params: params
});

//解锁系统账户
export const ent_unlock = (data) => request({
    url: serviceName + '/ent-login-error/unlock',
    method: 'post',
    data: data
});


/***************解锁**********************/


/***************统一用户列表***********************/

//查询统一用户列表
export const idaas_user_findPage = (params) => request({
    url: serviceName + '/idaas-user/findPage',
    method: 'get',
    params: params
});


//查询统一用户绑定的企业分组列表
export const ent_bindGroup_findPage = (params) => request({
    url: serviceName + '/idaas-user/findBindEntGroupList',
    method: 'get',
    params: params
});


//查询企业分组表列表
export const ent_group_findPage = (params) => request({
    url: serviceName + '/idaas-user/findEntGroupPage',
    method: 'get',
    params: params
});


//统一用户关联企业分组
export const saveUserEntGroup = (data) => request({
    url: serviceName + '/idaas-user/saveUserEntGroup',
    method: 'post',
    data: data
});

/***************统一用户列表***********************/


/**
 * 导入数据 /man-data-power/importDataFromExcel
 从模板中读取数据，存入数据库
 */
export const importDataFromExcel = (data) => request({
    url: serviceName + '/sys-user/importDataFromExcel',
    method: 'post',
    data: data,
})