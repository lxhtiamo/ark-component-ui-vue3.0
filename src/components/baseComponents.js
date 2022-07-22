/*注册全局组件统一管理*/

import deptTree from './deptTree/index'
import searchInfo from './search-info'
import lwPagination from "./pagination"

const components = {
    deptTree,
    searchInfo,
    lwPagination,
};

/*遍历将组件加入到Vue中,组件中的 name: "xxxx",要跟上面的一样*/
function install(Vue) {
    const keys = Object.keys(components);
    keys.forEach((name) => {
        const component = components[name];
        Vue.component(component.name || name, component);
    })
}

export default install;