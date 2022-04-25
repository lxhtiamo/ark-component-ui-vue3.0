import * as publicRule from "@/rules/rules.js";

export default {
    username: [
        {
            required: true,
            message: "请输入用户名",
            trigger: "blur",
        },
        {required: true, trigger: "blur", validator: publicRule.enCnChar},
    ],
    type: [
        {
            required: true,
            message: "请选择类型",
            trigger: "change",
        },
        {required: true, trigger: "change", validator: publicRule.enCnChar},
    ],
};
