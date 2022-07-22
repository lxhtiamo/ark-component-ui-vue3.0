<template>
  <div class="area-div">
    <el-tree
        v-loading="isFirst"
        ref="treeRef"
        :props="props"
        :load="loadNode"
        lazy
        node-key="id"
        @check="checked"
        @node-expand="expand"
        accordion
        :expand-on-click-node="isExpand"
        :default-checked-keys="initList"
        show-checkbox>
    </el-tree>
  </div>
</template>

<script>
import {findMidRoleOrgList, findOrgList} from '@/api/applicationManageApi'


export default {
  name: "area_auth",
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
      props: {
        label: 'name',
        children: 'zones',
        isLeaf: 'leaf'
      },
      nodeInfo: {
        node: null,
        resolve: null
      },
      isFirst: true,
      initList: [],
      isExpand: false,
      subList: [],
    }
  },
  mounted() {
  },
  methods: {
    loadNode(node, resolve) {
      let unid = '';
      let list = [];
      if (node.level === 0) {
        this.nodeInfo.node = node;
        this.nodeInfo.resolve = resolve;
        unid = '';
      } else {
        unid = node.data.id
      }
      if (this.isFirst) {
        list = [this.getOrgList(unid), this.getSelect()];
      } else {
        list = [this.getOrgList(unid)];
      }
      Promise.all(list)
          .then(res => {
            this.isFirst = false;
            let data = res[0];
            if (data) {
              data.forEach(obj => {
                if (obj.isLeaf == '1') {
                  obj.leaf = true;
                } else {
                  obj.leaf = false;
                }
              })
              resolve(data)
            } else {
              resolve([])
            }
            if (Array.isArray(node.childNodes)) {
              node.childNodes.forEach(obj => {
                let where = this.subList.findIndex(v => v.orgId == obj.data.id)
                if (where >= 0) {
                  if (this.subList[where].type == '0') {
                    obj.checked = false;
                    obj.indeterminate = true;
                  } else if (this.subList[where].type == '1') {
                    obj.checked = true;
                    obj.indeterminate = false;
                    // console.log('=====node========', node)
                  }
                }
              })

            }
            this.setNode(node)
          })
          .catch(err => {
            resolve([])
            this.$util.showMessage(err)
          })
    },
    getSelect() {
      return new Promise((resolve, reject) => {
        findMidRoleOrgList({roleUnid: this.item.id})
            .then(res => {
              let list = res.data.data || [];
              this.subList = list.map(v => {
                return {orgId: v.orgId, type: v.type}
              })
              resolve(list)
            })
            .catch(err => {
              reject(err)
            })
      })

    },
    getOrgList(punid) {
      return new Promise((resolve, reject) => {
        findOrgList({punid: punid})
            .then(res => {
              let data = res.data.data;
              resolve(data)
            })
            .catch(err => {
              reject(err)
              this.$util.showMessage(err)
            })
      })
    },
    checked(data, node) {
      this.setData();
    },
    expand(data, node) {

    },
    getData() {
      let data = {
        roleUnid: this.item.id,
        orgList: this.subList
      }
      return data;
    },
    setData() {
      this.subList = [];
      let root = this.$refs.treeRef.root;
      if (root && !root.data && Array.isArray(root.childNodes)) {
        this.setList(root.childNodes)
      }

    },
    setList(list) {
      list.forEach(obj => {
        let where = this.subList.findIndex(v => v.orgId == obj.data.id);
        let temp = {orgId: obj.data.id, type: '', name: ''}
        if (!obj.checked && obj.indeterminate) {
          temp.type = '0'
          temp.name = obj.data.name
        }
        if (obj.checked && !obj.indeterminate) {
          temp.type = '1'
          temp.name = obj.data.name
        }
        if (temp.type) {
          if (where < 0) {
            this.subList.push(temp)
          } else {
            this.subList[where] = temp;
          }
        }
        if (Array.isArray(obj.childNodes)) {
          this.setList(obj.childNodes);
        }
      })
    },
    setItem(list, item) {
      list.forEach(obj => {
        if (obj.data.id == item.orgId) {
          if (item.type == '0') {
            obj.checked = false;
            obj.indeterminate = true;
          } else if (item.type == '1') {
            obj.checked = true;
            obj.indeterminate = false;
          }
        }
        if (Array.isArray(obj.childNodes)) {
          this.setItem(obj.childNodes, item);
        }
      })
    },
    setNode(node) {
      if (Array.isArray(node.childNodes)) {
        let type = '' // 0 未选 1 多选  2 全选
        node.childNodes.forEach(obj => {
          if (type != '1') {
            if (!obj.checked && !obj.indeterminate && !type) {
              type = '0'
            } else if (!obj.checked && !obj.indeterminate && type == '2') {
              type = '1'
            }
            if (!obj.checked && obj.indeterminate) {
              type = '1'
            }
            if (obj.checked && !obj.indeterminate && !type) {
              type = '2'
            } else if (obj.checked && !obj.indeterminate && type == '0') {
              type = '1'
            }
          }
        })
        switch (type) {
          case '0':
            node.checked = false;
            node.indeterminate = false;
            break;
          case '1':
            node.checked = false;
            node.indeterminate = true;
            break;
          case '2':
            node.checked = true;
            node.indeterminate = false;
            break;
        }
        if (type != '0' && node.parent) {
          this.setNode(node.parent)
        }
      }
    }

  },
}
</script>

<style lang="scss" scoped>
.area-div {
  width: 100%;
  height: calc(100% - 10px);
  padding-top: 10px;
  overflow: auto;
}
</style>