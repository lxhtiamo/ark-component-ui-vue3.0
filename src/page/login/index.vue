<template>
  <div class="login-container pull-height">
    <div class="login-logo animated fadeIn">
    </div>
    <div class="login-weaper">
      <div class="login-border  animated fadeInRight">
        <div class="login-main">
<!--          <h4 class="login-title">{{website.title}}</h4>-->
          <authredirect ref="loginForm"></authredirect>
        </div>
<!--        <div class="login-menu">-->
<!--          <el-button type="primary"-->
<!--                     size="small"-->
<!--                     @click.native.prevent="handleCasLogin"-->
<!--                     class="login-submit">登录-->
<!--          </el-button>-->
<!--        </div>-->
      </div>
    </div>
  </div>
</template>
<script>
    import color from "@/mixins/color";
    import { mapGetters } from "vuex";
    import authredirect from "./authredirect";
    export default {
        name: "login",
        mixins: [color()],
        components: {
            authredirect,
        },
        data () {
            return {
                activeName: "cas"
            };
        },
        watch: {},
        created () {},
        mounted () {},
        computed: {
            ...mapGetters(["website"])
        },
        props: [],
        methods: {
            handleCasLogin() {
                let url = window.location.href.split('?ticket')[0];
                location.replace(url);
            }
        }
    };
</script>

<style lang="scss">
  .login-container {
    position: relative;
    width: 100%;
    margin: 0 auto;
  }
  .login-weaper {
    position: absolute;
    top: 50%;
    left: 0;
    width: 100%;
    height: 500px;
    margin-top: -200px;
    text-align: center;
  }
  .login-container::before {
    z-index: -1024;
    content: "";
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-image: url("../../../public/img/login.png");
    background-size: cover;
  }
  .login-left {
    float: left;
    width: 50%;
    position: relative;
  }
  .login-logo {
    position: absolute;
    top: 0;
    left: 0;
    padding-top: 50px;
    font-size: 24px;
    color: #333;
  }
  .login-info {
    padding-left: 140px;
  }
  .login-info-title {
    line-height: 90px;
    color: rgb(52, 58, 64);
  }
  .login-info-item {
    font-size: 14px;
    line-height: 2.5;
    color: rgb(33, 37, 41);
  }
  .login-border {
    width: 50%;
    box-sizing: border-box;
    display: inline-block;
  }
  .login-main {
    margin: 0 auto;
    width: 100%;
    box-sizing: border-box;
  }
  .login-main > h3 {
    margin-bottom: 20px;
  }
  .login-main > p {
    color: #76838f;
  }
  .login-title {
    margin-bottom: 40px;
    font-weight: 500;
    font-size: 22px;
    text-align: center;
    letter-spacing: 4px;
  }
  .login-menu {
    width: 100%;
    text-align: center;
    a {
      color: rgb(153, 153, 153);
      font-size: 12px;
      margin: 0px 8px;
    }
  }
  .login-submit {
    display: block !important;
    margin: 40px auto 10px auto !important;
    width: 200px;
    height: 48px;
    font-size: 14px !important;
    text-align: center;
    border-radius: 50px !important;
    border: 0px;
    box-shadow: rgba(152, 22, 244, 0.19) 0px 5px 10px 2px;
  }

</style>