<template>
    <div></div>
</template>

<script>
    import {mapGetters} from "vuex";
    import {baseUrl, casLoginType, casUrl} from '@/config/env';
    import {getRedirectUri} from '@/util/util';
    import {getIdaasAppCode} from "@/api/user";
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
                loading:{},
            };
        },
        methods: {
            handleCasLogin() {
                this.showLoading();
                this.doCasLogin();
            },
            doCasLogin() {
                let vars = {};
                window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value) {
                    value = value.split('#')[0];
                    vars[key] = value;
                });
                if (vars['code'] == null && vars['ticket'] == null) {
                    let redirect_uri = getRedirectUri(window.location);
                    if (casLoginType == 'portalwork') {
                        let url = casUrl + '/login?service=' + redirect_uri;
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
                    url = baseUrl + '/loginByCas?ticket=' + vars['ticket'] + '&service=' + redirect_uri;
                } else if (vars['code']) {
                    url = baseUrl + '/loginByCode?code=' + vars['code'] + '&service=' + redirect_uri;
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
                                window.close()
                            }
                        });
                    }
                });
            },
            showLoading() {
                this.loading = this.$loading({
                    lock: true,
                    text: `${this.website.title}登录中，请稍后。。。`,
                    spinner: 'el-icon-loading'
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
