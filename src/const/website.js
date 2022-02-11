/**
 * 全局配置文件
 */
export default {
    //系统版本号
    sysVersion: "v1.0.0",
    changeLog: ["1、XXXXXX", "2、XXXXX"],
    title: "",
    logo: "",
    indexTitle: '',
    lockPage: '/lock',
    tokenTime: 6000,
    info: {
        title: "",
        list: []
    },
    storePrefix: 'vue-',
    //http的status默认放行不才用统一处理的,
    statusWhiteList: [406],
    //配置首页不可关闭
    isFirstPage: false,
    fistPage: {
        label: "首页",
        value: "/wel/index",
        params: {},
        query: {},
        group: [],
        close: false
    },
    //配置菜单的属性
    menu: {
        props: {
            label: 'label',
            path: 'path',
            icon: 'icon',
            children: 'children'
        }
    }
}