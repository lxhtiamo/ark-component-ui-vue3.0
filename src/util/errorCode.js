import i18n from "../i18n/i18n";

/*=====================错误码需要和后端配合定义统一的错误提示========================*/

/*查询自定义的错误码,返回定义的错误提示信息*/
export const  findErrCode=(errCode) =>{
    let message='';
    if (errCode){
        message = i18n.global.t('err.code_'+errCode);
        if (!message||message.includes('err.code_')){
            message=i18n.global.t('err.default');
        }
    }
    return message
}

