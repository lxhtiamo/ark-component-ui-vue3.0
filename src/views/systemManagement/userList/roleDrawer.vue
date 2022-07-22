<template>
  <el-drawer
      :title="title"
      v-model="drawVisible"
      :direction="direction"
      :modal="false"
      size="45%"
      :before-close="closedDialog">
    <div class="d-content-style ent-content">
      <search-info @search="_search" @reset="_reset" style="">
        <el-input v-model.trim="searchParams.name" placeholder="请输入角色名称" maxlength="50" clearable
                  @keyup.enter="_search" @clear="_search"></el-input>
      </search-info>
      <div class="d-table-style flex-table">
        <el-table :data="tableData" @selection-change="handleSelectionChange" ref="tableRef"
                  :header-cell-style="{background: '#F5F6F8'}">
          <el-table-column
              type="selection"
              width="55">
          </el-table-column>
          <el-table-column label="序号" type="index" width="60px">
            <template v-slot="{$index}">
              {{ (page.currentPage - 1) * page.pageSize + $index + 1 }}
            </template>
          </el-table-column>
          <el-table-column label="角色名称" prop="name" show-overflow-tooltip></el-table-column>
          <el-table-column label="角色描述" prop="description" show-overflow-tooltip></el-table-column>
          <template v-slot:empty>
            <empty></empty>
          </template>
        </el-table>
        <lw-pagination :page="page" @current-change="_getTableData" @size-change="_search"></lw-pagination>
      </div>

    </div>
    <div class="d-footer-style">
      <div class="btn-div">
        <el-button @click="closedDialog()">关闭</el-button>
        <el-button type="primary" @click="submitData">确定</el-button>
      </div>
    </div>
  </el-drawer>
</template>

<script>
import smixin from "@/mixins/search-page"
import {findRolePage} from '@/api/systemManageApi'
import {checkCallBack, crudCheck} from "../../../util/util";

export default {
  name: "entDrawer",
  mixins: [smixin],
  props: {
    selectList: {
      type: Array,
      default: () => [],
    }

  },
  data() {
    return {
      searchParams: {name: '',},
      title: '角色列表',
      drawVisible: true,
      direction: 'rtl',
      tableData: [],
      page: {currentPage: 1, pageSize: 10, total: 0},
      subList: [],
    }
  },
  mounted() {
    if (this.selectList) {
      this.subList = JSON.parse(JSON.stringify(this.selectList))
    }
    this.getTableData();
  },
  methods: {
    getTableData() {
      this.loading = true;
      findRolePage({size: this.page.pageSize, current: this.page.currentPage, name: this.searchParams.name})
          .then(res => {
            let data = res.data.data;
            if (data) {
              this.tableData = data;
              this.page.total = res.data.total;
              let checkedList = checkCallBack('id', this.subList, this.tableData);
              this.$nextTick(() => {//延迟勾选数据
                if (Array.isArray(checkedList)) {
                  checkedList.forEach(obj => {
                    this.$refs.tableRef.toggleRowSelection(obj);
                  })
                }
              });
            }
          })
          .catch(err => {
            this.$util.showMessage(err)
          })
          .finally(() => {
            this.loading = false;
          })
    },

    closedDialog() {
      this.$emit('closed');
    },
    submitData() {
      this.$emit('closed', this.subList)
    },
    handleSelectionChange(list) {
      this.subList = crudCheck(list, this.tableData, 'id', this.subList);
    },
  },
}
</script>

<style lang="scss" scoped>
.ent-content {
  width: calc(100% - 48px);
  height: calc(100% - 24px);
  padding: 12px 24px !important;

  .d-table-style {
    height: calc(100% - 56px);
    margin-top: 12px;
  }
}
</style>