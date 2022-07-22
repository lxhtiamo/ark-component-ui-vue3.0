<template>
  <el-container class="el-contain-div">
    <el-header class="topParentHeader" style="height: 60px">
      <publicSubTop :title="title">
      </publicSubTop>
    </el-header>
    <el-main style="display: flex">
      <div style="display: flex;width: 100%">
        <div style="width: 30%;overflow: hidden;padding-left: 10px!important;padding-right: 10px;"
             class="el-main-tree org-tree-node-content">
          <div style="height: 50px;display: flex;align-items: center">
            <el-input placeholder="请输入搜索内容" style="margin-bottom: 5px" v-model="searchName" @keyup.enter="search"
                      clearable @clear="clearSearch" maxlength="20">
              <template v-slot:suffix>
                <el-icon @click="search" style="padding: 9px;cursor: pointer"><Search /></el-icon>
              </template>
            </el-input>
          </div>
          <el-tree
              style="width: 100%;height: calc( 100% - 40px);overflow: auto"
              :data="data"
              :props="option"
              lazy
              ref="tree"
              :highlight-current="true"
              check-on-click-node
              :expand-on-click-node="false"
              :default-checked-keys="[checkedKey]"
              :filter-node-method="filterNode"
              @node-click="handleNodeClick"
              @node-expand="handleNodeExpand"
              :node-key="option.nodeKey">
            <template v-slot="{ node, data }">
               <span class="org-tree-node"
                     @mouseenter="data.is_show=true"
                     @mouseleave="data.is_show=false">
                        <span class="tree-label" :title="node.label">{{ node.label }}</span>
                        <span v-show="data.is_show">
                             <span style="padding: 0 10px" @click.stop="onReset(node, data)" v-if="node.level==1"
                                   title="序列号重排">
                               <el-icon style="cursor: pointer;color: #4955b8"><UploadFilled/></el-icon>
                            </span>
                            <span style="padding: 0 10px" @click.stop="append(node, data)"
                                  title="新增子机构">
                              <el-icon style="cursor: pointer;color: #4955b8"><Plus/></el-icon>
                            </span>
                            <span style="padding: 0 10px" @click.stop="remove(node, data)" title="删除">
                                 <el-icon style="cursor: pointer;color: #4955b8"><Delete/></el-icon>
                            </span>
                            <span style="padding: 0 10px" @click.stop="refresh(node, data)"
                                  title="刷新">
                                  <el-icon style="cursor: pointer;color: #4955b8"><refresh/></el-icon>
                            </span>
                          <!--<el-button type="text" size="mini">新增</el-button>
                          <el-button type="text" size="mini">删除</el-button>
                          <el-button type="text" size="mini">刷新</el-button>-->
                        </span>
                      </span>
            </template>
          </el-tree>
        </div>
        <div style="width: 2px;height: 100%;border-right: 1px solid #E2E2E2"></div>
        <div style=" background: #fff;flex: 1;border-radius: 4px;">
          <template v-if="data.length>0">
            <div class="formCircleStyle">
              <el-form ref="editForm" :model="editForm" label-width="180px" style="margin-right: 30px;margin-top: 10px"
                       :rules="rules">
                <el-form-item label="上级机构" v-if="showHigherName&&currentLevel>1">
                  <div class="append">
                    <el-input v-model="editForm.higherName" disabled placeholder="请选择上级机构">
                      <!--                                            <template slot="append">
                                                                      <span slot="append" @click="addDept" class="spanText" style="cursor: pointer">选择</span>
                                                                  </template>-->
                    </el-input>
                  </div>
                </el-form-item>
                <el-form-item label="机构名称" prop="name">
                  <el-input maxlength="50" placeholder="请填写组织架构名称"
                            v-model="editForm.name"></el-input>
                </el-form-item>
                <el-form-item label="机构级别" prop="standard">
                  <el-select
                      style="width: 100%;"
                      v-model="editForm.standard"
                      placeholder="请选择机构级别">
                    <el-option
                        v-for="(item,key) in orgLevelList"
                        :key="key"
                        :label="item.dictName"
                        :value="item.dictValue">
                    </el-option>
                  </el-select>

                </el-form-item>
                <el-form-item label="机构类型" prop="nature">
                  <el-select
                      style="width: 100%;"
                      v-model="editForm.nature"
                      placeholder="请选择机构类型">
                    <el-option
                        v-for="(item,key) in orgTypeList"
                        :key="key"
                        :label="item.dictName"
                        :value="item.dictValue">
                    </el-option>
                  </el-select>

                </el-form-item>

                <el-form-item label="地区编码" prop="regionCode">
                  <el-input maxlength="12" placeholder=""
                            v-model="editForm.regionCode"></el-input>
                </el-form-item>
                <el-form-item label="机构编码" prop="deptCode">
                  <el-input maxlength="20" placeholder=""
                            v-model="editForm.deptCode"></el-input>
                </el-form-item>
                <!--                                <el-form-item label="统一社会信用代码" prop="classValue">
                                                    <el-input maxlength="32" placeholder=""
                                                              v-model="editForm.classValue"></el-input>
                                                </el-form-item>-->
                <el-form-item label="排序" prop="sortNum">
                  <el-input-number v-model="editForm.sortNum" :min="0" :max="10000"
                                   label="请输入排序"></el-input-number>
                </el-form-item>
                <el-form-item label="状态 " prop="status">
                  <el-radio-group v-model="editForm.status">
                    <el-radio label="0">启用</el-radio>
                    <el-radio label="1">禁用</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="update" size="default" icon="Check" :loading="loadingBtn">
                    修改
                  </el-button>
                </el-form-item>
              </el-form>
            </div>
          </template>
          <template v-else>
            <div style="display: flex;justify-content: center;align-items: center;width: 100%;height: 100%">
              <empty empty-content="从左侧选择一个类型进行编辑或新建一个组织架构">
              </empty>
            </div>
          </template>
        </div>
        <el-dialog :close-on-click-modal="false" v-model="showAddDialog" v-if='showAddDialog'
                   :title="dialogTitle"
                   :before-close="handleClose" width="50%">
          <add :detail="detail" v-on:onCloseAdd="closeDialog" ref="add"></add>
        </el-dialog>
      </div>
    </el-main>
    <el-dialog :close-on-click-modal="false" title="选择上级机构" customClass="orgDialogHeight" width="35%"
               v-model="openTreeDialog"
               append-to-body v-if='openTreeDialog'>

      <selectDepartment @closeTreeDialog="closeTreeDialog" @treeData="treeData" :isMyShow="true"
                        ref="selectArea"></selectDepartment>

    </el-dialog>
    <el-dialog :close-on-click-modal="false"
               :close-on-press-escape="false"
               v-model="openLoadingDialog"
               append-to-body v-if='openLoadingDialog'
               width="300px" custom-class="previewDialog">
      <div style="display: flex;align-items: center;justify-content: center;flex-direction: column">
        <div v-loading="true" style="height: 200px;width: 200px">

        </div>
        <div>
          {{ resetData }}...
        </div>


      </div>


    </el-dialog>
  </el-container>
</template>
<script>
import {batchDeletion, getCommTypeByPunid} from '@/api/orgManage'
import * as publicRule from "@/rules/rules.js";
import add from "./add"
import publicSubTop from "../../public/publicSubTop";
import selectDepartment from './selectDepartment'
import {dict_findDictList} from "../../api/common/common";
import {edit, resetSerialNumber} from "../../api/orgManage";

export default {
  components: {add, publicSubTop, selectDepartment},
  props: [],
  data() {
    return {
      resetData: '正在重排序列号,请稍后...', //重新排序的提示
      openLoadingDialog: false, //loaddialog
      openTreeDialog: false, //部门树dialog
      orgLevelList: [],//机构级别集合
      orgTypeList: [],//机构类型集合
      showAddGoods: false,
      detail: {},
      dialogTitle: '新增组织架构',
      showAddDialog: false, //添加的dialog
      showHigherName: false,
      loadingBtn: false,
      currentLevel: 0,
      title: "组织架构",
      modeOption: {
        edit: 0,
        choose: 1,
      },
      modeType: -1,
      checkedKey: "",
      expandedKey: "",
      node: {},
      editForm: {
        higherName: '',//上级
        classLevel: '',//级别
        regionCode: '',//编码'
        fullName: '',//
        name: '',
        deptCode: '',// '部门编码',
        sortNum: 0,//'排序',
        parentId: '',//父级unid
        status: '1',//'状态;0启用,1禁用',
        nature: '',//'机构类型:1区域 2部门 3虚拟',,
        standard: '',//'层级;1:国家;2省;3市;4区县;5镇;6村;7虚拟',
        serialNumber: ''
      },
      data: [],
      rules: {
        name: [
          {required: true, message: "请输入组织架构名称", trigger: "blur"},
          {min: 1, max: 50, message: "长度在 1 到 50 个字", trigger: "blur"},
          {validator: publicRule.passHtmlAndSql, trigger: "blur"}
        ],
        regionCode: [
          {min: 6, max: 12, message: "长度在 6 到 12 个字", trigger: "blur"},
          {required: true, message: "请输入地区编码", trigger: "blur"},
          /*  {validator: publicRule.areaCode, trigger: "blur"}*/
        ],
        deptCode: [
          {required: false, message: "请输入机构编码", trigger: "blur"},
          {validator: publicRule.passHtmlAndSql, trigger: "blur"}
        ],
        sortNum: [
          {required: true, message: "请输入排序", trigger: "change"},
          {validator: publicRule.mustNumber1, trigger: 'blur'}
        ],
        nature: [
          {required: true, message: "请选择机构类型", trigger: "change"},
        ],
        standard: [
          {required: true, message: "请选择机构级别", trigger: "change"},
        ],
        status: [
          {required: true, message: "请选择状态", trigger: "change"},
        ],
      },
      option: {
        addBtn: true,
        editBtn: false,
        defaultExpandAll: false,
        draggable: true,
        menu: true,
        nodeKey: 'id',
        isLeaf: 'isLeaf',
      },
      searchName: "",
      isSearch: false,
    }
  },
  watch: {
    'currentLevel': {
      handler(newName, oldName) {
        if (newName && newName > 1) {
          this.showHigherName = true
        } else {
          this.showHigherName = false;
        }
      },
      deep: true,
      immediate: true
    },
    'editForm.nature': {
      handler(newName) {
        if (newName && newName == '2') {
          this.rules.deptCode[0].required = true
        } else {
          this.rules.deptCode[0].required = false
        }
      },
      deep: true,
      immediate: true
    },

  },
  created() {
    this.getCommTypeByPunid("", '');
    this.findDictList();
  },
  mounted() {

  },
  methods: {
    findDictList() {
      dict_findDictList('机构级别,机构类型').then(res => {
        let data = res.data.data;
        this.orgLevelList = data.filter(v => v.dictType == '机构级别')
        this.orgTypeList = data.filter(v => v.dictType == '机构类型')
      })
    },
    /*搜索*/
    search() {
      this.getCommTypeByPunid("", '', this.searchName);
    },
    clearSearch() {
      this.getCommTypeByPunid("", '', '');
    },
    /*部门树回填 节点数据*/
    closeTreeDialog() {
      this.openTreeDialog = false;
    },
    treeData(data) {
      this.editForm.higherName = data.name;
      this.editForm.parentId = data.id
    },
    addDept() {
      this.openTreeDialog = true;

    },
    filterNode(value, data) {
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    },
    handleClose() {
      this.showAddDialog = false;
    },
    closeDialog(data) {
      //提交成功关闭添加的dialog
      this.showAddDialog = false;
      if (data) {
        data.level = data.classLevel;
        data.label = data.name;
        data.is_show = false;
        data.isLeaf = data.isLeaf === 1;
        data.children = [];
        if (data.parentId) {//刷新所选的上级节点的信息
          let dataNode = this.$refs.tree.getNode(data.parentId);//拿到新增节点的父节点
          this.refresh(dataNode, dataNode.data, data.id);
        } else {
          this.getCommTypeByPunid('', data.id);
        }
      }
    },
    handleNodeClick(data, node) {
      this.editForm.id = data.id ? data.id : "";
      if (node && node.parent && node.parent.data) {
        this.editForm.higherName = node.parent.data.name ? node.parent.data.name : "";
      }
      this.editForm.regionCode = data.regionCode ? data.regionCode : "";
      this.editForm.fullName = data.fullName ? data.fullName : "";
      this.editForm.name = data.name ? data.name : "";
      this.editForm.deptCode = data.deptCode ? data.deptCode : "";
      this.editForm.sortNum = data.sortNum;
      this.editForm.parentId = data.parentId ? data.parentId : "";
      this.editForm.status = data.status ? data.status : "";
      this.editForm.nature = data.nature ? data.nature : "";
      this.editForm.standard = data.standard ? data.standard : "";
      this.editForm.serialNumber = data.serialNumber ? data.serialNumber : "";
      this.editForm.classLevel = node.level; //当前的树形层级
      this.currentLevel = node.level;//当前的树形层级
      this.showHigherName = node.level;//是否显示上级
    },
    /*regionCode: '',//编码'
            fullName: '',//
            name: '',
            deptCode: '',// '部门编码',
            sortNum: 0,//'排序',
            parentId: '',//父级unid
            status: '1',//'状态;0启用,1禁用',
            nature: '',//'机构类型:1区域 2部门 3虚拟',,
            standard: ''//'层级;1:国家;2省;3市;4区县;5镇;6村;7虚拟',*/
    handleNodeExpand(data, node) {
      if (node && node.childNodes && node.childNodes.length === 0) {
        this.getSubTree(node, data);
      }
    },
    /*获取树节点*/
    getSubTree(node, data, unid) {
      getCommTypeByPunid(data.id)
          .then(res => {
            let ret = res.data.data;
            if (Array.isArray(ret) && ret.length > 0) {
              //如果子集有数据，要判断node的isLeaf （true 子集无数据，false:还有子集）
              if (node) {
                this.$nextTick(() => {
                  node.isLeaf = false;
                });
              }
              let temp = [];
              ret.forEach(item => {
                temp.push({
                  ...item,
                  punid: data.id,
                  level: data.classLevel + 1,
                  label: item.name,
                  is_show: false,
                  children: [],
                  isLeaf: item.isLeaf === 1,
                });
              });
              node.doCreateChildren(temp);
              if (unid) {
                this.$nextTick(() => {
                  this.$refs.tree.setCurrentKey(unid);//设置选中节点
                  let dataNode = this.$refs.tree.getNode(unid);//拿到设置选中节点
                  this.handleNodeClick(dataNode.data, dataNode);//设置选中的节点事件
                });
              }
            } else {
              this.$nextTick(() => {
                node.isLeaf = true;
              });
            }
          })
          .catch(err => {
          })
    },
    //
    getCommTypeByPunidAfterUpdate(punid, unid) {
      getCommTypeByPunid(punid)
          .then(res => {
            this.data = [];
            res.data.data.forEach(item => {
              this.data.push({
                ...item,
                level: 1,
                label: item.name,
                is_show: false,
                children: []
              });
            });

            //最外层节点添加成功后刷新
            this.checkedKey = unid;
            this.expandedKey = unid;
            this.$nextTick(() => {
              this.$refs.tree.setCurrentKey(unid);
              setTimeout(() => {
                let node = this.getCurrentNode();
                if (node) {
                  this.handleNodeExpand(node.data, node);
                }
              }, 200)
              // }
            });
          })
          .catch(err => {

          });
    },
    getCommTypeByPunid(punid, unid, name) {

      getCommTypeByPunid(punid, name)
          .then(res => {
            this.data = [];
            res.data.data.forEach(item => {
              this.data.push({
                ...item,
                level: 1,
                label: item.name,
                is_show: false,
                children: [],
                isLeaf: item.isLeaf === 1,
              });
            });
            if (!unid) {
              this.checkedKey = res.data.data[0].id;
              this.expandedKey = res.data.data[0].id;
            } else {
              //最外层节点添加成功后刷新
              this.checkedKey = unid;
              this.expandedKey = unid;
            }
            /*regionCode: '',//编码'
        fullName: '',//
        name: '',
        deptCode: '',// '部门编码',
        sortNum: 0,//'排序',
        parentId: '',//父级unid
        status: '1',//'状态;0启用,1禁用',
        nature: '',//'机构类型:1区域 2部门 3虚拟',,
        standard: ''//'层级;1:国家;2省;3市;4区县;5镇;6村;7虚拟',*/
            this.editForm.id = res.data.data[0].id;
            this.editForm.regionCode = res.data.data[0].regionCode;
            this.editForm.fullName = res.data.data[0].fullName;
            this.editForm.name = res.data.data[0].name;
            this.editForm.deptCode = res.data.data[0].deptCode;
            this.editForm.sortNum = res.data.data[0].sortNum;
            this.editForm.parentId = res.data.data[0].parentId;
            this.editForm.status = res.data.data[0].status;
            this.editForm.nature = res.data.data[0].nature;
            this.editForm.standard = res.data.data[0].standard;
            this.editForm.classLevel = res.data.data[0].classLevel;
            this.editForm.serialNumber = res.data.data[0].serialNumber;
            this.$nextTick(() => {
              if (unid) {
                this.$refs.tree.setCurrentKey(unid);
                let dataNode = this.$refs.tree.getNode(unid);//拿到设置选中节点
                this.handleNodeClick(dataNode.data, dataNode);//设置选中的节点事件
              } else {
                this.$refs.tree.setCurrentKey(res.data.data[0].id);
                setTimeout(() => {
                  let node = this.getCurrentNode();
                  this.handleNodeExpand(res.data.data[0], node);
                }, 200)
              }
            });
          })
          .catch(err => {

          });
    },
    refresh(node, data, unid) {
      let theChildren = node.childNodes;
      // 先删除所有子类
      theChildren.splice(0, theChildren.length);
      this.getSubTree(node, data, unid);
      node.expanded = true;
    },
    /*序列号重排*/
    onReset() {
      this.openLoadingDialog = true;
      resetSerialNumber().then(res => {
        if (res.data.code == 200 && res.data.data) {
          this.resetData = res.data.data
        }
      }).catch(() => {

      }).finally(() => {
        this.closeLoading()
      })
    },
    /*延迟关闭弹窗*/
    closeLoading() {
      setTimeout(() => {
        this.openLoadingDialog = false
      }, 2000)
    },
    /*regionCode: '',//编码'
            fullName: '',//
            name: '',
            deptCode: '',// '部门编码',
            sortNum: 0,//'排序',
            parentId: '',//父级unid
            status: '1',//'状态;0启用,1禁用',
            nature: '',//'机构类型:1区域 2部门 3虚拟',,
            standard: ''//'层级;1:国家;2省;3市;4区县;5镇;6村;7虚拟',*/
    append(node, data) {
      this.detail = {};
      if (data) {
        this.detail.higherName = node.level > 1 ? data.name : '';
        this.detail.name = "";
        this.detail.fullName = "";
        this.detail.regionCode = "";
        this.detail.deptCode = "";
        this.detail.status = "0";
        this.detail.sortNum = 0;
        this.detail.parentId = data.id;
        this.detail.nature = '';
        this.detail.standard = '';
        this.detail.serialNumber = '';
        this.detail.classLevel = node.level + 1;
        this.showAddDialog = true;
      } else {
        this.detail.higherName = '';
        this.detail.name = "";
        this.detail.fullName = "";
        this.detail.regionCode = "";
        this.detail.deptCode = "";
        this.detail.status = "0";
        this.detail.sortNum = 0;
        this.detail.parentId = '';
        this.detail.nature = "";
        this.detail.standard = '';
        this.detail.serialNumber = '';
        this.detail.classLevel = 1;
        this.checkedKey = "";
        this.showAddDialog = true;
      }
    },
    remove(node, data) {
      this.$confirm('是否删除类型[' + data.name + ']', '温馨提示', {
        type: 'warning',
      }).then(() => {
            batchDeletion([data.id])
                .then(res => {
                  let currentNode = this.$refs.tree.getNode(data.id); //获取要删除的节点
                  let parent = currentNode.parent;//删除节点的父节点
                  if (parent.childNodes && parent.childNodes.length == 1) {
                    this.$nextTick(() => {
                      parent.isLeaf = true;
                    })
                  }
                  this.$refs.tree.remove(node); //删除节点
                  if (this.editForm && this.editForm.id && this.editForm.id == data.id) { //如果删除的节点和已经选中的节点是同一个
                    if (parent.level > 0) {
                      let parentNode = this.$refs.tree.getNode(parent.data.id);  //同一个就定位父节点去
                      this.$nextTick(() => {
                        this.$refs.tree.setCurrentKey(parent.data.id);
                        this.handleNodeClick(parentNode.data, parentNode);
                      });
                    } else if (parent.level == 0) {//顶级节点了
                      if (parent.data && Array.isArray(parent.data) && parent.data.length > 0) {
                        this.$refs.tree.setCurrentKey(parent.data[0].id);//选择删除节点的父节点
                        let parentNode = this.$refs.tree.getNode(parent.data[0].id);//拿到删除节点的父节点
                        this.handleNodeClick(parentNode.data, parentNode);//设置选中的节点
                      } else {
                        this.editForm = this.$options.data().editForm;//初始化
                      }
                    }

                  } else {
                    //删除的节点和选中的不是同一个节点就判断父节点被删除了没.如果父节点没有被删除,删除的是其他树枝节点,保持不动
                    let selectedNode = this.$refs.tree.getNode(this.editForm.id);
                    if (!selectedNode) {//如果选中的节点不存在 就说明删除的节点是选中的节点的整个树枝节点都被删除了
                      this.$nextTick(() => {
                        this.$refs.tree.setCurrentKey(parent.data.id);//选择删除节点的父节点
                        let parentNode = this.$refs.tree.getNode(parent.data.id);//拿到删除节点的父节点
                        this.handleNodeClick(parentNode.data, parentNode);//设置选中的节点
                      });
                    }
                    /* else {
                                                            if (parent && parent.level == 0) {
                                                                this.$nextTick(() => {
                                                                    if (parent.data && Array.isArray(parent.data) && parent.data.length > 0) {
                                                                        this.$refs.tree.setCurrentKey(parent.data[0].id);//选择删除节点的父节点
                                                                        let parentNode = this.$refs.tree.getNode(parent.data[0].id);//拿到删除节点的父节点
                                                                        this.handleNodeClick(parentNode.data, parentNode);//设置选中的节点
                                                                    }
                                                                });
                                                            }
                                                        }*/
                  }
                  // this.refresh(node.parent.parent, node.parent.parent.data);
                  //  this.refresh(node.parent, node.parent.data);
                  //  node.parent.expanded = true;
                  this.$message.success("删除成功");
                })
                .catch(err => {
                })
          }
      );
    },
    update() {
      this.$refs.editForm.validate((valid) => {
        if (valid) {
          this.loadingBtn = true
          edit(this.editForm).then(res => {
            this.loadingBtn = false
            this.$refs.editForm.clearValidate();
            let current = this.$refs.tree.getNode(this.editForm.id);//原本当前的节点
            let parent = current.parent;//当前的父节点
            if (parent && parent.level > 0) {//节点层级
              if (parent.data.id == this.editForm.parentId) { //父节点的id==选择的上级机构parentId就刷新父节点
                this.refresh(current.parent, current.parent.data, '');
              } else {
                let node = this.$refs.tree.getNode(this.editForm.parentId);//获取修改选择的上级机构的节点
                if (node) {
                  this.refresh(node, node.data, ''); //刷新已经存在的修改选择的上级机构的节点
                } else {
                  this.refresh(current.parent, current.parent.data, ''); //如果节点不存在就自己的父节点
                }
                this.$refs.tree.remove(current); //因为已经更换上级机构了本节点就要删除掉
              }

            } else if (parent && parent.level == 0) {//顶级修改
              this.getCommTypeByPunidAfterUpdate("", '');
            }
            this.$message.success('修改成功')
          }).catch(err => {
            this.loadingBtn = false
            if (err.data.msg) {
              this.$message.warning(err.data.msg);
            }
          });
        }
      });
    },
    mounted() {

    },

    getCurrentNode() {
      return this.$refs.tree.getNode(this.editForm.id);
    },
    getNodeData(unid) {
      let node = this.$refs.tree.getNode(unid);
      return node.data;
    }
  }
}
</script>
<style lang="scss">
.addTipBg:hover {
  background: #F0F7FF;
}

.org-tree-node {
  width: 80%;
  -ms-flex: 1;
  flex: 1;
  display: -ms-flexbox;
  display: flex;
  -ms-flex-align: center;
  align-items: center;
  -ms-flex-pack: justify;
  justify-content: space-between;
  font-size: 14px;
}

.org-tree-node-content {
  .el-tree-node__content {
    height: 32px;
  }
}

.previewDialog {
  .el-dialog__header {
    display: none;
  }
}

/*选择机构弹窗高度*/
.orgDialogHeight {
  height: 60%;

}
</style>