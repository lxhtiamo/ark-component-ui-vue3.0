<!--服务消息管理表列表-->
<template>
    <div class="table-content" style="margin-top: 10px">
        <div class="search">
            <div class="search-div" style="margin-right: 12px"><span>unid</span>
                <el-divider direction="vertical"></el-divider>
                <el-input clearable class="search-input-style" style="width:200px!important;"
                          placeholder="请输入unid"
                          v-model.trim="input2" size="default" @keyup.enter="reQuery">
                </el-input>
            </div>
            <el-button type="primary" icon="Search" size="default" @click="reQuery" :loading="loadingSearch">查 询</el-button>
            <el-button icon="Refresh" size="default" @click="reSetSelect">重 置</el-button>
            <div style="margin: 10px 0">
                <el-button icon="Plus" size="default" type="primary" @click="add">新增</el-button>
                <el-button icon="Delete" size="default" @click="batchDel">批量删除</el-button>
            </div>
        </div>
        <el-table
            style="height: calc(100% - 140px)"
            height="100%"
                  v-loading="loading"
                  highlight-current-row
                  :data="data"
                  :header-cell-style="{background: '#F5F6F8'}"
                  @selection-change="selectionChange">
            <template v-slot:empty>
                暂无数据
            </template>
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column type="index" label="序号" width="100" align="center">
                <template v-slot="scope">
              <span>{{
                (page.currentPage - 1) * page.pageSize + scope.$index + 1
              }}</span>
                </template>
            </el-table-column>
            <el-table-column prop="title" label="标题"></el-table-column>
            <el-table-column prop="type" label="消息类型"></el-table-column>
            <el-table-column prop="relateUnid" label="服务主键"></el-table-column>
            <el-table-column prop="readStatus" label="已读标志"></el-table-column>
            <el-table-column prop="createTime" label="创建时间"></el-table-column>
            <el-table-column prop="deleteFlag" label="逻辑删除"></el-table-column>
            <el-table-column prop="createUnid" label="创建人标识"></el-table-column>
            <el-table-column prop="createName" label="创建人名称"></el-table-column>
            <el-table-column prop="updateUnid" label="更新人标识"></el-table-column>
            <el-table-column prop="updateName" label="更新名称"></el-table-column>
            <el-table-column prop="sendUnid" label="消息发送对象主键"></el-table-column>
            <el-table-column prop="sendName" label="消息发送对象名称"></el-table-column>
            <el-table-column fixed="right" label="操作" width="180">
                <template v-slot="scope">
                    <el-button type="text" size="default" @click="editItem(scope.row,scope.index)"
                               :disabled="btnIsDisabled(scope.row)">修改
                    </el-button>
                    <el-button type="text" size="default" @click="delItem(scope.row,scope.index)"
                               :disabled="btnIsDisabled(scope.row)">删除
                    </el-button>
                    <el-button type="text" size="default" @click="openDetails(scope.row,scope.index)">查看</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!-- 分页控件 -->
        <div class="page-section">
            <span class="custom-page-total">共 {{ page.total }} 条</span>
            <el-pagination
                    background
                    @size-change="sizeChange"
                    @selection-change="selectionChange"
                    @current-change="currentChange"
                    :current-page="page.currentPage"
                    :page-sizes="page.pageSizes"
                    :page-size="page.pageSize"
                    layout="sizes, prev, pager, next, jumper"
                    :total="page.total"
            >
            </el-pagination>
        </div>
        <el-dialog :close-on-click-modal="false" v-model="showDetailDialog" v-if='showDetailDialog' :title="title"
                   :before-close="handleClose" width="70%" customClass="customHeight">
            <detail :itemData="detail" v-if="detail" ref="child1"/>
        </el-dialog>
        <el-dialog :close-on-click-modal="false" v-model="showAddDialog" v-if='showAddDialog' :title="title"
                   :before-close="handleClose" width="70%" customClass="customHeight">
            <add :details="detail" v-on:closeDialog="closeDialog" ref="child1"/>
        </el-dialog>
    </div>
</template>

<script>
    import {findPage, batchDeletion} from "@/api/abilityMessage";
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
                      this.data.push(...this.data)
                      this.data.push(...this.data)
                      this.data.push(...this.data)
                      this.data.push(...this.data)

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
