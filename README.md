# demo

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).





#国际化
在src目录下的i18n目录
├── i18n
│   ├── i18n.js
│   └── langs
│       ├── cn.js
│       ├── en.js
│       └── index.js

#新建语言
在langs目录下
创建对应的语言xx.js文件
在xx.js引入 element-plus ui  对应的 xx语言import xxLocale from 'element-ui/lib/locale/lang/xx'   如cn.js和en.js文件
新增语言类对象 xx {}把xxLocale添加进去,key是el,添加对应的翻译文本,注意每个语言对应的key要相同,如home有几种语言的js文件就定义几个对应的翻译文本,如下:

const xx = {
el:xxLocale,
message: {
home:'hello',
date:'date',
text: 'Good good study, Day day up',
},
}

export default xx;
写好后在langs目录下的index.js中导入并注册.

#使用
标签中使用
<div>{{$t('message.home')}}</div>
<span v-text="$t('message.home')"></span>
js中使用
this.$t('message.home')
#切换语言
在js中使用 this.$i18n.locale = xx; 
localStorage.setItem('lang',xx);
并保存在本地
