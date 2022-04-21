<!--头部-->
<template>
  <div style="border-bottom: 1px solid #f0f1f4">
    <div class="topParent">
      <div style="float: left;padding-left: 12px;font-size: 20px;width: 60%;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;display: flex;align-items: center">
        <div style="display: flex;align-items: center" v-if="showBack">
          <i class="el-icon-back backIcon" @click="back"></i>
          <div style="margin-left: 5px;margin-right: 5px;display: flex;align-items: center">
              <el-divider direction="vertical"></el-divider>
          </div>
        </div>
        <span v-if="title">{{ title }}</span>
      </div><!--左边插槽-->
      <div style="float: right;padding-right: 24px">
        <slot name="right"></slot>
      </div><!--右边左边插槽-->
    </div>
    <div>
      <slot name="bottom"></slot><!--下面插槽-->
    </div>
  </div>
</template>

<script>
export default {
  name: "publicSubTop",
  components: {},
  props: ['title', 'pageType'],
  data() {
    return {
      showBack: false,
    }
  },
  computed: {},
  watch: {
    pageType: {
      handler(newVal) {
        if (newVal && newVal == '1') { //页面标识是1时候不显示返回的箭头
          this.showBack = false
        } else if (newVal && newVal != '1') {
          this.showBack = true
        } else {
          this.showBack = false
        }

      },
      deep: true,
      immediate: true
    }
  },
  created() {
  },
  mounted() {
  },

  methods: {
    back() {
      this.$emit('goBack')
    },
  },
}
</script>

<style lang="scss" scoped>

.backIcon {
  padding-left: 5px;
  padding-right: 5px;
  cursor: pointer;
}

.backIcon:hover {
  color: #40a9ff;
}
</style>
