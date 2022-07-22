import {createApp, nextTick} from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import zhCn from 'element-plus/es/locale/lang/zh-cn' //国际化中文
import './permission'; // 权限
import IrComponentP from 'ir-component-ui-plus';
import 'ir-component-ui-plus/lib/ir-component-ui-plus.css';
import basicContainer from './components/basic-container/main'; /*通用组件*/
import search from './components/basic-container/search'
import empty from "./public/emptyFrame/empty"
import * as echarts from "echarts"; //引入echarts
import {loadStyle} from './util/util'
import * as urls from '@/config/env';
import {iconfontUrl, iconfontVersion} from '@/config/env';
import './styles/common.scss';
import * as Icons from '@element-plus/icons-vue' //全局引入图标
import _ from "lodash"; //lodash 工具类 https://www.lodashjs.com/
import * as util from "./util/util";
import baseComponents from './components/baseComponents';//注册全局自定义组件统一管理

const app = createApp(App).use(store).use(router);
Object.keys(Icons).forEach(key => {//注册全部图标
    app.component(key, Icons[key])
})

app.use(IrComponentP)
app.use(ElementPlus, {locale: zhCn,})//国际化中文
app.use(baseComponents);//注册全局自定义组件

app.component('basicContainer', basicContainer);//注册全局容器
app.component('search', search);
app.component('empty', empty);//列表空的提示

app.config.globalProperties.$util = util;//全局注册工具类
app.config.globalProperties.$echarts = echarts;
app.config.globalProperties._ = _;//引入lodash 工具类

Object.keys(urls).forEach(key => { // 加载相关url地址
    app.config.globalProperties[key] = urls[key];
})
iconfontVersion.forEach(ele => {// 动态加载阿里云字体库
    loadStyle(iconfontUrl.replace('$key', ele));
})
app.config.productionTip = false;
app.config.btnCanClick = true;
app.directive('throttle', {
    bind: function (el, binding) {
        let timeout = binding.value.timeout;
        console.group('throttle-bind');
        if (!binding) {
            return;
        }
        if (!app.config.btnCanClick) {
            el.disabled = true;
        }
        setTimeout(() => {
            el.disabled = false;
            app.config.btnCanClick = true;
        }, timeout);
        el.addEventListener('click', function (event) {
            event.preventDefault();
            event.stopPropagation();
            el.disabled = true;
            app.config.btnCanClick = false;
            setTimeout(() => {
                el.disabled = false;
                app.config.btnCanClick = true;
            }, timeout);
        });
    },
});

app.directive('focus', {
    bind: function (el,) {
        console.group('focus-bind');
        //console.log(el);
        let input = el.querySelector('input');
        if (!input) {
            return;
        }
        nextTick.then(() => {
            input.focus();
        });
        console.groupEnd('focus-bind');
    }
});
app.mount('#app')
