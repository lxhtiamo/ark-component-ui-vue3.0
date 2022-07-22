<!--模块组件注释-->
<template>
  <div>
    <el-form ref="editForm" :model="editForm" label-width="150px" style="margin-right: 30px" :rules="rules">
      <el-form-item label="上级名称" v-if="showHigherName">
        <div class="append">
          <el-input v-model="editForm.higherName" disabled placeholder="请选择上级机构">
            <template v-slot:append>
              <span @click="addDept" class="spanText" style="cursor: pointer">选择</span>
            </template>
          </el-input>
        </div>
      </el-form-item>
      <el-form-item label="机构名称" prop="name">
        <el-input maxlength="50" placeholder="请填写组织架构名称"
                  v-model="editForm.name"></el-input>
      </el-form-item>
      <el-form-item label="机构级别" prop="standard">
        <el-select
            style="width: 100%"
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
            style="width: 100%"
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
        <el-button type="primary" @click="update" size="default" icon="Check" :loading="loading">保存</el-button>
        <el-button size="default" icon="Delete" @click="cancel" :disabled="loading">取消</el-button>
      </el-form-item>
    </el-form>
    <el-dialog :close-on-click-modal="false" title="选择上级机构" customClass="orgDialogHeight" width="35%"
               v-model="openTreeDialog"
               append-to-body v-if='openTreeDialog'>

      <selectDepartment @closeTreeDialog="closeTreeDialog" @treeData="treeData" :isMyShow="true"
                        ref="selectArea"></selectDepartment>

    </el-dialog>
  </div>
</template>

<script>
import * as publicRule from "@/rules/rules.js";
import {add} from "../../api/orgManage";
import {dict_findDictList} from "../../api/common/common";
import selectDepartment from './selectDepartment'

export default {
  name: "add",
  components: {selectDepartment},
  props: ['detail'],
  data() {
    let self = this;
    return {
      orgLevelList: [],//机构级别集合
      orgTypeList: [],//机构类型集合
      showHigherName: false,
      loading: false,
      openTreeDialog: false, //部门树dialog
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
        standard: ''//'层级;1:国家;2省;3市;4区县;5镇;6村;7虚拟',
      },
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
    }
  },
  computed: {},
  watch: {
    'editForm.higherName': {
      handler(newName, oldName) {
        if (newName && newName.length > 0) {
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
    if (this.detail) {
      this.editForm = JSON.parse(JSON.stringify(this.detail));
    }
    this.findDictList()
  },
  mounted() {
  },

  methods: {
    addDept() {
      this.openTreeDialog = true;

    },
    /*部门树回填 节点数据*/
    closeTreeDialog() {
      this.openTreeDialog = false;
    },
    treeData(data) {
      this.editForm.higherName = data.name;
      this.editForm.parentId = data.id
    },
    findDictList() {
      dict_findDictList('机构级别,机构类型').then(res => {
        let data = res.data.data;
        this.orgLevelList = data.filter(v => v.dictType == '机构级别')
        this.orgTypeList = data.filter(v => v.dictType == '机构类型')
      })
    },
    update() {
      this.$refs.editForm.validate((valid) => {
        if (valid) {
          this.loading = true;
          add(this.editForm).then(res => {
            this.loading = false;
            if (res.data.code == 200) {
              if (res.data.data) {
                this.editForm.unid = res.data.data;
                this.onCloseAdd(this.editForm);
              }
            }
            this.$message.success('添加成功')
          }).catch(err => {
            this.loading = false;
            if (err && err.data && err.data.msg) {
              this.$message.warning(err.data.msg);
            }
          });
        }
      });

    },
    cancel() {
      this.onCloseAdd();
    },
    onCloseAdd(obj) {
      this.$emit('onCloseAdd', obj)
    },
  },
}
</script>

<style lang="scss" scoped>

</style>
<style lang="scss">

</style>