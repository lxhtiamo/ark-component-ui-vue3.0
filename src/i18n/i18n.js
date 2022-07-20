
import { createI18n } from 'vue-i18n/index.js'
import messages from './langs'  //本地语言
//从localStorage获取语言选择。
const i18n =createI18n({
    locale: localStorage.lang || 'cn', //初始未选择默认 cn 中文
    messages,
    globalInjection: true,// 全局注入 $t 函数
})
export default i18n;