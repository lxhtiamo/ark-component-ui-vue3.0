import {passHtmlAndSql} from "@/rules/rules"

const invalid = (value) => {
    return passHtmlAndSql('', value, (err) => {
        if (err) {//存在非法字符
            return true
        } else {
            return false
        }
    })
}
export default {
    data() {
        return {
            searchParamsCopy: {},
        }
    },
    watch: {
        'page.total'(n, o) {
            if (n !== 0 && this.tableData && this.tableData.length === 0) {
                this.$nextTick(this._getTableData)
            }
        }
    },
    methods: {
        _search() {
            for (let k in this.searchParams) {
                //数组是range date不做非法字符判断
                if (!Array.isArray(this.searchParams[k]) && this.searchParams[k] && invalid(this.searchParams[k])) {
                    this.$message.warning('包含非法字符，请重新输入')
                    return false
                }
            }
            this.page.currentPage = 1
            this.getTableData()
        },
        _getTableData() {
            for (let k in this.searchParams) {
                //数组是range date不做非法字符判断
                if (!Array.isArray(this.searchParams[k]) && this.searchParams[k] && invalid(this.searchParams[k])) {
                    this.$message.warning('包含非法字符，请重新输入')
                    return false
                }
            }
            this.getTableData()
        },
        _reset() {
            for (let k in this.searchParams) {
                if (Array.isArray(this.searchParams[k])) {
                    this.searchParams[k] = this.searchParamsCopy[k].slice(0)
                } else {
                    this.searchParams[k] = this.searchParamsCopy[k]
                }
            }
            this._search()
        },

    },
    created() {
        // this._typeList.forEach(obj => {
        //     obj.total = 0
        // })
        if (this.searchParams && typeof this.searchParams === 'object') {
            for (let k in this.searchParams) {
                if (Array.isArray(this.searchParams[k])) {
                    this.searchParamsCopy[k] = this.searchParams[k].slice(0)
                } else {
                    this.searchParamsCopy[k] = this.searchParams[k]
                }
            }
        }
    }
}