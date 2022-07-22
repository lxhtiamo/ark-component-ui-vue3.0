<template>
  <div class="div-screen-box">
    <el-header class="topParentHeader" style="height: 60px">
      <publicSubTop title="安全配置">
      </publicSubTop>
    </el-header>
    <div class="screen-content-div" style="overflow: auto;padding: 0 15% 0 10%;box-sizing: border-box">
      <el-form :model="formData" label-width="140px" :rules="rules" ref="addItemRef" class="form-styles"
               style="margin-top: 50px;">
        <el-form-item label="平台用户初始密码" prop="sysUserPwdInit" id="sysUserPwdInit">
          <el-input v-model.trim="formData.sysUserPwdInit" maxlength="50" placeholder="请输入平台用户初始密码"
                    onkeyup="value=value.replace(/[^-\x22,^\w\.\/]/ig,'')" type="password"
                    autoComplete="new-password" show-password></el-input>
        </el-form-item>
        <el-form-item label="错误次数" prop="pwdRetries" id="pwdRetries" class="form-input-item">
          <el-input v-model.trim="formData.pwdRetries" maxlength="50" placeholder="请输入错误次数"
                    onkeyup="value=value.replace(/[^\d]/g,'')"></el-input>
          <span>次数</span>
        </el-form-item>

        <el-form-item label="错误等待时间" prop="pwdRetriesMinutes" id="pwdRetriesMinutes" class="form-input-item">
          <el-input v-model.trim="formData.pwdRetriesMinutes" maxlength="4" placeholder="请输入错误等待时间"
                    onkeyup="value=value.replace(/[^\d]/g,'')"></el-input>
          <span>分钟</span>
        </el-form-item>
        <el-form-item label=" ">
          <el-button type="primary" :loading="loading" @click="submitData">保存</el-button>
        </el-form-item>
      </el-form>
    </div>

  </div>
</template>

<script>
import {saveConfig, findConfig} from '@/api/systemManageApi';
import publicSubTop from "../../../public/publicSubTop";
import {passHtmlAndSql} from "../../../rules/rules";

export default {
  name: "index",
  components: {publicSubTop},
  data() {
    return {
      formData: {
        loginType: '',
        loginTypeTemp: [],
        pwdStrength: '',
        pwdEncryptType: '',
        pwdRetries: '',
        pwdRetriesMinutes: '',
        unid: '',
        sysUserPwdInit: '',
      },
      rules: {
        loginTypeTemp: [{required: true, trigger: 'blur', message: '请选择登录方式'}],
        pwdStrength: [{required: true, trigger: 'blur', message: '请选择密码强度'}],
        pwdEncryptType: [{required: true, trigger: 'blur', message: '请选择密码加密方式'}],
        sysUserPwdInit: [{required: true, trigger: 'blur', message: '请输入平台用户初始密码'}, {
          validator: passHtmlAndSql,
          trigger: "blur"
        }],
        pwdRetries: [{required: true, trigger: 'blur', message: '请输入错误次数'}],
        pwdRetriesMinutes: [{required: true, trigger: 'blur', message: '请输入错误等待时间'}],
      },
      pwdList: [
        {label: '密度弱', value: 1, word: '至少8个任意字符'},
        {label: '密度中', value: 2, word: '至少8个任意字符，采用英文字母、数字和特殊字符中两者以上组合'},
        {label: '密度强', value: 3, word: '8个字符以上长度，采用英文字母、数字和特殊字符'}
      ],
      loading: false,
    }
  },
  mounted() {
    this.getDetail();
  },
  methods: {
    submitData() {
      if (this.$util.isValidate(this, 'addItemRef')) {
        this.loading = true;
        this.formData.loginType = this.formData.loginTypeTemp.join(',');
        saveConfig(this.formData).then(() => {
          this.$util.showMessage('保存成功', '1')
        }).catch(err => {
          this.$util.showMessage(err)
        }).finally(() => {
          this.loading = false;
        })
      }
    },
    getDetail() {
      findConfig().then(res => {
        let data = res.data.data || {};
        for (let key in this.formData) {
          if (data[key]) {
            this.formData[key] = data[key];
            if (this.formData.loginType) {
              this.formData.loginTypeTemp = this.formData.loginType.split(',')
            }
          }
        }
      }).catch(err => {
        this.$util.showMessage(err)
      })
    },
  },
}
</script>

<style lang="scss" scoped>
/*密码输入框透明色,谷歌默认在填充密码后会给个丑不拉几的黄色*/
:deep( input:-webkit-autofill,
input:-webkit-autofill:hover,
input:-webkit-autofill:focus,
input:-webkit-autofill:active ) {
  -webkit-transition-delay: 111111s;
  -webkit-transition: color 11111s ease-out, background-color 111111s ease-out;
}


.form-input-item {
  .el-input {
    width: calc(100% - 40px) !important;
  }

  span {
    font-weight: 400;
    color: #303e52;
    font-size: 14px;
    width: 40px;
    display: inline-block;
    text-align: right;
  }
}
</style>