<template>
  <el-container class="el-contain-div">
    <el-header class="topParentHeader">
      <publicSubTop title="操作日志管理">
      </publicSubTop>
    </el-header>
    <el-main>
      <div class="table-content">
        <div class="search">
          <search
            style="float: right"
            placeholder="根据菜单名称搜索"
            @searchData="test"
            ref="searchVue"
          ></search>
        </div>
        <el-table
          height="calc(100% - 90px)"
          v-loading="tableLoading"
          highlight-current-row
          :data="tableData"
          :cell-style="rowStyleLeft"
          :header-cell-style="headClassLeft"
        >
          <template slot="empty">
            暂无数据
          </template>
          <el-table-column type="index" label="序号">
            <template slot-scope="scope">
              <span>{{
                (page.currentPage - 1) * page.pageSize + scope.$index + 1
              }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="operatorName" label="操作人名称">
          </el-table-column>
          <el-table-column prop="operatorIp" label="操作人IP">
          </el-table-column>
          <el-table-column prop="systemName" label="系统名称">
          </el-table-column>
          <el-table-column prop="menu" label="菜单名称"> </el-table-column>
          <el-table-column prop="content" label="操作内容"> </el-table-column>
          <el-table-column prop="sucessFlag" label="操作结果" width="100">
            <template slot-scope="scope">
              <span>{{ scope.row.sucessFlag ? "成功" : "失败" }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="operateTime" label="操作时间" width="180">
          </el-table-column>
          <el-table-column fixed="right" label="操作" width="180">
            <template slot-scope="scope">
              <el-button
                type="text"
                @click="getDetail(scope.row.unid)"
                size="small"
                >查看</el-button
              >
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页控件 -->
        <div class="page-section flex-row" style="background-color: white">
          <span class="custom-page-total">共 {{ page.total }} 条</span>
          <el-pagination
            background
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="page.currentPage"
            :page-sizes="page.pageSizes"
            :page-size="page.pageSize"
            layout="sizes, prev, pager, next, jumper"
            :total="page.total"
          >
          </el-pagination>
        </div>
        <detail ref="detail" :unid="unid"></detail>
      </div>
    </el-main>
  </el-container>
</template>

<script>
import detail from "./detail";
import { findOperateLogPage } from "../../api/operate-log";
import * as publicRule from "../../rules/rules.js";
import publicSubTop from '../../public/publicSubTop'
let ids = [];
  export default {
  components: {
    detail,publicSubTop
  },
  data() {
    return {
      formInline: {
        name: "",
        areaCode: "",
        flag: 2
      },
      addDialogVisible: false,
      dialogFlag: "",
      dialogFormVisible: false,
      dictList: [],
      detail: [],
      isEdit: false,
      queryType: "2",
      searchPlaceholder: "根据菜单名称搜索",
      showDetailDialog: false, //详情的dialog
      search: "", //搜索框
      tableData: [], //表格的数据
      tableLoading: false,
      tableObj: {},
      page: {
        total: 0, //总条数
        currentPage: 1, //当前页数
        pageSize: 10, //每页显示多少条
        pageSizes: [10, 20, 30, 50, 100], //分页的数组分段
      },
      grade: {
        box: false,
        check: []
      },
      treeCurrentNode: {},
      elementsForm: {},
      mappedElementsForm: {},
      unid: "",
      sortSign: "desc"
    };
  },
  mounted() {},
  created() {
    this.getList();
  },
  methods: {
    test() {
      publicRule.passHtmlAndSql(null, this.formInline.name, err => {
        if (err) {
          this.$message.error(err.message);
        } else {
          this.page.currentPage=1;
          this.handleList();
        }
      });
    },
    headClassLeft() {
      return "height:48px !important;padding:0px;font-size: 14px;color: #666 !important;background-color: #f5f6f8 !important;border: none !important;";
    },
    rowStyleLeft() {
      return "padding:0px;height:48px;font-family: PingFang SC;font-size: 14px;font-weight: normal;font-stretch: normal;line-height: 48px;letter-spacing: 0px;color: #666;";
    },
    sortChange(column) {
      if (column.order === "descending") {
        this.sortSign = "desc";
      } else {
        this.sortSign = "asc";
      }
      this.getList();
    },
    handleList() {
      this.formInline.name = this.$refs.searchVue.getContent().trim();
      this.getList();
    },
    validate() {
      publicRule.passHtmlAndSql(null, this.formInline.name, err => {
        if (err) {
          this.$message.error(err.message);
        } else {
          this.getList();
        }
      });
    },
    onSubmit() {
      this.validate();
    },
    getDetail(id) {
      this.unid = id;
      this.$refs.detail.setTrue();
    },
    refreshChange() {
      this.loading = true;
      this.getList();
    },
    selectionChange: function(list) {
      //多选回调
      ids = [];
      for (let i = 0; i < list.length; i++) {
        ids[i] = list[i].unid;
      }
    },
    searchData() {
      this.search = this.$refs.searchVue.getContent().trim();
      this.getList();
    },
    currentChange(val) {
      //点击页码改变回调
      this.page.currentPage = val;
      this.getList();
    },
    handleSizeChange(pageSize) {
      this.page.pageSize = pageSize;
      this.getList();
    },
    handleCurrentChange(val) {
      this.page.currentPage = val;
      this.getList();
    },
    handleRefreshChange(page) {
      this.getList();
      this.$notify({
        message: `刷新数据成功${JSON.stringify(page)}`,
        type: "success"
      });
    },
    getList() {
      //获取数据
      findOperateLogPage(
          this.page.pageSize,
          this.page.currentPage,
          this.formInline.name,
          null,
          this.sortSign
      )
          .then(res => {
            this.loading = false;
            this.page.total = res.data.total;
            this.tableData = res.data.data;
          })
          .catch();
    }
  }
};
</script>
<style lang="scss">

.table-container {
  padding: 8px 10px;
}

.cell {
  .is-disabled {
    .el-switch__core {
      border-color: #6f7180 !important;
      background-color: #6f7180 !important;
    }
    .is-active {
      span {
        color: #b4bccc;
      }
    }
  }
}
.catalogElementsCrud {
  max-width: 100%;
  .avue-crud__box .el-card__body,
  .avue-crud__box .el-card__header {
    padding: 20px;
  }
  .avue-crud__header {
    display: none;
  }
}
</style>
