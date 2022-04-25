<template>
  <div style="text-align: center">
    <div style="line-height:15px;margin-top: 20px">
      <img :height="height" :src="emptyUrl" :width="width">
    </div>
    <div style="line-height:15px;margin-bottom: 20px;margin-top: 10px">
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
      emptyUrl: 'img/bg/empty_bg.png',
      emptyStr: this.emptyContent,
    }
  }
}
</script>

