<template>
  <div class="div-screen-box">
    <el-header class="topParentHeader" style="height: 60px">
      <publicSubTop title="菜单管理">
      </publicSubTop>
    </el-header>
    <search-info @search="_search" @reset="_reset"
                 style="display: flex;
                 justify-content: space-between;
                 align-items: center;width: auto;
                 height: 40px;margin: 10px 0">
      <template v-slot:left>
        <el-button type="primary" size="default" icon="Plus" @click="addOrEdit()">新增</el-button>
      </template>
      <template v-slot:buttons></template>
    </search-info>
    <div class="screen-table flex-table" style="margin-top: 10px;height: calc(100% - 130px)">
      <el-table :data="tableData" v-loading="loading" row-key="unid" :header-cell-style="{background: '#F5F6F8'}">
        :tree-props="{children: 'childrenList', hasChildren: 'hasChildren'}">
        <el-table-column label="序号" type="index" width="80px" align="center">
          <template v-slot="{row}">
            {{ row._index }}
          </template>
        </el-table-column>
        <el-table-column label="菜单名称" prop="name" show-overflow-tooltip></el-table-column>
        <el-table-column label="排序号" prop="sort" show-overflow-tooltip></el-table-column>
        <el-table-column label="状态" prop="status" show-overflow-tooltip>
          <template v-slot="{row}">
            <span :class="['status-divs_'+row.status]">{{ row.status == '1' ? '禁用' : '启用' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" show-tooltip-text width="120">
          <template v-slot="{row}">
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

  </div>
</template>

<script>
import smixin from "@/mixins/search-page"
import {menu_findPage, menu_delItem} from '@/api/systemManageApi'
import addDialog from "./addDialog";
import publicSubTop from "../../../public/publicSubTop";

export default {
  name: "index",
  mixins: [smixin],
  components: {addDialog, publicSubTop},
  data() {
    return {
      searchParams: {name: ''},
      tableData: [],
      page: {currentPage: 1, pageSize: 10, total: 0},
      loading: false,
      showDialog: false,
      itemInfo: null,
    }
  },
  mounted() {
    this.getTableData();
  },
  methods: {
    getTableData() {
      this.loading = true;
      menu_findPage({size: this.page.pageSize, current: this.page.currentPage})
          .then(res => {
            let data = res.data.data;
            if (data) {
              data.forEach((obj, index) => {
                obj._index = (this.page.currentPage - 1) * this.page.pageSize + (index + 1);
                if (obj.childrenList && obj.childrenList.length > 0) {
                  this.setIndex(obj._index, obj.childrenList);
                }
              })
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

    addOrEdit(item) {
      this.showDialog = true;
      this.itemInfo = item
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
      })
          .then(() => {
            return menu_delItem([item.unid])
          })
          .then(() => {
            this.$util.showMessage('删除成功', '1')
            this._reset();
          })
          .catch(err => {
            if (err != 'cancel') {
              this.$util.showMessage(err)
            }
          })
    },
    setIndex(parantIndex, list) {
      list.forEach((obj, index) => {
        obj._status = obj.status == '1' ? true : false;
        obj._index = parantIndex + '-' + (index + 1);
        if (obj.childrenList) {
          this.setIndex(obj._index, obj.childrenList)
        }
      })
    },
  }
}
</script>

<style scoped>

</style>