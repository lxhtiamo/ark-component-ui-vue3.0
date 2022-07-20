import * as publicRule from "@/rules/rules.js";
import i18n from "../../i18n/i18n";
export default {
    username: [
        {
            required: true,
            message: i18n.global.t('message.enterOneUserName'),
            trigger: "blur",
        },
        {required: true, trigger: "blur", validator: publicRule.enCnChar},
    ],
    type: [
        {
            required: true,
            message:  i18n.global.t('message.pleaseSelectType'),
            trigger: "change",
        },
        {required: true, trigger: "change", validator: publicRule.enCnChar},
    ],
};
