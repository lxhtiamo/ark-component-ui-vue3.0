<template>
  <div class="tree-div">
    <p class="title-dept">{{ title }}</p>
    <el-input :placeholder="('请输入'+title)" v-model="searchParams.name" clearable size="default"
              prefix-icon="Search"
              @keyup.enter="searchEnterFun"
              @clear="searchEnterFun"
              maxlength="30">
    </el-input>

    <el-tree
        ref="treeRef"
        class="tree-style"
        :data="treeData"
        :props="props"
        :load="loadNode"
        accordion
        :expand-on-click-node="expand"
        @node-click="handleNodeClick"
        node-key="id"
        highlight-current
        lazy>
      <template v-slot="{ node }">
         <span class="custom-tree-node">
         <span class="tree-menu-style" :class="[selectObj.name==node.label?'select-style':'']">{{ node.label }}</span>
       </span>
      </template>
    </el-tree>
  </div>
</template>

<script>


import {findList, findOrgList} from '@/api/deptApi'

export default {
  name: "deptTree",
  props: {
    title: {
      type: String,
      default: '部门名称'
    },
    //机构类型 1:区域
    orgType: {
      type: String,
      default: ''
    },
    // 1 公用接口  2 管理企业组织结构接口
    type: {
      type: String,
      default: '1'
    }
  },
  data() {
    return {
      treeData: [],
      searchParams: {
        name: ''
      },
      props: {
        label: 'name',
        children: 'zones',
        isLeaf: 'leaf',
      },
      selectObj: {},
      selectAreaList: [],
      selectDeptList: [],
      expand: false,
      nodeInfo: {
        node: null,
        resolve: null
      }
    }
  },
  methods: {
    loadNode(node, resolve) {
      let netWork = '';
      let data = {punid: '', nature: this.orgType, name: this.searchParams.name}
      if (node.level === 0) {
        this.nodeInfo.node = node;
        this.nodeInfo.resolve = resolve;
        data.punid = '';
      } else {
        data.punid = node.data.id
      }
      switch (this.type) {
        case '1':
          netWork = findOrgList
          break;
        case '2':
          netWork = findList
          break;
      }
      netWork(data)
          .then(res => {
            let data = res.data.data;
            if (data) {
              data.forEach(obj => {
                if (obj.isLeaf == '1') {
                  obj.leaf = true;
                } else {
                  obj.leaf = false;
                }
              })
              if (node.level === 0 && !this.selectObj.id) {
                this.$nextTick(() => {
                  this.$refs['treeRef'].setCurrentKey(data[0].id);
                })
                this.handleNodeClick(data[0], node)
              }

              resolve(data)
            } else {
              resolve([])
            }
          })
          .catch(err => {
            resolve([])
            this.$util.showMessage(err)
          })
    },
    handleNodeClick(data, node) {
      this.selectAreaList = [];
      this.selectDeptList = [];
      if (this.selectObj && this.selectObj.id == data.id) {
        this.selectObj = {};
      } else {
        this.getAreaList(node);
        this.selectObj = Object.assign(data, {_areaList: this.selectAreaList, _deptList: this.selectDeptList});
      }
      this.$emit('treeInfo', this.selectObj)
    },
    getAreaList(node) {
      this.selectAreaList.unshift(node.data.regionCode);
      this.selectDeptList.unshift(node.data);
      if (node.level > 1) {
        this.getAreaList(node.parent)
      }
    },
    searchEnterFun() {
      this.nodeInfo.node.childNodes = []
      this.loadNode(this.nodeInfo.node, this.nodeInfo.resolve)
    }
  }
}
</script>

<style lang="scss">
.tree-div {
  width: 244px;
  height: 100%;
  box-sizing: border-box;
  padding-right: 10px;
  border-right: 1px solid #eaeaea;

  .title-dept {
    height: 40px;
    line-height: 40px;
    font-size: 16px;
    font-family: PingFang SC, PingFang SC-Medium;
    text-align: left;
    font-weight: bolder;
    color: #393939;
  }

  .tree-style {
    margin-top: 18px;
    height: calc(100% - 100px);
    margin-bottom: 3px;
    overflow: auto !important;

    .tree-menu-style {
      font-size: 14px;
      font-family: PingFang SC, PingFang SC-Regular;
      text-align: left;
      color: #262626;
      position: relative;
      top: 5px;
    }

    .select-style {
      font-family: PingFang SC, PingFang SC-Semibold;
      color: #1B6CFA;
      position: relative;
      top: 5px;
    }
  }

  .el-tree {
    height: calc(100% - 100px) !important;
    margin-bottom: 3px;
    overflow: auto;
    padding-bottom: 5px;
  }

  .el-tree > .el-tree-node {
    display: inline-block;
    min-width: 100%;
  }

  .el-tree-node__content {
    height: 32px;
  }

  .el-tree--highlight-current .el-tree-node.is-current > .el-tree-node__content {
    background-color: #f7f9ff !important;
  }
}
</style>
