<template>
  <div class="div-screen-box">
    <el-header class="topParentHeader" style="height: 60px">
      <publicSubTop title="用户列表">
      </publicSubTop>
    </el-header>
    <div class="screen-content-div screen-content-div-flex">
      <dept-tree @treeInfo="getTreeInfo"></dept-tree>
      <div class="screen-right-div" style="display: flex;flex-direction: column">
        <p class="screen-right-p">{{ objInfo.name || ' ' }}</p>
        <div class="div-search-box">
          <el-button type="primary" size="default" icon="Plus" @click="addOrEdit()">新增</el-button>
          <el-button size="default" icon="Upload" @click="improtItem" style="margin-right: 10px">导入数据</el-button>
          <el-input v-model.trim="searchParams.account" placeholder="请输入用户账号" class="search-Input" maxlength="50" clearable
                    @keyup.enter="_search" @clear="_search"></el-input>
          <el-input v-model.trim="searchParams.name" placeholder="请输入用户名称" maxlength="50" clearable class="search-Input"
                    @keyup.enter="_search" @clear="_search"></el-input>
          <el-input v-model.trim="searchParams.roleName" placeholder="请输入用户角色" maxlength="50" clearable class="search-Input"
                    @keyup.enter="_search" @clear="_search"></el-input>
          <el-input v-model.trim="searchParams.phone" placeholder="请输入手机号码" maxlength="50" clearable class="search-Input"
                    @keyup.enter="_search" @clear="_search"></el-input>
          <el-button type="primary" @click="_search" size="default">查询</el-button>
          <el-button @click="_reset" size="default">重置</el-button>
        </div>
        <div class="flex-table" style="flex: 1;margin-top: 12px;width: 100%">
          <el-table :data="tableData" v-loading="loading" :header-cell-style="{background: '#F5F6F8'}">
            <el-table-column label="序号" type="index" width="80px" align="center">
              <template v-slot="{$index}">
                {{ (page.currentPage - 1) * page.pageSize + $index + 1 }}
              </template>
            </el-table-column>
            <el-table-column label="用户账号" prop="userName" show-overflow-tooltip></el-table-column>
            <el-table-column label="用户名称" prop="realName" show-overflow-tooltip></el-table-column>
            <el-table-column label="用户角色" prop="roleNames" show-overflow-tooltip></el-table-column>
            <el-table-column label="手机号码" prop="phone" show-overflow-tooltip></el-table-column>
            <el-table-column label="状态" prop="status" show-overflow-tooltip>
              <template v-slot="{row}">
                <span :class="['status-divs_'+row.status]">{{ row.status == '1' ? '禁用' : '启用' }}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" show-tooltip-text width="120">
              <template v-slot="{row}">
                <el-button @click="addOrEdit(row)">编辑</el-button>
                <el-button @click="delItem(row)">删除</el-button>
                <!--                <el-dropdown class="dropdown-style">-->
                <!--                  <span class="el-dropdown-link txt-style">更多<i class="el-icon-arrow-down el-icon&#45;&#45;right"></i></span>-->
                <!--                  <el-dropdown-menu slot="dropdown">-->
                <!--                    <el-dropdown-item>资源授权</el-dropdown-item>-->
                <!--                    <el-dropdown-item>重置密码</el-dropdown-item>-->
                <!--                    <el-dropdown-item @click="delItem(row)">删除</el-dropdown-item>-->
                <!--                  </el-dropdown-menu>-->
                <!--                </el-dropdown>-->
              </template>
            </el-table-column>
            <template v-slot:empty>
              <empty></empty>
            </template>
          </el-table>
          <lw-pagination :page="page" @current-change="_getTableData" @size-change="_search"></lw-pagination>
        </div>
      </div>
    </div>
    <el-dialog title="导入文件" v-model="showImportDialog" v-if='showImportDialog' custom-class="default-pop"
               :close-on-click-modal="false" width="700px">
      <dialog-import @onClose="closeImportPop" :importDataFromExcel="importDataFromExcel" :uploadData="uploadData" :downloadExcelUrl="downloadExcelUrl"
                     :downloadErrUrl="downloadErrUrl"></dialog-import>
    </el-dialog>
    <addOrEdit @closed="closedDraw" v-if="showDraw" :area-info="objInfo" :item="item"></addOrEdit>
  </div>
</template>

<script>
import smixin from "@/mixins/search-page"
import addOrEdit from "./addOrEdit";
import {user_delItem, user_findPage} from '@/api/systemManageApi'
import publicSubTop from "../../../public/publicSubTop";
import dialogImport from './../../../public/importFile/dialogImport';
import {baseUrl} from "../../../config/env";
import {importDataFromExcel} from "../../../api/systemManageApi";

export default {
  name: "index",
  mixins: [smixin],
  components: {addOrEdit, publicSubTop, dialogImport},
  data() {
    return {
      searchParams: {
        account: '',
        name: '',
        phone: '',
        roleName: '',
      },
      tableData: [],
      page: {currentPage: 1, pageSize: 10, total: 0},
      loading: false,
      item: null,
      showDraw: false,
      objInfo: {},
      showImportDialog: false,//上传文件弹窗
      downloadExcelUrl: baseUrl + componentPrefix + '/sys-user/' + "downloadExcel",
      downloadErrUrl: baseUrl + componentPrefix + "/system-files/downloadFromSysTmpdir?fileName=",
      importDataFromExcel: importDataFromExcel,
      uploadData: {  //上传参数
        deptCode: "",
        deptName: "",
        areaCode: "",
        areaName: "",
        txCode: "",
      },
    }
  },
  mounted() {
  },
  methods: {
    //关闭导入弹窗
    closeImportPop(reload) {
      this.showImportDialog = false;
      if (reload) {
        this._reset();
      }
    },
    //导入
    improtItem() {
      this.showImportDialog = true;
    },
    getTableData() {
      this.loading = true;
      let nature = this.objInfo && this.objInfo.nature || ''
      let deptCode = '';
      if (nature && nature == '2') {
        deptCode = this.objInfo && this.objInfo.deptCode || '';
      }
      user_findPage({
        size: this.page.pageSize,
        current: this.page.currentPage,
        userName: this.searchParams.account,
        realName: this.searchParams.name,
        roleName: this.searchParams.roleName,
        phone: this.searchParams.phone,
        orgId: this.objInfo && this.objInfo.id || '',
        //areaCode: this.objInfo && this.objInfo.regionCode || '',
        //deptCode: deptCode,
        //standard:  this.objInfo&&this.objInfo.standard?this.objInfo.standard:'',
      })
          .then(res => {
            let data = res.data.data;
            if (data) {
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
    getTreeInfo(obj) {
      this.objInfo = obj;
      this._reset();
    },

    addOrEdit(item) {
      if ((this.objInfo && this.objInfo.nature == '2') || item) {
        this.item = item
        this.showDraw = true
      } else {
        this.$util.showMessage('请先选择部门', '2')
      }

    },
    delItem(item) {
      this.$confirm('是否删除此项', "提示", {
        confirmButtonText: "是",
        cancelButtonText: "否",
        type: "warning"
      })
          .then(() => {
            return user_delItem([item.id])
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
    closedDraw(obj) {
      this.showDraw = false;
      if (obj) {
        this._reset();
      }
    }
  },
}
</script>

<style lang="scss" scoped>
.txt-style {
  color: #3379fd !important;
  position: relative;
  top: -3px;
  margin-left: 10px;
  font-size: 14px;
}

.search-Input {
  margin-right: 10px;
  width: 160px
}

.div-search-box {
  display: flex;
  align-items: center;
  flex-wrap: wrap;

  .el-button {
    margin-top: 10px;
  }

  .el-input {
    margin-top: 10px;
  }
}

</style>

<style lang="scss">
//弹窗
.default-pop {
  .el-dialog__header {
    padding: 15px 20px 15px;
  }

  .el-dialog__body {
    padding: 10px 0 0;
  }

  .pop-footer-button {
    height: 52px;
    border-top: 1px solid #e8e8e8;
    padding: 10px 24px;
    text-align: right;
    box-sizing: border-box;

  }
}

</style>