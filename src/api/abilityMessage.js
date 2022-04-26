import request from '@/router/axios';

export const subUrl = "/ability-message/";

/*-------------------------------------------------------------------*/
// /ability-message/addOrEdit
// 新增
export const add = (parameter) => request({
    url: subUrl + 'add',
    method: 'post',
    data: parameter,
});

// 编辑
export const edit = (parameter) => request({
    url: subUrl + 'edit',
    method: 'post',
    data: parameter,
});

// /ability-message/delete
// 批量删除
export const batchDeletion = (parameter) => request({
    url: subUrl + 'delete',
    method: 'post',
    data: parameter,
});

// /ability-message/findPage
// 获取列表
export const findPage = (parameter) => request({
    url: subUrl + 'findPage',
    method: 'get',
    params: parameter,
});

// /ability-message/findByUnid
// 查看详情
export const findByUnid = (parameter) => request({
    url: subUrl + 'findByUnid',
    method: 'get',
    params: parameter,
});

