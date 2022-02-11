import request from '@/router/axios';
const subUrl = "/operate-log/";
/**
 * 获取操作日志的数据列表
 * @param size 分页大小
 * @param current 当前页
 * @param url 访问路径
 */
export const findOperateLogPage = (size,current,name,flag,sortSign) => request({
    url: subUrl+'findOperateLogPage',
    method: 'get',
    params: {size,current,name,flag,sortSign}
});

export const getDetail = (unid) => request({
    url: subUrl+'operateLogDetail',
    method: 'get',
    params: {
        unid
    }
});
