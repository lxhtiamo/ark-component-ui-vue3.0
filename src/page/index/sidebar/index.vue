<template>
  <div class="avue-sidebar">
    <logo></logo>
    <el-scrollbar style="height:100%">
      <el-menu
          :collapse="keyCollapse"
          :default-active="nowTagValue"
          :show-timeout="200"
          mode="vertical"
          text-color="#2a3840"
          unique-opened>
        <sidebar-item
            :collapse="keyCollapse"
            :menu="menu"
            :props="website.menu.props"
            :screen="screen"
            first
        ></sidebar-item>
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import {mapGetters} from "vuex";
import logo from "../logo";
import sidebarItem from "./sidebarItem";

export default {
  name: "sidebar",
  components: {sidebarItem, logo},
  data() {
    return {};
  },
  created() {
  },
  computed: {
    ...mapGetters(["website", "menu", "tag", "keyCollapse", "screen"]),
    nowTagValue: function () {
      return this.$router.$avueRouter.getValue(this.$route);
    }
  },
  mounted() {
  },
  methods: {}
};
</script>
<style lang="scss" scoped>
</style>

