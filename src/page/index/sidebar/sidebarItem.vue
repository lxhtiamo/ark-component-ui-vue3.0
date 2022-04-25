<template>
  <div class="menu-wrapper">
    <template v-for="item in menu">
      <el-menu-item v-if="validatenull(item[childrenKey]) && vaildRoles(item)"
                    :key="item[labelKey]"
                    :class="{'is-active':vaildAvtive(item)}"
                    :index="item[pathKey]"
                    @click="open(item)">
        <i :class="item[iconKey]"></i>
        <img v-if="item[iconKey]" :src="item[iconKey]" alt="" class="icon">
        <img v-if="item[iconKey]" :src="dynamicIcon(item[iconKey])" alt="" class="icon_sel">
        <template v-slot:title>
          <span>{{ item[labelKey] }}</span>
        </template>
      </el-menu-item>
      <el-sub-menu v-else-if="!validatenull(item[childrenKey])&&vaildRoles(item)"
                   :key="item[labelKey]"
                   :index="item[pathKey]">
        <template v-slot:title>
          <i :class="item[iconKey]"></i>
          <img v-if="item[iconKey]" :src="item[iconKey]" alt="" class="icon">
          <img v-if="item[iconKey]" :src="dynamicIcon(item[iconKey])" alt="" class="icon_sel">
          <span :class="{'el-menu--display':collapse&&first}">{{ item[labelKey] }}</span>
        </template>
        <template v-for="(child,cindex) in item[childrenKey]">
          <el-menu-item v-if="validatenull(child[childrenKey])"
                        :key="child[labelKey]"
                        :class="{'is-active':vaildAvtive(child)}"
                        :index="child[pathKey]"
                        @click="open(child)">
            <i :class="child[iconKey]"></i>
            <img v-if="child[iconKey]" :src="child[iconKey]" alt="">
            <template v-slot:title>
              <span>{{ child[labelKey] }}</span>
            </template>
          </el-menu-item>
          <sidebar-item v-else
                        :key="cindex"
                        :collapse="collapse"
                        :menu="[child]"
                        :props="props"
                        :screen="screen"></sidebar-item>
        </template>
      </el-sub-menu>
    </template>
  </div>
</template>
<script>
import {mapGetters} from 'vuex'
import {validatenull} from '@/util/validate';
import config from './config.js'

let toRouter;
let fromRouter;
export default {
  name: 'sidebarItem',
  data() {
    return {
      config: config
    }
  },
  props: {
    menu: {
      type: Array
    },
    screen: {
      type: Number
    },
    first: {
      type: Boolean,
      default: false
    },
    props: {
      type: Object,
      default: () => {
        return {}
      }
    },
    collapse: {
      type: Boolean
    }
  },
  created() {
  },
  mounted() {

  },
  watch: {
    // 利用watch方法检测路由变化：
    $route: {
      handler: function (val, oldVal) {
        toRouter = val;
        if (this.isInMenu(oldVal)) {
          fromRouter = oldVal;
        }
      },
      // 深度观察监听
      deep: true
    }
  },
  computed: {
    ...mapGetters(['roles']),
    labelKey() {
      return this.props.label || this.config.propsDefault.label
    },
    pathKey() {
      return this.props.path || this.config.propsDefault.path
    },
    iconKey() {
      console.info(this.props.icon || this.config.propsDefault.icon);
      return this.props.icon || this.config.propsDefault.icon
    },
    dynamicIcon() {
      return function (path) {
        let index = path.lastIndexOf(".");
        path = path.slice(0, index) + "_1" + path.slice(index);
        console.info(path);
        return path;
      }
    },
    childrenKey() {
      return this.props.children || this.config.propsDefault.children
    },
    nowTagValue() {
      return this.$router.$avueRouter.getValue(this.$route)
    }
  },
  methods: {
    // 指定路由检验是否在菜单中存在
    isInMenu(router) {
      let result = 0;
      this.menu.forEach(obj => {
        result += this.checkMenu(obj, router) ? 0 : 1;
      });
      return result == 0 ? false : true;
    },
    checkMenu(obj, router) {
      if (!router || obj.path == router.path) {
        return false;
      } else {
        let result = 0;
        obj.children.forEach(obj => {
          result += this.checkMenu(obj, router) ? 0 : 1;
        });
        return result == 0 ? true : false;
      }
    },
    vaildAvtive(item) {
      let customize = false;
      if (fromRouter && !this.isInMenu(toRouter) && fromRouter.path == item[this.pathKey]) {
        //customize = true;//这个有问题会导致点击的效果出现双重效果
      }
      const groupFlag = (item['group'] || []).some(ele => this.$route.path.includes(ele));
      return this.nowTagValue === item[this.pathKey] || groupFlag || customize;
    },
    vaildRoles(item) {
      item.meta = item.meta || {};
      return item.meta.roles ? item.meta.roles.includes(this.roles) : true
    },
    validatenull(val) {
      return validatenull(val);
    },
    open(item) {
      if (this.screen <= 1) this.$store.commit("SET_COLLAPSE");
      this.$router.$avueRouter.group = item.group;
      this.$router.push({
        path: this.$router.$avueRouter.getPath({
          name: item[this.labelKey],
          src: item[this.pathKey]
        }),
        query: item.query
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.menu-wrapper {

  img {
    width: 16px;
    height: 16px;
    margin-right: 5px;
  }

}
</style>
