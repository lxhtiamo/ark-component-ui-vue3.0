<template>
  <el-container class="el-contain-div">
    <el-header class="topParentHeader">
      <publicSubTop title="字典管理"> </publicSubTop>
    </el-header>
    <el-main>
      <el-tree
        class="el-main-tree"
        style="width: 40%"
        :data="data"
        :props="option"
        lazy
        ref="tree"
        :highlight-current="true"
        :allow-drag="allowDrag"
        :allow-drop="allowDrop"
        check-on-click-node
        :default-expanded-keys="[checkedKey]"
        :default-checked-keys="[checkedKey]"
        @node-click="handleNodeClick"
        @node-expand="handleNodeExpand"
        :node-key="option.nodeKey"
      >
        <span
          class="tree-node"
          slot-scope="{ node, data }"
          @mouseenter="data.is_show = true"
          @mouseleave="data.is_show = false"
        >
          <span class="tree-label ellipsis">{{ node.label }}</span>
          <span
            v-show="data.is_show"
            class="tree-menu-btn"
            v-if="modeType != modeOption.choose"
          >
            <el-button type="text" size="mini" @click.stop="refresh(node, data)"
              >刷新</el-button
            >
            <el-button type="text" size="mini" @click.stop="append(node, data)"
              >新增</el-button
            >
            <el-button type="text" size="mini" @click.stop="remove(node, data)"
              >删除</el-button
            >
          </span>
        </span>
      </el-tree>
      <div
        style="width: 2px;height: 100%;border-right: 1px solid #E2E2E2"
      ></div>
      <div style="background: #fff; width: 100%;">
        <div
          v-if="modeType == modeOption.choose || modeType == modeOption.edit"
          @change="changeModeType"
        >
          <label class="el-form-item__label" style="width: 150px;"
            >模式选择</label
          >
          <el-radio v-model="modeType" :label="modeOption.choose" border
            >选择模式</el-radio
          >
          <el-radio v-model="modeType" :label="modeOption.edit" border
            >编辑模式</el-radio
          >
        </div>
        <el-form
          ref="editForm"
          :rules="rule"
          :model="editForm"
          label-width="100px"
          style="margin-left: 10px"
        >
          <el-row>
            <el-col :span="22">
              <el-row :span="24">
                <el-col :span="24">
                  <el-form-item label="字典类型:" prop="dictType">
                    <el-input
                      maxlength="32"
                      v-model="editForm.dictType"
                      size="mini"
                    ></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :span="24">
                <el-col :span="24">
                  <el-form-item label="字典显示值:" prop="dictName">
                    <el-input
                      maxlength="50"
                      v-model="editForm.dictName"
                      size="mini"
                    ></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :span="24">
                <el-col :span="24">
                  <el-form-item label="字典值:" prop="dictValue">
                    <el-input
                      maxlength="50"
                      v-model="editForm.dictValue"
                      size="mini"
                    ></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :span="24">
                <el-col :span="24">
                  <el-form-item label="排序:" prop="sortId">
                    <el-input v-model="editForm.sortId" size="mini"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :span="24">
                <el-col :span="24">
                  <el-form-item label="状态:" prop="dictStatus">
                    <el-radio-group v-model="editForm.dictStatus">
                      <el-radio label="Y">启用</el-radio>
                      <el-radio label="N">禁用</el-radio>
                    </el-radio-group>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
          <el-form-item>
            <el-button type="primary" @click="update">保存</el-button>
            <el-button @click="cancel">取消</el-button>
          </el-form-item>
        </el-form>
      </div>
      <el-dialog
        :close-on-click-modal="false"
        :title="title"
        :visible.sync="box"
        @close="hide"
        width="50%"
        append-to-body
      >
        <el-form
          ref="addForm"
          :rules="rule"
          :model="addForm"
          label-width="100px"
          style="margin-left: 10px"
        >
          <el-row>
            <el-col :span="22">
              <el-row :span="24">
                <el-col :span="24">
                  <el-form-item label="字典类型:" prop="dictType">
                    <el-input
                      maxlength="32"
                      v-model="addForm.dictType"
                      size="mini"
                    ></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :span="24">
                <el-col :span="24">
                  <el-form-item label="字典显示值:" prop="dictName">
                    <el-input
                      maxlength="50"
                      v-model="addForm.dictName"
                      size="mini"
                    ></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :span="24">
                <el-col :span="24">
                  <el-form-item label="字典值:" prop="dictValue">
                    <el-input
                      maxlength="50"
                      v-model="addForm.dictValue"
                      size="mini"
                    ></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :span="24">
                <el-col :span="24">
                  <el-form-item label="排序:" prop="sortId">
                    <el-input v-model="addForm.sortId" size="mini"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :span="24">
                <el-col :span="24">
                  <el-form-item label="状态:" prop="dictStatus">
                    <el-radio-group v-model="addForm.dictStatus">
                      <el-radio label="Y">启用</el-radio>
                      <el-radio label="N">禁用</el-radio>
                    </el-radio-group>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
          <el-form-item>
            <el-button type="primary" @click="save">保存</el-button>
            <el-button @click="cancel">取消</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
    </el-main>
  </el-container>
</template>
<script>
import {
  addDict,
  deleteDictByUnid,
  getDictByPunid,
  updateDict,
  getSordIdByPunid,
} from "@/api/dictionary";
import publicSubTop from "../../public/publicSubTop";
import rule from "./rule";

export default {
  components: {
    publicSubTop,
  },
  props: ["dictModeType"],
  data() {
    return {
      title: "",
      modeOption: {
        edit: 0,
        choose: 1,
      },
      rule: rule,
      modeType: -1,
      checkedKey: "",
      node: {},
      obj: {},
      box: false,
      addForm: {
        unid: "",
        dictName: "",
        dictValue: "",
        dictType: "",
        dictStatus: "",
        sortId: "",
      },
      editForm: {
        unid: "",
        dictName: "",
        dictValue: "",
        dictType: "",
        dictStatus: "",
        sortId: "",
      },
      option: {
        addBtn: true,
        editBtn: false,
        defaultExpandAll: false,
        draggable: true,
        menu: true,
        nodeKey: "unid",
        isLeaf: "isLeaf",
      },
      data: []
    };
  },
  created() {
    this.GetDictByPunid();
  },
  mounted() {
    this.setModeType(this.dictModeType);
  },
  methods: {
    allowDrag(draggingNode) {
        console.log(draggingNode)
      return true;
    },
    allowDrop(draggingNode, dropNode, type) {
        console.log(draggingNode, dropNode, type)
      return true;
    },
    hide() {
      if (this.$refs.addForm) {
        this.$refs.addForm.clearValidate();
        this.$refs.addForm.resetFields();
      }
      this.box = false;
      this.addForm = {};
    },
    handleNodeClick(data, node) {
      this.editForm.unid = data.unid;
      this.editForm.dictName = data.dictName;
      this.editForm.dictValue = data.dictValue;
      this.editForm.dictType = data.dictType;
      this.editForm.dictStatus = data.dictStatus;
      this.editForm.sortId = data.sortId;
      console.log(node)
    },
    handleNodeExpand(data, node) {
      this.reset();
      if (node.childNodes.length === 0) {
        this.getSubTree(node, data);
      }
    },
    getSubTree(node, data) {
      getDictByPunid(data.unid)
        .then((res) => {
          let ret = res.data;
          let temp = [];
          ret.data.forEach((item) => {
            temp.push({
              ...item,
              punid: data.unid,
              level: data.level + 1,
              label: item.dictName,
              is_show: false,
              isLeaf: item.isLeaf === 1,
              children: [],
            });
          });
          // node.expanded = true;
          node.doCreateChildren(temp);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    GetDictByPunid(punid) {
      getDictByPunid(punid)
        .then((res) => {
          this.data.splice(0, res.data.data.length);
          res.data.data.forEach((item) => {
            this.data.push({
              ...item,
              level: 1,
              label: item.dictName,
              is_show: false,
              isLeaf: item.isLeaf === 1,
              children: [],
            });
          });
          this.checkedKey = res.data.data[0].unid;
          this.editForm.unid = res.data.data[0].unid;
          this.editForm.dictName = res.data.data[0].dictName;
          this.editForm.dictValue = res.data.data[0].dictValue;
          this.editForm.dictType = res.data.data[0].dictType;
          this.editForm.dictStatus = res.data.data[0].dictStatus;
          this.editForm.sortId = res.data.data[0].sortId;
          this.$nextTick(() => {
            this.$refs.tree.setCurrentKey(res.data.data[0].unid);
          });

          setTimeout(() => {
            let node = this.getCurrentNode();
            this.handleNodeExpand(res.data.data[0], node);
          }, 200);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    refresh(node, data) {
      this.reset();
      var theChildren = node.childNodes;
      // 先删除所有子类
      theChildren.splice(0, theChildren.length);
      this.getSubTree(node, data);
      // node.expanded = true;
    },
    append(node, data) {
      this.reset();
      this.addForm.punid = data.unid;
      this.addForm.dictType = data.dictName;
      this.addForm.dictStatus = "Y";
      this.title = data.dictName;
      this.box = true;
      this.setSordId(node, data);
    },
    setSordId(node, data) {
      this.addForm.sortId = 0;
      let length = node.childNodes.length;
      if (length > 0) {
        let lastChild = node.childNodes[length - 1];
        console.info(lastChild.data.sortId);
        this.addForm.sortId = lastChild.data.sortId + 1;
      } else {
        getSordIdByPunid(data.unid)
          .then((res) => {
            this.addForm.sortId = res.data.data;
          })
          .catch((err) => {
            console.log(err);
            if (err.data.msg) {
              this.$message.warning(err.data.msg);
            }
          });
      }
    },
    reset() {},
    remove(node, data) {
      this.reset();
      this.$confirm("是否删除该字典[" + data.dictName + "]", "警告", {
        type: "warning",
      }).then(() => {
        deleteDictByUnid(data.unid)
          .then(() => {
            let node = this.$refs.tree.getNode(data.unid);
            this.refresh(node.parent.parent, node.parent.parent.data);
            this.refresh(node.parent, node.parent.data);
            node.parent.expanded = true;
            setTimeout(() => {
              node = node.parent;
              let last = node.childNodes.length - 1;
              // 选中新增节点
              let newNode = node;
              if (last >= 0) {
                newNode = node.childNodes[last];
              }
              let data = newNode.data;
              this.$refs.tree.setChecked(data.unid, true);
              this.editForm.unid = data.unid;
              this.editForm.dictName = data.dictName;
              this.editForm.dictValue = data.dictValue;
              this.editForm.dictType = data.dictType;
              this.editForm.dictStatus = data.dictStatus;
            }, 500);
            this.$message.success("删除成功");
          })
          .catch((err) => {
            console.log(err);
          });
      });
    },
    cancel() {
      if (this.$refs.editForm) {
        this.$refs.editForm.clearValidate();
        this.$refs.editForm.resetFields();
      }
      if (this.$refs.addForm) {
        this.$refs.addForm.clearValidate();
        this.$refs.addForm.resetFields();
      }
      this.hide();
    },
    update() {
      this.$refs.editForm.validate((valid) => {
        if (valid) {
          updateDict(this.editForm)
            .then(() => {
              this.$refs.editForm.clearValidate();
              let current = this.$refs.tree.getNode(this.editForm.unid);
              this.refresh(current.parent, current.parent.data);
              this.$message.success("更新成功");
            })
            .catch((err) => {
              console.log(err);
              if (err.data.msg) {
                this.$message.warning(err.data.msg);
              }
            });
        }
      });
    },
    save() {
      this.$refs.addForm.validate((valid) => {
        if (valid) {
          addDict(this.addForm)
            .then((res) => {
              let node = this.$refs.tree.getNode(this.addForm.punid);
              this.refresh(node.parent, node.parent.data);
              this.$message.success("新增成功");
              this.editForm.unid = res.data.data;
              this.editForm.dictName = this.addForm.dictName;
              this.editForm.dictValue = this.addForm.dictValue;
              this.editForm.dictType = this.addForm.dictType;
              this.editForm.dictStatus = this.addForm.dictStatus;
              this.hide();
            })
            .catch((err) => {
              console.log(err);
              if (err.data.msg) {
                this.$message.warning(err.data.msg);
              }
            });
        }
      });
    },
    mounted() {},
    setModeType(type) {
      this.modeType = type;
      if (type && type == "1") {
        this.$nextTick(() => {
          this.$refs.editForm.clearValidate();
        });
      }
    },
    changeModeType() {
      this.$emit("changeModeType", this.modeType);
    },
    getCurrentNode() {
      let current = this.$refs.tree.getNode(this.editForm.unid);
      return current;
    },
    getNodeData(unid) {
      let node = this.$refs.tree.getNode(unid);
      return node.data;
    },
  },
};
</script>
<style lang="scss">
.tree-node {
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
  padding-right: 10px;
}
.dictionary {
  .el-input.is-disabled .el-input__inner {
    background-color: #f5f7fa;
    color: #c0c4cc;
  }
}
</style>
