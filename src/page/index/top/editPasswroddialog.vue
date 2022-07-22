<template>
  <div>
    <el-form
        :model="ruleForm"
        :rules="rules"
        ref="upForm"
        label-position="center"
        label-width="100px"
        style="width: 80%;margin: 40px auto;">
      <el-form-item label="旧密码" prop="oldPassword">
        <el-input
            v-model.trim="ruleForm.oldPassword"
            placeholder="请输入旧密码"
            show-password
            auto-complete="new-password"
            maxlength="40"
        ></el-input>
      </el-form-item>
      <el-form-item label="新密码" prop="password">
        <el-row style="position: relative;width: 100%">
          <el-input
              maxlength="40"
              v-model="ruleForm.password"
              @focus.capture="changePasswordTip(true)"
              @blur.capture="changePasswordTip(false)"
              auto-complete="new-password"
              type="password"
              placeholder="请输入密码"></el-input>
          <verifyPassWordTip style="position: absolute"
                             :password="ruleForm.password"
                             ref="verifypwd"
                             :isShowTip="isShowTip">
          </verifyPassWordTip>
        </el-row>
      </el-form-item>
      <el-form-item label="重复新密码" prop="RepeatPassword">
        <el-input
            maxlength="40"
            v-model="ruleForm.RepeatPassword"
            placeholder="请再次输入新密码"
            id="newkey1"
            type="password">
        </el-input>
      </el-form-item>
    </el-form>
    <div class="dialog-footer">
      <el-button @click="close" size="default" :disabled="loading">取消</el-button>
      <el-button type="primary" @click="submit" size="default" :loading="loading">确定</el-button>
    </div>
  </div>
</template>

<script>
import verifyPassWordTip from "@/components/passwordvalidate";
import {modifyPwd} from "../../../api/common/common";
import CryptoJS from "crypto-js";

export default {
  props: ["userInfo"],
  components: {verifyPassWordTip},
  data() {
    let judgeObj = (rule, value, callback) => {
      if (value == null || value == "") {
        callback(new Error("请再次输入新密码"));
      } else {
        if (this.ruleForm.password == value) {
          callback();
        } else {
          callback(new Error("两次输入密码不相同"));
        }
      }
    };
    let pwdVer = (rule, value, callback) => {
      if (value == null || value == "") {
        callback(new Error("请输入新密码"));
      } else {
        let pwdResult = this.$refs.verifypwd.passwordValid(value);
        if (pwdResult.degreeNumber <= 2) {
          callback(new Error("密码必须包含大小写字母和数字"));
        } else {
          callback();
        }
      }
    };
    var letterOrNum = (rule, value, callback) => {
      // if (!/^(?=.*[a-zA-Z])(?=.*[0-9])[a-zA-Z0-9]{6,10}$/.test(value)) {
      if (!/^(?![0-9]+$)(?![a-z]+$)(?![A-Z]+$)(?!([^(0-9a-zA-Z)]|[()])+$)([^(0-9a-zA-Z)]|[()]|[a-z]|[A-Z]|[0-9]){6,40}$/.test(value)) {
        callback(new Error("至少6个字符,大、小英文字母/数字/特殊符号中两者以上组合"));
      } else {
        callback();
      }
    };
    return {
      ruleForm: {
        oldPassword: '',
        password: '',
        RepeatPassword: '',
      },
      isShowTip: false,
      loading: false,
      rules: {
        oldPassword: [{required: true, message: "请输入旧密码", trigger: "blur"}],
        password: [
          {required: true, message: "请输入新密码", trigger: "blur"},
          {
            min: 6,
            max: 24,
            message: "长度在 6 到 24 个字符",
            trigger: "blur",
          },
          {validator: letterOrNum, trigger: "blur"},
        ],
        rePassword: [
          {required: true, message: "请再次输入新密码", trigger: "blur"},
          {
            min: 6,
            max: 24,
            message: "长度在 6 到 24 个字符",
            trigger: "blur",
          },
          {validator: letterOrNum, trigger: "blur"},
          {validator: this.samePasswordCheck, trigger: "blur"},
        ],
      },
    };
  },

  created() {
  },
  computed: {},
  mounted() {
  },
  methods: {
    samePasswordCheck(rule, value, callback) {
      if (value && this.ruleForm.password && value != this.ruleForm.password) {
        callback(new Error("两次输入的新密码不一致"));
      } else if (value && this.ruleForm.password && value == this.ruleForm.password) {
        callback();
      }
    },
    close() {
      this.$emit("close");
    },
    clean() {
      this.$refs.upForm.clearValidate();
    },
    /**
     * 改变密码提示是否显示
     **/ changePasswordTip(isShow) {
      if (isShow) {
        this.isShowTip = true;
      } else {
        this.isShowTip = false;
      }
    },
    encrypt(word, keyRan) {
      const key = CryptoJS.enc.Utf8.parse("linewell" + keyRan);
      // const iv = CryptoJS.enc.Utf8.parse('30313233343536373839414243444546');
      let srcs = CryptoJS.enc.Utf8.parse(word);
      let encrypted = CryptoJS.AES.encrypt(srcs, key, {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7,
      });
      return encrypted.toString();
    },
    /*修改密码*/
    submit() {
      this.$refs["upForm"].validate(valid => {
        if (valid) {
          let random = "";
          for (var i = 0; i < 8; i++) {
            random += Math.floor(Math.random() * 10);
          }
          let obj = {
            oldPwd: this.encrypt(this.ruleForm.oldPassword, random),
            newPwd: this.encrypt(this.ruleForm.password, random),
            random: random,
          };
          this.loading = true
          modifyPwd(obj).then(res => {
            this.loading = false;
            if (res.data.code == 200) {
              this.$message.success("密码修改成功")
              setTimeout(() => {
                this.$emit("close");
                this.logout();
              }, 300)
            }

          }).catch(err => {
            this.loading = false;
            if (err && err.data && err.data.msg) {
              this.$message.warning(err.data.msg);
            } else {
              this.$message.warning("密码修改失败");
            }
          });
        }
      });
    },
    /*退出*/
    logout() {
      this.$store.dispatch("LogOut").then(() => {
        this.$router.replace({
          path: "/login"
        })
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.dialog-footer {
  box-sizing: border-box;
  border-top: 1px solid #f2f2f2;
  height: 65px;
  line-height: 65px;
  text-align: center;
}

/*密码输入框透明色,谷歌默认在填充密码后会给个丑不拉几的黄色*/
:deep( input:-webkit-autofill,
input:-webkit-autofill:hover,
input:-webkit-autofill:focus,
input:-webkit-autofill:active ) {
  -webkit-transition-delay: 111111s;
  -webkit-transition: color 11111s ease-out, background-color 111111s ease-out;
}

</style>
