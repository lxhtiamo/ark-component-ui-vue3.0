import request from '@/router/axios';
import {componentPrefix} from '@/config/env';

const serviceName = componentPrefix
/**
 * 获取操作日志的数据列表
 * @param size 分页大小
 * @param current 当前页
 * @param url 访问路径
 */
export const findOperateLogPage = (size, current, name, flag, sortSign) => request({
    url: serviceName + '/operate-log/findOperateLogPage',
    method: 'get',
    params: {size, current, name, flag, sortSign}
});

export const getDetail = (unid) => request({
    url: serviceName + '/operate-log/operateLogDetail',
    method: 'get',
    params: {
        unid
    }
});
