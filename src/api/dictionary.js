import request from '@/router/axios';
import {componentPrefix} from '@/config/env';

const serviceName = componentPrefix

export const getDictByPunid = (punid) => request({
    url: serviceName + '/system-dictionary/getDictionaryByPunid',
    method: 'get',
    params: {
        punid: punid || "",
    }
});

export const addDict = (data) => request({
    url: serviceName + '/system-dictionary/addDict',
    method: 'post',
    data: data
});

export const updateDict = (data) => request({
    url: serviceName + '/system-dictionary/updateDict',
    method: 'post',
    data: data
});

export const deleteDictByUnid = (unid) => request({
    url: serviceName + '/system-dictionary/deleteDict',
    method: 'post',
    data: {
        unid,
    }
});

export const getSordIdByPunid = (punid) => request({
    url: '/system-dictionary/getSordIdByPunid',
    method: 'get',
    params: {
        punid: punid || "",
    }
});
