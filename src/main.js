import {createApp} from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import zhCn from 'element-plus/es/locale/lang/zh-cn'//国际化中文
import './permission'; // 权限
//import IrComponent from 'ir-component-ui';
import IrComponentP from 'ir-component-ui-plus';
import 'ir-component-ui-plus/lib/ir-component-ui-plus.css';
/*通用组件*/
import basicContainer from './components/basic-container/main';
import search from './components/basic-container/search'
import empty from "./public/emptyFrame/empty"
import echarts from 'echarts';//引入echarts

import {loadStyle} from './util/util'
import * as urls from '@/config/env';
import {iconfontUrl, iconfontVersion} from '@/config/env';
import './styles/common.scss';

import * as Icons from '@element-plus/icons-vue'//全局引入图标

const app = createApp(App).use(store).use(router);

//注册全部图标
Object.keys(Icons).forEach(key => {
    app.component(key, Icons[key])
})

app.use(IrComponentP)
//注册全局容器
app.component('basicContainer', basicContainer);
app.component('search', search);
app.component('empty', empty);//列表空的提示

app.config.globalProperties.$echarts = echarts;
app.use(ElementPlus, {locale: zhCn,})//国际化中文
//app.use(IrComponent)

// 加载相关url地址
Object.keys(urls).forEach(key => {
    app.config.globalProperties[key] = urls[key];
})

// 动态加载阿里云字体库
iconfontVersion.forEach(ele => {
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
                //console.log('disabled false');
            }, timeout);
        });
       // console.groupEnd('throttle-bind');
    },
});
import {nextTick} from 'vue'

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

app.config.productionTip = false;

app.config.btnCanClick = true;

app.mount('#app')
