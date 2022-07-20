<template>
  <div id="app">
    <el-config-provider :locale="locale">
      <router-view/>
    </el-config-provider>
  </div>
</template>
<script>
import {ElConfigProvider} from 'element-plus'
import zhCn from 'element-plus/lib/locale/lang/zh-cn'

export default {
  components: {
    ElConfigProvider
  },
  name: 'app',
  data() {
    return {
      locale: zhCn
    }
  },
  watch: {
    $i18n: {
      handler(newName, oldName) {
        if (newName && newName.locale && newName.messages && newName.messages[newName.locale]) {
          this.locale = newName.messages[newName.locale].el
        }
      },
      deep: true,
      immediate: true
    },
  },
  created() {
  },
  methods: {},
  computed: {}
}
</script>
<style lang="scss">
#app {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
</style>
