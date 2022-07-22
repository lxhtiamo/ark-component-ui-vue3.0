<template>
  <el-dialog :title="title" v-model="dialogFormVisible" :before-close="closedDialog" :close-on-click-modal="false">
    <el-form :model="formData" label-width="110px" :rules="rules" ref="addItemRef">
      <el-form-item label="角色名称" prop="name">
        <el-input v-model.trim="formData.name" placeholder="请输入角色名称" maxlength="20"></el-input>
      </el-form-item>

      <el-form-item label="角色描述" prop="description">
        <el-input v-model.trim="formData.description"
                  placeholder="请输入角色描述" 
                  type="textarea" 
                  show-word-limit
                  resize="none"
                  maxlength="200"
                  :rows="5"></el-input>
      </el-form-item>

      <el-form-item label="排序号" prop="sortNum">
        <el-input v-model.trim="formData.sortNum" placeholder="请输入排序号" maxlength="5" t type="text"
                  onkeyup="value=value.replace(/[^\d]/g,'')"></el-input>
      </el-form-item>

      <el-form-item label="状态" prop="status">
        <el-radio-group v-model="formData.status">
          <el-radio label="0">启用</el-radio>
          <el-radio label="1">禁用</el-radio>
        </el-radio-group>
      </el-form-item>

    </el-form>

    <template v-slot:footer>
      <div>
        <el-button @click="closed()">关闭</el-button>
        <el-button type="primary" :loading="loading" @click="submitData">确定</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script>
import {role_addItem, role_editItem, role_detail} from '@/api/systemManageApi'
import {passHtmlAndSql} from "../../../rules/rules";

export default {
  name: "addDialog",
  props: {
    item: {
      type: Object,
      default: null,
    }
  },
  data() {
    return {
      title: '添加系统角色',
      dialogFormVisible: true,
      formData: {name: '', description: '', sortNum: '', status: '0', id: ""},
      rules: {
        name: [{required: true, trigger: 'blur', message: '请输入角色名称'},
          {validator: passHtmlAndSql, trigger: "blur"}],
        description: [{required: true, trigger: 'blur', message: '请输入角色描述'}, {
          validator: passHtmlAndSql,
          trigger: "blur"
        }],
        sortNum: [{required: true, trigger: 'blur', message: '请输入排序号'}],
        status: [{required: true, trigger: 'blur', message: '请选择状态'}],
      },
      loading: false,
    }
  },
  mounted() {
    if (this.item) {
      this.title = '编辑系统角色';
      this.getDetail();
    } else {
      this.title = '添加系统角色'
    }
  },
  methods: {
    closedDialog() {
      this.closed();
    },
    submitData() {
      let netWork = ''
      this.$util.isValidate(this, 'addItemRef').then(res => {
        if (res) {
          if (this.formData.id) {
            netWork = role_editItem
          } else {
            netWork = role_addItem;
          }
          this.loading = true;
          netWork(this.formData).then(() => {
            this.$util.showMessage('操作成功', '1')
            this.closed(true)
          }).catch(err => {
            this.$util.showMessage(err);
          }).finally(() => {
            this.loading = false;
          })
        }
      })
    },
    closed(obj) {
      this.$emit('closed', obj)
    },
    getDetail() {
      role_detail({id: this.item.id})
          .then(res => {
            this.formData = res.data.data || {};
          })
          .catch(err => {
            this.$util.showMessage(err)
          })
    }
  },
}
</script>

<style scoped>

</style>