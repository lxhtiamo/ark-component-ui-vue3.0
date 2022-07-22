import {findOrgList} from '@/api/deptApi'
import {ElMessage} from 'element-plus'


const defaultOptions = {
    strict: false,//是否严格的遵守父子节点不互相关联
    deptType: '1',//机构性质 1 区域  2 部门  3 虚拟
    value: 'id',
    label: 'name',
    children: 'children',
    leaf: 'leaf',
    //机构级别  1 全国  2省  3 市  4 乡镇  5 区县  6 村/社区  7 虚拟级  8 司部级
    standard: '6',
    ref: 'cascader',
    root: 'p',//p 从省级开始  o 用userInfo.orgRegionCodes对应的部门当root
    initPunid: '',
}

//部门级联组件配置生成类
export default class Dept {
    /**
     * 部门级联组件配置生成类
     * @param {VueComponentInstance} vueInstance 当前vue实例
     * @param {Object} options 配置
     */
    constructor(vueInstance, options = {}) {
        this.options = Object.assign({}, defaultOptions, options)
        this.vm = vueInstance || null
        this.data = []
        this.props = this.getCascaderOption()
        this.beLoading = []//待加载子节点的节点
        this.cbs = new WeakMap()
        this.proxy('rootLoaded', false, (nv, ov) => {
            if (nv) {
                for (let i = 0, l = this.beLoading.length; i < l; i++) {
                    let node = this.beLoading[i]
                    this.loadChildNodedData(node, this.cbs.get(node))
                }
            }
        })
    }

    getCascaderOption() {
        let cascaderOptions = {
            value: this.options.value,
            label: this.options.label,
            lazy: true,//用懒加载的方式后面编辑（级联回显）的时候太麻烦
            lazyLoad: this.createLazyLoad(),//为了使 dictLoad 方法内部的 this 指向 Dept 实例
            children: this.options.children,
            leaf: this.options.leaf,
            checkStrictly: this.options.strict
        }
        return cascaderOptions
    }

    expand(key) {
        if (!this) {
            console.error('请用 @event="deptInstance.expand()" 的方式调用')
            return
        }
        if (!this.vm) return
        let ref = this.vm.$refs[key || this.options.ref],
            store,
            node
        if (ref) {
            store = ref.$refs.panel.store,
                node = ref.getCheckedNodes().pop()
            if (node) {
                this.dictLoad(node, (data) => {
                    store.appendNodes(data, node)
                })
            }
        }
    }

    getProvinceInfo() {
        // if (id) {
        //     return Promise.resolve('')
        // } else {
        //     return getProvincialInfoByOnline()
        // }
    }

    async getRoot() {
        // let id = '',
        //     res
        // switch(this.options.root){
        //     case 'p':
        //         res = await getProvincialInfoByOnline()
        //         return [res.data.data]
        //     case 'o':
        //         id = store.getters.userInfo.orgRegionCodes
        //         res = await getOrgInfoByDeptCode({ deptCode: id })
        //         return [res.data.data]
        //     default: return ''
        // }
    }

    createLazyLoad() {
        const deptInst = this
        return function (...arg) {
            deptInst.dictLoad(...arg)
        }
    }

    dictLoad(node, resolve) {
        if (node && node.children && node.children.length > 0) {
            resolve()
            return false
        }
        let id = node && node.data && node.data.id || this.options.initPunid;
        findOrgList({punid: id, nature: this.options.deptType})
            .then(res => {
                if (Array.isArray(res)) {
                    return {data: {data: res}}
                } else if (typeof res === 'string') {
                    return findOrgList({
                        punid: res,
                        nature: this.options.deptType
                    })
                } else {
                    return res
                }
            }).then(res => {
            let data = res.data.data || []
            if (data) {
                this.data.push(...data)//记录所有节点
                data.forEach(v => {
                    //stardard:机构级别  leaf:是否有下级（默认数据是字符串）
                    //手动更新数据需要将数据补充完整 ，主要指：leaf、children，leaf是true的时候不用指定children
                    if (v.isLeaf == '1') {
                        v.leaf = true
                    } else {
                        v.leaf = false
                        v.children = []
                    }
                })
                resolve(data)
                if (!this.rootLoaded) {
                    this.rootLoaded = true
                }
            } else {
                resolve([])
            }
        }).catch(err => {
            ElMessage.warning(err.data && err.data.msg || err.message)
            resolve([])
        })
    }

    getFlatNodes(data) {
        return data.reduce((res, node) => {
            res.push(node)
            if (!node.isLeaf) {
                res = res.concat(this.getFlatNodes(node.children));
            }
            return res;
        }, []);
    }

    getNodeByValue(value) {
        let {ref: refk} = this.options
        let ref = this.vm.$refs[refk]
        if (ref) {
            let store = ref.$refs.panel.store,
                flatNodes = this.getFlatNodes(store.nodes),
                node = flatNodes.find(v => v.value === value)
            // node = (from || store.nodes).find(v => v.value === value)
            if (node) {
                return node
            }
        }
        return null
    }

    updateNodeChildren(data, parentNode) {
        let {ref: refk} = this.options
        if (parentNode && Array.isArray(data)) {
            this.vm.$refs[refk].$refs.panel.store.appendNodes(data, parentNode)
        }
    }

    /**
     * callback（Array类型）说明：数据回填用来触发级联选择框的选中路径显示和更新选择菜单的选中样式
     * @param {Array} nodes 要加载数据的节点值
     * @param {Array|Function} callback 加载结束后的回调或nodes的回填数组
     * @returns void
     */
    async loadChildNodedData(nodes, callback) {//逐级加载默认选中的数据
        if (!Array.isArray(nodes)) return
        if (!this.rootLoaded) {//此时根列表未加载完成，先缓存待加载节点信息
            this.beLoading.push(nodes)
            if (callback) {
                this.cbs.set(nodes, callback)
            }
            return
        }
        let _nodes = nodes.slice(0),
            data = this.data,//FN所在集合
            fn,//值（value）
            FN,//值对应的data
            currentNode
        if (_nodes.length >= 1) {
            for (let i = 0, l = _nodes.length - 1; i < l; i++) {
                fn = _nodes[i],
                    FN = data.find(v => fn && v.id === fn || v.areaCode === fn),
                    currentNode = this.getNodeByValue(fn)//通过值获取节点（cascader内部node）
                if (FN && (!FN.children || FN.children.length === 0)) {
                    data = await this.loadFn(FN.unid)
                    if (data.length > 0) {
                        FN.children = data
                        this.data.push(...data)
                        //手动添加当前节点的子节点
                        currentNode && this.updateNodeChildren(data, currentNode)
                    }
                } else {
                    data = FN && FN.children || []
                }
            }
            switch (Object.prototype.toString.call(callback)) {
                case '[object Function]':
                    callback()
                    break
                case '[object Array]':
                    //el-cascader 内部会判断新旧值是否相等，要触发视图更新要用新数组赋值而不能用array.push等方法
                    //javascript 方法调用时使用值传递，导致这里不管用什么方法都无法改到vue实例属性，也就无法触发视图更新
                    if (callback.length === 0) {
                        callback.push(...nodes)
                    }
                    break
                case '[object String]':
                    this.setVmPropertyByPath(callback, nodes.slice(0))
                    break
            }
        }
    }

    /**
     * 通过路径找到vue实例属性并赋值（可触发视图更新）
     * @param {String} path 以 . 分隔开的属性路径
     * @param {Any} value 值
     * @returns
     */
    setVmPropertyByPath(path, value) {
        if (!this.vm) return false
        let _p = path.split('.'),
            property = this.vm
        for (let i = 0, l = _p.length - 1; i < l; i++) {
            property = property[_p[i]]
        }
        property[_p.pop()] = value
    }

    loadFn(punid) {//手动更新数据获取接口
        if (!punid) return []
        return findOrgList({
            punid: punid,
            nature: this.options.deptType,
        }).then(res => {
            let data = res.data.data || []
            data.forEach(v => {
                //stardard:机构级别  leaf:是否有下级（默认数据是字符串）
                //手动更新数据需要将数据补充完整 ，主要指：leaf、children，leaf是true的时候不用指定children
                if (v.standard === this.options.standard || v.leaf === 'true') {
                    v.leaf = true
                } else {
                    v.leaf = false
                    v.children = []
                }
            })
            return data
        }).catch(err => {
            return Promise.reject(new Error(err.data && err.data.msg || err.message))
        })
    }

    proxy(key, value, callback) {//数据监听
        let oldV
        oldV = value
        Object.defineProperty(this, key, {
            configurable: true,
            enumerable: true,
            get() {
                return oldV
            },
            set(newV) {
                let _o = oldV
                if (oldV !== newV) {
                    oldV = newV
                    callback(newV, _o)
                }
            }
        })
    }

    getWholeItem(value) {
        if (!Array.isArray(value)) return
        return value.map(v => {
            return this.data.find(fv => {
                return fv[this.options.value] === v || fv.regionCode === v
            })
        }).filter(v => !!v)
    }

    getFormDepts(value, key) {
        let depts = this.getWholeItem(value)
        return depts.map(v => {
            return key ? v[key] : v.regionCode
        })
    }

    getSearchDepts(value) {
        let depts = this.getWholeItem(value)
        return depts.reduce((p, c) => {
            switch (c.standard) {
                case '1': //全国
                    break
                case '2':
                    p.provinceCode = c.regionCode
                    break
                case '3':
                    p.cityCode = c.regionCode
                    break
                case '4':
                    p.districtCode = c.regionCode
                    break
                case '5':
                    p.townshipCode = c.regionCode
                    break
                case '6':
                    p.villageCode = c.regionCode
                    break
            }
            return p
        }, {})
    }
}