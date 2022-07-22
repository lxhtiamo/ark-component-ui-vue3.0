<template>
  <el-pagination
      class="lwPagination-css"
      background
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="page.currentPage"
      :page-sizes="page.pageSizes"
      :page-size="page.pageSize"
      :layout="layout"
      :total="page.total">
  </el-pagination>
</template>
<script>
export default {
  name: "lwPagination",
  props: {
    page: {
      type: Object,
      default: () => ({
        total: 0,
        pageSize: 10,
        currentPage: 1
      })
    },
    layout: {
      type: String,
      default: 'total, sizes, prev, pager, next, jumper'
    },
    pageSizes: {
      type: Array,
      default: () => [10, 20, 30, 40, 50, 100]
    },
    paginationStyle: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    handleSizeChange(size) {
      this.$emit('size-change', size)
    },
    handleCurrentChange(page) {
      this.$emit('current-change', page)
    }
  },
  mounted() {
    /**
     * 如果当前组件在el-form-item表单内部，页码跳转输入框（jumper）blur事件会触发el-form-item的校验，
     * 原本只需将el-input的validate-event配置为false即可，
     * 由于jumper输入框是el-pagination内部的组件，无法通过实例修改props，所以通过修改实例的handleBlur事件来修改
     * 此时element版本：2.13.1
     */
    try {
      let target = this.$children[0].$children.filter(v => v.$vnode.tag.includes('jumper'))[0].$children[0]
      target.handleBlur = (function (event) {
        this.focused = false;
        this.$emit('blur', event);
      }).bind(target)
      // eslint-disable-next-line no-empty
    } catch (e) {

    }
  }
}
</script>
<!--样式-->
<style lang="scss"></style>
<!--样式-->
<style lang="scss" scoped>
.lwPagination-css {
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  width: 100%;
  float: right;
}
</style>
