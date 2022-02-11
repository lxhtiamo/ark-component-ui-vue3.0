import request from '@/router/axios';

export const getDictByPunid = (punid) => request({
    url: '/system-dictionary/getDictionaryByPunid',
    method: 'get',
    params: {
        punid: punid || "",
    }
});

export const addDict = (data) => request({
    url: '/system-dictionary/addDict',
    method: 'post',
    data: data
});

export const updateDict = (data) => request({
    url: '/system-dictionary/updateDict',
    method: 'post',
    data: data
});

export const deleteDictByUnid = (unid) => request({
    url: '/system-dictionary/deleteDict',
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
