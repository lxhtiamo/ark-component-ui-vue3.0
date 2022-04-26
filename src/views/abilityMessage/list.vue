<!--服务消息管理表列表-->
<template>
  <div class="table-content" style="margin-top: 10px">
    <div class="search">
      <div class="search-div" style="margin-right: 12px"><span>unid</span>
        <el-divider direction="vertical"></el-divider>
        <el-input v-model.trim="input2" class="search-input-style" clearable
                  placeholder="请输入unid"
                  size="default" style="width:200px!important;" @keyup.enter="reQuery">
        </el-input>
      </div>
      <el-button :loading="loadingSearch" icon="Search" size="default" type="primary" @click="reQuery">查 询</el-button>
      <el-button icon="Refresh" size="default" @click="reSetSelect">重 置</el-button>
      <div style="margin: 10px 0">
        <el-button icon="Plus" size="default" type="primary" @click="add">新增</el-button>
        <el-button icon="Delete" size="default" @click="batchDel">批量删除</el-button>
      </div>
    </div>
    <el-table
        v-loading="loading"
        :data="data"
        :header-cell-style="{background: '#F5F6F8'}"
        height="100%"
        highlight-current-row
        style="height: calc(100% - 140px)"
        @selection-change="selectionChange">
      <template v-slot:empty>
        暂无数据
      </template>
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column align="center" label="序号" type="index" width="100">
        <template v-slot="scope">
              <span>{{
                  (page.currentPage - 1) * page.pageSize + scope.$index + 1
                }}</span>
        </template>
      </el-table-column>
      <el-table-column label="标题" prop="title"></el-table-column>
      <el-table-column label="消息类型" prop="type"></el-table-column>
      <el-table-column label="服务主键" prop="relateUnid"></el-table-column>
      <el-table-column label="已读标志" prop="readStatus"></el-table-column>
      <el-table-column label="创建时间" prop="createTime"></el-table-column>
      <el-table-column label="逻辑删除" prop="deleteFlag"></el-table-column>
      <el-table-column label="创建人标识" prop="createUnid"></el-table-column>
      <el-table-column label="创建人名称" prop="createName"></el-table-column>
      <el-table-column label="更新人标识" prop="updateUnid"></el-table-column>
      <el-table-column label="更新名称" prop="updateName"></el-table-column>
      <el-table-column label="消息发送对象主键" prop="sendUnid"></el-table-column>
      <el-table-column label="消息发送对象名称" prop="sendName"></el-table-column>
      <el-table-column fixed="right" label="操作" width="180">
        <template v-slot="scope">
          <el-button :disabled="btnIsDisabled(scope.row)" size="default" type="text"
                     @click="editItem(scope.row,scope.index)">修改
          </el-button>
          <el-button :disabled="btnIsDisabled(scope.row)" size="default" type="text"
                     @click="delItem(scope.row,scope.index)">删除
          </el-button>
          <el-button size="default" type="text" @click="openDetails(scope.row,scope.index)">查看</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页控件 -->
    <div class="page-section">
      <span class="custom-page-total">共 {{ page.total }} 条</span>
      <el-pagination
          :current-page="page.currentPage"
          :page-size="page.pageSize"
          :page-sizes="page.pageSizes"
          :total="page.total"
          background
          layout="sizes, prev, pager, next, jumper"
          @size-change="sizeChange"
          @selection-change="selectionChange"
          @current-change="currentChange"
      >
      </el-pagination>
    </div>
    <el-dialog v-if='showDetailDialog' v-model="showDetailDialog" :before-close="handleClose" :close-on-click-modal="false"
               :title="title" customClass="customHeight" width="70%">
      <detail v-if="detail" ref="child1" :itemData="detail"/>
    </el-dialog>
    <el-dialog v-if='showAddDialog' v-model="showAddDialog" :before-close="handleClose" :close-on-click-modal="false"
               :title="title" customClass="customHeight" width="70%">
      <add ref="child1" :details="detail" v-on:closeDialog="closeDialog"/>
    </el-dialog>
  </div>
</template>

<script>
import {batchDeletion, findPage} from "@/api/abilityMessage";
import detail from "./detail"
import add from "./add"
import {searchRule} from "@/rules/rules";

export default {
  name: "list",
  components: {detail, add},
  props: [],
  data() {
    return {
      disabled: false,
      input2: '', //搜索内容
      showDetailDialog: false, //详情的dialog
      showAddDialog: false, //添加的dialog
      title: "",
      loading: false,
      loadingSearch: false,
      detail: {},
      page: {
        total: 0,
        pageSizes: [10, 20, 30, 40],
        currentPage: 1, //当前页数
        pageSize: 10, //每页显示多少条
      },
      delDataPosition: [],
      data: [],
    }
  },
  computed: {},
  watch: {},
  created() {
    this.getList();
  },
  mounted() {
  },
  beforeUnmount() {
  },
  unmounted() {
  },
  methods: {

    btnIsDisabled(row) {
      if (row) {
        return false;
      } else {
        return true;
      }
    },
    setParameter() {
      this.page.currentPage = 1;
      this.getList();
    },
    getList() {
      //获取数据
      let data = {
        size: this.page.pageSize,
        current: this.page.currentPage,
        unid: this.input2,
      };
      this.loading = true;
      findPage(data)
          .then(res => {
            this.page.total = res.data.total;
            this.data = res.data.data;

            //防止搜索时候切换标签导致缓存的currentPage索引出界返回空数据 重新定位索引获取一次数据
            if (this.page.total > 0 && this.page.currentPage > 1) {
              if (this.data == null || this.data.length == 0) {
                this.page.currentPage = 1;
                this.getList();
              }
            }
          })
          .catch(e => {
            console.log(e);
          }).finally(() => {
        this.loading = false;
        this.loadingSearch = false;
      });
    },
    closeDialog(data) {
      //提交成功关闭添加的dialog
      this.showAddDialog = false;
      if (data !== undefined) {
        //重新的标记
        this.input2 = ""; //先置空
        this.getList();
      }
    },
    editItem(row, index) { //编辑
      this.title = "修改服务消息管理表";
      this.detail = row;
      this.itemUnid = row.unid;
      this.itemData = row;
      this.isEdit = true;
      this.goIndexPage('2');
    },
    openDetails(row, index) { //详情
      this.title = "查看服务消息管理表基本信息";
      this.detail = row;
      this.itemUnid = "";
      this.itemData = row;
      this.isEdit = false;
      this.goIndexPage('3');
    },
    /*新增*/
    add() {
      this.title = "新增服务消息管理表";
      this.detail = null;
      this.itemUnid = "";
      this.itemData = null;
      this.isEdit = false;
      this.goIndexPage('2');
    },
    goIndexPage(pageType) {
      let parameter = {
        isEdit: this.isEdit,
        itemUnid: this.itemUnid,
        itemData: this.itemData,
        pageType: pageType
      };
      this.$emit("goIndexPage", parameter);
    },

    /*单个删除*/
    delItem(row) {
      this.delDataPosition = [];
      this.delDataPosition.push(row);
      this.batchDel();
    },
    batchDel() {//批量删除
      let deListUnids = [];
      if (this.delDataPosition.length > 0) {
        for (let i = 0; i < this.delDataPosition.length; i++) {
          let delValue = this.delDataPosition[i];
          let unid = delValue.unid;
          deListUnids.push(unid);
        }
        this.$confirm('是否确定删除?', '温馨提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          batchDeletion(deListUnids).then(res => {
            if (res.data.code === 200) {
              this.$message({
                message: '删除成功',
                type: 'success'
              });
              this.getList();
            }
          }).catch();
        }).catch(() => {

        });
      } else {
        this.$message({
          message: '请选择数据后，再删除',
          type: 'warning'
        });
      }
    },
    /*查询*/
    reQuery() {
      if (searchRule(this.input2)) {
        this.loadingSearch = true;
        this.page.pageSize = 10;
        this.page.currentPage = 1;
        this.getList();
      } else {
        this.$message.warning("包含特殊字符，不支持查询")
      }
    },
    /*重置*/
    reSetSelect() {
      this.input2 = '';
      this.page.pageSize = 10;
      this.page.currentPage = 1;
      this.getList();
    },
    handleClose() {
      this.showDetailDialog = false;
      this.showAddDialog = false;
    },
    sizeChange(val) {//改变 行数回调 选择一页显示多少条的回调  改变行数当前页回到初始1, 条数用返回值
      this.page.currentPage = 1;
      this.page.pageSize = val;
      this.getList();
    },
    selectionChange(list) {//多选回调
      this.delDataPosition = list;
    },
    currentChange(val) { //点击页码改变回调
      this.page.currentPage = val;
      this.getList();
    },
  },
}
</script>

<style lang="scss" scoped>

</style>
