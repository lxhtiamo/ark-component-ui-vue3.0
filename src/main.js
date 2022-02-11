import Vue from 'vue';
import IrComponent from 'ir-component-ui';
import axios from './router/axios';
import VueAxios from 'vue-axios';
import 'ir-component-ui/lib/theme-chalk/index.css';
import App from './App'; //这里要把App的引用顺序放到最后
import router from './router/router';
import './permission'; // 权限
import './error'; // 日志
import 'avue-plugin-transfer/packages' //引入avue-plugin-transfer插件
// import 'avue-plugin-ueditor/packages' //引入avue-plugin-ueditor插件(如果要兼容ie自行换掉富文本编辑器，此款插件不兼容ie)
import store from './store';
import { loadStyle } from './util/util'
import * as urls from '@/config/env';
import {
    iconfontUrl,
    iconfontVersion
} from '@/config/env';
import * as filters from './filters' // 全局filter
import './styles/common.scss';
// 引入avue的包
import '@smallwei/avue/lib/index.js';
// 引入avue的样式文件
import '@smallwei/avue/lib/theme-chalk/index.css';
//引入echarts
import echarts from 'echarts';

import basicContainer from './components/basic-container/main'
import search from './components/basic-container/search'
import empty from "./public/emptyFrame/empty"
import emptyLayout from "./public/emptyFrame/emptyLayout"

Vue.prototype.$echarts = echarts;
// //源文件包
// 动态嵌入iframe样式
if (top !== self) {
    // The page is in an iframe
    self.hideTheme = true;
    // loadIframeStyle();
} else {
    self.hideTheme = false;
    // The page is not in an iframe
    // console.log("not iframe");
}
/**
 * 动态插入iframe相关css
 */
// function loadIframeStyle(){
//     const style = document.createElement('style');
//     style.type = 'text/css';
//     style.innerHTML = `

//     `;
//     console.log(style);
//     const head = document.getElementsByTagName('head')[0];
//     head.appendChild(style);
// }


//注册全局容器
Vue.component('basicContainer', basicContainer);
//注册全局搜索框
Vue.component('search', search);
Vue.component('empty',empty);//列表空的提示
Vue.component('emptyLayout',emptyLayout);//列表空的提示

Vue.use(router)

Vue.use(VueAxios, axios)

Vue.use(IrComponent);

// 加载相关url地址
Object.keys(urls).forEach(key => {
    Vue.prototype[key] = urls[key];
})

// 加载过滤器
Object.keys(filters).forEach(key => {
    Vue.filter(key, filters[key])
})
// 动态加载阿里云字体库
iconfontVersion.forEach(ele => {
    loadStyle(iconfontUrl.replace('$key', ele));
})

Vue.config.productionTip = false;

Vue.config.btnCanClick = true;

Vue.directive('throttle', {
    bind: function(el, binding) {
        let timeout = binding.value.timeout;
        console.group('throttle-bind');
        if (!binding) {
            return;
        }
        if (!Vue.config.btnCanClick) {
            el.disabled = true;
        }
        setTimeout(() => {
            el.disabled = false;
            Vue.config.btnCanClick = true;
        }, timeout);
        el.addEventListener('click', function(event) {
            event.preventDefault();
            event.stopPropagation();
            el.disabled = true;
            Vue.config.btnCanClick = false;
            setTimeout(() => {
                el.disabled = false;
                Vue.config.btnCanClick = true;
                console.log('disabled false');
            }, timeout);
        });
        console.groupEnd('throttle-bind');
    },
});

Vue.directive('focus', {
    bind: function(el,) {
        console.group('focus-bind');
        console.log(el);
        let input = el.querySelector('input');
        if (!input) {
            return;
        }
        Vue.nextTick(function() {
            input.focus();
        });
        console.groupEnd('focus-bind');
    }
});

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')