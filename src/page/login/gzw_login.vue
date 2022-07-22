<template>
  <div class="login-fj" style="height: 100%">
    <div class="header">
      <img src="../../../public/img/icon/qyyhzx.png" class="img_icon" alt=""/>
    </div>
    <div class="login-wrap">
      <div class="login_content">
        <div class="login_spring">
          <div class="login_title">
            <span class="china_title">你好，欢迎登录</span>
          </div>
          <div>
          </div>
          <el-form
              ref="loginForm"
              :rules="loginRules"
              :model="temp"
              class="elFrom">
            <el-form-item prop="username" label-width="0" style="margin-bottom: 0!important">
              <el-input
                  class="name"
                  autocomplete="off"
                  @click="inputStatus = 'USER'"
                  @focus="(inputStatus = 'USER',userFocus=true)"
                  @blur="userFocus=false"
                  placeholder="请输入用户名"
                  v-model="temp.username"
                  @keyup.enter="handle">
                <template v-slot:prefix>
                  <div class="prefix_box">
                    <img :src="showImg('1')" class="input_prefix_icon" alt="" style="width:18px;height:20px"/>
                  </div>
                </template>
              </el-input>
            </el-form-item>
            <el-form-item prop="password" label-width="0" style="margin-bottom: 0!important">
              <el-input
                  class="pwd"
                  autocomplete="off"
                  v-model="temp.password"
                  @focus="(inputStatus = 'PWD',pwdFocus=true)"
                  @blur="pwdFocus=false"
                  placeholder="请输入密码"
                  type="password"
                  show-password
                  @keyup.enter="handle">
                <template v-slot:prefix>
                  <div class="prefix_box">
                    <img :src="showImg('2')" class="input_prefix_icon" alt="" style="width:18px;height:20px"/>
                  </div>
                </template>
              </el-input>
              <div class="el-form-item__error" v-show="isshownamepsw" v-cloak>
                {{ errorMessage }}
              </div>
            </el-form-item>
            <el-checkbox v-model="remember" class="checkBoxStyle">记住密码</el-checkbox>
            <el-form-item prop="key" v-if="isShowVerifyCode">
              <el-input
                  v-model="temp.key"
                  class="name"
                  maxlength="8"
                  placeholder="请输入验证码"
              ></el-input>
              <div class="divIdentifyingCode" @click="getIdentifyingCode(true)">
                <img
                    id="imgIdentifyingCode"
                    class="imgurlkey"
                    :src="getImageUrl()"/>
              </div>
              <div
                  class="el-form-item__error"
                  v-show="isShowVerifyerror"
                  v-cloak>
                {{ errorMessage ? errorMessage : "" }}
              </div>
            </el-form-item>
            <el-form-item label-width="0px">
              <el-button class="submit" type="primary" @click="handle">立即登录</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import {login} from "@/api/new_login";
import {setStore, getStore} from "@/util/store";
import CryptoJS from "crypto-js";
import {baseUrl, casLoginType} from "@/config/env";
import {getRedirectUri} from "@/util/util";
import {mapGetters} from "vuex";
import {getAppInfoByAppCode} from "@/api/user";

export default {
  components: {},
  data() {
    let judgeObj = (rule, value, callback) => {
      if (this.isShowVerifyerror) {
        if (value == "") {
          callback(new Error(""));
        } else {
          let containSpecial = /[`~@＠#$%^&*+=<>?{}|/'\\[\]￥％…]/im;
          if (containSpecial.test(value)) {
            this.isShowVerifyerror = false;
            callback(new Error("验证码不能含有特殊字符"));
          } else {
            this.isShowVerifyerror = true;
            callback();
          }
        }
      } else {
        if (value == "") {
          callback(new Error("请输入验证码"));
        } else {
          let containSpecial = /[`~@＠#$%^&*+=<>?{}|/'\\[\]￥％…]/im;
          if (containSpecial.test(value)) {
            callback(new Error("验证码不能含有特殊字符"));
          } else {
            callback();
          }
        }
      }
    };
    let pwdObj = (rule, value, callback) => {
      if (value == "") {
        this.isshownamepsw = false;
        callback(new Error("请输入密码"));
      }
    };
    return {
      time: 5,//倒计时
      timer: '',//倒计时对象
      centerDialogVisible: false,//默认显示登录页
      loadingBTN: false,//保存按钮
      jobCategoryList: [],
      loading: {},
      temp: {
        username: "",
        password: "",
        key: "",
      },
      GoogleDowndialogVisible: false,
      checked: true,
      // casLoginUrl: "http://218.104.238.200:11898/cas/remoteLogin",
      serviceUrl: "",
      loginRules: {
        username: [
          {required: true, message: "请输入用户名", trigger: "blur"},
        ],
        password: [{required: true, message: "请输入密码", trigger: "blur"}],
        key: [{required: true, trigger: "blur", validator: judgeObj}],
      },
      isThree: false,
      isShowVerifyCode: false,
      loginIndex: 0,
      Vcode: Math.random(),
      imageurl: "",
      isshownamepsw: false,
      isShowVerifyerror: false,
      errorMessage: "",
      downtitle: "",
      substr: "",
      remember: false,
      userFocus: false,
      pwdFocus: false,
      sysName: '',
    };
  },
  mounted() {
    this.sysName = this.$route.query.sysName
    this.imageurl = baseUrl + "/getRandomCode?loginId=" + this.Vcode;
    this.isShowVerifyCode = getStore({name: "verifyCode"});
    let wei = this.getCPU();
    this.downtitle =
        "谷歌浏览器下载(当前系统" + this.getOsInfo() + "  " + wei + ")";
    this.getAppInfoByAppCode();
  },
  computed: {
    ...mapGetters(["website"]),
  },
  watch: {},
  created() {

    this.substr = this.getQueryString("service");//根据url截取跳转过来的其他系统url
    this.isThree = true;
    if (this.substr) {
      this.serviceUrl = this.substr;  //这是截取的跳转登入的其他系统的url不包含login标记
    } else {
      this.serviceUrl = window.location.href.split("#")[0] + "#/newHome/login"; //默认登录页
      console.log("serviceUrl", this.serviceUrl);
    }
    console.log("初始化的serviceUrl==>>", this.serviceUrl);
    this.getAccount();
  },
  methods: {
    getAppInfoByAppCode() {
      getAppInfoByAppCode().then((res) => {
        if (!res.data.data) return;
        this.website.indexTitle = res.data.data.name;
        this.website.title = res.data.data.name;
        window.document.title = res.data.data.name;
        this.$store.commit("SET_WEBSITE", this.website);
      });
    },
    getImageUrl() {
      return this.imageurl;
    },
    /*开始监测账户信息先获取用户账号信息*/
    testAccount() {
      this.$store.dispatch("GetUserInfo").then((res) => {
        this.jumpUrl()
      });
    },
    /*登入系统*/
    getTGTInfo() {
      this.$refs["loginForm"].validate((valid) => {
        if (valid) {
          let random = "";
          for (var i = 0; i < 8; i++) {
            random += Math.floor(Math.random() * 10);
          }
          let strpwd = this.encrypt(this.temp.password, random);
          const routeHash = getStore({name: "routeHash"});
          if (routeHash) {
            if (routeHash.includes('/login') && this.serviceUrl.includes('/login')) {//如果登录的标记,并且跳转链接有login的标记就是门户自己本身,反之就是其他系统跳转登入使用.
              this.serviceUrl = window.location.href.split("#")[0] + "#/" + routeHash;
            }
            console.log("routeHash===>serviceUrl==>>" + this.serviceUrl)
            console.log("routeHash=====>>" + routeHash)
          }
          login({
            username: this.temp.username,
            password: strpwd,
            verifyCode: this.temp.key,
            random: random,
            three: this.isThree,
            verificationCode: '',
          }).then((res) => {
            const data = res.data;
            if (data.code == 200) {
              this.rememberAccount();
              this.$store.dispatch("setLoginToken", data.data).then(() => {
                this.testAccount()
              }).catch(() => {
              });

              this.testAccount()
              /* if (data.data != null && data.data.code != null && data.data.code != "") {
                   if (data.data.code == 102 || data.data.code == 103) {
                       setStore({
                           name: "verifyCode",
                           content: true,
                       });
                       this.errorMessage = data.data.error_description;
                       this.isShowVerifyerror = true;
                       this.isshownamepsw = false;
                       this.isShowVerifyCode = true;
                   } else if (data.data.code == 101) {
                       this.errorMessage = data.data.error_description;
                       this.isshownamepsw = true;
                       this.isShowVerifyerror = false;
                   }
               } else {
                   let url = baseUrl + "/loginByCas?ticket=" + data.data;
                   setStore({name: "verifyCode", content: false,});
                   if (this.isThree) {
                       console.log("true", this.serviceUrl + "?ticket=" + data.data);
                       this.$store.dispatch("LoginByCAS", url).then(() => {
                           this.testAccount()
                       }).catch(() => {
                       });
                   } else {
                       console.log("false", this.serviceUrl + "?ticket=" + data.data);
                       this.$store.dispatch("LoginByCAS", url).then(() => {
                           this.testAccount()
                       }).catch(() => {
                       });
                   }
               }*/
            }
          }).catch((e) => {
            console.log(e.message);
          });
        }
      });
    },
    /*跳转*/
    jumpUrl() {
      this.$router.replace({
        path: "/wel/index"
      });
      //  location.href = this.serviceUrl;
    },
    rememberAccount() {
      if (this.remember) {
        let content = {
          username: this.temp.username,
          password: this.temp.password,
          isRemember: true,
        };
        window.localStorage.setItem(
            "irhy-work-user-info",
            JSON.stringify(content)
        );
      } else {
        window.localStorage.removeItem("irhy-work-user-info");
      }
    },
    getAccount() {
      let objString = window.localStorage.getItem("irhy-work-user-info");
      if (objString) {
        let obj = JSON.parse(objString);
        this.temp.password = obj.password
        this.temp.username = obj.username;
        this.remember = true
      }
    },
    doCasLogin(goUrl) {
      let vars = {};
      goUrl.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value) {
        value = value.split("#")[0];
        vars[key] = value;
      });
      let redirect_uri;
      if (casLoginType === "local") {
        redirect_uri = getRedirectUri(window.location);
      } else {
        redirect_uri = getRedirectUri(window.opener.location);
      }
      let url =
          baseUrl +
          "/loginByCas?ticket=" +
          vars["ticket"] +
          "&service=" +
          redirect_uri;
      this.$store
          .dispatch("LoginByCAS", url)
          .then(() => {
            window.location.href = goUrl;
          })
          .catch(() => {
          });
    },
    //下载谷歌弹窗
    downGoogle() {
      this.GoogleDowndialogVisible = true;
    },
    /**
     * @title 获取数据
     * @detail 赋值为list表格即可
     *
     **/
    handle() {
      this.getTGTInfo();
    },
    getQueryString(name) {
      var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
      var service = window.location.hash.split("?");
      if (service != null && service.length > 1) {
        var r = service[1].match(reg);
        if (r != null) return unescape(r[2]);
      }
      return null;
    },
    showLoading() {
      this.loading = this.$loading({
        lock: true,
        text: `登录中，请稍后。。。`,
        spinner: "el-icon-loading",
      });
      setTimeout(() => {
        this.loading.close();
      }, 3000);
    },
    getIdentifyingCode(bRefresh) {
      this.imageurl =
          baseUrl +
          "/getRandomCode?loginId=" +
          this.Vcode +
          "&i=" +
          Math.random();
    },
    getCPU() {
      var agent = navigator.userAgent.toLowerCase();
      if (agent.indexOf("win64") >= 0 || agent.indexOf("wow64") >= 0)
        return "x64";
      return navigator.cpuClass;
    },
    getOsInfo() {
      let userAgent = window.navigator.userAgent.toLowerCase();
      let version = "";
      if (userAgent.indexOf("win") > -1) {
        if (
            userAgent.indexOf("windows nt 5.0") > -1 ||
            userAgent.indexOf("Windows 2000") > -1
        ) {
          version = "Windows 2000";
        } else if (
            userAgent.indexOf("windows nt 5.1") > -1 ||
            userAgent.indexOf("Windows XP") > -1
        ) {
          version = "Windows XP";
        } else if (
            userAgent.indexOf("windows nt 5.2") > -1 ||
            userAgent.indexOf("Windows 2003") > -1
        ) {
          version = "Windows 2003";
        } else if (
            userAgent.indexOf("windows nt 6.0") > -1 ||
            userAgent.indexOf("Windows Vista") > -1
        ) {
          version = "Windows Vista";
        } else if (
            userAgent.indexOf("windows nt 6.1") > -1 ||
            userAgent.indexOf("windows 7") > -1
        ) {
          version = "Windows 7";
        } else if (
            userAgent.indexOf("windows nt 6.2") > -1 ||
            userAgent.indexOf("windows 8") > -1
        ) {
          version = "Windows 8";
        } else if (userAgent.indexOf("windows nt 6.3") > -1) {
          version = "Windows 8.1";
        } else if (
            userAgent.indexOf("windows nt 6.4") > -1 ||
            userAgent.indexOf("windows nt 10") > -1
        ) {
          version = "Windows 10";
        } else {
          version = "Unknown";
        }
      } else if (userAgent.indexOf("iphone") > -1) {
        version = "Iphone";
      } else if (userAgent.indexOf("mac") > -1) {
        version = "Mac";
      } else if (
          userAgent.indexOf("x11") > -1 ||
          userAgent.indexOf("unix") > -1 ||
          userAgent.indexOf("sunname") > -1 ||
          userAgent.indexOf("bsd") > -1
      ) {
        version = "Unix";
      } else if (userAgent.indexOf("linux") > -1) {
        if (userAgent.indexOf("android") > -1) {
          version = "Android";
        } else {
          version = "Linux";
        }
      } else {
        version = "Unknown";
      }
      return version;
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
    goBack() {
      this.$router.go(-1);
    },
    showImg(type) {
      let imgUrl = ''
      switch (type) {
        case '1':
          imgUrl = !this.userFocus ? 'img/icon/user_icon1.png' : 'img/icon/user_icon2.png'
          break;
        case '2':
          imgUrl = !this.pwdFocus ? 'img/icon/pwd_icon1.png' : 'img/icon/pwd_icon2.png'
          break;
      }
      return imgUrl
    }
  },
};
</script>

<style scoped lang="scss">
.login-fj {
  width: 100%;
  height: 100%;
}

//.login-fj {
//  height: 100%;
//}

.login-wrap {
  width: 100%;
  height: calc(100% - 210px);
  background: url(../../../public/img/bg/bg_icon.png) no-repeat center;
  background-size: 100% 100%;
}

.header {
  width: 70%;
  height: 210px;
  z-index: 1;
  margin: 0 auto;
  position: relative;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  text-align: center;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  .img_icon {
    width: 220px;
    height: 52px;
  }

  .title {
    margin-left: 10px;
    //height: 40px;
    font-size: 30px;
    font-stretch: normal;
    letter-spacing: 3px;
    color: #1B6CFA;
    line-height: 100px;

    height: 100px;
    font-family: Alibaba PuHuiTi 2.0, Alibaba PuHuiTi 2.0-115 Black;
    font-weight: bold;
    text-align: left;

    .el-divider {
      background-color: #fff;
      width: 2px;
      margin: 0px 8px;
    }
  }

  .login {
    float: right;
    font-size: 14px;
    font-weight: normal;
    font-stretch: normal;
    border-radius: 12px;
    border: solid 1px #ffffff;
    line-height: 26px;
    margin-top: 8px;
    padding: 0px 12px;
    letter-spacing: 0px;
    color: #fff;
  }
}

.login_content {
  margin: 0px auto;
  align-items: center;
  display: flex;
  position: relative;
  top: 0; /*偏移*/
  left: calc(90% - 450px);
  //transform: translateY(-50%);
  .image_div {
    width: 705px;
    height: 442px;
    right: 2%;
    text-align: center;
    display: inline-block;
    position: relative;

    .login_img {
      position: absolute;
      // left: -200px;
      // width: 1190px;
      // top: -100px;
      // height: 700px;
      left: -10%;
      width: 156%;
      top: -10%;
      height: 140%;
    }
  }

  .login_spring {
    //box-shadow: 0px 3px 6px 0px rgba(0, 0, 0, 0.05);
    display: inline-block;

    width: 450px;
    height: 373px;
    background: #ffffff;
    border-radius: 8px;
    box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.09);


    .login_title {
      text-align: center;
      margin-top: 24px;

      .c_title {
        display: none;
        font-size: 48px;
        font-weight: normal;
        font-stretch: normal;
        line-height: 48px;
        letter-spacing: 0px;
        color: #999999;
        opacity: 0.11;
      }

      .china_title {
        font-size: 26px;
        font-weight: normal;
        font-stretch: normal;
        line-height: 48px;
        letter-spacing: 0px;
        color: #303032;
        // position: absolute;
        display: inline-block;
        width: 450px;
        text-align: center;
        // margin: 22px 0 0 -196px;
      }
    }

    .elFrom {
      margin-top: 15px;
      width: calc(100% - 110px);
      margin-left: 55px;
      margin-right: 55px;

      :deep(.el-form-item) {
        text-align: center;
        margin-bottom: 0;
      }

      :deep(.el-form-item:first-child) {
      }

      :deep(.el-form-item__error) {
        color: #f56c6c;
        font-size: 12px;
        line-height: 1;
        position: absolute;
        top: 80%;
      }

      .name {
        width: 100%;
        margin-bottom: 10px;
        height: 50px;
      }

      .pwd {
        width: 100%;
        margin-bottom: 10px;
        height: 50px;
      }

      :deep(input:-webkit-autofill) {
        box-shadow: 0 0 0 1000px #fff inset;
      }

      .divIdentifyingCode {
        position: absolute;
        top: 16px;
        right: 43px;
        z-index: 5;
        width: 102px;
        height: 50px;
        text-align: center;
        margin: 0;
      }

      .submit {
        width: 100%;
        height: 50px;
        color: white;
        background: #1B6CFA;
        border: none;
        border-radius: 4px;
        font-size: 14px;
        margin-top: 14px;
        cursor: pointer;
        margin-left: 0px !important;
        margin-right: 0 !important;
      }
    }

    .loginInfo {
      margin: 0 24px 20px 24px;
      color: #aaa;
      font-size: 16px;
      text-align: center;

      a {
        padding: 0 10px;
        color: #0396ff;
        cursor: pointer;
      }
    }
  }

  .prefix_box {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    width: 40px;
  }
}

.copyright {
  position: absolute;
  bottom: 50px;
  width: 100%;
  text-align: center;
  font-size: 12px;
  font-weight: normal;
  font-stretch: normal;
  line-height: 17px;
  letter-spacing: 0px;
  color: #ffffff;
}
</style>
