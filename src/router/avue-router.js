import {isURL} from "../util/validate";

let RouterPlugin = function () {
    this.$router = null;
    this.$store = null;

};
RouterPlugin.install = function (option = {}) {
    this.$router = option.router;
    this.$store = option.store;

    function objToform(obj) {
        let result = [];
        Object.keys(obj).forEach(ele => {
            result.push(`${ele}=${obj[ele]}`);
        })
        return result.join('&');
    }

    this.$router.$avueRouter = {
        //全局配置
        $website: this.$store.getters.website,
        routerList: [],
        group: '',
        safe: this,
        // 设置标题
        setTitle: function (title) {
            //console.log(title)
        },
        closeTag: (value) => {
            let tag = value || this.$store.getters.tag;
            if (typeof value === 'string') {
                tag = this.$store.getters.tagList.find(ele => ele.fullPath === value)
            }
            this.$store.commit('DEL_TAG', tag)
        },
        //处理路由
        getPath: function (params) {
            let {src} = params;
            let result = src || '/';
            if (src.includes("http") || src.includes("https")) {
                result = `/myiframe/routerPath?${objToform(params)}`;
            }
            return result;
        },
        //正则处理路由
        vaildPath: function (list, path) {
            let result = false;
            list.forEach(ele => {
                if (new RegExp("^" + ele + ".*", "g").test(path)) {
                    result = true
                }
            })
            return result;
        },
        //设置路由值
        getValue: function (route) {
            let value = "";
            if (route.query.src) {
                value = route.query.src;
            } else {
                value = route.path;
            }
            return value + route.hash;
        },
        //动态路由
        formatRoutes: function (aMenu = [], first) {
            const aRouter = []
            const propsDefault = this.$website.menu.props;
            if (aMenu && aMenu.length === 0) return;
            for (let i = 0; i < aMenu.length; i++) {
                const oMenu = aMenu[i];
                let path = oMenu[propsDefault.path],
                    component = oMenu.component,
                    name = oMenu[propsDefault.label],
                    icon = oMenu[propsDefault.icon],
                    children = oMenu[propsDefault.children],
                    query = oMenu[propsDefault.query],
                    meta = oMenu[propsDefault.meta];
                if (option.keepAlive) {
                    meta.keepAlive = option.keepAlive
                }
                const isChild = !!(children && children.length !== 0);
                const oRouter = {
                    path: path,
                    component: (() => {
                        // 判断是否为首路由
                        if (first) {
                            return import ('../page/index')
                            // 判断是否为多层路由
                        } else if (isChild && !first) {
                            return import('../page/index/layout')
                            // 判断是否为最终的页面视图
                        } else {
                            return import(`../${component}.vue`)
                        }
                    })(),
                    name,
                    icon,
                    meta,
                    query,
                    redirect: (() => {
                        if (!isChild && first) return `${path}`
                        else return '';
                    })(),
                    // 处理是否为一级路由
                    children: !isChild ? (() => {
                        if (first) {
                            oMenu[propsDefault.path] = `${path}`;
                            let result = import(`../${component}.vue`)
                            return [{
                                component: result,
                                icon: icon,
                                name: name,
                                meta: meta,
                                query: query,
                                path: ''
                            }]
                        }
                        return [];
                    })() : (() => {
                        return this.formatRoutes(children, false)
                    })()
                }
                aRouter.push(oRouter)
            }
            if (first) {
                if (Array.isArray(aRouter)&&aRouter.length>0){
                    for (const ele of aRouter) {
                        if (ele.path&&isURL(ele.path)&&!ele.path.startsWith("/")){ //判断路由是否为url菜单链接,并且不是/开头的 就补上/,否则非/开头的路由会报错
                            ele.path='/'+ele.path
                        }
                        this.safe.$router.addRoute(ele)
                    }
                    //aRouter.forEach((ele) => this.safe.$router.addRoute(ele))
                    if (!this.routerList.includes(aRouter[0][propsDefault.path])) {
                        this.routerList.push(aRouter[0][propsDefault.path])
                    }
                }
            } else {
                return aRouter
            }
        },
        // 清除路由
        clear: function () {
            this.routerList = [];
        }
    }
}
export default RouterPlugin;