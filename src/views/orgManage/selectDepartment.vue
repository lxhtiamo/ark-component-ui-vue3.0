<template>
  <div style="height: calc(100% - 40px)">
    <div style="height: 100%;overflow:auto;">
      <el-tree :data="tableData"
               v-loading="tableLoading"
               :props="option"
               :lazy="lazy"
               :node-key="option.nodeKey"
               ref="elTree"
               :highlight-current="true"
               check-on-click-node
               :load="loadNode"
               :expand-on-click-node="option.expandOnClickNode"
               :default-expanded-keys="[expandedKey]"
               :default-checked-keys="[checkedKey]"
               @node-click="handleNodeClick"
               @current-change="currentChange"
               @node-expand="handleNodeExpand">

      </el-tree>
    </div>
    <div style="text-align:center;width: 100%;height: 32px;margin-top: 8px">
      <el-button type="primary" @click="onSubmit">确 定</el-button>
      <el-button @click="onClose">关 闭</el-button>
    </div>
  </div>
</template>
<script>
import {findOrgList} from "../../api/deptApi";

export default {
  name: "treeList",
  props: ['trees', 'chooseArea', 'type'],
  data() {
    return {
      lazy: true, //主要用来区分是否是主页传回来的 地区unid集合[xx,xx]  如果是主页传回来chooseArea就不用懒加载设置为false,直接获取所有数据
      label: "",
      treeCurrentNode: {},//当前节点的数据
      showTree: true,
      deptType: this.type ? this.type : '3',//1:区域 2:部门 3:全部
      tableLoading: false,
      tableData: [],
      expandedKey: "",//展开的节点
      checkedKey: "",//选中的节点
      currentUnid: "",
      option: {
        addBtn: false,
        editBtn: false,
        defaultExpandAll: false,
        draggable: false,
        menu: false,
        nodeKey: 'id',
        label: 'name',
        children: 'children',
        isLeaf: 'isLeaf',
        expandOnClickNode: false
      },
      isFirstFromChooseArea: false,//标记是否是跳转来的chooseArea请求的数据 ,标记一下
    }
  },
  created() {
    this.tableLoading = true
  },
  computed: {},
  methods: {
    loadNode(node, resolve) {
      this.getTreeDataForType(node, resolve);
    },

    /*原始树*/
    getTreeDataForType(node, resolve, data) {
      findOrgList({
        punid: node.data.id,
      }).then(res => {
        this.tableLoading = false;
        let resData = res.data.data ? res.data.data : [];
        if (Array.isArray(resData) && resData.length > 0) {
          //如果子集有数据，要判断node的isLeaf （true 子集无数据，false:还有子集）
          if (node) {
            this.$nextTick(() => {
              node.isLeaf = false;
            });
          }
          resData.forEach(item => {
            item.isLeaf = item.isLeaf === 1//判断是否有子集 0 /1  参数leaf: "false" 也是判断这个的
          });
        }
        if (resolve) {
          resolve(resData);
          if (node.level === 0) {
            this.tableData = res.data.data;
            this.$nextTick(() => {
              this.expandedKey = res.data.data[0].id;
              this.checkedKey = res.data.data[0].id;
              this.currentUnid = res.data.data[0].id;
              this.$refs.elTree.setCurrentKey(this.currentUnid);
              this.treeCurrentNode = res.data.data[0];
            });
          }
        } else {
          let ret = res.data;
          let temp = [];
          if (ret.data) {
            ret.data.forEach(item => {
              temp.push({
                ...item,
                punid: data.id,
                level: node.level + 1,
                label: item.name,
                isLeaf: item.isLeaf === 1,
                children: [],

              });
            });
            node.doCreateChildren(temp);
            setTimeout(() => {
              this.setChildren(temp);
            }, 200);
          } else {
            node.isLeaf = true;
          }
        }
      }).catch(e => {
        console.log(e);
        this.tableLoading = false;
      });
    },
    onClose() {
      //关闭
      this.$emit("closeTreeDialog");
    },
    onSubmit() {
      this.emitData(this.treeCurrentNode);
      this.onClose();
    },
    /*去掉已经没有下级节点的小箭头*/
    setChildren(list) {
      if (list.length > 0) {
        for (let item of list) {
          let node = this.$refs.elTree.getNode(item.id);
          if (item.children && Array.isArray(item.children) && item.children.length > 0) {
            this.setChildren(item.children)
          } else {
            node.isLeaf = false;
          }
        }
      }
    },
    /*节点被点击的回调 共三个参数，依次为：传递给 data 属性的数组中该节点所对应的对象、节点对应的 Node、节点组件本身。*/
    handleNodeClick(data) {
      this.treeCurrentNode = data;
    },

    /*当前选中节点变化时触发的事件	共两个参数，依次为：当前节点的数据，当前节点的 Node 对象*/
    currentChange(data) {
    },

    /*节点被展开触发的事件共三个参数，依次为：传递给 data 属性的数组中该节点所对应的对象、节点对应的 Node、节点组件本身*/
    handleNodeExpand(data, node) {
      if (node.childNodes.length === 0) {
        if (this.isFirstFromChooseArea) {
          this.getTreeDataForType(node, null, data);
        }
      }
    },

    /*获取当前的节点 根据 data 或者 key 拿到 Tree 组件中的 node*/
    getCurrentNode() {
      return this.$refs.elTree.getNode(this.currentUnid);
    },
    //获取部门上一级所属区域
    getNodeData(unid) {
      let node = this.$refs.elTree.getNode(unid);
      if (node != null) {
        return node.data;
      }
    },
    /*返回当前*/
    emitData(data) {
      this.$emit('treeData', data)
    },
  },
}
</script>
<style lang="scss">

.tree-search-div {
  height: 32px;
  padding-right: 10px;
  padding-left: 10px;
  background-color: #ffffff;
  border-radius: 4px;
  border: solid 1px #e8e9ed;
  display: inline-block;
  font-size: 14px;
  width: calc(100% - (50px));
  /*列表上部搜索框样式*/
  .tree-search-input-style {
    /*去除输入框边框*/
    .el-input__inner {
      border: none;
    }
  }
}
</style>