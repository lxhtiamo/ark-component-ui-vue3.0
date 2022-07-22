<template>
  <el-drawer
      custom-class="drawer-style"
      :title="title"
      size="50%"
      v-model="drawer"
      :direction="direction"
      :before-close="handleClose">
    <div class="d-content-style">
      <el-form :model="formData" label-width="140px" :rules="rules" ref="addItemRef" class="form-styles">
        <el-form-item label="用户账号" prop="userName" id="userName">
          <el-input v-model.trim="formData.userName" maxlength="50" placeholder="请输入用户账号"
                    :disabled="(item&&item.id)?true:false"></el-input>
        </el-form-item>
        <el-form-item label="用户名称" prop="realName" id="realName">
          <el-input v-model.trim="formData.realName" maxlength="50" placeholder="请输入用户名称"></el-input>
        </el-form-item>
        <el-form-item label="身份证号码" prop="idCard" id="idCard">
          <el-input v-model.trim="formData.idCard" maxlength="18" placeholder="请输入身份证号码"></el-input>
        </el-form-item>
        <el-form-item label="手机号码" prop="phone" id="phone">
          <el-input v-model.trim="formData.phone" maxlength="11" placeholder="请输入手机号码"></el-input>
        </el-form-item>
        <el-form-item label="所属部门" prop="deptCode" id="deptCode">
          <publicCascader maxlength="64" ref="el_d" style="width: 100%"
                          :content="formData.deptName?formData.deptName:'请选择'"
                          :isSingle="false" :showAllLevels="false"
                          @getNodeData="getNodeData">
          </publicCascader>
        </el-form-item>
        <el-form-item label="职务" prop="station" id="station">
          <el-select v-model="formData.station" placeholder="请选择职务" style="width: 100%">
            <el-option
                v-for="item in postList"
                :key="item.dictValue"
                :label="item.dictName"
                :value="item.dictValue">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="岗位" prop="position" id="position">
          <el-select v-model="formData.position" placeholder="请选择岗位" style="width: 100%">
            <el-option
                v-for="item in stationList"
                :key="item.dictValue"
                :label="item.dictName"
                :value="item.dictValue">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="角色授权" prop="roleName" id="roleName">
          <el-input placeholder="请选择角色" v-model="formData.roleName" readonly>
            <template v-slot:append>
              <el-button @click="goRoleList()">选择</el-button>
            </template>
          </el-input>
        </el-form-item>

        <el-form-item label="状态" prop="status" id="status">
          <el-radio-group v-model="formData.status">
            <el-radio label="0">启用</el-radio>
            <el-radio label="1">禁用</el-radio>
          </el-radio-group>
        </el-form-item>

      </el-form>
    </div>
    <div class="d-footer-style">
      <el-button @click="closed()">取消</el-button>
      <el-button type="primary" :loading="loading" @click="submitData">确定</el-button>
    </div>

    <role-drawer v-if="showRole" @closed="closedDrawer" :selectList="selectList"></role-drawer>

  </el-drawer>
</template>

<script>
import * as publicRule from "@/rules/rules.js";
import {user_addItem, user_editItem, user_detail} from '@/api/systemManageApi'
import {dict_findDictList} from '@/api/common/common.js'
import Dept from "@/util/classes/deptLazy"
import {deepClone} from "../../../util/util";
import {findConfig} from '@/api/systemManageApi'
import roleDrawer from "./roleDrawer";
import publicCascader from "../../../public/publicCascader";

export default {
  name: "addOrEdit",
  props: {
    item: {
      type: Object,
      default: () => null
    },
    areaInfo: {
      type: Object,
      default: () => null
    }
  },
  components: {roleDrawer, publicCascader},
  data() {
    return {
      drawer: true,
      direction: 'rtl',
      title: '',
      formData: {
        userName: '',
        realName: '',
        idCard: '',
        phone: '',
        deptCode: '',
        deptName: '',
        area: [],
        station: '',
        position: '',
        groupUnids: '',
        group: '',
        status: '0',
        areaName: '',
        areaCode: '',
        fullAreaCode: '',
        password: '',
        id: '',
        sysRoleUnids: '',
        roleName: '',
        orgId: '',
      },
      rules: {
        userName: [{required: true, trigger: 'blur', message: '请输入用户账号'}, {
          validator: publicRule.passHtmlAndSql,
          trigger: "blur"
        }],
        realName: [{required: true, trigger: 'blur', message: '请输入用户名称'}, {
          validator: publicRule.passHtmlAndSql,
          trigger: "blur"
        }],
        idCard: [{required: false, validator: publicRule.IDCard, trigger: "blur",}],
        phone: [{required: true, trigger: 'blur', message: '请输入手机号码'}, {
          required: true,
          validator: publicRule.isMobilePhone,
          trigger: "blur",
        }],
        deptCode: [{required: true, trigger: 'change', message: '请选择所属部门'}],
        station: [{required: false, trigger: 'blur', message: '请选择职务'}],
        position: [{required: false, trigger: 'blur', message: '请选择岗位'}],
        group: [{required: false, trigger: 'blur', message: '请选择关联企业分组'}],
        roleName: [{required: false, trigger: 'blur', message: '请选择授权角色'}],
        status: [{required: true, trigger: 'blur', message: '请选择状态'}],
        // documentNo: [{validator: passHtmlAndSql, trigger: 'blur'}],
      },
      deptList: [],
      postList: [],
      stationList: [],
      loading: false,
      dictMap: '',
      deptIns: new Dept(this, {value: 'id', strict: false, deptType: ''}),
      entLoading: false,
      groupEntList: {initList: [], currentList: [],},
      showRole: false,
      selectList: [],
      deptObj: null,//当前选的部门
    }
  },
  mounted() {
    this.dictMap = new Map();
    if (this.item) {
      this.title = '编辑用户列表';
      this.getDetail();
    } else {
      this.title = '添加用户列表';
      this.formData.orgId = this.areaInfo.id;
      this.getConfig();
      this.$nextTick(() => {
        if (this.areaInfo && this.areaInfo._deptList.length > 1) {
          let deptList = this.areaInfo._deptList
          this.formData.deptName = deptList[deptList.length - 1].name;
          this.formData.deptCode = deptList[deptList.length - 1].deptCode;
          this.formData.areaName = deptList[deptList.length - 2].name;
          this.formData.areaCode = deptList[deptList.length - 2].regionCode;
          let area = deptList.map(v => v.id);//这里取id才是正确的
          this.formData.area = deepClone(area)
          //this.deptIns.loadChildNodedData(area, this.formData.area)
        }
      })
    }
    this.getDic();
  },
  methods: {
    /*选择所属部门回调数据*/
    getNodeData(data, val) {
      this.deptObj = data;
      this.formData.area = val
      if (data) {
        if (this.deptObj && this.deptObj.nature && this.deptObj.nature == '2') {//判断是否部门
          if (this.deptObj.deptCode) {
            this.formData.deptName = data.name;
            this.formData.deptCode = data.deptCode;
            this.formData.areaName = data.name;
            this.formData.areaCode = data.regionCode;
          } else {
            this.cleanDept();
          }
        } else {
          this.cleanDept();
        }
      } else {
        this.cleanDept();

      }
      this.$refs.addItemRef.validateField('deptCode')
    },
    //清空所选的部门数据
    cleanDept() {
      this.formData.deptName = '';
      this.formData.deptCode = '';
      this.formData.areaName = '';
      this.formData.areaCode = '';
    },
    handleClose() {
      this.closed();
    },
    closed(obj) {
      this.$emit('closed', obj)
    },
    getDetail() {
      user_detail({id: this.item.id})
          .then(res => {
            let data = res.data.data;
            for (let key in this.formData) {
              if (data[key]) {
                this.formData[key] = data[key]
              }
            }
            this.formData.group = (data.groupList || []).map(v => v.unid);
            this.formData.roleName = (data.roleList || []).map(v => v.name).join(',');
            this.formData.sysRoleUnids = (data.roleList || []).map(v => v.id).join(',');
            this.selectList = data.roleList || [];
            if (this.formData.fullAreaCode) {
              this.$nextTick(() => {
                let area = this.formData.fullAreaCode.split(',')
                this.formData.area = deepClone(area)
                // this.deptIns.loadChildNodedData(area, this.formData.area)
              })
            }

          })
          .catch(err => {
            this.$util.showMessage(err)
          })
    },
    submitData() {
      let netWork = ''
      this.$util.isValidate(this, 'addItemRef').then(res => {
        if (res) {
          this.getAreaAndDept();
          if (this.formData.group && Array.isArray(this.formData.group)) {
            this.formData.groupUnids = this.formData.group.join(',')
          }
          if (this.formData.id) {
            netWork = user_editItem
          } else {
            netWork = user_addItem;
          }
          this.loading = true;
          netWork(this.formData).then(() => {
            this.$util.showMessage('操作成功', '1')
            this.closed(true)
          }).catch(() => {
            //this.$util.showMessage(err);
          }).finally(() => {
            this.loading = false;
          })
        }
      })
    },
    getDic() {
      return new Promise((resolve, reject) => {
        dict_findDictList('职务,岗位')
            .then(res => {
              let data = res.data.data;
              this.postList = data.filter(v => v.dictType == '职务')
              this.stationList = data.filter(v => v.dictType == '岗位')
              resolve(data)
            })
            .catch(err => {
              reject(err)
              this.$util.showMessage(err)
            })
      })

    },
    getAreaAndDept() {
      if (this.deptObj) {
        this.formData.deptCode = this.deptObj.deptCode;
        this.formData.deptName = this.deptObj.name;
        let areaObj = this.$refs.el_d.getNodeParent(this.deptObj.parentId);
        if (areaObj && areaObj.standard == '7') {
          let parent = this.$refs.el_d.getNodeParent(areaObj.parentId);
          this.formData.areaName = parent.name || '';
          this.formData.areaCode = parent.regionCode || '';
        } else {
          areaObj = this.deptObj;
          this.formData.areaName = this.deptObj.name || '';
          this.formData.areaCode = this.deptObj.regionCode || '';
        }
        this.formData.orgId = this.deptObj && this.deptObj.id || ''
      }
      this.formData.fullAreaCode = this.formData.area.join(',')
    },
    getConfig() {
      findConfig()
          .then(res => {
            let data = res.data.data;
            this.formData.password = data && data.sysUserPwdInit || '';
          })
    },
    goRoleList() {
      this.showRole = true
    },
    closedDrawer(list) {
      this.showRole = false;
      if (Array.isArray(list)) {
        this.formData.roleName = list.map(v => v.name).join(',');
        this.formData.sysRoleUnids = list.map(v => v.id).join(',');
        // this._reset();
        this.selectList = list || [];
      }

    }
  },
}
</script>

<style scoped>

</style>