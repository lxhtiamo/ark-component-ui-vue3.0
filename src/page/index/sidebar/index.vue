<template>
  <div class="avue-sidebar">
    <logo></logo>
    <el-scrollbar style="height:100%">
      <el-menu
          text-color="#2a3840"
          unique-opened
          :default-active="nowTagValue"
          mode="vertical"
          :show-timeout="200"
          :collapse="keyCollapse">
        <sidebar-item
            :menu="menu"
            first
            :screen="screen"
            :props="website.menu.props"
            :collapse="keyCollapse"
        ></sidebar-item>
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import logo from "../logo";
import sidebarItem from "./sidebarItem";
import { getStore, removeStore } from "@/util/store.js";
export default {
  name: "sidebar",
  components: { sidebarItem, logo },
  data() {
    return {};
  },
  created() {},
  computed: {
    ...mapGetters(["website", "menu", "tag", "keyCollapse", "screen"]),
    nowTagValue: function() {
      return this.$router.$avueRouter.getValue(this.$route);
    }
  },
  mounted() {},
  methods: {}
};
</script>
<style lang="scss" scoped>
</style>

