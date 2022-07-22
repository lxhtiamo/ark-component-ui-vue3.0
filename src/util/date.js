export const calcDate = (date1, date2) => {
    const date3 = date2 - date1;

    const days = Math.floor(date3 / (24 * 3600 * 1000));

    const leave1 = date3 % (24 * 3600 * 1000); //计算天数后剩余的毫秒数
    const hours = Math.floor(leave1 / (3600 * 1000));

    const leave2 = leave1 % (3600 * 1000); //计算小时数后剩余的毫秒数
    const minutes = Math.floor(leave2 / (60 * 1000));

    const leave3 = leave2 % (60 * 1000); //计算分钟数后剩余的毫秒数
    const seconds = Math.round(date3 / 1000);
    return {
        leave1,
        leave2,
        leave3,
        days: days,
        hours: hours,
        minutes: minutes,
        seconds: seconds,
    }
}

//创建时间格式化显示
export const dateFormat = (value, formatString) => {
    //ie下new Date()的参数如果是2019-10-12，得出的结果是invalid date
    //但可以是2019/10/12,但不可以是2019/10/12 12:00:00.0(火狐也不支持毫秒数)
    let _type = Object.prototype.toString.call(value)
    if (_type === '[object Date]') {
        return dateFtt(formatString, value)
    } else {
        if (_type === '[object String]') {
            value = value.replace(/-/g, '/').replace(/\.\d*/, '')
        }
        return dateFtt(formatString, new Date(value));
    }
}

function dateFtt(fmt, date) { //author: meizz
    const o = {
        "M+": date.getMonth() + 1,                 //月份
        "d+": date.getDate(),                    //日
        "H+": date.getHours(),                   //小时
        "m+": date.getMinutes(),                 //分
        "s+": date.getSeconds(),                 //秒
        "q+": Math.floor((date.getMonth() + 3) / 3), //季度
        "S": date.getMilliseconds()             //毫秒
    };
    if (/(y+)/.test(fmt))
        fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (let k in o)
        if (new RegExp("(" + k + ")").test(fmt))
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}

export const FORMAT_STR_Month = "yyyy-MM";
export const FORMAT_STR_DATE = "yyyy-MM-dd";
export const FORMAT_STR_TIME = "yyyy-MM-dd HH:mm";
export const FORMAT_STR_Month_TIME = "MM-dd HH:mm";
export const FORMAT_STR_FULL_TIME = "yyyy-MM-dd HH:mm:ss";
export const FORMAT_STR_FILE_NAME = "yyyyMMdd_HHmmss";