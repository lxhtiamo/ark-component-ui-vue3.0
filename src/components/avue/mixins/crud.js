import * as utils from '../utils/util.js';
import {validatenull} from '../utils/validate.js';
import {loadDic} from '../utils/dic.js';
import crudInputNumber from '../avue-form/crud-input-number';
import crudRadio from '../avue-form/crud-radio';

export default function () {
    return {
        props: {
            option: {
                type: Object,
                required: true,
                default: () => {
                    return {};
                }
            }
        },
        components: {
            crudInputNumber,
            crudRadio
        },
        watch: {
            option: {
                handler() {
                    this.init();
                },
                deep: true
            }
        },
        data() {
            return {
                DIC: {},
                dicCascaderList: []
            };
        },
        created() {
            this.init();
        },
        computed: {
            menuType() {
                return this.tableOption.menuType || 'button';
            },
            isMediumSize() {
                return this.controlSize === 'default' ? 'small' : this.controlSize;
            },
            controlSize() {
                return this.tableOption.size || 'default';
            }
        },
        methods: {
            getKey(item = {}, props = {}, key) {
                return item[
                props[key] || (this.parentOption.props || {})[key] || key
                    ];
            },
            init() {
                // 初始化工具
                this.initFun();
                this.tableOption = JSON.parse(JSON.stringify(this.option));
                // 规则初始化
                this.rulesInit();
                setTimeout(() => {
                    this.initDic();
                }, 1);
            },
            //检测本地字典
            initDic() {
                // 表格赋值
                this.columnOption.forEach(ele => {
                    if (Array.isArray(ele.dicData)) {
                        this.DIC[ele.prop] = ele.dicData
                    }
                })
            },
            handleLoadDic(option) {
                return new Promise((resolve) => {
                    const dicFlag = this.vaildData(this.tableOption.dicFlag, true);
                    // 初始化字典
                    if (dicFlag) {
                        loadDic(option || this.tableOption).then((res = {}) => {
                            Object.keys(res).forEach(ele => {
                                this.DIC[ele] = res[ele]
                            });
                            resolve();
                        });
                        // 加载传进来的字典
                    } else {
                        const dicData = this.tableOption.dicData || [];
                        this.DIC = this.deepClone(dicData);
                        resolve();
                    }
                })
            },
            vaildData(val, dafult) {
                if (typeof val === 'boolean') {
                    return val;
                }
                return !validatenull(val) ? val : dafult;
            },
            initFun() {
                Object.keys(utils).forEach(key => {
                    this[key] = utils[key];
                });
            }
        }
    };
}
