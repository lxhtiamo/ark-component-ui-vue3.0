<template>
  <div class="div-screen-box">
    <el-header class="topParentHeader" style="height: 60px">
      <publicSubTop title="账号解锁">
      </publicSubTop>
    </el-header>
    <search-info @search="_search" @reset="_reset"
                 style="display: flex;
                 align-items: center;width: auto;
                 height: 40px;margin: 10px 0">
      <template v-slot:left>
        <el-button type="primary" icon="Unlock" @click="unloack" :loading="unlockLoading" style="margin-right: 10px;">解锁</el-button>
      </template>
      <el-input v-model.trim="searchParams.userName" placeholder="请输入用户账号" maxlength="50" clearable
                @keyup.enter="_search" @clear="_search"></el-input>
      <el-input v-model.trim="searchParams.realName" placeholder="请输入用户名称" maxlength="50" clearable
                @keyup.enter="_search" @clear="_search"></el-input>
      <el-input v-model.trim="searchParams.phone" placeholder="请输入手机号码" maxlength="18" clearable
                @keyup.enter="_search" @clear="_search"></el-input>
    </search-info>
    <div class="screen-table flex-table" style="margin-top: 10px;height: calc(100% - 130px)">
      <el-table :data="tableData" v-loading="loading" @selection-change="handleSelectionChange" :header-cell-style="{background: '#F5F6F8'}">
        <el-table-column
            type="selection"
            width="55">
        </el-table-column>
        <el-table-column label="序号" type="index" width="60px">
          <template v-slot="{$index}">
            {{ (page.currentPage - 1) * page.pageSize + $index + 1 }}
          </template>
        </el-table-column>
        <el-table-column label="用户账号" prop="userName" show-overflow-tooltip></el-table-column>
        <el-table-column label="用户名称" prop="realName" show-overflow-tooltip></el-table-column>
        <el-table-column label="手机号码" prop="phone" show-overflow-tooltip></el-table-column>
        <el-table-column label="最后登录时间" prop="lastTryTime" show-overflow-tooltip></el-table-column>
        <el-table-column label="错误次数" prop="errorCount" show-overflow-tooltip></el-table-column>
        <template v-slot:empty>
          <empty></empty>
        </template>
      </el-table>
      <lw-pagination :page="page" @current-change="_getTableData" @size-change="_search"></lw-pagination>
    </div>
  </div>
</template>

<script>
import smixin from "@/mixins/search-page"
import {unLock_findPage, sys_unlock, unLock_ent_findPage, ent_unlock} from '@/api/systemManageApi';
import publicSubTop from "../../../public/publicSubTop";

export default {
  name: "index",
  mixins: [smixin],
  components: {publicSubTop},
  data() {
    return {
      searchParams: {userName: '', realName: '', phone: ''},
      tableData: [],
      page: {currentPage: 1, pageSize: 10, total: 60},
      loading: false,
      showDialog: false,
      itemInfo: null,
      activity: '0',
      unlockLoading: false,
      selectList: [],
    }
  },
  mounted() {
    this.getTableData();
  },
  methods: {
    getTableData() {
      this.loading = true;
      let workNet = '';
      if (this.activity == '0') {
        workNet = unLock_findPage
      } else {
        workNet = unLock_ent_findPage
      }

      workNet({
        size: this.page.pageSize, current: this.page.currentPage,
        userName: this.searchParams.userName,
        realName: this.searchParams.realName,
        phone: this.searchParams.phone
      })
          .then(res => {
            let data = res.data.data;
            if (data) {
              data = data.map(v => Object.assign(v, {_status: v.status == '1' ? true : false}))
              this.tableData = data;
              this.page.total = res.data.total;
            }
          })
          .catch(err => {
            this.$util.showMessage(err)
          })
          .finally(() => {
            this.loading = false;
          })
    },
    unloack() {
      if (this.selectList.length == 0) {
        this.$util.showMessage('请先选择账号', '2');
      } else {
        let netWork = this.activity == '0' ? sys_unlock : ent_unlock;
        let userNameList = this.selectList.map(v => v.userName);
        this.$confirm('是否解锁', "提示", {
          confirmButtonText: "是",
          cancelButtonText: "否",
          type: "warning"
        })
            .then(() => {
              return netWork(userNameList)
            })
            .then(() => {
              this.$util.showMessage('解锁成功', '1')
              this._reset();
            })
            .catch(err => {
              if (err != 'cancel') {
                this.$util.showMessage(err)
              }
            })
      }

    },
    handleSelectionChange(val) {
      this.selectList = val
    }
  }
}
</script>

<style lang="scss" scoped>
.btn-style {
  padding: 8px 12px !important;
  top: 0px !important;
  position: relative;
  margin-left: 15px;
}
</style>