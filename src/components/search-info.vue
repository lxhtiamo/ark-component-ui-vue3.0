<template>
  <div class="search-div-style">
    <div class="search-first">
      <slot name="left"></slot>
    </div>
    <div class="search-second">
      <slot></slot>
    </div>
    <div v-if="!$slots.buttons" style="display: flex;align-items: center">
      <el-button type="primary" @click="handleSearch" size="default">查询</el-button>
      <el-button @click="handleReset" size="default">重置</el-button>
    </div>
    <div v-if="$slots.buttons">
      <slot name="buttons"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "searchInfo",
  methods: {
    handleSearch() {
      this.$emit('search')
    },
    handleReset() {
      this.$emit('reset')
    }
  }
}
</script>

<style lang="scss" scoped>
.search-div-style {
  width: 100%;
  display: flex;
  align-items: center;

  .search-first {
    display: flex;
    width: auto;
  }

  .search-second {
    display: flex;
    justify-content: right;
  }

  :deep(.el-input) {
    width: 180px;
    margin-right: 10px;
    position: relative;
  }
}
</style>