<template>
  <div class="div-screen-box">
    <el-header class="topParentHeader" style="height: 60px">
      <publicSubTop title="角色管理">
      </publicSubTop>
    </el-header>
    <div
        style="display: flex;justify-content: space-between;align-items: center;width: auto;height: 40px;margin: 10px 0">
      <el-button type="primary" size="default" icon="Plus" @click="addOrEdit()">新增</el-button>
      <search-info @search="_search" @reset="_reset" style="display: flex;width: auto">
        <el-input v-model.trim="searchParams.name" placeholder="请输入角色名称" maxlength="50" clearable
                  @keyup.enter="_search" @clear="_search"
        ></el-input>
      </search-info>
    </div>
    <div class="screen-table flex-table" style="margin-top: 10px;height: calc(100% - 130px)">
      <el-table :data="tableData" v-loading="loading" :header-cell-style="{background: '#F5F6F8'}">
        <el-table-column label="序号" type="index" width="80px" align="center">
          <template v-slot="{$index}">
            {{ (page.currentPage - 1) * page.pageSize + $index + 1 }}
          </template>
        </el-table-column>
        <el-table-column label="角色名称" prop="name" show-overflow-tooltip></el-table-column>
        <el-table-column label="角色描述" prop="description" show-overflow-tooltip></el-table-column>
        <el-table-column label="排序号" prop="sortNum" show-overflow-tooltip></el-table-column>
        <el-table-column label="状态" prop="status" show-overflow-tooltip>
          <template v-slot="{row}">
            <span :class="['status-divs_'+row.status]">{{ row.status == '1' ? '禁用' : '启用' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" show-tooltip-text width="180">
          <template v-slot="{row}">
            <el-button @click="authList(row)">授权</el-button>
            <el-button @click="addOrEdit(row)">编辑</el-button>
            <el-button @click="delItem(row)">删除</el-button>
          </template>
        </el-table-column>
        <template v-slot:empty>
          <empty></empty>
        </template>
      </el-table>
      <lw-pagination :page="page" @current-change="_getTableData" @size-change="_search"></lw-pagination>

    </div>

    <addDialog v-if="showDialog" :item="itemInfo" @closed="closedDialog"></addDialog>
    <auth v-if="showAuth" @closed="closedAuth" :item="itemInfo"></auth>

  </div>
</template>

<script>
import smixin from "@/mixins/search-page"
import {role_findPage, role_delItem} from '@/api/systemManageApi'
import addDialog from "./addDialog";
import auth from './auth/index'
import publicSubTop from "../../../public/publicSubTop";

export default {
  name: "index",
  mixins: [smixin],
  components: {addDialog, auth, publicSubTop},
  data() {
    return {
      searchParams: {name: ''},
      tableData: [],
      page: {currentPage: 1, pageSize: 10, total: 0},
      loading: false,
      showDialog: false,
      itemInfo: null,
      showAuth: false,
    }
  },
  mounted() {
    this.getTableData();
  },
  methods: {
    getTableData() {
      this.loading = true;
      role_findPage({
        size: this.page.pageSize,
        current: this.page.currentPage,
        name: this.searchParams.name
      }).then(res => {
        let data = res.data.data;
        if (data) {
          this.tableData = data;
          this.page.total = res.data.total;
        }
      }).catch(err => {
        this.$util.showMessage(err)
      }).finally(() => {
        this.loading = false;
      })
    },
    addOrEdit(item) {
      this.itemInfo = item
      this.showDialog = true;
    },
    closedDialog(obj) {
      this.showDialog = false;
      if (obj) {
        this._reset();
      }
    },
    delItem(item) {
      this.$confirm('是否删除此项', "提示", {
        confirmButtonText: "是",
        cancelButtonText: "否",
        type: "warning"
      }).then(() => {
        return role_delItem([item.id])
      }).then(() => {
        this.$util.showMessage('删除成功', '1')
        this._reset();
      }).catch(err => {
        if (err != 'cancel') {
          this.$util.showMessage(err)
        }
      })
    },
    authList(row) {
      this.itemInfo = row;
      this.showAuth = true;
    },
    closedAuth(obj) {
      this.showAuth = false;
      if (obj) {
        this.getTableData()
      }
    },
  }
}
</script>

<style scoped>

</style>