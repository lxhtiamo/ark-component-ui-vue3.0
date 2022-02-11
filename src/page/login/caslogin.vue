<template>
  <div class="social-container">
    <div class="box"
         @click="handleClick">
      <span class="container"
            :style="{backgroundColor:'#6ba2d6'}">
        <i icon-class="wechat"
           class="iconfont icon-weixin"></i>
      </span>
      <p class="title">CAS</p>
    </div>
  </div>
</template>

<script>
import { openWindow,getRedirectUri } from '@/util/util'
import {casUrl} from '@/config/env';
export default {
  name: 'casLogin',
  methods: {
    handleClick () {
        let redirect_uri = getRedirectUri(window.location);
        let url = casUrl + '/login?service=' + redirect_uri;
        openWindow(url, 'cas');
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.social-container {
  margin: 20px 0;
  display: flex;
  align-items: center;
  justify-content: space-around;
  .box {
    cursor: pointer;
  }
  .iconfont {
    color: #fff;
    font-size: 30px;
  }
  .container {
    $height: 50px;
    display: inline-block;
    width: $height;
    height: $height;
    line-height: $height;
    text-align: center;
    border-radius: 4px;
    margin-bottom: 10px;
  }
  .title {
    text-align: center;
  }
}
</style>
