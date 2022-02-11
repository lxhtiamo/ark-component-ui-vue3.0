<template>
  <div class="avue-contail" :class="{'avue--collapse':isCollapse}">
    <div class="avue-header">
      <top :titleList="titleList"/>
    </div>
    <div class="avue-layout">
      <div class="avue-left">
        <sidebar/>
      </div>
      <div class="avue-main">
        <div class="avue-main-div">
          <tags @changeTitle="changeTitle" />
          <el-scrollbar style="height: 100%">
            <keep-alive>
              <router-view class="avue-view" v-if="$route.meta.$keepAlive" />
            </keep-alive>
            <router-view class="avue-view" v-if="!$route.meta.$keepAlive" />
          </el-scrollbar>
        </div>
      </div>
    </div>

    <div class="avue-shade" @click="showCollapse"></div>
  </div>
</template>

<script>
import sidebar from "./sidebar/";
import top from "./top/";
import {mapGetters} from 'vuex'
import tags from './tags'
import admin from '@/util/admin';
import {validatenull} from '@/util/validate';
import {calcDate} from '@/util/date.js';
import {getStore, removeStore} from '@/util/store.js';
import {getAppInfoByAppCode} from "@/api/user";

export default {
  components: {
    tags, top, sidebar
  },
  name: 'index',
  data() {
    return {
      aboutSysDialog: false,
      //刷新token锁
      refreshLock: false,
      //刷新token的时间
      refreshTime: '',
      titleList: [],
      localTheme: 'irThemeDefault',
      config: {
        propsDefault: {
          label: 'label',
          path: 'path',
          icon: 'icon',
          children: 'children'
        }
      },
      isIframe: window.hideTheme,
      themeObj: [],
      themeOption: {
        name: 'themeName',
        className: 'themeCode'
      }
    }
  },
  created() {
    this.$store.dispatch("GetMenu").then(data => {
      let errorRouter = [
        {
          path: "*",
          name: 'not-found',
          redirect: "/404"
        }
      ];
      let l = this.$router.resolve({name: "not-found"});
      if (l.resolved.matched.length <= 0) {
        console.log("the not-found route does not exists")
        //the route does not exists.
        this.$router.addRoutes(errorRouter);
        console.log(this.$router);
      }
      if (data.length !== 0) {
        this.$router.$avueRouter.formatRoutes(data, true);
        const routeHash = getStore({name: "routeHash"});
        if (routeHash) {
          removeStore({name: "routeHash"});
          this.$router.push({path: routeHash});
        }
      }
    });
    this.getAppInfoByAppCode();
    this.getTheme();
  },
  mounted() {
    this.init();
  },
  computed: {
    ...mapGetters(['isLock', 'isCollapse', 'website', 'menu', 'tagCurrent', "screen", "userInfo"]),
    labelKey() {
      return this.website.menu.props.label || this.config.propsDefault.label
    },
    pathKey() {
      return this.website.menu.props.path || this.config.propsDefault.path
    },
    iconKey() {
      return this.website.menu.props.icon || this.config.propsDefault.icon
    },
    nowTagValue: function () {
      return this.$router.$avueRouter.getValue(this.$route);
    }
  },
  props: [],
  methods: {
    getAppInfoByAppCode() {
      getAppInfoByAppCode().then(res => {
        this.website.indexTitle = res.data.data.name;
        this.website.title = res.data.data.name;
        this.$store.commit("SET_WEBSITE", this.website);
        document.title = this.website.title;
      })
    },
    openMenu(item) {
      if (this.screen <= 1) this.$store.commit("SET_COLLAPSE");
      this.$router.$avueRouter.group = item.group;
      this.$router.push({
        path: this.$router.$avueRouter.getPath({
          name: item[this.labelKey],
          src: item[this.pathKey]
        }),
        query: item.query
      })

    },
    getTheme() {
      let obj = JSON.parse(localStorage.getItem('local_theme'));
      if (obj) {
        this.loclTheme = obj.name;
      }
    },
    changeTheme(obj) {
      localStorage.setItem('local_theme', JSON.stringify(obj));
      this.getTheme();
    },
    changeTitle(data) {
      console.info("title:", data);
      if (!data) {
        return;
      }
      this.titleList = data;
      console.info("当前位置：", this.titleList);
    },
    getBreadcrumbPath(item) {
      if (item.type == 1) {
        return '';
      } else {
        return {path: item.path};
      }
    },
    showCollapse() {
      this.$store.commit("SET_COLLAPSE");
    },
    // 屏幕检测
    init() {
      this.$store.commit('SET_SCREEN', admin.getScreen());
      window.onresize = () => {
        setTimeout(() => {
          this.$store.commit('SET_SCREEN', admin.getScreen());
        }, 0);
      }
    },
    // 实时检测刷新token
    refreshToken() {
      this.refreshTime = setInterval(() => {
        const token = getStore({
          name: 'token',
          debug: true,
        });
        const date = calcDate(token.datetime, new Date().getTime());
        if (validatenull(date)) return;
        if (!(date.seconds >= this.website.tokenTime) && !this.refreshLock) {
          this.refreshLock = true;
          this.$store
              .dispatch('RefreshToken')
              .then(() => {
                clearInterval(this.refreshTime);
              })
              .catch(() => {
                this.refreshLock = false;
              });
        }
      }, 3000);
    },
  }
}
</script>
<style lang="scss" scoped>
.personInfoWrap {
  width: 150px;
  padding: 0 10px;

  .personInfoitem {
    width: 100%;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
}
</style>

<style lang="scss">
.indexDialogHeight {
  height: 50%;

  .el-tabs__header.is-top {
    margin-bottom: 0;
  }

  .el-tabs__content .el-form {
    margin-top: 15px;
  }
}
</style>
