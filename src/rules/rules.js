/**
 * 手机和固话
 * @param rule
 * @param value
 * @param callback
 * @returns {*}
 */
export function isPhone(rule, value, callback) {
    if (value) {

        var pattern = /^1[3|4|5|7|8][0-9]{9}$|^0\d{2,3}-?\d{7,8}$/
        if (pattern.test(value)) {
            return callback()
        }
        return callback(new Error('输入的号码格式错误'))
    }
    callback();
}

/**
 * 手机和固话
 * @param rule
 * @param value
 * @param callback
 * @returns {*}
 */
export function NotNullisPhone(rule, value, callback) {
    if (value===''||value===undefined) {
        return callback()
    }
    var pattern = /^1[3|4|5|7|8][0-9]{9}$|^0\d{2,3}-?\d{7,8}$/
    if (pattern.test(value)) {
        return callback()
    }
    return callback(new Error('输入的号码格式错误'))
}

/**
 * 手机号码
 * @param rule
 * @param value
 * @param callback
 * @returns {*}
 */
export function isMobilePhone(rule, value, callback) {
    if (!value) {
        return callback(new Error('输入不可以为空'));
    }
    var pattern = /^1[3|4|5|7|8][0-9]{9}$/
    if (pattern.test(value)) {
        return callback()
    }
    return callback(new Error('输入的手机号格式错误'))
}

/**
 * 固话
 * @param rule
 * @param value
 * @param callback
 * @returns {*}
 */
export function isTelephone(rule, value, callback) {
    if (!value) {
        return callback(new Error('输入不可以为空'));
    }
    var pattern = /^0\d{2,3}-?\d{7,8}$/
    if (pattern.test(value)) {
        return callback()
    }
    return callback(new Error('输入的固话格式错误'))
}

export function isMail(rule, value, callback) {
    if (!value) {
        return callback(new Error('输入不可以为空'));
    }
    var pattern = /^([A-Za-z0-9_])+([A-Za-z0-9_])+\.([A-Za-z]{2,4})$/
    if (pattern.test(value)) {
        return callback()
    }
    return callback(new Error('输入的邮箱格式错误'))
}

export function passHtmlAndSql(rule, value, callback) {
    if (value) {
        value = value + "";
        let elStr = [];
        if (value == "null") {
            return callback(new Error("非法字符“null”不允许单独输入"));
        }

        if (value && value.toLowerCase() == "null") {
            return callback(new Error("非法字符" + '"' + value + '"' + "不允许单独输入"));
            // return callback(new Error('非法字符“null”不允许单独插入'))
        }
        if (/<[^>]+>|&[^>]+;/g.test(value)) {
            elStr = value.match(/<[^>]+>|&[^>]+;/g);
            return callback(new Error('包含"' + elStr[0] + '"字符，暂不支持输入'));
        }
        if (/insert|select|update|delete|exec|count|"|;|%/i.test(value)) {
            elStr = value.match(/insert|select|update|delete|exec|count|"|;|%/i);
            return callback(new Error('包含"' + elStr[0] + '"字符，暂不支持输入'));
        }
        if (/</.test(value) || />/.test(value)) {
            return callback(new Error('包含"<",">"字符，暂不支持输入'));
        }
    }
    return callback();
}

//正数字
export function mustNumber(rule, value, callback) {
    if (value) {
        if (!/^([1-9][0-9]*)$/.test(value) || /\./.test(value) || !/\d/.test(value)) {
            return callback(new Error('必须都是正数字且不能包含小数点'))
        }
    }
    return callback()
}

//身份证
export function IDCard(rule, value, callback) {
    if (value) {

        if (idCardValid(value)) {
            // 合法
            return callback()
        } else {
            return callback(new Error('请输入正确的身份证号码'))
        }

    }
    return callback()
}
function idCardValid(id) {
    // 1 "验证通过!", 0 //校验不通过
    var format = /^(([1][1-5])|([2][1-3])|([3][1-7])|([4][1-6])|([5][0-4])|([6][1-5])|([7][1])|([8][1-2]))\d{4}(([1][9]\d{2})|([2]\d{3}))(([0][1-9])|([1][0-2]))(([0][1-9])|([1-2][0-9])|([3][0-1]))\d{3}[0-9xX]$/;
    //号码规则校验
    if (!format.test(id)) {
        return false;
    }
    //区位码校验
    //出生年月日校验   前正则限制起始年份为1900;
    var year = id.substr(6, 4),//身份证年
        month = id.substr(10, 2),//身份证月
        date = id.substr(12, 2),//身份证日
        time = Date.parse(month + '-' + date + '-' + year),//身份证日期时间戳date
        now_time = Date.parse(new Date()),//当前时间戳
        dates = (new Date(year, month, 0)).getDate();//身份证当月天数
    if (time > now_time || date > dates) {
        return false
    }
    //校验码判断
    var c = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2);   //系数
    var b = new Array('1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2');  //校验码对照表
    var id_array = id.split("");
    var sum = 0;
    for (var k = 0; k < 17; k++) {
        sum += parseInt(id_array[k]) * parseInt(c[k]);
    }
    if (id_array[17].toUpperCase() != b[sum % 11].toUpperCase()) {
        return false
    }
    return true
}
//不为空身份证
export function NotNullIDCard(rule, value, callback) {
    if (value) {
        if(value===''){
            return callback()
        }
        if (idCardValid(value)) {
            // 合法
            return callback()
        } else {
            return callback(new Error('请输入正确的身份证号码'))
        }

    }
    return callback()
}

// 护照
export function PortCard(rule, value, callback) {
    // 规则： 14/15开头 + 7位数字, G + 8位数字, P + 7位数字, S/D + 7或8位数字,等
    // 样本： 141234567, G12345678, P1234567
    var reg = /^([a-zA-z]|[0-9]){5,17}$/;
    if(reg.test(value)) {
        // 合法
        return callback()
    } else {
        return callback(new Error('请输入正确的护照号码'))
    }
}

// 港澳往来内地通行证
export function HKCard(rule, value, callback) {
    var reg = /^([A-Z]\d{6,10}(\(\w{1}\))?)$/;
    if(reg.test(value)) {
        // 合法
        return callback()
    } else {
        return callback(new Error('请输入正确的港澳居民来往内地通行证号码'))
    }
}

// 台湾居民来往大陆通行证
export function TWCard(rule, value, callback) {
    // 规则： 新版8位或18位数字， 旧版10位数字 + 英文字母
    // 样本： 12345678 或 1234567890B
    var reg = /^\d{8}|^[a-zA-Z0-9]{10}|^\d{18}$/;
    if (reg.test(value)) {
        return callback()
    } else {
        return callback(new Error('请输入正确的台湾居民来往大陆通行证号码'))
    }
}
// 军官证
export function isOfficerCard(rule, value, callback) {
    // 规则： 军/兵/士/文/职/广/（其他中文） + "字第" + 4到8位字母或数字 + "号"
    // 样本： 军字第2001988号, 士字第P011816X号
    var reg = /^[\u4E00-\u9FA5](字第)([0-9a-zA-Z]{4,8})(号?)$/;
    if (reg.test(value)) {
        return callback()
    } else {
        return callback(new Error('请输入正确的军官证号码'))
    }
}
// 户口本
export function isAccountCard(rule, value, callback) {
    // 规则： 15位数字, 18位数字, 17位数字 + X
    // 样本： 441421999707223115
    var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
    if (reg.test(value)) {
        return callback()
    } else {
        return callback(new Error('请输入正确的户口本号码'))
    }
}

//经度
export function LONG(rule, value, callback) {
    let reg = new RegExp('^-?(((1?[0-7]?[0-9]?)|(0?[0-9]?[0-9]?))(([.][0-9]{1,9})?)|180(([.][0]{1,9})?))$'); // 经度// 经度范围：-180.000000000~180.000000000;
    if (!(value === null || value === undefined || value === "")) {
        if (reg.test(value)) {
            callback();
        } else {
            callback(new Error("经度范围：-180.000000000~180.000000000"));
        }
    } else {
        callback();
    }
}

//纬度
export function LAT(rule, value, callback) {
    let reg =  new RegExp("^-?((0|[1-8]?[0-9]?)(([.][0-9]{1,9})?)|90(([.][0]{1,9})?))$"); // 纬度范围：-90.000000000~90.000000000
    if (!(value === null || value === undefined || value === "")) {
        if (reg.test(value)) {
            callback();
        } else {
            callback(new Error("纬度范围：-90.000000000~90.000000000"));
        }
    } else {
        callback();
    }
}

//密码
export function pass(rule, value, callback) {
    if (value) {
        if (!/^[\S]{6,32}$/.test(value)) {
            return callback(new Error('密码必须6到32位，且不能出现空格'))
        }
        if (!/\d/.test(value)) {
            return callback(new Error('密码必须包含数字'))
        }
        if (!/[a-zA-Z]/.test(value)) {
            return callback(new Error('密码必须包含数字'))
        }
    }
    return callback()
}

//要素名
export function fieldName(rule, value, callback) {
    if (value) {
        if (!/^[a-z]+[a-z_]*[a-z]+$/.test(value)) {
            return callback(new Error('只允许输入小写英文字母和“_”，且以小写字母开头和结尾，单词间用“_”连接'))
        }
    }
    return callback()
}

//不可见字符
export function invisibleChar(rule, value, callback) {
    if (value) {
        if (/[\s]/.test(value)) {
            return callback(new Error('包含特殊字符，非法插入'))
        }
    }
    return callback()
}


//中英文
export function enCnChar(rule, value, callback) {
    if (value) {
        if (!/^[A-Za-z0-9\u4e00-\u9fa5]+$/.test(value)) {
            return callback(new Error('只允许输入中英文及数字'))
        }
    }
    return callback()
}

//运算公式
export function formula(rule, value, callback) {
    if (value) {
        if (!/^[A-Za-z0-9\u4e00-\u9fa5\-/]+$/.test(value)) {
            return callback(new Error('只允许输入中英文、数字和“+”“-”“*”“/”'));
        }
    }
    return callback()
}

//校验统一社会信用代码
export function validateTYSHXYDM(rule, value, callback) {
    if (value) {

        if (!/[0-9A-HJ-NPQRTUWXY]{2}\d{6}[0-9A-HJ-NPQRTUWXY]{10}/.test(value)) {
            return callback(new Error('请输入正确的委托部门编码'));
        }
    }
    return callback()
}
//搜索框非法字符校验
export function searchRule(value) {
    if (value) {
        value = value + '';
        // let reg = /_|%|\/|\#/i;
        let reg =/[`~@#$%^&*+=<>?{}|'\\[\]·！￥…《》？【】]/im;
        if (reg.test(value)) {
            return false
        } else {
            return true
        }
    } else {
        return true;
    }
}