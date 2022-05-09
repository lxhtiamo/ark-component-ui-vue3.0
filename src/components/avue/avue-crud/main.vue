<template>
  <div :class="b()">
    <el-card :class="b('box')">
      <template v-if="vaildData(tableOption.title,false) || vaildData(tableOption.dateBtn,config.dateBtn)" #header>
        <div
            :class="b('title')">
          <span>{{ tableOption.title }}</span>
        </div>
      </template>

      <div v-if="vaildData(tableOption.header,true)"
           :class="b('header')">
        <el-form v-if="searchShow && searchFlag"
                 ref="searchForm"
                 :inline="true"
                 :model="searchForm"
                 style="display: flex;align-items: center">
          <slot name="search"></slot>
          <el-form-item>
            <el-button :icon="config.searchBtnIcon"
                       :size="isMediumSize"
                       type="primary"
                       @click="searchChange">{{ config.searchBtnTitle }}
            </el-button>
            <el-button :icon="config.emptyBtnIcon"
                       :size="isMediumSize"
                       @click="searchReset">{{ config.emptyBtnTitle }}
            </el-button>
            <slot name="searchMenu"></slot>
          </el-form-item>
        </el-form>
      </div>
      <!-- 表格功能列 -->
      <div v-if="vaildData(tableOption.header,true)"
           :class="b('menu')">
        <div :class="b('left')">
          <slot name="menuLeft"></slot>
        </div>
        <div :class="b('right')">
          <slot name="menuRight"></slot>
        </div>
      </div>
      <div v-if="vaildData(tableOption.tip,config.tip) && tableOption.selection" class="avue-crud__tip">
        <span class="avue-crud__tip-name">
          {{ config.tipStartTitle }}
          <span class="avue-crud__tip-count">{{ selectLen }}</span>
          {{ config.tipEndTitle }}
        </span>
        <slot name="tip"></slot>
      </div>
      <el-table ref="table"
                v-loading="tableLoading"
                :border="tableOption.border"
                :cell-class-name="cellClassName"
                :data="list"
                :default-expand-all="tableOption.defaultExpandAll"
                :default-sort="tableOption.defaultSort"
                :empty-text="tableOption.emptyText"
                :expand-row-keys="tableOption.expandRowKeys"
                :header-cell-class-name="headerCellClassName"
                :height="tableOption.height=='auto'?(clientHeight - vaildData(tableOption.calcHeight,config.calcHeight)):tableOption.height"
                :highlight-current-row="tableOption.highlightCurrentRow"
                :max-height="tableOption.maxHeight"
                :row-class-name="rowClassName"
                :row-key="handleGetRowKeys"
                :show-header="tableOption.showHeader"
                :show-summary="tableOption.showSummary"
                :size="controlSize"
                :span-method="tableSpanMethod"
                :stripe="tableOption.stripe"
                :summary-method="tableSummaryMethod"
                :width="setPx(tableOption.width,config.width)"
                @select="select"
                @current-change="currentRowChange"
                @expand-change="expandChange"
                @row-click="rowClick"
                @row-dblclick="rowDblclick"
                @selection-change="selectionChange"
                @select-all="selectAll"
                @sort-change="sortChange">
        <!-- 暂无数据提醒 -->
        <template #empty>
          <slot v-if="$slots.empty"
                name="empty"></slot>
          <span v-else
                style="cursor:pointer"
                @click="refreshChange">暂无数据，点击刷新</span>
        </template>
        <!-- 折叠面板  -->
        <el-table-column v-if="tableOption.expand"
                         align="center"
                         fixed="left"
                         type="expand"
                         width="50">
          <template #default="props">
            <slot :row="props.row"
                  name="expand"></slot>
          </template>
        </el-table-column>
        <!-- 选择框 -->
        <el-table-column v-if="tableOption.selection"
                         :selectable="tableOption.selectable"
                         align="center"
                         fixed="left"
                         type="selection"
                         width="50"></el-table-column>
        <!-- 序号 -->
        <el-table-column v-if="tableOption.index"
                         :index="indexMethod"
                         :label="vaildData(tableOption.indexLabel,config.indexLabel)"
                         align="center"
                         fixed="left"
                         type="index"
                         width="80"></el-table-column>
        <!-- 循环列 -->
        <el-table-column
            v-for="(column,index) in columnOption"
            :key="index"
            :align="vaildData(column.align,tableOption.align)"
            :filter-method="column.filterMethod"
            :filter-multiple="vaildData(column.filterMultiple,config.filterMultiple)"
            :filters="column.filters"
            :fixed="column.fixed"
            :header-align="vaildData(column.headerAlign,tableOption.headerAlign)"
            :label="column.label"
            :min-width="column.minWidth"
            :prop="column.prop"
            :show-overflow-tooltip="column.overHidden"
            :sortable="column.sortable"
            :width="column.width"
            filter-placement="bottom-end">
          <template v-if="columnIndex.indexOf(column.prop)!=-1" #default="scope">
            <template v-if="cellEditFlag(scope.row,column)">
              <component :is="getSearchType(column.type)"
                         v-model="scope.row[column.prop]"
                         :clearable="vaildData(column.clearable,false)"
                         :defaultExpandAll="column.defaultExpandAll"
                         :dic="DIC[column.prop]"
                         :disabled="btnDisabled"
                         :format="column.format"
                         :multiple="column.multiple"
                         :parent="column.parent"
                         :placeholder="column.label"
                         :props="column.props || tableOption.props"
                         :type="getType(column)"
                         :value-format="column.valueFormat"
                         size="mini">
              </component>
            </template>
            <slot v-else-if="column.solt"
                  :dic="DIC[column.prop]"
                  :label="detail(scope.row,column)"
                  :name="column.prop"
                  :row="scope.row"></slot>
            <template v-else>
              <span v-html="detail(scope.row,column)"></span>
            </template>
          </template>
        </el-table-column>
        <el-table-column v-if="vaildData(tableOption.menu,config.menu)"
                         :align="tableOption.menuAlign"
                         :header-align="tableOption.menuHeaderAlign"
                         :label="config.menuTitle"
                         :width="vaildData(tableOption.menuWidth,config.menuWidth)"
                         fixed="right">
          <template #default="scope">
            <el-dropdown v-if="menuType==='menu'"
                         style="margin-right:9px;">

            </el-dropdown>
            <template v-else-if="['button','text','icon'].includes(menuType)">
              <el-button v-if="vaildData(tableOption.cellBtn ,config.cellBtn)"
                         :disabled="btnDisabled"
                         :icon="scope.row.$cellEdit?config.cellSaveBtnIcon:config.cellEditBtnIcon"
                         :size="isMediumSize"
                         :type="menuText('primary')"
                         @click.stop="rowCell(scope.row,scope.$index)">
                {{ menuIcon(scope.row.$cellEdit ? config.cellSaveBtnTitle : config.cellEditBtnTitle) }}
              </el-button>
              <el-button v-if="vaildData(tableOption.viewBtn,config.viewBtn)"
                         :disabled="btnDisabled"
                         :icon="config.viewBtnIcon"
                         :size="isMediumSize"
                         :type="menuText('success')"
                         @click.stop="rowView(scope.row,scope.$index)">{{ menuIcon(config.viewBtnTitle) }}
              </el-button>
              <el-button v-if="vaildData(tableOption.editBtn,config.editBtn)"
                         :disabled="btnDisabled"
                         :icon="config.editBtnIcon"
                         :size="isMediumSize"
                         :type="menuText('primary')"
                         @click.stop="rowEdit(scope.row,scope.$index)">{{ menuIcon(config.editBtnTitle) }}
              </el-button>
              <el-button v-if="vaildData(tableOption.delBtn,config.delBtn)"
                         :disabled="btnDisabled"
                         :icon="config.delBtnIcon"
                         :size="isMediumSize"
                         :type="menuText('danger')"
                         @click.stop="rowDel(scope.row,scope.$index)">{{ menuIcon(config.delBtnTitle) }}
              </el-button>
            </template>
            <slot :dic="scope.dic"
                  :disabled="btnDisabled"
                  :index="scope.$index"
                  :label="scope.label"
                  :row="scope.row"
                  :size="isMediumSize"
                  :type="menuText()"
                  name="menu"></slot>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <div v-if="pageFlag" :class="b('pagination')"
           style="display: flex;align-items: center;justify-content: flex-end;">
        <el-pagination :background="vaildData(defaultPage.pageBackground,config.pageBackground)"
                       :current-page="defaultPage.currentPage"
                       :page-size="defaultPage.pageSize"
                       :page-sizes="defaultPage.pageSizes"
                       :total="defaultPage.total"
                       layout="total, sizes, prev, pager, next, jumper"
                       @size-change="sizeChange"
                       @current-change="currentChange"></el-pagination>
      </div>
    </el-card>
  </div>
</template>
<script>
import create from "../utils/create";
import crud from "../mixins/crud.js";
import column from "../mixins/column.js";
import config from "./config.js";
import {asyncValidator, validatenull} from "../utils/validate.js";

export default create({
  name: "crud",
  mixins: [crud(), column()],
  components: {},
  data() {
    return {
      clientHeight: document.documentElement.clientHeight,
      defaultForm: {
        tableForm: {},
        searchForm: {}
      },
      defaultPage: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 10, // 每页显示多少条
        pageSizes: [10, 20, 30, 40, 50, 100],
        background: true // 背景颜色
      },
      defaultParam: ["$index"],
      keyBtn: false,
      config: config,
      list: [],
      searchShow: true,
      searchForm: {},
      boxVisible: false,
      boxType: "add",
      columnIndex: [],
      columnBox: false,
      columnList: [],
      tableForm: {},
      tableOption: {},
      tableFormRules: {},
      tableIndex: -1,
      tableSelect: []
    };
  },
  created() {
    // 初始化数据
    this.dataInit();
    // 初始化列
    this.columnInit();
    // 初始化数据
    this.formInit();
    //初始化字典
    this.handleLoadDic();
    //初始化分页
    this.pageInit();
    this.$emit("on-load", this.defaultPage);
  },
  computed: {
    idKey() {
      return this.tableOption.idKey || "id";
    },
    btnDisabled() {
      return this.keyBtn && this.tableOption.cellBtn;
    },
    pageFlag() {
      return !validatenull(this.page.total);
    },
    dialogTitle() {
      const key = `${this.boxType}Title`;
      return this.tableOption[key] || this.config[key];
    },
    columnOption() {
      return this.tableOption.column || [];
    },
    sumColumnList() {
      return this.tableOption.sumColumnList || [];
    },
    selectLen() {
      return this.tableSelect ? this.tableSelect.length : 0;
    },
    searchFlag() {
      if (this.$slots.search) return true;
      else return !validatenull(this.searchForm);
    },
    formOption() {
      let option = this.deepClone(this.tableOption);
      option.submitBtn = false;
      option.submitPostion = "right";
      option.boxType = this.boxType;
      option.dicFlag = false;
      option.dicData = this.DIC;
      option.emptyBtn = false;
      return option;
    }
  },
  watch: {
    tableForm: {
      handler() {
        this.$emit("input", this.tableForm);
      },
      deep: true
    },
    value: {
      handler() {
        this.formVal();
      },
      deep: true
    },
    page: {
      handler() {
        this.pageInit();
      },
      deep: true
    },
    columnOption() {
      this.columnInit();
    },
    data() {
      this.dataInit();
    }
  },
  props: {
    permission: {
      type: Object,
      default: () => {
        return {};
      }
    },
    value: {
      type: Object,
      default: () => {
        return {};
      }
    },
    spanMethod: Function,
    summaryMethod: Function,
    beforeClose: Function,
    beforeOpen: Function,
    rowClassName: Function,
    cellClassName: Function,
    headerCellClassName: Function,
    uploadBefore: Function,
    uploadAfter: Function,
    page: {
      type: Object,
      default() {
        return {};
      }
    },
    tableLoading: {
      type: Boolean,
      default: false
    },
    data: {
      type: Array,
      required: true,
      default: () => {
        return [];
      }
    }
  },
  methods: {
    handleGetRowKeys(row) {
      const idKey = row[this.idKey];
      return idKey;
    },
    menuIcon(value) {
      return this.menuType === "icon" ? "" : value;
    },
    menuText(value) {
      return this.menuType === "text" ? "text" : value;
    },
    closeDialog() {
      this.tableIndex = -1;
      this.tableForm = {};
      this.boxVisible = false;
      this.keyBtn = false;
      this.hide();
    },
    selectClear() {
      this.$refs.table.clearSelection();
    },
    indexMethod(index) {
      return (
          index +
          1 +
          ((this.defaultPage.currentPage || 1) - 1) *
          (this.defaultPage.pageSize || 10)
      );
    },
    refreshChange() {
      this.$emit("refresh-change", {
        page: this.defaultPage,
        searchForm: this.searchForm
      });
    },
    pageInit() {
      this.defaultPage.total = this.page.total || 0;
      this.defaultPage.currentPage = this.page.currentPage || 1;
      this.defaultPage.pageSize = this.page.pageSize || 10;
      this.defaultPage.pageSizes = this.page.pageSizes || [
        10,
        20,
        30,
        40,
        50,
        100
      ];
      this.defaultPage.background = this.page.background || true;
    },
    rulesInit() {
      this.tableFormRules = {};
      this.columnOption.forEach(ele => {
        if (ele.rules) this.tableFormRules[ele.prop] = ele.rules;
      });
    },
    columnInit: function () {
      const safe = this;
      this.columnIndex = [];
      this.columnList = [];

      function addChild(list) {
        list.forEach((ele, index) => {
          const children = ele.children;
          if (!validatenull(children)) {
            safe.tableOption.columnBtn = false;
            addChild(children);
          }
          if (validatenull(ele.hide)) safe.columnIndex.push(ele.prop);
          if (ele.showClomnu !== false) {
            let obj = {
              label: ele.label,
              prop: ele.prop,
              index: index
            };
            safe.columnList.push(safe.deepClone(obj));
          }
        });
      }

      addChild(this.columnOption);
    },
    formVal() {
      Object.keys(this.value).forEach(ele => {
        this.tableForm[ele] = this.value[ele];
      });
      this.$emit("input", this.tableForm);
    },
    dataInit() {
      this.list = [].concat(this.data);
      //初始化序号
      this.list.forEach((ele, index) => {
        ele.$index = index;
      });
    },
    formInit() {
      this.defaultForm = this.formInitVal(this.columnOption);
      this.searchForm = this.deepClone(this.defaultForm.searchForm);
      this.searchShow = this.vaildData(
          this.tableOption.searchShow,
          this.config.searchShow
      );
    },
    // 搜索清空
    searchReset() {
      this.$refs["searchForm"].resetFields();
      this.$emit("search-reset");
    },
    // 页大小回调
    sizeChange(val) {
      this.defaultPage.currentPage = 1;
      this.defaultPage.pageSize = val;
      this.$emit("on-load", this.defaultPage);
      this.$emit("size-change", val);
    },
    //日期组件回调
    dateChange(val) {
      this.$emit("date-change", val);
    },
    //展开或则关闭
    expandChange(row, expand) {
      this.expandList = [...expand];
      this.$emit("expand-change", row, expand);
    },
    // 页码回调
    currentChange(val) {
      this.$emit("on-load", this.defaultPage);
      this.$emit("current-change", val);
    },
    //设置单选
    currentRowChange(currentRow, oldCurrentRow) {
      this.$emit("current-row-change", currentRow, oldCurrentRow);
    },

    toggleRowSelection(row, selected) {
      this.$refs.table.toggleRowSelection(row, selected);
    },
    toggleRowExpansion(row, expanded) {
      this.$refs.table.toggleRowExpansion(row, expanded);
    },
    //设置多选选中
    setCurrentRow(row) {
      this.$refs.table.setCurrentRow(row);
    },
    // 选中实例
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.table.toggleRowSelection(row);
        });
      } else {
        this.$refs.table.clearSelection();
      }
    },
    // 选择回调
    selectionChange(val) {
      this.tableSelect = val;
      this.$emit("selection-change", this.tableSelect);
    },
    // 单个选择回调
    select(selection, row) {
      this.$emit("select", selection, row);
    },
    // 点击勾选全选 Checkbox
    selectAll(selection) {
      this.$emit("select-all", selection);
    },
    // 排序回调
    sortChange(val) {
      this.$emit("sort-change", val);
    },
    // 搜索回调
    searchChange() {
      this.$emit("search-change", this.searchForm);
    },
    // 行双击
    rowDblclick(row, event) {
      this.$emit("row-dblclick", row, event);
    },
    // 行单机
    rowClick(row, event, column) {
      this.$emit("row-click", row, event, column);
    },
    // 新增
    rowAdd() {
      this.boxType = "add";
      this.tableForm = this.deepClone(this.defaultForm.tableForm);
      this.clearDefaultParam();
      this.$emit("input", this.tableForm);
      this.show();
    },
    rowCell(row, index) {
      if (row.$cellEdit) this.rowCellUpdate(row, index);
      else this.rowCellEdit(row, index);
    },
    // 编辑
    rowEdit(row, index) {
      this.tableForm = this.deepClone(row);
      this.clearDefaultParam();
      this.$emit("input", this.tableForm);
      this.tableIndex = index;
      this.boxType = "edit";
      this.show();
    },
    // 单元格编辑
    rowCellEdit(row, index) {
      row.$cellEdit = !row.$cellEdit;
      //this.$set(this.list, index, row);
    },
    //单元格更新
    rowCellUpdate(row, index) {
      asyncValidator(this.tableFormRules, row)
          .then(res => {
            this.keyBtn = true;
            this.$emit(
                "row-update",
                row,
                index,
                () => {
                  row.$cellEdit = !row.$cellEdit;
                  //this.$set(this.list, index, row);
                },
                () => {
                  this.keyBtn = false;
                }
            );
          })
          .catch(errors => {
            this.$message.warning(errors[0]);
          });
    },
    //查看
    rowView(row, index) {
      this.tableForm = this.deepClone(row);
      this.clearDefaultParam();
      this.$emit("input", this.tableForm);
      this.tableIndex = index;
      this.boxType = "view";
      this.keyBtn = true;
      this.show();
    },
    // 删除
    rowDel(row, index) {
      this.$emit("row-del", row, index);
    },
    // 保存
    rowSave() {
      this.$refs["tableForm"].validate(vaild => {
        if (vaild) {
          this.keyBtn = true;
          this.$emit(
              "row-save",
              this.deepClone(this.tableForm),
              this.closeDialog,
              () => {
                this.keyBtn = false;
              }
          );
        }
      });
    },
    // 更新
    rowUpdate() {
      this.$refs["tableForm"].validate(vaild => {
        if (vaild) {
          this.keyBtn = true;
          const index = this.tableIndex;
          this.$emit(
              "row-update",
              this.deepClone(this.tableForm),
              index,
              this.closeDialog,
              () => {
                this.keyBtn = false;
              }
          );
        }
      });
    },
    // 显示表单
    show(cancel) {
      const callack = () => {
        if (cancel !== true) {
          this.boxVisible = true;
          this.$nextTick(() => {
            this.$refs["tableForm"].clearValidate();
          });
        }
      };
      if (typeof this.beforeOpen === "function")
        this.beforeOpen(callack, this.boxType);
      else callack();
    },
    // 隐藏表单
    hide(cancel) {
      const callack = () => {
        if (cancel !== false) {
          this.$refs["tableForm"].resetForm();
          this.$refs["tableForm"].clearValidate();
        }
      };
      if (typeof this.beforeClose === "function")
        this.beforeClose(callack, this.boxType);
      else callack();
    },
    //清空多余字段
    clearDefaultParam() {
      this.defaultParam.forEach(ele => {
        delete this.tableForm[ele];
      });
    },
    //清空表单
    resetForm() {
      this.$refs["tableForm"].resetForm();
      this.$emit("input", this.tableForm);
    },
    //合并行
    tableSpanMethod(param) {
      if (typeof this.spanMethod === "function") return this.spanMethod(param);
    },
    //合集统计逻辑
    tableSummaryMethod(param) {
      //如果自己写逻辑则调用summaryMethod方法
      if (typeof this.summaryMethod === "function")
        return this.summaryMethod(param);
      const {columns, data} = param;
      const sums = [];
      if (columns.length > 0) {
        columns.forEach((column, index) => {
          let currItem = this.sumColumnList.find(
              item => item.name === column.property
          );
          if (index === 0) {
            sums[index] = this.tableOption.sumText || config.sumText;
          } else if (currItem) {
            switch (currItem.type) {
              case "count":
                sums[index] = "计数:" + data.length;
                break;
              case "avg":
                // eslint-disable-next-line no-case-declarations
                let avgValues = data.map(item => Number(item[column.property]));
                let nowindex = 1;
                sums[index] = avgValues.reduce((perv, curr) => {
                  let value = Number(curr);
                  if (!isNaN(value)) {
                    return (perv + curr) / nowindex++;
                  } else {
                    return perv;
                  }
                }, 0);
                sums[index] = "平均:" + sums[index].toFixed(2);
                break;
              case "sum":
                // eslint-disable-next-line no-case-declarations
                let values = data.map(item => Number(item[column.property]));
                sums[index] = values.reduce((perv, curr) => {
                  let value = Number(curr);
                  if (!isNaN(value)) {
                    return perv + curr;
                  } else {
                    return perv;
                  }
                }, 0);
                sums[index] = "合计:" + sums[index].toFixed(2);
                break;
            }
          } else {
            sums[index] = "-";
          }
        });
      }
      return sums;
    }
  }
});
</script>
