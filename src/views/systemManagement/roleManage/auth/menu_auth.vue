<template>
  <div class="menu-div">
    <el-tree :data="resList" :props="defaultProps" :expand-on-click-node="expand"
             v-loading="vLoading"
             class="a-tree-style">
      <template v-slot="{ node, data }">
         <span class="custom-tree-node">
             <el-checkbox v-model="data._selected" @change="itemChange(node,data)">
                <span :class="data.resourceType==0?'tree-item-style':'tree-item-style btn'">{{
                    node.label
                  }}</span></el-checkbox>
         </span>
      </template>
    </el-tree>
  </div>

</template>

<script>
import {role_menu_findPage, role_menuList_findPage, role_saveRoleMenu} from '@/api/systemManageApi'
import {deepClone} from "../../../../util/util";

export default {
  name: "authorizeDialog",
  props: {
    item: {
      type: Object,
      default: null,
    },
    appItem: {
      type: Object,
      default: () => {
      }
    }
  },
  data() {
    return {
      vLoading:true,
      title: '菜单授权',
      dialogFormVisible: true,
      loading: false,
      resList: [],
      defaultProps: {
        children: 'childrenList',
        label: 'name'
      },
      expand: false,
      selectedList: [],
      authList: [],
      unidList: [],
    }
  },
  mounted() {
    Promise.all([this.getResourceList(), this.getSelectList()])
        .then(() => {
          this.vLoading=false
          this.selectedList.forEach(obj => {
            let map = new Map();
            this.initTree(obj, this.resList, map)
          })
        }).catch(()=>{
          this.vLoading=false
    })
  },
  methods: {
    closedDialog() {
      this.$emit('closed')
    },
    getResourceList() {
      return new Promise((resolve, reject) => {
        role_menu_findPage({size: '90', current: '1', status: "0"})//过滤禁用的
            .then(res => {
              this.resList = res.data.data;
              if (this.resList) {
                this.setTreeList(this.resList);
              }
              resolve(res)
            })
            .catch(err => {
              resolve(err)
              this.$util.showMessage(err)
            })
      })
    },
    getSelectList() {

      return new Promise((resolve, reject) => {
        role_menuList_findPage({roleUnid: this.item.id})
            .then(res => {
              resolve(res)
              this.selectedList = res.data.data || [];
            })
            .catch(err => {
              resolve(err)
              this.$util.showMessage(err)
            })
      })
    },
    itemChange(node, data) {
      if (data._selected) {
        this.setParent(node)
        this.addItemInfo(data.unid, true)
        this.setChildSel(node, data)
      } else {
        this.setChild(node)
      }
    },
    /*设置下级的选中节点*/
    setChildSel(node, data) {
      if (node.childNodes && Array.isArray(node.childNodes) && node.childNodes.length > 0) {
        node.childNodes.forEach(obj => {
          if (obj.data) {
            obj.data._selected = true;
            this.addItemInfo(obj.data.unid, true, node)
          }
          if (obj.childNodes && obj.childNodes.length > 0) {
            this.setChildSel(obj)
          }
        })
      }
    },

    setTreeList(list) {
      list.forEach(obj => {
        obj._selected = false
        if (obj.childrenList && obj.childrenList.length > 0) {
          this.setTreeList(obj.childrenList)
        }
      })
    },
    setParent(node) {
      if (node.parent && node.parent.data) {
        node.parent.data._selected = true;
        let where = this.selectedList.findIndex(v => v == node.data.unid);
        if (where >= 0) {
          this.selectedList.splice(where, 1);
        }
        if (node.parent.parent) {
          this.setParent(node.parent)
        }
      }
    },
    setChild(node) {
      if (node.data) {
        node.data._selected = false;
        this.addItemInfo(node.data.unid, false, node)
      }
      if (node.childNodes) {
        node.childNodes.forEach(obj => {
          if (obj.data) {
            obj.data._selected = false;
            this.addItemInfo(obj.data.unid, false, node)
          }
          if (obj.childNodes && obj.childNodes.length > 0) {
            this.setChild(obj)
          }
        })
      } else {
        this.addItemInfo(node.data.unid, false, node)
      }
    },
    addItemInfo(unid, addOrDel, node) {
      let where = this.selectedList.findIndex(v => v == unid);
      if (where >= 0 && !addOrDel) {
        this.selectedList.splice(where, 1);
        if (node.level > 1 && node.parent) {
          let parentUnid = node.parent.data.unid;
          let otherIndex = this.selectedList.findIndex(v => v == parentUnid);
          //node.parent.data._selected = addOrDel;
          let hasSel = false; //判断本节点所属的下级节点是否有选中的情况
          if (node.parent.data && node.parent.data.childrenList && Array.isArray(node.parent.data.childrenList) && node.parent.data.childrenList.length > 0) {
            for (let item of node.parent.data.childrenList) {
              if (item._selected) {
                hasSel = true;
                break
              }
            }
          }
          if (hasSel) {
            node.parent.data._selected = true;
          } else {
            node.parent.data._selected = false;
          }
          if (otherIndex < 0) {
            if (addOrDel) { //false的时候就是非选中的时候就不能在push父级id
              this.selectedList.push(parentUnid)
            }
          }
        } else if (node.level == 1) {//一级节点
          node.data._selected = addOrDel;
        }
      } else if (where < 0 && addOrDel) {
        this.selectedList.push(unid)
      }
    },
    submitData() {
      this.unidList = [];
      this.selectedList.forEach(obj => {
        this.setUnidList(this.resList, obj, [])
      })
      this.loading = true;
      let data = {
        menuUnidList: this.unidList,
        roleUnid: this.item.id
      }
      role_saveRoleMenu(data)
          .then(() => {
            this.$util.showMessage('授权成功', '1');
            this.$emit('closed', true)
          })
          .catch(err => {
            this.$util.showMessage(err)
          })
          .finally(() => {
            this.loading = false
          })
    },
    initTree(unid, list, map) {
      list.forEach(obj => {
        let tempMap = new Map();
        map.forEach(item => {
          tempMap.set(item.id, item)
        })
        tempMap.set(obj.unid, obj)
        if (obj.unid == unid) {
          tempMap.forEach(temp => {
            temp._selected = true
          })
        } else {
          if (obj.childrenList && obj.childrenList.length > 0) {
            this.initTree(unid, obj.childrenList, tempMap)
          }
        }
      })

    },
    setUnidList(resList, unid, list) {
      resList.forEach(obj => {
        let tempList = deepClone(list);
        if (obj.unid == unid) {
          tempList.push(obj.unid);
          tempList.forEach(temp => {
            let where = this.unidList.findIndex(v => v == temp);
            if (where < 0) {
              this.unidList.push(temp)
            }
          })
        } else {
          if (Array.isArray(obj.childrenList)) {
            tempList.push(obj.unid)
            this.setUnidList(obj.childrenList, unid, tempList);
          }
        }
      })
    },
    getResData() {
      this.unidList = [];
      this.selectedList.forEach(obj => {
        this.setUnidList(this.resList, obj, [])
      })
      let data = {
        menuUnidList: this.unidList,
        roleUnid: this.item.id
      }
      return data;
    },
  },
}
</script>

<style lang="scss" scoped>

.menu-div {
  width: 100%;
  height: calc(100% - 10px);
  padding-top: 10px;
  overflow: auto;
}

.a-tree-style {
  //margin-top: 20px;
  height: calc(100% - 40px);
}

.tree-item-style {
  color: #303e52;
  font-size: 14px;
  position: relative;
  top: 0px;

  &:before {
    content: '';
    display: inline-block;
    width: 24px;
    height: 16px;
    background: url("../../../../../public/img/icon/menu_icon.png") no-repeat center;
    background-size: 100% 100%;
    position: relative;
    top: 2px;
    margin-right: 5px;
  }

  &.btn {
    &:before {
      content: '';
      display: inline-block;
      width: 24px;
      height: 16px;
      background: url("../../../../../public/img/icon/btn_icon.png") no-repeat center;
      background-size: 100% 100%;
      position: relative;
      top: 2px;
      margin-right: 5px;
    }
  }
}


</style>