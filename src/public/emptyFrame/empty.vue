<template>
  <div class="empty-box">
    <div style="line-height:15px;margin-top: 20px">
      <img :src="emptyUrl" alt="" style="width: 100px;height: 80px">
    </div>
    <div style="line-height:15px;margin-bottom: 20px;">
      <span style="font-size: 10px;color: #999999">{{ emptyStr }}</span>
    </div>


  </div>

</template>
<script>
export default {
  props: {
    width: {
      default: '100px',
    },
    height: {
      default: '80px',
    },
    emptyContent: {
      type: String,
      default: '暂无数据'
    }
  },
  data() {
    return {
      emptyUrl: 'img/bg/empty.png',
      emptyStr: this.emptyContent,
    }
  }
}
</script>

<style lang="scss" scoped>
.empty-box {
  display: flex;
  width: 100%;
  overflow: hidden;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

.empty-text {
  font-size: 16px;
  color: #999999;
}
</style>