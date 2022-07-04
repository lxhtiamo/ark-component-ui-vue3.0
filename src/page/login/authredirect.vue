<template>
  <div></div>
</template>

<script>
import {mapGetters} from "vuex";
import {baseUrl, casLoginType, casUrl} from '@/config/env';
import {getRedirectUri} from '@/util/util';
import {getIdaasAppCode} from "../../api/user";
import {getStore} from "../../util/store";

export default {
  name: 'authredirect',
  created() {
    this.handleCasLogin();
  },
  computed: {
    ...mapGetters(["tagWel", "website"])
  },
  data() {
    return {
      loading: {},
    };
  },
  methods: {
    handleCasLogin() {
      this.showLoading();
      this.doCasLogin();
    },
    doCasLogin() {
      let vars = {};
      let title = this.website.title;
      window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value) {
        value = value.split('#')[0];
        vars[key] = value;
      });
      if (vars['code'] == null && vars['ticket'] == null) {
        let redirect_uri = getRedirectUri(window.location);
        if (casLoginType == 'portalwork') {
          let url = casUrl + "/login?sysName=" + encodeURIComponent(title) + "&service=" + redirect_uri;
          location.replace(url);
        } else {
          getIdaasAppCode().then((res) => {
            let url = casUrl + '/oauth/authorize?redirect_uri=' + redirect_uri + '&client_id=' + res.data.data + '&response_type=code&scope=all';
            location.replace(url);
          });
        }
        return;
      }
      let redirect_uri = getRedirectUri(window.location);
      let url;
      if (vars['ticket']) {
        url = '/loginByCas?ticket=' + vars['ticket'] + '&service=' + redirect_uri;
      } else if (vars['code']) {
        url = '/loginByCode?code=' + vars['code'] + '&service=' + redirect_uri;
      }
      this.$store.dispatch("LoginByCAS", url).then(() => {
        window.location.href = decodeURIComponent(redirect_uri);
      }).catch(err => {
        this.loading.close();
        if (err && err.status && err.status == 406 && err.data) {
          let errStr = err.data.msg ? err.data.msg : '您的账号没有权限登入系统!';
          this.$alert(errStr, '温馨提示', {
            confirmButtonText: '确定',
            callback: () => {
              // 退出
              let url = '';
              if (casLoginType === 'portalwork') {
                url = casUrl + "/logout?userUnid=" + err.data.data + "&service=" + redirect_uri;
              } else {
                let extras = getStore({name: 'extras'});
                url = casUrl + "/logout?redirect_uri=" + redirect_uri + "&app_id=" + extras.appId + "&access_token=" + extras.accessToken;
              }
              location.replace(url);
            }
          });
        }
      });
    },
    showLoading() {
      this.loading = this.$loading({
        lock: true,
        text: `${this.website.title}登录中，请稍后。。。`,
        spinner: 'Loading'
      })
      setTimeout(() => {
        this.loading.close()
      }, 3000);
    }
  }
}
</script>


<style>
</style>
