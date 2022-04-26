import * as publicRule from "@/rules/rules.js";

export default {
    title: [
        {required: true, message: "标题", trigger: "blur"},
        {min: 1, max: 255, message: "长度在 1 到 255 个字", trigger: "blur"},
        {validator: publicRule.passHtmlAndSql, trigger: "blur"}
    ],
    type: [
        {required: true, message: "消息类型", trigger: "blur"},
        {min: 1, max: 4, message: "长度在 1 到 4 个字", trigger: "blur"},
        {validator: publicRule.passHtmlAndSql, trigger: "blur"}
    ],
    relateUnid: [
        {required: true, message: "服务主键", trigger: "blur"},
        {min: 1, max: 32, message: "长度在 1 到 32 个字", trigger: "blur"},
        {validator: publicRule.passHtmlAndSql, trigger: "blur"}
    ],
    readStatus: [
        {required: true, message: "已读标志", trigger: "blur"},
        {min: 1, max: 2, message: "长度在 1 到 2 个字", trigger: "blur"},
        {validator: publicRule.passHtmlAndSql, trigger: "blur"}
    ],
    createUnid: [
        {required: true, message: "创建人标识", trigger: "blur"},
        {min: 1, max: 32, message: "长度在 1 到 32 个字", trigger: "blur"},
        {validator: publicRule.passHtmlAndSql, trigger: "blur"}
    ],
    createName: [
        {required: true, message: "创建人名称", trigger: "blur"},
        {min: 1, max: 32, message: "长度在 1 到 32 个字", trigger: "blur"},
        {validator: publicRule.passHtmlAndSql, trigger: "blur"}
    ],
    updateUnid: [
        {required: true, message: "更新人标识", trigger: "blur"},
        {min: 1, max: 32, message: "长度在 1 到 32 个字", trigger: "blur"},
        {validator: publicRule.passHtmlAndSql, trigger: "blur"}
    ],
    updateName: [
        {required: true, message: "更新名称", trigger: "blur"},
        {min: 1, max: 32, message: "长度在 1 到 32 个字", trigger: "blur"},
        {validator: publicRule.passHtmlAndSql, trigger: "blur"}
    ],
    sendUnid: [
        {required: true, message: "消息发送对象主键", trigger: "blur"},
        {min: 1, max: 32, message: "长度在 1 到 32 个字", trigger: "blur"},
        {validator: publicRule.passHtmlAndSql, trigger: "blur"}
    ],
    sendName: [
        {required: true, message: "消息发送对象名称", trigger: "blur"},
        {min: 1, max: 32, message: "长度在 1 到 32 个字", trigger: "blur"},
        {validator: publicRule.passHtmlAndSql, trigger: "blur"}
    ],
}


